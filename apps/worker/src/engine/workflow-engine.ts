import {
  AgentDecisionStatus,
  AgentRole,
  ComplexityLevel,
  RequiredApproval,
  RiskLevel,
  WorkflowEventType,
  WorkflowRunStatus,
  type Demand,
  type WorkflowRun,
  prisma,
} from "@gelocci/studio-database";
import { getAgent } from "@gelocci/studio-agents";
import {
  defaultAutoFlowPolicy,
  shouldPauseForApproval,
  type AgentExecutionSnapshot,
  type AgentOutput,
  type WorkflowJobData,
} from "@gelocci/studio-workflow";

export async function executeWorkflowJob(jobData: WorkflowJobData): Promise<void> {
  const workflowRun = await prisma.workflowRun.findUnique({
    where: {
      id: jobData.workflowRunId,
    },
    include: {
      demand: true,
      agentExecutions: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!workflowRun || !workflowRun.demand) {
    throw new Error(`WorkflowRun inválido ou sem demanda: ${jobData.workflowRunId}`);
  }

  await updateWorkflowStatus(workflowRun.id, "AGENTS_RUNNING", "WORKFLOW_STARTED", "Workflow iniciado pelo worker.", jobData);

  const demand = workflowRun.demand;
  const policy = defaultAutoFlowPolicy(workflowRun.autoFlowMode ?? "OFF");

  const previousExecutions: AgentExecutionSnapshot[] = [];

  const classifierOutput = await runAgent("classificador-demandas", workflowRun, demand, previousExecutions, jobData);

  if (shouldPauseForApproval(classifierOutput, policy)) {
    await pauseForApproval(workflowRun.id, demand.id, "classificador-demandas", classifierOutput);
    return;
  }

  previousExecutions.push(snapshotFromOutput("classificador-demandas", "Classificador de Demandas", "CLASSIFIER", classifierOutput));

  const nextAgents = classifierOutput.nextAgents.filter((agentKey) => agentKey !== "classificador-demandas");

  for (const agentKey of nextAgents) {
    const output = await runAgent(agentKey, workflowRun, demand, previousExecutions, jobData);
    previousExecutions.push(snapshotFromOutput(agentKey, agentKey, "EXECUTOR", output));

    if (shouldPauseForApproval(output, policy)) {
      await pauseForApproval(workflowRun.id, demand.id, agentKey, output);
      return;
    }
  }

  await updateWorkflowStatus(workflowRun.id, "APPROVED", "WORKFLOW_FINISHED", "Workflow concluído pelo worker.", {
    demandId: demand.id,
    workflowRunId: workflowRun.id,
  });

  await prisma.demand.update({
    where: {
      id: demand.id,
    },
    data: {
      status: "DONE",
    },
  });
}

async function runAgent(
  agentKey: string,
  workflowRun: WorkflowRun,
  demand: Demand,
  previousExecutions: AgentExecutionSnapshot[],
  jobData: WorkflowJobData,
): Promise<AgentOutput> {
  const agent = getAgent(agentKey);

  const execution = await prisma.agentExecution.create({
    data: {
      workflowRunId: workflowRun.id,
      demandId: demand.id,
      agentKey: agent.key,
      agentName: agent.name,
      agentRole: agent.role as AgentRole,
      status: "RUNNING",
      startedAt: new Date(),
      input: JSON.parse(JSON.stringify({
        demandId: demand.id,
        workflowRunId: workflowRun.id,
        previousExecutions: previousExecutions.map((item) => item.agentKey),
        requestedBy: jobData.requestedBy,
      })),
    },
  });

  await createEvent(workflowRun.id, "AGENT_STARTED", `${agent.name} iniciou execução.`, {
    agentKey: agent.key,
    executionId: execution.id,
  });

  try {
    const output = await agent.run({
      demand: {
        id: demand.id,
        title: demand.title,
        description: demand.description,
        project: demand.project,
        origin: demand.origin,
        priority: demand.priority,
        status: demand.status,
        metadata: demand.metadata,
      },
      workflow: {
        id: workflowRun.id,
        demandId: workflowRun.demandId,
        project: workflowRun.project,
        title: workflowRun.title,
        status: workflowRun.status,
        autoFlowMode: workflowRun.autoFlowMode,
      },
      previousExecutions,
      policy: defaultAutoFlowPolicy(workflowRun.autoFlowMode ?? "OFF"),
      context: {
        project: demand.project,
        source: "worker",
        correlationId: workflowRun.id,
      },
    });

    await prisma.agentExecution.update({
      where: {
        id: execution.id,
      },
      data: {
        status: "DONE",
        output: JSON.parse(JSON.stringify(output)),
        decision: output.status as AgentDecisionStatus,
        risk: output.risk as RiskLevel,
        complexity: output.complexity as ComplexityLevel,
        requiredApproval: output.requiredApproval as RequiredApproval,
        summary: output.summary,
        finishedAt: new Date(),
      },
    });

    await createEvent(workflowRun.id, "AGENT_FINISHED", `${agent.name} concluiu execução.`, {
      agentKey: agent.key,
      executionId: execution.id,
      decision: output.status,
      risk: output.risk,
      complexity: output.complexity,
      requiredApproval: output.requiredApproval,
    });

    await updateVisualPayload(workflowRun.id);

    return output;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido no agente.";

    await prisma.agentExecution.update({
      where: {
        id: execution.id,
      },
      data: {
        status: "FAILED",
        error: message,
        finishedAt: new Date(),
      },
    });

    await createEvent(workflowRun.id, "AGENT_FAILED", `${agent.name} falhou.`, {
      agentKey: agent.key,
      executionId: execution.id,
      error: message,
    });

    throw error;
  }
}

async function pauseForApproval(workflowRunId: string, demandId: string, agentKey: string, output: AgentOutput): Promise<void> {
  await prisma.workflowApproval.create({
    data: {
      workflowRunId,
      demandId,
      requestedByAgent: agentKey,
      requiredApprover: output.requiredApproval as RequiredApproval,
      reason: output.decision,
      payload: JSON.parse(JSON.stringify(output)),
    },
  });

  await updateWorkflowStatus(workflowRunId, "WAITING_APPROVAL", "APPROVAL_REQUIRED", "Workflow pausado aguardando aprovação.", {
    demandId,
    agentKey,
    requiredApproval: output.requiredApproval,
    reason: output.decision,
  });

  await prisma.demand.update({
    where: {
      id: demandId,
    },
    data: {
      status: "WAITING_APPROVAL",
    },
  });
}

async function updateWorkflowStatus(
  workflowRunId: string,
  status: WorkflowRunStatus,
  eventType: WorkflowEventType,
  message: string,
  payload: unknown,
): Promise<void> {
  await prisma.workflowRun.update({
    where: {
      id: workflowRunId,
    },
    data: {
      status,
      startedAt: status === "AGENTS_RUNNING" ? new Date() : undefined,
      finishedAt: ["APPROVED", "CLOSED", "FAILED"].includes(status) ? new Date() : undefined,
    },
  });

  await createEvent(workflowRunId, eventType, message, payload);
}

async function createEvent(workflowRunId: string, type: WorkflowEventType, message: string, payload: unknown): Promise<void> {
  await prisma.workflowEvent.create({
    data: {
      workflowRunId,
      type,
      message,
      payload: JSON.parse(JSON.stringify(payload)),
    },
  });
}

async function updateVisualPayload(workflowRunId: string): Promise<void> {
  const workflow = await prisma.workflowRun.findUnique({
    where: {
      id: workflowRunId,
    },
    include: {
      agentExecutions: {
        orderBy: {
          createdAt: "asc",
        },
      },
      events: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!workflow) {
    return;
  }

  const currentPayload = typeof workflow.payload === "object" && workflow.payload !== null ? workflow.payload : {};

  await prisma.workflowRun.update({
    where: {
      id: workflowRunId,
    },
    data: {
      payload: JSON.parse(JSON.stringify({
        ...currentPayload,
        runtime: {
          executions: workflow.agentExecutions.map((execution) => ({
            id: execution.id,
            agentKey: execution.agentKey,
            agentName: execution.agentName,
            agentRole: execution.agentRole,
            status: execution.status,
            decision: execution.decision,
            risk: execution.risk,
            complexity: execution.complexity,
            requiredApproval: execution.requiredApproval,
            summary: execution.summary,
            startedAt: execution.startedAt,
            finishedAt: execution.finishedAt,
          })),
          events: workflow.events.map((event) => ({
            id: event.id,
            type: event.type,
            message: event.message,
            createdAt: event.createdAt,
          })),
        },
      })),
    },
  });
}

function snapshotFromOutput(agentKey: string, agentName: string, agentRole: AgentRole, output: AgentOutput): AgentExecutionSnapshot {
  return {
    agentKey,
    agentName,
    agentRole,
    status: "DONE",
    output,
  };
}

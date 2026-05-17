import type { AutoFlowMode, Demand, WorkflowRun } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { publishStudioEvent } from "../events/studio-events.js";
import { buildDemandWorkflowPayload } from "./demand-workflow-service.js";

export interface AutoFlowSettings {
  autoFlowMode: AutoFlowMode;
}

interface AutoFlowDecision {
  shouldCreateWorkflow: boolean;
  demandStatus: Demand["status"];
  workflowStatus: WorkflowRun["status"];
  reason: string;
}

export async function getAutoFlowSettings(): Promise<AutoFlowSettings> {
  const settings = await prisma.studioSetting.upsert({
    where: {
      id: "global",
    },
    update: {},
    create: {
      id: "global",
      autoFlowMode: "OFF",
    },
  });

  return {
    autoFlowMode: settings.autoFlowMode,
  };
}

export async function updateAutoFlowSettings(autoFlowMode: AutoFlowMode): Promise<AutoFlowSettings> {
  const settings = await prisma.studioSetting.upsert({
    where: {
      id: "global",
    },
    update: {
      autoFlowMode,
    },
    create: {
      id: "global",
      autoFlowMode,
    },
  });

  publishStudioEvent("AUTOFLOW_UPDATED", {
    autoFlowMode: settings.autoFlowMode,
  });

  return {
    autoFlowMode: settings.autoFlowMode,
  };
}

export async function applyAutoFlowToDemand(demand: Demand): Promise<WorkflowRun | null> {
  const { autoFlowMode } = await getAutoFlowSettings();
  const decision = decideAutoFlow(autoFlowMode, demand);

  if (!decision.shouldCreateWorkflow) {
    return null;
  }

  return createWorkflowForDemand(demand, {
    status: decision.workflowStatus,
    demandStatus: decision.demandStatus,
    autoFlowMode,
    reason: decision.reason,
  });
}

export async function createWorkflowForDemand(
  demand: Demand,
  options?: {
    status?: WorkflowRun["status"];
    demandStatus?: Demand["status"];
    autoFlowMode?: AutoFlowMode;
    reason?: string;
  },
): Promise<WorkflowRun> {
  const existing = await prisma.workflowRun.findFirst({
    where: {
      demandId: demand.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existing) {
    return existing;
  }

  const payload = buildDemandWorkflowPayload(demand);

  const payloadWithAutoFlow = {
    ...payload,
    autoFlow: {
      mode: options?.autoFlowMode ?? "OFF",
      reason: options?.reason ?? "Workflow criado por ação explícita.",
    },
  };

  const workflowRun = await prisma.workflowRun.create({
    data: {
      demandId: demand.id,
      project: demand.project,
      title: payload.title,
      status: options?.status ?? "TRIAGED",
      summary: payload.summary,
      payload: JSON.parse(JSON.stringify(payloadWithAutoFlow)),
    },
  });

  if (options?.demandStatus && demand.status !== options.demandStatus) {
    await prisma.demand.update({
      where: {
        id: demand.id,
      },
      data: {
        status: options.demandStatus,
      },
    });
  }

  publishStudioEvent("WORKFLOW_RUN_CREATED", {
    workflowRunId: workflowRun.id,
    demandId: demand.id,
    project: demand.project,
    title: workflowRun.title,
    status: workflowRun.status,
  });

  publishStudioEvent("DEMAND_UPDATED", {
    demandId: demand.id,
    title: demand.title,
    project: demand.project,
    status: options?.demandStatus ?? demand.status,
  });

  return workflowRun;
}

function decideAutoFlow(autoFlowMode: AutoFlowMode, demand: Demand): AutoFlowDecision {
  const complexity = classifyDemandComplexity(demand);
  const sensitive = isSensitiveDemand(demand);
  const highRisk = demand.priority === "HIGH" || complexity === "HIGH" || sensitive;

  if (autoFlowMode === "OFF") {
    return {
      shouldCreateWorkflow: false,
      demandStatus: "NEW",
      workflowStatus: "CREATED",
      reason: "AutoFlow desligado. Demanda ficará aguardando ação manual.",
    };
  }

  if (autoFlowMode === "ASSISTED") {
    return {
      shouldCreateWorkflow: true,
      demandStatus: "TRIAGE",
      workflowStatus: "TRIAGED",
      reason: "AutoFlow assistido: cria análise, mas não executa implementação.",
    };
  }

  if (autoFlowMode === "CONTROLLED") {
    if (highRisk) {
      return {
        shouldCreateWorkflow: true,
        demandStatus: "WAITING_APPROVAL",
        workflowStatus: "BLOCKED",
        reason: "AutoFlow controlado: demanda complexa/sensível parada para aprovação.",
      };
    }

    return {
      shouldCreateWorkflow: true,
      demandStatus: "RUNNING",
      workflowStatus: "AGENTS_RUNNING",
      reason: "AutoFlow controlado: demanda dentro do limite de autonomia.",
    };
  }

  return {
    shouldCreateWorkflow: true,
    demandStatus: highRisk ? "WAITING_APPROVAL" : "RUNNING",
    workflowStatus: highRisk ? "READY_FOR_APPROVAL" : "AGENTS_RUNNING",
    reason: highRisk
      ? "AutoFlow total: avançou até o limite e parou para aprovação."
      : "AutoFlow total: demanda liberada para execução automática.",
  };
}

function classifyDemandComplexity(demand: Demand): "LOW" | "MEDIUM" | "HIGH" {
  const text = normalize(`${demand.title} ${demand.description}`);

  if (
    hasAny(text, [
      "backend",
      "api",
      "banco",
      "deploy",
      "pipeline",
      "seguranca",
      "privacidade",
      "lgpd",
      "calculo",
      "formula",
      "inss",
      "ir",
      "black",
      "scholes",
      "nova ferramenta",
      "integracao",
    ])
  ) {
    return "HIGH";
  }

  if (demand.priority === "MEDIUM" || text.length > 180) {
    return "MEDIUM";
  }

  return "LOW";
}

function isSensitiveDemand(demand: Demand): boolean {
  const text = normalize(`${demand.title} ${demand.description}`);

  return (
    demand.origin === "NEWS" ||
    hasAny(text, [
      "noticia",
      "conteudo sensivel",
      "calculo",
      "formula",
      "inss",
      "ir",
      "black",
      "scholes",
      "seguranca",
      "privacidade",
      "lgpd",
      "producao",
      "publicar",
    ])
  );
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(normalize(term)));
}

export type AutoFlowMode = "OFF" | "ASSISTED" | "CONTROLLED" | "FULL";

export type AgentRole =
  | "ENTRY"
  | "CLASSIFIER"
  | "ORCHESTRATOR"
  | "EXECUTOR"
  | "REVIEWER"
  | "STUDIO_LEAD"
  | "OWNER";

export type AgentDecisionStatus =
  | "APPROVED"
  | "APPROVED_WITH_NOTES"
  | "CHANGES_REQUESTED"
  | "BLOCKED"
  | "REJECTED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type ComplexityLevel = "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
export type RequiredApproval = "NONE" | "STUDIO_LEAD" | "GERSON";

export interface DemandSnapshot {
  id: string;
  title: string;
  description: string;
  project: string;
  origin: string;
  priority: string;
  status: string;
  metadata?: unknown;
}

export interface WorkflowSnapshot {
  id: string;
  demandId?: string | null;
  project: string;
  title: string;
  status: string;
  autoFlowMode?: AutoFlowMode | null;
}

export interface AutoFlowPolicy {
  mode: AutoFlowMode;
  maxComplexityWithoutApproval: Exclude<ComplexityLevel, "UNKNOWN">;
  maxRiskWithoutApproval: RiskLevel;
  requireOwnerForFinancialRules: boolean;
  requireOwnerForSecurity: boolean;
  requireOwnerForProductionPublish: boolean;
  requireOwnerForNewsPublishing: boolean;
}

export interface AgentExecutionSnapshot {
  agentKey: string;
  agentName: string;
  agentRole: AgentRole;
  status: string;
  output?: AgentOutput;
}

export interface ExecutionContext {
  project: string;
  source: "worker";
  correlationId: string;
}

export interface AgentInput {
  demand: DemandSnapshot;
  workflow: WorkflowSnapshot;
  previousExecutions: AgentExecutionSnapshot[];
  policy: AutoFlowPolicy;
  context: ExecutionContext;
}

export interface AgentOutput {
  status: AgentDecisionStatus;
  summary: string;
  decision: string;
  risk: RiskLevel;
  complexity: ComplexityLevel;
  requiredApproval: RequiredApproval;
  findings: string[];
  recommendations: string[];
  nextAgents: string[];
  metadata?: Record<string, unknown>;
}

export interface StudioAgent {
  key: string;
  name: string;
  role: AgentRole;
  run(input: AgentInput): Promise<AgentOutput>;
}

export interface WorkflowJobData {
  workflowRunId: string;
  demandId: string;
  requestedBy: "api" | "worker" | "system";
  reason: string;
}

export function defaultAutoFlowPolicy(mode: AutoFlowMode): AutoFlowPolicy {
  return {
    mode,
    maxComplexityWithoutApproval: mode === "FULL" ? "HIGH" : mode === "CONTROLLED" ? "MEDIUM" : "LOW",
    maxRiskWithoutApproval: mode === "FULL" ? "HIGH" : mode === "CONTROLLED" ? "MEDIUM" : "LOW",
    requireOwnerForFinancialRules: true,
    requireOwnerForSecurity: true,
    requireOwnerForProductionPublish: true,
    requireOwnerForNewsPublishing: true,
  };
}

export function shouldPauseForApproval(output: AgentOutput, policy: AutoFlowPolicy): boolean {
  if (policy.mode === "OFF") {
    return true;
  }

  if (output.requiredApproval === "GERSON") {
    return true;
  }

  if (policy.mode === "ASSISTED") {
    return output.status === "BLOCKED" || output.status === "CHANGES_REQUESTED";
  }

  if (policy.mode === "CONTROLLED") {
    return output.risk === "HIGH" || output.complexity === "HIGH";
  }

  return output.status === "BLOCKED";
}

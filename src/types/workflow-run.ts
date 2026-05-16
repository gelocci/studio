export type AgentStatus =
  | "WAITING"
  | "RUNNING"
  | "APPROVED"
  | "APPROVED_WITH_NOTES"
  | "CHANGES_REQUESTED"
  | "BLOCKED"
  | "PR_CREATED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type RiskLabel = "Baixo" | "Médio" | "Alto";

export interface Finding {
  id: string;
  type: string;
  severity: RiskLevel;
  title: string;
  summary: string;
  affectedFiles: string[];
  recommendedAgents: string[];
  autonomyLevel: number;
}

export interface WorkflowAgentData {
  label: string;
  status: AgentStatus;
  summary: string;
  decision: string;
  risk: RiskLabel;
  autonomy: string;
}

export interface WorkflowNode {
  id: string;
  type: "agent";
  position: {
    x: number;
    y: number;
  };
  data: WorkflowAgentData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  blocked?: boolean;
}

export interface WorkflowRunFile {
  id: string;
  title: string;
  project: string;
  status: string;
  summary: string;
  generatedAt: string;
  source: {
    projectPath: string;
    engine: string;
  };
  findings: Finding[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface RunAgentsResult {
  projectName: string;
  projectPath: string;
  findingsCount: number;
  agentsCount: number;
  workflowPath: string;
}

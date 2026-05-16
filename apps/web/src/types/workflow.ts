import type { Edge, Node } from "@xyflow/react";

export type AgentStatus =
  | "WAITING"
  | "RUNNING"
  | "APPROVED"
  | "APPROVED_WITH_NOTES"
  | "CHANGES_REQUESTED"
  | "BLOCKED"
  | "PR_CREATED";

export type Risk = "Baixo" | "Médio" | "Alto";

export interface AgentData extends Record<string, unknown> {
  label: string;
  status: AgentStatus;
  summary: string;
  decision: string;
  risk: Risk;
  autonomy: string;
}

export type AgentNodeType = Node<AgentData, "agent">;

export interface WorkflowRun {
  id: string;
  title: string;
  project: string;
  status: string;
  summary: string;
  nodes: AgentNodeType[];
  edges: Edge[];
}

export const statusLabel: Record<AgentStatus, string> = {
  WAITING: "Aguardando",
  RUNNING: "Executando",
  APPROVED: "Aprovado",
  APPROVED_WITH_NOTES: "Aprovado com notas",
  CHANGES_REQUESTED: "Mudanças solicitadas",
  BLOCKED: "Bloqueado",
  PR_CREATED: "PR criado",
};

export const statusClass: Record<AgentStatus, string> = {
  WAITING: "border-white/10 bg-white/[0.04] text-white/70",
  RUNNING: "border-blue-400/40 bg-blue-400/10 text-blue-100 shadow-[0_0_30px_rgba(68,136,204,0.18)]",
  APPROVED: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100 shadow-[0_0_30px_rgba(0,200,83,0.14)]",
  APPROVED_WITH_NOTES: "border-yellow-400/40 bg-yellow-400/10 text-yellow-100",
  CHANGES_REQUESTED: "border-orange-400/40 bg-orange-400/10 text-orange-100",
  BLOCKED: "border-red-400/50 bg-red-400/10 text-red-100 shadow-[0_0_30px_rgba(224,85,85,0.18)]",
  PR_CREATED: "border-purple-400/40 bg-purple-400/10 text-purple-100",
};

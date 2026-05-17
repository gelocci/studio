export type DemandStatus =
  | "BACKLOG"
  | "TRIAGE"
  | "RUNNING"
  | "WAITING_APPROVAL"
  | "BLOCKED"
  | "DONE"
  | "REJECTED"
  | "ARCHIVED";

export type DemandPriority = "Baixa" | "Média" | "Alta";

export type DemandOrigin = "manual" | "contact" | "audit" | "radar" | "news" | "github" | "site-feedback";

export interface Demand {
  id: string;
  title: string;
  description: string;
  project: string;
  origin: DemandOrigin;
  priority: DemandPriority;
  status: DemandStatus;
  createdAt: string;
  workflowId?: string;
  workflowRunsCount?: number;
  backlogItemsCount?: number;
}

export const demandStatusLabel: Record<DemandStatus, string> = {
  BACKLOG: "Backlog",
  TRIAGE: "Triagem",
  RUNNING: "Em execução",
  WAITING_APPROVAL: "Aguardando aprovação",
  BLOCKED: "Bloqueada",
  DONE: "Concluída",
  REJECTED: "Rejeitada",
  ARCHIVED: "Arquivada",
};

export const demandStatusClass: Record<DemandStatus, string> = {
  BACKLOG: "border-white/10 bg-white/[0.04] text-white/65",
  TRIAGE: "border-blue-400/30 bg-blue-400/10 text-blue-100",
  RUNNING: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  WAITING_APPROVAL: "border-purple-400/30 bg-purple-400/10 text-purple-100",
  BLOCKED: "border-red-400/30 bg-red-400/10 text-red-100",
  DONE: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  REJECTED: "border-red-400/30 bg-red-400/10 text-red-100",
  ARCHIVED: "border-zinc-400/20 bg-zinc-400/10 text-zinc-200",
};

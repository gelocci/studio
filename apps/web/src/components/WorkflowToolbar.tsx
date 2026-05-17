import type { AutoFlowMode } from "../hooks/useAutoFlow";
import type { Demand } from "../types/demand";

interface WorkflowToolbarProps {
  demand: Demand;
  hasWorkflow: boolean;
  processingDemand: boolean;
  autoFlowMode: AutoFlowMode;
  stats: {
    total: number;
    approved: number;
    notes: number;
    changes: number;
    blocked: number;
    running: number;
  };
  onApproveDemand: () => void;
  onRejectDemand: () => void;
  onArchiveDemand: () => void;
  onSaveLayout: () => void;
  onRestoreLayout: () => void;
}

export function WorkflowToolbar({
  demand,
  hasWorkflow,
  processingDemand,
  autoFlowMode,
  stats,
  onApproveDemand,
  onRejectDemand,
  onArchiveDemand,
  onSaveLayout,
  onRestoreLayout,
}: WorkflowToolbarProps) {
  const canAct =
    demand.status === "BACKLOG" ||
    demand.status === "WAITING_APPROVAL" ||
    demand.status === "BLOCKED";

  const canArchive =
    demand.status !== "ARCHIVED" &&
    demand.status !== "REJECTED";

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      {canAct && (
        <>
          <ActionButton tone="success" disabled={processingDemand} onClick={onApproveDemand}>
            {processingDemand ? "Processando..." : "Aprovar"}
          </ActionButton>

          <ActionButton tone="danger" disabled={processingDemand} onClick={onRejectDemand}>
            Rejeitar
          </ActionButton>
        </>
      )}

      {canArchive && (
        <ActionButton tone="neutral" disabled={processingDemand} onClick={onArchiveDemand}>
          Arquivar
        </ActionButton>
      )}

      {(canAct || canArchive) && <Separator />}

      <div className="min-w-[132px] rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-center text-emerald-100">
        <span className="text-white/45">AutoFlow:</span> {autoFlowMode}
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-white/40">Layout:</span>
        <button
          onClick={onSaveLayout}
          className="min-w-[96px] rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-2 text-center text-blue-100 transition hover:bg-blue-400/20"
        >
          Salvar
        </button>
        <button
          onClick={onRestoreLayout}
          className="min-w-[96px] rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-white/70 transition hover:bg-white/[0.08]"
        >
          Restaurar
        </button>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-2 text-white/55">
        <Metric value={hasWorkflow ? stats.total : 0} label="agentes" />
        <Dot />
        <Metric value={hasWorkflow ? stats.approved : 0} label="aprovados" />
        <Dot />
        <Metric value={hasWorkflow ? stats.notes : 0} label="notas" />
        <Dot />
        <Metric value={hasWorkflow ? stats.changes : 0} label="mudanças" />
        <Dot />
        <Metric value={hasWorkflow ? stats.blocked : 0} label="bloqueios" />
        <Dot />
        <Metric value={hasWorkflow ? stats.running : 0} label="executando" />
      </div>
    </div>
  );
}

function ActionButton({
  tone,
  disabled,
  onClick,
  children,
}: {
  tone: "success" | "danger" | "neutral";
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const classes = {
    success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20",
    danger: "border-red-400/30 bg-red-400/10 text-red-100 hover:bg-red-400/20",
    neutral: "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[104px] rounded-full border px-4 py-2 text-center transition disabled:cursor-not-allowed disabled:opacity-45 ${classes[tone]}`}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <span className="hidden h-5 w-px bg-white/15 sm:inline-block" />;
}

function Dot() {
  return <span className="text-white/25">·</span>;
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <span>
      <span className="text-white">{value}</span> {label}
    </span>
  );
}

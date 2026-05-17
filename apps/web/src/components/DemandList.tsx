import type { Demand } from "../types/demand";
import { demandStatusClass, demandStatusLabel } from "../types/demand";

interface DemandListProps {
  demands: Demand[];
  selectedDemandId: string;
  onSelectDemand: (demandId: string) => void;
  source: "api" | "mock";
  sseStatus: "connecting" | "connected" | "error";
  lastEventLabel?: string;
  onReload: () => void;
  onOpenNewDemand: () => void;
}

export function DemandList({
  demands,
  selectedDemandId,
  onSelectDemand,
  source,
  sseStatus,
  lastEventLabel,
  onReload,
  onOpenNewDemand,
}: DemandListProps) {
  return (
    <aside className="w-full border-b border-white/10 bg-black/20 p-4 backdrop-blur-xl xl:w-[360px] xl:border-b-0 xl:border-r">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white/35">Demandas</div>
          <h2 className="mt-1 text-lg font-semibold text-white">Fila do Studio</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55">
          {demands.length}
        </span>
      </div>

      <button
        onClick={onOpenNewDemand}
        className="mt-4 w-full rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20"
      >
        + Nova demanda
      </button>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-xs text-white/50">
        <div className="flex items-center justify-between gap-3">
          <span>
            Fonte: <span className={source === "api" ? "text-emerald-300" : "text-yellow-300"}>{source === "api" ? "API" : "mock"}</span>
          </span>
          <span>
            SSE:{" "}
            <span
              className={
                sseStatus === "connected"
                  ? "text-emerald-300"
                  : sseStatus === "connecting"
                    ? "text-blue-300"
                    : "text-red-300"
              }
            >
              {sseStatus}
            </span>
          </span>
        </div>

        {lastEventLabel && <div className="mt-2 text-white/35">Último evento: {lastEventLabel}</div>}

        <button
          onClick={onReload}
          className="mt-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/65 transition hover:bg-white/[0.08]"
        >
          Recarregar
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {demands.map((demand) => {
          const selected = demand.id === selectedDemandId;

          return (
            <button
              key={demand.id}
              onClick={() => onSelectDemand(demand.id)}
              className={`w-full rounded-2xl border p-4 text-left transition hover:bg-white/[0.06] ${
                selected
                  ? "border-emerald-400/35 bg-emerald-400/10"
                  : "border-white/10 bg-white/[0.025]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{demand.title}</div>
                  <div className="mt-1 text-xs text-white/40">{demand.project} · {demand.origin}</div>
                </div>
                <span className={`rounded-full border px-2 py-1 text-[10px] ${demandStatusClass[demand.status]}`}>
                  {demandStatusLabel[demand.status]}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-xs leading-5 text-white/55">{demand.description}</p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-white/35">
                <span>Prioridade: {demand.priority}</span>
                <span>{new Date(demand.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

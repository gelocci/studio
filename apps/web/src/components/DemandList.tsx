import { useEffect, useMemo, useState } from "react";
import { AutoFlowControl } from "./AutoFlowControl";
import type { AutoFlowMode } from "../hooks/useAutoFlow";
import type { DemandView } from "../hooks/useDemands";
import type { Demand, DemandStatus } from "../types/demand";
import { demandStatusClass, demandStatusLabel } from "../types/demand";

interface DemandListProps {
  demands: Demand[];
  view: DemandView;
  selectedDemandId: string;
  onChangeView: (view: DemandView) => void;
  onSelectDemand: (demandId: string) => void;
  onRejectDemand: (demandId: string) => void;
  onOpenNewDemand: () => void;
  autoFlowMode: AutoFlowMode;
  autoFlowSaving: boolean;
  onAutoFlowChange: (mode: AutoFlowMode) => void;
}

const views: Array<{ value: DemandView; label: string }> = [
  { value: "active", label: "Ativas" },
  { value: "rejected", label: "Rejeitadas" },
  { value: "archived", label: "Arquivadas" },
  { value: "all", label: "Todas" },
];

const ORDER_STORAGE_PREFIX = "gelocci-studio-demand-order";

export function DemandList({
  demands,
  view,
  selectedDemandId,
  onChangeView,
  onSelectDemand,
  onRejectDemand,
  onOpenNewDemand,
  autoFlowMode,
  autoFlowSaving,
  onAutoFlowChange,
}: DemandListProps) {
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const storageKey = `${ORDER_STORAGE_PREFIX}:${view}`;

  useEffect(() => {
    const saved = readSavedOrder(storageKey);
    const demandIds = demands.map((demand) => demand.id);

    const knownSavedIds = saved.filter((id) => demandIds.includes(id));
    const newIds = demandIds.filter((id) => !knownSavedIds.includes(id));

    setOrderedIds([...knownSavedIds, ...newIds]);
  }, [demands, storageKey]);

  const orderedDemands = useMemo(() => {
    const byId = new Map(demands.map((demand) => [demand.id, demand]));

    return orderedIds
      .map((id) => byId.get(id))
      .filter((demand): demand is Demand => Boolean(demand));
  }, [demands, orderedIds]);

  function persistOrder(nextIds: string[]) {
    setOrderedIds(nextIds);
    localStorage.setItem(storageKey, JSON.stringify(nextIds));
  }

  function selectDemand(demandId: string) {
    onSelectDemand(demandId);

    const nextIds = [demandId, ...orderedIds.filter((id) => id !== demandId)];
    persistOrder(nextIds);
  }

  function moveDemand(draggedId: string, targetId: string) {
    if (draggedId === targetId) {
      return;
    }

    const current = orderedIds.filter((id) => id !== draggedId);
    const targetIndex = current.indexOf(targetId);

    if (targetIndex < 0) {
      return;
    }

    const nextIds = [
      ...current.slice(0, targetIndex),
      draggedId,
      ...current.slice(targetIndex),
    ];

    persistOrder(nextIds);
  }

  return (
    <aside className="flex w-full min-h-0 flex-col border-b border-white/10 bg-black/20 p-4 backdrop-blur-xl xl:w-[360px] xl:border-b-0 xl:border-r">
      <div className="shrink-0">
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

        <div className="mt-4">
          <AutoFlowControl mode={autoFlowMode} saving={autoFlowSaving} onChange={onAutoFlowChange} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {views.map((item) => {
            const selected = item.value === view;

            return (
              <button
                key={item.value}
                onClick={() => onChangeView(item.value)}
                className={`rounded-xl border px-2 py-2 text-[11px] transition ${
                  selected
                    ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-100"
                    : "border-white/10 bg-white/[0.025] text-white/45 hover:bg-white/[0.06] hover:text-white/70"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-[11px] leading-4 text-white/35">
          Arraste os cards para reordenar. Ao selecionar uma demanda, ela sobe para o topo.
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:rgba(0,200,83,0.35)_rgba(255,255,255,0.05)] [scrollbar-width:thin]">
        <div className="space-y-3 pb-6">
          {orderedDemands.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-center text-sm text-white/45">
              Nenhuma demanda nesta visão.
            </div>
          )}

          {orderedDemands.map((demand) => {
            const selected = demand.id === selectedDemandId;
            const canReject = demand.status !== "REJECTED" && demand.status !== "ARCHIVED";
            const muted = demand.status === "REJECTED" || demand.status === "ARCHIVED";
            const statusStyle = cardStyleByStatus(demand.status, selected, muted);
            const dragging = draggingId === demand.id;

            return (
              <div
                key={demand.id}
                draggable
                onDragStart={() => setDraggingId(demand.id)}
                onDragEnd={() => setDraggingId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();

                  if (draggingId) {
                    moveDemand(draggingId, demand.id);
                  }

                  setDraggingId(null);
                }}
                className={`relative h-[196px] cursor-grab rounded-2xl border p-4 transition active:cursor-grabbing ${statusStyle} ${
                  dragging ? "scale-[0.98] opacity-60" : ""
                }`}
              >
                <button
                  onClick={() => selectDemand(demand.id)}
                  className="flex h-full w-full flex-col text-left"
                >
                  <div className="flex items-start gap-3 pr-8">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        {selected && (
                          <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.85)]" />
                        )}
                        <div className="line-clamp-2 text-sm font-semibold leading-5 text-white">{demand.title}</div>
                      </div>
                      <div className="mt-1 truncate text-xs text-white/40">{demand.project} · {demand.origin}</div>
                    </div>

                    <span className={`mt-0.5 shrink-0 rounded-full border px-2 py-1 text-[10px] ${demandStatusClass[demand.status]}`}>
                      {demandStatusLabel[demand.status]}
                    </span>
                  </div>

                  <p
                    className="mt-3 text-xs leading-5 text-white/55"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxHeight: "40px",
                    }}
                  >
                    {demand.description}
                  </p>

                  <div className="mt-auto border-t border-white/5 pt-3">
                    <div className="flex items-center justify-between gap-3 text-[11px] leading-4 text-white/35">
                      <span className="truncate">Prioridade: {demand.priority}</span>
                      <span className="shrink-0">{new Date(demand.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>

                    <div className="mt-2 flex min-w-0 items-center gap-2 text-[11px] leading-4 text-white/30">
                      <span className="shrink-0">Workflows: {demand.workflowRunsCount ?? 0}</span>
                      <span className="shrink-0">·</span>
                      <span className="shrink-0">Backlog: {demand.backlogItemsCount ?? 0}</span>
                      {selected && (
                        <>
                          <span className="shrink-0">·</span>
                          <span className="truncate text-emerald-200">selecionada</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>

                {canReject && (
                  <button
                    title="Rejeitar demanda"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRejectDemand(demand.id);
                    }}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 text-base leading-none text-red-100 transition hover:bg-red-400/20"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function readSavedOrder(storageKey: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function cardStyleByStatus(status: DemandStatus, selected: boolean, muted: boolean): string {
  if (selected) {
    return "border-emerald-400/55 bg-emerald-400/[0.16] shadow-[0_0_0_1px_rgba(52,211,153,0.16),0_18px_60px_rgba(0,0,0,0.28)]";
  }

  if (muted) {
    return "border-white/10 bg-zinc-500/[0.045] opacity-70 hover:bg-zinc-500/[0.07]";
  }

  const map: Record<DemandStatus, string> = {
    BACKLOG: "border-white/10 bg-white/[0.025] hover:bg-white/[0.06]",
    TRIAGE: "border-blue-400/20 bg-blue-400/[0.07] hover:bg-blue-400/[0.11]",
    RUNNING: "border-emerald-400/22 bg-emerald-400/[0.08] hover:bg-emerald-400/[0.12]",
    WAITING_APPROVAL: "border-purple-400/24 bg-purple-400/[0.08] hover:bg-purple-400/[0.12]",
    BLOCKED: "border-red-400/24 bg-red-400/[0.08] hover:bg-red-400/[0.12]",
    DONE: "border-emerald-400/18 bg-emerald-400/[0.05] hover:bg-emerald-400/[0.09]",
    REJECTED: "border-white/10 bg-zinc-500/[0.045] opacity-70 hover:bg-zinc-500/[0.07]",
    ARCHIVED: "border-white/10 bg-zinc-500/[0.045] opacity-70 hover:bg-zinc-500/[0.07]",
  };

  return map[status];
}

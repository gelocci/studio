import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { AgentNodeType } from "../types/workflow";
import { statusClass, statusLabel } from "../types/workflow";

export function AgentNode({ data }: NodeProps<AgentNodeType>) {
  const isRunning = data.status === "RUNNING";

  return (
    <div
      className={`relative w-60 rounded-2xl border p-4 backdrop-blur transition hover:scale-[1.02] ${statusClass[data.status]}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border !border-white/30 !bg-[var(--bg-card)]"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border !border-white/30 !bg-[var(--green)]"
      />

      {isRunning && (
        <>
          <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[var(--green)] shadow-[0_0_18px_rgba(0,200,83,0.95)]" />
          <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-ping rounded-full bg-[var(--green)] opacity-75" />
        </>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">Agente</div>
          <div className="mt-1 text-base font-semibold text-white">{data.label}</div>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] text-white/60">
          {data.risk}
        </span>
      </div>

      <div className="mt-4 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs">
        {statusLabel[data.status]}
      </div>

      <p className="mt-3 text-xs leading-5 text-white/60">{data.currentMessage ?? data.summary}</p>

      {data.debatingWith && (
        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[11px] text-white/45">
          discutindo com: <span className="text-white/70">{data.debatingWith}</span>
        </div>
      )}
    </div>
  );
}

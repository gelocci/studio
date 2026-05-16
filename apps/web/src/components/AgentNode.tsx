import type { NodeProps } from "@xyflow/react";
import type { AgentNodeType } from "../types/workflow";
import { statusClass, statusLabel } from "../types/workflow";

export function AgentNode({ data }: NodeProps<AgentNodeType>) {
  return (
    <div
      className={`w-60 rounded-2xl border p-4 backdrop-blur transition hover:scale-[1.02] ${statusClass[data.status]}`}
    >
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

      <p className="mt-3 text-xs leading-5 text-white/60">{data.summary}</p>
    </div>
  );
}

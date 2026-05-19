import type { AutoFlowMode } from "../hooks/useAutoFlow";

interface AutoFlowControlProps {
  mode: AutoFlowMode;
  saving: boolean;
  onChange: (mode: AutoFlowMode) => void;
}

const modes: Array<{ value: AutoFlowMode; label: string; description: string }> = [
  { value: "OFF",        label: "OFF",        description: "Nada roda sozinho."       },
  { value: "ASSISTED",   label: "Assistido",  description: "Analisa e para."          },
  { value: "CONTROLLED", label: "Controlado", description: "Roda simples/médio."      },
  { value: "FULL",       label: "Total",      description: "Avança até limite real."  },
];

export function AutoFlowControl({ mode, saving, onChange }: AutoFlowControlProps) {
  return (
    <div className="rounded-2xl border border-[var(--muted-3)] bg-white/[0.025] p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted-2)]">AutoFlow</div>
          <div className="mt-1 text-sm text-[var(--muted-1)]">Modo operacional dos agentes</div>
        </div>
        {saving && <span className="saving-text">salvando...</span>}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {modes.map((item) => {
          const selected = item.value === mode;
          return (
            <button
              key={item.value}
              onClick={() => onChange(item.value)}
              disabled={saving}
              className={`rounded-xl border px-3 py-2 text-left transition disabled:opacity-45 ${
                selected
                  ? "selected-amber"
                  : "border-[var(--muted-3)] bg-black/20 text-[var(--muted-1)] hover:bg-white/[0.05]"
              }`}
            >
              <div className="text-xs font-semibold">{item.label}</div>
              <div className="mt-1 text-[10px] opacity-70">{item.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
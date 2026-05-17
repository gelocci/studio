import { useState } from "react";
import type { CreateDemandInput } from "../hooks/useDemands";

interface NewDemandModalProps {
  open: boolean;
  creating: boolean;
  onClose: () => void;
  onCreateDemand: (input: CreateDemandInput) => Promise<void>;
}

const initialForm: CreateDemandInput = {
  title: "",
  description: "",
  project: "www",
  origin: "MANUAL",
  priority: "MEDIUM",
  status: "NEW",
};

export function NewDemandModal({ open, creating, onClose, onCreateDemand }: NewDemandModalProps) {
  const [form, setForm] = useState<CreateDemandInput>(initialForm);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  async function submit() {
    setError(null);

    if (form.title.trim().length < 3) {
      setError("Informe um título com pelo menos 3 caracteres.");
      return;
    }

    if (form.description.trim().length < 3) {
      setError("Informe uma descrição com pelo menos 3 caracteres.");
      return;
    }

    if (form.project.trim().length < 1) {
      setError("Informe o projeto.");
      return;
    }

    await onCreateDemand({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      project: form.project.trim(),
    });

    setForm(initialForm);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[rgba(17,24,21,0.98)] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/35">Nova demanda</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">Abrir demanda no Studio</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Cria uma demanda no backend. A fila será atualizada pela API e pelos eventos SSE.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={creating}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/65 transition hover:bg-white/[0.08] disabled:opacity-45"
          >
            Fechar
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <Field label="Título">
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Ex.: Melhorar página Black-Scholes"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-emerald-400/40"
            />
          </Field>

          <Field label="Descrição">
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Descreva o problema, melhoria, ideia ou necessidade."
              rows={5}
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-emerald-400/40"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Projeto">
              <select
                value={form.project}
                onChange={(event) => setForm((current) => ({ ...current, project: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/40"
              >
                <option value="www">www</option>
                <option value="asset-allocation">asset-allocation</option>
                <option value="studio">studio</option>
              </select>
            </Field>

            <Field label="Origem">
              <select
                value={form.origin}
                onChange={(event) => setForm((current) => ({ ...current, origin: event.target.value as CreateDemandInput["origin"] }))}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/40"
              >
                <option value="MANUAL">Manual</option>
                <option value="CONTACT">Fale Conosco</option>
                <option value="AUDIT">Auditoria</option>
                <option value="RADAR">Agente Radar</option>
                <option value="NEWS">Notícias</option>
                <option value="GITHUB">GitHub</option>
                <option value="SITE_FEEDBACK">Feedback do site</option>
              </select>
            </Field>

            <Field label="Prioridade">
              <select
                value={form.priority}
                onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as CreateDemandInput["priority"] }))}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/40"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </Field>

            <Field label="Status inicial">
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as CreateDemandInput["status"] }))}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/40"
              >
                <option value="NEW">Nova</option>
                <option value="TRIAGE">Triagem</option>
                <option value="WAITING_APPROVAL">Aguardando aprovação</option>
              </select>
            </Field>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            onClick={onClose}
            disabled={creating}
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 transition hover:bg-white/[0.08] disabled:opacity-45"
          >
            Cancelar
          </button>
          <button
            onClick={() => void submit()}
            disabled={creating}
            className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {creating ? "Criando..." : "Criar demanda"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/35">{label}</div>
      {children}
    </label>
  );
}

import { useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import type { Edge, NodeTypes } from "@xyflow/react";
import { AgentNode } from "./components/AgentNode";
import { useWorkflowRun } from "./hooks/useWorkflowRun";
import type { AgentData, AgentNodeType, WorkflowRun } from "./types/workflow";
import { statusClass, statusLabel } from "./types/workflow";

const nodeTypes: NodeTypes = {
  agent: AgentNode,
};

function WorkflowCanvas({ workflow }: { workflow: WorkflowRun }) {
  const [nodes, , onNodesChange] = useNodesState<AgentNodeType>(workflow.nodes);
  const [edges, , onEdgesChange] = useEdgesState<Edge>(workflow.edges);
  const [selectedNodeId, setSelectedNodeId] = useState(workflow.nodes[0]?.id ?? "");

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId],
  );

  const selected = selectedNode?.data;

  const stats = useMemo(() => {
    return {
      total: nodes.length,
      approved: nodes.filter((node) => node.data.status === "APPROVED").length,
      notes: nodes.filter((node) => node.data.status === "APPROVED_WITH_NOTES").length,
      changes: nodes.filter((node) => node.data.status === "CHANGES_REQUESTED").length,
      blocked: nodes.filter((node) => node.data.status === "BLOCKED").length,
      running: nodes.filter((node) => node.data.status === "RUNNING").length,
    };
  }, [nodes]);

  if (!selected) {
    return (
      <div className="flex flex-1 items-center justify-center text-white/60">
        Nenhum agente disponível neste workflow.
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[var(--green)] shadow-[0_0_18px_rgba(0,200,83,0.8)]" />
              <h1 className="text-xl font-semibold tracking-tight">Gelocci Studio</h1>
            </div>
            <p className="mt-1 text-sm text-white/45">
              {workflow.title} · {workflow.project} · {workflow.status}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Stat label="Agentes" value={stats.total} />
            <Stat label="Aprovados" value={stats.approved} />
            <Stat label="Notas" value={stats.notes} />
            <Stat label="Mudanças" value={stats.changes} />
            <Stat label="Bloqueios" value={stats.blocked} />
            <Stat label="Executando" value={stats.running} />
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_420px]">
        <section className="relative min-h-[680px] border-r border-white/10">
          <ReactFlow<AgentNodeType, Edge>
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            fitView
            minZoom={0.25}
            maxZoom={1.3}
          >
            <Background color="rgba(240,244,242,0.12)" variant={BackgroundVariant.Dots} gap={22} size={1} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const status = (node.data as AgentData).status;
                if (status === "BLOCKED") return "#E05555";
                if (status === "RUNNING") return "#4488CC";
                if (status === "APPROVED") return "#00C853";
                if (status === "APPROVED_WITH_NOTES") return "#C9A84C";
                if (status === "CHANGES_REQUESTED") return "#F59E0B";
                return "#6B7280";
              }}
              maskColor="rgba(8, 11, 10, 0.72)"
            />
          </ReactFlow>
        </section>

        <aside className="overflow-y-auto bg-[rgba(17,24,21,0.72)] p-6 backdrop-blur-xl">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-white/35">Painel do agente</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">{selected.label}</h2>
            <div className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs ${statusClass[selected.status]}`}>
              {statusLabel[selected.status]}
            </div>

            <div className="mt-6 space-y-5">
              <InfoBlock title="Resumo" value={selected.summary} />
              <InfoBlock title="Decisão" value={selected.decision} />
              <InfoBlock title="Risco" value={selected.risk} />
              <InfoBlock title="Autonomia" value={selected.autonomy} />
            </div>

            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
              <strong>Regra de segurança:</strong> risco alto exige aprovação do Gerson.
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-white/35">Resumo da execução</div>
            <p className="mt-4 text-sm leading-6 text-white/65">{workflow.summary}</p>
            {workflow.generatedAt && (
              <p className="mt-4 text-xs text-white/35">Gerado em: {new Date(workflow.generatedAt).toLocaleString("pt-BR")}</p>
            )}
          </div>
        </aside>
      </main>
    </>
  );
}

function AppContent() {
  const { workflow, source, loading, error } = useWorkflowRun();

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-white/60">Carregando workflow...</div>;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="border-b border-white/10 bg-black/30 px-6 py-2 text-xs text-white/45">
        Fonte do fluxo:{" "}
        <span className={source === "json" ? "text-emerald-300" : "text-yellow-300"}>
          {source === "json" ? "JSON real" : "mock local"}
        </span>
        {error && <span className="ml-3 text-white/30">({error})</span>}
      </div>
      <WorkflowCanvas key={workflow.id} workflow={workflow} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/70">
      <span className="text-white">{value}</span> {label}
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-white/35">{title}</div>
      <div className="mt-1 text-sm leading-6 text-white/70">{value}</div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
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
import { DemandList } from "./components/DemandList";
import { NewDemandModal } from "./components/NewDemandModal";
import { WorkflowToolbar } from "./components/WorkflowToolbar";
import { useAutoFlow } from "./hooks/useAutoFlow";
import { useDemands } from "./hooks/useDemands";
import { useWorkflowRun } from "./hooks/useWorkflowRun";
import type { AutoFlowMode } from "./hooks/useAutoFlow";
import type { CreateDemandInput } from "./hooks/useDemands";
import type { Demand } from "./types/demand";
import type { AgentData, AgentNodeType, WorkflowRun } from "./types/workflow";
import { approvalLabel, statusClass, statusLabel } from "./types/workflow";
import { applySavedLayout, clearWorkflowLayout, saveWorkflowLayout } from "./utils/layoutStorage";

const nodeTypes: NodeTypes = {
  agent: AgentNode,
};

function WorkflowCanvas({
  workflow,
  demand,
  autoFlowMode,
  onApproveDemand,
  onRejectDemand,
  onArchiveDemand,
  processingDemand,
}: {
  workflow: WorkflowRun;
  demand: Demand;
  autoFlowMode: AutoFlowMode;
  onApproveDemand: () => Promise<void>;
  onRejectDemand: () => Promise<void>;
  onArchiveDemand: () => Promise<void>;
  processingDemand: boolean;
}) {
  const originalNodes = useMemo(() => applySavedLayout(workflow), [workflow]);
  const originalEdges = useMemo(() => workflow.edges, [workflow.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState<AgentNodeType>(originalNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(originalEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(workflow.nodes[0]?.id ?? "");
  const [layoutMessage, setLayoutMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const nodesWithSavedLayout = applySavedLayout(workflow);

    setNodes(nodesWithSavedLayout);
    setEdges(originalEdges);
    setSelectedNodeId(nodesWithSavedLayout[0]?.id ?? "");
  }, [workflow, originalEdges, setEdges, setNodes]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId],
  );

  const selected = selectedNode?.data;
  const hasWorkflow = (demand.workflowRunsCount ?? 0) > 0;

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

  function showLayoutMessage(message: string) {
    setLayoutMessage(message);
    window.setTimeout(() => setLayoutMessage(null), 2500);
  }

  function saveLayout() {
    saveWorkflowLayout(workflow, nodes);
    showLayoutMessage("Layout salvo neste navegador.");
  }

  function restoreOriginalLayout() {
    clearWorkflowLayout(workflow);
    setNodes(workflow.nodes);
    setEdges(originalEdges);
    setSelectedNodeId(workflow.nodes[0]?.id ?? "");
    showLayoutMessage("Layout original restaurado.");
  }

  if (!hasWorkflow) {
    return (
      <>
        <header className="border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            <HeaderTitle demand={demand} workflow={workflow} />

            <WorkflowToolbar
              demand={demand}
              hasWorkflow={hasWorkflow}
              processingDemand={processingDemand}
              autoFlowMode={autoFlowMode}
              stats={{ total: 0, approved: 0, notes: 0, changes: 0, blocked: 0, running: 0 }}
              onApproveDemand={() => void onApproveDemand()}
              onRejectDemand={() => void onRejectDemand()}
              onArchiveDemand={() => void onArchiveDemand()}
              onSaveLayout={saveLayout}
              onRestoreLayout={restoreOriginalLayout}
            />
          </div>
        </header>

        <main className="flex min-h-0 flex-1 items-center justify-center p-8">
          <div className="max-w-xl rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center">
            <div className="text-xs uppercase tracking-[0.24em] text-white/35">Demanda aguardando</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">Esta demanda ainda não possui workflow</h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Ao aprovar esta demanda, o Studio cria o workflow elástico com Classificador, Orquestrador, agentes e revisores necessários.
            </p>
          </div>
        </main>
      </>
    );
  }

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
        <div className="flex flex-col gap-4">
          <HeaderTitle demand={demand} workflow={workflow} />

          <WorkflowToolbar
            demand={demand}
            hasWorkflow={hasWorkflow}
            processingDemand={processingDemand}
            autoFlowMode={autoFlowMode}
            stats={stats}
            onApproveDemand={() => void onApproveDemand()}
            onRejectDemand={() => void onRejectDemand()}
            onArchiveDemand={() => void onArchiveDemand()}
            onSaveLayout={saveLayout}
            onRestoreLayout={restoreOriginalLayout}
          />
        </div>

        {layoutMessage && (
          <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-400/10 px-4 py-3 text-sm text-blue-100">
            {layoutMessage}
          </div>
        )}
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_480px]">
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
          <AgentPanel selected={selected} />

          <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-white/35">Demanda</div>
            <h3 className="mt-2 text-lg font-semibold text-white">{demand.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">{demand.description}</p>
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

function HeaderTitle({ demand, workflow }: { demand: Demand; workflow: WorkflowRun }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-[var(--green)] shadow-[0_0_18px_rgba(0,200,83,0.8)]" />
          <h1 className="text-xl font-semibold tracking-tight">Gelocci Studio</h1>
        </div>
        <p className="mt-1 text-sm text-white/45">
          {demand.title} · {workflow.project} · {workflow.status}
        </p>
      </div>
    </div>
  );
}

function AgentPanel({ selected }: { selected: AgentData }) {
  const requiredApproval = selected.requiredApproval ?? "NONE";

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.24em] text-white/35">Painel do agente</div>
        {selected.status === "RUNNING" && (
          <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs text-blue-100">
            executando
          </span>
        )}
      </div>

      <h2 className="mt-2 text-2xl font-semibold text-white">{selected.label}</h2>
      <div className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs ${statusClass[selected.status]}`}>
        {statusLabel[selected.status]}
      </div>

      {selected.currentMessage && (
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
          “{selected.currentMessage}”
        </div>
      )}

      <div className="mt-6 space-y-5">
        <InfoBlock title="Resumo" value={selected.summary} />
        <InfoBlock title="Decisão" value={selected.decision} />
        <InfoBlock title="Risco" value={selected.risk} />
        <InfoBlock title="Autonomia" value={selected.autonomy} />
        <InfoBlock title="Aprovação exigida" value={approvalLabel[requiredApproval]} />
      </div>

      <ListBlock title="Análise" values={selected.analysis} />
      <ListBlock title="Riscos" values={selected.risks} danger />
      <ListBlock title="Recomendações" values={selected.recommendations} />
      <ListBlock title="Próximas ações" values={selected.nextActions} />

      {requiredApproval === "GERSON" && (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
          <strong>Aprovação obrigatória:</strong> este ponto não deve avançar sem decisão do Gerson.
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const {
    demands,
    view,
    setView,
    source: demandSource,
    sseStatus,
    loading: demandsLoading,
    creating,
    processingDemand,
    error: demandsError,
    createDemand,
    processDemand,
    approveDemand,
    rejectDemand,
    archiveDemand,
  } = useDemands();

  const {
    autoFlowMode,
    loading: autoFlowLoading,
    saving: autoFlowSaving,
    error: autoFlowError,
    setAutoFlowMode,
  } = useAutoFlow();

  const [selectedDemandId, setSelectedDemandId] = useState<string>("");
  const [newDemandOpen, setNewDemandOpen] = useState(false);

  useEffect(() => {
    if (!selectedDemandId && demands.length > 0) {
      setSelectedDemandId(demands[0].id);
    }

    if (selectedDemandId && demands.length > 0 && !demands.some((demand) => demand.id === selectedDemandId)) {
      setSelectedDemandId(demands[0].id);
    }
  }, [demands, selectedDemandId]);

  const selectedDemand = useMemo(
    () => demands.find((demand) => demand.id === selectedDemandId) ?? demands[0],
    [demands, selectedDemandId],
  );

  const {
    workflow,
    source: workflowSource,
    loading: workflowLoading,
    error: workflowError,
    reload: reloadWorkflow,
  } = useWorkflowRun(selectedDemand?.id);

  async function handleCreateDemand(input: CreateDemandInput): Promise<void> {
    const created = await createDemand(input);
    setSelectedDemandId(created.id);
  }

  async function handleApproveDemand(): Promise<void> {
    if (!selectedDemand) return;

    if ((selectedDemand.workflowRunsCount ?? 0) === 0) {
      await processDemand(selectedDemand.id);
      await reloadWorkflow();
      return;
    }

    await approveDemand(selectedDemand.id);
    await reloadWorkflow();
  }

  async function handleRejectDemand(demandId = selectedDemand?.id): Promise<void> {
    if (demandId) {
      await rejectDemand(demandId);
    }
  }

  async function handleArchiveDemand(): Promise<void> {
    if (selectedDemand) await archiveDemand(selectedDemand.id);
  }

  function handleAutoFlowChange(mode: AutoFlowMode): void {
    void setAutoFlowMode(mode);
  }

  if (workflowLoading || demandsLoading || autoFlowLoading) {
    return <div className="flex h-screen items-center justify-center text-white/60">Carregando Studio...</div>;
  }

  if (!selectedDemand) {
    return (
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="shrink-0 border-b border-white/10 bg-black/30 px-6 py-2 text-xs text-white/45">
          Demandas: <span className={demandSource === "api" ? "text-emerald-300" : "text-yellow-300"}>{demandSource === "api" ? "API" : "mock"}</span>
          {" · "}
          AutoFlow: <span className="text-emerald-300">{autoFlowMode}</span>
          {" · "}
          Conexão: <span className={sseStatus === "connected" ? "text-emerald-300" : "text-red-300"}>{sseStatus === "connected" ? "online" : "instável"}</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <DemandList
            demands={demands}
            view={view}
            selectedDemandId=""
            onChangeView={setView}
            onSelectDemand={setSelectedDemandId}
            onRejectDemand={(demandId) => void handleRejectDemand(demandId)}
            onOpenNewDemand={() => setNewDemandOpen(true)}
            autoFlowMode={autoFlowMode}
            autoFlowSaving={autoFlowSaving}
            onAutoFlowChange={handleAutoFlowChange}
          />

          <main className="flex flex-1 items-center justify-center p-8 text-white/55">
            Nenhuma demanda nesta visão.
          </main>
        </div>

        <NewDemandModal
          open={newDemandOpen}
          creating={creating}
          onClose={() => setNewDemandOpen(false)}
          onCreateDemand={handleCreateDemand}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="shrink-0 border-b border-white/10 bg-black/30 px-6 py-2 text-xs text-white/45">
        Workflow:{" "}
        <span className={workflowSource === "api" || workflowSource === "json" ? "text-emerald-300" : "text-yellow-300"}>
          {workflowSource === "api" ? "API" : workflowSource === "json" ? "JSON real" : "mock local"}
        </span>
        {" · "}
        Demandas:{" "}
        <span className={demandSource === "api" ? "text-emerald-300" : "text-yellow-300"}>
          {demandSource === "api" ? "API" : "mock"}
        </span>
        {" · "}
        Visão: <span className="text-emerald-300">{view}</span>
        {" · "}
        AutoFlow: <span className="text-emerald-300">{autoFlowMode}</span>
        {" · "}
        Conexão: <span className={sseStatus === "connected" ? "text-emerald-300" : "text-red-300"}>{sseStatus === "connected" ? "online" : "instável"}</span>
        {(workflowError || demandsError || autoFlowError) && (
          <span className="ml-3 text-white/30">({workflowError ?? demandsError ?? autoFlowError})</span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <DemandList
          demands={demands}
          view={view}
          selectedDemandId={selectedDemand.id}
          onChangeView={setView}
          onSelectDemand={setSelectedDemandId}
          onRejectDemand={(demandId) => void handleRejectDemand(demandId)}
          onOpenNewDemand={() => setNewDemandOpen(true)}
          autoFlowMode={autoFlowMode}
          autoFlowSaving={autoFlowSaving}
          onAutoFlowChange={handleAutoFlowChange}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <WorkflowCanvas
            key={`${workflow.id}-${selectedDemand.id}`}
            workflow={workflow}
            demand={selectedDemand}
            autoFlowMode={autoFlowMode}
            onApproveDemand={handleApproveDemand}
            onRejectDemand={() => handleRejectDemand()}
            onArchiveDemand={handleArchiveDemand}
            processingDemand={processingDemand}
          />
        </div>
      </div>

      <NewDemandModal
        open={newDemandOpen}
        creating={creating}
        onClose={() => setNewDemandOpen(false)}
        onCreateDemand={handleCreateDemand}
      />
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

function ListBlock({ title, values, danger = false }: { title: string; values?: string[]; danger?: boolean }) {
  if (!values || values.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="text-xs uppercase tracking-[0.2em] text-white/35">{title}</div>
      <ul className="mt-3 space-y-2">
        {values.map((value, index) => (
          <li
            key={`${title}-${index}`}
            className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
              danger
                ? "border-red-400/20 bg-red-400/10 text-red-100"
                : "border-white/10 bg-white/[0.035] text-white/65"
            }`}
          >
            {value}
          </li>
        ))}
      </ul>
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

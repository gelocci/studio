import { useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import type { Edge, Node, NodeProps, NodeTypes } from "@xyflow/react";

type AgentStatus =
  | "WAITING"
  | "RUNNING"
  | "APPROVED"
  | "APPROVED_WITH_NOTES"
  | "CHANGES_REQUESTED"
  | "BLOCKED"
  | "PR_CREATED";

type Risk = "Baixo" | "Médio" | "Alto";

interface AgentData extends Record<string, unknown> {
  label: string;
  status: AgentStatus;
  summary: string;
  decision: string;
  risk: Risk;
  autonomy: string;
}

type AgentNodeType = Node<AgentData, "agent">;

const statusLabel: Record<AgentStatus, string> = {
  WAITING: "Aguardando",
  RUNNING: "Executando",
  APPROVED: "Aprovado",
  APPROVED_WITH_NOTES: "Aprovado com notas",
  CHANGES_REQUESTED: "Mudanças solicitadas",
  BLOCKED: "Bloqueado",
  PR_CREATED: "PR criado",
};

const statusClass: Record<AgentStatus, string> = {
  WAITING: "border-white/10 bg-white/[0.04] text-white/70",
  RUNNING: "border-blue-400/40 bg-blue-400/10 text-blue-100 shadow-[0_0_30px_rgba(68,136,204,0.18)]",
  APPROVED: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100 shadow-[0_0_30px_rgba(0,200,83,0.14)]",
  APPROVED_WITH_NOTES: "border-yellow-400/40 bg-yellow-400/10 text-yellow-100",
  CHANGES_REQUESTED: "border-orange-400/40 bg-orange-400/10 text-orange-100",
  BLOCKED: "border-red-400/50 bg-red-400/10 text-red-100 shadow-[0_0_30px_rgba(224,85,85,0.18)]",
  PR_CREATED: "border-purple-400/40 bg-purple-400/10 text-purple-100",
};

function AgentNode({ data }: NodeProps<AgentNodeType>) {
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

const nodeTypes: NodeTypes = {
  agent: AgentNode,
};

function makeEdge(source: string, target: string, blocked = false): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    animated: blocked,
    style: {
      stroke: blocked ? "#E05555" : "rgba(240,244,242,0.35)",
      strokeWidth: blocked ? 2.5 : 1.6,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: blocked ? "#E05555" : "rgba(240,244,242,0.55)",
    },
  };
}

const initialNodes: AgentNodeType[] = [
  {
    id: "entrada",
    type: "agent",
    position: { x: 0, y: 180 },
    data: {
      label: "Entrada",
      status: "APPROVED",
      summary: "Demanda recebida: melhorar página Black-Scholes.",
      decision: "Demanda registrada e pronta para triagem.",
      risk: "Baixo",
      autonomy: "Nível 1 — recomenda",
    },
  },
  {
    id: "orquestrador",
    type: "agent",
    position: { x: 320, y: 180 },
    data: {
      label: "Orquestrador",
      status: "APPROVED",
      summary: "Classificou como melhoria de ferramenta financeira pública.",
      decision: "Convocar Produto, UX/UI, SEO, Financeiro, Arquiteto e Desenvolvedor.",
      risk: "Médio",
      autonomy: "Nível 2 — planeja",
    },
  },
  {
    id: "produto",
    type: "agent",
    position: { x: 680, y: 0 },
    data: {
      label: "Produto",
      status: "APPROVED_WITH_NOTES",
      summary: "Melhoria tem valor para aquisição e confiança.",
      decision: "Aprovar preservando simplicidade.",
      risk: "Baixo",
      autonomy: "Nível 2 — planeja",
    },
  },
  {
    id: "ux",
    type: "agent",
    position: { x: 680, y: 160 },
    data: {
      label: "UX/UI",
      status: "CHANGES_REQUESTED",
      summary: "Resultado precisa ficar mais escaneável no mobile.",
      decision: "Solicitar ajuste no bloco de resultado.",
      risk: "Médio",
      autonomy: "Nível 5 — Lead pode aprovar se localizado",
    },
  },
  {
    id: "seo",
    type: "agent",
    position: { x: 680, y: 320 },
    data: {
      label: "SEO",
      status: "APPROVED_WITH_NOTES",
      summary: "Reforçar FAQ, H2s e texto indexável.",
      decision: "Aprovar com melhorias de conteúdo.",
      risk: "Baixo",
      autonomy: "Nível 5 — Lead pode aprovar",
    },
  },
  {
    id: "financeiro",
    type: "agent",
    position: { x: 680, y: 480 },
    data: {
      label: "Financeiro",
      status: "BLOCKED",
      summary: "Mudança em fórmula exige validação explícita.",
      decision: "Bloquear mudança em cálculo até validar cenários.",
      risk: "Alto",
      autonomy: "Nível 6 — Gerson aprova",
    },
  },
  {
    id: "arquiteto",
    type: "agent",
    position: { x: 1040, y: 100 },
    data: {
      label: "Arquiteto",
      status: "APPROVED",
      summary: "Pode ser feito no padrão atual do www, sem backend.",
      decision: "Aprovar HTML, CSS e JS puro.",
      risk: "Baixo",
      autonomy: "Nível 5 — Lead pode aprovar",
    },
  },
  {
    id: "desenvolvedor",
    type: "agent",
    position: { x: 1040, y: 340 },
    data: {
      label: "Desenvolvedor",
      status: "WAITING",
      summary: "Aguardando desbloqueio financeiro e plano visual.",
      decision: "Não implementar ainda.",
      risk: "Médio",
      autonomy: "Nível 3 — implementa em branch",
    },
  },
  {
    id: "revisor",
    type: "agent",
    position: { x: 1400, y: 70 },
    data: {
      label: "Revisor",
      status: "WAITING",
      summary: "Aguardando implementação para revisar consistência.",
      decision: "Aguardando.",
      risk: "Baixo",
      autonomy: "Nível 4 — revisa PR",
    },
  },
  {
    id: "qa",
    type: "agent",
    position: { x: 1400, y: 260 },
    data: {
      label: "QA",
      status: "WAITING",
      summary: "Deverá validar console, mobile, cálculo e regressões.",
      decision: "Aguardando implementação.",
      risk: "Médio",
      autonomy: "Nível 4 — valida PR",
    },
  },
  {
    id: "seguranca",
    type: "agent",
    position: { x: 1400, y: 450 },
    data: {
      label: "Segurança",
      status: "APPROVED",
      summary: "Sem dados pessoais, upload ou backend nesta mudança.",
      decision: "Aprovar sem scripts externos.",
      risk: "Baixo",
      autonomy: "Nível 5 — Lead pode aprovar",
    },
  },
  {
    id: "lead",
    type: "agent",
    position: { x: 1760, y: 260 },
    data: {
      label: "Studio Lead",
      status: "RUNNING",
      summary: "Consolidando bloqueio financeiro e ajustes solicitados.",
      decision: "Aguardando nova rodada antes de liberar implementação.",
      risk: "Médio",
      autonomy: "Define autonomia final",
    },
  },
  {
    id: "pr",
    type: "agent",
    position: { x: 2100, y: 180 },
    data: {
      label: "Pull Request",
      status: "WAITING",
      summary: "PR será criado após implementação e validações.",
      decision: "Aguardando.",
      risk: "Médio",
      autonomy: "Nível 4 — abre PR",
    },
  },
  {
    id: "gerson",
    type: "agent",
    position: { x: 2440, y: 180 },
    data: {
      label: "Gerson",
      status: "WAITING",
      summary: "Aprovação obrigatória se houver alteração em fórmula.",
      decision: "Aguardando decisão final.",
      risk: "Alto",
      autonomy: "Nível 6 — aprovação final",
    },
  },
];

const initialEdges: Edge[] = [
  makeEdge("entrada", "orquestrador"),
  makeEdge("orquestrador", "produto"),
  makeEdge("orquestrador", "ux"),
  makeEdge("orquestrador", "seo"),
  makeEdge("orquestrador", "financeiro"),
  makeEdge("produto", "arquiteto"),
  makeEdge("ux", "arquiteto"),
  makeEdge("seo", "arquiteto"),
  makeEdge("financeiro", "desenvolvedor", true),
  makeEdge("arquiteto", "desenvolvedor"),
  makeEdge("desenvolvedor", "revisor"),
  makeEdge("desenvolvedor", "qa"),
  makeEdge("desenvolvedor", "seguranca"),
  makeEdge("revisor", "lead"),
  makeEdge("qa", "lead"),
  makeEdge("seguranca", "lead"),
  makeEdge("lead", "pr"),
  makeEdge("pr", "gerson"),
];

function AppContent() {
  const [nodes, , onNodesChange] = useNodesState<AgentNodeType>(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState("lead");

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId],
  );

  const selected = selectedNode.data;

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

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[var(--green)] shadow-[0_0_18px_rgba(0,200,83,0.8)]" />
              <h1 className="text-xl font-semibold tracking-tight">Gelocci Studio</h1>
            </div>
            <p className="mt-1 text-sm text-white/45">
              Cockpit visual de agentes, decisões, bloqueios, PRs e aprovações.
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
              <strong>Regra de segurança:</strong> mudança em fórmula financeira exige aprovação do Gerson.
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-white/35">Próxima evolução</div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/65">
              <li>• Conectar o fluxo a um JSON real gerado pelo motor.</li>
              <li>• Ler achados do auditor e acionar agentes.</li>
              <li>• Criar decisões estruturadas por agente.</li>
              <li>• Gerar branch e PR para mudanças simples.</li>
            </ul>
          </div>
        </aside>
      </main>
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

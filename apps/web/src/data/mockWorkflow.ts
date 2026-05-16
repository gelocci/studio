import { MarkerType } from "@xyflow/react";
import type { Edge } from "@xyflow/react";
import type { AgentNodeType, WorkflowRun } from "../types/workflow";

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

const nodes: AgentNodeType[] = [
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

const edges: Edge[] = [
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

export const mockWorkflow: WorkflowRun = {
  id: "mock-black-scholes-001",
  title: "Melhorar página Black-Scholes",
  project: "www",
  status: "Em análise",
  summary:
    "Fluxo demonstrativo com agentes avaliando melhoria visual, SEO e bloqueio financeiro antes de implementação.",
  nodes,
  edges,
};

import type { Demand } from "../types/demand";

export const mockDemands: Demand[] = [
  {
    id: "demand-www-audit-css",
    title: "Revisar achados visuais do www",
    description:
      "Demanda gerada a partir do run-agents do projeto www, com foco em tokens CSS, tema, duplicidades e validações visuais.",
    project: "www",
    origin: "audit",
    priority: "Alta",
    status: "WAITING_APPROVAL",
    createdAt: "2026-05-16T15:32:52.344Z",
    workflowId: "latest",
  },
  {
    id: "demand-black-scholes",
    title: "Melhorar página Black-Scholes",
    description:
      "Revisar clareza, visual, SEO e validação financeira da ferramenta de Black-Scholes.",
    project: "www",
    origin: "manual",
    priority: "Média",
    status: "BACKLOG",
    createdAt: "2026-05-16T16:00:00.000Z",
  },
  {
    id: "demand-news-experiment",
    title: "Experimento: notícias financeiras",
    description:
      "Testar fluxo experimental de curadoria de notícias financeiras com agentes Curador, Financeiro, Redator, SEO e Revisor.",
    project: "www",
    origin: "news",
    priority: "Baixa",
    status: "BACKLOG",
    createdAt: "2026-05-16T16:10:00.000Z",
  },
  {
    id: "demand-asset-allocation",
    title: "Desenhar fluxo inicial do Asset Allocation",
    description:
      "Mapear primeira jornada do usuário para cadastro de lançamentos, carteira, rebalanceamento e visão consolidada.",
    project: "asset-allocation",
    origin: "manual",
    priority: "Média",
    status: "TRIAGE",
    createdAt: "2026-05-16T16:20:00.000Z",
  },
];

import type {
  AgentStatus,
  Finding,
  RiskLabel,
  WorkflowEdge,
  WorkflowNode,
  WorkflowRunFile
} from "../../types/workflow-run.js";

export interface BuildWorkflowInput {
  projectName: string;
  projectPath: string;
  generatedAt: Date;
  findings: Finding[];
}

export function buildWorkflowFromFindings(input: BuildWorkflowInput): WorkflowRunFile {
  const highestRisk = getHighestRisk(input.findings);
  const hasHighRisk = highestRisk === "Alto";
  const hasMediumRisk = highestRisk === "Médio";

  const agents = getRecommendedAgents(input.findings);

  const nodes: WorkflowNode[] = [
    agentNode("entrada", 0, 180, {
      label: "Entrada",
      status: "APPROVED",
      summary: `Achados recebidos do projeto ${input.projectName}.`,
      decision: `${input.findings.length} achado(s) encaminhado(s) para orquestração.`,
      risk: highestRisk,
      autonomy: "Nível 1 — recomenda"
    }),
    agentNode("orquestrador", 320, 180, {
      label: "Orquestrador",
      status: "APPROVED",
      summary: "Classificou os achados e selecionou agentes para análise.",
      decision: `Agentes convocados: ${agents.join(", ")}.`,
      risk: highestRisk,
      autonomy: "Nível 2 — planeja"
    }),
    agentNode("arquiteto", 680, 20, {
      label: "Arquiteto",
      status: agentStatus(agents.includes("arquiteto"), hasMediumRisk || hasHighRisk),
      summary: "Avalia tokens, duplicações, especificidade e aderência ao design system.",
      decision: decisionFor("arquiteto", agents, input.findings),
      risk: hasHighRisk ? "Alto" : "Médio",
      autonomy: "Nível 2 — planeja"
    }),
    agentNode("ux-ui", 680, 190, {
      label: "UX/UI",
      status: agentStatus(agents.includes("ux-ui"), false),
      summary: "Avalia impacto visual, tema claro/escuro, gráficos e consistência.",
      decision: decisionFor("ux-ui", agents, input.findings),
      risk: hasHighRisk ? "Alto" : "Médio",
      autonomy: "Nível 2 — planeja"
    }),
    agentNode("revisor", 680, 360, {
      label: "Revisor",
      status: agentStatus(agents.includes("revisor"), false),
      summary: "Avalia duplicidades e necessidade de refatoração segura.",
      decision: decisionFor("revisor", agents, input.findings),
      risk: hasMediumRisk || hasHighRisk ? "Médio" : "Baixo",
      autonomy: "Nível 4 — revisa PR"
    }),
    agentNode("qa", 1040, 100, {
      label: "QA",
      status: agentStatus(agents.includes("qa"), hasHighRisk),
      summary: "Define validações necessárias para tema, gráficos e regressões.",
      decision: decisionFor("qa", agents, input.findings),
      risk: hasHighRisk ? "Alto" : "Médio",
      autonomy: "Nível 4 — valida PR"
    }),
    agentNode("desenvolvedor", 1040, 310, {
      label: "Desenvolvedor",
      status: hasHighRisk ? "WAITING" : "APPROVED_WITH_NOTES",
      summary: hasHighRisk
        ? "Aguardando decisão dos agentes antes de implementação."
        : "Pode preparar plano de ajuste em branch, se aprovado.",
      decision: hasHighRisk
        ? "Não implementar enquanto houver achado de alto risco."
        : "Preparar plano técnico sem alterar main.",
      risk: hasHighRisk ? "Alto" : "Médio",
      autonomy: "Nível 3 — implementa em branch"
    }),
    agentNode("lead", 1400, 210, {
      label: "Studio Lead",
      status: hasHighRisk ? "BLOCKED" : hasMediumRisk ? "CHANGES_REQUESTED" : "APPROVED_WITH_NOTES",
      summary: hasHighRisk
        ? "Há achado de alto risco. Escalar para Gerson antes de execução."
        : "Consolida pareceres e define autonomia permitida.",
      decision: hasHighRisk
        ? "Bloquear execução automática."
        : "Permitir planejamento e eventual PR de baixo risco.",
      risk: highestRisk,
      autonomy: hasHighRisk ? "Nível 6 — Gerson aprova" : "Nível 5 — Lead pode aprovar se simples"
    }),
    agentNode("pr", 1720, 210, {
      label: "Pull Request",
      status: "WAITING",
      summary: "PR será criado apenas após plano e implementação em branch.",
      decision: "Aguardando etapa de implementação.",
      risk: highestRisk,
      autonomy: "Nível 4 — abre PR"
    }),
    agentNode("gerson", 2040, 210, {
      label: "Gerson",
      status: hasHighRisk ? "RUNNING" : "WAITING",
      summary: hasHighRisk
        ? "Aprovação necessária para achado de alto risco."
        : "Aguardando eventual aprovação final.",
      decision: hasHighRisk ? "Decisão humana obrigatória." : "Sem ação obrigatória no momento.",
      risk: highestRisk,
      autonomy: "Nível 6 — aprovação final"
    })
  ];

  const edges: WorkflowEdge[] = [
    edge("entrada", "orquestrador"),
    edge("orquestrador", "arquiteto"),
    edge("orquestrador", "ux-ui"),
    edge("orquestrador", "revisor"),
    edge("arquiteto", "qa"),
    edge("ux-ui", "qa"),
    edge("revisor", "desenvolvedor"),
    edge("qa", "lead", hasHighRisk),
    edge("desenvolvedor", "lead"),
    edge("lead", "pr"),
    edge("pr", "gerson")
  ];

  return {
    id: `run-${input.projectName}-${input.generatedAt.toISOString()}`,
    title: `Execução de agentes — ${input.projectName}`,
    project: input.projectName,
    status: hasHighRisk ? "Bloqueado para aprovação" : hasMediumRisk ? "Mudanças solicitadas" : "Em análise",
    summary: summarizeFindings(input.findings),
    generatedAt: input.generatedAt.toISOString(),
    source: {
      projectPath: input.projectPath,
      engine: "gelocci-studio-rule-engine-v0"
    },
    findings: input.findings,
    nodes,
    edges
  };
}

function getRecommendedAgents(findings: Finding[]): string[] {
  return Array.from(
    new Set(findings.flatMap((finding) => finding.recommendedAgents))
  ).sort((a, b) => a.localeCompare(b));
}

function getHighestRisk(findings: Finding[]): RiskLabel {
  if (findings.some((finding) => finding.severity === "HIGH")) {
    return "Alto";
  }

  if (findings.some((finding) => finding.severity === "MEDIUM")) {
    return "Médio";
  }

  return "Baixo";
}

function agentStatus(isRecommended: boolean, hasBlockingConcern: boolean): AgentStatus {
  if (!isRecommended) {
    return "WAITING";
  }

  if (hasBlockingConcern) {
    return "CHANGES_REQUESTED";
  }

  return "APPROVED_WITH_NOTES";
}

function decisionFor(agent: string, agents: string[], findings: Finding[]): string {
  if (!agents.includes(agent)) {
    return "Não convocado nesta rodada.";
  }

  const related = findings.filter((finding) => finding.recommendedAgents.includes(agent));

  if (related.some((finding) => finding.severity === "HIGH")) {
    return "Solicitar correção antes de qualquer implementação.";
  }

  if (related.some((finding) => finding.severity === "MEDIUM")) {
    return "Solicitar plano de ajuste controlado.";
  }

  return "Aprovar com observações e acompanhar evolução.";
}

function summarizeFindings(findings: Finding[]): string {
  const high = findings.filter((finding) => finding.severity === "HIGH").length;
  const medium = findings.filter((finding) => finding.severity === "MEDIUM").length;
  const low = findings.filter((finding) => finding.severity === "LOW").length;

  return `Achados classificados: ${high} alto(s), ${medium} médio(s), ${low} baixo(s).`;
}

function agentNode(
  id: string,
  x: number,
  y: number,
  data: WorkflowNode["data"]
): WorkflowNode {
  return {
    id,
    type: "agent",
    position: { x, y },
    data
  };
}

function edge(source: string, target: string, blocked = false): WorkflowEdge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    animated: blocked,
    blocked
  };
}

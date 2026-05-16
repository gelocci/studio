import type {
  AgentStatus,
  Finding,
  RequiredApproval,
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
    agentNode("entrada", 0, 180, buildEntradaData(input.findings, highestRisk)),
    agentNode("orquestrador", 320, 180, buildOrquestradorData(input.findings, agents, highestRisk)),
    agentNode("arquiteto", 680, 20, buildAgentData("arquiteto", "Arquiteto", agents, input.findings, hasMediumRisk || hasHighRisk)),
    agentNode("ux-ui", 680, 190, buildAgentData("ux-ui", "UX/UI", agents, input.findings, false)),
    agentNode("revisor", 680, 360, buildAgentData("revisor", "Revisor", agents, input.findings, false)),
    agentNode("qa", 1040, 100, buildAgentData("qa", "QA", agents, input.findings, hasHighRisk)),
    agentNode("desenvolvedor", 1040, 310, buildDesenvolvedorData(input.findings, highestRisk)),
    agentNode("lead", 1400, 210, buildLeadData(input.findings, highestRisk)),
    agentNode("pr", 1720, 210, {
      label: "Pull Request",
      status: "WAITING",
      summary: "PR será criado apenas após plano e implementação em branch.",
      decision: "Aguardando etapa de implementação.",
      risk: highestRisk,
      autonomy: "Nível 4 — abre PR",
      analysis: [
        "Ainda não existe implementação aprovada para gerar PR.",
        "O PR deverá conter checklist, riscos, evidências e agentes envolvidos."
      ],
      risks: hasHighRisk ? ["PR bloqueado enquanto houver risco alto sem aprovação."] : [],
      recommendations: ["Gerar PR apenas a partir de branch dedicada."],
      requiredApproval: hasHighRisk ? "GERSON" : "STUDIO_LEAD",
      nextActions: ["Aguardar plano técnico e implementação controlada."]
    }),
    agentNode("gerson", 2040, 210, {
      label: "Gerson",
      status: hasHighRisk ? "RUNNING" : "WAITING",
      summary: hasHighRisk ? "Aprovação necessária para achado de alto risco." : "Aguardando eventual aprovação final.",
      decision: hasHighRisk ? "Decisão humana obrigatória." : "Sem ação obrigatória no momento.",
      risk: highestRisk,
      autonomy: "Nível 6 — aprovação final",
      analysis: hasHighRisk
        ? ["Existe pelo menos um achado de alto risco.", "A política de autonomia exige aprovação humana."]
        : ["Não há aprovação obrigatória do Gerson nesta fase."],
      risks: hasHighRisk ? ["Execução automática poderia aplicar mudança sensível sem validação."] : [],
      recommendations: hasHighRisk ? ["Revisar achados antes de liberar implementação."] : ["Acompanhar se o Studio Lead solicitar escalonamento."],
      requiredApproval: hasHighRisk ? "GERSON" : "NONE",
      nextActions: hasHighRisk ? ["Aprovar, rejeitar ou solicitar nova análise."] : ["Aguardar."]
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
      engine: "gelocci-studio-rule-engine-v1"
    },
    findings: input.findings,
    nodes,
    edges
  };
}

function buildEntradaData(findings: Finding[], highestRisk: RiskLabel): WorkflowNode["data"] {
  return {
    label: "Entrada",
    status: "APPROVED",
    summary: `Achados recebidos do projeto. Total: ${findings.length}.`,
    decision: `${findings.length} achado(s) encaminhado(s) para orquestração.`,
    risk: highestRisk,
    autonomy: "Nível 1 — recomenda",
    analysis: findings.map((finding) => `${finding.title}: ${finding.summary}`),
    risks: findings.filter((finding) => finding.severity === "HIGH").map((finding) => finding.title),
    recommendations: ["Encaminhar achados para o Orquestrador classificar agentes e risco."],
    requiredApproval: "NONE",
    nextActions: ["Classificar demanda.", "Selecionar agentes.", "Gerar fluxo visual."]
  };
}

function buildOrquestradorData(findings: Finding[], agents: string[], highestRisk: RiskLabel): WorkflowNode["data"] {
  const hasHigh = findings.some((finding) => finding.severity === "HIGH");

  return {
    label: "Orquestrador",
    status: "APPROVED",
    summary: "Classificou os achados e selecionou agentes para análise.",
    decision: `Agentes convocados: ${agents.join(", ")}.`,
    risk: highestRisk,
    autonomy: "Nível 2 — planeja",
    analysis: [
      `Achados classificados: ${summarizeFindings(findings)}.`,
      `Agentes recomendados pelo motor: ${agents.join(", ")}.`
    ],
    risks: hasHigh ? ["Há pelo menos um achado de alto risco."] : [],
    recommendations: [
      "Encaminhar achados para agentes especializados.",
      "Manter execução bloqueada se algum agente essencial bloquear."
    ],
    requiredApproval: hasHigh ? "GERSON" : "STUDIO_LEAD",
    nextActions: ["Coletar pareceres dos agentes.", "Consolidar decisão para Studio Lead."]
  };
}

function buildAgentData(
  agentId: string,
  label: string,
  agents: string[],
  findings: Finding[],
  hasBlockingConcern: boolean
): WorkflowNode["data"] {
  const related = findings.filter((finding) => finding.recommendedAgents.includes(agentId));
  const isRecommended = agents.includes(agentId);

  if (!isRecommended) {
    return {
      label,
      status: "WAITING",
      summary: "Agente não foi convocado nesta rodada.",
      decision: "Aguardando nova demanda.",
      risk: "Baixo",
      autonomy: "Nível 1 — observa",
      analysis: ["Nenhum achado exigiu a participação deste agente."],
      risks: [],
      recommendations: [],
      requiredApproval: "NONE",
      nextActions: ["Aguardar."]
    };
  }

  const hasHigh = related.some((finding) => finding.severity === "HIGH");
  const hasMedium = related.some((finding) => finding.severity === "MEDIUM");

  return {
    label,
    status: agentStatus(isRecommended, hasBlockingConcern || hasHigh),
    summary: summaryForAgent(agentId, related),
    decision: decisionFor(agentId, agents, findings),
    risk: hasHigh ? "Alto" : hasMedium ? "Médio" : "Baixo",
    autonomy: hasHigh ? "Nível 6 — Gerson aprova" : hasMedium ? "Nível 5 — Studio Lead aprova se simples" : "Nível 2 — planeja",
    analysis: related.map((finding) => `${finding.title}: ${finding.summary}`),
    risks: related
      .filter((finding) => finding.severity !== "LOW")
      .map((finding) => `${riskName(finding.severity)} — ${finding.title}`),
    recommendations: recommendationsForAgent(agentId, related),
    requiredApproval: hasHigh ? "GERSON" : hasMedium ? "STUDIO_LEAD" : "NONE",
    nextActions: nextActionsForAgent(agentId, related)
  };
}

function buildDesenvolvedorData(findings: Finding[], highestRisk: RiskLabel): WorkflowNode["data"] {
  const hasHigh = highestRisk === "Alto";
  const hasMedium = highestRisk === "Médio";

  return {
    label: "Desenvolvedor",
    status: hasHigh ? "WAITING" : "APPROVED_WITH_NOTES",
    summary: hasHigh
      ? "Aguardando decisão dos agentes antes de implementação."
      : "Pode preparar plano de ajuste em branch, se aprovado.",
    decision: hasHigh
      ? "Não implementar enquanto houver achado de alto risco."
      : "Preparar plano técnico sem alterar main.",
    risk: highestRisk,
    autonomy: "Nível 3 — implementa em branch",
    analysis: [
      `A execução possui ${findings.length} achado(s).`,
      hasHigh
        ? "Há risco alto: implementação automática bloqueada."
        : "Não há risco alto: pode ser preparado plano de ajuste em branch."
    ],
    risks: hasHigh ? ["Implementar agora violaria a política de autonomia."] : [],
    recommendations: hasHigh
      ? ["Aguardar decisão do Gerson antes de alterar arquivos."]
      : ["Gerar plano técnico com arquivos afetados.", "Criar branch dedicada antes de implementar."],
    requiredApproval: hasHigh ? "GERSON" : hasMedium ? "STUDIO_LEAD" : "NONE",
    nextActions: hasHigh
      ? ["Aguardar aprovação."]
      : ["Preparar plano de implementação.", "Sugerir nome de branch.", "Listar arquivos afetados."]
  };
}

function buildLeadData(findings: Finding[], highestRisk: RiskLabel): WorkflowNode["data"] {
  const hasHigh = highestRisk === "Alto";
  const hasMedium = highestRisk === "Médio";

  return {
    label: "Studio Lead",
    status: hasHigh ? "BLOCKED" : hasMedium ? "CHANGES_REQUESTED" : "APPROVED_WITH_NOTES",
    summary: hasHigh
      ? "Há achado de alto risco. Escalar para Gerson antes de execução."
      : "Consolida pareceres e define autonomia permitida.",
    decision: hasHigh
      ? "Bloquear execução automática."
      : hasMedium
        ? "Solicitar plano controlado antes de implementar."
        : "Permitir avanço com observações.",
    risk: highestRisk,
    autonomy: hasHigh ? "Nível 6 — Gerson aprova" : "Nível 5 — Lead pode aprovar se simples",
    analysis: [
      `Resumo da execução: ${summarizeFindings(findings)}.`,
      hasHigh
        ? "A política de autonomia exige bloqueio."
        : "A execução pode avançar para planejamento controlado."
    ],
    risks: hasHigh
      ? findings.filter((finding) => finding.severity === "HIGH").map((finding) => finding.title)
      : [],
    recommendations: hasHigh
      ? ["Escalar para aprovação do Gerson.", "Não criar PR ainda."]
      : ["Permitir plano técnico.", "Exigir validação antes de PR."],
    requiredApproval: hasHigh ? "GERSON" : hasMedium ? "STUDIO_LEAD" : "NONE",
    nextActions: hasHigh
      ? ["Solicitar decisão do Gerson."]
      : ["Autorizar planejamento.", "Aguardar proposta do Desenvolvedor."]
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

function summaryForAgent(agent: string, findings: Finding[]): string {
  if (findings.length === 0) {
    return "Nenhum achado relacionado.";
  }

  const names: Record<string, string> = {
    arquiteto: "Avalia estrutura CSS, tokens, duplicações e aderência ao design system.",
    "ux-ui": "Avalia impacto visual, tema claro/escuro, gráficos e consistência.",
    revisor: "Avalia duplicidades, clareza e necessidade de refatoração segura.",
    qa: "Define validações necessárias para tema, gráficos e regressões.",
    desenvolvedor: "Prepara plano técnico e implementação em branch."
  };

  return names[agent] ?? "Avalia achados relacionados ao seu papel.";
}

function recommendationsForAgent(agent: string, findings: Finding[]): string[] {
  const base = findings.map((finding) => `Avaliar: ${finding.title}.`);

  const extra: Record<string, string[]> = {
    arquiteto: ["Definir tokens canônicos antes de refatorar.", "Evitar mudança ampla sem plano."],
    "ux-ui": ["Validar tema claro e escuro.", "Verificar contraste e consistência visual."],
    revisor: ["Evitar remoção automática de regras sem teste.", "Revisar impacto em páginas existentes."],
    qa: ["Testar páginas principais.", "Validar console, tema e responsividade."],
    desenvolvedor: ["Criar branch dedicada.", "Alterar apenas arquivos do escopo."]
  };

  return [...base, ...(extra[agent] ?? [])];
}

function nextActionsForAgent(agent: string, findings: Finding[]): string[] {
  if (findings.some((finding) => finding.severity === "HIGH")) {
    return ["Solicitar aprovação antes de implementação.", "Registrar risco no fluxo."];
  }

  const defaults: Record<string, string[]> = {
    arquiteto: ["Propor consolidação segura de tokens."],
    "ux-ui": ["Listar pontos visuais para validação."],
    revisor: ["Preparar checklist de revisão."],
    qa: ["Preparar checklist de testes."],
    desenvolvedor: ["Preparar plano técnico."]
  };

  return defaults[agent] ?? ["Aguardar consolidação do Orquestrador."];
}

function summarizeFindings(findings: Finding[]): string {
  const high = findings.filter((finding) => finding.severity === "HIGH").length;
  const medium = findings.filter((finding) => finding.severity === "MEDIUM").length;
  const low = findings.filter((finding) => finding.severity === "LOW").length;

  return `${high} alto(s), ${medium} médio(s), ${low} baixo(s)`;
}

function riskName(risk: Finding["severity"]): string {
  if (risk === "HIGH") return "Alto";
  if (risk === "MEDIUM") return "Médio";
  return "Baixo";
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

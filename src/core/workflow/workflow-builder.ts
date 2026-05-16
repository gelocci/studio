import type {
  AgentStatus,
  Finding,
  RiskLabel,
  WorkflowEdge,
  WorkflowEdgeKind,
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
    agentNode("entrada", 0, 320, buildEntradaData(input.findings, highestRisk)),
    agentNode("orquestrador", 340, 320, buildOrquestradorData(input.findings, agents, highestRisk)),

    agentNode("produto", 760, 0, buildBusinessAgentData("produto", "Produto", agents, input.findings, "Avalia valor, prioridade e impacto para o usuário.")),
    agentNode("ux-ui", 760, 210, buildAgentData("ux-ui", "UX/UI", agents, input.findings, false)),
    agentNode("seo", 760, 420, buildBusinessAgentData("seo", "SEO", agents, input.findings, "Avalia conteúdo indexável, headings, FAQ e intenção de busca.")),
    agentNode("financeiro", 760, 630, buildBusinessAgentData("financeiro", "Financeiro", agents, input.findings, "Valida risco de fórmula, premissas e conceitos financeiros.", hasHighRisk)),
    agentNode("seguranca", 760, 840, buildBusinessAgentData("seguranca", "Segurança", agents, input.findings, "Avalia privacidade, scripts externos, dados e riscos de exposição.")),

    agentNode("arquiteto", 1180, 210, buildAgentData("arquiteto", "Arquiteto", agents, input.findings, hasMediumRisk || hasHighRisk)),
    agentNode("lead-triagem", 1560, 320, buildLeadTriagemData(input.findings, highestRisk)),

    agentNode("desenvolvedor", 1940, 320, buildDesenvolvedorData(input.findings, highestRisk)),

    agentNode("revisor", 2320, 110, buildAgentData("revisor", "Revisor", agents, input.findings, false)),
    agentNode("qa", 2320, 320, buildAgentData("qa", "QA", agents, input.findings, hasHighRisk)),
    agentNode("seguranca-validacao", 2320, 530, buildValidationAgentData("seguranca-validacao", "Segurança", highestRisk, "Valida se a implementação manteve privacidade, ausência de segredos e segurança.")),
    agentNode("financeiro-validacao", 2320, 740, buildValidationAgentData("financeiro-validacao", "Financeiro", highestRisk, "Valida se nenhuma fórmula ou premissa financeira foi alterada indevidamente.")),

    agentNode("lead-final", 2700, 320, buildLeadFinalData(input.findings, highestRisk)),
    agentNode("pr", 3080, 320, buildPrData(highestRisk, hasHighRisk)),
    agentNode("gerson", 3460, 320, buildGersonData(highestRisk, hasHighRisk))
  ];

  const edges: WorkflowEdge[] = [
    edge("entrada", "orquestrador", "forward", "nova demanda"),
    edge("orquestrador", "produto", "forward", "valor"),
    edge("orquestrador", "ux-ui", "forward", "experiência"),
    edge("orquestrador", "seo", "forward", "SEO"),
    edge("orquestrador", "financeiro", hasHighRisk ? "block" : "forward", "risco financeiro"),
    edge("orquestrador", "seguranca", "forward", "segurança"),
    edge("orquestrador", "arquiteto", "forward", "arquitetura"),

    edge("produto", "lead-triagem", "forward"),
    edge("ux-ui", "lead-triagem", "forward"),
    edge("seo", "lead-triagem", "forward"),
    edge("financeiro", "lead-triagem", hasHighRisk ? "block" : "forward"),
    edge("seguranca", "lead-triagem", "forward"),
    edge("arquiteto", "lead-triagem", "forward"),

    edge("ux-ui", "arquiteto", "rework", "ajustar solução visual"),
    edge("lead-triagem", "orquestrador", "rework", "reclassificar"),
    edge("lead-triagem", "arquiteto", "rework", "rever arquitetura"),

    edge("lead-triagem", "desenvolvedor", hasHighRisk ? "block" : "forward", "liberar implementação"),

    edge("desenvolvedor", "revisor", "forward", "revisão"),
    edge("desenvolvedor", "qa", "forward", "testes"),
    edge("desenvolvedor", "seguranca-validacao", "forward", "validar segurança"),
    edge("desenvolvedor", "financeiro-validacao", hasHighRisk ? "block" : "forward", "validar cálculo"),

    edge("revisor", "lead-final", "forward"),
    edge("qa", "lead-final", hasHighRisk ? "block" : "forward"),
    edge("seguranca-validacao", "lead-final", "forward"),
    edge("financeiro-validacao", "lead-final", hasHighRisk ? "block" : "forward"),

    edge("qa", "desenvolvedor", "rework", "corrigir falha"),
    edge("revisor", "desenvolvedor", "rework", "ajustar código"),
    edge("seguranca-validacao", "desenvolvedor", "rework", "corrigir segurança"),
    edge("financeiro-validacao", "desenvolvedor", "block", "corrigir cálculo"),
    edge("lead-final", "desenvolvedor", "rework", "ajustar escopo"),

    edge("lead-final", "pr", hasHighRisk ? "block" : "forward", "criar PR"),
    edge("pr", "gerson", "approval", "aprovação"),
    edge("gerson", "lead-final", "rework", "devolver para ajustes")
  ];

  return {
    id: `run-${input.projectName}-${input.generatedAt.toISOString()}`,
    title: `Execução de agentes — ${input.projectName}`,
    project: input.projectName,
    status: hasHighRisk ? "Aguardando aprovação" : hasMediumRisk ? "Mudanças solicitadas" : "Em análise",
    summary: summarizeFindings(input.findings),
    generatedAt: input.generatedAt.toISOString(),
    source: {
      projectPath: input.projectPath,
      engine: "gelocci-studio-rule-engine-v2"
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
    decision: `Agentes convocados: ${agents.length > 0 ? agents.join(", ") : "studio-lead"}.`,
    risk: highestRisk,
    autonomy: "Nível 2 — planeja",
    analysis: [
      `Achados classificados: ${summarizeFindings(findings)}.`,
      `Agentes recomendados pelo motor: ${agents.length > 0 ? agents.join(", ") : "studio-lead"}.`
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

function buildBusinessAgentData(
  agentId: string,
  label: string,
  agents: string[],
  findings: Finding[],
  defaultSummary: string,
  forceHighRisk = false
): WorkflowNode["data"] {
  const related = findings.filter((finding) => finding.recommendedAgents.includes(agentId));
  const isRecommended = agents.includes(agentId) || forceHighRisk;
  const hasHigh = forceHighRisk || related.some((finding) => finding.severity === "HIGH");
  const hasMedium = related.some((finding) => finding.severity === "MEDIUM");

  return {
    label,
    status: isRecommended ? agentStatus(true, hasHigh) : "WAITING",
    summary: isRecommended ? defaultSummary : "Agente não foi convocado nesta rodada.",
    decision: isRecommended ? decisionFor(agentId, agents, findings, forceHighRisk) : "Aguardando nova demanda.",
    risk: hasHigh ? "Alto" : hasMedium ? "Médio" : "Baixo",
    autonomy: hasHigh ? "Nível 6 — Gerson aprova" : hasMedium ? "Nível 5 — Studio Lead aprova se simples" : "Nível 2 — planeja",
    analysis: related.length > 0 ? related.map((finding) => `${finding.title}: ${finding.summary}`) : ["Nenhum achado específico para este agente nesta rodada."],
    risks: related.filter((finding) => finding.severity !== "LOW").map((finding) => `${riskName(finding.severity)} — ${finding.title}`),
    recommendations: related.length > 0 ? recommendationsForAgent(agentId, related) : [],
    requiredApproval: hasHigh ? "GERSON" : hasMedium ? "STUDIO_LEAD" : "NONE",
    nextActions: hasHigh ? ["Escalar para aprovação antes de implementação."] : ["Encaminhar parecer ao Studio Lead."]
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
    summary: summaryForAgent(agentId),
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

function buildLeadTriagemData(findings: Finding[], highestRisk: RiskLabel): WorkflowNode["data"] {
  const hasHigh = highestRisk === "Alto";
  const hasMedium = highestRisk === "Médio";

  return {
    label: "Studio Lead",
    status: hasHigh ? "BLOCKED" : hasMedium ? "CHANGES_REQUESTED" : "APPROVED_WITH_NOTES",
    summary: "Consolida pareceres iniciais antes de liberar implementação.",
    decision: hasHigh ? "Bloquear implementação automática." : hasMedium ? "Solicitar plano controlado." : "Permitir planejamento.",
    risk: highestRisk,
    autonomy: hasHigh ? "Nível 6 — Gerson aprova" : "Nível 5 — Lead pode aprovar se simples",
    analysis: [`Resumo da triagem: ${summarizeFindings(findings)}.`],
    risks: hasHigh ? findings.filter((finding) => finding.severity === "HIGH").map((finding) => finding.title) : [],
    recommendations: hasHigh ? ["Escalar risco alto antes de implementar."] : ["Liberar planejamento técnico em branch."],
    requiredApproval: hasHigh ? "GERSON" : hasMedium ? "STUDIO_LEAD" : "NONE",
    nextActions: hasHigh ? ["Solicitar decisão do Gerson."] : ["Encaminhar para Desenvolvedor."]
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
      hasHigh ? "Há risco alto: implementação automática bloqueada." : "Pode ser preparado plano em branch."
    ],
    risks: hasHigh ? ["Implementar agora violaria a política de autonomia."] : [],
    recommendations: hasHigh ? ["Aguardar decisão do Gerson antes de alterar arquivos."] : ["Criar branch dedicada.", "Alterar apenas arquivos do escopo."],
    requiredApproval: hasHigh ? "GERSON" : hasMedium ? "STUDIO_LEAD" : "NONE",
    nextActions: hasHigh ? ["Aguardar aprovação."] : ["Preparar plano de implementação.", "Sugerir branch.", "Listar arquivos afetados."]
  };
}

function buildValidationAgentData(agentId: string, label: string, highestRisk: RiskLabel, summary: string): WorkflowNode["data"] {
  const hasHigh = highestRisk === "Alto";

  return {
    label,
    status: hasHigh && agentId.includes("financeiro") ? "BLOCKED" : "WAITING",
    summary,
    decision: hasHigh && agentId.includes("financeiro") ? "Bloquear validação até aprovação do Gerson." : "Aguardar implementação.",
    risk: hasHigh ? "Alto" : "Médio",
    autonomy: hasHigh ? "Nível 6 — Gerson aprova" : "Nível 4 — valida PR",
    analysis: ["Validação será executada após implementação em branch."],
    risks: hasHigh ? ["Há risco alto pendente."] : [],
    recommendations: ["Validar somente após implementação controlada."],
    requiredApproval: hasHigh && agentId.includes("financeiro") ? "GERSON" : "STUDIO_LEAD",
    nextActions: ["Aguardar implementação."]
  };
}

function buildLeadFinalData(findings: Finding[], highestRisk: RiskLabel): WorkflowNode["data"] {
  const hasHigh = highestRisk === "Alto";
  const hasMedium = highestRisk === "Médio";

  return {
    label: "Studio Lead",
    status: hasHigh ? "BLOCKED" : hasMedium ? "CHANGES_REQUESTED" : "APPROVED_WITH_NOTES",
    summary: "Consolida revisão, QA, segurança e validação financeira antes do PR.",
    decision: hasHigh ? "Não liberar PR." : "Liberar PR se validações passarem.",
    risk: highestRisk,
    autonomy: hasHigh ? "Nível 6 — Gerson aprova" : "Nível 5 — Lead pode aprovar se simples",
    analysis: [`Resumo final: ${summarizeFindings(findings)}.`],
    risks: hasHigh ? findings.filter((finding) => finding.severity === "HIGH").map((finding) => finding.title) : [],
    recommendations: hasHigh ? ["Escalar para Gerson.", "Não criar PR ainda."] : ["Criar PR com evidências."],
    requiredApproval: hasHigh ? "GERSON" : hasMedium ? "STUDIO_LEAD" : "NONE",
    nextActions: hasHigh ? ["Solicitar decisão do Gerson."] : ["Autorizar criação de PR."]
  };
}

function buildPrData(highestRisk: RiskLabel, hasHighRisk: boolean): WorkflowNode["data"] {
  return {
    label: "Pull Request",
    status: "WAITING",
    summary: "PR será criado apenas após plano e implementação em branch.",
    decision: "Aguardando etapa de implementação.",
    risk: highestRisk,
    autonomy: "Nível 4 — abre PR",
    analysis: ["PR deve conter checklist, riscos, evidências e agentes envolvidos."],
    risks: hasHighRisk ? ["PR bloqueado enquanto houver risco alto sem aprovação."] : [],
    recommendations: ["Gerar PR apenas a partir de branch dedicada."],
    requiredApproval: hasHighRisk ? "GERSON" : "STUDIO_LEAD",
    nextActions: ["Aguardar plano técnico e implementação controlada."]
  };
}

function buildGersonData(highestRisk: RiskLabel, hasHighRisk: boolean): WorkflowNode["data"] {
  return {
    label: "Gerson",
    status: "WAITING",
    summary: hasHighRisk ? "Aprovação pendente para achado de alto risco." : "Aguardando eventual aprovação final.",
    decision: hasHighRisk ? "Decisão humana obrigatória antes de avançar." : "Sem ação obrigatória no momento.",
    risk: highestRisk,
    autonomy: "Nível 6 — aprovação final",
    analysis: hasHighRisk ? ["Existe pelo menos um achado de alto risco.", "A política de autonomia exige aprovação humana."] : ["Não há aprovação obrigatória do Gerson nesta fase."],
    risks: hasHighRisk ? ["Execução automática poderia aplicar mudança sensível sem validação."] : [],
    recommendations: hasHighRisk ? ["Revisar achados antes de liberar implementação."] : ["Acompanhar se o Studio Lead solicitar escalonamento."],
    requiredApproval: hasHighRisk ? "GERSON" : "NONE",
    nextActions: hasHighRisk ? ["Aprovar, rejeitar ou solicitar nova análise."] : ["Aguardar."]
  };
}

function getRecommendedAgents(findings: Finding[]): string[] {
  return Array.from(new Set(findings.flatMap((finding) => finding.recommendedAgents))).sort((a, b) => a.localeCompare(b));
}

function getHighestRisk(findings: Finding[]): RiskLabel {
  if (findings.some((finding) => finding.severity === "HIGH")) return "Alto";
  if (findings.some((finding) => finding.severity === "MEDIUM")) return "Médio";
  return "Baixo";
}

function agentStatus(isRecommended: boolean, hasBlockingConcern: boolean): AgentStatus {
  if (!isRecommended) return "WAITING";
  if (hasBlockingConcern) return "CHANGES_REQUESTED";
  return "APPROVED_WITH_NOTES";
}

function decisionFor(agent: string, agents: string[], findings: Finding[], forceHighRisk = false): string {
  const related = findings.filter((finding) => finding.recommendedAgents.includes(agent));

  if (!agents.includes(agent) && !forceHighRisk) return "Não convocado nesta rodada.";
  if (forceHighRisk || related.some((finding) => finding.severity === "HIGH")) return "Solicitar correção antes de qualquer implementação.";
  if (related.some((finding) => finding.severity === "MEDIUM")) return "Solicitar plano de ajuste controlado.";
  return "Aprovar com observações e acompanhar evolução.";
}

function summaryForAgent(agent: string): string {
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

function agentNode(id: string, x: number, y: number, data: WorkflowNode["data"]): WorkflowNode {
  return {
    id,
    type: "agent",
    position: { x, y },
    data
  };
}

function edge(source: string, target: string, kind: WorkflowEdgeKind = "forward", label?: string): WorkflowEdge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    animated: kind === "block",
    blocked: kind === "block",
    kind,
    label
  };
}

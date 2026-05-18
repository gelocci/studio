import type { Demand } from "@prisma/client";
import type { RequiredApproval } from "@gelocci/studio-workflow";

type AgentStatus =
  | "WAITING"
  | "RUNNING"
  | "APPROVED"
  | "APPROVED_WITH_NOTES"
  | "CHANGES_REQUESTED"
  | "BLOCKED"
  | "PR_CREATED";

type RiskLabel = "Baixo" | "Médio" | "Alto";

type ComplexityLabel = "Baixa" | "Média" | "Alta" | "Desconhecida";

type WorkflowEdgeKind = "forward" | "rework" | "block" | "approval";

type DemandCategory =
  | "PRODUCT"
  | "UX_UI"
  | "CONTENT_SEO"
  | "FINANCIAL"
  | "TECHNICAL"
  | "SECURITY"
  | "QA"
  | "PUBLICATION"
  | "NEWS"
  | "CONTACT"
  | "OTHER_99";

interface AgentDefinition {
  id: string;
  label: string;
  reviewerId?: string;
  reviewerLabel?: string;
}

interface DemandClassification {
  category: DemandCategory;
  categoryCode: string;
  categoryLabel: string;
  complexity: ComplexityLabel;
  risk: RiskLabel;
  executorAgents: AgentDefinition[];
  reviewerAgents: AgentDefinition[];
  supportAgents: AgentDefinition[];
  requiresQa: boolean;
  requiresGerson: boolean;
  requiresPr: boolean;
  fallbackCategory: boolean;
  reason: string;
  autoflowAllowed: "OFF" | "ASSISTED" | "CONTROLLED" | "FULL";
  autonomyLimit: RequiredApproval;
}

interface WorkflowAgentData {
  label: string;
  status: AgentStatus;
  summary: string;
  decision: string;
  risk: RiskLabel;
  autonomy: string;
  analysis: string[];
  risks: string[];
  recommendations: string[];
  requiredApproval: RequiredApproval;
  nextActions: string[];
  currentMessage?: string;
  debatingWith?: string;
}

interface WorkflowNode {
  id: string;
  type: "agent";
  position: {
    x: number;
    y: number;
  };
  data: WorkflowAgentData;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  blocked?: boolean;
  kind?: WorkflowEdgeKind;
  label?: string;
}

export interface DemandWorkflowPayload {
  id: string;
  title: string;
  project: string;
  status: string;
  summary: string;
  generatedAt: string;
  source: {
    demandId: string;
    engine: string;
  };
  classification: DemandClassification;
  findings: Array<{
    id: string;
    type: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    title: string;
    summary: string;
    affectedFiles: string[];
    recommendedAgents: string[];
    autonomyLevel: number;
  }>;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

const AGENTS = {
  product: {
    id: "produto",
    label: "Produto",
    reviewerId: "revisor-produto",
    reviewerLabel: "Revisor de Produto",
  },
  uxUi: {
    id: "ux-ui",
    label: "UX/UI",
    reviewerId: "revisor-ux-ui",
    reviewerLabel: "Revisor UX/UI",
  },
  contentSeo: {
    id: "conteudo-seo",
    label: "Conteúdo/SEO",
    reviewerId: "revisor-conteudo-seo",
    reviewerLabel: "Revisor Conteúdo/SEO",
  },
  finance: {
    id: "financeiro",
    label: "Financeiro",
    reviewerId: "revisor-financeiro",
    reviewerLabel: "Revisor Financeiro",
  },
  architect: {
    id: "arquiteto",
    label: "Arquiteto",
    reviewerId: "revisor-tecnico",
    reviewerLabel: "Revisor Técnico",
  },
  developer: {
    id: "desenvolvedor",
    label: "Desenvolvedor",
    reviewerId: "revisor-codigo",
    reviewerLabel: "Revisor de Código",
  },
  security: {
    id: "seguranca",
    label: "Segurança",
    reviewerId: "revisor-seguranca",
    reviewerLabel: "Revisor Segurança",
  },
  qa: {
    id: "qa",
    label: "QA",
    reviewerId: "revisor-qa",
    reviewerLabel: "Revisor QA",
  },
  publication: {
    id: "publicacao",
    label: "Publicação",
    reviewerId: "revisor-publicacao",
    reviewerLabel: "Revisor de Publicação",
  },
  news: {
    id: "curador-noticias",
    label: "Curador de Notícias",
    reviewerId: "revisor-noticias",
    reviewerLabel: "Revisor de Notícias",
  },
  contact: {
    id: "inbox",
    label: "Inbox/Fale Conosco",
    reviewerId: "revisor-atendimento",
    reviewerLabel: "Revisor de Atendimento",
  },
  other99: {
    id: "outros-99",
    label: "Outros / 99+",
    reviewerId: "revisor-outros-99",
    reviewerLabel: "Revisor Outros / 99+",
  },
} satisfies Record<string, AgentDefinition>;

export function buildDemandWorkflowPayload(demand: Demand): DemandWorkflowPayload {
  const classification = classifyDemand(demand);
  const generatedAt = new Date().toISOString();

  const nodes = buildElasticNodes(demand, classification);
  const edges = buildElasticEdges(classification);

  return {
    id: `workflow-demand-${demand.id}`,
    title: `Análise da demanda — ${demand.title}`,
    project: demand.project,
    status: classification.requiresGerson ? "Aguardando aprovação" : "Em análise",
    summary: `Workflow elástico gerado a partir da demanda "${demand.title}". Categoria: ${classification.categoryLabel}. Complexidade: ${classification.complexity}.`,
    generatedAt,
    source: {
      demandId: demand.id,
      engine: "gelocci-studio-elastic-classifier-v1",
    },
    classification,
    findings: [
      {
        id: `finding-demand-${demand.id}`,
        type: "DEMAND_CLASSIFICATION",
        severity: severityFromRisk(classification.risk),
        title: demand.title,
        summary: classification.reason,
        affectedFiles: [],
        recommendedAgents: [
          "classificador-demandas",
          "orquestrador",
          ...classification.executorAgents.map((agent) => agent.id),
          ...classification.reviewerAgents.map((agent) => agent.id),
          ...classification.supportAgents.map((agent) => agent.id),
          "studio-lead",
          ...(classification.requiresGerson ? ["gerson"] : []),
        ],
        autonomyLevel: classification.requiresGerson ? 6 : classification.autonomyLimit === "STUDIO_LEAD" ? 5 : 3,
      },
    ],
    nodes,
    edges,
  };
}

function classifyDemand(demand: Demand): DemandClassification {
  const text = normalize(`${demand.title} ${demand.description} ${demand.project}`);
  const risk = riskFromDemand(demand, text);
  const complexity = complexityFromDemand(demand, text, risk);
  const requiresGerson = shouldRequireGerson(demand, text, risk, complexity);
  const requiresPr = shouldRequirePr(text, complexity);

  const category = categoryFromDemand(demand, text);
  const base = classificationBase(category);

  const executorAgents = dedupeAgents(base.executors);
  const reviewerAgents = dedupeAgents(
    executorAgents
      .filter((agent) => agent.reviewerId && agent.reviewerLabel)
      .map((agent) => ({
        id: agent.reviewerId as string,
        label: agent.reviewerLabel as string,
      })),
  );

  const requiresQa =
    base.requiresQa ||
    complexity !== "Baixa" ||
    risk !== "Baixo" ||
    hasAny(text, ["calculo", "cálculo", "ir", "inss", "juros", "black", "scholes", "teste", "bug", "erro"]);

  const supportAgents = dedupeAgents([
    ...(requiresQa ? [{ id: AGENTS.qa.id, label: AGENTS.qa.label }] : []),
    ...(requiresPr ? [{ id: AGENTS.developer.id, label: AGENTS.developer.label }] : []),
  ]);

  const supportReviewers = dedupeAgents(
    supportAgents
      .filter((agent) => {
        const definition = Object.values(AGENTS).find((item) => item.id === agent.id);
        return Boolean(definition?.reviewerId && definition.reviewerLabel);
      })
      .map((agent) => {
        const definition = Object.values(AGENTS).find((item) => item.id === agent.id);

        return {
          id: definition?.reviewerId as string,
          label: definition?.reviewerLabel as string,
        };
      }),
  );

  const allReviewers = dedupeAgents([...reviewerAgents, ...supportReviewers]);

  return {
    category,
    categoryCode: category === "OTHER_99" ? "99" : category,
    categoryLabel: base.label,
    complexity,
    risk,
    executorAgents,
    reviewerAgents: allReviewers,
    supportAgents,
    requiresQa,
    requiresGerson,
    requiresPr,
    fallbackCategory: category === "OTHER_99",
    reason: buildClassificationReason(demand, category, complexity, risk, requiresGerson),
    autoflowAllowed: autoflowAllowed(complexity, risk, requiresGerson),
    autonomyLimit: requiresGerson ? "GERSON" : risk === "Médio" || complexity === "Média" ? "STUDIO_LEAD" : "NONE",
  };
}

function classificationBase(category: DemandCategory): {
  label: string;
  executors: AgentDefinition[];
  requiresQa: boolean;
} {
  switch (category) {
    case "PRODUCT":
      return { label: "Produto", executors: [AGENTS.product], requiresQa: false };
    case "UX_UI":
      return { label: "UX/UI", executors: [AGENTS.uxUi], requiresQa: false };
    case "CONTENT_SEO":
      return { label: "Conteúdo/SEO", executors: [AGENTS.contentSeo], requiresQa: false };
    case "FINANCIAL":
      return { label: "Financeiro", executors: [AGENTS.finance], requiresQa: true };
    case "TECHNICAL":
      return { label: "Técnico", executors: [AGENTS.architect, AGENTS.developer], requiresQa: true };
    case "SECURITY":
      return { label: "Segurança", executors: [AGENTS.security, AGENTS.architect], requiresQa: true };
    case "QA":
      return { label: "QA/Testes", executors: [AGENTS.qa], requiresQa: true };
    case "PUBLICATION":
      return { label: "Publicação", executors: [AGENTS.publication], requiresQa: false };
    case "NEWS":
      return { label: "Notícias/Curadoria", executors: [AGENTS.news, AGENTS.contentSeo, AGENTS.finance], requiresQa: false };
    case "CONTACT":
      return { label: "Fale Conosco/Atendimento", executors: [AGENTS.contact, AGENTS.product], requiresQa: false };
    case "OTHER_99":
      return { label: "Outros / 99+", executors: [AGENTS.other99], requiresQa: false };
  }
}

function buildElasticNodes(demand: Demand, classification: DemandClassification): WorkflowNode[] {
  const nodes: WorkflowNode[] = [];

  nodes.push(
    node("entrada", 0, 320, {
      label: "Entrada",
      status: "APPROVED",
      summary: "Demanda recebida no Studio.",
      decision: "Encaminhar para classificação.",
      risk: classification.risk,
      autonomy: "Nível 1 — registra e encaminha",
      analysis: [
        `Título: ${demand.title}.`,
        `Origem: ${demand.origin}.`,
        `Projeto: ${demand.project}.`,
      ],
      risks: [],
      recommendations: ["Classificar demanda antes de orquestrar agentes."],
      requiredApproval: "NONE",
      nextActions: ["Enviar para Classificador de Demandas."],
    }),
  );

  nodes.push(
    node("classificador-demandas", 360, 320, {
      label: "Classificador de Demandas",
      status: classification.fallbackCategory ? "CHANGES_REQUESTED" : "APPROVED_WITH_NOTES",
      summary: "Classifica tipo, complexidade, risco e agentes necessários.",
      decision: `Categoria: ${classification.categoryLabel}. Complexidade: ${classification.complexity}.`,
      risk: classification.risk,
      autonomy: "Nível 2 — classifica",
      analysis: [
        classification.reason,
        `AutoFlow permitido: ${classification.autoflowAllowed}.`,
        `Limite de autonomia: ${classification.autonomyLimit}.`,
      ],
      risks: classification.fallbackCategory
        ? ["Demanda caiu em Outros / 99+. Pode exigir triagem humana ou criação de nova categoria."]
        : [],
      recommendations: [
        "Enviar classificação para o Orquestrador.",
        "Não executar agentes fora da classificação sem justificativa.",
      ],
      requiredApproval: classification.fallbackCategory ? "STUDIO_LEAD" : "NONE",
      nextActions: ["Orquestrar fluxo elástico."],
    }),
  );

  nodes.push(
    node("orquestrador", 720, 320, {
      label: "Orquestrador",
      status: "APPROVED_WITH_NOTES",
      summary: "Monta o workflow a partir da classificação, sem assumir papel de especialista.",
      decision: `Convocar ${classification.executorAgents.length} executor(es), ${classification.reviewerAgents.length} revisor(es) e ${classification.supportAgents.length} suporte(s).`,
      risk: classification.risk,
      autonomy: "Nível 2 — coordena",
      analysis: [
        "O Orquestrador não classifica a demanda; ele usa a classificação recebida.",
        "O workflow exibirá somente agentes necessários.",
      ],
      risks: [],
      recommendations: ["Criar sequência com executor, revisor e governança."],
      requiredApproval: classification.autonomyLimit,
      nextActions: ["Acionar agentes convocados."],
    }),
  );

  const executorStartX = 1080;
  const stepX = 330;
  const laneTopY = 80;
  const laneGap = 170;

  classification.executorAgents.forEach((agent, index) => {
    nodes.push(
      node(agent.id, executorStartX, laneTopY + index * laneGap, agentDataForExecutor(agent, classification)),
    );
  });

  classification.supportAgents.forEach((agent, index) => {
    nodes.push(
      node(agent.id, executorStartX, laneTopY + (classification.executorAgents.length + index) * laneGap, agentDataForSupport(agent, classification)),
    );
  });

  const reviewers = classification.reviewerAgents;
  const reviewerX = executorStartX + stepX;

  reviewers.forEach((agent, index) => {
    nodes.push(
      node(agent.id, reviewerX, laneTopY + index * laneGap, agentDataForReviewer(agent, classification)),
    );
  });

  const leadX = reviewers.length > 0 ? reviewerX + stepX : executorStartX + stepX;
  const leadY = 320;

  nodes.push(
    node("studio-lead", leadX, leadY, {
      label: "Studio Lead",
      status: classification.requiresGerson ? "CHANGES_REQUESTED" : "APPROVED_WITH_NOTES",
      summary: "Consolida os pareceres e decide até onde a autonomia permite avançar.",
      decision: classification.requiresGerson
        ? "Escalar para Gerson antes de execução sensível."
        : "Pode aprovar se a demanda permanecer dentro da autonomia.",
      risk: classification.risk,
      autonomy: classification.requiresGerson ? "Nível 6 — Gerson aprova" : "Nível 5 — Lead aprova se simples",
      analysis: [
        `Categoria: ${classification.categoryLabel}.`,
        `Complexidade: ${classification.complexity}.`,
        `Fallback 99+: ${classification.fallbackCategory ? "sim" : "não"}.`,
      ],
      risks: classification.requiresGerson ? ["Demanda excede autonomia do Studio Lead."] : [],
      recommendations: classification.requiresGerson
        ? ["Solicitar decisão do Gerson."]
        : ["Aprovar planejamento controlado se não houver alteração sensível."],
      requiredApproval: classification.requiresGerson ? "GERSON" : "STUDIO_LEAD",
      nextActions: classification.requiresGerson ? ["Enviar para Gerson."] : ["Autorizar próximo passo."],
    }),
  );

  const nextX = leadX + stepX;

  if (classification.requiresPr) {
    nodes.push(
      node("pr", nextX, leadY, {
        label: "Pull Request",
        status: "WAITING",
        summary: "PR será criado somente após plano, implementação e validação.",
        decision: "Aguardar liberação.",
        risk: classification.risk,
        autonomy: "Nível 4 — abre PR",
        analysis: ["Este workflow apenas prepara a esteira visual. A criação real do PR virá em etapa posterior."],
        risks: [],
        recommendations: ["Não abrir PR sem validação de revisores e QA."],
        requiredApproval: classification.requiresGerson ? "GERSON" : "STUDIO_LEAD",
        nextActions: ["Aguardar validação."],
      }),
    );
  }

  if (classification.requiresGerson) {
    nodes.push(
      node("gerson", classification.requiresPr ? nextX + stepX : nextX, leadY, {
        label: "Gerson",
        status: "WAITING",
        summary: "Owner chamado porque a demanda excede a autonomia automática.",
        decision: "Aguardar decisão humana.",
        risk: classification.risk,
        autonomy: "Nível 6 — aprovação final",
        analysis: [
          "Chamado por complexidade, risco, categoria sensível ou fallback 99+.",
          "Pode aprovar, rejeitar ou devolver para ajustes.",
        ],
        risks: ["A aprovação automática poderia avançar uma demanda sensível sem governança."],
        recommendations: ["Revisar parecer do Studio Lead antes de liberar."],
        requiredApproval: "GERSON",
        nextActions: ["Aprovar, rejeitar ou solicitar ajuste."],
      }),
    );
  }

  return nodes;
}

function buildElasticEdges(classification: DemandClassification): WorkflowEdge[] {
  const edges: WorkflowEdge[] = [];

  edges.push(edge("entrada", "classificador-demandas", "forward", "classificar"));
  edges.push(edge("classificador-demandas", "orquestrador", "forward", "orquestrar"));

  const calledAgents = dedupeAgents([...classification.executorAgents, ...classification.supportAgents]);
  const reviewers = classification.reviewerAgents;

  calledAgents.forEach((agent) => {
    edges.push(edge("orquestrador", agent.id, agent.id === AGENTS.finance.id && classification.requiresGerson ? "block" : "forward", "convocar"));

    const reviewer = reviewerForAgent(agent, reviewers);

    if (reviewer) {
      edges.push(edge(agent.id, reviewer.id, "forward", "revisar"));
      edges.push(edge(reviewer.id, agent.id, reviewer.id.includes("financeiro") ? "block" : "rework", "ajustar"));
      edges.push(edge(reviewer.id, "studio-lead", "forward", "parecer"));
    } else {
      edges.push(edge(agent.id, "studio-lead", "forward", "parecer"));
    }
  });

  if (classification.fallbackCategory) {
    edges.push(edge("studio-lead", "classificador-demandas", "rework", "reclassificar"));
    edges.push(edge("studio-lead", AGENTS.other99.id, "rework", "detalhar 99+"));
  }

  if (classification.requiresPr) {
    edges.push(edge("studio-lead", "pr", classification.requiresGerson ? "block" : "forward", "PR"));
  }

  if (classification.requiresGerson) {
    edges.push(edge(classification.requiresPr ? "pr" : "studio-lead", "gerson", "approval", "aprovação"));
    edges.push(edge("gerson", "studio-lead", "rework", "devolver"));
  }

  return dedupeEdges(edges);
}

function reviewerForAgent(agent: AgentDefinition, reviewers: AgentDefinition[]): AgentDefinition | undefined {
  const definition = Object.values(AGENTS).find((item) => item.id === agent.id);

  if (!definition?.reviewerId) {
    return undefined;
  }

  return reviewers.find((reviewer) => reviewer.id === definition.reviewerId);
}

function agentDataForExecutor(agent: AgentDefinition, classification: DemandClassification): WorkflowAgentData {
  return {
    label: agent.label,
    status: classification.requiresGerson && agent.id === AGENTS.finance.id ? "CHANGES_REQUESTED" : "APPROVED_WITH_NOTES",
    summary: `Executor responsável por ${agent.label}.`,
    decision: "Analisar apenas sua responsabilidade específica.",
    risk: classification.risk,
    autonomy: classification.requiresGerson ? "Nível 6 — Gerson aprova" : "Nível 3 — executa análise",
    analysis: [
      "Executor não revisa a própria atividade.",
      "A saída deve ser encaminhada ao revisor correspondente.",
    ],
    risks: classification.requiresGerson && agent.id === AGENTS.finance.id
      ? ["Possível impacto financeiro ou premissa sensível."]
      : [],
    recommendations: ["Produzir parecer específico e objetivo."],
    requiredApproval: classification.requiresGerson ? "GERSON" : "STUDIO_LEAD",
    nextActions: ["Enviar para revisor correspondente."],
  };
}

function agentDataForSupport(agent: AgentDefinition, classification: DemandClassification): WorkflowAgentData {
  return {
    label: agent.label,
    status: "WAITING",
    summary: `Agente de suporte convocado: ${agent.label}.`,
    decision: "Aguardar executor principal ou orquestração.",
    risk: classification.risk,
    autonomy: "Nível 3 — suporte",
    analysis: ["Agente entra apenas porque a demanda exige validação ou execução complementar."],
    risks: [],
    recommendations: ["Atuar somente dentro do escopo atribuído."],
    requiredApproval: classification.autonomyLimit,
    nextActions: ["Aguardar etapa correspondente."],
  };
}

function agentDataForReviewer(agent: AgentDefinition, classification: DemandClassification): WorkflowAgentData {
  return {
    label: agent.label,
    status: "WAITING",
    summary: `Revisor correspondente da atividade: ${agent.label}.`,
    decision: "Validar a saída do executor antes do Studio Lead.",
    risk: classification.risk,
    autonomy: "Nível 4 — revisa",
    analysis: [
      "Todo executor relevante deve ter uma revisão correspondente.",
      "O revisor pode aprovar, solicitar ajuste ou bloquear.",
    ],
    risks: classification.requiresGerson ? ["Revisão pode identificar bloqueio ou necessidade de owner."] : [],
    recommendations: ["Validar escopo, qualidade e aderência à demanda."],
    requiredApproval: classification.requiresGerson ? "GERSON" : "STUDIO_LEAD",
    nextActions: ["Enviar parecer ao Studio Lead."],
  };
}

function categoryFromDemand(demand: Demand, text: string): DemandCategory {
  if (demand.origin === "NEWS" || hasAny(text, ["noticia", "notícia", "rss", "banco do brasil", "bb anuncia", "lucro", "resultado trimestral"])) {
    return "NEWS";
  }

  if (demand.origin === "CONTACT" || demand.origin === "SITE_FEEDBACK" || hasAny(text, ["fale conosco", "mensagem", "cliente", "usuario relatou", "usuário relatou", "feedback"])) {
    return "CONTACT";
  }

  if (hasAny(text, ["layout", "visual", "tela", "cor", "botao", "botão", "css", "header", "footer", "card", "responsivo", "mobile", "dark", "light"])) {
    return "UX_UI";
  }

  if (hasAny(text, ["seo", "faq", "meta", "headline", "titulo", "título", "conteudo", "conteúdo", "texto", "artigo", "educacao", "educação"])) {
    return "CONTENT_SEO";
  }

  if (hasAny(text, ["calculo", "cálculo", "formula", "fórmula", "financeiro", "juros", "black", "scholes", "ir", "inss", "aposentadoria", "taxa", "dividendo", "rentabilidade"])) {
    return "FINANCIAL";
  }

  if (hasAny(text, ["api", "backend", "banco", "database", "deploy", "docker", "build", "pipeline", "codigo", "código", "typescript", "react", "fastify", "prisma"])) {
    return "TECHNICAL";
  }

  if (hasAny(text, ["seguranca", "segurança", "privacidade", "lgpd", "login", "senha", "token", "cookie", "dados pessoais", "vazamento"])) {
    return "SECURITY";
  }

  if (hasAny(text, ["teste", "qa", "erro", "bug", "falha", "console", "regressao", "regressão"])) {
    return "QA";
  }

  if (hasAny(text, ["publicar", "publicacao", "publicação", "producao", "produção", "netlify", "cloudflare", "release"])) {
    return "PUBLICATION";
  }

  if (hasAny(text, ["produto", "jornada", "prioridade", "roadmap", "valor", "negocio", "negócio"])) {
    return "PRODUCT";
  }

  return "OTHER_99";
}

function riskFromDemand(demand: Demand, text: string): RiskLabel {
  if (
    demand.priority === "HIGH" ||
    hasAny(text, [
      "formula", "fórmula", "calculo", "cálculo", "ir", "inss", "black", "scholes",
      "seguranca", "segurança", "privacidade", "lgpd",
      "backend", "banco", "deploy", "producao", "produção",
    ])
  ) {
    return "Alto";
  }

  if (demand.priority === "LOW") {
    return "Baixo";
  }

  return "Médio";
}

function complexityFromDemand(demand: Demand, text: string, risk: RiskLabel): ComplexityLabel {
  const indicators = [
    "backend", "api", "banco", "deploy", "pipeline",
    "seguranca", "segurança", "calculo", "cálculo", "formula", "fórmula",
    "nova ferramenta", "integração", "integracao", "github", "pr",
  ];

  const hits = indicators.filter((indicator) => text.includes(normalize(indicator))).length;

  if (risk === "Alto" || hits >= 2) return "Alta";
  if (demand.priority === "MEDIUM" || hits === 1 || text.length > 180) return "Média";
  if (demand.priority === "LOW") return "Baixa";

  return "Média";
}

function shouldRequireGerson(demand: Demand, text: string, risk: RiskLabel, complexity: ComplexityLabel): boolean {
  return (
    risk === "Alto" ||
    complexity === "Alta" ||
    demand.origin === "NEWS" ||
    hasAny(text, [
      "formula", "fórmula", "ir", "inss", "black", "scholes",
      "seguranca", "segurança", "privacidade", "lgpd",
      "producao", "produção", "publicar", "noticia", "notícia",
    ])
  );
}

function shouldRequirePr(text: string, complexity: ComplexityLabel): boolean {
  return (
    complexity !== "Baixa" ||
    hasAny(text, ["codigo", "código", "css", "html", "javascript", "typescript", "react", "backend", "api", "site", "pagina", "página"])
  );
}

function autoflowAllowed(
  complexity: ComplexityLabel,
  risk: RiskLabel,
  requiresGerson: boolean,
): DemandClassification["autoflowAllowed"] {
  if (requiresGerson || risk === "Alto" || complexity === "Alta") return "ASSISTED";
  if (complexity === "Média" || risk === "Médio") return "CONTROLLED";
  return "FULL";
}

function buildClassificationReason(
  demand: Demand,
  category: DemandCategory,
  complexity: ComplexityLabel,
  risk: RiskLabel,
  requiresGerson: boolean,
): string {
  return [
    `Demanda classificada como ${category}.`,
    `Complexidade estimada: ${complexity}.`,
    `Risco estimado: ${risk}.`,
    `Origem: ${demand.origin}.`,
    requiresGerson ? "Exige possível decisão do owner." : "Pode seguir dentro da autonomia configurada.",
  ].join(" ");
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(normalize(term)));
}

function severityFromRisk(risk: RiskLabel): "LOW" | "MEDIUM" | "HIGH" {
  if (risk === "Alto") return "HIGH";
  if (risk === "Baixo") return "LOW";
  return "MEDIUM";
}

function node(id: string, x: number, y: number, data: WorkflowAgentData): WorkflowNode {
  return { id, type: "agent", position: { x, y }, data };
}

function edge(source: string, target: string, kind: WorkflowEdgeKind = "forward", label?: string): WorkflowEdge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    animated: kind === "block",
    blocked: kind === "block",
    kind,
    label,
  };
}

function dedupeAgents(agents: AgentDefinition[]): AgentDefinition[] {
  const map = new Map<string, AgentDefinition>();
  agents.forEach((agent) => map.set(agent.id, agent));
  return Array.from(map.values());
}

function dedupeEdges(edges: WorkflowEdge[]): WorkflowEdge[] {
  const map = new Map<string, WorkflowEdge>();
  edges.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}
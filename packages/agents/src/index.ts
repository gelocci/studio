import type { AgentInput, AgentOutput, StudioAgent } from "@gelocci/studio-workflow";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAny(text: string, terms: string[]): boolean {
  const normalized = normalize(text);
  return terms.some((term) => normalized.includes(normalize(term)));
}

const classifierAgent: StudioAgent = {
  key: "classificador-demandas",
  name: "Classificador de Demandas",
  role: "CLASSIFIER",
  async run(input: AgentInput): Promise<AgentOutput> {
    const text = `${input.demand.title} ${input.demand.description}`;

    const financial = hasAny(text, ["calculo", "cálculo", "formula", "fórmula", "inss", "ir", "juros", "black", "scholes"]);
    const technical = hasAny(text, ["api", "backend", "banco", "deploy", "docker", "prisma", "typescript"]);
    const visual = hasAny(text, ["layout", "visual", "card", "botao", "botão", "css", "mobile", "responsivo"]);
    const security = hasAny(text, ["seguranca", "segurança", "login", "token", "lgpd", "privacidade"]);
    const news = input.demand.origin === "NEWS" || hasAny(text, ["noticia", "notícia", "rss", "lucro", "resultado"]);

    const risk = financial || security || technical || news ? "HIGH" : input.demand.priority === "HIGH" ? "HIGH" : "MEDIUM";
    const complexity = technical || financial || security ? "HIGH" : visual ? "LOW" : "MEDIUM";

    const nextAgents = [
      "orquestrador",
      ...(visual ? ["ux-ui", "revisor-ux-ui"] : []),
      ...(financial ? ["financeiro", "revisor-financeiro", "qa", "revisor-qa"] : []),
      ...(technical ? ["arquiteto", "desenvolvedor", "revisor-tecnico", "qa", "revisor-qa"] : []),
      ...(security ? ["seguranca", "revisor-seguranca"] : []),
      ...(news ? ["curador-noticias", "revisor-noticias"] : []),
      ...(!visual && !financial && !technical && !security && !news ? ["outros-99", "revisor-outros-99"] : []),
      "studio-lead",
    ];

    return {
      status: risk === "HIGH" ? "APPROVED_WITH_NOTES" : "APPROVED",
      summary: "Demanda classificada para montagem do workflow.",
      decision: `Risco ${risk}; complexidade ${complexity}; próximos agentes definidos.`,
      risk,
      complexity,
      requiredApproval: risk === "HIGH" ? "GERSON" : "STUDIO_LEAD",
      findings: [
        visual ? "Demanda visual/UX identificada." : "",
        financial ? "Demanda financeira/cálculo identificada." : "",
        technical ? "Demanda técnica identificada." : "",
        security ? "Demanda de segurança identificada." : "",
        news ? "Demanda de notícia/conteúdo sensível identificada." : "",
      ].filter(Boolean),
      recommendations: ["Executar Orquestrador com base na classificação."],
      nextAgents,
      metadata: {
        categories: { visual, financial, technical, security, news },
      },
    };
  },
};

function makeSimpleAgent(key: string, name: string, role: StudioAgent["role"] = "EXECUTOR"): StudioAgent {
  return {
    key,
    name,
    role,
    async run(input: AgentInput): Promise<AgentOutput> {
      return {
        status: "APPROVED_WITH_NOTES",
        summary: `${name} executou sua análise dentro da responsabilidade definida.`,
        decision: "Encaminhar parecer para a próxima etapa.",
        risk: "MEDIUM",
        complexity: "MEDIUM",
        requiredApproval: "STUDIO_LEAD",
        findings: [`${name} não encontrou bloqueio automático nesta primeira execução.`],
        recommendations: ["Registrar parecer e seguir para revisão/governança."],
        nextAgents: [],
        metadata: {
          demandId: input.demand.id,
          agentKey: key,
        },
      };
    },
  };
}

export const agentCatalog: StudioAgent[] = [
  classifierAgent,
  makeSimpleAgent("orquestrador", "Orquestrador", "ORCHESTRATOR"),
  makeSimpleAgent("produto", "Produto"),
  makeSimpleAgent("ux-ui", "UX/UI"),
  makeSimpleAgent("revisor-ux-ui", "Revisor UX/UI", "REVIEWER"),
  makeSimpleAgent("conteudo-seo", "Conteúdo/SEO"),
  makeSimpleAgent("revisor-conteudo-seo", "Revisor Conteúdo/SEO", "REVIEWER"),
  makeSimpleAgent("financeiro", "Financeiro"),
  makeSimpleAgent("revisor-financeiro", "Revisor Financeiro", "REVIEWER"),
  makeSimpleAgent("arquiteto", "Arquiteto"),
  makeSimpleAgent("desenvolvedor", "Desenvolvedor"),
  makeSimpleAgent("revisor-tecnico", "Revisor Técnico", "REVIEWER"),
  makeSimpleAgent("revisor-codigo", "Revisor de Código", "REVIEWER"),
  makeSimpleAgent("qa", "QA"),
  makeSimpleAgent("revisor-qa", "Revisor QA", "REVIEWER"),
  makeSimpleAgent("seguranca", "Segurança"),
  makeSimpleAgent("revisor-seguranca", "Revisor Segurança", "REVIEWER"),
  makeSimpleAgent("publicacao", "Publicação"),
  makeSimpleAgent("revisor-publicacao", "Revisor de Publicação", "REVIEWER"),
  makeSimpleAgent("curador-noticias", "Curador de Notícias"),
  makeSimpleAgent("revisor-noticias", "Revisor de Notícias", "REVIEWER"),
  makeSimpleAgent("outros-99", "Outros / 99+"),
  makeSimpleAgent("revisor-outros-99", "Revisor Outros / 99+", "REVIEWER"),
  makeSimpleAgent("studio-lead", "Studio Lead", "STUDIO_LEAD"),
];

export function getAgent(key: string): StudioAgent {
  const agent = agentCatalog.find((item) => item.key === key);

  if (!agent) {
    throw new Error(`Agente não registrado: ${key}`);
  }

  return agent;
}

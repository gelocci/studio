import { invokeStructuredJson, isLlmEnabled } from "@gelocci/studio-llm";
import type { AgentInput, AgentOutput, StudioAgent } from "@gelocci/studio-workflow";
import { z } from "zod";

const agentOutputSchema = z.object({
  status: z.enum(["APPROVED", "APPROVED_WITH_NOTES", "CHANGES_REQUESTED", "BLOCKED", "REJECTED"]),
  summary: z.string().min(1),
  decision: z.string().min(1),
  risk: z.enum(["LOW", "MEDIUM", "HIGH"]),
  complexity: z.enum(["LOW", "MEDIUM", "HIGH", "UNKNOWN"]),
  requiredApproval: z.enum(["NONE", "STUDIO_LEAD", "GERSON"]),
  findings: z.array(z.string()),
  recommendations: z.array(z.string()),
  nextAgents: z.array(z.string()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

type RuleHandler = (input: AgentInput) => AgentOutput;

interface AgentDefinition {
  key: string;
  name: string;
  role: StudioAgent["role"];
  systemPrompt: string;
  rule: RuleHandler;
}

class BaseLlmAgent implements StudioAgent {
  key: string;
  name: string;
  role: StudioAgent["role"];

  private systemPrompt: string;
  private rule: RuleHandler;

  constructor(definition: AgentDefinition) {
    this.key = definition.key;
    this.name = definition.name;
    this.role = definition.role;
    this.systemPrompt = definition.systemPrompt;
    this.rule = definition.rule;
  }

  async run(input: AgentInput): Promise<AgentOutput> {
    if (!isLlmEnabled()) {
      return this.rule(input);
    }

    try {
      return await invokeStructuredJson(
        {
          systemPrompt: this.systemPrompt,
          userPrompt: buildUserPrompt(this, input),
        },
        agentOutputSchema,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido ao chamar LLM.";

      const fallback = this.rule(input);

      return {
        ...fallback,
        status: fallback.status === "APPROVED" ? "APPROVED_WITH_NOTES" : fallback.status,
        findings: [
          ...fallback.findings,
          `Fallback rule-based acionado porque a LLM falhou: ${message}`,
        ],
        metadata: {
          ...fallback.metadata,
          llmFallback: true,
          llmError: message,
        },
      };
    }
  }
}

function buildUserPrompt(agent: StudioAgent, input: AgentInput): string {
  const previous = input.previousExecutions.length
    ? input.previousExecutions
        .map((execution) => {
          const decision = execution.output?.decision ?? "sem decisão";
          const status = execution.output?.status ?? execution.status;
          return `- ${execution.agentName} (${execution.agentRole}): ${decision} [${status}]`;
        })
        .join("\n")
    : "Nenhum parecer anterior.";

  return `
Você está executando como agente do Gelocci Studio.

Agente atual:
- key: ${agent.key}
- nome: ${agent.name}
- papel: ${agent.role}

Demanda:
- id: ${input.demand.id}
- projeto: ${input.demand.project}
- título: ${input.demand.title}
- descrição: ${input.demand.description}
- origem: ${input.demand.origin}
- prioridade: ${input.demand.priority}
- status: ${input.demand.status}

Política AutoFlow:
- modo: ${input.policy.mode}
- complexidade máxima sem aprovação: ${input.policy.maxComplexityWithoutApproval}
- risco máximo sem aprovação: ${input.policy.maxRiskWithoutApproval}
- exigir owner para regras financeiras: ${input.policy.requireOwnerForFinancialRules}
- exigir owner para segurança: ${input.policy.requireOwnerForSecurity}
- exigir owner para publicação em produção: ${input.policy.requireOwnerForProductionPublish}
- exigir owner para notícias/publicação: ${input.policy.requireOwnerForNewsPublishing}

Pareceres anteriores:
${previous}

Responda APENAS JSON válido, sem markdown, com esta estrutura:
{
  "status": "APPROVED" | "APPROVED_WITH_NOTES" | "CHANGES_REQUESTED" | "BLOCKED" | "REJECTED",
  "summary": "resumo objetivo",
  "decision": "decisão em uma frase",
  "risk": "LOW" | "MEDIUM" | "HIGH",
  "complexity": "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN",
  "requiredApproval": "NONE" | "STUDIO_LEAD" | "GERSON",
  "findings": ["achado 1"],
  "recommendations": ["recomendação 1"],
  "nextAgents": ["agent-key-se-aplicável"],
  "metadata": {}
}

Regras:
- Nunca invente arquivos, commits ou PRs já feitos.
- Seja direto.
- Se houver risco alto, use requiredApproval = "GERSON".
- Se a demanda envolver cálculo financeiro, INSS, IR, segurança, privacidade, publicação ou notícia, eleve risco e exija aprovação adequada.
- Se seu papel não for orquestrador, deixe nextAgents vazio, exceto se houver motivo claro para encaminhamento.
`;
}

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

function classifyText(input: AgentInput) {
  const text = `${input.demand.title} ${input.demand.description}`;

  const financial = hasAny(text, ["calculo", "cálculo", "formula", "fórmula", "inss", "ir", "juros", "black", "scholes"]);
  const technical = hasAny(text, ["api", "backend", "banco", "deploy", "docker", "prisma", "typescript", "worker", "fila", "redis"]);
  const visual = hasAny(text, ["layout", "visual", "card", "botao", "botão", "css", "mobile", "responsivo", "tela"]);
  const security = hasAny(text, ["seguranca", "segurança", "login", "token", "lgpd", "privacidade"]);
  const news = input.demand.origin === "NEWS" || hasAny(text, ["noticia", "notícia", "rss", "lucro", "resultado", "publicar"]);

  return { text, financial, technical, visual, security, news };
}

function classifierRule(input: AgentInput): AgentOutput {
  const categories = classifyText(input);

  const risk = categories.financial || categories.security || categories.news
    ? "HIGH"
    : input.demand.priority === "HIGH"
      ? "HIGH"
      : categories.technical
        ? "MEDIUM"
        : "LOW";

  const complexity = categories.technical || categories.financial || categories.security
    ? "HIGH"
    : categories.visual
      ? "LOW"
      : "MEDIUM";

  const nextAgents = [
    "orquestrador",
    ...(categories.visual ? ["ux-ui", "revisor-ux-ui"] : []),
    ...(categories.financial ? ["financeiro", "revisor-financeiro", "qa", "revisor-qa"] : []),
    ...(categories.technical ? ["arquiteto", "desenvolvedor", "revisor-tecnico", "qa", "revisor-qa"] : []),
    ...(categories.security ? ["seguranca", "revisor-seguranca"] : []),
    ...(categories.news ? ["curador-noticias", "revisor-noticias"] : []),
    ...(!categories.visual && !categories.financial && !categories.technical && !categories.security && !categories.news
      ? ["outros-99", "revisor-outros-99"]
      : []),
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
      categories.visual ? "Demanda visual/UX identificada." : "",
      categories.financial ? "Demanda financeira/cálculo identificada." : "",
      categories.technical ? "Demanda técnica identificada." : "",
      categories.security ? "Demanda de segurança identificada." : "",
      categories.news ? "Demanda de notícia/conteúdo sensível identificada." : "",
    ].filter(Boolean),
    recommendations: ["Executar Orquestrador com base na classificação."],
    nextAgents,
    metadata: {
      categories,
      mode: "rule",
    },
  };
}

function simpleRule(name: string, agentKey: string, risk: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM"): RuleHandler {
  return (input) => ({
    status: risk === "HIGH" ? "APPROVED_WITH_NOTES" : "APPROVED",
    summary: `${name} executou análise estruturada da demanda.`,
    decision: "Não há bloqueio automático nesta etapa; seguir para próxima validação.",
    risk,
    complexity: risk === "HIGH" ? "HIGH" : "MEDIUM",
    requiredApproval: risk === "HIGH" ? "GERSON" : "STUDIO_LEAD",
    findings: [`${name} analisou a demanda no contexto do projeto ${input.demand.project}.`],
    recommendations: ["Registrar parecer e seguir conforme política de AutoFlow."],
    nextAgents: [],
    metadata: {
      agentKey,
      mode: "rule",
    },
  });
}

const definitions: AgentDefinition[] = [
  {
    key: "classificador-demandas",
    name: "Classificador de Demandas",
    role: "CLASSIFIER",
    systemPrompt: `
Você é o Classificador de Demandas do Gelocci Studio.
Seu papel é classificar a demanda, estimar risco e complexidade e indicar quais agentes devem participar.
Você não implementa. Você decide o encaminhamento.
`,
    rule: classifierRule,
  },
  {
    key: "orquestrador",
    name: "Orquestrador",
    role: "ORCHESTRATOR",
    systemPrompt: `
Você é o Orquestrador do Gelocci Studio.
Seu papel é organizar o fluxo, interpretar pareceres anteriores, identificar conflitos e consolidar encaminhamento.
Você não decide sozinho. Você coordena o processo.
`,
    rule: simpleRule("Orquestrador", "orquestrador"),
  },
  {
    key: "produto",
    name: "Produto",
    role: "EXECUTOR",
    systemPrompt: `
Você é o Agente de Produto.
Avalie objetivo, valor, prioridade, clareza da demanda e impacto na experiência do usuário.
`,
    rule: simpleRule("Produto", "produto"),
  },
  {
    key: "ux-ui",
    name: "UX/UI",
    role: "EXECUTOR",
    systemPrompt: `
Você é o Agente UX/UI.
Avalie layout, clareza visual, hierarquia, legibilidade, responsividade e consistência do produto.
`,
    rule: simpleRule("UX/UI", "ux-ui", "LOW"),
  },
  {
    key: "revisor-ux-ui",
    name: "Revisor UX/UI",
    role: "REVIEWER",
    systemPrompt: `
Você é o Revisor UX/UI.
Revise se o parecer visual é coerente, prático e alinhado ao produto.
`,
    rule: simpleRule("Revisor UX/UI", "revisor-ux-ui", "LOW"),
  },
  {
    key: "conteudo-seo",
    name: "Conteúdo/SEO",
    role: "EXECUTOR",
    systemPrompt: `
Você é o Agente de Conteúdo/SEO.
Avalie clareza, tom, busca, estrutura editorial e riscos de publicação.
`,
    rule: simpleRule("Conteúdo/SEO", "conteudo-seo"),
  },
  {
    key: "revisor-conteudo-seo",
    name: "Revisor Conteúdo/SEO",
    role: "REVIEWER",
    systemPrompt: `
Você é o Revisor de Conteúdo/SEO.
Revise qualidade editorial, coerência e riscos de publicação.
`,
    rule: simpleRule("Revisor Conteúdo/SEO", "revisor-conteudo-seo"),
  },
  {
    key: "financeiro",
    name: "Financeiro",
    role: "EXECUTOR",
    systemPrompt: `
Você é o Agente Financeiro.
Avalie regras financeiras, cálculos, premissas, fórmulas e risco de interpretação.
Demandas de cálculo devem ser tratadas com rigor e quase sempre exigem aprovação humana.
`,
    rule: simpleRule("Financeiro", "financeiro", "HIGH"),
  },
  {
    key: "revisor-financeiro",
    name: "Revisor Financeiro",
    role: "REVIEWER",
    systemPrompt: `
Você é o Revisor Financeiro.
Revise coerência de premissas, riscos de cálculo e necessidade de aprovação humana.
`,
    rule: simpleRule("Revisor Financeiro", "revisor-financeiro", "HIGH"),
  },
  {
    key: "arquiteto",
    name: "Arquiteto",
    role: "EXECUTOR",
    systemPrompt: `
Você é o Agente Arquiteto.
Avalie arquitetura, fronteiras, acoplamento, persistência, integrações, fila, segurança e evolução.
`,
    rule: simpleRule("Arquiteto", "arquiteto"),
  },
  {
    key: "desenvolvedor",
    name: "Desenvolvedor",
    role: "EXECUTOR",
    systemPrompt: `
Você é o Agente Desenvolvedor.
Avalie viabilidade técnica, arquivos impactados, complexidade, dependências e abordagem de implementação.
Pense como desenvolvedor sênior: pragmático, direto, sem over-engineering.
`,
    rule: simpleRule("Desenvolvedor", "desenvolvedor"),
  },
  {
    key: "revisor-tecnico",
    name: "Revisor Técnico",
    role: "REVIEWER",
    systemPrompt: `
Você é o Revisor Técnico.
Revise riscos técnicos, acoplamento, qualidade e consistência da solução proposta.
`,
    rule: simpleRule("Revisor Técnico", "revisor-tecnico"),
  },
  {
    key: "qa",
    name: "QA",
    role: "EXECUTOR",
    systemPrompt: `
Você é o Agente QA.
Avalie critérios de aceite, cenários de teste, regressão, cobertura mínima e bloqueios de qualidade.
`,
    rule: simpleRule("QA", "qa"),
  },
  {
    key: "revisor-qa",
    name: "Revisor QA",
    role: "REVIEWER",
    systemPrompt: `
Você é o Revisor QA.
Revise a suficiência dos testes e a clareza dos critérios de aceite.
`,
    rule: simpleRule("Revisor QA", "revisor-qa"),
  },
  {
    key: "seguranca",
    name: "Segurança",
    role: "EXECUTOR",
    systemPrompt: `
Você é o Agente de Segurança.
Avalie autenticação, autorização, dados sensíveis, segredos, exposição pública e privacidade.
Risco de segurança exige aprovação do Gerson.
`,
    rule: simpleRule("Segurança", "seguranca", "HIGH"),
  },
  {
    key: "revisor-seguranca",
    name: "Revisor Segurança",
    role: "REVIEWER",
    systemPrompt: `
Você é o Revisor de Segurança.
Revise riscos de segurança e privacidade. Seja conservador.
`,
    rule: simpleRule("Revisor Segurança", "revisor-seguranca", "HIGH"),
  },
  {
    key: "publicacao",
    name: "Publicação",
    role: "EXECUTOR",
    systemPrompt: `
Você é o Agente de Publicação.
Avalie riscos de publicação, deploy, impacto em produção e necessidade de aprovação.
`,
    rule: simpleRule("Publicação", "publicacao", "HIGH"),
  },
  {
    key: "revisor-publicacao",
    name: "Revisor de Publicação",
    role: "REVIEWER",
    systemPrompt: `
Você é o Revisor de Publicação.
Revise se a publicação pode seguir ou deve parar para aprovação.
`,
    rule: simpleRule("Revisor de Publicação", "revisor-publicacao", "HIGH"),
  },
  {
    key: "curador-noticias",
    name: "Curador de Notícias",
    role: "EXECUTOR",
    systemPrompt: `
Você é o Curador de Notícias.
Avalie relevância, risco editorial, neutralidade, fontes e adequação ao Gelocci.
Notícias exigem cuidado e aprovação humana.
`,
    rule: simpleRule("Curador de Notícias", "curador-noticias", "HIGH"),
  },
  {
    key: "revisor-noticias",
    name: "Revisor de Notícias",
    role: "REVIEWER",
    systemPrompt: `
Você é o Revisor de Notícias.
Revise risco editorial, precisão, neutralidade e necessidade de aprovação.
`,
    rule: simpleRule("Revisor de Notícias", "revisor-noticias", "HIGH"),
  },
  {
    key: "outros-99",
    name: "Outros / 99+",
    role: "EXECUTOR",
    systemPrompt: `
Você é o agente Outros / 99+.
Atue quando a demanda não couber claramente em nenhum agente especializado.
Classifique, reduza ambiguidade e encaminhe.
`,
    rule: simpleRule("Outros / 99+", "outros-99"),
  },
  {
    key: "revisor-outros-99",
    name: "Revisor Outros / 99+",
    role: "REVIEWER",
    systemPrompt: `
Você é o Revisor Outros / 99+.
Revise demandas genéricas e indique se precisam ser reclassificadas.
`,
    rule: simpleRule("Revisor Outros / 99+", "revisor-outros-99"),
  },
  {
    key: "studio-lead",
    name: "Studio Lead",
    role: "STUDIO_LEAD",
    systemPrompt: `
Você é o Studio Lead.
Consolide os pareceres anteriores, identifique conflitos e decida se o fluxo pode avançar ou se deve parar para o Gerson.
Quando houver dúvida relevante, escale.
`,
    rule: simpleRule("Studio Lead", "studio-lead"),
  },
];

export const agentCatalog: StudioAgent[] = definitions.map((definition) => new BaseLlmAgent(definition));

export function getAgent(key: string): StudioAgent {
  const agent = agentCatalog.find((item) => item.key === key);

  if (!agent) {
    throw new Error(`Agente não registrado: ${key}`);
  }

  return agent;
}

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { invokeStructuredJson, invokeWithAgentConfig, isLlmEnabled, type AgentLlmConfig } from "@gelocci/studio-llm";
import { prisma } from "@gelocci/studio-database";
import type { AgentInput, AgentOutput, StudioAgent } from "@gelocci/studio-workflow";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROMPTS_DIR = resolve(__dirname, "../../../prompts/agentes");

function loadPrompt(agentKey: string): string {
  try {
    return readFileSync(resolve(PROMPTS_DIR, `${agentKey}.md`), "utf-8");
  } catch {
    return `Você é o agente ${agentKey} do Gelocci Studio. Execute sua função com base na demanda recebida.`;
  }
}

const agentOutputSchema = z.object({
  status: z.enum(["APPROVED", "APPROVED_WITH_NOTES", "CHANGES_REQUESTED", "BLOCKED", "REJECTED"]),
  summary: z.string().min(1),
  decision: z.string().min(1),
  risk: z.enum(["LOW", "MEDIUM", "HIGH"]),
  complexity: z.enum(["LOW", "MEDIUM", "HIGH", "UNKNOWN"]),
  requiredApproval: z.enum(["NONE", "STUDIO_LEAD", "GERSON"]),
  category: z.enum(["CONTACT", "AUDIT", "FINANCIAL", "TECHNICAL", "VISUAL", "CONTENT", "SECURITY", "NEWS", "PRODUCT", "UNKNOWN"]).optional(),
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
    this.systemPrompt = loadPrompt(definition.key);
    this.rule = definition.rule;
  }

  async run(input: AgentInput): Promise<AgentOutput> {
    if (!isLlmEnabled()) {
      return this.rule(input);
    }
  
    const agentConfig = await this.loadAgentConfig();
  
    if (!agentConfig.enabled || agentConfig.provider === "rule") {
      return this.rule(input);
    }
  
    try {
      return await invokeWithAgentConfig(
        {
          systemPrompt: this.systemPrompt,
          userPrompt: buildUserPrompt(this, input),
        },
        agentOutputSchema,
        agentConfig,
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

  private async loadAgentConfig(): Promise<AgentLlmConfig> {
    try {
      const config = await prisma.llmAgentConfig.findUnique({
        where: { agentKey: this.key },
      });
  
      if (config) {
        return {
          provider: config.provider as AgentLlmConfig["provider"],
          model: config.model,
          temperature: config.temperature,
          fallbackProvider: config.fallbackProvider as AgentLlmConfig["provider"] | undefined ?? undefined,
          fallbackModel: config.fallbackModel ?? undefined,
          enabled: config.enabled,
        };
      }
    } catch {
      // Se falhar ao buscar config, usa o default
    }
  
    // Default: usa config global do .env
    const { getDefaultLlmConfig } = await import("@gelocci/studio-llm");
    const defaultConfig = getDefaultLlmConfig();
  
    return {
      provider: defaultConfig.provider,
      model: defaultConfig.model,
      temperature: defaultConfig.temperature,
      enabled: defaultConfig.provider !== "rule",
    };
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
- Seja direto e objetivo.
- Se houver risco alto, use requiredApproval = "GERSON".
- Se a demanda envolver cálculo financeiro, INSS, IR, segurança, privacidade, publicação ou notícia, eleve risco e exija aprovação adequada.
- Se seu papel não for orquestrador, deixe nextAgents vazio, exceto se houver motivo claro para encaminhamento.
`;
}

// ─── Utilitários ─────────────────────────────────────────────────────────────

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

// ─── Rules dedicadas ─────────────────────────────────────────────────────────
function classifierRule(input: AgentInput): AgentOutput {
  return {
    status: "CHANGES_REQUESTED",
    summary: "LLM indisponível. Classificação automática não executada.",
    decision: "Escalar para Owner — classificação requer LLM habilitada.",
    risk: "HIGH",
    complexity: "UNKNOWN",
    category: "UNKNOWN",
    requiredApproval: "GERSON",
    findings: [
      "LLM_PROVIDER está desabilitado ou a LLM falhou.",
      "Sem LLM, não é possível classificar a demanda com segurança.",
      `Demanda recebida: "${input.demand.title}" (${input.demand.origin}, prioridade ${input.demand.priority}).`,
    ],
    recommendations: [
      "Configurar LLM_PROVIDER no .env para ativar classificação real.",
      "Enquanto LLM estiver desabilitada, o Owner deve classificar manualmente.",
    ],
    nextAgents: ["owner"],
    metadata: { mode: "fallback", awaitingHumanDecision: true },
  };
}

function orchestratorRule(input: AgentInput): AgentOutput {
  const executions = input.previousExecutions;

  if (executions.length === 0) {
    return {
      status: "BLOCKED",
      summary: "Orquestrador não recebeu pareceres anteriores.",
      decision: "Bloquear — classificador deve executar antes do orquestrador.",
      risk: "HIGH",
      complexity: "UNKNOWN",
      requiredApproval: "GERSON",
      findings: ["Nenhum parecer anterior encontrado. Fluxo iniciado incorretamente."],
      recommendations: ["Verificar se o classificador executou corretamente."],
      nextAgents: [],
      metadata: { mode: "rule" },
    };
  }

  const hasBlocked = executions.some((e) => e.output?.status === "BLOCKED");
  const hasRejected = executions.some((e) => e.output?.status === "REJECTED");
  const hasChangesRequested = executions.some((e) => e.output?.status === "CHANGES_REQUESTED");
  const hasGersonRequired = executions.some((e) => e.output?.requiredApproval === "GERSON");

  const highestRisk = executions.reduce<"LOW" | "MEDIUM" | "HIGH">((acc, e) => {
    if (e.output?.risk === "HIGH") return "HIGH";
    if (e.output?.risk === "MEDIUM" && acc !== "HIGH") return "MEDIUM";
    return acc;
  }, "LOW");

  if (hasBlocked || hasRejected) {
    return {
      status: "BLOCKED",
      summary: "Um ou mais agentes bloquearam o fluxo.",
      decision: "Fluxo interrompido. Revisar pareceres bloqueados antes de continuar.",
      risk: "HIGH",
      complexity: "UNKNOWN",
      requiredApproval: "GERSON",
      findings: [
        hasBlocked ? "Agente com status BLOCKED identificado." : "",
        hasRejected ? "Agente com status REJECTED identificado." : "",
      ].filter(Boolean),
      recommendations: ["Revisar o parecer do agente bloqueado e corrigir antes de re-executar."],
      nextAgents: [],
      metadata: { mode: "rule" },
    };
  }

  if (hasChangesRequested) {
    return {
      status: "CHANGES_REQUESTED",
      summary: "Um ou mais agentes solicitaram ajustes antes de continuar.",
      decision: "Solicitar revisão antes de avançar para Studio Lead.",
      risk: highestRisk,
      complexity: "MEDIUM",
      requiredApproval: hasGersonRequired ? "GERSON" : "STUDIO_LEAD",
      findings: ["Há pareceres com CHANGES_REQUESTED no fluxo."],
      recommendations: ["Resolver os ajustes solicitados e re-executar os agentes afetados."],
      nextAgents: [],
      metadata: { mode: "rule" },
    };
  }

  // Monta nextAgents com base na categoria do classificador
  const classifier = executions.find((e) => e.agentRole === "CLASSIFIER");
  const category = classifier?.output?.category ?? "UNKNOWN";
  const nextAgents: string[] = [];

  if (category === "CONTACT") nextAgents.push("atendimento", "revisor-atendimento");
  if (category === "AUDIT") nextAgents.push("auditor");
  if (category === "PRODUCT") nextAgents.push("produto");
  if (category === "VISUAL") nextAgents.push("ux-ui", "revisor-ux-ui");
  if (category === "CONTENT") nextAgents.push("conteudo-seo", "revisor-conteudo-seo");
  if (category === "FINANCIAL") nextAgents.push("financeiro", "revisor-financeiro", "arquiteto", "desenvolvedor", "revisor-tecnico", "qa", "revisor-qa");
  if (category === "TECHNICAL") nextAgents.push("arquiteto", "desenvolvedor", "revisor-tecnico", "qa", "revisor-qa");
  if (category === "SECURITY") nextAgents.push("seguranca", "revisor-seguranca");
  if (category === "NEWS") nextAgents.push("scraper-noticias", "conteudo-seo", "revisor-conteudo-seo");
  if (category === "UNKNOWN") nextAgents.push("owner");

  nextAgents.push("studio-lead");
  if (highestRisk === "HIGH") nextAgents.push("owner");

  return {
    status: highestRisk === "HIGH" ? "APPROVED_WITH_NOTES" : "APPROVED",
    summary: "Orquestrador consolidou os pareceres. Fluxo montado com base na classificação.",
    decision: hasGersonRequired
      ? "Fluxo aprovado pelo orquestrador, mas requer validação do Owner."
      : "Fluxo aprovado pelo orquestrador. Encaminhar ao Studio Lead.",
    risk: highestRisk,
    complexity: "MEDIUM",
    requiredApproval: hasGersonRequired ? "GERSON" : "STUDIO_LEAD",
    findings: [
      `Categoria identificada pelo classificador: ${category}.`,
      `${executions.length} parecer(es) consolidado(s).`,
      hasGersonRequired ? "Owner foi sinalizado por um ou mais agentes." : "",
    ].filter(Boolean),
    recommendations: ["Encaminhar ao Studio Lead para decisão final."],
    nextAgents,
    metadata: { mode: "rule", category },
  };
}

function studioLeadRule(input: AgentInput): AgentOutput {
  const executions = input.previousExecutions;

  const hasBlocked = executions.some((e) => e.output?.status === "BLOCKED");
  const hasRejected = executions.some((e) => e.output?.status === "REJECTED");
  const hasChangesRequested = executions.some((e) => e.output?.status === "CHANGES_REQUESTED");
  const hasGersonRequired = executions.some((e) => e.output?.requiredApproval === "GERSON");

  const highestRisk = executions.reduce<"LOW" | "MEDIUM" | "HIGH">((acc, e) => {
    if (e.output?.risk === "HIGH") return "HIGH";
    if (e.output?.risk === "MEDIUM" && acc !== "HIGH") return "MEDIUM";
    return acc;
  }, "LOW");

  const highestComplexity = executions.reduce<"LOW" | "MEDIUM" | "HIGH" | "UNKNOWN">((acc, e) => {
    if (e.output?.complexity === "HIGH") return "HIGH";
    if (e.output?.complexity === "MEDIUM" && acc !== "HIGH") return "MEDIUM";
    return acc;
  }, "LOW");

  if (hasBlocked || hasRejected) {
    return {
      status: "BLOCKED",
      summary: "Studio Lead identificou bloqueio no fluxo. Não é possível avançar.",
      decision: "Fluxo bloqueado. Revisão obrigatória antes de continuar.",
      risk: "HIGH",
      complexity: highestComplexity,
      requiredApproval: "GERSON",
      findings: [
        hasBlocked ? "Há agentes com status BLOCKED no fluxo." : "",
        hasRejected ? "Há agentes com status REJECTED no fluxo." : "",
      ].filter(Boolean),
      recommendations: [
        "Revisar todos os pareceres bloqueados.",
        "Corrigir e re-executar antes de retornar ao Studio Lead.",
      ],
      nextAgents: ["owner"],
      metadata: { mode: "rule" },
    };
  }

  if (hasGersonRequired || highestRisk === "HIGH") {
    return {
      status: "CHANGES_REQUESTED",
      summary: "Studio Lead identificou que o Owner deve aprovar antes de avançar.",
      decision: "Escalar para Owner. Demanda envolve risco alto ou área sensível.",
      risk: highestRisk,
      complexity: highestComplexity,
      requiredApproval: "GERSON",
      findings: [
        highestRisk === "HIGH" ? "Risco alto identificado no fluxo." : "",
        hasGersonRequired ? "Um ou mais agentes sinalizaram necessidade de aprovação do Owner." : "",
        hasChangesRequested ? "Há ajustes solicitados pendentes." : "",
      ].filter(Boolean),
      recommendations: [
        "Encaminhar ao Owner para decisão final.",
        "Nenhuma implementação deve ocorrer sem aprovação explícita.",
      ],
      nextAgents: ["owner"],
      metadata: { mode: "rule" },
    };
  }

  if (hasChangesRequested) {
    return {
      status: "CHANGES_REQUESTED",
      summary: "Studio Lead identificou ajustes pendentes antes da aprovação final.",
      decision: "Solicitar correções antes de aprovar.",
      risk: highestRisk,
      complexity: highestComplexity,
      requiredApproval: "STUDIO_LEAD",
      findings: ["Há pareceres com ajustes solicitados que precisam ser resolvidos."],
      recommendations: ["Resolver os ajustes e re-executar os agentes afetados."],
      nextAgents: [],
      metadata: { mode: "rule" },
    };
  }

  return {
    status: "APPROVED",
    summary: "Studio Lead aprovou o fluxo. Todos os pareceres estão consistentes.",
    decision: "Fluxo aprovado pelo Studio Lead. Pode avançar para implementação.",
    risk: highestRisk,
    complexity: highestComplexity,
    requiredApproval: "NONE",
    findings: [
      `${executions.length} parecer(es) revisado(s) sem conflitos.`,
      "Nenhum bloqueio ou rejeição identificado.",
    ],
    recommendations: ["Prosseguir com implementação conforme planejado."],
    nextAgents: [],
    metadata: { mode: "rule" },
  };
}

function ownerRule(input: AgentInput): AgentOutput {
  const executions = input.previousExecutions;

  const highestRisk = executions.reduce<"LOW" | "MEDIUM" | "HIGH">((acc, e) => {
    if (e.output?.risk === "HIGH") return "HIGH";
    if (e.output?.risk === "MEDIUM" && acc !== "HIGH") return "MEDIUM";
    return acc;
  }, "LOW");

  const highestComplexity = executions.reduce<"LOW" | "MEDIUM" | "HIGH" | "UNKNOWN">((acc, e) => {
    if (e.output?.complexity === "HIGH") return "HIGH";
    if (e.output?.complexity === "MEDIUM" && acc !== "HIGH") return "MEDIUM";
    return acc;
  }, "LOW");

  return {
    status: "CHANGES_REQUESTED",
    summary: "Owner convocado. Workflow pausado aguardando decisão humana.",
    decision: "Aguardar aprovação manual do Owner antes de qualquer avanço.",
    risk: highestRisk,
    complexity: highestComplexity,
    requiredApproval: "GERSON",
    findings: [
      "Demanda escalada ao Owner por risco alto, cálculo financeiro, segurança ou decisão estratégica.",
      `${executions.length} parecer(es) disponíveis para revisão.`,
    ],
    recommendations: [
      "Revisar todos os pareceres anteriores antes de decidir.",
      "Aprovar, rejeitar ou devolver com ajustes.",
    ],
    nextAgents: [],
    metadata: { mode: "rule", awaitingHumanDecision: true },
  };
}

function fallbackRule(name: string, agentKey: string, risk: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM"): RuleHandler {
  return (input) => ({
    status: risk === "HIGH" ? "APPROVED_WITH_NOTES" : "APPROVED",
    summary: `${name} executou análise da demanda. LLM indisponível — parecer baseado em regra de fallback.`,
    decision: "Sem bloqueio automático nesta etapa. Habilite LLM_PROVIDER para análise real.",
    risk,
    complexity: risk === "HIGH" ? "HIGH" : "MEDIUM",
    requiredApproval: risk === "HIGH" ? "GERSON" : "STUDIO_LEAD",
    findings: [
      `${name} analisou a demanda no contexto do projeto ${input.demand.project}.`,
      "ATENÇÃO: parecer gerado por regra de fallback. Configure LLM_PROVIDER no .env para análise real.",
    ],
    recommendations: ["Configurar LLM_PROVIDER no .env para ativar análise real dos agentes."],
    nextAgents: [],
    metadata: { agentKey, mode: "fallback" },
  });
}

// ─── Catálogo ─────────────────────────────────────────────────────────────────

const definitions: AgentDefinition[] = [
  { key: "classificador-demandas", name: "Classificador de Demandas", role: "CLASSIFIER", rule: classifierRule },
  { key: "orquestrador", name: "Orquestrador", role: "ORCHESTRATOR", rule: orchestratorRule },
  { key: "atendimento", name: "Atendimento", role: "EXECUTOR", rule: fallbackRule("Atendimento", "atendimento", "LOW") },
  { key: "revisor-atendimento", name: "Revisor de Atendimento", role: "REVIEWER", rule: fallbackRule("Revisor de Atendimento", "revisor-atendimento", "LOW") },
  { key: "auditor", name: "Auditor", role: "EXECUTOR", rule: fallbackRule("Auditor", "auditor", "MEDIUM") },
  { key: "produto", name: "Produto", role: "EXECUTOR", rule: fallbackRule("Produto", "produto", "LOW") },
  { key: "ux-ui", name: "UX/UI", role: "EXECUTOR", rule: fallbackRule("UX/UI", "ux-ui", "LOW") },
  { key: "revisor-ux-ui", name: "Revisor UX/UI", role: "REVIEWER", rule: fallbackRule("Revisor UX/UI", "revisor-ux-ui", "LOW") },
  { key: "conteudo-seo", name: "Conteúdo/SEO", role: "EXECUTOR", rule: fallbackRule("Conteúdo/SEO", "conteudo-seo", "LOW") },
  { key: "revisor-conteudo-seo", name: "Revisor de Conteúdo/SEO", role: "REVIEWER", rule: fallbackRule("Revisor de Conteúdo/SEO", "revisor-conteudo-seo", "LOW") },
  { key: "financeiro", name: "Financeiro", role: "EXECUTOR", rule: fallbackRule("Financeiro", "financeiro", "HIGH") },
  { key: "revisor-financeiro", name: "Revisor Financeiro", role: "REVIEWER", rule: fallbackRule("Revisor Financeiro", "revisor-financeiro", "HIGH") },
  { key: "arquiteto", name: "Arquiteto", role: "EXECUTOR", rule: fallbackRule("Arquiteto", "arquiteto", "MEDIUM") },
  { key: "desenvolvedor", name: "Desenvolvedor", role: "EXECUTOR", rule: fallbackRule("Desenvolvedor", "desenvolvedor", "MEDIUM") },
  { key: "revisor-tecnico", name: "Revisor Técnico", role: "REVIEWER", rule: fallbackRule("Revisor Técnico", "revisor-tecnico", "MEDIUM") },
  { key: "seguranca", name: "Segurança", role: "EXECUTOR", rule: fallbackRule("Segurança", "seguranca", "HIGH") },
  { key: "revisor-seguranca", name: "Revisor de Segurança", role: "REVIEWER", rule: fallbackRule("Revisor de Segurança", "revisor-seguranca", "HIGH") },
  { key: "qa", name: "QA", role: "EXECUTOR", rule: fallbackRule("QA", "qa", "MEDIUM") },
  { key: "revisor-qa", name: "Revisor de QA", role: "REVIEWER", rule: fallbackRule("Revisor de QA", "revisor-qa", "MEDIUM") },
  { key: "scraper-noticias", name: "Scraper de Notícias", role: "EXECUTOR", rule: fallbackRule("Scraper de Notícias", "scraper-noticias", "HIGH") },
  { key: "studio-lead", name: "Studio Lead", role: "STUDIO_LEAD", rule: studioLeadRule },
  { key: "owner", name: "Owner", role: "OWNER", rule: ownerRule },
];

export const agentCatalog: StudioAgent[] = definitions.map((definition) => new BaseLlmAgent(definition));

export function getAgent(key: string): StudioAgent {
  const agent = agentCatalog.find((item) => item.key === key);

  if (!agent) {
    throw new Error(`Agente não registrado: ${key}`);
  }

  return agent;
}
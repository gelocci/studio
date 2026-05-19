import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { z } from "zod";

export const llmProviderSchema = z.enum(["rule", "groq", "openai", "anthropic"]);
export type LlmProvider = z.infer<typeof llmProviderSchema>;

export interface LlmConfig {
  provider: LlmProvider;
  model: string;
  temperature: number;
  groqApiKey?: string;
  openAiApiKey?: string;
  anthropicApiKey?: string;
}

export interface AgentLlmConfig {
  provider: LlmProvider;
  model: string;
  temperature: number;
  fallbackProvider?: LlmProvider;
  fallbackModel?: string;
  enabled: boolean;
}

export interface InvokeJsonInput {
  systemPrompt: string;
  userPrompt: string;
}

export function getDefaultLlmConfig(): LlmConfig {
  const provider = llmProviderSchema.catch("rule").parse(process.env.LLM_PROVIDER);

  return {
    provider,
    temperature: numberFromEnv(process.env.LLM_TEMPERATURE, 0.2),
    model: modelFromProvider(provider),
    groqApiKey: emptyToUndefined(process.env.GROQ_API_KEY),
    openAiApiKey: emptyToUndefined(process.env.OPENAI_API_KEY),
    anthropicApiKey: emptyToUndefined(process.env.ANTHROPIC_API_KEY),
  };
}

export function isLlmEnabled(): boolean {
  return getDefaultLlmConfig().provider !== "rule";
}

export async function invokeStructuredJson<T>(
  input: InvokeJsonInput,
  schema: z.ZodType<T>,
): Promise<T> {
  const config = getDefaultLlmConfig();

  if (config.provider === "rule") {
    throw new Error("LLM_PROVIDER=rule. Execução por LLM desabilitada.");
  }

  const model = createChatModel(config.provider, config.model, config.temperature);
  return invokeWithModel(model, input, schema);
}

export async function invokeWithAgentConfig<T>(
  input: InvokeJsonInput,
  schema: z.ZodType<T>,
  agentConfig: AgentLlmConfig,
): Promise<T> {
  if (!agentConfig.enabled || agentConfig.provider === "rule") {
    throw new Error(`Agente com LLM desabilitada ou provider=rule.`);
  }

  console.log(`[llm] Invocando agente ${agentConfig.provider}/${agentConfig.model}`);
  
  try {
    const model = createChatModel(agentConfig.provider, agentConfig.model, agentConfig.temperature);
    return await invokeWithModel(model, input, schema);
  } catch (primaryError) {
    if (!agentConfig.fallbackProvider || !agentConfig.fallbackModel) {
      throw primaryError;
    }

    const primaryMessage = primaryError instanceof Error ? primaryError.message : String(primaryError);
    console.warn(`[llm] Provider primário ${agentConfig.provider} falhou: ${primaryMessage}. Tentando fallback ${agentConfig.fallbackProvider}...`);

    try {
      const fallbackModel = createChatModel(
        agentConfig.fallbackProvider,
        agentConfig.fallbackModel,
        agentConfig.temperature,
      );
      return await invokeWithModel(fallbackModel, input, schema);
    } catch (fallbackError) {
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      throw new Error(
        `Provider primário (${agentConfig.provider}) e fallback (${agentConfig.fallbackProvider}) falharam. ` +
        `Primário: ${primaryMessage}. Fallback: ${fallbackMessage}`,
      );
    }
  }
}

async function invokeWithModel<T>(
  model: ReturnType<typeof createChatModel>,
  input: InvokeJsonInput,
  schema: z.ZodType<T>,
): Promise<T> {
  const response = await model.invoke([
    new SystemMessage(input.systemPrompt),
    new HumanMessage(input.userPrompt),
  ]);

  const raw = contentToString(response.content);
  const parsed = parseJsonFromContent(raw);
  return schema.parse(parsed);
}

function createChatModel(provider: LlmProvider, model: string, temperature: number) {
  if (provider === "groq") {
    const apiKey = emptyToUndefined(process.env.GROQ_API_KEY);
    if (!apiKey) throw new Error("GROQ_API_KEY não configurada.");

    return new ChatOpenAI({
      apiKey,
      model,
      temperature,
      configuration: {
        baseURL: "https://api.groq.com/openai/v1",
      },
    });
  }

  if (provider === "openai") {
    const apiKey = emptyToUndefined(process.env.OPENAI_API_KEY);
    if (!apiKey) throw new Error("OPENAI_API_KEY não configurada.");

    return new ChatOpenAI({ apiKey, model, temperature });
  }

  if (provider === "anthropic") {
    const apiKey = emptyToUndefined(process.env.ANTHROPIC_API_KEY);
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY não configurada.");

    return new ChatAnthropic({ apiKey, model, temperature });
  }

  throw new Error(`LLM provider não suportado: ${provider}`);
}

function modelFromProvider(provider: LlmProvider): string {
  if (provider === "groq") return process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  if (provider === "openai") return process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (provider === "anthropic") return process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  return "rule";
}

function parseJsonFromContent(content: string): unknown {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      return JSON.parse(fenced[1].trim());
    }

    const objectMatch = trimmed.match(/\{[\s\S]*\}/);
    if (objectMatch?.[0]) {
      return JSON.parse(objectMatch[0]);
    }

    throw new Error(`A LLM não retornou JSON válido: ${trimmed.slice(0, 500)}`);
  }
}

function contentToString(content: unknown): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null && "text" in item) {
          return String((item as { text: unknown }).text);
        }
        return JSON.stringify(item);
      })
      .join("\n");
  }

  return JSON.stringify(content);
}

function emptyToUndefined(value: string | undefined): string | undefined {
  if (!value || value.trim().length === 0) return undefined;
  return value;
}

function numberFromEnv(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
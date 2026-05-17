import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { z } from "zod";

export const llmProviderSchema = z.enum(["rule", "groq", "openai", "anthropic"]);
export type LlmProvider = z.infer<typeof llmProviderSchema>;

export interface LlmConfig {
  provider: LlmProvider;
  temperature: number;
  groqApiKey?: string;
  groqModel: string;
  openAiApiKey?: string;
  openAiModel: string;
  anthropicApiKey?: string;
  anthropicModel: string;
}

export interface InvokeJsonInput {
  systemPrompt: string;
  userPrompt: string;
}

export function getLlmConfig(): LlmConfig {
  const provider = llmProviderSchema.catch("rule").parse(process.env.LLM_PROVIDER);

  return {
    provider,
    temperature: numberFromEnv(process.env.LLM_TEMPERATURE, 0.2),
    groqApiKey: emptyToUndefined(process.env.GROQ_API_KEY),
    groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    openAiApiKey: emptyToUndefined(process.env.OPENAI_API_KEY),
    openAiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
    anthropicApiKey: emptyToUndefined(process.env.ANTHROPIC_API_KEY),
    anthropicModel: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
  };
}

export function isLlmEnabled(): boolean {
  return getLlmConfig().provider !== "rule";
}

export async function invokeStructuredJson<T>(input: InvokeJsonInput, schema: z.ZodType<T>): Promise<T> {
  const config = getLlmConfig();

  if (config.provider === "rule") {
    throw new Error("LLM_PROVIDER=rule. Execução por LLM desabilitada.");
  }

  const model = createChatModel(config);

  const response = await model.invoke([
    new SystemMessage(input.systemPrompt),
    new HumanMessage(input.userPrompt),
  ]);

  const raw = contentToString(response.content);
  const parsed = parseJsonFromContent(raw);

  return schema.parse(parsed);
}

function createChatModel(config: LlmConfig) {
  if (config.provider === "groq") {
    if (!config.groqApiKey) {
      throw new Error("GROQ_API_KEY não configurada.");
    }

    return new ChatOpenAI({
      apiKey: config.groqApiKey,
      model: config.groqModel,
      temperature: config.temperature,
      configuration: {
        baseURL: "https://api.groq.com/openai/v1",
      },
    });
  }

  if (config.provider === "openai") {
    if (!config.openAiApiKey) {
      throw new Error("OPENAI_API_KEY não configurada.");
    }

    return new ChatOpenAI({
      apiKey: config.openAiApiKey,
      model: config.openAiModel,
      temperature: config.temperature,
    });
  }

  if (config.provider === "anthropic") {
    if (!config.anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY não configurada.");
    }

    return new ChatAnthropic({
      apiKey: config.anthropicApiKey,
      model: config.anthropicModel,
      temperature: config.temperature,
    });
  }

  throw new Error(`LLM provider não suportado: ${config.provider}`);
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
  if (typeof content === "string") {
    return content;
  }

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
  if (!value || value.trim().length === 0) {
    return undefined;
  }

  return value;
}

function numberFromEnv(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

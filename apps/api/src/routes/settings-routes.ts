import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { getAutoFlowSettings, updateAutoFlowSettings } from "../services/autoflow-service.js";

const updateAutoFlowSchema = z.object({
  autoFlowMode: z.enum(["OFF", "ASSISTED", "CONTROLLED", "FULL"]),
});

const upsertLlmAgentConfigSchema = z.object({
  provider: z.enum(["rule", "groq", "openai", "anthropic"]),
  model: z.string().min(1),
  fallbackProvider: z.enum(["rule", "groq", "openai", "anthropic"]).optional(),
  fallbackModel: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.2),
  enabled: z.boolean().default(true),
});

export async function settingsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/autoflow", async () => {
    return getAutoFlowSettings();
  });

  app.put("/autoflow", async (request) => {
    const body = updateAutoFlowSchema.parse(request.body);
    return updateAutoFlowSettings(body.autoFlowMode);
  });

  // Lista config LLM de todos os agentes
  app.get("/llm", async () => {
    return prisma.llmAgentConfig.findMany({
      orderBy: { agentKey: "asc" },
    });
  });

  // Busca config LLM de um agente específico
  app.get("/llm/:agentKey", async (request, reply) => {
    const params = z.object({ agentKey: z.string().min(1) }).parse(request.params);

    const config = await prisma.llmAgentConfig.findUnique({
      where: { agentKey: params.agentKey },
    });

    if (!config) {
      return reply.notFound(`Config LLM não encontrada para o agente: ${params.agentKey}`);
    }

    return config;
  });

  // Cria ou atualiza config LLM de um agente
  app.put("/llm/:agentKey", async (request) => {
    const params = z.object({ agentKey: z.string().min(1) }).parse(request.params);
    const body = upsertLlmAgentConfigSchema.parse(request.body);

    return prisma.llmAgentConfig.upsert({
      where: { agentKey: params.agentKey },
      update: {
        provider: body.provider,
        model: body.model,
        fallbackProvider: body.fallbackProvider ?? null,
        fallbackModel: body.fallbackModel ?? null,
        temperature: body.temperature,
        enabled: body.enabled,
      },
      create: {
        agentKey: params.agentKey,
        provider: body.provider,
        model: body.model,
        fallbackProvider: body.fallbackProvider ?? null,
        fallbackModel: body.fallbackModel ?? null,
        temperature: body.temperature,
        enabled: body.enabled,
      },
    });
  });

  // Remove config LLM de um agente (volta a usar o default do .env)
  app.delete("/llm/:agentKey", async (request, reply) => {
    const params = z.object({ agentKey: z.string().min(1) }).parse(request.params);

    const existing = await prisma.llmAgentConfig.findUnique({
      where: { agentKey: params.agentKey },
    });

    if (!existing) {
      return reply.notFound(`Config LLM não encontrada para o agente: ${params.agentKey}`);
    }

    await prisma.llmAgentConfig.delete({
      where: { agentKey: params.agentKey },
    });

    return { deleted: true, agentKey: params.agentKey };
  });
}
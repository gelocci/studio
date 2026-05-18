-- CreateEnum
CREATE TYPE "LlmProvider" AS ENUM ('rule', 'groq', 'openai', 'anthropic');

-- CreateTable
CREATE TABLE "llm_agent_configs" (
    "id" TEXT NOT NULL,
    "agentKey" TEXT NOT NULL,
    "provider" "LlmProvider" NOT NULL DEFAULT 'groq',
    "model" TEXT NOT NULL DEFAULT 'llama-3.3-70b-versatile',
    "fallbackProvider" "LlmProvider",
    "fallbackModel" TEXT,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "llm_agent_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "llm_agent_configs_agentKey_key" ON "llm_agent_configs"("agentKey");

-- CreateIndex
CREATE INDEX "llm_agent_configs_agentKey_idx" ON "llm_agent_configs"("agentKey");

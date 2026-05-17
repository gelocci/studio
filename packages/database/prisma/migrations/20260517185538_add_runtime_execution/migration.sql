-- CreateEnum
CREATE TYPE "AgentExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'DONE', 'FAILED', 'SKIPPED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "AgentRole" AS ENUM ('ENTRY', 'CLASSIFIER', 'ORCHESTRATOR', 'EXECUTOR', 'REVIEWER', 'STUDIO_LEAD', 'OWNER');

-- CreateEnum
CREATE TYPE "AgentDecisionStatus" AS ENUM ('APPROVED', 'APPROVED_WITH_NOTES', 'CHANGES_REQUESTED', 'BLOCKED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ComplexityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "RequiredApproval" AS ENUM ('NONE', 'STUDIO_LEAD', 'GERSON');

-- CreateEnum
CREATE TYPE "WorkflowEventType" AS ENUM ('WORKFLOW_QUEUED', 'WORKFLOW_STARTED', 'WORKFLOW_PAUSED', 'WORKFLOW_RESUMED', 'WORKFLOW_FINISHED', 'WORKFLOW_FAILED', 'AGENT_STARTED', 'AGENT_FINISHED', 'AGENT_FAILED', 'REVIEW_STARTED', 'REVIEW_FINISHED', 'APPROVAL_REQUIRED', 'APPROVAL_GRANTED', 'APPROVAL_REJECTED');

-- CreateEnum
CREATE TYPE "WorkflowApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WorkflowRunStatus" ADD VALUE 'QUEUED';
ALTER TYPE "WorkflowRunStatus" ADD VALUE 'WAITING_APPROVAL';

-- AlterTable
ALTER TABLE "workflow_runs" ADD COLUMN     "autoFlowMode" "AutoFlowMode",
ADD COLUMN     "currentStep" TEXT,
ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "agent_executions" (
    "id" TEXT NOT NULL,
    "workflowRunId" TEXT NOT NULL,
    "demandId" TEXT,
    "agentKey" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "agentRole" "AgentRole" NOT NULL,
    "status" "AgentExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "input" JSONB,
    "output" JSONB,
    "decision" "AgentDecisionStatus",
    "risk" "RiskLevel",
    "complexity" "ComplexityLevel",
    "requiredApproval" "RequiredApproval",
    "summary" TEXT,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_reviews" (
    "id" TEXT NOT NULL,
    "workflowRunId" TEXT NOT NULL,
    "agentExecutionId" TEXT,
    "reviewerKey" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "status" "AgentExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "decision" "AgentDecisionStatus",
    "comments" TEXT,
    "output" JSONB,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_events" (
    "id" TEXT NOT NULL,
    "workflowRunId" TEXT NOT NULL,
    "type" "WorkflowEventType" NOT NULL,
    "message" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_approvals" (
    "id" TEXT NOT NULL,
    "workflowRunId" TEXT NOT NULL,
    "demandId" TEXT,
    "requestedByAgent" TEXT,
    "requiredApprover" "RequiredApproval" NOT NULL,
    "status" "WorkflowApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT NOT NULL,
    "payload" JSONB,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agent_executions_workflowRunId_idx" ON "agent_executions"("workflowRunId");

-- CreateIndex
CREATE INDEX "agent_executions_demandId_idx" ON "agent_executions"("demandId");

-- CreateIndex
CREATE INDEX "agent_executions_agentKey_idx" ON "agent_executions"("agentKey");

-- CreateIndex
CREATE INDEX "agent_executions_status_idx" ON "agent_executions"("status");

-- CreateIndex
CREATE INDEX "agent_reviews_workflowRunId_idx" ON "agent_reviews"("workflowRunId");

-- CreateIndex
CREATE INDEX "agent_reviews_agentExecutionId_idx" ON "agent_reviews"("agentExecutionId");

-- CreateIndex
CREATE INDEX "agent_reviews_reviewerKey_idx" ON "agent_reviews"("reviewerKey");

-- CreateIndex
CREATE INDEX "agent_reviews_status_idx" ON "agent_reviews"("status");

-- CreateIndex
CREATE INDEX "workflow_events_workflowRunId_idx" ON "workflow_events"("workflowRunId");

-- CreateIndex
CREATE INDEX "workflow_events_type_idx" ON "workflow_events"("type");

-- CreateIndex
CREATE INDEX "workflow_events_createdAt_idx" ON "workflow_events"("createdAt");

-- CreateIndex
CREATE INDEX "workflow_approvals_workflowRunId_idx" ON "workflow_approvals"("workflowRunId");

-- CreateIndex
CREATE INDEX "workflow_approvals_demandId_idx" ON "workflow_approvals"("demandId");

-- CreateIndex
CREATE INDEX "workflow_approvals_status_idx" ON "workflow_approvals"("status");

-- AddForeignKey
ALTER TABLE "agent_executions" ADD CONSTRAINT "agent_executions_workflowRunId_fkey" FOREIGN KEY ("workflowRunId") REFERENCES "workflow_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_reviews" ADD CONSTRAINT "agent_reviews_workflowRunId_fkey" FOREIGN KEY ("workflowRunId") REFERENCES "workflow_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_reviews" ADD CONSTRAINT "agent_reviews_agentExecutionId_fkey" FOREIGN KEY ("agentExecutionId") REFERENCES "agent_executions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_events" ADD CONSTRAINT "workflow_events_workflowRunId_fkey" FOREIGN KEY ("workflowRunId") REFERENCES "workflow_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_approvals" ADD CONSTRAINT "workflow_approvals_workflowRunId_fkey" FOREIGN KEY ("workflowRunId") REFERENCES "workflow_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_approvals" ADD CONSTRAINT "workflow_approvals_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "demands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

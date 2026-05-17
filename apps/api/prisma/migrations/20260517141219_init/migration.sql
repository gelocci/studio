-- CreateEnum
CREATE TYPE "DemandStatus" AS ENUM ('NEW', 'TRIAGE', 'RUNNING', 'WAITING_APPROVAL', 'BLOCKED', 'DONE', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DemandPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "DemandOrigin" AS ENUM ('MANUAL', 'CONTACT', 'AUDIT', 'RADAR', 'NEWS', 'GITHUB', 'SITE_FEEDBACK');

-- CreateEnum
CREATE TYPE "BacklogItemType" AS ENUM ('IMPROVEMENT', 'INCIDENT', 'BUG', 'QUESTION', 'CONTENT', 'NEWS', 'SEO', 'REFACTOR', 'SECURITY', 'PRODUCT', 'TECHNICAL', 'PUBLICATION', 'AUDIT');

-- CreateEnum
CREATE TYPE "BacklogItemStatus" AS ENUM ('NEW', 'TRIAGE', 'READY', 'RUNNING', 'WAITING_APPROVAL', 'BLOCKED', 'DONE', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkflowRunStatus" AS ENUM ('CREATED', 'TRIAGED', 'AGENTS_RUNNING', 'CHANGES_REQUESTED', 'BLOCKED', 'PLANNED', 'IMPLEMENTING', 'REVIEWING', 'READY_FOR_APPROVAL', 'APPROVED', 'PR_CREATED', 'MERGED', 'CLOSED', 'FAILED');

-- CreateTable
CREATE TABLE "demands" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "origin" "DemandOrigin" NOT NULL,
    "priority" "DemandPriority" NOT NULL,
    "status" "DemandStatus" NOT NULL DEFAULT 'NEW',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backlog_items" (
    "id" TEXT NOT NULL,
    "demandId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "type" "BacklogItemType" NOT NULL,
    "status" "BacklogItemStatus" NOT NULL DEFAULT 'NEW',
    "priority" "DemandPriority" NOT NULL DEFAULT 'MEDIUM',
    "source" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "backlog_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_runs" (
    "id" TEXT NOT NULL,
    "demandId" TEXT,
    "project" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "WorkflowRunStatus" NOT NULL DEFAULT 'CREATED',
    "summary" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "demands_project_idx" ON "demands"("project");

-- CreateIndex
CREATE INDEX "demands_status_idx" ON "demands"("status");

-- CreateIndex
CREATE INDEX "demands_origin_idx" ON "demands"("origin");

-- CreateIndex
CREATE INDEX "demands_priority_idx" ON "demands"("priority");

-- CreateIndex
CREATE INDEX "backlog_items_demandId_idx" ON "backlog_items"("demandId");

-- CreateIndex
CREATE INDEX "backlog_items_project_idx" ON "backlog_items"("project");

-- CreateIndex
CREATE INDEX "backlog_items_type_idx" ON "backlog_items"("type");

-- CreateIndex
CREATE INDEX "backlog_items_status_idx" ON "backlog_items"("status");

-- CreateIndex
CREATE INDEX "workflow_runs_demandId_idx" ON "workflow_runs"("demandId");

-- CreateIndex
CREATE INDEX "workflow_runs_project_idx" ON "workflow_runs"("project");

-- CreateIndex
CREATE INDEX "workflow_runs_status_idx" ON "workflow_runs"("status");

-- AddForeignKey
ALTER TABLE "backlog_items" ADD CONSTRAINT "backlog_items_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "demands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_runs" ADD CONSTRAINT "workflow_runs_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "demands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

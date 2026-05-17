import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { publishStudioEvent } from "../events/studio-events.js";

const createWorkflowRunSchema = z.object({
  demandId: z.string().uuid().optional(),
  project: z.string().min(1),
  title: z.string().min(3),
  status: z.enum(["CREATED", "TRIAGED", "AGENTS_RUNNING", "CHANGES_REQUESTED", "BLOCKED", "PLANNED", "IMPLEMENTING", "REVIEWING", "READY_FOR_APPROVAL", "APPROVED", "PR_CREATED", "MERGED", "CLOSED", "FAILED"]).default("CREATED"),
  summary: z.string().optional(),
  payload: z.unknown(),
});

export async function workflowRunRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", async () => {
    return prisma.workflowRun.findMany({
      orderBy: { createdAt: "desc" },
      include: { demand: { select: { id: true, title: true, project: true } } },
    });
  });

  app.get("/latest", async (request, reply) => {
    const query = z.object({ project: z.string().optional() }).parse(request.query);
    const workflowRun = await prisma.workflowRun.findFirst({
      where: { project: query.project },
      orderBy: { createdAt: "desc" },
    });
    if (!workflowRun) return reply.notFound("Nenhuma execução de workflow encontrada.");
    return workflowRun;
  });

  app.post("/", async (request, reply) => {
    const body = createWorkflowRunSchema.parse(request.body);
    const workflowRun = await prisma.workflowRun.create({
      data: {
        demandId: body.demandId,
        project: body.project,
        title: body.title,
        status: body.status,
        summary: body.summary,
        payload: JSON.parse(JSON.stringify(body.payload)),
      },
    });

    publishStudioEvent("WORKFLOW_RUN_CREATED", {
      workflowRunId: workflowRun.id,
      demandId: workflowRun.demandId,
      project: workflowRun.project,
      title: workflowRun.title,
      status: workflowRun.status,
    });

    return reply.code(201).send(workflowRun);
  });
}

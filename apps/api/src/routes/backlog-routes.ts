import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { publishStudioEvent } from "../events/studio-events.js";

const createBacklogItemSchema = z.object({
  demandId: z.string().uuid().optional(),
  title: z.string().min(3),
  description: z.string().min(3),
  project: z.string().min(1),
  type: z.enum(["IMPROVEMENT", "INCIDENT", "BUG", "QUESTION", "CONTENT", "NEWS", "SEO", "REFACTOR", "SECURITY", "PRODUCT", "TECHNICAL", "PUBLICATION", "AUDIT"]),
  status: z.enum(["NEW", "TRIAGE", "READY", "RUNNING", "WAITING_APPROVAL", "BLOCKED", "DONE", "REJECTED", "ARCHIVED"]).default("NEW"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  source: z.string().optional(),
  metadata: z.unknown().optional(),
});

export async function backlogRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", async () => {
    return prisma.backlogItem.findMany({
      orderBy: { createdAt: "desc" },
      include: { demand: { select: { id: true, title: true, project: true } } },
    });
  });

  app.post("/", async (request, reply) => {
    const body = createBacklogItemSchema.parse(request.body);
    const backlogItem = await prisma.backlogItem.create({
      data: {
        demandId: body.demandId,
        title: body.title,
        description: body.description,
        project: body.project,
        type: body.type,
        status: body.status,
        priority: body.priority,
        source: body.source,
        metadata: body.metadata === undefined ? undefined : JSON.parse(JSON.stringify(body.metadata)),
      },
    });

    publishStudioEvent("BACKLOG_ITEM_CREATED", {
      backlogItemId: backlogItem.id,
      demandId: backlogItem.demandId,
      title: backlogItem.title,
      project: backlogItem.project,
      type: backlogItem.type,
      status: backlogItem.status,
    });

    return reply.code(201).send(backlogItem);
  });
}

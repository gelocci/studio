import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db/prisma.js";

const createDemandSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  project: z.string().min(1),
  origin: z.enum(["MANUAL", "CONTACT", "AUDIT", "RADAR", "NEWS", "GITHUB", "SITE_FEEDBACK"]).default("MANUAL"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z.enum(["NEW", "TRIAGE", "RUNNING", "WAITING_APPROVAL", "BLOCKED", "DONE", "REJECTED", "ARCHIVED"]).default("NEW"),
  metadata: z.unknown().optional(),
});

export async function demandRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", async () => prisma.demand.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { backlogItems: true, workflowRuns: true } } } }));

  app.get("/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const demand = await prisma.demand.findUnique({ where: { id: params.id }, include: { backlogItems: true, workflowRuns: { orderBy: { createdAt: "desc" } } } });
    if (!demand) return reply.notFound("Demanda não encontrada.");
    return demand;
  });

  app.post("/", async (request, reply) => {
    const body = createDemandSchema.parse(request.body);
    const demand = await prisma.demand.create({ data: { ...body, metadata: body.metadata === undefined ? undefined : JSON.parse(JSON.stringify(body.metadata)) } });
    return reply.code(201).send(demand);
  });
}

import { DemandStatus, type Prisma } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { publishStudioEvent } from "../events/studio-events.js";
import { applyAutoFlowToDemand, createWorkflowForDemand } from "../services/autoflow-service.js";

const createDemandSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  project: z.string().min(1),
  origin: z.enum(["MANUAL", "CONTACT", "AUDIT", "RADAR", "NEWS", "GITHUB", "SITE_FEEDBACK"]).default("MANUAL"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z.enum(["NEW", "TRIAGE", "RUNNING", "WAITING_APPROVAL", "BLOCKED", "DONE", "REJECTED", "ARCHIVED"]).default("NEW"),
  metadata: z.unknown().optional(),
});

const listDemandQuerySchema = z.object({
  view: z.enum(["active", "rejected", "archived", "all"]).default("active"),
});

export async function demandRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", async (request) => {
    const query = listDemandQuerySchema.parse(request.query);

    return prisma.demand.findMany({
      where: whereFromView(query.view),
      orderBy: [
        {
          updatedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      include: {
        _count: {
          select: {
            backlogItems: true,
            workflowRuns: true,
          },
        },
      },
    });
  });

  app.get("/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);

    const demand = await prisma.demand.findUnique({
      where: {
        id: params.id,
      },
      include: {
        backlogItems: true,
        workflowRuns: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!demand) {
      return reply.notFound("Demanda não encontrada.");
    }

    return demand;
  });

  app.post("/", async (request, reply) => {
    const body = createDemandSchema.parse(request.body);

    const demand = await prisma.demand.create({
      data: {
        title: body.title,
        description: body.description,
        project: body.project,
        origin: body.origin,
        priority: body.priority,
        status: body.status,
        metadata: body.metadata === undefined ? undefined : JSON.parse(JSON.stringify(body.metadata)),
      },
    });

    publishDemandEvent("DEMAND_CREATED", demand);

    await applyAutoFlowToDemand(demand);

    return reply.code(201).send(demand);
  });

  app.post("/:id/start-analysis", async (request, reply) => {
    const demand = await findDemandFromParams(request.params);

    if (!demand) {
      return reply.notFound("Demanda não encontrada.");
    }

    const workflowRun = await createWorkflowForDemand(demand, {
      status: "TRIAGED",
      demandStatus: "TRIAGE",
      autoFlowMode: "OFF",
      reason: "Workflow criado manualmente porque AutoFlow está desligado ou a demanda aguardava processamento.",
    });

    return reply.code(201).send(workflowRun);
  });

  app.post("/:id/approve", async (request, reply) => {
    const demand = await findDemandFromParams(request.params);

    if (!demand) {
      return reply.notFound("Demanda não encontrada.");
    }

    if (demand.status === "NEW") {
      const workflowRun = await createWorkflowForDemand(demand, {
        status: "TRIAGED",
        demandStatus: "TRIAGE",
        autoFlowMode: "OFF",
        reason: "Demanda aprovada manualmente. Workflow criado para análise.",
      });

      return reply.code(201).send(workflowRun);
    }

    const updated = await prisma.demand.update({
      where: {
        id: demand.id,
      },
      data: {
        status: "RUNNING",
      },
    });

    publishDemandEvent("DEMAND_UPDATED", updated);

    return updated;
  });

  app.post("/:id/reject", async (request, reply) => {
    const demand = await findDemandFromParams(request.params);

    if (!demand) {
      return reply.notFound("Demanda não encontrada.");
    }

    const updated = await prisma.demand.update({
      where: {
        id: demand.id,
      },
      data: {
        status: "REJECTED",
      },
    });

    publishDemandEvent("DEMAND_UPDATED", updated);

    return updated;
  });

  app.post("/:id/archive", async (request, reply) => {
    const demand = await findDemandFromParams(request.params);

    if (!demand) {
      return reply.notFound("Demanda não encontrada.");
    }

    const updated = await prisma.demand.update({
      where: {
        id: demand.id,
      },
      data: {
        status: "ARCHIVED",
      },
    });

    publishDemandEvent("DEMAND_UPDATED", updated);

    return updated;
  });
}

function whereFromView(view: "active" | "rejected" | "archived" | "all"): Prisma.DemandWhereInput {
  if (view === "rejected") {
    return {
      status: DemandStatus.REJECTED,
    };
  }

  if (view === "archived") {
    return {
      status: DemandStatus.ARCHIVED,
    };
  }

  if (view === "all") {
    return {};
  }

  return {
    status: {
      notIn: [DemandStatus.REJECTED, DemandStatus.ARCHIVED],
    },
  };
}

async function findDemandFromParams(params: unknown) {
  const parsed = z.object({ id: z.string().uuid() }).parse(params);

  return prisma.demand.findUnique({
    where: {
      id: parsed.id,
    },
  });
}

function publishDemandEvent(type: "DEMAND_CREATED" | "DEMAND_UPDATED", demand: {
  id: string;
  title: string;
  project: string;
  origin?: string;
  priority?: string;
  status: string;
}) {
  publishStudioEvent(type, {
    demandId: demand.id,
    title: demand.title,
    project: demand.project,
    origin: demand.origin,
    priority: demand.priority,
    status: demand.status,
  });
}

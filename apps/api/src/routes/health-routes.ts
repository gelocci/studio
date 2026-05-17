import type { FastifyInstance } from "fastify";
import { prisma } from "../db/prisma.js";

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "ok", service: "gelocci-studio-api", timestamp: new Date().toISOString() };
  });
}

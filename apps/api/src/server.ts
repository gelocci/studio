import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import Fastify from "fastify";
import { env } from "./env.js";
import { backlogRoutes } from "./routes/backlog-routes.js";
import { demandRoutes } from "./routes/demand-routes.js";
import { eventRoutes } from "./routes/event-routes.js";
import { healthRoutes } from "./routes/health-routes.js";
import { workflowRunRoutes } from "./routes/workflow-run-routes.js";

async function buildServer() {
  const app = Fastify({ logger: { level: "info" } });

  await app.register(cors, {
    origin: [env.WEB_ORIGIN],
    credentials: true,
  });

  await app.register(sensible);
  await app.register(healthRoutes);
  await app.register(eventRoutes);
  await app.register(demandRoutes, { prefix: "/demands" });
  await app.register(backlogRoutes, { prefix: "/backlog-items" });
  await app.register(workflowRunRoutes, { prefix: "/workflow-runs" });

  return app;
}

const app = await buildServer();

try {
  await app.listen({ host: env.API_HOST, port: env.API_PORT });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}

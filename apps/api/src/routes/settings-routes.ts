import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getAutoFlowSettings, updateAutoFlowSettings } from "../services/autoflow-service.js";

const updateAutoFlowSchema = z.object({
  autoFlowMode: z.enum(["OFF", "ASSISTED", "CONTROLLED", "FULL"]),
});

export async function settingsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/autoflow", async () => {
    return getAutoFlowSettings();
  });

  app.put("/autoflow", async (request) => {
    const body = updateAutoFlowSchema.parse(request.body);

    return updateAutoFlowSettings(body.autoFlowMode);
  });
}

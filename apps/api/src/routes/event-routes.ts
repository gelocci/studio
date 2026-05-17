import type { FastifyInstance } from "fastify";
import { createHeartbeatEvent, subscribeStudioEvents } from "../events/studio-events.js";

export async function eventRoutes(app: FastifyInstance): Promise<void> {
  app.get("/events/stream", async (request, reply) => {
    reply.hijack();

    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    });

    const send = (event: unknown): void => {
      reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    send({
      id: crypto.randomUUID(),
      type: "CONNECTED",
      timestamp: new Date().toISOString(),
      payload: {
        message: "Cliente conectado ao stream de eventos do Gelocci Studio.",
      },
    });

    const unsubscribe = subscribeStudioEvents(send);

    const heartbeat = setInterval(() => {
      send(createHeartbeatEvent());
    }, 15000);

    request.raw.on("close", () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  });
}
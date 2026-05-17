import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  WORKFLOW_QUEUE_NAME: z.string().default("studio-workflow"),
});

export const env = envSchema.parse(process.env);

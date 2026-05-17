import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  API_HOST: z.string().default("0.0.0.0"),
  API_PORT: z.coerce.number().int().positive().default(3333),
  WEB_ORIGIN: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);

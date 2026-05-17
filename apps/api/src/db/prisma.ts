import { PrismaClient } from "@prisma/client";

declare global {
  var __studioPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__studioPrisma ??
  new PrismaClient({ log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") {
  globalThis.__studioPrisma = prisma;
}

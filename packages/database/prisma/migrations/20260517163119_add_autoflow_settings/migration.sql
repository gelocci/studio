-- CreateEnum
CREATE TYPE "AutoFlowMode" AS ENUM ('OFF', 'ASSISTED', 'CONTROLLED', 'FULL');

-- CreateTable
CREATE TABLE "studio_settings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "autoFlowMode" "AutoFlowMode" NOT NULL DEFAULT 'OFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_settings_pkey" PRIMARY KEY ("id")
);

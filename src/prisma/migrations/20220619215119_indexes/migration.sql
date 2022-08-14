/*
  Warnings:

  - A unique constraint covering the columns `[guildId]` on the table `guilds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guildConfigurationId]` on the table `guilds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guildLoggingId]` on the table `guilds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[automodId]` on the table `guilds` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "banpoolSubscribers" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "banpools" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "blacklists" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "experiments" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "guildConfigurations" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "guildLoggings" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "guildModerationRoles" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "guildOverrideCommands" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "guilds" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "infractions" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "messageLogs" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "reminds" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "tempbans" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "guildModerationRoles_guildId_idx" ON "guildModerationRoles"("guildId");

-- CreateIndex
CREATE INDEX "guildOverrideCommands_guildId_idx" ON "guildOverrideCommands"("guildId");

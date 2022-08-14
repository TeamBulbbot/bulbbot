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
CREATE INDEX "banpoolSubscribers_guildId_idx" ON "banpoolSubscribers"("guildId");

-- CreateIndex
CREATE INDEX "banpoolSubscribers_banpoolId_idx" ON "banpoolSubscribers"("banpoolId");

-- CreateIndex
CREATE INDEX "banpools_guildId_idx" ON "banpools"("guildId");

-- CreateIndex
CREATE INDEX "blacklists_snowflakeId_idx" ON "blacklists"("snowflakeId");

-- CreateIndex
CREATE INDEX "blacklists_developerId_idx" ON "blacklists"("developerId");

-- CreateIndex
CREATE INDEX "experiments_guildId_idx" ON "experiments"("guildId");

-- CreateIndex
CREATE INDEX "experiments_name_idx" ON "experiments"("name");

-- CreateIndex
CREATE INDEX "guildModerationRoles_guildId_idx" ON "guildModerationRoles"("guildId");

-- CreateIndex
CREATE INDEX "guildOverrideCommands_guildId_idx" ON "guildOverrideCommands"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "guilds_guildId_key" ON "guilds"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "guilds_guildConfigurationId_key" ON "guilds"("guildConfigurationId");

-- CreateIndex
CREATE UNIQUE INDEX "guilds_guildLoggingId_key" ON "guilds"("guildLoggingId");

-- CreateIndex
CREATE UNIQUE INDEX "guilds_automodId_key" ON "guilds"("automodId");

-- CreateIndex
CREATE INDEX "infractions_targetId_idx" ON "infractions"("targetId");

-- CreateIndex
CREATE INDEX "infractions_moderatorId_idx" ON "infractions"("moderatorId");

-- CreateIndex
CREATE INDEX "infractions_guildId_idx" ON "infractions"("guildId");

-- CreateIndex
CREATE INDEX "messageLogs_guildId_idx" ON "messageLogs"("guildId");

-- CreateIndex
CREATE INDEX "messageLogs_authorId_idx" ON "messageLogs"("authorId");

-- CreateIndex
CREATE INDEX "messageLogs_messageId_idx" ON "messageLogs"("messageId");

-- CreateIndex
CREATE INDEX "messageLogs_channelId_idx" ON "messageLogs"("channelId");

-- CreateIndex
CREATE INDEX "reminds_userId_idx" ON "reminds"("userId");

-- CreateIndex
CREATE INDEX "reminds_channelId_idx" ON "reminds"("channelId");

-- CreateIndex
CREATE INDEX "reminds_messageId_idx" ON "reminds"("messageId");

-- CreateIndex
CREATE INDEX "tempbans_targetId_idx" ON "tempbans"("targetId");

-- CreateIndex
CREATE INDEX "tempbans_gId_idx" ON "tempbans"("gId");

-- CreateIndex
CREATE INDEX "tempbans_guildId_idx" ON "tempbans"("guildId");

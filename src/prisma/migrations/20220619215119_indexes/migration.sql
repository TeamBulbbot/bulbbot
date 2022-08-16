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

-- Drop Old Contraints
ALTER TABLE "automods" ALTER COLUMN "websiteWhitelist" DROP DEFAULT;
ALTER TABLE "automods" ALTER COLUMN "inviteWhitelist" DROP DEFAULT;
ALTER TABLE "automods" ALTER COLUMN "wordBlacklist" DROP DEFAULT;
ALTER TABLE "automods" ALTER COLUMN "wordBlacklistToken" DROP DEFAULT;
ALTER TABLE "automods" ALTER COLUMN "ignoreChannels" DROP DEFAULT;
ALTER TABLE "automods" ALTER COLUMN "ignoreRoles" DROP DEFAULT;
ALTER TABLE "automods" ALTER COLUMN "ignoreUsers" DROP DEFAULT;
ALTER TABLE "automods" ALTER COLUMN "avatarHashes" DROP DEFAULT;
ALTER TABLE "guildConfigurations" ALTER COLUMN "quickReasons" DROP DEFAULT;
ALTER TABLE "banpoolSubscribers" DROP CONSTRAINT IF EXISTS "banpoolSubscribers_banpoolId_fkey";
ALTER TABLE "banpools" DROP CONSTRAINT IF EXISTS "banpools_guildId_fkey";
ALTER TABLE "experiments" DROP CONSTRAINT IF EXISTS "experiments_guildId_fkey";
ALTER TABLE "guildModerationRoles" DROP CONSTRAINT IF EXISTS "guildModerationRoles_guildId_fkey";
ALTER TABLE "guildOverrideCommands" DROP CONSTRAINT IF EXISTS "guildOverrideCommands_guildId_fkey";
ALTER TABLE "guilds" DROP CONSTRAINT IF EXISTS "guilds_automodId_fkey";
ALTER TABLE "guilds" DROP CONSTRAINT IF EXISTS "guilds_guildConfigurationId_fkey";
ALTER TABLE "guilds" DROP CONSTRAINT IF EXISTS "guilds_guildLoggingId_fkey";
ALTER TABLE "infractions" DROP CONSTRAINT IF EXISTS "infractions_guildId_fkey";
ALTER TABLE "messageLogs" DROP CONSTRAINT IF EXISTS "messageLogs_guildId_fkey";
ALTER TABLE "starboardPosts" DROP CONSTRAINT IF EXISTS "starboardPosts_starboardId_fkey";
ALTER TABLE "tempbans" DROP CONSTRAINT IF EXISTS "tempbans_guildId_fkey";
ALTER TABLE "tempmutes" DROP CONSTRAINT IF EXISTS "tempmutes_guildId_fkey";

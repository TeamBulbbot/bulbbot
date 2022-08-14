-- CreateEnum
CREATE TYPE "AutomodPunishmentType" AS ENUM ('LOG', 'WARN', 'KICK', 'BAN');

-- CreateTable
CREATE TABLE "automods" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "websiteWhitelist" VARCHAR(255)[],
    "punishmentWebsite" "AutomodPunishmentType",
    "inviteWhitelist" VARCHAR(255)[],
    "punishmentInvites" "AutomodPunishmentType",
    "wordBlacklist" VARCHAR(255)[],
    "wordBlacklistToken" VARCHAR(255)[],
    "punishmentWords" "AutomodPunishmentType",
    "limitMentions" INTEGER DEFAULT 0,
    "punishmentMentions" "AutomodPunishmentType",
    "timeoutMentions" INTEGER DEFAULT 15000,
    "limitMessages" INTEGER DEFAULT 0,
    "punishmentMessages" "AutomodPunishmentType",
    "timeoutMessages" INTEGER DEFAULT 10000,
    "avatarHashes" VARCHAR(255)[],
    "punishmentAvatarBans" "AutomodPunishmentType",
    "ignoreChannels" VARCHAR(255)[],
    "ignoreRoles" VARCHAR(255)[],
    "ignoreUsers" VARCHAR(255)[],

    CONSTRAINT "automods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banpoolSubscribers" (
    "id" SERIAL NOT NULL,
    "guildId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "banpoolId" INTEGER NOT NULL,

    CONSTRAINT "banpoolSubscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banpools" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER NOT NULL,

    CONSTRAINT "banpools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blacklists" (
    "id" SERIAL NOT NULL,
    "isGuild" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(255) NOT NULL,
    "snowflakeId" VARCHAR(255) NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "developerId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "blacklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiments" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER NOT NULL,

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guildConfigurations" (
    "id" SERIAL NOT NULL,
    "prefix" VARCHAR(255) NOT NULL DEFAULT E'!',
    "language" VARCHAR(255) NOT NULL DEFAULT E'en-US',
    "timezone" VARCHAR(255) NOT NULL DEFAULT E'UTC',
    "premiumGuild" BOOLEAN NOT NULL DEFAULT false,
    "autorole" VARCHAR(255),
    "muteRole" VARCHAR(255),
    "actionsOnInfo" BOOLEAN NOT NULL DEFAULT false,
    "rolesOnLeave" BOOLEAN NOT NULL DEFAULT false,
    "quickReasons" VARCHAR(255)[],
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "manualNicknameInf" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "guildConfigurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guildLoggings" (
    "id" SERIAL NOT NULL,
    "modAction" VARCHAR(255),
    "banpool" VARCHAR(255),
    "automod" VARCHAR(255),
    "message" VARCHAR(255),
    "role" VARCHAR(255),
    "member" VARCHAR(255),
    "channel" VARCHAR(255),
    "thread" VARCHAR(255),
    "invite" VARCHAR(255),
    "joinLeave" VARCHAR(255),
    "other" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "guildLoggings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guildModerationRoles" (
    "id" SERIAL NOT NULL,
    "roleId" VARCHAR(255) NOT NULL,
    "clearanceLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER NOT NULL,

    CONSTRAINT "guildModerationRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guildOverrideCommands" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "commandName" VARCHAR(255) NOT NULL,
    "clearanceLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER NOT NULL,

    CONSTRAINT "guildOverrideCommands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guilds" (
    "id" SERIAL NOT NULL,
    "guildId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildConfigurationId" INTEGER NOT NULL,
    "guildLoggingId" INTEGER NOT NULL,
    "automodId" INTEGER NOT NULL,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infractions" (
    "id" SERIAL NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "timeout" VARCHAR(255),
    "reason" VARCHAR(10000) NOT NULL,
    "target" VARCHAR(255) NOT NULL,
    "targetId" VARCHAR(255) NOT NULL,
    "moderator" VARCHAR(255) NOT NULL,
    "moderatorId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER NOT NULL,

    CONSTRAINT "infractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messageLogs" (
    "messageId" VARCHAR(19) NOT NULL,
    "channelId" VARCHAR(19) NOT NULL,
    "authorId" VARCHAR(19) NOT NULL,
    "authorTag" VARCHAR(50) NOT NULL,
    "content" VARCHAR(4000),
    "embed" JSON,
    "sticker" JSON,
    "attachments" VARCHAR(800)[],
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER NOT NULL,

    CONSTRAINT "messageLogs_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "reminds" (
    "id" SERIAL NOT NULL,
    "reason" VARCHAR(1500) NOT NULL,
    "expireTime" BIGINT NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "channelId" VARCHAR(255),
    "messageId" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reminds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tempbans" (
    "id" SERIAL NOT NULL,
    "targetTag" VARCHAR(255) NOT NULL,
    "targetId" VARCHAR(255) NOT NULL,
    "gId" VARCHAR(255) NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "expireTime" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER NOT NULL,

    CONSTRAINT "tempbans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "banpoolSubscribers_guildId_idx" ON "banpoolSubscribers"("guildId");

-- CreateIndex
CREATE INDEX "banpoolSubscribers_banpoolId_idx" ON "banpoolSubscribers"("banpoolId");

-- CreateIndex
CREATE UNIQUE INDEX "banpoolSubscribers_guildId_banpoolId_key" ON "banpoolSubscribers"("guildId", "banpoolId");

-- CreateIndex
CREATE INDEX "banpools_guildId_idx" ON "banpools"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "banpools_name_key" ON "banpools"("name");

-- CreateIndex
CREATE INDEX "blacklists_snowflakeId_idx" ON "blacklists"("snowflakeId");

-- CreateIndex
CREATE INDEX "blacklists_developerId_idx" ON "blacklists"("developerId");

-- CreateIndex
CREATE INDEX "experiments_guildId_idx" ON "experiments"("guildId");

-- CreateIndex
CREATE INDEX "experiments_name_idx" ON "experiments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "experiments_guildId_name_key" ON "experiments"("guildId", "name");

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
CREATE INDEX "infractions_id_guildId_idx" ON "infractions"("id", "guildId");

-- CreateIndex
CREATE INDEX "messageLogs_guildId_idx" ON "messageLogs"("guildId");

-- CreateIndex
CREATE INDEX "messageLogs_authorId_idx" ON "messageLogs"("authorId");

-- CreateIndex
CREATE INDEX "messageLogs_channelId_idx" ON "messageLogs"("channelId");

-- CreateIndex
CREATE INDEX "messageLogs_messageId_idx" ON "messageLogs"("messageId");

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

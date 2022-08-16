-- CreateTable
CREATE TABLE "automods" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN DEFAULT false,
    "websiteWhitelist" VARCHAR(255)[],
    "punishmentWebsite" VARCHAR(255),
    "inviteWhitelist" VARCHAR(255)[],
    "punishmentInvites" VARCHAR(255),
    "wordBlacklist" VARCHAR(255)[],
    "punishmentWords" VARCHAR(255),
    "limitMentions" INTEGER DEFAULT 0,
    "punishmentMentions" VARCHAR(255),
    "limitMessages" INTEGER DEFAULT 0,
    "punishmentMessages" VARCHAR(255),
    "wordBlacklistToken" VARCHAR(255)[],
    "timeoutMentions" INTEGER DEFAULT 15000,
    "timeoutMessages" INTEGER DEFAULT 10000,
    "ignoreChannels" VARCHAR(255)[],
    "ignoreRoles" VARCHAR(255)[],
    "ignoreUsers" VARCHAR(255)[],
    "avatarHashes" VARCHAR(255)[],
    "punishmentAvatarBans" VARCHAR(255),

    CONSTRAINT "automods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banpoolSubscribers" (
    "id" SERIAL NOT NULL,
    "guildId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "banpoolId" INTEGER,

    CONSTRAINT "banpoolSubscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banpools" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER,

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
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "blacklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiments" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER,

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guildConfigurations" (
    "id" SERIAL NOT NULL,
    "prefix" VARCHAR(255) NOT NULL DEFAULT E'!',
    "language" VARCHAR(255) NOT NULL DEFAULT E'en-US',
    "premiumGuild" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "autorole" VARCHAR(255),
    "timezone" VARCHAR(255) NOT NULL DEFAULT E'UTC',
    "actionsOnInfo" BOOLEAN DEFAULT false,
    "rolesOnLeave" BOOLEAN DEFAULT false,
    "quickReasons" VARCHAR(255)[],
    "manualNicknameInf" BOOLEAN DEFAULT false,

    CONSTRAINT "guildConfigurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guildLoggings" (
    "id" SERIAL NOT NULL,
    "modAction" VARCHAR(255),
    "automod" VARCHAR(255),
    "message" VARCHAR(255),
    "role" VARCHAR(255),
    "member" VARCHAR(255),
    "channel" VARCHAR(255),
    "joinLeave" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "thread" VARCHAR(255),
    "invite" VARCHAR(255),
    "other" VARCHAR(255),
    "banpool" VARCHAR(255),

    CONSTRAINT "guildLoggings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guilds" (
    "id" SERIAL NOT NULL,
    "guildId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildConfigurationId" INTEGER,
    "guildLoggingId" INTEGER,
    "automodId" INTEGER,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infractions" (
    "id" SERIAL NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "active" VARCHAR(255) NOT NULL,
    "reason" VARCHAR(10000) NOT NULL,
    "target" VARCHAR(255) NOT NULL,
    "targetId" VARCHAR(255) NOT NULL,
    "moderator" VARCHAR(255) NOT NULL,
    "moderatorId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER,

    CONSTRAINT "infractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messageLogs" (
    "messageId" VARCHAR(18) NOT NULL,
    "channelId" VARCHAR(18) NOT NULL,
    "authorId" VARCHAR(18) NOT NULL,
    "authorTag" VARCHAR(50) NOT NULL,
    "content" VARCHAR(4000),
    "embed" JSON,
    "sticker" JSON,
    "attachments" VARCHAR(800)[],
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER,

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
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reminds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tempbans" (
    "id" SERIAL NOT NULL,
    "targetTag" VARCHAR(255) NOT NULL,
    "targetId" VARCHAR(255) NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "expireTime" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER,
    "gId" VARCHAR(255) NOT NULL,

    CONSTRAINT "tempbans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guildModerationRoles" (
    "id" SERIAL NOT NULL,
    "roleId" VARCHAR(255) NOT NULL,
    "clearanceLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER,

    CONSTRAINT "guildModerationRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guildOverrideCommands" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "commandName" VARCHAR(255) NOT NULL,
    "clearanceLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER,

    CONSTRAINT "guildOverrideCommands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "starboardPosts" (
    "id" SERIAL NOT NULL,
    "ogMessageId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "starboardId" INTEGER,

    CONSTRAINT "starboardPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "starboards" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "channelId" VARCHAR(255),
    "emoji" VARCHAR(255) NOT NULL DEFAULT E'2b50',
    "minimumCount" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "starboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tempmutes" (
    "id" SERIAL NOT NULL,
    "targetTag" VARCHAR(255) NOT NULL,
    "targetId" VARCHAR(255) NOT NULL,
    "gId" VARCHAR(255) NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "expireTime" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "guildId" INTEGER,

    CONSTRAINT "tempmutes_pkey" PRIMARY KEY ("id")
);

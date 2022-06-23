-- AlterTable
ALTER TABLE "banpoolSubscribers" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "banpools" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "blacklists" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "experiments" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "guildConfigurations" ADD COLUMN     "manualNicknameInf" BOOLEAN DEFAULT false,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "guildLoggings" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "guildModerationRoles" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "guildOverrideCommands" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "guilds" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "infractions" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "messageLogs" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "reminds" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tempbans" ALTER COLUMN "createdAt" DROP DEFAULT;

/*
  Warnings:

  - Made the column `banpoolId` on table `banpoolSubscribers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guildId` on table `infractions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guildId` on table `messageLogs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guildId` on table `tempbans` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
DELETE FROM "banpoolSubscribers" WHERE "banpoolId" IS NULL;
ALTER TABLE "banpoolSubscribers" ALTER COLUMN "banpoolId" SET NOT NULL;

-- AlterTable
DELETE FROM "infractions" WHERE "guildId" IS NULL;
ALTER TABLE "infractions" ALTER COLUMN "guildId" SET NOT NULL;

-- AlterTable
DELETE FROM "messageLogs" WHERE "guildId" IS NULL;
ALTER TABLE "messageLogs" ALTER COLUMN "guildId" SET NOT NULL;

-- AlterTable
DELETE FROM "tempbans" WHERE "guildId" IS NULL;
ALTER TABLE "tempbans" ALTER COLUMN "guildId" SET NOT NULL;

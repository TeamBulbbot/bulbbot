/*
  Warnings:

  - Made the column `guildConfigurationId` on table `guilds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guildLoggingId` on table `guilds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `automodId` on table `guilds` required. This step will fail if there are existing NULL values in that column.

*/
-- Has null ID for all three configs
DELETE FROM "guilds" WHERE "guildConfigurationId" IS NULL OR "guildLoggingId" IS NULL OR "automodId" IS NULL;
-- AlterTable
ALTER TABLE "guilds" ALTER COLUMN "guildConfigurationId" SET NOT NULL,
ALTER COLUMN "guildLoggingId" SET NOT NULL,
ALTER COLUMN "automodId" SET NOT NULL;

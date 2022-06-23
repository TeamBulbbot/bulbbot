/*
  Warnings:

  - Made the column `guildConfigurationId` on table `guilds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guildLoggingId` on table `guilds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `automodId` on table `guilds` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "guilds" ALTER COLUMN "guildConfigurationId" SET NOT NULL,
ALTER COLUMN "guildLoggingId" SET NOT NULL,
ALTER COLUMN "automodId" SET NOT NULL;

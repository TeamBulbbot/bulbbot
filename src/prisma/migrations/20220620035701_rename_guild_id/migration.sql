/*
  Warnings:

  - Made the column `guildId` on table `banpools` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guildId` on table `experiments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "banpools" ALTER COLUMN "guildId" SET NOT NULL;

-- AlterTable
ALTER TABLE "experiments" ALTER COLUMN "guildId" SET NOT NULL;

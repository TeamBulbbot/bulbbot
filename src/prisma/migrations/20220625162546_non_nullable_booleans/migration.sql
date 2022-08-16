/*
  Warnings:

  - Made the column `enabled` on table `automods` required. This step will fail if there are existing NULL values in that column.
  - Made the column `actionsOnInfo` on table `guildConfigurations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rolesOnLeave` on table `guildConfigurations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `manualNicknameInf` on table `guildConfigurations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "automods" ALTER COLUMN "enabled" SET NOT NULL;

-- AlterTable
ALTER TABLE "guildConfigurations" ALTER COLUMN "actionsOnInfo" SET NOT NULL,
ALTER COLUMN "rolesOnLeave" SET NOT NULL,
ALTER COLUMN "manualNicknameInf" SET NOT NULL;

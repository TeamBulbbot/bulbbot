/*
  Warnings:

  - You are about to drop the column `muteRole` on the `guildConfigurations` table. All the data in the column will be lost.
  - You are about to drop the column `prefix` on the `guildConfigurations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guildConfigurations" DROP COLUMN "muteRole",
DROP COLUMN "prefix";

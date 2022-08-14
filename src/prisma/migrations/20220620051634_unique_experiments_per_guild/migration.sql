/*
  Warnings:

  - A unique constraint covering the columns `[guildId,name]` on the table `experiments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "experiments_guildId_name_key" ON "experiments"("guildId", "name");

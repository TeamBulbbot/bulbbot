/*
  Warnings:

  - A unique constraint covering the columns `[guildId,banpoolId]` on the table `banpoolSubscribers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "banpoolSubscribers_guildId_banpoolId_key" ON "banpoolSubscribers"("guildId", "banpoolId");

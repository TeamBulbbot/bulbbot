/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `banpools` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "banpools_name_key" ON "banpools"("name");

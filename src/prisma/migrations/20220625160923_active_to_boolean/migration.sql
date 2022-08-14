/*
  Warnings:

  - Changed the type of `active` on the `infractions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "infractions" ADD COLUMN "timeout" VarChar(255);
UPDATE "infractions" SET "timeout" = "active";
ALTER TABLE "infractions" DROP COLUMN "active";
ALTER TABLE "infractions"  ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT false;
UPDATE "infractions" SET "active" = true WHERE "timeout" <> 'false';
UPDATE "infractions" SET "active" = false WHERE "timeout" = 'false';
UPDATE "infractions" SET "timeout" = NULL WHERE "timeout" = 'false' OR "timeout" = 'true';

-- CreateIndex
CREATE INDEX "infractions_id_guildId_idx" ON "infractions"("id", "guildId");

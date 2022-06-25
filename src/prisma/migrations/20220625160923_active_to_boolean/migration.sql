/*
  Warnings:

  - Changed the type of `active` on the `infractions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "infractions" ADD COLUMN "active_tmp" VarChar(255);
UPDATE "infractions" SET "active_tmp" = "active";
ALTER TABLE "infractions" DROP COLUMN "active",
ADD COLUMN     "active" BOOLEAN NOT NULL;
UPDATE "infractions" SET "active" = true WHERE "active_tmp" = 'true';
UPDATE "infractions" SET "active" = false WHERE "active_tmp" = 'false';
ALTER TABLE "infractions" DROP COLUMN "active_tmp";

-- CreateIndex
CREATE INDEX "infractions_id_guildId_idx" ON "infractions"("id", "guildId");

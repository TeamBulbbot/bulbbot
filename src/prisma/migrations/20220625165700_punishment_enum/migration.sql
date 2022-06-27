/*
  Warnings:

  - The `punishmentWebsite` column on the `automods` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `punishmentInvites` column on the `automods` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `punishmentWords` column on the `automods` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `punishmentMentions` column on the `automods` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `punishmentMessages` column on the `automods` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `punishmentAvatarBans` column on the `automods` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AutomodPunishmentType" AS ENUM ('LOG', 'WARN', 'KICK', 'BAN');

-- DuplicateData
ALTER TABLE "automods" ADD COLUMN "punishmentWebsiteTmp" varchar(255) NULL;
ALTER TABLE "automods" ADD COLUMN "punishmentInvitesTmp" varchar(255) NULL;
ALTER TABLE "automods" ADD COLUMN "punishmentWordsTmp" varchar(255) NULL;
ALTER TABLE "automods" ADD COLUMN "punishmentMentionsTmp" varchar(255) NULL;
ALTER TABLE "automods" ADD COLUMN "punishmentMessagesTmp" varchar(255) NULL;
ALTER TABLE "automods" ADD COLUMN "punishmentAvatarBansTmp" varchar(255) NULL;
UPDATE "automods" SET
  "punishmentWebsiteTmp" = "punishmentWebsite",
  "punishmentInvitesTmp" = "punishmentInvites",
  "punishmentWordsTmp" = "punishmentWords",
  "punishmentMentionsTmp" = "punishmentMentions",
  "punishmentMessagesTmp" = "punishmentMessages",
  "punishmentAvatarBansTmp" = "punishmentAvatarBans";

-- AlterTable
ALTER TABLE "automods" DROP COLUMN "punishmentWebsite";
ALTER TABLE "automods" ADD COLUMN     "punishmentWebsite" "AutomodPunishmentType";
ALTER TABLE "automods" DROP COLUMN "punishmentInvites";
ALTER TABLE "automods" ADD COLUMN     "punishmentInvites" "AutomodPunishmentType";
ALTER TABLE "automods" DROP COLUMN "punishmentWords";
ALTER TABLE "automods" ADD COLUMN     "punishmentWords" "AutomodPunishmentType";
ALTER TABLE "automods" DROP COLUMN "punishmentMentions";
ALTER TABLE "automods" ADD COLUMN     "punishmentMentions" "AutomodPunishmentType";
ALTER TABLE "automods" DROP COLUMN "punishmentMessages";
ALTER TABLE "automods" ADD COLUMN     "punishmentMessages" "AutomodPunishmentType";
ALTER TABLE "automods" DROP COLUMN "punishmentAvatarBans";
ALTER TABLE "automods" ADD COLUMN     "punishmentAvatarBans" "AutomodPunishmentType";

-- RestoreData
-- Website
UPDATE "automods" SET "punishmentWebsite" = 'LOG' WHERE "punishmentWebsiteTmp" = 'LOG';
UPDATE "automods" SET "punishmentWebsite" = 'WARN' WHERE "punishmentWebsiteTmp" = 'WARN';
UPDATE "automods" SET "punishmentWebsite" = 'KICK' WHERE "punishmentWebsiteTmp" = 'KICK';
UPDATE "automods" SET "punishmentWebsite" = 'BAN' WHERE "punishmentWebsiteTmp" = 'BAN';
-- Invites
UPDATE "automods" SET "punishmentInvites" = 'LOG' WHERE "punishmentInvitesTmp" = 'LOG';
UPDATE "automods" SET "punishmentInvites" = 'WARN' WHERE "punishmentInvitesTmp" = 'WARN';
UPDATE "automods" SET "punishmentInvites" = 'KICK' WHERE "punishmentInvitesTmp" = 'KICK';
UPDATE "automods" SET "punishmentInvites" = 'BAN' WHERE "punishmentInvitesTmp" = 'BAN';
-- Words
UPDATE "automods" SET "punishmentWords" = 'LOG' WHERE "punishmentWordsTmp" = 'LOG';
UPDATE "automods" SET "punishmentWords" = 'WARN' WHERE "punishmentWordsTmp" = 'WARN';
UPDATE "automods" SET "punishmentWords" = 'KICK' WHERE "punishmentWordsTmp" = 'KICK';
UPDATE "automods" SET "punishmentWords" = 'BAN' WHERE "punishmentWordsTmp" = 'BAN';
-- Mentions
UPDATE "automods" SET "punishmentMentions" = 'LOG' WHERE "punishmentMentionsTmp" = 'LOG';
UPDATE "automods" SET "punishmentMentions" = 'WARN' WHERE "punishmentMentionsTmp" = 'WARN';
UPDATE "automods" SET "punishmentMentions" = 'KICK' WHERE "punishmentMentionsTmp" = 'KICK';
UPDATE "automods" SET "punishmentMentions" = 'BAN' WHERE "punishmentMentionsTmp" = 'BAN';
-- Messages
UPDATE "automods" SET "punishmentMessages" = 'LOG' WHERE "punishmentMessagesTmp" = 'LOG';
UPDATE "automods" SET "punishmentMessages" = 'WARN' WHERE "punishmentMessagesTmp" = 'WARN';
UPDATE "automods" SET "punishmentMessages" = 'KICK' WHERE "punishmentMessagesTmp" = 'KICK';
UPDATE "automods" SET "punishmentMessages" = 'BAN' WHERE "punishmentMessagesTmp" = 'BAN';
-- Avatar Bans
UPDATE "automods" SET "punishmentAvatarBans" = 'LOG' WHERE "punishmentAvatarBansTmp" = 'LOG';
UPDATE "automods" SET "punishmentAvatarBans" = 'WARN' WHERE "punishmentAvatarBansTmp" = 'WARN';
UPDATE "automods" SET "punishmentAvatarBans" = 'KICK' WHERE "punishmentAvatarBansTmp" = 'KICK';
UPDATE "automods" SET "punishmentAvatarBans" = 'BAN' WHERE "punishmentAvatarBansTmp" = 'BAN';

-- Fallback strategy for unknown values
UPDATE "automods"
SET "punishmentWebsite" = 'LOG'
WHERE "punishmentWebsiteTmp" IS NOT NULL AND "punishmentWebsite" IS NULL;
UPDATE "automods"
SET "punishmentInvites" = 'LOG'
WHERE "punishmentInvitesTmp" IS NOT NULL AND "punishmentInvites" IS NULL;
UPDATE "automods"
SET "punishmentWords" = 'LOG'
WHERE "punishmentWordsTmp" IS NOT NULL AND "punishmentWords" IS NULL;
UPDATE "automods"
SET "punishmentMentions" = 'LOG'
WHERE "punishmentMentionsTmp" IS NOT NULL AND "punishmentMentions" IS NULL;
UPDATE "automods"
SET "punishmentMessages" = 'LOG'
WHERE "punishmentMessagesTmp" IS NOT NULL AND "punishmentMessages" IS NULL;
UPDATE "automods"
SET "punishmentAvatarBans" = 'LOG'
WHERE "punishmentAvatarBansTmp" IS NOT NULL AND "punishmentAvatarBans" IS NULL;

-- DropDuplicates
ALTER TABLE "automods" DROP COLUMN "punishmentWebsiteTmp";
ALTER TABLE "automods" DROP COLUMN "punishmentInvitesTmp";
ALTER TABLE "automods" DROP COLUMN "punishmentWordsTmp";
ALTER TABLE "automods" DROP COLUMN "punishmentMentionsTmp";
ALTER TABLE "automods" DROP COLUMN "punishmentMessagesTmp";
ALTER TABLE "automods" DROP COLUMN "punishmentAvatarBansTmp";

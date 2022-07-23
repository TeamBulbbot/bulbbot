/*
  Warnings:

  - The primary key for the `messageLogs` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "messageLogs" DROP CONSTRAINT "messageLogs_pkey",
ALTER COLUMN "messageId" SET DATA TYPE VARCHAR(19),
ALTER COLUMN "channelId" SET DATA TYPE VARCHAR(19),
ALTER COLUMN "authorId" SET DATA TYPE VARCHAR(19),
ADD CONSTRAINT "messageLogs_pkey" PRIMARY KEY ("messageId");

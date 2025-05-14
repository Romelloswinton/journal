/*
  Warnings:

  - You are about to drop the `RosebudMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RosebudMessage" DROP CONSTRAINT "RosebudMessage_conversationId_fkey";

-- AlterTable
ALTER TABLE "RosebudConversation" ADD COLUMN     "messages" TEXT;

-- DropTable
DROP TABLE "RosebudMessage";

-- CreateIndex
CREATE INDEX "RosebudConversation_updatedAt_idx" ON "RosebudConversation"("updatedAt");

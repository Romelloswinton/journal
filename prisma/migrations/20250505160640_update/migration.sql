/*
  Warnings:

  - You are about to drop the column `content` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `journalEntryId` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Reflection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Reflection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reflection" DROP CONSTRAINT "Reflection_journalEntryId_fkey";

-- DropIndex
DROP INDEX "Reflection_journalEntryId_idx";

-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "Reflection" DROP COLUMN "content",
DROP COLUMN "journalEntryId",
DROP COLUMN "type",
ADD COLUMN     "firstEntryPositive" TEXT,
ADD COLUMN     "firstEntryPriority" TEXT,
ADD COLUMN     "firstEntryWorry" TEXT,
ADD COLUMN     "positiveReflection" TEXT,
ADD COLUMN     "priorityReflection" TEXT,
ADD COLUMN     "worryReflection" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerkId" TEXT;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_userId_key" ON "Category"("name", "userId");

-- CreateIndex
CREATE INDEX "JournalEntry_categoryId_idx" ON "JournalEntry"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Reflection_userId_key" ON "Reflection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

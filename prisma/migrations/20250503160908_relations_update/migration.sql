/*
  Warnings:

  - You are about to drop the column `isFirstEntry` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `journalEntryId` on the `Reflection` table. All the data in the column will be lost.
  - The primary key for the `TagsOnEntries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignedAt` on the `TagsOnEntries` table. All the data in the column will be lost.
  - You are about to drop the column `journalEntryId` on the `TagsOnEntries` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `JournalCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Reflection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entryId,tagId]` on the table `TagsOnEntries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entryId` to the `TagsOnEntries` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `TagsOnEntries` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reflection" DROP CONSTRAINT "Reflection_journalEntryId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnEntries" DROP CONSTRAINT "TagsOnEntries_journalEntryId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_goalId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "isFirstEntry",
DROP COLUMN "title",
ADD COLUMN     "activities" TEXT[],
ADD COLUMN     "dailyQuestion" TEXT,
ADD COLUMN     "gratitude" TEXT[],
ADD COLUMN     "moodScore" INTEGER,
ADD COLUMN     "sleepHours" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Reflection" DROP COLUMN "content",
DROP COLUMN "journalEntryId",
ADD COLUMN     "firstEntryPositive" TEXT,
ADD COLUMN     "firstEntryPriority" TEXT,
ADD COLUMN     "firstEntryWorry" TEXT,
ADD COLUMN     "positiveReflection" TEXT,
ADD COLUMN     "priorityReflection" TEXT,
ADD COLUMN     "worryReflection" TEXT;

-- AlterTable
ALTER TABLE "TagsOnEntries" DROP CONSTRAINT "TagsOnEntries_pkey",
DROP COLUMN "assignedAt",
DROP COLUMN "journalEntryId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entryId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "TagsOnEntries_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "lastName" TEXT;

-- DropTable
DROP TABLE "JournalCategory";

-- DropTable
DROP TABLE "UserProfile";

-- CreateIndex
CREATE INDEX "JournalEntry_userId_idx" ON "JournalEntry"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reflection_userId_key" ON "Reflection"("userId");

-- CreateIndex
CREATE INDEX "Reflection_userId_idx" ON "Reflection"("userId");

-- CreateIndex
CREATE INDEX "Tag_userId_idx" ON "Tag"("userId");

-- CreateIndex
CREATE INDEX "TagsOnEntries_entryId_idx" ON "TagsOnEntries"("entryId");

-- CreateIndex
CREATE INDEX "TagsOnEntries_tagId_idx" ON "TagsOnEntries"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "TagsOnEntries_entryId_tagId_key" ON "TagsOnEntries"("entryId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "TagsOnEntries" ADD CONSTRAINT "TagsOnEntries_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

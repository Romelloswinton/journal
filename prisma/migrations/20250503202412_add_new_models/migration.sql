/*
  Warnings:

  - You are about to drop the column `activities` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `dailyQuestion` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `gratitude` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `moodScore` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `sleepHours` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `firstEntryPositive` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `firstEntryPriority` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `firstEntryWorry` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `positiveReflection` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `priorityReflection` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `worryReflection` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `entryId` on the `TagsOnEntries` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[journalEntryId,tagId]` on the table `TagsOnEntries` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Reflection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `journalEntryId` to the `TagsOnEntries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnEntries" DROP CONSTRAINT "TagsOnEntries_entryId_fkey";

-- DropIndex
DROP INDEX "JournalEntry_categoryId_idx";

-- DropIndex
DROP INDEX "Reflection_userId_key";

-- DropIndex
DROP INDEX "TagsOnEntries_entryId_idx";

-- DropIndex
DROP INDEX "TagsOnEntries_entryId_tagId_key";

-- DropIndex
DROP INDEX "User_clerkId_key";

-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "activities",
DROP COLUMN "categoryId",
DROP COLUMN "dailyQuestion",
DROP COLUMN "gratitude",
DROP COLUMN "moodScore",
DROP COLUMN "sleepHours",
ADD COLUMN     "isFirstEntry" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "journalId" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reflection" DROP COLUMN "firstEntryPositive",
DROP COLUMN "firstEntryPriority",
DROP COLUMN "firstEntryWorry",
DROP COLUMN "positiveReflection",
DROP COLUMN "priorityReflection",
DROP COLUMN "worryReflection",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "journalEntryId" TEXT,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "TagsOnEntries" DROP COLUMN "entryId",
ADD COLUMN     "journalEntryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkId",
DROP COLUMN "firstName",
DROP COLUMN "imageUrl",
DROP COLUMN "lastName",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "password" TEXT;

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT,
    "ageGroup" TEXT,
    "gender" TEXT,
    "occupation" TEXT,
    "relationshipStatus" TEXT,
    "faithOrientation" TEXT,
    "struggle" TEXT,
    "journalTime" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalCategory" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "fontSize" TEXT NOT NULL DEFAULT 'medium',
    "defaultJournalId" TEXT,
    "reminderTime" TIMESTAMP(3),
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "aiReflectionsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "aiCategoriesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "trackMood" BOOLEAN NOT NULL DEFAULT true,
    "trackCategories" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "APIKey" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "keyName" TEXT NOT NULL,
    "keyValue" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfile_userId_idx" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "Journal_userId_idx" ON "Journal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "UserPreference_userId_idx" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "APIKey_service_isActive_idx" ON "APIKey"("service", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "APIKey_service_keyName_key" ON "APIKey"("service", "keyName");

-- CreateIndex
CREATE INDEX "JournalEntry_journalId_idx" ON "JournalEntry"("journalId");

-- CreateIndex
CREATE INDEX "Reflection_journalEntryId_idx" ON "Reflection"("journalEntryId");

-- CreateIndex
CREATE INDEX "TagsOnEntries_journalEntryId_idx" ON "TagsOnEntries"("journalEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "TagsOnEntries_journalEntryId_tagId_key" ON "TagsOnEntries"("journalEntryId", "tagId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "JournalCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnEntries" ADD CONSTRAINT "TagsOnEntries_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

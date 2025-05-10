/*
  Warnings:

  - You are about to drop the column `contentFormat` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `entryDate` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `isArchived` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `isStarred` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `journalId` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AIUsage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `APIKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnalyticsEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoriesOnEntries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Journal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reflection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnEntries" DROP CONSTRAINT "CategoriesOnEntries_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnEntries" DROP CONSTRAINT "CategoriesOnEntries_entryId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_userId_fkey";

-- DropForeignKey
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_journalId_fkey";

-- DropForeignKey
ALTER TABLE "Reflection" DROP CONSTRAINT "Reflection_entryId_fkey";

-- DropForeignKey
ALTER TABLE "Reflection" DROP CONSTRAINT "Reflection_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_userId_fkey";

-- DropIndex
DROP INDEX "Account_userId_idx";

-- DropIndex
DROP INDEX "JournalEntry_entryDate_idx";

-- DropIndex
DROP INDEX "JournalEntry_journalId_idx";

-- DropIndex
DROP INDEX "JournalEntry_userId_idx";

-- DropIndex
DROP INDEX "Session_userId_idx";

-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "contentFormat",
DROP COLUMN "entryDate",
DROP COLUMN "isArchived",
DROP COLUMN "isStarred",
DROP COLUMN "journalId",
ADD COLUMN     "isFirstEntry" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "mood" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "AIUsage";

-- DropTable
DROP TABLE "APIKey";

-- DropTable
DROP TABLE "AnalyticsEvent";

-- DropTable
DROP TABLE "CategoriesOnEntries";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Journal";

-- DropTable
DROP TABLE "Reflection";

-- DropTable
DROP TABLE "UserPreference";

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "JournalCategory" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "benefits" TEXT[],

    CONSTRAINT "JournalCategory_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnEntries" (
    "tagId" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagsOnEntries_pkey" PRIMARY KEY ("tagId","journalEntryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_userId_key" ON "Tag"("name", "userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "JournalCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnEntries" ADD CONSTRAINT "TagsOnEntries_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnEntries" ADD CONSTRAINT "TagsOnEntries_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "library_journals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "content" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_library_journals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_library_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_prompts" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_library_prompts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_library_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "idea_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "library_journals_category_idx" ON "library_journals"("category");

-- CreateIndex
CREATE INDEX "library_journals_isActive_idx" ON "library_journals"("isActive");

-- CreateIndex
CREATE INDEX "saved_library_journals_userId_idx" ON "saved_library_journals"("userId");

-- CreateIndex
CREATE INDEX "saved_library_journals_lastUsed_idx" ON "saved_library_journals"("lastUsed");

-- CreateIndex
CREATE UNIQUE INDEX "saved_library_journals_userId_journalId_key" ON "saved_library_journals"("userId", "journalId");

-- CreateIndex
CREATE INDEX "library_prompts_category_idx" ON "library_prompts"("category");

-- CreateIndex
CREATE INDEX "library_prompts_isActive_idx" ON "library_prompts"("isActive");

-- CreateIndex
CREATE INDEX "saved_library_prompts_userId_idx" ON "saved_library_prompts"("userId");

-- CreateIndex
CREATE INDEX "saved_library_prompts_lastUsed_idx" ON "saved_library_prompts"("lastUsed");

-- CreateIndex
CREATE UNIQUE INDEX "saved_library_prompts_userId_promptId_key" ON "saved_library_prompts"("userId", "promptId");

-- CreateIndex
CREATE INDEX "idea_submissions_userId_idx" ON "idea_submissions"("userId");

-- CreateIndex
CREATE INDEX "idea_submissions_status_idx" ON "idea_submissions"("status");

-- AddForeignKey
ALTER TABLE "saved_library_journals" ADD CONSTRAINT "saved_library_journals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_library_journals" ADD CONSTRAINT "saved_library_journals_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "library_journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_library_prompts" ADD CONSTRAINT "saved_library_prompts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_library_prompts" ADD CONSTRAINT "saved_library_prompts_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "library_prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_submissions" ADD CONSTRAINT "idea_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

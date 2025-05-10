-- CreateTable
CREATE TABLE "JournalEntries2" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "metrics" JSONB NOT NULL,
    "insights" TEXT[],
    "isAIGenerated" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalEntries2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JournalEntries2_userId_idx" ON "JournalEntries2"("userId");

-- AddForeignKey
ALTER TABLE "JournalEntries2" ADD CONSTRAINT "JournalEntries2_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

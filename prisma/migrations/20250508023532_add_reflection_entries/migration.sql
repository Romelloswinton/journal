-- CreateTable
CREATE TABLE "ReflectionEntries" (
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

    CONSTRAINT "ReflectionEntries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReflectionEntries_userId_idx" ON "ReflectionEntries"("userId");

-- AddForeignKey
ALTER TABLE "ReflectionEntries" ADD CONSTRAINT "ReflectionEntries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

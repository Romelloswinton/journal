-- AlterTable
ALTER TABLE "JournalEntries2" ADD COLUMN     "colorScheme" TEXT,
ADD COLUMN     "templateId" TEXT;

-- CreateIndex
CREATE INDEX "JournalEntries2_templateId_idx" ON "JournalEntries2"("templateId");

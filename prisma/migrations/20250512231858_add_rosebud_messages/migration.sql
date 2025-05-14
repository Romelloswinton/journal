-- CreateTable
CREATE TABLE "RosebudMessage" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RosebudMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RosebudMessage_conversationId_idx" ON "RosebudMessage"("conversationId");

-- AddForeignKey
ALTER TABLE "RosebudMessage" ADD CONSTRAINT "RosebudMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "RosebudConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

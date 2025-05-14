// app/rosebud/_components/ChatMessages.tsx
import { PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThinkingAnimation from "./ThinkingAnimation"

interface ChatMessagesProps {
  query: string
  response: string | null
  isGenerating: boolean
  onCreateJournalEntry: () => void
}

export default function ChatMessages({
  query,
  response,
  isGenerating,
  onCreateJournalEntry,
}: ChatMessagesProps) {
  if (!query && !response && !isGenerating) return null

  return (
    <div className="space-y-4">
      {query && (
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%]">
            <p className="text-sm">{query}</p>
          </div>
        </div>
      )}

      {response && (
        <div className="flex">
          <div className="bg-accent p-3 rounded-lg rounded-tl-none max-w-[80%]">
            <p className="text-sm whitespace-pre-line">{response}</p>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs mt-2 text-primary"
              onClick={onCreateJournalEntry}
            >
              <PenLine className="h-3 w-3 mr-1" />
              Add to journal
            </Button>
          </div>
        </div>
      )}

      {/* Replace the existing loading indicator with our ThinkingAnimation */}
      {isGenerating && <ThinkingAnimation />}
    </div>
  )
}

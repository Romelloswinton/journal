// app/rosebud/_components/ConversationHeader.tsx
import { format } from "date-fns"
import { ArrowLeft, PenLine, Copy, Download } from "lucide-react"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RosebudConversation } from "@/app/store/rosebudStore"

interface ConversationHeaderProps {
  conversation: RosebudConversation
  onBackToChat: () => void
  onCreateJournalEntry: () => void
  onCopyToClipboard: () => void
  onExportAsMarkdown: () => void
}

export default function ConversationHeader({
  conversation,
  onBackToChat,
  onCreateJournalEntry,
  onCopyToClipboard,
  onExportAsMarkdown,
}: ConversationHeaderProps) {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToChat}
          className="mb-1"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Chat
        </Button>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onCreateJournalEntry}
            title="Add to journal"
          >
            <PenLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onCopyToClipboard}
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onExportAsMarkdown}
            title="Export as markdown"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1.5 mt-2">
        {conversation.label && (
          <Badge
            variant="outline"
            className="mb-1 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50"
          >
            {conversation.label}
          </Badge>
        )}
        <CardTitle className="text-lg leading-tight">
          {conversation.query}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {format(new Date(conversation.createdAt), "PPP")}
        </p>
      </div>
    </CardHeader>
  )
}

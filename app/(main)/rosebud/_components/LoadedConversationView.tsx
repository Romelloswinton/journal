// app/rosebud/_components/LoadedConversationView.tsx
import { useRef } from "react"
import { motion } from "framer-motion"
import { CardContent } from "@/components/ui/card"
import {
  RosebudConversation,
  ConversationMessage,
} from "@/app/store/rosebudStore"
import ConversationHeader from "./ConversationHeader"
import ConversationMessages from "./ConversationMessages"
import ChatInput from "./ChatInput"

interface LoadedConversationViewProps {
  loadedConversation: RosebudConversation
  conversationMessages: ConversationMessage[]
  conversationInputQuery: string
  isGenerating: boolean
  shouldFocusInput: boolean
  onConversationInputChange: (value: string) => void
  onSubmit: (query: string) => void
  onBackToChat: () => void
  onCreateJournalEntry: () => void
  onCopyToClipboard: () => void
  onExportAsMarkdown: () => void
}

export default function LoadedConversationView({
  loadedConversation,
  conversationMessages,
  conversationInputQuery,
  isGenerating,
  shouldFocusInput,
  onConversationInputChange,
  onSubmit,
  onBackToChat,
  onCreateJournalEntry,
  onCopyToClipboard,
  onExportAsMarkdown,
}: LoadedConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      key="loaded-conversation"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <ConversationHeader
        conversation={loadedConversation}
        onBackToChat={onBackToChat}
        onCreateJournalEntry={onCreateJournalEntry}
        onCopyToClipboard={onCopyToClipboard}
        onExportAsMarkdown={onExportAsMarkdown}
      />

      <CardContent className="pt-0">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 mb-4">
          <ConversationMessages
            messages={conversationMessages}
            isGenerating={isGenerating}
          />
          <div ref={messagesEndRef} />
        </div>

        <div className="flex-grow">
          <ChatInput
            query={conversationInputQuery}
            onQueryChange={onConversationInputChange}
            onSubmit={onSubmit}
            isGenerating={isGenerating}
            placeholder="Continue this conversation..."
            autoFocus={shouldFocusInput}
          />
        </div>
      </CardContent>
    </motion.div>
  )
}

// app/rosebud/_components/RegularChatView.tsx
import { useRef } from "react"
import { motion } from "framer-motion"
import { CardContent } from "@/components/ui/card"
import ChatInput from "./ChatInput"
import ChatMessages from "./ChatMessages"
import WelcomeMessage from "./WelcomeMessage"

interface RegularChatViewProps {
  currentQuery: string
  currentResponse: string | null
  isGenerating: boolean
  onQueryChange: (value: string) => void
  onSubmit: (query: string) => void
  onCreateJournalEntry: () => void
}

export default function RegularChatView({
  currentQuery,
  currentResponse,
  isGenerating,
  onQueryChange,
  onSubmit,
  onCreateJournalEntry,
}: RegularChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      key="normal-chat"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <CardContent className="p-4 h-[600px] flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4 pr-2">
          <div className="space-y-4">
            {/* Welcome message with pattern & emotion questions */}
            {!currentQuery && !currentResponse && <WelcomeMessage />}

            {/* Conversation messages */}
            <ChatMessages
              query={currentQuery}
              response={currentResponse}
              isGenerating={isGenerating}
              onCreateJournalEntry={onCreateJournalEntry}
            />

            {/* Reference div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <ChatInput
          query={currentQuery}
          onQueryChange={onQueryChange}
          onSubmit={onSubmit}
          isGenerating={isGenerating}
          autoFocus={false}
        />
      </CardContent>
    </motion.div>
  )
}

// app/rosebud/_components/ConversationMessages.tsx
import { User, Bot } from "lucide-react"
import { ConversationMessage } from "@/app/store/rosebudStore"
import ThinkingAnimation from "./ThinkingAnimation"

interface ConversationMessagesProps {
  messages: ConversationMessage[]
  isGenerating: boolean
}

export default function ConversationMessages({
  messages,
  isGenerating,
}: ConversationMessagesProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="flex items-start gap-3">
          {message.role === "user" ? (
            <>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tl-none max-w-[85%]">
                <p className="text-sm">{message.content}</p>
              </div>
            </>
          ) : (
            <>
              <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="bg-accent p-3 rounded-lg rounded-tl-none max-w-[85%]">
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Typing indicator animation when generating a response */}
      {isGenerating && <ThinkingAnimation />}
    </div>
  )
}

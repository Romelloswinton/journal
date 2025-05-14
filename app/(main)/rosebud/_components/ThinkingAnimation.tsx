// app/rosebud/_components/ThinkingAnimation.tsx
import { Bot } from "lucide-react"

export default function ThinkingAnimation() {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-pink-600 dark:text-pink-400" />
      </div>
      <div className="bg-accent p-3 rounded-lg rounded-tl-none inline-flex items-center">
        <div className="flex space-x-1.5">
          <div
            className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  )
}

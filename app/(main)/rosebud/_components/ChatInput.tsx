// app/rosebud/_components/ChatInput.tsx
"use client"

import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  MutableRefObject,
} from "react"
import {
  Search,
  Loader2,
  SendHorizontal,
  Mic,
  PaperclipIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  query: string
  onQueryChange: (query: string) => void
  onSubmit: (query: string) => void
  isGenerating: boolean
  placeholder?: string
  autoFocus?: boolean
  // Keep MutableRefObject type for inputRef
  inputRef?: MutableRefObject<HTMLTextAreaElement | null>
}

export default function ChatInput({
  query,
  onQueryChange,
  onSubmit,
  isGenerating,
  placeholder = "Ask Rosebud anything about your journal entries...",
  autoFocus = false,
  inputRef: externalRef,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const internalRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use the external ref if provided, otherwise use the internal one
  const textareaRef = externalRef || internalRef

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to measure the scrollHeight correctly
      textareaRef.current.style.height = "auto"

      // Set the height to the scrollHeight
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${scrollHeight}px`

      // Cap the height at a maximum value (e.g., 120px)
      if (scrollHeight > 120) {
        textareaRef.current.style.height = "120px"
      }
    }
  }, [query, textareaRef])

  // Auto focus the input when requested, but don't position cursor
  // since we want an empty input field
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault() // Prevent new line on Enter without Shift
      if (query.trim() && !isGenerating) {
        onSubmit(query)
      }
    }
  }

  const hasContent = query.trim().length > 0

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative transition-all duration-200 bg-muted rounded-lg border border-border flex items-center",
        isFocused && "ring-2 ring-primary/50",
        hasContent && "pr-24" // Add space for send button
      )}
    >
      <Search
        className={cn(
          "w-4 h-4 text-muted-foreground absolute left-3 self-start mt-3",
          isFocused && "text-primary"
        )}
      />

      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isGenerating}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={1}
        className="w-full pl-9 pr-3 py-2 bg-transparent border-0 focus:outline-none resize-none text-foreground text-sm min-h-[40px] max-h-[120px] overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      />

      {/* Centered button container */}
      <div
        className={cn(
          "absolute right-2 flex items-center space-x-1",
          "top-1/2 transform -translate-y-1/2" // Center vertically
        )}
      >
        {/* Optional buttons that appear when focused */}
        {isFocused && !hasContent && !isGenerating && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full text-muted-foreground hover:text-foreground"
            >
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full text-muted-foreground hover:text-foreground"
            >
              <PaperclipIcon className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
          </>
        )}

        {/* Send button - only appears when there's content */}
        {hasContent && (
          <Button
            className={cn(
              "h-8 rounded-full transition-all duration-200",
              isGenerating
                ? "w-8 p-0"
                : "px-3 bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={() => onSubmit(query)}
            disabled={!query.trim() || isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="mr-1.5 text-xs font-medium">Send</span>
                <SendHorizontal className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Add a hint about Shift+Enter for new line */}
      {isFocused && query.length > 0 && (
        <div className="absolute -bottom-5 right-2 text-[10px] text-muted-foreground">
          Press Shift+Enter for a new line
        </div>
      )}
    </div>
  )
}

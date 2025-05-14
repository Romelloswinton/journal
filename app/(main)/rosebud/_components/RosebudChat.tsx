// app/rosebud/_components/RosebudChat.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { toast } from "sonner"
import useRosebudStore, { ConversationMessage } from "@/app/store/rosebudStore"
import LoadedConversationView from "./LoadedConversationView"
import RegularChatView from "./RegularChatView"

// Define prop interface for component
interface RosebudChatProps {
  selectedConversationId: string | null
  onConversationComplete: () => void
}

export default function RosebudChat({
  selectedConversationId,
  onConversationComplete,
}: RosebudChatProps) {
  const router = useRouter()

  const {
    currentQuery,
    currentResponse,
    loadedConversation,
    isGenerating,
    setQuery,
    askRosebud,
    clearCurrentConversation,
  } = useRosebudStore()

  // Local state for the conversation input to avoid conflicts with the main state
  const [conversationInputQuery, setConversationInputQuery] = useState("")

  // Local state for UI elements
  const [isViewingLoadedConversation, setIsViewingLoadedConversation] =
    useState(false)

  // State to track when we should focus the input
  const [shouldFocusInput, setShouldFocusInput] = useState(false)

  // State to store the ongoing conversation messages
  const [conversationMessages, setConversationMessages] = useState<
    ConversationMessage[]
  >([])

  // Update view state when loadedConversation changes
  useEffect(() => {
    const isLoaded = !!loadedConversation
    setIsViewingLoadedConversation(isLoaded)

    // When a conversation is loaded, initialize the conversation messages and clear input
    if (isLoaded && loadedConversation) {
      // Initialize conversation with the existing query and response
      const initialMessages: ConversationMessage[] =
        loadedConversation.messages || [
          { role: "user" as const, content: loadedConversation.query },
          { role: "assistant" as const, content: loadedConversation.response },
        ]
      setConversationMessages(initialMessages)

      // Reset both the main query state and our local input state
      setQuery("")
      setConversationInputQuery("")

      // Set flag to trigger focus
      setShouldFocusInput(true)
    }
  }, [loadedConversation, setQuery])

  // Handle query submission from the conversation view
  const handleConversationSubmit = async (query: string) => {
    if (!query.trim() || isGenerating) return

    try {
      // Add user's message to the conversation
      const updatedMessages: ConversationMessage[] = [
        ...conversationMessages,
        { role: "user" as const, content: query },
      ]
      setConversationMessages(updatedMessages)

      // Clear the input
      setConversationInputQuery("")

      try {
        // Call the API to get response
        const response = await askRosebud(query, true) // Pass true to indicate this is a continuation

        // The response could be either the latestResponse or response property from the API
        if (response) {
          // Check if the last message in our conversation isn't already the response
          const lastMessage =
            conversationMessages[conversationMessages.length - 1]
          const lastMessageIsResponse =
            lastMessage &&
            lastMessage.role === "assistant" &&
            lastMessage.content === response

          if (!lastMessageIsResponse) {
            // Only add the assistant's response if it's not already the last message
            setConversationMessages((prev: ConversationMessage[]) => [
              ...prev,
              { role: "assistant" as const, content: response },
            ])
          }
        }
      } catch (error) {
        // Add a user-friendly error message to the conversation
        setConversationMessages((prev: ConversationMessage[]) => [
          ...prev,
          {
            role: "assistant" as const,
            content:
              "I'm having trouble generating a response right now. Please try again in a moment.",
          },
        ])
        console.error("Error asking Rosebud:", error)
        toast.error("Failed to get a response. Please try again.")
      }
    } catch (error) {
      console.error("Conversation handling error:", error)
      toast.error("An error occurred while continuing the conversation.")
    }
  }

  // Handle main query submission
  const handleSubmit = async (query: string) => {
    if (!query.trim() || isGenerating) return

    try {
      await askRosebud(query)
      onConversationComplete()
    } catch (error) {
      console.error("Error asking Rosebud:", error)
      toast.error("Failed to get a response. Please try again.")
    }
  }

  // Handle creating a journal entry from response
  const handleCreateJournalEntry = () => {
    const response = loadedConversation
      ? loadedConversation.response
      : currentResponse
    const query = loadedConversation ? loadedConversation.query : currentQuery

    if (!response) return

    // Store the response in session storage to use on the journal create page
    sessionStorage.setItem("rosebudInsight", response)
    sessionStorage.setItem("rosebudQuery", query || "Reflection with Rosebud")

    // Navigate to journal creation page
    router.push("/journal/new")
    toast.success("Insight added to the journal editor")
  }

  // Handle copying conversation to clipboard
  const handleCopyToClipboard = () => {
    if (!loadedConversation) return

    // If there are additional messages, include them in the copy
    let content = ""

    if (conversationMessages.length > 2) {
      // Format the entire conversation
      content = conversationMessages
        .map((msg: ConversationMessage) => {
          return `${msg.role === "user" ? "User" : "Rosebud"}: ${msg.content}`
        })
        .join("\n\n")
    } else {
      // Just format the initial Q&A
      content = `Q: ${loadedConversation.query}\n\nA: ${loadedConversation.response}`
    }

    navigator.clipboard.writeText(content)
    toast.success("Copied to clipboard")
  }

  // Handle exporting conversation as markdown
  const handleExportAsMarkdown = () => {
    if (!loadedConversation) return

    // Create content based on whether there are additional messages
    let content = ""

    if (conversationMessages.length > 2) {
      // Format the entire conversation
      const conversationContent = conversationMessages
        .map((msg: ConversationMessage) => {
          return `### ${msg.role === "user" ? "User" : "Rosebud"}\n\n${
            msg.content
          }`
        })
        .join("\n\n")

      // Use updatedAt if available, otherwise use createdAt
      const displayDate =
        loadedConversation.updatedAt || loadedConversation.createdAt

      content = `# ${
        loadedConversation.label || "Conversation"
      }\n\n${conversationContent}\n\nDate: ${format(
        new Date(displayDate),
        "PPP"
      )}`
    } else {
      // Just format the initial Q&A
      content = `# ${loadedConversation.label || "Conversation"}\n\nQuery: ${
        loadedConversation.query
      }\n\nResponse: ${loadedConversation.response}\n\nDate: ${format(
        new Date(loadedConversation.createdAt),
        "PPP"
      )}`
    }

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const fileName = `rosebud-conversation-${format(
      new Date(loadedConversation.updatedAt || loadedConversation.createdAt),
      "yyyy-MM-dd"
    )}.md`
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Conversation exported")
  }

  // Handle back to chat
  const handleBackToChat = () => {
    clearCurrentConversation()
    setIsViewingLoadedConversation(false)
    setShouldFocusInput(false)
    setConversationInputQuery("") // Clear the local input state
    setConversationMessages([]) // Clear conversation messages
  }

  return (
    <Card className="bg-card border-border">
      <AnimatePresence mode="wait">
        {isViewingLoadedConversation && loadedConversation ? (
          <LoadedConversationView
            loadedConversation={loadedConversation}
            conversationMessages={conversationMessages}
            conversationInputQuery={conversationInputQuery}
            isGenerating={isGenerating}
            shouldFocusInput={shouldFocusInput}
            onConversationInputChange={setConversationInputQuery}
            onSubmit={handleConversationSubmit}
            onBackToChat={handleBackToChat}
            onCreateJournalEntry={handleCreateJournalEntry}
            onCopyToClipboard={handleCopyToClipboard}
            onExportAsMarkdown={handleExportAsMarkdown}
          />
        ) : (
          <RegularChatView
            currentQuery={currentQuery}
            currentResponse={currentResponse}
            isGenerating={isGenerating}
            onQueryChange={setQuery}
            onSubmit={handleSubmit}
            onCreateJournalEntry={handleCreateJournalEntry}
          />
        )}
      </AnimatePresence>
    </Card>
  )
}

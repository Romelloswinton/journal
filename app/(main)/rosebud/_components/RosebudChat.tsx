// app/rosebud/_components/RosebudChat.tsx (Updated portion)
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
import FollowUpPrompt from "./FollowUpPrompt"

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

  // Follow-up prompt state
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [lastAIResponse, setLastAIResponse] = useState("")
  const [lastUserQuestion, setLastUserQuestion] = useState("")

  // NEW: Enhanced function to handle starting a new chat
  const handleStartNewChat = () => {
    try {
      // Store current state for potential undo functionality
      const previousState = {
        query: currentQuery,
        response: currentResponse,
        loadedConversation: loadedConversation,
        messages: conversationMessages,
      }

      // Clear all current conversation state
      clearCurrentConversation()

      // Reset local state comprehensively
      setIsViewingLoadedConversation(false)
      setShouldFocusInput(true) // Focus input for new session
      setConversationInputQuery("")
      setConversationMessages([])

      // Reset follow-up state
      setShowFollowUp(false)
      setLastAIResponse("")
      setLastUserQuestion("")

      // Optional: Store in session for potential recovery
      if (previousState.query || previousState.response) {
        sessionStorage.setItem(
          "rosebud_previous_session",
          JSON.stringify({
            ...previousState,
            timestamp: new Date().toISOString(),
          })
        )
      }

      console.log("✅ New chat session started successfully")
    } catch (error) {
      console.error("❌ Error starting new chat:", error)
      toast.error(
        "There was an issue starting a new chat. Please refresh the page."
      )
    }
  }

  // NEW: Determine if there's an active conversation
  const hasActiveConversation = Boolean(
    currentResponse ||
      loadedConversation ||
      conversationMessages.length > 0 ||
      currentQuery.trim()
  )

  // Watch for response changes to trigger follow-up
  useEffect(() => {
    if (currentResponse && !isGenerating && !isViewingLoadedConversation) {
      console.log("🐛 DEBUG: New response detected, setting up follow-up")
      setLastAIResponse(currentResponse)
      setLastUserQuestion(currentQuery)

      const timer = setTimeout(() => {
        console.log("🐛 DEBUG: Showing follow-up prompt")
        setShowFollowUp(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [currentResponse, isGenerating, isViewingLoadedConversation, currentQuery])

  // Watch for conversation response changes
  useEffect(() => {
    if (isViewingLoadedConversation && conversationMessages.length > 0) {
      const lastMessage = conversationMessages[conversationMessages.length - 1]
      const secondLastMessage =
        conversationMessages[conversationMessages.length - 2]

      if (lastMessage?.role === "assistant" && !isGenerating) {
        console.log("🐛 DEBUG: New conversation response detected")
        setLastAIResponse(lastMessage.content)

        if (secondLastMessage?.role === "user") {
          setLastUserQuestion(secondLastMessage.content)
        }

        const timer = setTimeout(() => {
          console.log("🐛 DEBUG: Showing follow-up prompt for conversation")
          setShowFollowUp(true)
        }, 1500)

        return () => clearTimeout(timer)
      }
    }
  }, [conversationMessages, isGenerating, isViewingLoadedConversation])

  // Update view state when loadedConversation changes
  useEffect(() => {
    const isLoaded = !!loadedConversation
    setIsViewingLoadedConversation(isLoaded)

    if (isLoaded && loadedConversation) {
      const initialMessages: ConversationMessage[] =
        loadedConversation.messages || [
          { role: "user" as const, content: loadedConversation.query },
          { role: "assistant" as const, content: loadedConversation.response },
        ]
      setConversationMessages(initialMessages)

      setQuery("")
      setConversationInputQuery("")
      setShouldFocusInput(true)

      setLastAIResponse(loadedConversation.response)
      setLastUserQuestion(loadedConversation.query)
      const timer = setTimeout(() => {
        setShowFollowUp(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [loadedConversation, setQuery])

  // Handle suggested questions
  const handleSuggestedQuestion = (question: string) => {
    if (isViewingLoadedConversation) {
      setConversationInputQuery(question)
      setShowFollowUp(false)
      setTimeout(() => {
        handleConversationSubmit(question)
      }, 100)
    } else {
      setQuery(question)
      setShowFollowUp(false)
      setTimeout(() => {
        handleSubmit(question)
      }, 100)
    }
  }

  // Handle input changes to hide follow-up
  const handleInputChange = (value: string) => {
    if (value.trim() && showFollowUp) {
      setShowFollowUp(false)
    }
  }

  // Handle query submission from the conversation view
  const handleConversationSubmit = async (query: string) => {
    if (!query.trim() || isGenerating) return

    setShowFollowUp(false)

    try {
      const updatedMessages: ConversationMessage[] = [
        ...conversationMessages,
        { role: "user" as const, content: query },
      ]
      setConversationMessages(updatedMessages)
      setConversationInputQuery("")

      try {
        const response = await askRosebud(query, true)

        if (response) {
          const lastMessage =
            conversationMessages[conversationMessages.length - 1]
          const lastMessageIsResponse =
            lastMessage &&
            lastMessage.role === "assistant" &&
            lastMessage.content === response

          if (!lastMessageIsResponse) {
            setConversationMessages((prev: ConversationMessage[]) => [
              ...prev,
              { role: "assistant" as const, content: response },
            ])
          }
        }
      } catch (error) {
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

    setShowFollowUp(false)

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

    sessionStorage.setItem("rosebudInsight", response)
    sessionStorage.setItem("rosebudQuery", query || "Reflection with Rosebud")

    router.push("/journal/new")
    toast.success("Insight added to the journal editor")
  }

  // Handle copying conversation to clipboard
  const handleCopyToClipboard = () => {
    if (!loadedConversation) return

    let content = ""

    if (conversationMessages.length > 2) {
      content = conversationMessages
        .map((msg: ConversationMessage) => {
          return `${msg.role === "user" ? "User" : "Rosebud"}: ${msg.content}`
        })
        .join("\n\n")
    } else {
      content = `Q: ${loadedConversation.query}\n\nA: ${loadedConversation.response}`
    }

    navigator.clipboard.writeText(content)
    toast.success("Copied to clipboard")
  }

  // Handle exporting conversation as markdown
  const handleExportAsMarkdown = () => {
    if (!loadedConversation) return

    let content = ""

    if (conversationMessages.length > 2) {
      const conversationContent = conversationMessages
        .map((msg: ConversationMessage) => {
          return `### ${msg.role === "user" ? "User" : "Rosebud"}\n\n${
            msg.content
          }`
        })
        .join("\n\n")

      const displayDate =
        loadedConversation.updatedAt || loadedConversation.createdAt

      content = `# ${
        loadedConversation.label || "Conversation"
      }\n\n${conversationContent}\n\nDate: ${format(
        new Date(displayDate),
        "PPP"
      )}`
    } else {
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
    setConversationInputQuery("")
    setConversationMessages([])

    setShowFollowUp(false)
    setLastAIResponse("")
    setLastUserQuestion("")
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
            onConversationInputChange={(value) => {
              setConversationInputQuery(value)
              handleInputChange(value)
            }}
            onSubmit={handleConversationSubmit}
            onBackToChat={handleBackToChat}
            onCreateJournalEntry={handleCreateJournalEntry}
            onCopyToClipboard={handleCopyToClipboard}
            onExportAsMarkdown={handleExportAsMarkdown}
            showFollowUp={showFollowUp}
            lastAIResponse={lastAIResponse}
            lastUserQuestion={lastUserQuestion}
            onSuggestedQuestion={handleSuggestedQuestion}
          />
        ) : (
          <RegularChatView
            currentQuery={currentQuery}
            currentResponse={currentResponse}
            isGenerating={isGenerating}
            onQueryChange={(value) => {
              setQuery(value)
              handleInputChange(value)
            }}
            onSubmit={handleSubmit}
            onCreateJournalEntry={handleCreateJournalEntry}
            showFollowUp={showFollowUp && !!currentResponse}
            lastAIResponse={lastAIResponse}
            lastUserQuestion={lastUserQuestion}
            onSuggestedQuestion={handleSuggestedQuestion}
          />
        )}
      </AnimatePresence>
    </Card>
  )
}

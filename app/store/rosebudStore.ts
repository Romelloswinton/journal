// app/store/rosebudStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { format } from "date-fns"

// Message format for chat conversations
export interface ConversationMessage {
  role: "user" | "assistant"
  content: string
}

export interface RosebudConversation {
  id: string
  query: string
  response: string
  createdAt: string
  updatedAt?: string
  label?: string // Field for conversation labeling
  messages?: ConversationMessage[] // Additional messages beyond the initial Q&A
}

interface RosebudState {
  // State
  conversations: RosebudConversation[]
  currentQuery: string
  currentResponse: string | null
  isGenerating: boolean
  error: string | null
  loadedConversation: RosebudConversation | null // New state for loaded conversation
  favoriteConversations: Set<string> // New state for favorite conversations

  // Local state for active conversation
  activeConversationMessages: ConversationMessage[]

  // Actions
  setQuery: (query: string) => void
  askRosebud: (
    query?: string,
    continueConversation?: boolean
  ) => Promise<string | null>
  fetchConversations: () => Promise<void>
  clearCurrentConversation: () => void

  // Conversation management actions
  deleteConversation: (id: string) => Promise<boolean>
  updateConversationLabel: (id: string, label: string) => Promise<boolean>
  exportConversations: () => void
  clearAllConversations: () => Promise<boolean>

  // New actions for enhanced conversation interaction
  loadConversation: (conversation: RosebudConversation) => void
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  getFavorites: () => RosebudConversation[]

  // Conversation continuation actions
  addMessageToConversation: (
    role: "user" | "assistant",
    content: string
  ) => void
  updateConversationInDb: (
    conversation: RosebudConversation
  ) => Promise<boolean>
}

// For development debugging
const DEV_MODE = process.env.NODE_ENV === "development"
const API_FALLBACK = false // Set to true to use fallback responses during development

const useRosebudStore = create<RosebudState>()(
  persist(
    (set, get) => ({
      // Initial state
      conversations: [],
      currentQuery: "",
      currentResponse: null,
      isGenerating: false,
      error: null,
      loadedConversation: null,
      favoriteConversations: new Set<string>(),
      activeConversationMessages: [],

      // Set current query
      setQuery: (query: string) => {
        set({ currentQuery: query })
      },

      // Add a message to the active conversation
      addMessageToConversation: (
        role: "user" | "assistant",
        content: string
      ) => {
        set((state) => {
          const newMessages: ConversationMessage[] = [
            ...state.activeConversationMessages,
            { role, content },
          ]
          return { activeConversationMessages: newMessages }
        })
      },

      // Update a conversation in the database
      updateConversationInDb: async (conversation: RosebudConversation) => {
        try {
          const response = await fetch(`/api/rosebud/${conversation.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...conversation,
              updatedAt: new Date().toISOString(), // Ensure we're sending the current time
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to update conversation")
          }

          // Update local state
          set((state) => {
            // Update in conversations array
            const updatedConversations = state.conversations.map((c) =>
              c.id === conversation.id ? conversation : c
            )

            return {
              conversations: updatedConversations,
              loadedConversation: conversation, // Update the loaded conversation
            }
          })

          return true
        } catch (error) {
          console.error("Failed to update conversation:", error)
          return false
        }
      },

      // Ask Rosebud a question
      askRosebud: async (query?: string, continueConversation = false) => {
        const finalQuery = query || get().currentQuery
        const { loadedConversation, activeConversationMessages } = get()

        if (!finalQuery.trim()) {
          return null
        }

        set({ isGenerating: true, error: null })

        // If using fallback mode (for development only)
        if (API_FALLBACK && DEV_MODE) {
          console.warn(
            "Using API fallback mode - no actual API calls will be made"
          )

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Create a mock response
          const mockResponse =
            "This is a fallback response. The API server appears to be unavailable, so I'm providing this simulated response instead."

          if (continueConversation && loadedConversation) {
            // Update state as if we got a real response
            set((state) => {
              const newMessages: ConversationMessage[] = [
                ...state.activeConversationMessages,
                { role: "assistant" as const, content: mockResponse },
              ]

              const updatedConversation: RosebudConversation = {
                ...loadedConversation,
                messages: newMessages,
                updatedAt: new Date().toISOString(),
              }

              // Update conversation in local state
              const updatedConversations = state.conversations.map((convo) =>
                convo.id === updatedConversation.id
                  ? updatedConversation
                  : convo
              )

              // Move the updated conversation to the top of the list
              const reorderedConversations = [
                updatedConversation,
                ...updatedConversations.filter(
                  (convo) => convo.id !== updatedConversation.id
                ),
              ]

              return {
                activeConversationMessages: newMessages,
                loadedConversation: updatedConversation,
                conversations: reorderedConversations,
                isGenerating: false,
              }
            })

            return mockResponse
          } else {
            // For new conversations
            set((state) => ({
              conversations: [
                {
                  id: `mock-${Date.now()}`,
                  query: finalQuery,
                  response: mockResponse,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                ...state.conversations,
              ],
              currentQuery: "",
              currentResponse: mockResponse,
              isGenerating: false,
            }))

            return mockResponse
          }
        }

        try {
          // Build the request data
          const requestData: any = { query: finalQuery }

          // If continuing a conversation, include previous messages for context
          if (continueConversation && loadedConversation) {
            // Initialize messages with the original Q&A if needed
            const initialMessages: ConversationMessage[] =
              activeConversationMessages.length > 0
                ? activeConversationMessages
                : [
                    {
                      role: "user" as const,
                      content: loadedConversation.query,
                    },
                    {
                      role: "assistant" as const,
                      content: loadedConversation.response,
                    },
                  ]

            // Add the new user query
            const previousMessages: ConversationMessage[] = [
              ...initialMessages,
              { role: "user" as const, content: finalQuery },
            ]

            // Update the active conversation messages
            set({ activeConversationMessages: previousMessages })

            // Include messages in the request
            requestData.messages = previousMessages
            requestData.conversationId = loadedConversation.id
            requestData.continueConversation = true // Flag to tell API to update existing conversation
          }

          try {
            // Make API call to ask Rosebud
            const response = await fetch("/api/rosebud", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            })

            if (!response.ok) {
              throw new Error(
                `Server error: ${response.status} ${response.statusText}`
              )
            }

            const data = await response.json()

            if (continueConversation && loadedConversation) {
              // Get the assistant's response from either latestResponse or response
              const responseText = data.latestResponse || data.response

              // Add the assistant's response to active conversation messages
              set((state) => {
                const newMessages: ConversationMessage[] = [
                  ...state.activeConversationMessages,
                  { role: "assistant" as const, content: responseText },
                ]

                // Create an updated conversation with new messages and current timestamp
                const updatedConversation: RosebudConversation = {
                  ...loadedConversation,
                  messages: newMessages,
                  updatedAt: new Date().toISOString(), // Update the timestamp
                }

                // Update conversation in local state
                const updatedConversations = state.conversations.map((convo) =>
                  convo.id === updatedConversation.id
                    ? updatedConversation
                    : convo
                )

                // Move the updated conversation to the top of the list
                const reorderedConversations = [
                  updatedConversation,
                  ...updatedConversations.filter(
                    (convo) => convo.id !== updatedConversation.id
                  ),
                ]

                // Update the conversation in the database (async)
                get().updateConversationInDb(updatedConversation)

                return {
                  activeConversationMessages: newMessages,
                  loadedConversation: updatedConversation,
                  conversations: reorderedConversations,
                  isGenerating: false,
                }
              })

              return responseText
            } else {
              // Update state with the new conversation
              set((state) => ({
                conversations: [data, ...state.conversations],
                currentQuery: "",
                currentResponse: data.response,
                isGenerating: false,
                loadedConversation: null, // Clear any loaded conversation when getting a new response
                activeConversationMessages: [], // Clear active conversation messages
              }))

              return data.response
            }
          } catch (fetchError) {
            console.error("API connection error:", fetchError)

            // Handle the case when API is unavailable but we still want to continue the conversation UI
            if (continueConversation && loadedConversation) {
              // Create a friendly error message as the response
              const errorMessage =
                "I'm having trouble connecting to my knowledge base right now. Please check your internet connection and try again in a moment."

              // Add the error message as the assistant's response
              set((state) => {
                const newMessages: ConversationMessage[] = [
                  ...state.activeConversationMessages,
                  { role: "assistant" as const, content: errorMessage },
                ]

                return {
                  activeConversationMessages: newMessages,
                  isGenerating: false,
                  error: "Failed to connect to the server.",
                }
              })

              return errorMessage
            }

            throw fetchError // Re-throw to be caught by the outer catch
          }
        } catch (error) {
          console.error("Failed to get response from Rosebud:", error)
          set({
            error: "Failed to get response from Rosebud. Please try again.",
            isGenerating: false,
          })
          return null
        }
      },

      // Fetch past conversations
      fetchConversations: async () => {
        set({ error: null })

        try {
          const response = await fetch("/api/rosebud", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (!response.ok) {
            throw new Error("Failed to fetch conversations")
          }

          const data = await response.json()
          set({ conversations: data })
        } catch (error) {
          console.error("Failed to fetch conversations:", error)
          set({ error: "Failed to load past conversations." })
        }
      },

      // Clear current conversation
      clearCurrentConversation: () => {
        set({
          currentQuery: "",
          currentResponse: null,
          loadedConversation: null, // Also clear loaded conversation
          activeConversationMessages: [], // Clear active conversation messages
        })
      },

      // Delete a single conversation
      deleteConversation: async (id: string) => {
        try {
          const response = await fetch(`/api/rosebud/${id}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            throw new Error("Failed to delete conversation")
          }

          // Update local state
          set((state) => {
            // Also clear loadedConversation if it's the deleted one
            const newState: Partial<RosebudState> = {
              conversations: state.conversations.filter((c) => c.id !== id),
            }

            // If the deleted conversation was loaded, clear it
            if (state.loadedConversation?.id === id) {
              newState.loadedConversation = null
              newState.activeConversationMessages = []
            }

            // If the deleted conversation was in favorites, remove it
            if (state.favoriteConversations.has(id)) {
              const newFavorites = new Set(state.favoriteConversations)
              newFavorites.delete(id)
              newState.favoriteConversations = newFavorites
            }

            return newState
          })

          return true
        } catch (error) {
          console.error("Failed to delete conversation:", error)
          return false
        }
      },

      // Update conversation label
      updateConversationLabel: async (id: string, label: string) => {
        try {
          const response = await fetch(`/api/rosebud/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ label }),
          })

          if (!response.ok) {
            throw new Error("Failed to update conversation label")
          }

          const updatedConversation = await response.json()

          // Update local state
          set((state) => {
            // Update in conversations array
            const updatedConversations = state.conversations.map((c) =>
              c.id === id ? { ...c, label } : c
            )

            // Also update in loadedConversation if it's the same one
            const newState: Partial<RosebudState> = {
              conversations: updatedConversations,
            }

            if (state.loadedConversation?.id === id) {
              newState.loadedConversation = {
                ...state.loadedConversation,
                label,
              }
            }

            return newState
          })

          return true
        } catch (error) {
          console.error("Failed to update conversation label:", error)
          return false
        }
      },

      // Export all conversations
      exportConversations: () => {
        const { conversations } = get()

        if (conversations.length === 0) {
          return
        }

        const content = conversations
          .map((convo) => {
            let conversationContent = `# ${
              convo.label || "Conversation"
            }\n\nQuery: ${convo.query}\n\nResponse: ${convo.response}\n\n`

            // Add additional messages if any
            if (convo.messages && convo.messages.length > 2) {
              conversationContent += "## Continuation\n\n"

              // Skip the first two messages (already included above)
              for (let i = 2; i < convo.messages.length; i++) {
                const msg = convo.messages[i]
                conversationContent += `**${
                  msg.role === "user" ? "User" : "Rosebud"
                }**: ${msg.content}\n\n`
              }
            }

            // Use updatedAt if available, otherwise use createdAt
            const displayDate = convo.updatedAt || convo.createdAt
            conversationContent += `Date: ${format(
              new Date(displayDate),
              "PPP"
            )}\n\n---\n\n`

            return conversationContent
          })
          .join("")

        const blob = new Blob([content], { type: "text/markdown" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rosebud-conversations-${format(
          new Date(),
          "yyyy-MM-dd"
        )}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },

      // Clear all conversations
      clearAllConversations: async () => {
        try {
          const response = await fetch("/api/rosebud/all", {
            method: "DELETE",
          })

          if (!response.ok) {
            throw new Error("Failed to clear conversations")
          }

          // Update local state
          set({
            conversations: [],
            loadedConversation: null,
            favoriteConversations: new Set(),
            activeConversationMessages: [],
          })

          return true
        } catch (error) {
          console.error("Failed to clear all conversations:", error)
          return false
        }
      },

      // Load conversation into chat
      loadConversation: (conversation: RosebudConversation) => {
        // Initialize active conversation messages from the conversation
        const initialMessages: ConversationMessage[] =
          conversation.messages || [
            { role: "user" as const, content: conversation.query },
            { role: "assistant" as const, content: conversation.response },
          ]

        set({
          loadedConversation: conversation,
          currentQuery: "", // Clear current query
          currentResponse: null, // Clear current response
          activeConversationMessages: initialMessages,
        })
      },

      // Toggle favorite status for a conversation
      toggleFavorite: (id: string) => {
        set((state) => {
          const newFavorites = new Set(state.favoriteConversations)

          if (newFavorites.has(id)) {
            newFavorites.delete(id)
          } else {
            newFavorites.add(id)
          }

          return { favoriteConversations: newFavorites }
        })
      },

      // Check if a conversation is a favorite
      isFavorite: (id: string) => {
        return get().favoriteConversations.has(id)
      },

      // Get all favorite conversations
      getFavorites: () => {
        const { conversations, favoriteConversations } = get()
        return conversations.filter((c) => favoriteConversations.has(c.id))
      },
    }),
    {
      name: "rosebud-storage",
      partialize: (state) => ({
        conversations: state.conversations,
        favoriteConversations: Array.from(state.favoriteConversations), // Convert Set to Array for storage
      }),
      // Handle the conversion from array back to Set when loading from storage
      onRehydrateStorage: (state) => {
        return (persistedState, error) => {
          if (
            persistedState &&
            Array.isArray(persistedState.favoriteConversations)
          ) {
            // Convert the array back to a Set
            persistedState.favoriteConversations = new Set(
              persistedState.favoriteConversations
            )
          } else if (persistedState) {
            // Initialize as empty Set if missing
            persistedState.favoriteConversations = new Set()
          }
        }
      },
    }
  )
)

export default useRosebudStore

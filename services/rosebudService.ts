// services/rosebudService.ts
import { toast } from "sonner"

export interface RosebudConversation {
  id: string
  query: string
  response: string
  createdAt: string
}

export const rosebudService = {
  // Get past conversations
  async getConversations(): Promise<RosebudConversation[]> {
    const response = await fetch("/api/rosebud", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Failed to fetch conversations")
    }

    return response.json()
  },

  // Ask Rosebud a question
  async askQuestion(query: string): Promise<RosebudConversation> {
    const response = await fetch("/api/rosebud", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Failed to get response from Rosebud")
    }

    return response.json()
  },
}

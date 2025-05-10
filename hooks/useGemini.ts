"use client"

// hooks/useGemini.ts
import geminiApiClient from "@/lib/gemini/geminiApiClient"
import {
  AllReflections,
  EntryReflection,
  UserEntries,
  GeminiApiConfig,
} from "@/lib/gemini/types"
import { useState } from "react"

/**
 * Default API configuration
 */
const DEFAULT_CONFIG: GeminiApiConfig = {
  temperature: 0.7,
  topP: 0.9,
  maxOutputTokens: 200,
}

/**
 * Hook for generating Gemini reflections
 * Provides state management and API handling for Gemini interactions
 */
export function useGemini() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reflections, setReflections] = useState<AllReflections | null>(null)

  /**
   * Generate reflections for all entry types
   * @param entries User's priority, worry, and positive action entries
   * @param config Optional API configuration
   * @returns Promise resolving to the generated reflections
   */
  const generateReflections = async (
    entries: UserEntries,
    config: GeminiApiConfig = DEFAULT_CONFIG
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate input
      if (!entries.priority && !entries.worry && !entries.positive) {
        throw new Error(
          "At least one entry must be provided for reflection generation"
        )
      }

      const generatedReflections = await geminiApiClient.generateAllReflections(
        entries,
        config
      )
      setReflections(generatedReflections)
      setIsLoading(false)
      return generatedReflections
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      setIsLoading(false)
      throw err
    }
  }

  /**
   * Generate reflections for priority entry only
   * @param priority User's priority entry
   * @param config Optional API configuration
   * @returns Promise resolving to the generated priority reflections
   */
  const generatePriorityReflections = async (
    priority: string,
    config: GeminiApiConfig = DEFAULT_CONFIG
  ): Promise<EntryReflection> => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate input
      if (!priority.trim()) {
        throw new Error("Priority entry cannot be empty")
      }

      const priorityReflections =
        await geminiApiClient.generatePriorityReflections(priority, config)

      // Update the overall reflections state if it exists
      if (reflections) {
        setReflections({
          ...reflections,
          priority: priorityReflections,
        })
      }

      setIsLoading(false)
      return priorityReflections
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      setIsLoading(false)
      throw err
    }
  }

  /**
   * Generate reflections for worry entry only
   * @param worry User's worry entry
   * @param config Optional API configuration
   * @returns Promise resolving to the generated worry reflections
   */
  const generateWorryReflections = async (
    worry: string,
    config: GeminiApiConfig = DEFAULT_CONFIG
  ): Promise<EntryReflection> => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate input
      if (!worry.trim()) {
        throw new Error("Worry entry cannot be empty")
      }

      const worryReflections = await geminiApiClient.generateWorryReflections(
        worry,
        config
      )

      // Update the overall reflections state if it exists
      if (reflections) {
        setReflections({
          ...reflections,
          worry: worryReflections,
        })
      }

      setIsLoading(false)
      return worryReflections
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      setIsLoading(false)
      throw err
    }
  }

  /**
   * Generate reflections for positive action entry only
   * @param positive User's positive action entry
   * @param config Optional API configuration
   * @returns Promise resolving to the generated positive action reflections
   */
  const generatePositiveReflections = async (
    positive: string,
    config: GeminiApiConfig = DEFAULT_CONFIG
  ): Promise<EntryReflection> => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate input
      if (!positive.trim()) {
        throw new Error("Positive action entry cannot be empty")
      }

      const positiveReflections =
        await geminiApiClient.generatePositiveReflections(positive, config)

      // Update the overall reflections state if it exists
      if (reflections) {
        setReflections({
          ...reflections,
          positive: positiveReflections,
        })
      }

      setIsLoading(false)
      return positiveReflections
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      setIsLoading(false)
      throw err
    }
  }

  /**
   * Generate a single reflection for any entry type
   * @param type The type of reflection to generate ("priority", "worry", or "positive")
   * @param content The user's entry
   * @param config Optional API configuration
   * @returns Promise resolving to the generated reflection
   */
  const generateSingleReflection = async (
    type: "priority" | "worry" | "positive",
    content: string,
    config: GeminiApiConfig = DEFAULT_CONFIG
  ): Promise<EntryReflection> => {
    switch (type) {
      case "priority":
        return generatePriorityReflections(content, config)
      case "worry":
        return generateWorryReflections(content, config)
      case "positive":
        return generatePositiveReflections(content, config)
      default:
        throw new Error(`Invalid reflection type: ${type}`)
    }
  }

  /**
   * Reset the hook's state
   */
  const reset = () => {
    setIsLoading(false)
    setError(null)
    setReflections(null)
  }

  return {
    isLoading,
    error,
    reflections,
    generateReflections,
    generatePriorityReflections,
    generateWorryReflections,
    generatePositiveReflections,
    generateSingleReflection,
    reset,
  }
}

export default useGemini

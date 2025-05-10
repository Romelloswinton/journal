// lib/gemini/types.ts

/**
 * Interface for user entries passed to Gemini for reflection
 */
export interface UserEntries {
  priority: string
  worry: string
  positive: string
}

/**
 * Interface for Gemini's reflection on a single entry type (upgrade and follow-up)
 */
export interface EntryReflection {
  upgrade: string
  spark: string
}

/**
 * Interface for all Gemini reflections across entry types
 */
export interface AllReflections {
  priority: EntryReflection
  worry: EntryReflection
  positive: EntryReflection
}

/**
 * Configuration for a Gemini API call
 */
export interface GeminiApiConfig {
  temperature?: number
  topP?: number
  maxOutputTokens?: number
}

/**
 * Types of reflections that can be requested
 */
export type ReflectionType = "priority" | "worry" | "positive" | "all"

/**
 * Request to generate reflections
 */
export interface ReflectionRequest {
  priority?: string
  worry?: string
  positive?: string
  reflectionType: ReflectionType
  config?: GeminiApiConfig
}

/**
 * Response from a reflection generation request
 */
export interface ReflectionResponse {
  priority?: EntryReflection
  worry?: EntryReflection
  positive?: EntryReflection
  error?: string
}

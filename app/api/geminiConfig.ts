// lib/config/geminiConfig.ts
import {
  GoogleGenerativeAI,
  GenerativeModel,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"

/**
 * Configuration options for the Gemini AI API
 */
export interface GeminiConfig {
  apiKey: string
  defaultModel: string
  defaultTemperature: number
  defaultTopP: number
  defaultTopK?: number
  defaultMaxOutputTokens?: number
  defaultModels: {
    chat: string
    completion: string
    embedding: string
  }
  safetySettings?: Array<{
    category: HarmCategory
    threshold: HarmBlockThreshold
  }>
}

/**
 * Load Gemini configuration from environment variables
 * with sensible defaults
 */
export function loadGeminiConfig(): GeminiConfig {
  // Access environment variables with fallbacks
  return {
    apiKey:
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "",
    defaultModel: process.env.GEMINI_DEFAULT_MODEL || "gemini-1.5-flash",
    defaultTemperature: parseFloat(
      process.env.GEMINI_DEFAULT_TEMPERATURE || "0.7"
    ),
    defaultTopP: parseFloat(process.env.GEMINI_DEFAULT_TOP_P || "0.9"),
    defaultTopK: process.env.GEMINI_DEFAULT_TOP_K
      ? parseInt(process.env.GEMINI_DEFAULT_TOP_K)
      : undefined,
    defaultMaxOutputTokens: process.env.GEMINI_MAX_OUTPUT_TOKENS
      ? parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS)
      : undefined,
    defaultModels: {
      chat: process.env.GEMINI_CHAT_MODEL || "gemini-1.5-flash",
      completion: process.env.GEMINI_COMPLETION_MODEL || "gemini-1.5-pro",
      embedding: process.env.GEMINI_EMBEDDING_MODEL || "embedding-001",
    },
    // Optional safety settings - could be loaded from environment or config file
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  }
}

/**
 * Singleton class for managing Gemini AI client instances
 */
export class GeminiService {
  private static instance: GeminiService
  private readonly config: GeminiConfig
  private readonly genAI: GoogleGenerativeAI
  private modelCache: Map<string, GenerativeModel> = new Map()

  private constructor() {
    this.config = loadGeminiConfig()

    if (!this.config.apiKey) {
      console.warn(
        "Gemini API key not configured. Set GEMINI_API_KEY environment variable."
      )
    }

    this.genAI = new GoogleGenerativeAI(this.config.apiKey)
  }

  /**
   * Get the singleton instance of GeminiService
   */
  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService()
    }
    return GeminiService.instance
  }

  /**
   * Get the Gemini configuration
   */
  public getConfig(): GeminiConfig {
    return { ...this.config } // Return a copy to prevent modification
  }

  /**
   * Get a Gemini model with optional custom configuration
   * @param modelName Optional model name (defaults to the configured default model)
   * @param customConfig Optional custom configuration for this model instance
   */
  public getModel(
    modelName?: string,
    customConfig?: {
      temperature?: number
      topP?: number
      topK?: number
      maxOutputTokens?: number
      safetySettings?: Array<{
        category: HarmCategory
        threshold: HarmBlockThreshold
      }>
    }
  ): GenerativeModel {
    const modelId = modelName || this.config.defaultModel

    // Create a cache key that includes both model name and custom config
    const cacheKey = this.createCacheKey(modelId, customConfig)

    // Return cached model if available
    if (this.modelCache.has(cacheKey)) {
      return this.modelCache.get(cacheKey)!
    }

    // Create a new model instance with merged configurations
    const model = this.genAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        temperature:
          customConfig?.temperature ?? this.config.defaultTemperature,
        topP: customConfig?.topP ?? this.config.defaultTopP,
        topK: customConfig?.topK ?? this.config.defaultTopK,
        maxOutputTokens:
          customConfig?.maxOutputTokens ?? this.config.defaultMaxOutputTokens,
      },
      safetySettings:
        customConfig?.safetySettings ?? this.config.safetySettings,
    })

    // Cache the model instance
    this.modelCache.set(cacheKey, model)

    return model
  }

  /**
   * Get a chat model optimized for conversation
   */
  public getChatModel(customConfig?: any): GenerativeModel {
    return this.getModel(this.config.defaultModels.chat, customConfig)
  }

  /**
   * Get a completion model optimized for text generation
   */
  public getCompletionModel(customConfig?: any): GenerativeModel {
    return this.getModel(this.config.defaultModels.completion, customConfig)
  }

  /**
   * Check if the Gemini API key is configured
   */
  public isConfigured(): boolean {
    return !!this.config.apiKey
  }

  /**
   * Create a unique cache key for model configurations
   */
  private createCacheKey(modelId: string, config?: any): string {
    if (!config) return modelId
    return modelId + JSON.stringify(config)
  }
}

/**
 * Get the default Gemini service instance
 */
export const geminiService = GeminiService.getInstance()

export default geminiService

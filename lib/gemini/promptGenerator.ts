// lib/gemini/promptGenerator.ts

/**
 * Types of prompts available for Gemini
 */
export type PromptType =
  | "priorityUpgrade"
  | "prioritySpark"
  | "worryUpgrade"
  | "worrySpark"
  | "positiveUpgrade"
  | "positiveSpark"

/**
 * Prompt Generator for Gemini API
 * Handles creation of well-structured prompts for different reflection types
 */
export const promptGenerator = {
  /**
   * Create an appropriate prompt for Gemini based on the type and input
   * @param type The type of prompt to generate
   * @param input The user's content to reflect on
   * @returns A well-crafted prompt for Gemini
   */
  createPrompt(type: PromptType, input: string): string {
    const cleanInput = this.sanitizeInput(input)

    switch (type) {
      case "priorityUpgrade":
        return this.createPriorityUpgradePrompt(cleanInput)
      case "prioritySpark":
        return this.createPrioritySparkPrompt(cleanInput)
      case "worryUpgrade":
        return this.createWorryUpgradePrompt(cleanInput)
      case "worrySpark":
        return this.createWorrySparkPrompt(cleanInput)
      case "positiveUpgrade":
        return this.createPositiveUpgradePrompt(cleanInput)
      case "positiveSpark":
        return this.createPositiveSparkPrompt(cleanInput)
      default:
        return this.createDefaultPrompt(cleanInput)
    }
  },

  /**
   * Sanitize user input to prevent prompt injection or malformed requests
   * @param input Raw user input
   * @returns Sanitized input
   */
  sanitizeInput(input: string): string {
    // Handle empty input
    if (!input || input.trim() === "") {
      return "No entry provided"
    }

    // Remove any special characters that might interfere with the prompt
    let sanitized = input.trim()

    // Escape double quotes to prevent breaking the JSON
    sanitized = sanitized.replace(/"/g, '\\"')

    // Limit length to prevent token overflow
    if (sanitized.length > 500) {
      sanitized = sanitized.substring(0, 500) + "..."
    }

    return sanitized
  },

  /**
   * Create a prompt for priority entry reflections
   * @param input The user's priority entry
   * @returns A prompt for Gemini
   */
  createPriorityUpgradePrompt(input: string): string {
    return `As a thoughtful, mindful guide, generate a short, two-sentence reflection on this person's stated priority for today.
            Make it insightful, warm, and gently affirming.
            First sentence should reflect on what this says about their values.
            Second sentence should mention inner strength or wisdom.
            Keep it under 160 characters total.
            
            Priority: "${input}"
            
            Note: Reflect with depth but without being preachy or using spiritual clichés. 
            Focus on emotional intelligence and genuine insight.
            Return just the reflection without any additional text or explanation.`
  },

  /**
   * Create a prompt for priority follow-up questions
   * @param input The user's priority entry
   * @returns A prompt for Gemini
   */
  createPrioritySparkPrompt(input: string): string {
    return `As a mindful guide, generate a single thoughtful, open-ended follow-up question about this person's priority.
            Make it slightly poetic, inviting deeper reflection.
            Use a subtle metaphor if it feels natural.
            Keep it under 80 characters.
            
            Priority: "${input}"
            
            Note: The question should gently encourage the person to gain new insight about their priority.
            Avoid spiritual clichés or sounding like a life coach.
            Return only the question without any explanation or additional text.`
  },

  /**
   * Create a prompt for worry entry reflections
   * @param input The user's worry entry
   * @returns A prompt for Gemini
   */
  createWorryUpgradePrompt(input: string): string {
    return `As a thoughtful, mindful guide, generate a short, two-sentence reflection on this person's worry.
            Make it insightful and gently encouraging without dismissing their concern.
            First sentence should acknowledge their self-awareness.
            Second sentence should reframe the worry as a form of wisdom or care.
            Keep it under 160 characters total.
            
            Worry: "${input}"
            
            Note: Be genuine and emotionally intelligent without being dismissive or using spiritual platitudes.
            Return just the reflection without any additional text or explanation.`
  },

  /**
   * Create a prompt for worry follow-up questions
   * @param input The user's worry entry
   * @returns A prompt for Gemini
   */
  createWorrySparkPrompt(input: string): string {
    return `As a mindful guide, generate a single thoughtful, open-ended follow-up question about this person's worry.
            Make it slightly poetic, using a gentle metaphor if possible.
            The question should invite them to gain insight from the worry.
            Keep it under 80 characters.
            
            Worry: "${input}"
            
            Note: The question should suggest that the worry itself might contain wisdom.
            Avoid spiritual clichés or sounding like a life coach.
            Return only the question without any explanation or additional text.`
  },

  /**
   * Create a prompt for positive action entry reflections
   * @param input The user's positive action entry
   * @returns A prompt for Gemini
   */
  createPositiveUpgradePrompt(input: string): string {
    return `As a thoughtful, mindful guide, generate a short, two-sentence reflection on this person's positive action.
            Make it insightful and affirming, connecting this small action to deeper meaning.
            First sentence should connect the action to a universal value.
            Second sentence should emphasize its meaningful impact.
            Keep it under 160 characters total.
            
            Positive Action: "${input}"
            
            Note: Be genuine and emotionally intelligent without using spiritual platitudes.
            The tone should be warm, grounded, and insightful rather than overly enthusiastic.
            Return just the reflection without any additional text or explanation.`
  },

  /**
   * Create a prompt for positive action follow-up questions
   * @param input The user's positive action entry
   * @returns A prompt for Gemini
   */
  createPositiveSparkPrompt(input: string): string {
    return `As a mindful guide, generate a single thoughtful, open-ended follow-up question about this person's positive action.
            Make it slightly poetic, using a gentle metaphor if possible.
            The question should invite them to think about incorporating this into their life.
            Keep it under 80 characters.
            
            Positive Action: "${input}"
            
            Note: The question should invite them to reflect on the deeper significance of this action.
            Avoid spiritual clichés or sounding like a life coach.
            Return only the question without any explanation or additional text.`
  },

  /**
   * Create a default prompt if the type is not recognized
   * @param input The user's entry
   * @returns A generic prompt for Gemini
   */
  createDefaultPrompt(input: string): string {
    return `As a thoughtful, mindful guide, provide a brief, insightful reflection on the following entry.
            Make it warm, authentic, and gently affirming without using spiritual clichés.
            Keep it under 160 characters total.
            
            Entry: "${input}"
            
            Return just the reflection without any additional text or explanation.`
  },
}

export default promptGenerator

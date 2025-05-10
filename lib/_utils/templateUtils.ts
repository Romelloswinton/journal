// lib/templateUtils.ts
import { JournalTemplate } from "@/data/journalTemplatesData"
import { Journal } from "@/app/store/libraryStore"

/**
 * Converts a Journal object to a JournalTemplate
 * Provides fallback values for required properties while preserving as much data as possible
 */
export function journalToTemplate(journal: Journal): JournalTemplate {
  // Determine category based on any available information
  let category: "SITUATIONAL" | "DAILY" | "FRAMEWORKS" = "DAILY"

  // If journal has a category property that matches one of our categories, use it
  if (
    "category" in journal &&
    typeof journal.category === "string" &&
    ["SITUATIONAL", "DAILY", "FRAMEWORKS"].includes(journal.category)
  ) {
    category = journal.category as "SITUATIONAL" | "DAILY" | "FRAMEWORKS"
  }

  // Create description based on title if no description available
  const description =
    "description" in journal && typeof journal.description === "string"
      ? journal.description
      : `Journal template for ${journal.title}`

  // Generate default prompts if none available
  const prompts =
    "prompts" in journal &&
    Array.isArray(journal.prompts) &&
    journal.prompts.length > 0
      ? journal.prompts
      : [
          `Write your thoughts about ${journal.title}...`,
          "What are you feeling right now?",
          "What insights or reflections would you like to record?",
        ]

  // Create the base template object
  const template: Partial<JournalTemplate> = {
    id: journal.id,
    title: journal.title,
    author: journal.author,
    category,
    description,
    prompts,
    emoji:
      "emoji" in journal && typeof journal.emoji === "string"
        ? journal.emoji
        : "🖋️",
  }

  // Conditionally add image if it exists
  if (journal.image && typeof journal.image === "string") {
    template.image = journal.image
  }

  // Conditionally add steps if they exist
  if ("steps" in journal && Array.isArray(journal.steps)) {
    template.steps = journal.steps
  }

  // Conditionally add structure if it exists
  if (
    "structure" in journal &&
    typeof journal.structure === "object" &&
    journal.structure !== null
  ) {
    template.structure = journal.structure as any // Type assertion here since we can't fully validate the structure
  }

  // Return as complete JournalTemplate
  return template as JournalTemplate
}

import { create } from "zustand"

// Add this type to your onboardingStore.ts file
export type RelationshipStatus =
  | "single"
  | "in-relationship"
  | "married"
  | "divorced"
  | "widowed"
  | "prefer-not-to-say"
  | null

// Define relationship options with emoji and labels
export const relationshipOptions = [
  { value: "single", label: "Single", emoji: "🧑" },
  { value: "in-relationship", label: "In a relationship", emoji: "💑" },
  { value: "married", label: "Married", emoji: "💍" },
  { value: "divorced", label: "Divorced", emoji: "📄" },
  { value: "widowed", label: "Widowed", emoji: "🕊️" },
  { value: "prefer-not-to-say", label: "Prefer not to say", emoji: "🔒" },
]

// Helper function to get displayed text for a relationship status
export const getRelationshipText = (status: RelationshipStatus): string => {
  switch (status) {
    case "single":
      return "single"
    case "in-relationship":
      return "in a relationship"
    case "married":
      return "married"
    case "divorced":
      return "divorced"
    case "widowed":
      return "widowed"
    case "prefer-not-to-say":
      return "preferred not to specify relationship status"
    default:
      return "unspecified relationship status"
  }
}

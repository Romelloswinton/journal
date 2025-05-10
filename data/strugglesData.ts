import { create } from "zustand"

// Add this type to your onboardingStore.ts file
export type Struggle =
  | "depression"
  | "anxiety"
  | "adhd"
  | "burnout"
  | "sleep-issues"
  | "other"
  | "prefer-not-to-say"
  | null

// Define struggle options with emoji and labels
export const struggleOptions = [
  { value: "depression", label: "Depression", emoji: "😞" },
  { value: "anxiety", label: "Anxiety", emoji: "😰" },
  { value: "adhd", label: "ADHD", emoji: "🧠" },
  { value: "burnout", label: "Burnout", emoji: "🔥" },
  { value: "sleep-issues", label: "Sleep issues", emoji: "😴" },
  { value: "other", label: "Other", emoji: "❓" },
  { value: "prefer-not-to-say", label: "Prefer not to say", emoji: "🚫" },
]

// Helper function to get displayed text for a struggle
export const getStruggleText = (struggle: Struggle): string => {
  switch (struggle) {
    case "depression":
      return "depression"
    case "anxiety":
      return "anxiety"
    case "adhd":
      return "ADHD"
    case "burnout":
      return "burnout"
    case "sleep-issues":
      return "sleep issues"
    case "other":
      return "other challenges"
    case "prefer-not-to-say":
      return "preferred not to specify challenges"
    default:
      return "unspecified challenges"
  }
}

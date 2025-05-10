import { create } from "zustand"

// Add this type to your onboardingStore.ts file
export type JournalTime =
  | "morning"
  | "afternoon"
  | "evening"
  | "no-preference"
  | null

// Define journal time options with emoji and labels
export const journalTimeOptions = [
  { value: "morning", label: "Morning", emoji: "🌅" },
  { value: "afternoon", label: "Afternoon", emoji: "☀️" },
  { value: "evening", label: "Evening", emoji: "🌙" },
  { value: "no-preference", label: "No preference", emoji: "🕒" },
]

// Helper function to get displayed text for a journal time
export const getJournalTimeText = (time: JournalTime): string => {
  switch (time) {
    case "morning":
      return "morning"
    case "afternoon":
      return "afternoon"
    case "evening":
      return "evening"
    case "no-preference":
      return "no specific time preference"
    default:
      return "unspecified time"
  }
}

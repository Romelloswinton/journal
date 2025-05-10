import { create } from "zustand"

// Add this type to your onboardingStore.ts file
export type FaithOrientation =
  | "buddhist"
  | "christian"
  | "hindu"
  | "jewish"
  | "muslim"
  | "spiritual-not-religious"
  | "atheist"
  | "agnostic"
  | "prefer-not-to-say"
  | null

// Define faith options with emoji and labels
export const faithOptions = [
  { value: "buddhist", label: "Buddhist", emoji: "🧘‍♂️" },
  { value: "christian", label: "Christian", emoji: "✝️" },
  { value: "hindu", label: "Hindu", emoji: "🕉️" },
  { value: "jewish", label: "Jewish", emoji: "✡️" },
  { value: "muslim", label: "Muslim", emoji: "☪️" },
  {
    value: "spiritual-not-religious",
    label: "Spiritual, but not religious",
    emoji: "🌟",
  },
  { value: "atheist", label: "Atheist", emoji: "🔭" },
  { value: "agnostic", label: "Agnostic", emoji: "🤔" },
  { value: "prefer-not-to-say", label: "Prefer not to say", emoji: "🔒" },
]

// Helper function to get displayed text for a faith orientation
export const getFaithText = (faith: FaithOrientation): string => {
  switch (faith) {
    case "buddhist":
      return "Buddhist"
    case "christian":
      return "Christian"
    case "hindu":
      return "Hindu"
    case "jewish":
      return "Jewish"
    case "muslim":
      return "Muslim"
    case "spiritual-not-religious":
      return "spiritual but not religious"
    case "atheist":
      return "Atheist"
    case "agnostic":
      return "Agnostic"
    case "prefer-not-to-say":
      return "preferred not to specify spiritual orientation"
    default:
      return "unspecified spiritual orientation"
  }
}

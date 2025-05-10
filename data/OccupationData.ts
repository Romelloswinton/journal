import { Occupation } from "@/app/store/onboardingStore"

// Define interface for occupation data
interface OccupationData {
  value: Occupation
  label: string
  description?: string
}

// Export the occupation options with their metadata
export const occupationOptions: OccupationData[] = [
  {
    value: "student",
    label: "Student",
    description:
      "Currently enrolled in school, college, or other educational programs",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Employed in a professional field or industry",
  },
  {
    value: "homemaker",
    label: "Homemaker",
    description: "Managing household and family care responsibilities",
  },
  {
    value: "retired",
    label: "Retired",
    description: "Retired from professional employment",
  },
  {
    value: "unemployed",
    label: "Unemployed",
    description: "Currently not employed but seeking work",
  },
  {
    value: "other",
    label: "Other",
    description: "Your occupation doesn't fit in the above categories",
  },
  {
    value: "prefer-not-to-say",
    label: "Prefer not to say",
    description: "You'd rather not share this information",
  },
]

// Helper function to get occupation by value
export const getOccupationByValue = (
  value: Occupation
): OccupationData | undefined => {
  return occupationOptions.find((option) => option.value === value)
}

// Helper function to get displayed text for an occupation
export const getOccupationText = (occupation: Occupation): string => {
  switch (occupation) {
    case "student":
      return "student"
    case "professional":
      return "professional"
    case "homemaker":
      return "homemaker"
    case "retired":
      return "retired"
    case "unemployed":
      return "unemployed"
    case "other":
      return "other occupation"
    case "prefer-not-to-say":
      return "preferred not to specify occupation"
    default:
      return "unspecified occupation"
  }
}

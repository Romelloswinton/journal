import { JournalGoal } from "@/app/store/onboardingStore"

// Define interface for category data
interface JournalCategory {
  id: JournalGoal
  emoji: string
  label: string
  description: string
  benefits: string[]
}

// Export the categories with their metadata
const journalCategories: JournalCategory[] = [
  {
    id: "goals",
    emoji: "🕰",
    label: "Set and achieve my goals",
    description:
      "Organize your thoughts and track progress toward your personal and professional aspirations.",
    benefits: [
      "Increased focus and clarity",
      "Better time management",
      "Accountability to yourself",
      "Visual progress tracking",
    ],
  },
  {
    id: "insights",
    emoji: "💡",
    label: "Unlock insights about myself",
    description:
      "Discover patterns in your thinking and behavior through regular self-reflection.",
    benefits: [
      "Greater self-awareness",
      "Identification of personal patterns",
      "More mindful decision-making",
      "Enhanced emotional intelligence",
    ],
  },
  {
    id: "emotions",
    emoji: "🌊",
    label: "Process my emotions",
    description:
      "Create a safe space to explore and understand your feelings with depth and compassion.",
    benefits: [
      "Emotional regulation",
      "Stress reduction",
      "Improved mental health",
      "Healthier relationships",
    ],
  },
  {
    id: "creativity",
    emoji: "🎨",
    label: "Spark my creativity",
    description:
      "Capture ideas, inspirations, and artistic expression through regular journaling practice.",
    benefits: [
      "Overcoming creative blocks",
      "Developing your unique voice",
      "Connecting diverse ideas",
      "Building a creative habit",
    ],
  },
  {
    id: "chronicle",
    emoji: "📔",
    label: "Chronicle my daily life",
    description:
      "Document your experiences, creating a meaningful record of your life's journey.",
    benefits: [
      "Preserving memories",
      "Appreciating daily moments",
      "Tracking personal growth",
      "Creating a life legacy",
    ],
  },
  {
    id: "other",
    emoji: "",
    label: "Something else",
    description:
      "Customize your own journaling practice based on your unique needs and interests.",
    benefits: [
      "Personalized experience",
      "Flexibility to evolve over time",
      "Combining multiple approaches",
      "Freedom to experiment",
    ],
  },
]

export default journalCategories

// Helper function to get a category by its ID
export const getCategoryById = (
  id: JournalGoal
): JournalCategory | undefined => {
  return journalCategories.find((category) => category.id === id)
}

// Helper function to get displayed text for a goal
export const getGoalText = (goal: JournalGoal): string => {
  switch (goal) {
    case "goals":
      return "setting and achieving goals"
    case "insights":
      return "unlocking insights about yourself"
    case "emotions":
      return "processing your emotions"
    case "creativity":
      return "sparking your creativity"
    case "chronicle":
      return "chronicling your daily life"
    case "other":
      return "your custom journaling practice"
    default:
      return "journaling"
  }
}

// Helper function to get a summary of multiple goals
export const getGoalsSummary = (goals: JournalGoal[]): string => {
  if (!goals || goals.length === 0) {
    return "journaling"
  }

  if (goals.length === 1) {
    return getGoalText(goals[0])
  }

  // Get the text for each goal
  const goalTexts = goals.map((goal) => {
    const text = getGoalText(goal)
    // Extract just the main part without "your" or "yourself"
    return text
      .replace("setting and achieving ", "")
      .replace("unlocking ", "")
      .replace("processing your ", "")
      .replace("sparking your ", "")
      .replace("chronicling your ", "")
      .replace("your ", "")
  })

  // Format the list with Oxford comma if needed
  if (goalTexts.length === 2) {
    return `${goalTexts[0]} and ${goalTexts[1]}`
  } else {
    const lastGoal = goalTexts.pop()
    return `${goalTexts.join(", ")}, and ${lastGoal}`
  }
}

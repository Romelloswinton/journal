// app/rosebud/_data/topicsData.ts
import {
  BarChart2,
  Heart,
  Brain,
  Target,
  TreePine,
  Users,
  Sparkles,
  Coffee,
  BookOpen,
  ListChecks,
  LucideIcon,
} from "lucide-react"

export interface TopicCategory {
  id: string
  name: string
  icon: LucideIcon
  description: string
  prompt: string
}

export interface TopicItem {
  id: string
  categoryId: string
  name: string
  prompt: string
  icon: LucideIcon
}

export const topicCategories: TopicCategory[] = [
  {
    id: "patterns",
    name: "Identify Patterns",
    icon: BarChart2,
    description:
      "Analyze recurring themes and patterns in your journal entries",
    prompt:
      "Based on my journal entries, what patterns or recurring themes do you notice in my thoughts, behaviors, or emotions?",
  },
  {
    id: "emotions",
    name: "Analyze Emotions",
    icon: Heart,
    description: "Explore emotional patterns and responses in your journaling",
    prompt:
      "What emotions appear most frequently in my journal entries, and how do they relate to different situations or topics I write about?",
  },
  {
    id: "growth",
    name: "Personal Growth",
    icon: Sparkles,
    description: "Gain insights about your personal development journey",
    prompt:
      "Based on my journal entries, in what areas do you see evidence of personal growth or transformation? Where might there be opportunities for further development?",
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    icon: Brain,
    description: "Explore your mindfulness and present-moment awareness",
    prompt:
      "Looking at my journal entries, how mindful or present do I seem in different situations? What patterns do you notice about when I'm most or least present?",
  },
  {
    id: "wellbeing",
    name: "Wellbeing Habits",
    icon: Coffee,
    description: "Analyze habits that contribute to your wellbeing",
    prompt:
      "Based on my journal entries, what habits or activities seem to contribute most to my wellbeing or happiness? Are there patterns around when I feel most energized or content?",
  },
]

export const topicItems: TopicItem[] = [
  // Pattern topics
  {
    id: "themes",
    categoryId: "patterns",
    name: "Recurring Themes",
    prompt:
      "What recurring themes or topics appear most frequently in my journal entries?",
    icon: BookOpen,
  },
  {
    id: "behaviors",
    categoryId: "patterns",
    name: "Behavior Patterns",
    prompt:
      "What behavioral patterns can you identify in my journal entries? Are there consistent ways I respond to certain situations?",
    icon: ListChecks,
  },
  {
    id: "growth-patterns",
    categoryId: "patterns",
    name: "Growth Patterns",
    prompt:
      "What patterns of personal growth or development can you identify in my journal entries?",
    icon: Sparkles,
  },

  // Emotion topics
  {
    id: "triggers",
    categoryId: "emotions",
    name: "Emotional Triggers",
    prompt:
      "What specific situations or people seem to trigger strong emotional responses in my journal?",
    icon: Target,
  },
  {
    id: "balance",
    categoryId: "emotions",
    name: "Emotional Balance",
    prompt:
      "How balanced are the positive and negative emotions in my journaling? What does this suggest about my emotional well-being?",
    icon: BarChart2,
  },
  {
    id: "evolution",
    categoryId: "emotions",
    name: "Emotional Evolution",
    prompt:
      "How have my emotional responses to similar situations changed over time according to my journals?",
    icon: TreePine,
  },

  // Growth topics
  {
    id: "strengths",
    categoryId: "growth",
    name: "Personal Strengths",
    prompt:
      "Based on my journal entries, what strengths or positive qualities do you notice that I might not fully recognize?",
    icon: Target,
  },
  {
    id: "challenges",
    categoryId: "growth",
    name: "Growth Challenges",
    prompt:
      "What recurring challenges or obstacles to growth do you notice in my journal entries?",
    icon: TreePine,
  },
  {
    id: "progress",
    categoryId: "growth",
    name: "Progress Tracking",
    prompt:
      "Comparing my earlier and more recent journal entries, what signs of progress or development can you identify?",
    icon: Sparkles,
  },

  // Mindfulness topics
  {
    id: "awareness",
    categoryId: "mindfulness",
    name: "Present Awareness",
    prompt:
      "In which situations or contexts do my journal entries show the greatest level of present-moment awareness?",
    icon: Brain,
  },
  {
    id: "mindful-patterns",
    categoryId: "mindfulness",
    name: "Mindfulness Patterns",
    prompt:
      "What patterns do you notice about my level of mindfulness in different situations or with different people?",
    icon: Heart,
  },
  {
    id: "mindful-practice",
    categoryId: "mindfulness",
    name: "Mindfulness Practice",
    prompt:
      "Based on my journal entries, how might I deepen my mindfulness practice in everyday life?",
    icon: Coffee,
  },

  // Wellbeing topics
  {
    id: "energy",
    categoryId: "wellbeing",
    name: "Energy Sources",
    prompt:
      "What activities or experiences seem to give me the most energy according to my journal entries?",
    icon: Coffee,
  },
  {
    id: "connections",
    categoryId: "wellbeing",
    name: "Meaningful Connections",
    prompt:
      "How do my relationships and social connections appear to influence my wellbeing based on my journaling?",
    icon: Users,
  },
  {
    id: "routines",
    categoryId: "wellbeing",
    name: "Effective Routines",
    prompt:
      "What daily routines or habits appear to support my wellbeing and happiness?",
    icon: ListChecks,
  },
]

// Helper function to get topics by category
export function getTopicsByCategory(categoryId: string): TopicItem[] {
  return topicItems.filter((item) => item.categoryId === categoryId)
}

// Helper function to get all category IDs
export function getAllCategoryIds(): string[] {
  return topicCategories.map((category) => category.id)
}

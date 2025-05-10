// lib/services/libraryService.ts
import {
  Journal,
  Prompt,
  SavedJournal,
  SavedPrompt,
} from "@/app/store/libraryStore"
import axios from "axios"

// Mock data for initial development - replace with API calls later
const mockSituationalJournals: Journal[] = [
  {
    id: "knowing-needs",
    title: "Knowing Your Needs",
    author: "with Emilee Crowder",
    image: "/images/library/knowing-needs.jpg",
    category: "Situational",
  },
  {
    id: "nervous-system",
    title: "Nervous System Rebalancing",
    author: "with Raelan Agle",
    image: "/images/library/nervous-system.jpg",
    category: "Situational",
  },
  {
    id: "communication",
    title: "Communication Breakdown",
    author: "with Jessica Hunt, LCSW",
    image: "/images/library/communication.jpg",
    category: "Situational",
  },
  {
    id: "conversation",
    title: "Conversation Prep",
    author: "by Rosebud",
    image: "/images/library/conversation-prep.png",
    category: "Situational",
  },
]

const mockDailyJournals: Journal[] = [
  {
    id: "gratitude",
    title: "Gratitude Journal",
    author: "by Rosebud",
    image: "/images/library/gratitude.png",
    category: "Daily",
  },
  {
    id: "weekly-relationship",
    title: "Weekly Relationship Check-in",
    author: "by Rosebud",
    image: "/images/library/relationship.png",
    category: "Daily",
  },
  {
    id: "dream",
    title: "Dream Journal",
    author: "by Rosebud",
    image: "/images/library/dream.png",
    category: "Daily",
  },
  {
    id: "morning",
    title: "Morning Intention",
    author: "by Rosebud",
    image: "/images/library/morning.png",
    category: "Daily",
  },
]

const mockFrameworkJournals: Journal[] = [
  {
    id: "trauma-informed",
    title: "Trauma-Informed Journaling",
    author: "by Rosebud",
    image: "/images/library/trauma.png",
    category: "Framework",
  },
  {
    id: "emotional-regulation",
    title: "Emotional Regulation",
    author: "with Dr. John Smith",
    image: "/images/library/emotional.jpg",
    category: "Framework",
  },
  {
    id: "cbt-journaling",
    title: "CBT Journaling Framework",
    author: "with Dr. Michael Johnson",
    image: "/images/library/cbt.jpg",
    category: "Framework",
  },
  {
    id: "self-compassion",
    title: "Self-Compassion Practice",
    author: "with Sarah Thompson",
    image: "/images/library/compassion.jpg",
    category: "Framework",
  },
]

const mockSavedJournals: SavedJournal[] = [
  {
    id: "gratitude",
    title: "Gratitude Journal",
    author: "by Rosebud",
    image: "/images/library/gratitude.png",
    lastUsed: "2 days ago",
    category: "Daily",
  },
  {
    id: "communication",
    title: "Communication Breakdown",
    author: "with Jessica Hunt, LCSW",
    image: "/images/library/communication.jpg",
    lastUsed: "1 week ago",
    category: "Situational",
  },
]

const mockPrompts: Prompt[] = [
  {
    id: "1",
    text: "What's something small you're proud of from today?",
    category: "Gratitude",
    isSaved: false,
  },
  {
    id: "2",
    text: "If your inner critic had a voice, what would it be saying right now? How can you respond with compassion?",
    category: "Self-Reflection",
    isSaved: true,
  },
  {
    id: "3",
    text: "Describe a moment this week when you truly felt like yourself.",
    category: "Mindfulness",
    isSaved: false,
  },
  {
    id: "4",
    text: "What's one boundary you'd like to set or strengthen in your life?",
    category: "Growth",
    isSaved: false,
  },
  {
    id: "5",
    text: "Write about a small act of kindness you witnessed or participated in recently.",
    category: "Gratitude",
    isSaved: true,
  },
  {
    id: "6",
    text: "What would your future self, 5 years from now, want to tell you today?",
    category: "Vision",
    isSaved: false,
  },
  {
    id: "7",
    text: "What's a pattern or habit you've noticed in yourself lately?",
    category: "Awareness",
    isSaved: false,
  },
  {
    id: "8",
    text: "Write about a challenge you're facing and three possible ways to approach it.",
    category: "Problem-solving",
    isSaved: false,
  },
  {
    id: "9",
    text: "What's something you need to forgive yourself for?",
    category: "Healing",
    isSaved: true,
  },
  {
    id: "10",
    text: "Describe your ideal morning routine. What elements could you realistically incorporate tomorrow?",
    category: "Planning",
    isSaved: false,
  },
]

const mockSavedPrompts: SavedPrompt[] = [
  {
    id: "2",
    text: "If your inner critic had a voice, what would it be saying right now? How can you respond with compassion?",
    category: "Self-Reflection",
    lastUsed: "Yesterday",
  },
  {
    id: "5",
    text: "Write about a small act of kindness you witnessed or participated in recently.",
    category: "Gratitude",
    lastUsed: "3 days ago",
  },
  {
    id: "9",
    text: "What's something you need to forgive yourself for?",
    category: "Healing",
    lastUsed: "1 week ago",
  },
]

// Library service class
class LibraryService {
  // Get all journals
  async getJournals() {
    // In a real app, this would be an API call
    // return await axios.get('/api/library/journals')

    // For now, return mock data
    return {
      situational: mockSituationalJournals,
      daily: mockDailyJournals,
      frameworks: mockFrameworkJournals,
      saved: mockSavedJournals,
    }
  }

  // Get all prompts
  async getPrompts() {
    // In a real app, this would be an API call
    // return await axios.get('/api/library/prompts')

    // For now, return mock data
    return {
      prompts: mockPrompts,
      saved: mockSavedPrompts,
    }
  }

  // Save a journal
  async saveJournal(journalId: string) {
    // For a real app, this would be an API call
    // return await axios.post('/api/library/journals/save', { journalId })

    // For now, just return success
    return { success: true }
  }

  // Save a prompt
  async savePrompt(promptId: string) {
    // For a real app, this would be an API call
    // return await axios.post('/api/library/prompts/save', { promptId })

    // For now, just return success
    return { success: true }
  }

  // Remove a saved journal
  async removeSavedJournal(journalId: string) {
    // For a real app, this would be an API call
    // return await axios.delete(`/api/library/journals/saved/${journalId}`)

    // For now, just return success
    return { success: true }
  }

  // Remove a saved prompt
  async removeSavedPrompt(promptId: string) {
    // For a real app, this would be an API call
    // return await axios.delete(`/api/library/prompts/saved/${promptId}`)

    // For now, just return success
    return { success: true }
  }

  // Submit a journal or prompt idea
  async submitIdea(idea: { type: "journal" | "prompt"; description: string }) {
    // For a real app, this would be an API call
    // return await axios.post('/api/library/ideas', idea)

    // For now, just return success
    return { success: true }
  }
}

// Export a singleton instance
export const libraryService = new LibraryService()

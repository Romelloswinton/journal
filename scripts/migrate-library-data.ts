// scripts/migrate-library-data.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Your existing mock data from libraryService
const mockSituationalJournals = [
  {
    id: "knowing-needs",
    title: "Knowing Your Needs",
    author: "with Emilee Crowder",
    image: "/images/library/knowing-needs.jpg",
    category: "Situational",
    description:
      "Learn to identify and communicate your personal needs effectively.",
    content: {
      prompts: [
        "What are three needs you have that often go unmet?",
        "How do you typically communicate your needs to others?",
        "What barriers prevent you from expressing your needs?",
        "When do you feel most comfortable asking for what you need?",
        "How has your understanding of your needs changed over time?",
      ],
      duration: "15-20 minutes",
      benefits: [
        "Better self-awareness",
        "Improved communication skills",
        "Stronger relationships",
      ],
    },
  },
  {
    id: "nervous-system",
    title: "Nervous System Rebalancing",
    author: "with Raelan Agle",
    image: "/images/library/nervous-system.jpg",
    category: "Situational",
    description: "Techniques for regulating your nervous system during stress.",
    content: {
      prompts: [
        "What physical sensations do you notice when stressed?",
        "What grounding techniques work best for you?",
        "How can you create more safety in your environment?",
        "What helps you feel calm and centered?",
        "How do you know when your nervous system needs attention?",
      ],
      duration: "10-15 minutes",
      benefits: [
        "Reduced stress and anxiety",
        "Better emotional regulation",
        "Improved physical well-being",
      ],
    },
  },
  {
    id: "communication",
    title: "Communication Breakdown",
    author: "with Jessica Hunt, LCSW",
    image: "/images/library/communication.jpg",
    category: "Situational",
    description:
      "Navigate difficult conversations and improve communication skills.",
    content: {
      prompts: [
        "Describe a recent communication challenge you faced.",
        "What emotions came up during this interaction?",
        "How could you approach this differently next time?",
        "What assumptions might have influenced the conversation?",
        "How can you create more understanding in your relationships?",
      ],
      duration: "20-25 minutes",
      benefits: [
        "Better conflict resolution",
        "Deeper relationships",
        "Increased empathy",
      ],
    },
  },
  {
    id: "conversation-prep",
    title: "Conversation Prep",
    author: "by Rosebud",
    image: "/images/library/conversation-prep.png",
    category: "Situational",
    description: "Prepare for important conversations with confidence.",
    content: {
      prompts: [
        "What is the main outcome you want from this conversation?",
        "What concerns do you have about this discussion?",
        "How can you stay calm and centered during the conversation?",
        "What do you want the other person to understand?",
        "How will you know if the conversation was successful?",
      ],
      duration: "15-20 minutes",
      benefits: [
        "Increased confidence",
        "Better preparation",
        "More successful outcomes",
      ],
    },
  },
]

const mockDailyJournals = [
  {
    id: "gratitude",
    title: "Gratitude Journal",
    author: "by Rosebud",
    image: "/images/library/gratitude.png",
    category: "Daily",
    description: "Daily practice of gratitude and appreciation.",
    content: {
      prompts: [
        "What are three things you are grateful for today?",
        "Who made a positive impact on your day?",
        "What small moment brought you joy today?",
        "What challenge today taught you something valuable?",
        "How can you express gratitude to someone important to you?",
      ],
      duration: "5-10 minutes",
      benefits: [
        "Improved mood",
        "Better perspective",
        "Increased life satisfaction",
      ],
    },
  },
  {
    id: "weekly-relationship",
    title: "Weekly Relationship Check-in",
    author: "by Rosebud",
    image: "/images/library/relationship.png",
    category: "Daily",
    description: "Weekly reflection on your relationships and connections.",
    content: {
      prompts: [
        "How did you show up in your relationships this week?",
        "What relationship needs attention or care?",
        "How can you be more present with loved ones?",
        "What appreciation do you want to express?",
        "How have your relationships grown this week?",
      ],
      duration: "15-20 minutes",
      benefits: [
        "Stronger relationships",
        "Better communication",
        "Increased connection",
      ],
    },
  },
  {
    id: "dream",
    title: "Dream Journal",
    author: "by Rosebud",
    image: "/images/library/dream.png",
    category: "Daily",
    description: "Record and explore your dreams and their meanings.",
    content: {
      prompts: [
        "Describe any dreams you remember from last night.",
        "What emotions did your dreams evoke?",
        "Are there any recurring themes in your dreams?",
        "What might your subconscious be processing?",
        "How do your dreams reflect your waking life?",
      ],
      duration: "10-15 minutes",
      benefits: [
        "Better dream recall",
        "Subconscious insights",
        "Personal understanding",
      ],
    },
  },
  {
    id: "morning-intention",
    title: "Morning Intention",
    author: "by Rosebud",
    image: "/images/library/morning.png",
    category: "Daily",
    description: "Set positive intentions for your day ahead.",
    content: {
      prompts: [
        "What intention do you want to set for today?",
        "How do you want to feel by the end of the day?",
        "What is one thing you can do today to care for yourself?",
        "What energy do you want to bring to your interactions?",
        "How will you stay connected to your intention throughout the day?",
      ],
      duration: "5-10 minutes",
      benefits: ["Purposeful days", "Better focus", "Increased mindfulness"],
    },
  },
]

const mockFrameworkJournals = [
  {
    id: "trauma-informed",
    title: "Trauma-Informed Journaling",
    author: "by Rosebud",
    image: "/images/library/trauma.png",
    category: "Framework",
    description: "Safe, gentle approach to processing difficult experiences.",
    content: {
      prompts: [
        "What feels safe and supportive in your life right now?",
        "How can you honor your pace of healing today?",
        "What does your body need right now?",
        "What boundaries would serve you well today?",
        "How can you show yourself compassion right now?",
      ],
      duration: "15-25 minutes",
      benefits: ["Safe processing", "Trauma healing", "Self-compassion"],
    },
  },
  {
    id: "emotional-regulation",
    title: "Emotional Regulation",
    author: "with Dr. John Smith",
    image: "/images/library/emotional.jpg",
    category: "Framework",
    description: "Learn skills for managing and understanding your emotions.",
    content: {
      prompts: [
        "What emotion am I experiencing right now?",
        "Where do I feel this emotion in my body?",
        "What healthy coping strategy can I use right now?",
        "What is this emotion trying to tell me?",
        "How can I respond to this emotion with kindness?",
      ],
      duration: "15-20 minutes",
      benefits: [
        "Better emotional awareness",
        "Improved coping skills",
        "Emotional stability",
      ],
    },
  },
  {
    id: "cbt-journaling",
    title: "CBT Journaling Framework",
    author: "with Dr. Michael Johnson",
    image: "/images/library/cbt.jpg",
    category: "Framework",
    description:
      "Cognitive Behavioral Therapy techniques for thought examination.",
    content: {
      prompts: [
        "What thoughts are going through my mind?",
        "What evidence supports or challenges these thoughts?",
        "What would I tell a friend in this situation?",
        "How might I reframe this thought more helpfully?",
        "What action can I take based on this new perspective?",
      ],
      duration: "20-25 minutes",
      benefits: [
        "Clearer thinking patterns",
        "Reduced negative thoughts",
        "Better problem-solving",
      ],
    },
  },
  {
    id: "self-compassion",
    title: "Self-Compassion Practice",
    author: "with Sarah Thompson",
    image: "/images/library/compassion.jpg",
    category: "Framework",
    description: "Cultivate kindness and understanding toward yourself.",
    content: {
      prompts: [
        "How can I be kind to myself in this moment?",
        "What would I say to comfort a good friend?",
        "How is this struggle part of the human experience?",
        "What do I need to forgive myself for?",
        "How can I treat myself with the same care I give others?",
      ],
      duration: "15-20 minutes",
      benefits: [
        "Increased self-kindness",
        "Reduced self-criticism",
        "Greater resilience",
      ],
    },
  },
]

// Your existing prompts data
const mockPrompts = [
  {
    id: "prompt-1",
    text: "What's something small you're proud of from today?",
    category: "Gratitude",
  },
  {
    id: "prompt-2",
    text: "If your inner critic had a voice, what would it be saying right now? How can you respond with compassion?",
    category: "Self-Reflection",
  },
  {
    id: "prompt-3",
    text: "Describe a moment this week when you truly felt like yourself.",
    category: "Mindfulness",
  },
  {
    id: "prompt-4",
    text: "What's one boundary you'd like to set or strengthen in your life?",
    category: "Growth",
  },
  {
    id: "prompt-5",
    text: "Write about a small act of kindness you witnessed or participated in recently.",
    category: "Gratitude",
  },
  {
    id: "prompt-6",
    text: "What would your future self, 5 years from now, want to tell you today?",
    category: "Vision",
  },
  {
    id: "prompt-7",
    text: "What's a pattern or habit you've noticed in yourself lately?",
    category: "Awareness",
  },
  {
    id: "prompt-8",
    text: "Write about a challenge you're facing and three possible ways to approach it.",
    category: "Problem-solving",
  },
  {
    id: "prompt-9",
    text: "What's something you need to forgive yourself for?",
    category: "Healing",
  },
  {
    id: "prompt-10",
    text: "Describe your ideal morning routine. What elements could you realistically incorporate tomorrow?",
    category: "Planning",
  },
]

async function migrateLibraryData() {
  console.log("🚀 Starting library data migration...")

  try {
    // Combine all journals
    const allJournals = [
      ...mockSituationalJournals,
      ...mockDailyJournals,
      ...mockFrameworkJournals,
    ]

    // Migrate journals
    console.log("📚 Migrating journals...")
    for (const journal of allJournals) {
      await prisma.libraryJournal.upsert({
        where: { id: journal.id },
        update: {
          title: journal.title,
          author: journal.author,
          image: journal.image,
          category: journal.category,
          description: journal.description,
          content: journal.content,
          isActive: true,
        },
        create: {
          id: journal.id,
          title: journal.title,
          author: journal.author,
          image: journal.image,
          category: journal.category,
          description: journal.description,
          content: journal.content,
          isActive: true,
        },
      })
      console.log(`✅ Migrated journal: ${journal.title}`)
    }

    // Migrate prompts
    console.log("💭 Migrating prompts...")
    for (const prompt of mockPrompts) {
      await prisma.libraryPrompt.upsert({
        where: { id: prompt.id },
        update: {
          text: prompt.text,
          category: prompt.category,
          isActive: true,
        },
        create: {
          id: prompt.id,
          text: prompt.text,
          category: prompt.category,
          isActive: true,
        },
      })
      console.log(`✅ Migrated prompt: ${prompt.text.substring(0, 50)}...`)
    }

    console.log("🎉 Migration completed successfully!")
    console.log(
      `📊 Migrated ${allJournals.length} journals and ${mockPrompts.length} prompts`
    )
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateLibraryData().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})

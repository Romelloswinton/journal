// prisma/seed-library.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding library data...")

  // Create library journals
  const journals = await Promise.all([
    // Situational Journals
    prisma.libraryJournal.upsert({
      where: { id: "knowing-needs" },
      update: {},
      create: {
        id: "knowing-needs",
        title: "Knowing Your Needs",
        author: "with Emilee Crowder",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Knowing+Your+Needs",
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
    }),
    prisma.libraryJournal.upsert({
      where: { id: "nervous-system" },
      update: {},
      create: {
        id: "nervous-system",
        title: "Nervous System Rebalancing",
        author: "with Raelan Agle",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Nervous+System",
        category: "Situational",
        description:
          "Techniques for regulating your nervous system during stress.",
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
    }),
    prisma.libraryJournal.upsert({
      where: { id: "communication" },
      update: {},
      create: {
        id: "communication",
        title: "Communication Breakdown",
        author: "with Jessica Hunt, LCSW",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Communication",
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
    }),
    prisma.libraryJournal.upsert({
      where: { id: "conversation-prep" },
      update: {},
      create: {
        id: "conversation-prep",
        title: "Conversation Prep",
        author: "by Rosebud",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Conversation+Prep",
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
    }),

    // Daily Journals
    prisma.libraryJournal.upsert({
      where: { id: "gratitude" },
      update: {},
      create: {
        id: "gratitude",
        title: "Gratitude Journal",
        author: "by Rosebud",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Gratitude",
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
    }),
    prisma.libraryJournal.upsert({
      where: { id: "weekly-relationship" },
      update: {},
      create: {
        id: "weekly-relationship",
        title: "Weekly Relationship Check-in",
        author: "by Rosebud",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Relationship",
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
    }),
    prisma.libraryJournal.upsert({
      where: { id: "dream" },
      update: {},
      create: {
        id: "dream",
        title: "Dream Journal",
        author: "by Rosebud",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Dream+Journal",
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
    }),
    prisma.libraryJournal.upsert({
      where: { id: "morning-intention" },
      update: {},
      create: {
        id: "morning-intention",
        title: "Morning Intention",
        author: "by Rosebud",
        image: "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Morning",
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
          benefits: [
            "Purposeful days",
            "Better focus",
            "Increased mindfulness",
          ],
        },
      },
    }),

    // Framework Journals
    prisma.libraryJournal.upsert({
      where: { id: "trauma-informed" },
      update: {},
      create: {
        id: "trauma-informed",
        title: "Trauma-Informed Journaling",
        author: "by Rosebud",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Trauma+Informed",
        category: "Framework",
        description:
          "Safe, gentle approach to processing difficult experiences.",
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
    }),
    prisma.libraryJournal.upsert({
      where: { id: "emotional-regulation" },
      update: {},
      create: {
        id: "emotional-regulation",
        title: "Emotional Regulation",
        author: "with Dr. John Smith",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Emotional+Regulation",
        category: "Framework",
        description:
          "Learn skills for managing and understanding your emotions.",
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
    }),
    prisma.libraryJournal.upsert({
      where: { id: "cbt-journaling" },
      update: {},
      create: {
        id: "cbt-journaling",
        title: "CBT Journaling Framework",
        author: "with Dr. Michael Johnson",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=CBT+Framework",
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
    }),
    prisma.libraryJournal.upsert({
      where: { id: "self-compassion" },
      update: {},
      create: {
        id: "self-compassion",
        title: "Self-Compassion Practice",
        author: "with Sarah Thompson",
        image:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Self+Compassion",
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
    }),
  ])

  // Create library prompts
  const prompts = await Promise.all([
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-1" },
      update: {},
      create: {
        id: "prompt-1",
        text: "What's something small you're proud of from today?",
        category: "Gratitude",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-2" },
      update: {},
      create: {
        id: "prompt-2",
        text: "If your inner critic had a voice, what would it be saying right now? How can you respond with compassion?",
        category: "Self-Reflection",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-3" },
      update: {},
      create: {
        id: "prompt-3",
        text: "Describe a moment this week when you truly felt like yourself.",
        category: "Mindfulness",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-4" },
      update: {},
      create: {
        id: "prompt-4",
        text: "What's one boundary you'd like to set or strengthen in your life?",
        category: "Growth",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-5" },
      update: {},
      create: {
        id: "prompt-5",
        text: "Write about a small act of kindness you witnessed or participated in recently.",
        category: "Gratitude",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-6" },
      update: {},
      create: {
        id: "prompt-6",
        text: "What would your future self, 5 years from now, want to tell you today?",
        category: "Vision",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-7" },
      update: {},
      create: {
        id: "prompt-7",
        text: "What's a pattern or habit you've noticed in yourself lately?",
        category: "Awareness",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-8" },
      update: {},
      create: {
        id: "prompt-8",
        text: "Write about a challenge you're facing and three possible ways to approach it.",
        category: "Problem-solving",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-9" },
      update: {},
      create: {
        id: "prompt-9",
        text: "What's something you need to forgive yourself for?",
        category: "Healing",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-10" },
      update: {},
      create: {
        id: "prompt-10",
        text: "Describe your ideal morning routine. What elements could you realistically incorporate tomorrow?",
        category: "Planning",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-11" },
      update: {},
      create: {
        id: "prompt-11",
        text: "What does success mean to you right now in your life?",
        category: "Vision",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-12" },
      update: {},
      create: {
        id: "prompt-12",
        text: "How do you want to be remembered by the people you love?",
        category: "Values",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-13" },
      update: {},
      create: {
        id: "prompt-13",
        text: "What energy are you bringing into your relationships today?",
        category: "Self-Reflection",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-14" },
      update: {},
      create: {
        id: "prompt-14",
        text: "Write about a time when you overcame something difficult. What strengths did you discover?",
        category: "Growth",
      },
    }),
    prisma.libraryPrompt.upsert({
      where: { id: "prompt-15" },
      update: {},
      create: {
        id: "prompt-15",
        text: "What does your body need from you today?",
        category: "Self-Care",
      },
    }),
  ])

  console.log(`✅ Created/updated ${journals.length} library journals`)
  console.log(`✅ Created/updated ${prompts.length} library prompts`)
  console.log("🎉 Library seeding completed!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("❌ Error during library seeding:", e)
    await prisma.$disconnect()
    process.exit(1)
  })

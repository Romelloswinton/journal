import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Starting seed operation...")

    // Create journal categories if they don't exist
    const categories = [
      {
        id: "personal-growth",
        label: "Personal Growth",
        description: "Track your journey of self-improvement and development.",
        emoji: "🌱",
        benefits: [
          "Identify patterns in your personal development",
          "Track progress toward your goals",
          "Reflect on life lessons and experiences",
        ],
      },
      {
        id: "mental-health",
        label: "Mental Health",
        description: "Monitor your emotional well-being and mental state.",
        emoji: "🧠",
        benefits: [
          "Recognize emotional patterns and triggers",
          "Track the effectiveness of coping strategies",
          "Document your mental health journey",
        ],
      },
      {
        id: "creative-expression",
        label: "Creative Expression",
        description: "Explore your imagination and artistic inspirations.",
        emoji: "🎨",
        benefits: [
          "Capture creative ideas before they fade",
          "Develop your unique creative voice",
          "Track the evolution of your creative projects",
        ],
      },
      {
        id: "reflection",
        label: "Reflection & Insight",
        description:
          "Deepen your understanding through thoughtful contemplation.",
        emoji: "🪞",
        benefits: [
          "Gain clarity through regular reflection",
          "Connect dots between experiences and insights",
          "Develop greater self-awareness",
        ],
      },
      {
        id: "gratitude",
        label: "Gratitude & Positivity",
        description:
          "Cultivate appreciation and positivity in your daily life.",
        emoji: "🙏",
        benefits: [
          "Train your mind to notice the positive",
          "Build resilience against negativity",
          "Create a record of life's meaningful moments",
        ],
      },
      {
        id: "productivity",
        label: "Productivity & Goals",
        description: "Organize your ambitions and track your progress.",
        emoji: "📈",
        benefits: [
          "Maintain focus on your priorities",
          "Document obstacles and solutions",
          "Celebrate achievements along the way",
        ],
      },
    ]

    // Upsert categories (update if exists, insert if not)
    for (const category of categories) {
      await prisma.journalCategory.upsert({
        where: { id: category.id },
        update: category,
        create: category,
      })
      console.log(`Upserted category: ${category.label}`)
    }

    console.log("Seed operation completed successfully!")
  } catch (error) {
    console.error("Error during seed operation:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

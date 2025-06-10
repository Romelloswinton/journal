// scripts/debug-library-data.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function debugLibraryData() {
  console.log("🔍 Debugging Library Data Flow...\n")

  try {
    // Check if journals exist in database
    const allJournals = await prisma.libraryJournal.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    console.log("📊 Database Status:")
    console.log(`Total journals in database: ${allJournals.length}`)

    if (allJournals.length === 0) {
      console.log("❌ No journals found in database!")
      console.log("💡 Solution: Run the migration script to populate data")
      console.log("   Command: npx tsx scripts/migrate-library-data.ts\n")
      return
    }

    // Categorize journals
    const situational = allJournals.filter((j) => j.category === "Situational")
    const daily = allJournals.filter((j) => j.category === "Daily")
    const framework = allJournals.filter((j) => j.category === "Framework")
    const active = allJournals.filter((j) => j.isActive)

    console.log("\n📋 Journal Breakdown:")
    console.log(`Situational: ${situational.length}`)
    console.log(`Daily: ${daily.length}`)
    console.log(`Framework: ${framework.length}`)
    console.log(`Active: ${active.length}`)
    console.log(`Inactive: ${allJournals.length - active.length}`)

    console.log("\n📚 Sample Journals:")
    allJournals.slice(0, 5).forEach((journal) => {
      console.log(
        `  - ${journal.title} (${journal.category}) ${
          journal.isActive ? "✅" : "❌"
        }`
      )
    })

    // Check prompts
    const allPrompts = await prisma.libraryPrompt.findMany({
      select: {
        id: true,
        text: true,
        category: true,
        isActive: true,
      },
    })

    console.log(`\n💭 Total prompts in database: ${allPrompts.length}`)

    // Test API response format
    console.log("\n🔗 Testing API Response Format:")
    const categorizedResponse = {
      situational: situational.map((j) => ({
        id: j.id,
        title: j.title,
        category: j.category,
      })),
      daily: daily.map((j) => ({
        id: j.id,
        title: j.title,
        category: j.category,
      })),
      frameworks: framework.map((j) => ({
        id: j.id,
        title: j.title,
        category: j.category,
      })),
      saved: [], // This would come from user's saved journals
    }

    console.log("API Response Preview:")
    console.log(JSON.stringify(categorizedResponse, null, 2))

    console.log("\n✅ Database appears to be properly populated!")
    console.log("🎯 Next steps:")
    console.log(
      "   1. Verify API endpoints are working: http://localhost:3000/api/library/journals"
    )
    console.log("   2. Check browser network tab for any 404s")
    console.log("   3. Ensure development server is running: npm run dev")
  } catch (error) {
    console.error("❌ Error debugging library data:", error)
    console.log("\n💡 Common solutions:")
    console.log("   1. Check database connection (DATABASE_URL in .env)")
    console.log("   2. Run: npx prisma generate")
    console.log("   3. Run: npx prisma db push")
    console.log("   4. Run migration: npx tsx scripts/migrate-library-data.ts")
  } finally {
    await prisma.$disconnect()
  }
}

// Run the debug script
debugLibraryData().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})

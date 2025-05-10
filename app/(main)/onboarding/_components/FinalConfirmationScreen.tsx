"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import useOnboardingStore, { JournalTime } from "@/app/store/onboardingStore"

export default function FinalConfirmationScreen() {
  const router = useRouter()
  const { selectedJournalTime } = useOnboardingStore()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Show confetti animation after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Get journal time display text
  const getJournalTimeDisplay = (time: JournalTime | null) => {
    if (!time) return null

    switch (time) {
      case "morning":
        return "🌅 Mornings"
      case "afternoon":
        return "☀️ Afternoons"
      case "evening":
        return "🌙 Evenings"
      case "no-preference":
        return "🕒 Flexible timing"
      default:
        return null
    }
  }

  const journalTimeDisplay = getJournalTimeDisplay(selectedJournalTime)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  // Confetti animation
  const confettiVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200,
      },
    },
  }

  const handleContinue = () => {
    // Route to the first journal entry page
    router.push("/journal/new")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="w-full p-6 rounded-xl bg-white shadow-md">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-sm font-semibold text-gray-800">
                🎉 Personalization complete!
              </h1>
              <button
                onClick={handleContinue}
                className="text-sm text-muted-foreground underline"
              >
                Skip
              </button>
            </div>

            {/* Progress indicator bar */}
            <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-400 mb-4"></div>

            {/* User's final selection */}
            {journalTimeDisplay && (
              <motion.div
                variants={itemVariants}
                className="text-sm text-gray-600 mb-3"
              >
                {journalTimeDisplay}
              </motion.div>
            )}

            {/* Confetti celebration */}
            {showConfetti && (
              <motion.div
                className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-4xl"
                variants={confettiVariants}
                initial="hidden"
                animate="visible"
              >
                🎊
              </motion.div>
            )}

            {/* Confirmation message */}
            <motion.div variants={itemVariants} className="space-y-3 mb-6">
              <p className="text-blue-700 font-medium">
                🎉 Awesome! Now, let's complete your first entry.
              </p>
              <p className="text-sm text-gray-600">
                Everything you write is private and only visible to you.
              </p>
              <p className="text-sm text-blue-700">
                As you write, Rosebud can ask questions to help dig deeper into
                your experience.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <Button
                className="w-full bg-pink-600 text-white hover:bg-pink-700 transition py-6 text-lg font-medium"
                onClick={handleContinue}
              >
                Let's go!
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

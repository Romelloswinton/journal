"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import journalCategories from "@/data/journalCategories"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs" // Changed from useSession to useAuth
import { OptionButton } from "@/components/ui/OptionButton"
import { ContinueButton } from "@/components/ui/ContinueButton"
import useOnboardingStore from "@/app/store/onboardingStore"

export default function JournalGoalScreen() {
  const { isLoaded, isSignedIn, userId } = useAuth() // Changed from useSession to useAuth

  // Get state and actions from Zustand store
  const {
    selectedGoal,
    handleSelectGoal,
    skipCurrentStep,
    navigateToNextStep,
  } = useOnboardingStore()

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localSelectedGoal, setLocalSelectedGoal] = useState<string | null>(
    null
  )
  const [saveError, setSaveError] = useState<string | null>(null)

  // Initialize local state from store when component mounts
  useEffect(() => {
    if (selectedGoal) {
      setLocalSelectedGoal(selectedGoal)
    }
  }, [selectedGoal])

  const onSelectGoal = (goalId: string) => {
    setLocalSelectedGoal(goalId)
    setSaveError(null)
    handleSelectGoal(goalId as any)
  }

  const onSkip = () => {
    skipCurrentStep(router)
  }

  const handleNext = async () => {
    if (!localSelectedGoal) {
      // If no goal selected, show error message
      setSaveError("Please select a journaling goal before continuing")
      return
    }

    setIsSubmitting(true)
    setSaveError(null)

    try {
      // If we're authenticated, prefetch the category from the database
      if (isSignedIn) {
        // Changed from status === "authenticated" to isSignedIn
        const response = await fetch(`/api/categories/${localSelectedGoal}`)

        if (!response.ok) {
          console.warn(
            `Category ${localSelectedGoal} not found in database, will be created later`
          )
        }
      }

      // Save goal and navigate
      handleSelectGoal(localSelectedGoal as any)

      // Add a small delay for the animation to complete before proceeding
      setTimeout(() => {
        navigateToNextStep(router)
        setIsSubmitting(false)
      }, 500)
    } catch (error) {
      console.error("Error saving goal selection:", error)
      setSaveError("Failed to save your goal selection. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const promptVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.2 } },
  }

  const optionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: 0.3 + custom * 0.1,
      },
    }),
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#faf9f7] p-4 sm:p-6">
      <motion.div
        key="journal-goal-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-lg"
      >
        <Card className="w-full rounded-xl shadow-md overflow-hidden">
          <CardContent className="p-6 md:p-8">
            {/* Header Row */}
            <motion.div
              className="flex items-center justify-between"
              variants={headerVariants}
            >
              <div className="flex items-center">
                <motion.span
                  className="mr-2"
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  🌹
                </motion.span>
                <span className="font-semibold">Welcome to Rosebud!</span>
              </div>
              <button
                onClick={onSkip}
                className="text-sm text-muted-foreground underline cursor-pointer hover:text-blue-500 transition-colors"
              >
                Skip
              </button>
            </motion.div>

            {/* Main Prompt */}
            <motion.div className="mt-4 text-center" variants={promptVariants}>
              <p className="text-sm md:text-base text-blue-700 font-medium leading-snug">
                Our mission is to guide you to a more fulfilling life through
                self-reflection.
                <br />
                What is your primary goal for journaling?
              </p>
            </motion.div>

            {/* Options Section */}
            <div className="mt-6 space-y-3">
              {journalCategories.map((option, index) => (
                <motion.div
                  key={option.id}
                  custom={index}
                  variants={optionVariants}
                >
                  <OptionButton
                    label={option.label}
                    emoji={option.emoji}
                    isSelected={localSelectedGoal === option.id}
                    onClick={() => onSelectGoal(option.id as string)}
                    className={
                      localSelectedGoal === option.id ? "font-medium" : ""
                    }
                  />
                </motion.div>
              ))}
            </div>

            {/* Error message */}
            {saveError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-red-600 text-sm"
              >
                {saveError}
              </motion.div>
            )}

            {/* Next Button */}
            <ContinueButton
              onClick={handleNext}
              isSubmitting={isSubmitting}
              label={!localSelectedGoal ? "Select a goal" : "Continue"}
              className="py-6 mt-8"
              disabled={!localSelectedGoal}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

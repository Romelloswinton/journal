// app/onboarding/age-selection/page.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import useOnboardingStore, { AgeGroup } from "@/app/store/onboardingStore"
import { getCategoryById } from "@/data/journalCategories"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { OptionButton } from "@/components/ui/OptionButton"
import { ContinueButton } from "@/components/ui/ContinueButton"

export default function AgeSelectionScreen() {
  // Use Clerk's useAuth hook
  const { isLoaded, isSignedIn, userId } = useAuth()

  // Get state and actions from Zustand store
  const {
    selectedGoal,
    selectedAge,
    handleSelectAge,
    skipCurrentStep,
    navigateToPreviousStep,
  } = useOnboardingStore()

  const router = useRouter()

  // Local state for selected age group and loading state
  const [localSelectedAge, setLocalSelectedAge] = useState<AgeGroup | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Initialize local state from store when component mounts
  useEffect(() => {
    if (selectedAge) {
      setLocalSelectedAge(selectedAge)
    }
  }, [selectedAge])

  // Get category info for the previously selected goal
  const goalCategory = selectedGoal ? getCategoryById(selectedGoal) : null

  const onSelectAge = (age: AgeGroup) => {
    // Just update local state, don't navigate yet
    setLocalSelectedAge(age)
    setSaveError(null)
  }

  // Separate handler for the continue button
  const handleContinue = async () => {
    if (!localSelectedAge) return

    setIsSubmitting(true)
    setSaveError(null)

    try {
      // Save to onboarding store (will be persisted to DB when onboarding completes)
      handleSelectAge(localSelectedAge, router)

      // Navigate after successful save
      setTimeout(() => {
        setIsSubmitting(false)
      }, 600)
    } catch (error) {
      console.error("Error saving age selection:", error)
      setSaveError("Failed to save your selection. Please try again.")
      setIsSubmitting(false)
    }
  }

  const onSkip = () => {
    skipCurrentStep(router)
  }

  const onBack = () => {
    navigateToPreviousStep(router)
  }

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
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.5 },
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

  const ageOptions: { value: AgeGroup; label: string }[] = [
    { value: "under-18", label: "Under 18" },
    { value: "18-24", label: "18–24" },
    { value: "25-34", label: "25–34" },
    { value: "35-44", label: "35–44" },
    { value: "45-54", label: "45–54" },
    { value: "55-plus", label: "55+" },
  ]

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md"
      >
        <Card className="w-full rounded-xl shadow-md bg-white overflow-hidden">
          {/* Pink gradient bar at the top */}
          <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-400" />

          <CardContent className="p-6 md:p-8">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-sm">
                Personalize your journal
              </h2>
              <button
                onClick={onSkip}
                className="text-sm text-muted-foreground underline cursor-pointer"
              >
                Skip
              </button>
            </div>

            {/* Step Indicator */}
            <motion.div
              variants={itemVariants}
              className="w-full h-1 bg-gray-100 rounded-full mb-6"
            >
              <div className="h-full w-1/2 bg-blue-500 rounded-full"></div>
            </motion.div>

            {/* Selected Goal Preview */}
            {goalCategory && (
              <motion.div
                variants={itemVariants}
                className="bg-muted text-sm px-3 py-1 rounded-full text-muted-foreground my-2 inline-flex items-center"
              >
                <span className="mr-1">{goalCategory.emoji}</span>
                <span>{goalCategory.label}</span>
              </motion.div>
            )}

            {/* Main Prompt */}
            <motion.div variants={itemVariants} className="mt-4 mb-6">
              <p className="text-blue-700 font-medium">
                Great! Now, let's tailor fit Rosebud to you.
              </p>
              <p className="mt-2 text-gray-700">
                🧸 How many years young are you?
              </p>
            </motion.div>

            {/* Age Options */}
            <motion.div variants={itemVariants} className="space-y-3">
              {ageOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  variants={itemVariants}
                  custom={index}
                >
                  <OptionButton
                    label={option.label}
                    isSelected={localSelectedAge === option.value}
                    onClick={() => onSelectAge(option.value)}
                  />
                </motion.div>
              ))}
            </motion.div>

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

            {/* Continue Button - Only shown when an option is selected */}
            {localSelectedAge && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <ContinueButton
                  onClick={handleContinue}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            )}

            {/* Playful Note */}
            <motion.p
              variants={itemVariants}
              className="text-xs text-gray-400 text-center mt-6"
            >
              Don't worry, this is just for us to personalize your experience!
              😊
            </motion.p>

            {/* Back button */}
            <motion.div variants={itemVariants} className="mt-6">
              <button
                className="text-sm border border-gray-200 rounded-md px-3 py-1 hover:bg-gray-50 transition"
                onClick={onBack}
              >
                ← Back
              </button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

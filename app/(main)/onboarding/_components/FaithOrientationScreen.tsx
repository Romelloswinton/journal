// app/onboarding/faith-orientation/page.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import useOnboardingStore, {
  FaithOrientation,
  RelationshipStatus,
} from "@/app/store/onboardingStore"
import { OptionButton } from "@/components/ui/OptionButton"
import { ContinueButton } from "@/components/ui/ContinueButton"
import { faithOptions } from "@/data/faithData"

export default function FaithOrientationScreen() {
  // Use Clerk's useAuth hook instead of useSession
  const { isLoaded, isSignedIn, userId } = useAuth()

  // Get state and actions from store
  const {
    selectedRelationship,
    selectedFaith,
    handleSelectFaith,
    skipCurrentStep,
    navigateToPreviousStep,
  } = useOnboardingStore()

  const router = useRouter()

  // Local state for selected faith and loading state
  const [localSelectedFaith, setLocalSelectedFaith] =
    useState<FaithOrientation>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Initialize local state from store when component mounts
  useEffect(() => {
    if (selectedFaith) {
      setLocalSelectedFaith(selectedFaith)
    }
  }, [selectedFaith])

  const onSelectFaith = (faith: FaithOrientation) => {
    setLocalSelectedFaith(faith)
    setSaveError(null)
  }

  const handleContinue = async () => {
    if (!localSelectedFaith) return

    setIsSubmitting(true)
    setSaveError(null)

    try {
      // Save to onboarding store (will be persisted to DB when onboarding completes)
      handleSelectFaith(localSelectedFaith, router)

      // Navigate after successful save
      setTimeout(() => {
        setIsSubmitting(false)
      }, 500)
    } catch (error) {
      console.error("Error saving faith selection:", error)
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

  // Get relationship display text
  const getRelationshipDisplay = (relationship: RelationshipStatus | null) => {
    if (!relationship) return null

    switch (relationship) {
      case "single":
        return "🧑 Single"
      case "in-relationship":
        return "💑 In a relationship"
      case "married":
        return "💍 Married"
      case "divorced":
        return "📄 Divorced"
      case "widowed":
        return "🕊️ Widowed"
      case "prefer-not-to-say":
        return null
      default:
        return null
    }
  }

  const relationshipDisplay = getRelationshipDisplay(selectedRelationship)

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

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md"
      >
        <div className="w-full rounded-xl shadow-md bg-white overflow-hidden">
          {/* Progress indicator bar at the top */}
          <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-400" />

          <div className="p-6 md:p-8">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-6">
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
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `98%` }}
              ></div>
            </motion.div>

            {/* Previous selection display */}
            {relationshipDisplay && (
              <motion.div
                variants={itemVariants}
                className="bg-muted text-sm px-3 py-1 rounded-full text-muted-foreground my-2 inline-flex items-center mb-4"
              >
                <span>{relationshipDisplay}</span>
              </motion.div>
            )}

            {/* Main Question */}
            <motion.h2
              variants={itemVariants}
              className="text-blue-700 font-medium mb-4"
            >
              What is your faith or spiritual orientation?
            </motion.h2>

            {/* Faith Options */}
            <motion.div variants={itemVariants} className="space-y-2">
              {faithOptions.map((option) => (
                <motion.div key={option.value} variants={itemVariants}>
                  <OptionButton
                    label={option.label}
                    emoji={option.emoji}
                    isSelected={localSelectedFaith === option.value}
                    onClick={() =>
                      onSelectFaith(option.value as FaithOrientation)
                    }
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
            {localSelectedFaith && (
              <ContinueButton
                onClick={handleContinue}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Accessibility note */}
            <motion.p
              variants={itemVariants}
              className="text-xs text-gray-400 text-center mt-6"
            >
              This information helps us personalize your experience
            </motion.p>

            {/* Back button */}
            <motion.div variants={itemVariants} className="mt-4">
              <button
                className="text-sm border border-gray-200 rounded-md px-3 py-1 hover:bg-gray-50 transition"
                onClick={onBack}
              >
                ← Back
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

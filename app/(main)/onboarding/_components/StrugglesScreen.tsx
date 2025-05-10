"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import useOnboardingStore, {
  Struggle,
  FaithOrientation,
} from "@/app/store/onboardingStore"
import { OptionButton } from "@/components/ui/OptionButton"
import { ContinueButton } from "@/components/ui/ContinueButton"
import { struggleOptions } from "@/data/strugglesData"

export default function StrugglesScreen() {
  // Get state and actions from store
  const {
    selectedFaith,
    handleSelectStruggle,
    skipCurrentStep,
    navigateToPreviousStep,
  } = useOnboardingStore()

  const router = useRouter()

  // Local state for selected struggle
  const [selectedStruggle, setSelectedStruggle] = useState<Struggle>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSelectStruggle = (struggle: Struggle) => {
    setSelectedStruggle(struggle)
  }

  const handleContinue = () => {
    if (!selectedStruggle) return

    setIsSubmitting(true)

    // Use a timeout to allow for animation before navigating
    setTimeout(() => {
      handleSelectStruggle(selectedStruggle, router)
      setIsSubmitting(false)
    }, 500)
  }

  const onSkip = () => {
    skipCurrentStep(router)
  }

  const onBack = () => {
    navigateToPreviousStep(router)
  }

  // Get faith display text
  const getFaithDisplay = (faith: FaithOrientation | null) => {
    if (!faith) return null

    switch (faith) {
      case "buddhist":
        return "🧘‍♂️ Buddhist"
      case "christian":
        return "✝️ Christian"
      case "hindu":
        return "🕉️ Hindu"
      case "jewish":
        return "✡️ Jewish"
      case "muslim":
        return "☪️ Muslim"
      case "spiritual-not-religious":
        return "🌟 Spiritual, but not religious"
      case "atheist":
        return "🔭 Atheist"
      case "agnostic":
        return "🤔 Agnostic"
      case "prefer-not-to-say":
        return null
      default:
        return null
    }
  }

  const faithDisplay = getFaithDisplay(selectedFaith)

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
                style={{ width: `99%` }}
              ></div>
            </motion.div>

            {/* Previous selection display */}
            {faithDisplay && (
              <motion.div
                variants={itemVariants}
                className="bg-muted text-sm px-3 py-1 rounded-full text-muted-foreground my-2 inline-flex items-center mb-4"
              >
                <span>{faithDisplay}</span>
              </motion.div>
            )}

            {/* Main Question */}
            <motion.h2
              variants={itemVariants}
              className="text-blue-700 font-medium mb-4"
            >
              Have you been struggling with any of the following?
            </motion.h2>

            {/* Struggle Options */}
            <motion.div variants={itemVariants} className="space-y-2">
              {struggleOptions.map((option) => (
                <motion.div key={option.value} variants={itemVariants}>
                  <OptionButton
                    label={option.label}
                    emoji={option.emoji}
                    isSelected={selectedStruggle === option.value}
                    onClick={() => onSelectStruggle(option.value as Struggle)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Continue Button - Only shown when an option is selected */}
            {selectedStruggle && (
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
              This information helps us tailor journal prompts to your needs
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

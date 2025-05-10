// app/onboarding/gender-selection/page.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import useOnboardingStore, { GenderIdentity } from "@/app/store/onboardingStore"
import { OptionButton } from "@/components/ui/OptionButton"
import { ContinueButton } from "@/components/ui/ContinueButton"
import { Card, CardContent } from "@/components/ui/card"

// Define gender options
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
]

export default function GenderSelectionScreen() {
  // Get state and actions from store
  const {
    selectedGender,
    handleSelectGender,
    skipCurrentStep,
    navigateToPreviousStep,
  } = useOnboardingStore()

  const router = useRouter()

  // Local state for selected gender
  const [localSelectedGender, setLocalSelectedGender] =
    useState<GenderIdentity>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize local state from store when component mounts
  useEffect(() => {
    if (selectedGender) {
      setLocalSelectedGender(selectedGender)
    }
  }, [selectedGender])

  const onSelectGender = (gender: GenderIdentity) => {
    // Just update local state without navigating
    setLocalSelectedGender(gender)
  }

  const handleContinue = () => {
    if (!localSelectedGender) return

    setIsSubmitting(true)

    // Use a timeout to allow for animation before navigating
    setTimeout(() => {
      handleSelectGender(localSelectedGender, router)
      setIsSubmitting(false)
    }, 500)
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
          {/* Progress indicator bar at the top */}
          <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-400" />

          <CardContent className="p-6 md:p-8">
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
                style={{ width: `75%` }}
              ></div>
            </motion.div>

            {/* Main Question */}
            <motion.h2
              variants={itemVariants}
              className="text-blue-700 font-medium mb-4"
            >
              How do you identify?
            </motion.h2>

            {/* Gender Options */}
            <motion.div variants={itemVariants} className="space-y-2">
              {genderOptions.map((option) => (
                <motion.div key={option.value} variants={itemVariants}>
                  <OptionButton
                    label={option.label}
                    isSelected={localSelectedGender === option.value}
                    onClick={() =>
                      onSelectGender(option.value as GenderIdentity)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Continue Button - Only shown when an option is selected */}
            {localSelectedGender && (
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

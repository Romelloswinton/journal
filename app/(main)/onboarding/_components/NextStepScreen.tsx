"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getGoalText, getCategoryById } from "@/data/journalCategories"
import useOnboardingStore from "@/app/store/onboardingStore"
import { useRouter } from "next/navigation"
import { ContinueButton } from "@/components/ui/ContinueButton"

export default function NextStepScreen() {
  const { selectedGoal, navigateToNextStep, navigateToPreviousStep } =
    useOnboardingStore()
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Get the display text for the selected goal
  const goalText = selectedGoal ? getGoalText(selectedGoal) : "journaling"
  const category = selectedGoal ? getCategoryById(selectedGoal) : null

  // Modified navigation function with transition effect
  const handleContinue = () => {
    setIsTransitioning(true)

    // Wait for exit animation to complete before navigating
    setTimeout(() => {
      navigateToNextStep(router)
    }, 500) // Match this with your exit animation duration
  }

  const handleBack = () => {
    navigateToPreviousStep(router)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#faf9f7] p-4 sm:p-6">
      <AnimatePresence mode="wait">
        {!isTransitioning ? (
          <motion.div
            key="confirmation-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <Card className="w-full rounded-xl shadow-md">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <span className="mr-2">🌟</span>
                  <span className="font-semibold">Perfect Choice!</span>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-blue-700 mb-3">
                    {selectedGoal
                      ? `We'll help you with ${goalText}`
                      : "We'll help you with your journaling practice"}
                  </h2>

                  {/* Display selected goal */}
                  {category && (
                    <div className="my-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                      <div className="flex items-center">
                        {category.emoji && (
                          <span className="mr-2 text-xl">{category.emoji}</span>
                        )}
                        <span className="font-medium text-blue-800">
                          {category.label}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 mt-2">
                        {category.description}
                      </p>

                      {/* Benefits list */}
                      <div className="mt-3">
                        <p className="text-xs text-blue-800 font-medium mb-1">
                          Benefits:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1 pl-4">
                          {category.benefits.map((benefit, index) => (
                            <li key={index} className="list-disc list-inside">
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-700">
                    Now, let's set up some preferences to customize your
                    experience.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* This would be where you'd put your next step form fields */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-gray-500 text-center italic">
                      Let's personalize your journaling experience further
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="mr-3"
                      onClick={handleBack}
                    >
                      Back
                    </Button>

                    <ContinueButton
                      onClick={handleContinue}
                      isSubmitting={isTransitioning}
                      className="w-auto px-6"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="transition-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

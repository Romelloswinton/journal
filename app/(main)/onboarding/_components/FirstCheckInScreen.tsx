"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Mic } from "lucide-react"
import useOnboardingStore from "@/app/store/onboardingStore"
import useSpeechRecognition from "@/hooks/useSpeechRecognition"

export default function FirstCheckInScreen() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Get current entries from store if they exist
  const {
    firstEntryPriority,
    firstEntryWorry,
    firstEntryPositive,
    saveFirstEntry,
    skipCurrentStep,
    navigateToPreviousStep,
  } = useOnboardingStore()

  // Initialize state with values from store
  const [priority, setPriority] = useState(firstEntryPriority || "")
  const [worry, setWorry] = useState(firstEntryWorry || "")
  const [positiveAction, setPositiveAction] = useState(firstEntryPositive || "")

  const [currentStep, setCurrentStep] = useState<
    "priority" | "worry" | "positive"
  >("priority")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeInput, setActiveInput] = useState<
    "priority" | "worry" | "positive"
  >("priority")

  // Initialize speech recognition hook
  const {
    isSupported: isSpeechSupported,
    isListening,
    error: speechError,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: "en-US",
    continuous: false,
    interimResults: true,
  })

  // Refs for auto-focusing
  const worryInputRef = useRef<HTMLTextAreaElement>(null)
  const positiveInputRef = useRef<HTMLTextAreaElement>(null)

  // Ensure component is mounted before rendering speech recognition features
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if we should start with a later step based on existing data
  useEffect(() => {
    if (priority && !currentStep) {
      if (worry) {
        if (positiveAction) {
          setCurrentStep("positive")
        } else {
          setCurrentStep("worry")
        }
      } else {
        setCurrentStep("priority")
      }
    }
  }, [priority, worry, positiveAction, currentStep])

  // Effect to update input when transcript changes
  useEffect(() => {
    if (transcript && activeInput) {
      // Update the appropriate input based on activeInput
      if (activeInput === "priority") {
        setPriority(transcript)
      } else if (activeInput === "worry") {
        setWorry(transcript)
      } else if (activeInput === "positive") {
        setPositiveAction(transcript)
      }
    }
  }, [transcript, activeInput])

  // Focus on the appropriate input when step changes
  useEffect(() => {
    if (currentStep === "worry" && worryInputRef.current) {
      setTimeout(() => {
        worryInputRef.current?.focus()
      }, 500)
    } else if (currentStep === "positive" && positiveInputRef.current) {
      setTimeout(() => {
        positiveInputRef.current?.focus()
      }, 500)
    }
  }, [currentStep])

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

  const fadeInVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  // Handle continue button for priority step
  const handleContinueToPart2 = () => {
    if (!priority.trim()) return

    setIsTransitioning(true)

    // Transition to the worry question with animation
    setTimeout(() => {
      setCurrentStep("worry")
      setIsTransitioning(false)
    }, 400)
  }

  // Handle continue button for worry step
  const handleContinueToPart3 = () => {
    if (!worry.trim()) return

    setIsTransitioning(true)

    // Transition to the positive action question with animation
    setTimeout(() => {
      setCurrentStep("positive")
      setIsTransitioning(false)
    }, 400)
  }

  // Handle final submission
  const handleFinalSubmit = () => {
    if (!priority.trim() || !worry.trim() || !positiveAction.trim()) return

    setIsSubmitting(true)

    // Use a timeout to allow for animation before navigating
    setTimeout(() => {
      // Save all three entries
      saveFirstEntry(priority, worry, positiveAction, router)

      // Navigate to the GeminiReflectionScreen using the correct route path
      // For Next.js App Router, the path should match your file structure
      router.push("/onboarding/gemini-reflection")

      setIsSubmitting(false)
    }, 800)
  }

  const onSkip = () => {
    skipCurrentStep(router)
  }

  const onBack = () => {
    if (currentStep === "positive") {
      // Go back to worry step
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep("worry")
        setIsTransitioning(false)
      }, 300)
    } else if (currentStep === "worry") {
      // Go back to priority step
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep("priority")
        setIsTransitioning(false)
      }, 300)
    } else {
      // Go back to previous screen
      navigateToPreviousStep(router)
    }
  }

  // Get time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Get progress percentage
  const getProgressPercentage = () => {
    if (currentStep === "positive") {
      return positiveAction.trim() ? "99%" : "80%"
    } else if (currentStep === "worry") {
      return worry.trim() ? "60%" : "40%"
    } else {
      return priority.trim() ? "20%" : "0%"
    }
  }

  // Toggle voice recording for the active input
  const toggleRecording = (inputType: "priority" | "worry" | "positive") => {
    setActiveInput(inputType)

    if (isListening) {
      stopListening()
    } else {
      // Reset transcript before starting new recording for this input
      resetTranscript()

      // Set initial transcript value based on the current input
      if (inputType === "priority") {
        resetTranscript()
        setPriority((prev) => prev)
      } else if (inputType === "worry") {
        resetTranscript()
        setWorry((prev) => prev)
      } else if (inputType === "positive") {
        resetTranscript()
        setPositiveAction((prev) => prev)
      }

      startListening()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted p-4">
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
                ✍️ First Check-in
              </h2>
              <div className="flex space-x-3 items-center">
                {/* Only show Back button in steps after priority */}
                {currentStep !== "priority" && (
                  <button
                    onClick={onBack}
                    className="text-sm text-muted-foreground underline cursor-pointer"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={onSkip}
                  className="text-sm text-muted-foreground underline cursor-pointer"
                >
                  Skip
                </button>
              </div>
            </div>

            {/* Step Indicator */}
            <motion.div
              variants={itemVariants}
              className="w-full h-1 bg-gray-100 rounded-full mb-6"
            >
              <div
                className="h-full bg-pink-500 rounded-full transition-all duration-500"
                style={{ width: getProgressPercentage() }}
              ></div>
            </motion.div>

            {/* Greeting */}
            <motion.div
              variants={itemVariants}
              className="mb-2 text-sm text-gray-500"
            >
              {getGreeting()}! Let's start your journaling journey.
            </motion.div>

            {/* Priority Question - always visible */}
            <motion.div
              variants={itemVariants}
              className={`mb-6 ${
                currentStep !== "priority" ? "opacity-50" : ""
              }`}
            >
              <h2 className="text-lg text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors">
                🪷 What's your highest priority today?
              </h2>
            </motion.div>

            {/* Priority Input area - always visible but disabled in later steps */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="relative">
                <Textarea
                  placeholder="Write..."
                  className={`min-h-[120px] resize-none p-4 text-base bg-gray-50 border-gray-200 focus:border-blue-300 rounded-lg ${
                    currentStep !== "priority" ? "opacity-75" : ""
                  }`}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={currentStep !== "priority"}
                />

                {/* Voice input button for priority - only in priority step */}
                {mounted && currentStep === "priority" && isSpeechSupported && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`absolute bottom-3 right-3 rounded-full p-2 ${
                      isListening && activeInput === "priority"
                        ? "bg-red-100 text-red-500"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={() => toggleRecording("priority")}
                    aria-label={
                      isListening && activeInput === "priority"
                        ? "Stop recording"
                        : "Start voice input"
                    }
                  >
                    <Mic
                      size={20}
                      className={
                        isListening && activeInput === "priority"
                          ? "animate-pulse"
                          : ""
                      }
                    />
                  </Button>
                )}

                {/* Recording error message */}
                {mounted && speechError && activeInput === "priority" && (
                  <div className="mt-2 text-xs text-red-500">{speechError}</div>
                )}
              </div>
            </motion.div>

            {/* Continue to Part 2 Button - Only shown in priority step when text is entered */}
            {currentStep === "priority" && priority.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 mb-8"
              >
                <Button
                  className="w-full relative overflow-hidden py-5 bg-blue-600 hover:bg-blue-700 text-white transition"
                  onClick={handleContinueToPart2}
                  disabled={isTransitioning}
                >
                  <span className="flex items-center justify-center">
                    Continue
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="ml-2"
                    >
                      →
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            )}

            {/* Worry Question - only visible in worry and positive steps */}
            {(currentStep === "worry" || currentStep === "positive") && (
              <motion.div
                variants={fadeInVariants}
                initial={currentStep === "worry" ? "hidden" : "visible"}
                animate="visible"
                className={`mt-8 ${
                  currentStep === "positive" ? "opacity-50" : ""
                }`}
              >
                <motion.div className="mb-6">
                  <h2 className="text-lg text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors">
                    🥀 Is there anything worrying you about the day ahead?
                  </h2>
                </motion.div>

                {/* Worry Input area */}
                <div className="relative">
                  <Textarea
                    ref={worryInputRef}
                    placeholder="Write..."
                    className={`min-h-[120px] resize-none p-4 text-base bg-gray-50 border-gray-200 focus:border-blue-300 rounded-lg ${
                      currentStep === "positive" ? "opacity-75" : ""
                    }`}
                    value={worry}
                    onChange={(e) => setWorry(e.target.value)}
                    disabled={currentStep === "positive"}
                  />

                  {/* Voice input button for worry - only in worry step */}
                  {mounted && currentStep === "worry" && isSpeechSupported && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`absolute bottom-3 right-3 rounded-full p-2 ${
                        isListening && activeInput === "worry"
                          ? "bg-red-100 text-red-500"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      onClick={() => toggleRecording("worry")}
                      aria-label={
                        isListening && activeInput === "worry"
                          ? "Stop recording"
                          : "Start voice input"
                      }
                    >
                      <Mic
                        size={20}
                        className={
                          isListening && activeInput === "worry"
                            ? "animate-pulse"
                            : ""
                        }
                      />
                    </Button>
                  )}

                  {/* Recording error message */}
                  {mounted && speechError && activeInput === "worry" && (
                    <div className="mt-2 text-xs text-red-500">
                      {speechError}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Continue to Part 3 Button - Only shown in worry step when text is entered */}
            {currentStep === "worry" && worry.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 mb-8"
              >
                <Button
                  className="w-full relative overflow-hidden py-5 bg-blue-600 hover:bg-blue-700 text-white transition"
                  onClick={handleContinueToPart3}
                  disabled={isTransitioning}
                >
                  <span className="flex items-center justify-center">
                    Continue
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="ml-2"
                    >
                      →
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            )}

            {/* Positive Action Question - only visible in positive step */}
            {currentStep === "positive" && (
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="mt-8"
              >
                <motion.div className="mb-6">
                  <h2 className="text-lg text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors">
                    🌱 What's one positive thing you can do for yourself today?
                  </h2>
                </motion.div>

                {/* Positive Action Input area */}
                <div className="relative">
                  <Textarea
                    ref={positiveInputRef}
                    placeholder="Write..."
                    className="min-h-[120px] resize-none p-4 text-base bg-gray-50 border-gray-200 focus:border-blue-300 rounded-lg"
                    value={positiveAction}
                    onChange={(e) => setPositiveAction(e.target.value)}
                  />

                  {/* Voice input button for positive action */}
                  {mounted && isSpeechSupported && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`absolute bottom-3 right-3 rounded-full p-2 ${
                        isListening && activeInput === "positive"
                          ? "bg-red-100 text-red-500"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      onClick={() => toggleRecording("positive")}
                      aria-label={
                        isListening && activeInput === "positive"
                          ? "Stop recording"
                          : "Start voice input"
                      }
                    >
                      <Mic
                        size={20}
                        className={
                          isListening && activeInput === "positive"
                            ? "animate-pulse"
                            : ""
                        }
                      />
                    </Button>
                  )}

                  {/* Recording error message */}
                  {mounted && speechError && activeInput === "positive" && (
                    <div className="mt-2 text-xs text-red-500">
                      {speechError}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Get Reflection Button - Only shown in positive step when text is entered */}
            {currentStep === "positive" && positiveAction.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <Button
                  className="w-full relative overflow-hidden py-5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                >
                  <span
                    className={`flex items-center justify-center transition-transform duration-300 ${
                      isSubmitting ? "translate-y-10" : "translate-y-0"
                    }`}
                  >
                    See Gemini Insights
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="ml-2"
                    >
                      ✨
                    </motion.span>
                  </span>

                  {isSubmitting && (
                    <span className="absolute inset-0 flex items-center justify-center translate-y-0 transition-transform duration-300 animate-appear">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Hint text */}
            <motion.div variants={itemVariants} className="mt-6 space-y-3">
              <p className="text-xs text-gray-500 text-center">
                Everything you write is private and only visible to you.
              </p>
              <p className="text-xs text-gray-500 text-center">
                {currentStep === "positive"
                  ? "Gemini Flash can help provide reflections on your entries and offer deeper insights."
                  : "As you write, Rosebud can ask questions to help dig deeper into your experience."}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

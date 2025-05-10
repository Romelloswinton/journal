"use client"

import { ReactNode, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import useOnboardingStore from "@/app/store/onboardingStore"
import { useAuth } from "@clerk/nextjs"

interface TransitionLayoutProps {
  children: ReactNode
}

export default function TransitionLayout({ children }: TransitionLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoaded, isSignedIn, userId } = useAuth()

  // Get state and actions from onboarding store
  const {
    setPathname,
    direction,
    setUserId,
    setIsSignedIn,
    resetOnboarding,
    setCurrentStep,
    isOnboardingComplete,
  } = useOnboardingStore()

  // Sync pathname with store
  useEffect(() => {
    setPathname(pathname)

    // Update current step based on pathname
    if (pathname === "/onboarding") {
      setCurrentStep("goal")
    } else if (pathname === "/onboarding/goal-confirmation") {
      setCurrentStep("goal-confirmation")
    } else if (pathname === "/onboarding/age-selection") {
      setCurrentStep("age-selection")
    } else if (pathname === "/onboarding/gender-selection") {
      setCurrentStep("gender-selection")
    } else if (pathname === "/onboarding/primary-occupation") {
      setCurrentStep("primary-occupation")
    } else if (pathname === "/onboarding/relationship-status") {
      setCurrentStep("relationship-status")
    } else if (pathname === "/onboarding/faith-orientation") {
      setCurrentStep("faith-orientation")
    } else if (pathname === "/onboarding/struggles") {
      setCurrentStep("struggles")
    } else if (pathname === "/onboarding/journal-time") {
      setCurrentStep("journal-time")
    } else if (pathname === "/onboarding/first-check-in") {
      setCurrentStep("first-check-in")
    } else if (pathname === "/onboarding/gemini-reflection") {
      setCurrentStep("gemini-reflection")
    } else if (pathname === "/onboarding/completion") {
      setCurrentStep("complete")
    }
  }, [pathname, setPathname, setCurrentStep])

  // Set auth state in store when Clerk auth loads
  useEffect(() => {
    if (isLoaded) {
      setIsSignedIn(isSignedIn)
      if (userId) {
        setUserId(userId)
      }
    }
  }, [isLoaded, isSignedIn, userId, setIsSignedIn, setUserId])

  // Load onboarding status when user is signed in
  useEffect(() => {
    const loadOnboardingStatus = async () => {
      if (isLoaded && isSignedIn && userId) {
        try {
          const response = await fetch("/api/user/onboarding/status")
          if (response.ok) {
            const data = await response.json()
            if (data.isOnboardingComplete) {
              // Set onboarding as complete in the store
              useOnboardingStore.setState({ isOnboardingComplete: true })
            }
          }
        } catch (error) {
          console.error("Error loading onboarding status:", error)
        }
      }
    }

    loadOnboardingStatus()
  }, [isLoaded, isSignedIn, userId])

  // Animation variants based on direction
  const pageVariants = {
    initial: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? "-100%" : "100%",
      opacity: 0,
      transition: {
        x: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    }),
  }

  // Check if we're in the onboarding flow
  const isOnboardingRoute = pathname.startsWith("/onboarding")

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        variants={isOnboardingRoute ? pageVariants : undefined}
        initial={isOnboardingRoute ? "initial" : false}
        animate={isOnboardingRoute ? "animate" : undefined}
        exit={isOnboardingRoute ? "exit" : undefined}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

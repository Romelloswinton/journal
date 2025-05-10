"use client"

import { useAuth } from "@clerk/nextjs"
import useOnboardingStore from "@/app/store/onboardingStore"
import Header from "./Header"

export default function ConditionalHeader() {
  const { isSignedIn, isLoaded } = useAuth()
  const { isOnboardingComplete } = useOnboardingStore()

  // Only render the header if onboarding is complete
  if (!isLoaded || !isSignedIn || !isOnboardingComplete) {
    return null
  }

  return <Header />
}

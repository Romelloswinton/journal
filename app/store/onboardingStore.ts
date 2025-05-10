// app/store/onboardingStore.ts

"use client"

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define types for all user-provided data during onboarding
export type GoalId =
  | "personal-growth"
  | "mental-health"
  | "creative-expression"
  | "reflection"
  | "gratitude"
  | "productivity"
  | null

export type AgeGroup =
  | "under-18"
  | "18-24"
  | "25-34"
  | "35-44"
  | "45-54"
  | "55-plus"
  | null

export type GenderIdentity =
  | "male"
  | "female"
  | "non-binary"
  | "prefer-not-to-say"
  | null

export type Occupation =
  | "student"
  | "professional"
  | "homemaker"
  | "retired"
  | "unemployed"
  | "other"
  | "prefer-not-to-say"
  | null

export type RelationshipStatus =
  | "single"
  | "in-relationship"
  | "married"
  | "divorced"
  | "widowed"
  | "prefer-not-to-say"
  | null

export type FaithOrientation =
  | "buddhist"
  | "christian"
  | "hindu"
  | "jewish"
  | "muslim"
  | "spiritual-not-religious"
  | "atheist"
  | "agnostic"
  | "prefer-not-to-say"
  | null

export type Struggle =
  | "depression"
  | "anxiety"
  | "adhd"
  | "burnout"
  | "sleep-issues"
  | "other"
  | "prefer-not-to-say"
  | null

export type JournalTime =
  | "morning"
  | "afternoon"
  | "evening"
  | "no-preference"
  | null

// Define all onboarding steps
export type OnboardingStep =
  | "landing"
  | "goal"
  | "age-selection"
  | "gender-selection"
  | "primary-occupation"
  | "relationship-status"
  | "faith-orientation"
  | "struggles"
  | "journal-time"
  | "first-check-in"
  | "gemini-reflection"
  | "gemini-insights"
  | "complete"

// Define the state interface
interface OnboardingState {
  // User data
  userId: string | null
  selectedGoal: GoalId
  selectedAge: AgeGroup
  selectedGender: GenderIdentity
  selectedOccupation: Occupation
  selectedRelationship: RelationshipStatus
  selectedFaith: FaithOrientation
  selectedStruggle: Struggle
  selectedJournalTime: JournalTime
  firstEntryPriority: string | null
  firstEntryWorry: string | null
  firstEntryPositive: string | null
  isOnboardingComplete: boolean

  // Navigation state
  currentStep: OnboardingStep
  direction: "forward" | "backward"
  currentPathname: string

  // Loading and error states
  isLoading: boolean
  error: string | null
  isSignedIn: boolean

  // Actions for updating state
  setUserId: (userId: string) => void
  setIsSignedIn: (isSignedIn: boolean) => void
  handleSelectGoal: (goalId: GoalId) => void
  handleSelectAge: (age: AgeGroup, router: AppRouterInstance) => void
  handleSelectGender: (
    gender: GenderIdentity,
    router: AppRouterInstance
  ) => void
  handleSelectOccupation: (
    occupation: Occupation,
    router: AppRouterInstance
  ) => void
  handleSelectRelationship: (
    status: RelationshipStatus,
    router: AppRouterInstance
  ) => void
  handleSelectFaith: (
    faith: FaithOrientation,
    router: AppRouterInstance
  ) => void
  handleSelectStruggle: (struggle: Struggle, router: AppRouterInstance) => void
  handleSelectJournalTime: (
    time: JournalTime,
    router: AppRouterInstance
  ) => void
  saveFirstEntry: (
    priority: string,
    worry: string,
    positive: string,
    router: AppRouterInstance
  ) => void
  completeOnboarding: () => Promise<void>
  resetOnboarding: () => void

  // Navigation actions
  navigateToNextStep: (router: AppRouterInstance) => void
  navigateToPreviousStep: (router: AppRouterInstance) => void
  skipCurrentStep: (router: AppRouterInstance) => void
  setCurrentStep: (step: OnboardingStep) => void
  setPathname: (pathname: string) => void
}

// Navigation order
const stepOrder: OnboardingStep[] = [
  "landing",
  "goal",
  "age-selection",
  "gender-selection",
  "primary-occupation",
  "relationship-status",
  "faith-orientation",
  "struggles",
  "journal-time",
  "first-check-in",
  "gemini-reflection",
  "gemini-insights",
  "complete",
]

// Create the Zustand store with persistence
const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      userId: null,
      selectedGoal: null,
      selectedAge: null,
      selectedGender: null,
      selectedOccupation: null,
      selectedRelationship: null,
      selectedFaith: null,
      selectedStruggle: null,
      selectedJournalTime: null,
      firstEntryPriority: null,
      firstEntryWorry: null,
      firstEntryPositive: null,
      isOnboardingComplete: false,

      // Navigation state
      currentStep: "goal",
      direction: "forward",
      currentPathname: "/",

      // Loading and error states
      isLoading: false,
      error: null,
      isSignedIn: false,

      // Actions for updating state
      setUserId: (userId) => set({ userId }),

      setIsSignedIn: (isSignedIn) => set({ isSignedIn }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setPathname: (pathname) => set({ currentPathname: pathname }),

      handleSelectGoal: (goalId) => set({ selectedGoal: goalId }),

      handleSelectAge: (age, router) => {
        set({ selectedAge: age })
        get().navigateToNextStep(router)
      },

      handleSelectGender: (gender, router) => {
        set({ selectedGender: gender })
        get().navigateToNextStep(router)
      },

      handleSelectOccupation: (occupation, router) => {
        set({ selectedOccupation: occupation })
        get().navigateToNextStep(router)
      },

      handleSelectRelationship: (status, router) => {
        set({ selectedRelationship: status })
        get().navigateToNextStep(router)
      },

      handleSelectFaith: (faith, router) => {
        set({ selectedFaith: faith })
        get().navigateToNextStep(router)
      },

      handleSelectStruggle: (struggle, router) => {
        set({ selectedStruggle: struggle })
        get().navigateToNextStep(router)
      },

      handleSelectJournalTime: (time, router) => {
        set({ selectedJournalTime: time })
        get().navigateToNextStep(router)
      },

      saveFirstEntry: (priority, worry, positive, router) => {
        set({
          firstEntryPriority: priority,
          firstEntryWorry: worry,
          firstEntryPositive: positive,
        })
        // Note: When navigating from first-check-in, we go to gemini-reflection which is a separate page
      },

      completeOnboarding: async () => {
        set({ isLoading: true, error: null })

        try {
          const onboardingData = get()

          // Save to database
          const response = await fetch("/api/onboarding", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              goal: onboardingData.selectedGoal,
              ageGroup: onboardingData.selectedAge,
              gender: onboardingData.selectedGender,
              occupation: onboardingData.selectedOccupation,
              relationshipStatus: onboardingData.selectedRelationship,
              faithOrientation: onboardingData.selectedFaith,
              struggle: onboardingData.selectedStruggle,
              journalTime: onboardingData.selectedJournalTime,
              firstEntryPriority: onboardingData.firstEntryPriority,
              firstEntryWorry: onboardingData.firstEntryWorry,
              firstEntryPositive: onboardingData.firstEntryPositive,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to save onboarding data")
          }

          // Mark onboarding as complete
          set({ isOnboardingComplete: true, currentStep: "complete" })
        } catch (error) {
          console.error("Error completing onboarding:", error)
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to complete onboarding",
          })
        } finally {
          set({ isLoading: false })
        }
      },

      resetOnboarding: () =>
        set({
          selectedGoal: null,
          selectedAge: null,
          selectedGender: null,
          selectedOccupation: null,
          selectedRelationship: null,
          selectedFaith: null,
          selectedStruggle: null,
          selectedJournalTime: null,
          firstEntryPriority: null,
          firstEntryWorry: null,
          firstEntryPositive: null,
          isOnboardingComplete: false,
          currentStep: "goal",
          error: null,
          isLoading: false,
        }),

      // Navigation helpers
      navigateToNextStep: (router: AppRouterInstance) => {
        const currentStep = get().currentStep
        const currentIndex = stepOrder.indexOf(currentStep)

        if (currentIndex < stepOrder.length - 1) {
          const nextStep = stepOrder[currentIndex + 1]
          set({ currentStep: nextStep, direction: "forward" })
        }
      },

      navigateToPreviousStep: (router: AppRouterInstance) => {
        const currentStep = get().currentStep
        const currentIndex = stepOrder.indexOf(currentStep)

        if (currentIndex > 0) {
          const prevStep = stepOrder[currentIndex - 1]
          set({ currentStep: prevStep, direction: "backward" })
        }
      },

      skipCurrentStep: (router) => {
        get().navigateToNextStep(router)
      },
    }),
    {
      name: "rosebud-onboarding-storage",
      // Persist essential state
      partialize: (state) => ({
        userId: state.userId,
        selectedGoal: state.selectedGoal,
        selectedAge: state.selectedAge,
        selectedGender: state.selectedGender,
        selectedOccupation: state.selectedOccupation,
        selectedRelationship: state.selectedRelationship,
        selectedFaith: state.selectedFaith,
        selectedStruggle: state.selectedStruggle,
        selectedJournalTime: state.selectedJournalTime,
        firstEntryPriority: state.firstEntryPriority,
        firstEntryWorry: state.firstEntryWorry,
        firstEntryPositive: state.firstEntryPositive,
        isOnboardingComplete: state.isOnboardingComplete,
        currentStep: state.currentStep,
        currentPathname: state.currentPathname,
        isSignedIn: state.isSignedIn,
      }),
    }
  )
)

export default useOnboardingStore

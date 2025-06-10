// app/onboarding/_lib/types.ts

import { AllReflections } from "@/lib/gemini/types"

export interface DeeperInsight {
  title: string
  insight: string
  practicalSteps: string[]
  connectionToOtherAreas: string
}

export interface InsightsData {
  overallPattern: string
  keyInsights: DeeperInsight[]
  personalizedGrowthPath: string
}

export interface ThemeStyles {
  bgClass: string
  cardBgClass: string
  cardBorderClass: string
  headerTextClass: string
  primaryTextClass: string
  secondaryTextClass: string
  normalTextClass: string
  mutedTextClass: string
  progressBgClass: string
  progressFillClass: string
  backButtonClass: string
  skipButtonClass: string
  textareaClass: string
  boxBgColors: {
    priority: {
      box: string
      header: string
      insight: string
    }
    worry: {
      box: string
      header: string
      insight: string
    }
    positive: {
      box: string
      header: string
      insight: string
    }
  }
}

export interface StepProps {
  theme?: string
}

export interface SelectionStepProps {
  localSelectedValue: string | null
  setLocalSelectedValue: (value: string) => void
}

// app/onboarding/_components/OccupationSelection.tsx

"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { OptionButton } from "@/components/ui/OptionButton"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

interface OccupationSelectionProps {
  localSelectedOccupation: string | null
  setLocalSelectedOccupation: (occupation: string) => void
}

export function OccupationSelection({
  localSelectedOccupation,
  setLocalSelectedOccupation,
}: OccupationSelectionProps) {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  const occupationOptions = [
    { value: "student", label: "Student" },
    { value: "professional", label: "Professional" },
    { value: "homemaker", label: "Homemaker" },
    { value: "retired", label: "Retired" },
    { value: "unemployed", label: "Unemployed" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ]

  return (
    <motion.div variants={itemVariants}>
      <h2 className={`${styles.primaryTextClass} font-medium mb-4`}>
        What best describes your current primary occupation?
      </h2>

      <div className="space-y-2">
        {occupationOptions.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            isSelected={localSelectedOccupation === option.value}
            onClick={() => setLocalSelectedOccupation(option.value)}
            theme={theme}
          />
        ))}
      </div>
    </motion.div>
  )
}

// app/onboarding/_components/GenderSelection.tsx

"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { OptionButton } from "@/components/ui/OptionButton"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

interface GenderSelectionProps {
  localSelectedGender: string | null
  setLocalSelectedGender: (gender: string) => void
}

export function GenderSelection({
  localSelectedGender,
  setLocalSelectedGender,
}: GenderSelectionProps) {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-binary" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ]

  return (
    <motion.div variants={itemVariants}>
      <h2 className={`${styles.primaryTextClass} font-medium mb-4`}>
        How do you identify?
      </h2>

      <div className="space-y-2">
        {genderOptions.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            isSelected={localSelectedGender === option.value}
            onClick={() => setLocalSelectedGender(option.value)}
            theme={theme}
          />
        ))}
      </div>
    </motion.div>
  )
}

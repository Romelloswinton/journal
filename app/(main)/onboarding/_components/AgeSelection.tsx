// app/onboarding/_components/AgeSelection.tsx

"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { OptionButton } from "@/components/ui/OptionButton"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

interface AgeSelectionProps {
  localSelectedAge: string | null
  setLocalSelectedAge: (age: string) => void
}

export function AgeSelection({
  localSelectedAge,
  setLocalSelectedAge,
}: AgeSelectionProps) {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  const ageOptions = [
    { value: "under-18", label: "Under 18" },
    { value: "18-24", label: "18–24" },
    { value: "25-34", label: "25–34" },
    { value: "35-44", label: "35–44" },
    { value: "45-54", label: "45–54" },
    { value: "55-plus", label: "55+" },
  ]

  return (
    <motion.div variants={itemVariants}>
      <p className={`${styles.primaryTextClass} font-medium mb-6`}>
        Great! Now, let's tailor fit Rosebud to you.
        <br />
        🧸 How many years young are you?
      </p>

      <div className="space-y-3">
        {ageOptions.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            isSelected={localSelectedAge === option.value}
            onClick={() => setLocalSelectedAge(option.value)}
            theme={theme}
          />
        ))}
      </div>
    </motion.div>
  )
}

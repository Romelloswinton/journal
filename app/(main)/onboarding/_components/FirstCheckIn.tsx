// app/onboarding/_components/FirstCheckIn.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme/theme-provider"
import { Textarea } from "@/components/ui/textarea"
import useOnboardingStore from "@/app/store/onboardingStore"
import { getThemeStyles } from "../_lib/utils"
import { itemVariants } from "../_lib/animations"

export function FirstCheckIn() {
  const { theme } = useTheme()
  const styles = getThemeStyles(theme)

  const { firstEntryPriority, firstEntryWorry, firstEntryPositive } =
    useOnboardingStore()

  // Local state for form fields
  const [priority, setPriority] = useState(firstEntryPriority || "")
  const [worry, setWorry] = useState(firstEntryWorry || "")
  const [positiveAction, setPositiveAction] = useState(firstEntryPositive || "")

  // Update store when values change - using the proper store methods
  useEffect(() => {
    // Use a temporary save method that updates the store reactive values
    const store = useOnboardingStore.getState()

    // Update the store state directly to trigger reactivity
    useOnboardingStore.setState({
      firstEntryPriority: priority.trim(),
      firstEntryWorry: worry.trim(),
      firstEntryPositive: positiveAction.trim(),
    })
  }, [priority, worry, positiveAction])

  return (
    <motion.div variants={itemVariants}>
      <h2 className={`text-lg ${styles.secondaryTextClass} font-medium mb-6`}>
        ✍️ First Check-in
      </h2>

      {/* Priority Question */}
      <div className="mb-6">
        <h3 className={`${styles.secondaryTextClass} font-medium mb-2`}>
          🪷 What's your highest priority today?
        </h3>
        <Textarea
          placeholder="Write..."
          className={`min-h-[120px] resize-none p-4 ${styles.textareaClass}`}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
      </div>

      {/* Worry Question */}
      <div className="mb-6">
        <h3 className={`${styles.secondaryTextClass} font-medium mb-2`}>
          🥀 Is there anything worrying you about the day ahead?
        </h3>
        <Textarea
          placeholder="Write..."
          className={`min-h-[120px] resize-none p-4 ${styles.textareaClass}`}
          value={worry}
          onChange={(e) => setWorry(e.target.value)}
        />
      </div>

      {/* Positive Action Question */}
      <div className="mb-6">
        <h3 className={`${styles.secondaryTextClass} font-medium mb-2`}>
          🌱 What's one positive thing you can do for yourself today?
        </h3>
        <Textarea
          placeholder="Write..."
          className={`min-h-[120px] resize-none p-4 ${styles.textareaClass}`}
          value={positiveAction}
          onChange={(e) => setPositiveAction(e.target.value)}
        />
      </div>
    </motion.div>
  )
}

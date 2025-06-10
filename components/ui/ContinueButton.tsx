// components/ui/ContinueButton.tsx

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ContinueButtonProps {
  onClick: () => void
  isSubmitting: boolean
  label?: string
  className?: string
  disabled?: boolean
  theme?: string // Add theme prop
}

export function ContinueButton({
  onClick,
  isSubmitting,
  label = "Continue",
  className = "",
  disabled = false,
  theme = "light",
}: ContinueButtonProps) {
  // Dark mode & light mode class adjustments
  const baseClasses = "w-full relative overflow-hidden"

  let bgClasses = ""
  if (theme === "dark") {
    bgClasses = disabled
      ? "bg-gray-600 hover:bg-gray-600 text-gray-400"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  } else {
    bgClasses = disabled
      ? "bg-gray-300 hover:bg-gray-300 text-gray-500"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <Button
        className={`${baseClasses} ${bgClasses} ${className}`}
        onClick={onClick}
        disabled={disabled || isSubmitting}
      >
        <span
          className={`flex items-center justify-center transition-transform duration-300 ${
            isSubmitting ? "translate-y-10" : "translate-y-0"
          }`}
        >
          {label}
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="ml-2"
          >
            →
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
  )
}

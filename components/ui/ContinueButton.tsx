"use client"

import { motion } from "framer-motion"

interface ContinueButtonProps {
  onClick: () => void
  isSubmitting?: boolean
  label?: string
  className?: string
  disabled?: boolean
  variant?: "default" | "primary" | "secondary" | "success" | "danger"
  size?: "sm" | "md" | "lg"
  showArrow?: boolean
}

export function ContinueButton({
  onClick,
  isSubmitting = false,
  label = "Continue",
  className = "",
  disabled = false,
  variant = "default",
  size = "md",
  showArrow = true,
}: ContinueButtonProps) {
  // Variant styles mapping
  const variantStyles = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  }

  // Size styles mapping
  const sizeStyles = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  }

  // Combine all styles
  const buttonStyles = `w-full relative overflow-hidden rounded-lg transition 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${disabled || isSubmitting ? "opacity-70 cursor-not-allowed" : ""} 
    ${className}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <button
        className={buttonStyles}
        onClick={onClick}
        disabled={disabled || isSubmitting}
        type="button"
      >
        <span
          className={`flex items-center justify-center transition-transform duration-300 ${
            isSubmitting ? "translate-y-10" : "translate-y-0"
          }`}
        >
          {label}
          {showArrow && (
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="ml-2"
            >
              →
            </motion.span>
          )}
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
      </button>
    </motion.div>
  )
}

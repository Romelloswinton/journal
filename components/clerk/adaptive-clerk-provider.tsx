// components/clerk/adaptive-clerk-provider.tsx (simplified)
"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { useTheme } from "@/components/theme/theme-provider"
import React from "react"

export function AdaptiveClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()
  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-blue-600 hover:bg-blue-700 text-sm normal-case dark:bg-blue-500 dark:hover:bg-blue-600",
          card: "shadow-none dark:bg-gray-900 dark:border dark:border-gray-800",
          headerTitle: "text-xl font-semibold dark:text-white",
          headerSubtitle: "text-gray-600 dark:text-gray-400",
          socialButtonsBlockButton:
            "border border-gray-300 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white",
          formFieldInput:
            "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
          footerActionLink:
            "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
        },
        layout: {
          socialButtonsPlacement: "top",
          socialButtonsVariant: "blockButton",
        },
        variables: {
          colorPrimary: "#ec4899", // Pink color
          // Use theme-appropriate colors
          colorBackground: isDarkMode ? "#121212" : "#ffffff",
          colorText: isDarkMode ? "#e5e5e5" : "#0f172a",
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}

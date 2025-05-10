// app/clerk-provider.tsx
"use client"

import { ClerkProvider as ClerkProviderOriginal } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "@/components/theme/theme-provider"

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <ClerkProviderOriginal
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "#ec4899", // Match your pink primary color
        },
      }}
    >
      {children}
    </ClerkProviderOriginal>
  )
}

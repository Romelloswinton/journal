// app/rosebud/layout.tsx
"use client"

import { ReactNode } from "react"
import { Toaster } from "sonner"
import { useTheme } from "@/components/theme/theme-provider"

interface RosebudLayoutProps {
  children: ReactNode
}

export default function RosebudLayout({ children }: RosebudLayoutProps) {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Main Content */}
      <main className="transition-colors duration-200">{children}</main>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        theme={theme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}

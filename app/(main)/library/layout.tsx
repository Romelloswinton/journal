// app/library/layout.tsx
"use client"

import { ReactNode } from "react"
import { Toaster } from "sonner"
import { useTheme } from "@/components/theme/theme-provider"

interface LibraryLayoutProps {
  children: ReactNode
}

export default function LibraryLayout({ children }: LibraryLayoutProps) {
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

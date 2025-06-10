// app/dashboard/layout.tsx
"use client"

import { ReactNode } from "react"
import { Toaster } from "sonner"
import { useTheme } from "@/components/theme/theme-provider"
import Footer from "@/components/Footer"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-background transition-colors duration-200 flex flex-col">
      {/* Main Content */}
      <main className="flex-grow transition-colors duration-200">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        theme={theme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}

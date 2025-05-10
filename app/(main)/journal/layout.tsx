// app/journal/layout.tsx
import { ReactNode } from "react"
import { JournalHeader } from "@/components/journal/JournalHeader"

interface JournalLayoutProps {
  children: ReactNode
}

export default function JournalLayout({ children }: JournalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <JournalHeader />
      <main>{children}</main>
    </div>
  )
}

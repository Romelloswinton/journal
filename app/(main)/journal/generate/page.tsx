"use client"

import { motion } from "framer-motion"
import { JournalAIGenerator } from "../_components/JournalAIGenerator"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function GenerateJournalEntryPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/journal"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to journal
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">
          Generate Journal Entry
        </h1>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h2 className="text-lg text-muted-foreground mb-2">
            AI-Powered Journal Generator
          </h2>
        </div>

        <JournalAIGenerator />
      </motion.div>
    </div>
  )
}

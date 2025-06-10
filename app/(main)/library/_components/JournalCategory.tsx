// app/library/_components/JournalCategory.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import JournalCard from "./JournalCard"
import { Journal } from "@/app/store/libraryStore"

interface JournalCategoryProps {
  title: string
  journals: Journal[]
}

export default function JournalCategory({
  title,
  journals,
}: JournalCategoryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Check scroll buttons visibility on component mount and when journals change
  useEffect(() => {
    checkScrollButtons()
  }, [journals])

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = Math.min(container.scrollLeft, container.clientWidth)
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = container.clientWidth
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  // Don't render if no journals
  if (!journals || journals.length === 0) {
    return null
  }

  return (
    <div className="mb-6 max-w-6xl mx-auto relative px-10">
      {/* Category header with title centered */}
      <div className="flex justify-center items-center mb-3">
        <h3 className="text-xs font-medium text-muted-foreground tracking-wider">
          {title}
        </h3>
      </div>

      {/* Scroll container with cards */}
      <div className="relative">
        {/* Navigation buttons - only show if there are enough journals to scroll */}
        {journals.length > 4 && (
          <>
            <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm rounded-full shadow-md"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm rounded-full shadow-md"
                onClick={scrollRight}
                disabled={!canScrollRight}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}

        {/* Scrollable grid container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar"
          onScroll={checkScrollButtons}
        >
          {journals.map((journal, index) => (
            <motion.div
              key={journal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="min-w-[calc(25%-12px)] w-[calc(25%-12px)]" // Exact calculation for 4 cards with gap
            >
              <JournalCard
                journal={journal}
                className="h-[220px]"
                showSaveButton={true}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

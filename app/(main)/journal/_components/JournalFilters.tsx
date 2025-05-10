"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Tag,
  SunMoon,
  Zap,
  Lightbulb,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface JournalFiltersProps {
  allTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  moodRange: [number, number]
  onMoodRangeChange: (range: [number, number]) => void
  energyRange: [number, number]
  onEnergyRangeChange: (range: [number, number]) => void
  clarityRange: [number, number]
  onClarityRangeChange: (range: [number, number]) => void
  showAiGenerated: boolean
  onShowAiGeneratedChange: (value: boolean) => void
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: {
    from: Date | undefined
    to: Date | undefined
  }) => void
  onClearFilters: () => void
}

export function JournalFilters({
  allTags,
  selectedTags,
  onTagsChange,
  moodRange,
  onMoodRangeChange,
  energyRange,
  onEnergyRangeChange,
  clarityRange,
  onClarityRangeChange,
  showAiGenerated,
  onShowAiGeneratedChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
}: JournalFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasActiveFilters =
    selectedTags.length > 0 ||
    moodRange[0] > 1 ||
    moodRange[1] < 10 ||
    energyRange[0] > 1 ||
    energyRange[1] < 10 ||
    clarityRange[0] > 1 ||
    clarityRange[1] < 10 ||
    showAiGenerated ||
    dateRange.from ||
    dateRange.to

  const activeFilterCount = [
    selectedTags.length > 0,
    moodRange[0] > 1 || moodRange[1] < 10,
    energyRange[0] > 1 || energyRange[1] < 10,
    clarityRange[0] > 1 || clarityRange[1] < 10,
    showAiGenerated,
    dateRange.from || dateRange.to,
  ].filter(Boolean).length

  return (
    <Card className="shadow-sm border-amber-100 dark:border-amber-800/50">
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : "48px" }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-amber-500 dark:text-amber-400" />
            <span className="font-medium text-amber-800 dark:text-amber-400">
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 bg-amber-500 dark:bg-amber-600 text-white">
                  {activeFilterCount}
                </Badge>
              )}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <CardContent className="pt-0 pb-4">
          <Accordion type="multiple" defaultValue={["tags", "metrics"]}>
            {/* Tags Filter */}
            <AccordionItem value="tags" className="border-b-0">
              <AccordionTrigger className="py-2">
                <div className="flex items-center text-sm font-medium">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  Tags
                  {selectedTags.length > 0 && (
                    <Badge className="ml-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                      {selectedTags.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2">
                  {allTags.length > 0 ? (
                    allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? "default" : "outline"
                        }
                        className={`cursor-pointer ${
                          selectedTags.includes(tag)
                            ? "bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => {
                          onTagsChange(
                            selectedTags.includes(tag)
                              ? selectedTags.filter((t) => t !== tag)
                              : [...selectedTags, tag]
                          )
                        }}
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tags available for filtering
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Metrics Filter */}
            <AccordionItem value="metrics" className="border-b-0">
              <AccordionTrigger className="py-2">
                <div className="flex items-center text-sm font-medium">
                  <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                  Metrics
                  {(moodRange[0] > 1 ||
                    moodRange[1] < 10 ||
                    energyRange[0] > 1 ||
                    energyRange[1] < 10 ||
                    clarityRange[0] > 1 ||
                    clarityRange[1] < 10) && (
                    <Badge className="ml-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                      Active
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {/* Mood Range Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center text-sm">
                        <SunMoon className="h-3 w-3 mr-1 text-blue-500 dark:text-blue-400" />
                        Mood
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {moodRange[0]} - {moodRange[1]}
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={moodRange}
                      onValueChange={onMoodRangeChange}
                      className="bg-amber-200 dark:bg-amber-800"
                    />
                  </div>

                  {/* Energy Range Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center text-sm">
                        <Zap className="h-3 w-3 mr-1 text-red-500 dark:text-red-400" />
                        Energy
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {energyRange[0]} - {energyRange[1]}
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={energyRange}
                      onValueChange={onEnergyRangeChange}
                      className="bg-amber-200 dark:bg-amber-800"
                    />
                  </div>

                  {/* Clarity Range Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center text-sm">
                        <Lightbulb className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" />
                        Clarity
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {clarityRange[0]} - {clarityRange[1]}
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={clarityRange}
                      onValueChange={onClarityRangeChange}
                      className="bg-amber-200 dark:bg-amber-800"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Other Filters */}
            <AccordionItem value="other" className="border-b-0">
              <AccordionTrigger className="py-2">
                <div className="flex items-center text-sm font-medium">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  Other Filters
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {/* AI Generated Filter */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ai-generated"
                      checked={showAiGenerated}
                      onCheckedChange={() =>
                        onShowAiGeneratedChange(!showAiGenerated)
                      }
                    />
                    <Label
                      htmlFor="ai-generated"
                      className="flex items-center text-sm cursor-pointer"
                    >
                      Show only AI-generated entries
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="mt-4 w-full text-muted-foreground hover:text-foreground border border-border hover:bg-accent"
            >
              <X className="h-4 w-4 mr-2" />
              Clear all filters
            </Button>
          )}
        </CardContent>
      </motion.div>
    </Card>
  )
}

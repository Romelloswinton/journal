// app/rosebud/_components/PopularTopics.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import useRosebudStore from "@/app/store/rosebudStore"
import {
  topicCategories,
  getTopicsByCategory,
  getAllCategoryIds,
} from "../_data/topicsData"

export default function PopularTopics() {
  const { setQuery } = useRosebudStore()
  const [activeTab, setActiveTab] = useState(topicCategories[0].id)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const handleTopicClick = (prompt: string) => {
    setQuery(prompt)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <Card className="bg-pink-50/50 dark:bg-pink-950/20 border-pink-100 dark:border-pink-800/30">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3 text-pink-900 dark:text-pink-300">
          Popular Topics
        </h3>

        {/* Mobile view (accordion style for small screens) */}
        <div className="md:hidden space-y-2">
          {topicCategories.map((category) => (
            <Collapsible
              key={category.id}
              open={expandedCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
              className="border border-pink-200 dark:border-pink-800/50 rounded-md overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-pink-700 dark:text-pink-300 justify-between p-3 h-auto"
                >
                  <div className="flex items-center">
                    <category.icon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{category.name}</span>
                  </div>
                  <ChevronDown
                    className="h-3.5 w-3.5 transition-transform flex-shrink-0 ml-1.5"
                    style={{
                      transform: expandedCategories.includes(category.id)
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 pb-2 pt-1 bg-pink-100/50 dark:bg-pink-950/50">
                <div className="space-y-1.5">
                  {getTopicsByCategory(category.id).map((topic) => (
                    <Button
                      key={topic.id}
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs h-auto py-1.5 justify-start text-pink-800 dark:text-pink-200"
                      onClick={() => handleTopicClick(topic.prompt)}
                    >
                      <topic.icon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      <span className="truncate text-left">{topic.name}</span>
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Desktop view (tabbed interface for larger screens) */}
        <div className="hidden md:block">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid-cols-5 grid bg-transparent gap-1 mb-1">
              {topicCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs px-1.5 py-1 data-[state=active]:bg-pink-100/70 data-[state=active]:text-pink-800 
                             dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-300 h-full flex items-center"
                >
                  <div className="flex items-center justify-center space-x-1 w-full">
                    <category.icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate max-w-[60px]">
                      {category.name}
                    </span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {topicCategories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-2 overflow-visible"
              >
                <div className="grid grid-cols-1 gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                  {getTopicsByCategory(category.id).map((topic) => (
                    <Button
                      key={topic.id}
                      variant="ghost"
                      size="sm"
                      className="text-xs border-pink-100 dark:border-pink-900/50 text-pink-700 dark:text-pink-300 justify-start h-auto py-1.5 w-full"
                      onClick={() => handleTopicClick(topic.prompt)}
                    >
                      <topic.icon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      <span className="truncate text-left">{topic.name}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Main category buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {topicCategories.slice(0, 2).map((category) => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              className="text-xs border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 justify-start"
              onClick={() => handleTopicClick(category.prompt)}
            >
              <category.icon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">{category.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

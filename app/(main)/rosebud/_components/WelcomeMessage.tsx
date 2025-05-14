// app/rosebud/_components/WelcomeMessage.tsx
import {
  BarChart2,
  Heart,
  TrendingUp,
  Calendar,
  FileText,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useRosebudStore from "@/app/store/rosebudStore"
import useJournalStore from "@/app/store/journalStore"

export default function WelcomeMessage() {
  const { currentQuery, setQuery } = useRosebudStore()
  const { entries } = useJournalStore()

  // Handle pattern identification button click
  const handleIdentifyPatterns = () => {
    const patternPrompt =
      entries.length > 0
        ? "Based on my journal entries, what patterns or recurring themes do you notice in my thoughts, behaviors, or emotions?"
        : "I'd like to identify patterns in my journaling. What types of patterns might be worth exploring?"

    setQuery(patternPrompt)
  }

  // Handle emotion analysis button click
  const handleAnalyzeEmotions = () => {
    const emotionPrompt =
      entries.length > 0
        ? "What emotions appear most frequently in my journal entries, and how do they relate to different situations or topics I write about?"
        : "I'd like to understand the emotions in my journaling better. What emotional patterns might be worth exploring?"

    setQuery(emotionPrompt)
  }

  // Get more focused pattern questions
  const getPatternQuestions = () => [
    {
      title: "Growth Patterns",
      query:
        "What patterns of personal growth or development can you identify in my journal entries?",
      icon: <TrendingUp className="h-3.5 w-3.5 mr-1.5" />,
    },
    {
      title: "Weekly Cycles",
      query:
        "Do you notice any patterns in my mood or activities based on different days of the week?",
      icon: <Calendar className="h-3.5 w-3.5 mr-1.5" />,
    },
    {
      title: "Recurring Topics",
      query:
        "What topics or themes appear most frequently in my journal entries?",
      icon: <FileText className="h-3.5 w-3.5 mr-1.5" />,
    },
  ]

  // Get more focused emotion questions
  const getEmotionQuestions = () => [
    {
      title: "Emotional Triggers",
      query:
        "What specific situations or people seem to trigger strong emotional responses in my journal?",
      icon: <Heart className="h-3.5 w-3.5 mr-1.5" />,
    },
    {
      title: "Emotional Balance",
      query:
        "How balanced are the positive and negative emotions in my journaling? What does this suggest?",
      icon: <BarChart2 className="h-3.5 w-3.5 mr-1.5" />,
    },
    {
      title: "Emotional Evolution",
      query:
        "How have my emotional responses to similar situations changed over time according to my journals?",
      icon: <RefreshCw className="h-3.5 w-3.5 mr-1.5" />,
    },
  ]

  return (
    <div className="bg-muted p-4 rounded-md">
      <h3 className="text-sm font-medium mb-2">👋 Welcome to Rosebud</h3>
      <p className="text-sm text-muted-foreground">
        I'm your personal journaling assistant. I can provide insights based on
        your journal entries, help you reflect, or answer questions about your
        patterns. What would you like to know?
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleIdentifyPatterns}
              >
                <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
                Identify patterns
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Analyze recurring themes in your journal entries
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleAnalyzeEmotions}
              >
                <Heart className="h-3.5 w-3.5 mr-1.5" />
                Analyze emotions
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Examine emotional patterns in your journaling
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Additional pattern questions */}
      {currentQuery ===
        "Based on my journal entries, what patterns or recurring themes do you notice in my thoughts, behaviors, or emotions?" && (
        <div className="mt-4 space-y-2 bg-accent/30 p-3 rounded-md">
          <p className="text-xs font-medium">
            Try one of these specific pattern questions:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {getPatternQuestions().map((q, idx) => (
              <Button
                key={idx}
                variant="ghost"
                size="sm"
                className="text-xs justify-start h-auto py-1.5"
                onClick={() => setQuery(q.query)}
              >
                {q.icon}
                {q.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Additional emotion questions */}
      {currentQuery ===
        "What emotions appear most frequently in my journal entries, and how do they relate to different situations or topics I write about?" && (
        <div className="mt-4 space-y-2 bg-accent/30 p-3 rounded-md">
          <p className="text-xs font-medium">
            Try one of these specific emotion questions:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {getEmotionQuestions().map((q, idx) => (
              <Button
                key={idx}
                variant="ghost"
                size="sm"
                className="text-xs justify-start h-auto py-1.5"
                onClick={() => setQuery(q.query)}
              >
                {q.icon}
                {q.title}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

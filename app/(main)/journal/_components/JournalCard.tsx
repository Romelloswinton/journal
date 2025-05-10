"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Calendar, MoreVertical, Edit, Trash2, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useJournalStore from "@/app/store/journalStore"

interface JournalEntry {
  id: string
  title: string
  content: string
  tags: string[]
  metrics: {
    mood: number
    energy: number
    clarity: number
  }
  insights: string[]
  isAIGenerated?: boolean
  createdAt: string
  updatedAt: string
}

interface JournalCardProps {
  entry: JournalEntry
  onClick: () => void
}

export function JournalCard({ entry, onClick }: JournalCardProps) {
  const router = useRouter()
  const { deleteEntry } = useJournalStore()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Truncate content for preview
  const truncatedContent = (content: string) => {
    if (content.length <= 150) return content
    return content.slice(0, 150) + "..."
  }

  // Get the mood color
  const getMoodColor = () => {
    const mood = entry.metrics.mood
    if (mood <= 3)
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50"
    if (mood <= 7)
      return "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50"
    return "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/50"
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    setIsDeleteDialogOpen(true)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    router.push(`/journal/edit/${entry.id}`)
  }

  const confirmDelete = async () => {
    try {
      await deleteEntry(entry.id)
      toast.success("Journal entry deleted successfully")
    } catch (error) {
      toast.error("Failed to delete journal entry")
    }
  }

  return (
    <>
      <motion.div
        whileHover={{
          y: -4,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={`h-full cursor-pointer overflow-hidden ${getMoodColor()}`}
          onClick={onClick}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(entry.createdAt), "MMM d, yyyy")}
                </span>
                {entry.isAIGenerated && (
                  <Badge className="ml-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 h-5 text-xs flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="font-semibold text-lg line-clamp-1 mb-2 text-foreground">
              {entry.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-4 mb-3">
              {truncatedContent(entry.content)}
            </p>

            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-auto">
                {entry.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-background/50 dark:bg-background/30"
                  >
                    {tag}
                  </Badge>
                ))}
                {entry.tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-background/50 dark:bg-background/30"
                  >
                    +{entry.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this journal entry. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

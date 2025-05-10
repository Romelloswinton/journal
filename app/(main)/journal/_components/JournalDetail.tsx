"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  Calendar,
  Edit,
  Trash2,
  ArrowLeft,
  MoreVertical,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import Link from "next/link"
import useJournalStore from "@/app/store/journalStore"
import { JournalMetrics } from "./JournalMetrics"
import { JournalInsights } from "./JournalInsights"

interface JournalDetailProps {
  id: string
}

export function JournalDetail({ id }: JournalDetailProps) {
  const router = useRouter()
  const { getEntry, deleteEntry } = useJournalStore()
  const entry = getEntry(id)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-2 text-foreground">
          Journal entry not found
        </h2>
        <p className="text-muted-foreground mb-6">
          The entry you're looking for doesn't exist or has been deleted.
        </p>
        <Button variant="outline" onClick={() => router.push("/journal")}>
          Go back to journal
        </Button>
      </div>
    )
  }

  const handleDelete = async () => {
    try {
      await deleteEntry(id)
      toast.success("Journal entry deleted successfully")
      router.push("/journal")
    } catch (error) {
      console.error("Error deleting journal entry:", error)
      toast.error("Failed to delete journal entry")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/journal"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to journal
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/journal/edit/${id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            {entry.title}
          </h1>
          {entry.isAIGenerated && (
            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Generated
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          {entry.createdAt
            ? format(new Date(entry.createdAt), "MMMM d, yyyy 'at' h:mm a")
            : "Date unknown"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md border-amber-100 dark:border-amber-800/50">
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                {entry.content.split("\n").map((paragraph, i) => (
                  <p key={i} className="mb-4 last:mb-0 text-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <JournalInsights insights={entry.insights} />
        </div>

        <div className="space-y-6">
          <JournalMetrics metrics={entry.metrics} />

          {entry.tags.length > 0 && (
            <Card className="shadow-sm border-amber-100 dark:border-amber-800/50">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

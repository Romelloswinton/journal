// app/rosebud/_components/ConversationHistory.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  Download,
  Save,
  X,
  Calendar,
  Tag,
  ListFilter,
  Heart,
  HeartOff,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import useRosebudStore from "@/app/store/rosebudStore"
import { RosebudConversation } from "@/app/store/rosebudStore"

interface ConversationHistoryProps {
  conversations: RosebudConversation[]
  selectedConversation: string | null
  onSelectConversation: (id: string, query: string) => void
}

type GroupByOption = "date" | "label" | "none"

export default function ConversationHistory({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationHistoryProps) {
  const {
    deleteConversation,
    updateConversationLabel,
    exportConversations,
    clearAllConversations,
    loadConversation,
    toggleFavorite,
    isFavorite,
  } = useRosebudStore()

  const [editingLabel, setEditingLabel] = useState<string | null>(null)
  const [newLabel, setNewLabel] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<
    string | null
  >(null)
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false)
  const [groupBy, setGroupBy] = useState<GroupByOption>("date")
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle starting to edit a label
  const handleEditLabel = (
    conversation: RosebudConversation,
    e?: React.MouseEvent
  ) => {
    // Prevent propagation to avoid triggering selection
    if (e) {
      e.stopPropagation()
    }

    setEditingLabel(conversation.id)
    setNewLabel(conversation.label || "")
    // Focus the input after a short delay to allow rendering
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 50)
  }

  // Handle saving the edited label
  const handleSaveLabel = async (id: string) => {
    try {
      await updateConversationLabel(id, newLabel.trim())
      toast.success("Label updated")
    } catch (error) {
      toast.error("Failed to update label")
    }
    setEditingLabel(null)
  }

  // Handle canceling label edit
  const handleCancelEdit = () => {
    setEditingLabel(null)
    setNewLabel("")
  }

  // Handle deleting a conversation
  const handleDeleteConversation = (id: string, e?: React.MouseEvent) => {
    // Prevent propagation to avoid triggering selection
    if (e) {
      e.stopPropagation()
    }

    setConversationToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  // Confirm deletion of conversation
  const confirmDelete = async () => {
    if (conversationToDelete) {
      try {
        await deleteConversation(conversationToDelete)
        toast.success("Conversation deleted")
      } catch (error) {
        toast.error("Failed to delete conversation")
      }
    }
    setIsDeleteDialogOpen(false)
    setConversationToDelete(null)
  }

  // Handle toggling favorite status
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    // Prevent propagation to avoid triggering selection
    if (e) {
      e.stopPropagation()
    }

    toggleFavorite(id)
    toast.success(
      isFavorite(id) ? "Removed from favorites" : "Added to favorites"
    )
  }

  // Handle selecting a conversation to view in the chat
  const handleSelectConversation = (conversation: RosebudConversation) => {
    // Don't do anything if we're currently editing a label
    if (editingLabel === conversation.id) return

    // Load the conversation into the chat component
    loadConversation(conversation)

    // Also call the parent component's onSelectConversation to track the selection
    onSelectConversation(conversation.id, conversation.query)
  }

  // Handle exporting a single conversation
  const handleExportConversation = (
    conversation: RosebudConversation,
    e?: React.MouseEvent
  ) => {
    // Prevent propagation to avoid triggering selection
    if (e) {
      e.stopPropagation()
    }

    // Create basic content with initial Q&A
    let content = `# ${conversation.label || "Conversation"}\n\nQuery: ${
      conversation.query
    }\n\nResponse: ${conversation.response}\n\n`

    // Add additional messages if they exist
    if (conversation.messages && conversation.messages.length > 2) {
      content += "## Continuation\n\n"

      // Skip the first two messages (already included above)
      for (let i = 2; i < conversation.messages.length; i++) {
        const msg = conversation.messages[i]
        content += `**${msg.role === "user" ? "User" : "Rosebud"}**: ${
          msg.content
        }\n\n`
      }
    }

    // Use updatedAt if available, otherwise use createdAt
    const displayDate = conversation.updatedAt || conversation.createdAt
    content += `Date: ${format(new Date(displayDate), "PPP")}`

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rosebud-conversation-${format(
      new Date(displayDate),
      "yyyy-MM-dd"
    )}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Conversation exported")
  }

  // Handle exporting all conversations
  const handleExportAllConversations = () => {
    if (conversations.length === 0) {
      toast.error("No conversations to export")
      return
    }

    exportConversations()
    toast.success("All conversations exported")
  }

  // Handle clearing all conversations
  const handleClearAllConfirm = async () => {
    try {
      await clearAllConversations()
      toast.success("Conversation history cleared")
    } catch (error) {
      toast.error("Failed to clear conversation history")
    }
    setIsClearAllDialogOpen(false)
  }

  // Group conversations by the selected option
  const getGroupedConversations = () => {
    if (groupBy === "none" || conversations.length === 0) {
      return { "All Conversations": conversations }
    }

    if (groupBy === "date") {
      const grouped: Record<string, RosebudConversation[]> = {}

      conversations.forEach((convo) => {
        // Use updatedAt if available, otherwise use createdAt
        const dateToUse = convo.updatedAt || convo.createdAt
        const date = format(new Date(dateToUse), "MMMM d, yyyy")
        if (!grouped[date]) {
          grouped[date] = []
        }
        grouped[date].push(convo)
      })

      return grouped
    }

    if (groupBy === "label") {
      const grouped: Record<string, RosebudConversation[]> = {}

      conversations.forEach((convo) => {
        const label = convo.label || "Unlabeled"
        if (!grouped[label]) {
          grouped[label] = []
        }
        grouped[label].push(convo)
      })

      return grouped
    }

    return { "All Conversations": conversations }
  }

  const groupedConversations = getGroupedConversations()

  // Function to get message count for a conversation
  const getMessageCount = (conversation: RosebudConversation): number => {
    if (!conversation.messages) return 2 // Default for query and response
    return Array.isArray(conversation.messages)
      ? conversation.messages.length
      : 2
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Conversation History</h3>
            <div className="flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ListFilter className="h-4 w-4" />
                    <span className="sr-only">Group by</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>Group by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setGroupBy("date")}
                    className={groupBy === "date" ? "bg-accent" : ""}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    By Date
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setGroupBy("label")}
                    className={groupBy === "label" ? "bg-accent" : ""}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    By Label
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setGroupBy("none")}
                    className={groupBy === "none" ? "bg-accent" : ""}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    No Grouping
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Manage History</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportAllConversations}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsClearAllDialogOpen(true)}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {conversations.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {Object.entries(groupedConversations).map(
                ([groupName, convos]) => (
                  <div key={groupName} className="space-y-2">
                    {/* Only show group header if grouping is enabled */}
                    {groupBy !== "none" && (
                      <h4 className="text-xs font-medium text-muted-foreground pt-2 first:pt-0">
                        {groupName}
                      </h4>
                    )}

                    {convos.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-2 rounded-md border border-border hover:bg-accent/20 text-sm ${
                          selectedConversation === conversation.id
                            ? "bg-accent/30"
                            : ""
                        }`}
                      >
                        {/* Label editing mode */}
                        {editingLabel === conversation.id ? (
                          <div
                            className="flex items-center justify-between mb-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Input
                              ref={inputRef}
                              size={1}
                              value={newLabel}
                              onChange={(e) => setNewLabel(e.target.value)}
                              placeholder="Enter label..."
                              className="h-6 text-xs"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveLabel(conversation.id)
                                } else if (e.key === "Escape") {
                                  handleCancelEdit()
                                }
                              }}
                            />
                            <div className="flex items-center ml-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleSaveLabel(conversation.id)}
                              >
                                <Save className="h-3 w-3 text-green-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={handleCancelEdit}
                              >
                                <X className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start">
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() =>
                                handleSelectConversation(conversation)
                              }
                            >
                              <div className="flex items-center gap-1 mb-1">
                                {conversation.label && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1 py-0 h-4 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50"
                                  >
                                    {conversation.label}
                                  </Badge>
                                )}
                                {/* Show message count if conversation has more than the initial Q&A */}
                                {getMessageCount(conversation) > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1 py-0 h-4"
                                  >
                                    {Math.ceil(
                                      getMessageCount(conversation) / 2
                                    )}{" "}
                                    msgs
                                  </Badge>
                                )}
                                {isFavorite(conversation.id) && (
                                  <Heart
                                    className="h-3 w-3 text-red-500"
                                    fill="#ef4444"
                                  />
                                )}
                              </div>
                              <p className="font-medium line-clamp-1">
                                {conversation.query}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {conversation.response}
                                </p>
                                {/* Display updatedAt if available, otherwise fallback to createdAt */}
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0">
                                  {format(
                                    new Date(
                                      conversation.updatedAt ||
                                        conversation.createdAt
                                    ),
                                    "MMM d"
                                  )}
                                </span>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 ml-1 flex-shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={(e) =>
                                    handleEditLabel(conversation, e)
                                  }
                                >
                                  <Pencil className="h-3.5 w-3.5 mr-2" />
                                  Edit Label
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) =>
                                    handleToggleFavorite(conversation.id, e)
                                  }
                                >
                                  {isFavorite(conversation.id) ? (
                                    <>
                                      <HeartOff className="h-3.5 w-3.5 mr-2" />
                                      Remove Favorite
                                    </>
                                  ) : (
                                    <>
                                      <Heart className="h-3.5 w-3.5 mr-2" />
                                      Add to Favorites
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) =>
                                    handleExportConversation(conversation, e)
                                  }
                                >
                                  <Download className="h-3.5 w-3.5 mr-2" />
                                  Export
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) =>
                                    handleDeleteConversation(conversation.id, e)
                                  }
                                  className="text-red-500 focus:text-red-500"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear all confirmation dialog */}
      <Dialog
        open={isClearAllDialogOpen}
        onOpenChange={setIsClearAllDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Clear Conversation History</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear your entire conversation history?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsClearAllDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAllConfirm}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

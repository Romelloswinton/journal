// app/admin/library/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  MessageSquare,
  Users,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface LibraryJournal {
  id: string
  title: string
  author: string
  image: string
  category: string
  description?: string
  content?: {
    prompts: string[]
    duration?: string
    benefits?: string[]
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminLibraryPage() {
  const [journals, setJournals] = useState<LibraryJournal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingJournal, setEditingJournal] = useState<LibraryJournal | null>(
    null
  )

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    image: "",
    category: "Daily" as "Situational" | "Daily" | "Framework",
    description: "",
    prompts: [""],
    duration: "",
    benefits: [""],
  })

  // Fetch journals
  const fetchJournals = async () => {
    try {
      const response = await fetch("/api/admin/journals")
      if (!response.ok) throw new Error("Failed to fetch journals")
      const data = await response.json()
      setJournals(data)
    } catch (error) {
      console.error("Error fetching journals:", error)
      toast.error("Failed to load journals")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJournals()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      image: "",
      category: "Daily",
      description: "",
      prompts: [""],
      duration: "",
      benefits: [""],
    })
    setEditingJournal(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        title: formData.title,
        author: formData.author,
        image: formData.image,
        category: formData.category,
        description: formData.description,
        content: {
          prompts: formData.prompts.filter((p) => p.trim()),
          duration: formData.duration,
          benefits: formData.benefits.filter((b) => b.trim()),
        },
      }

      const url = editingJournal
        ? `/api/admin/journals/${editingJournal.id}`
        : "/api/admin/journals"

      const method = editingJournal ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to save journal")

      toast.success(editingJournal ? "Journal updated!" : "Journal created!")
      setIsCreateDialogOpen(false)
      resetForm()
      fetchJournals()
    } catch (error) {
      console.error("Error saving journal:", error)
      toast.error("Failed to save journal")
    }
  }

  // Handle edit
  const handleEdit = (journal: LibraryJournal) => {
    setEditingJournal(journal)
    setFormData({
      title: journal.title,
      author: journal.author,
      image: journal.image,
      category: journal.category as any,
      description: journal.description || "",
      prompts: journal.content?.prompts || [""],
      duration: journal.content?.duration || "",
      benefits: journal.content?.benefits || [""],
    })
    setIsCreateDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this journal?")) return

    try {
      const response = await fetch(`/api/admin/journals/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete journal")

      toast.success("Journal deleted!")
      fetchJournals()
    } catch (error) {
      console.error("Error deleting journal:", error)
      toast.error("Failed to delete journal")
    }
  }

  // Toggle active status
  const toggleActive = async (journal: LibraryJournal) => {
    try {
      const response = await fetch(`/api/admin/journals/${journal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !journal.isActive }),
      })

      if (!response.ok) throw new Error("Failed to update journal")

      toast.success(
        `Journal ${journal.isActive ? "deactivated" : "activated"}!`
      )
      fetchJournals()
    } catch (error) {
      console.error("Error updating journal:", error)
      toast.error("Failed to update journal")
    }
  }

  // Add/remove prompt fields
  const addPromptField = () => {
    setFormData((prev) => ({
      ...prev,
      prompts: [...prev.prompts, ""],
    }))
  }

  const removePromptField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prompts: prev.prompts.filter((_, i) => i !== index),
    }))
  }

  const updatePrompt = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      prompts: prev.prompts.map((p, i) => (i === index ? value : p)),
    }))
  }

  // Add/remove benefit fields
  const addBenefitField = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }))
  }

  const removeBenefitField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }))
  }

  const updateBenefit = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => (i === index ? value : b)),
    }))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Situational":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Framework":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "Daily":
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Library Administration</h1>
          <p className="text-muted-foreground">
            Manage journal templates and prompts
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Journal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingJournal ? "Edit Journal" : "Create New Journal"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Situational">Situational</SelectItem>
                      <SelectItem value="Framework">Framework</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="e.g., 10-15 minutes"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the journal template..."
                />
              </div>

              <div>
                <Label>Journal Prompts</Label>
                {formData.prompts.map((prompt, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={prompt}
                      onChange={(e) => updatePrompt(index, e.target.value)}
                      placeholder={`Prompt ${index + 1}`}
                    />
                    {formData.prompts.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removePromptField(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPromptField}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prompt
                </Button>
              </div>

              <div>
                <Label>Benefits</Label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder={`Benefit ${index + 1}`}
                    />
                    {formData.benefits.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeBenefitField(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBenefitField}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit
                </Button>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingJournal ? "Update" : "Create"} Journal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Journals
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{journals.length}</div>
            <p className="text-xs text-muted-foreground">
              {journals.filter((j) => j.isActive).length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Daily, Situational, Framework
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {journals.reduce(
                (acc, j) => acc + (j.content?.prompts?.length || 0),
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Across all journals</p>
          </CardContent>
        </Card>
      </div>

      {/* Journals List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Journal Templates</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {journals.map((journal) => (
              <Card key={journal.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{journal.title}</h3>
                        <Badge className={getCategoryColor(journal.category)}>
                          {journal.category}
                        </Badge>
                        {!journal.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {journal.author}
                      </p>
                      {journal.description && (
                        <p className="text-sm">{journal.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {journal.content?.prompts?.length || 0} prompts
                        </span>
                        {journal.content?.duration && (
                          <span>{journal.content.duration}</span>
                        )}
                        <span>
                          Created{" "}
                          {new Date(journal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(journal)}
                        title={journal.isActive ? "Deactivate" : "Activate"}
                      >
                        {journal.isActive ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(journal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(journal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

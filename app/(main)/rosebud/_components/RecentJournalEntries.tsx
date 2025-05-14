// app/rosebud/_components/RecentJournalEntries.tsx
import { format } from "date-fns"
import { FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { JournalEntry } from "@/app/store/journalStore"

interface RecentJournalEntriesProps {
  entries: JournalEntry[]
}

export default function RecentJournalEntries({
  entries,
}: RecentJournalEntriesProps) {
  // Sort entries by date (newest first)
  const recentEntries = [...entries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">Recent Journal Entries</h3>

        {recentEntries.length > 0 ? (
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {recentEntries.map((entry) => (
              <Link
                href={`/journal/${entry.id}`}
                key={entry.id}
                className="block p-2 rounded-md border border-border hover:bg-accent/20 text-sm"
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium line-clamp-1">{entry.title}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {format(new Date(entry.createdAt), "MMM d")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {entry.content}
                </p>
                {entry.tags.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {entry.tags.slice(0, 2).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-[10px] py-0 px-1.5 text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {entry.tags.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1.5 text-muted-foreground"
                      >
                        +{entry.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No journal entries yet
            </p>
            <Link href="/journal/new">
              <Button variant="link" size="sm" className="mt-1">
                Create your first entry
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// app/library/_components/EmptyState.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel: string
  actionHref?: string
  onAction?: () => void
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  // Handle either link or button click
  const handleAction = () => {
    if (onAction) {
      onAction()
    }
  }

  return (
    <div className="text-center py-12 bg-card/50 dark:bg-card/30 rounded-lg border border-border p-8">
      <div className="mx-auto mb-4 text-muted-foreground">{icon}</div>
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>

      {actionHref ? (
        <Link href={actionHref}>
          <Button variant="outline">{actionLabel}</Button>
        </Link>
      ) : (
        <Button variant="outline" onClick={handleAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

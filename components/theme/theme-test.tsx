// components/theme/theme-test.tsx
"use client"

export function ThemeTest() {
  return (
    <div className="fixed bottom-4 left-4 z-50 grid gap-2 p-4 bg-card text-card-foreground rounded shadow-md">
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-background rounded-md border"></div>
        <span>background</span>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-foreground rounded-md border"></div>
        <span>foreground</span>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-primary rounded-md border"></div>
        <span>primary</span>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-secondary rounded-md border"></div>
        <span>secondary</span>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-muted rounded-md border"></div>
        <span>muted</span>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-card rounded-md border"></div>
        <span>card</span>
      </div>
    </div>
  )
}

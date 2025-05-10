import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  icon: LucideIcon
  value: string | number
  label?: string
  iconColor?: string
}

export function StatsCard({
  icon: Icon,
  value,
  label,
  iconColor = "text-gray-500",
}: StatsCardProps) {
  return (
    <Card className="bg-card shadow-sm hover:shadow-md transition-shadow border-border">
      <CardContent className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <div>
            <span className="text-lg font-medium text-card-foreground">
              {value}
            </span>
            {label && (
              <span className="text-sm text-muted-foreground ml-1">
                {label}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

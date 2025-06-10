// app/rosebud/_components/QuestionHeader.tsx
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"

interface QuestionHeaderProps {
  question: string
  className?: string
}

export default function QuestionHeader({
  question,
  className = "",
}: QuestionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`border-b border-border/50 pb-4 mb-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-primary" />
          </div>
        </div>
        <div className="flex-grow">
          <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
            Your Question
          </div>
          <div className="text-sm font-medium text-foreground leading-relaxed">
            {question}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

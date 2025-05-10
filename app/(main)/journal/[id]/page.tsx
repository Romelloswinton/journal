"use client"

import { useParams } from "next/navigation"
import { JournalDetail } from "../_components/JournalDetail"

export default function JournalEntryPage() {
  const params = useParams()
  const id = params.id as string

  return <JournalDetail id={id} />
}

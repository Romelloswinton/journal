// components/auth/UserButton.tsx

"use client"

import { UserButton as ClerkUserButton } from "@clerk/nextjs"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

export function UserButton() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/sign-in"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
        >
          Sign up
        </Link>
      </div>
    )
  }

  return (
    <div className="ml-auto flex items-center gap-x-2">
      <ClerkUserButton afterSignOutUrl="/" />
    </div>
  )
}

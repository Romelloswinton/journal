// app/library/layout.tsx
"use client"

import { ReactNode } from "react"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Flower, Settings, User, HelpCircle } from "lucide-react"
import { Toaster } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useTheme } from "@/components/theme/theme-provider"

interface LibraryLayoutProps {
  children: ReactNode
}

export default function LibraryLayout({ children }: LibraryLayoutProps) {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center">
              <Flower className="h-8 w-8 text-pink-500" />
              <span className="ml-2 text-xl font-semibold text-foreground">
                Rosebud
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/journal"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Journal
              </Link>
              <Link
                href="/library"
                className="text-foreground font-medium transition-colors duration-200"
              >
                Library
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground p-2"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  sideOffset={5}
                >
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Button */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="transition-colors duration-200">{children}</main>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        theme={theme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}

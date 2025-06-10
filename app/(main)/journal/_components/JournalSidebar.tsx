// app/journal/_components/JournalSidebar.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  BookOpen,
  Edit,
  Calendar,
  Search,
  Settings,
  Home,
  User,
  LogOut,
  HelpCircle,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useClerk } from "@clerk/nextjs"
import useJournalStore from "@/app/store/journalStore"

interface JournalSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function JournalSidebar({ isOpen, onToggle }: JournalSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const [searchQuery, setSearchQuery] = useState("")
  const { entries } = useJournalStore()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Define navigation items - journal-specific only
  const navItems = [
    { icon: BookOpen, label: "All Entries", path: "/journal" },
    { icon: Edit, label: "New Entry", path: "/journal/new" },
    { icon: Calendar, label: "Calendar", path: "/journal/calendar" },
  ]

  const isActive = (path: string) => pathname === path

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/journal/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Filter entries as user types
  const filteredEntries = searchQuery
    ? entries
        .filter(
          (entry) =>
            entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5) // Limit to 5 results for sidebar
    : []

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed lg:relative z-40 w-80 h-full bg-card border-r border-border shadow-lg lg:shadow-none lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header - Mobile Close Button Only */}
          <div className="p-6 border-b border-border lg:hidden">
            <div className="flex items-center justify-end">
              {/* Close button for mobile */}
              <Button variant="ghost" size="icon" onClick={onToggle}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Search
            </h3>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                ref={searchInputRef}
                placeholder="Search entries..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            {/* Quick Search Results */}
            {searchQuery && filteredEntries.length > 0 && (
              <div className="mt-3 p-2 bg-muted/50 rounded-md max-h-40 overflow-y-auto">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Quick Results:
                </div>
                {filteredEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/journal/${entry.id}`}
                    className="block p-2 rounded hover:bg-background/80 transition-colors"
                    onClick={() => setSearchQuery("")}
                  >
                    <div className="font-medium text-sm truncate">
                      {entry.title || "Untitled Entry"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {entry.content.substring(0, 50)}...
                    </div>
                  </Link>
                ))}
                <Separator className="my-2" />
                <Link
                  href={`/journal/search?q=${encodeURIComponent(searchQuery)}`}
                  className="block p-2 text-center text-primary hover:text-primary/90 font-medium text-sm rounded hover:bg-background/80 transition-colors"
                  onClick={() => setSearchQuery("")}
                >
                  See all results
                </Link>
              </div>
            )}

            {searchQuery && filteredEntries.length === 0 && (
              <div className="mt-3 p-2 bg-muted/50 rounded-md">
                <div className="text-xs text-muted-foreground text-center">
                  No entries found
                </div>
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <div className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Journal Navigation
            </h3>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Flexible spacer - reduced flex-grow to bring Account section up */}
          <div className="flex-grow min-h-[2rem] max-h-[8rem]"></div>

          {/* Account Section - More visible positioning */}
          <div className="p-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Account
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  size="sm"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56"
                sideOffset={5}
              >
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => signOut()}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
    </>
  )
}

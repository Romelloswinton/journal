// components/journal/JournalHeader.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Edit,
  Calendar,
  Search,
  Settings,
  ChevronDown,
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
import { useClerk } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import useJournalStore from "@/app/store/journalStore"

export function JournalHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { entries } = useJournalStore()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Define navigation items
  const navItems = [
    { icon: BookOpen, label: "All Entries", path: "/journal" },
    { icon: Edit, label: "New Entry", path: "/journal/new" },
    { icon: Calendar, label: "Calendar", path: "/journal/calendar" },
  ]

  const isActive = (path: string) => pathname === path

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
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
        .slice(0, 5) // Limit to 5 results for dropdown
    : []

  return (
    <header className="sticky top-0 z-30 w-full bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Home */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <span className="mx-2 text-muted">|</span>
            <Link
              href="/journal"
              className="font-semibold text-xl text-foreground"
            >
              Journal
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center text-muted-foreground hover:text-foreground"
                >
                  <span className="mr-1">Menu</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      href={item.path}
                      className={`flex items-center w-full px-3 py-2 text-sm ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsSearchOpen(true)}>
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ThemeToggle />
                  <span className="ml-2">Theme</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right section - Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search Dropdown */}
            <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 p-0"
                sideOffset={5}
              >
                <div className="p-3">
                  <form onSubmit={handleSearch} className="relative">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 text-muted-foreground absolute left-3" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search entries..."
                        className="pl-9 pr-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Quick search results */}
                {searchQuery && (
                  <div className="py-2 border-t border-border">
                    {filteredEntries.length > 0 ? (
                      filteredEntries.map((entry) => (
                        <DropdownMenuItem
                          key={entry.id}
                          asChild
                          className="px-3 py-2"
                        >
                          <Link href={`/journal/${entry.id}`}>
                            <div className="truncate font-medium">
                              {entry.title || "Untitled Entry"}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {entry.content.substring(0, 60)}
                              {entry.content.length > 60 ? "..." : ""}
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No entries found
                      </div>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="text-center">
                      <Link
                        href={`/journal/search?q=${encodeURIComponent(
                          searchQuery
                        )}`}
                        className="w-full text-primary hover:text-primary/90 font-medium"
                      >
                        See all results
                      </Link>
                    </DropdownMenuItem>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" sideOffset={5}>
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
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
      </div>
    </header>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Feather, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Helper function to check if tab is active
  const isActiveTab = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true
    return pathname.startsWith(path)
  }

  const tabs = [
    { name: "Today", path: "/dashboard", id: "today" },
    { name: "Explore", path: "/explore", id: "explore" },
    { name: "Entries", path: "/entries", id: "entries" },
  ]

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center space-x-2">
              {/* Logo icon */}
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              {/* Brand name */}
              <span className="font-bold text-xl text-gray-900">rosebud</span>
              <span className="text-xs text-pink-500 font-medium">beta</span>
            </Link>
          </div>

          {/* Center - Navigation tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActiveTab(tab.path)
                    ? "text-gray-900 font-bold"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.name}
                {isActiveTab(tab.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Write button */}
            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-200 flex items-center space-x-2"
              onClick={() => {
                // Navigate to new entry page
                window.location.href = "/journal/new"
              }}
            >
              <Feather className="w-4 h-4" />
              <span>Write</span>
            </Button>

            {/* Get $15 referral button */}
            <Button
              variant="outline"
              className="border-pink-200 text-pink-600 hover:bg-pink-50 font-medium px-4 py-2 rounded-lg transition-all duration-200 hidden sm:flex"
              onClick={() => {
                // Open referral modal or navigate to referral page
                window.location.href = "/referral"
              }}
            >
              Get $15
            </Button>

            {/* Hamburger menu */}
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative"
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/settings")}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/help")}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden pb-3">
          <div className="flex items-center justify-center space-x-1">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveTab(tab.path)
                    ? "bg-pink-50 text-pink-600 font-bold"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

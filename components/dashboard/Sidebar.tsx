// components/dashboard/Sidebar.tsx

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  Calendar,
  Settings,
  Sparkles,
  FileText,
} from "lucide-react"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active: boolean
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  const sidebarItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <BookOpen size={20} />,
      label: "Journal",
      href: "/journal",
    },
    {
      icon: <Sparkles size={20} />,
      label: "Insights",
      href: "/insights",
    },
    {
      icon: <FileText size={20} />,
      label: "Templates",
      href: "/templates",
    },
    {
      icon: <Calendar size={20} />,
      label: "Calendar",
      href: "/calendar",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      href: "/settings",
    },
  ]

  return (
    <div className="w-64 border-r bg-white h-screen flex flex-col">
      <div className="p-4 border-b flex items-center">
        <span className="text-xl font-semibold text-pink-600">Rosebud</span>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Link
          href="/journal/new"
          className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-colors"
        >
          <BookOpen size={16} />
          <span>New Entry</span>
        </Link>
      </div>
    </div>
  )
}

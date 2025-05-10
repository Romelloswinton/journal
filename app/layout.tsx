// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import TransitionLayout from "@/components/layouts/TransitionLayout"
import ConditionalHeader from "@/components/layout/ConditionalHeader"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ThemeScript } from "@/components/theme/theme-script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rosebud Journal - Your Personal Journaling Companion",
  description:
    "Guide yourself to a more fulfilling life through self-reflection with Rosebud Journal",
  keywords: [
    "journal",
    "self-reflection",
    "mental health",
    "personal growth",
    "mindfulness",
  ],
  authors: [{ name: "Rosebud Team" }],
  creator: "Rosebud Journal",
  publisher: "Rosebud Journal",
  openGraph: {
    title: "Rosebud Journal",
    description:
      "Your personal journaling companion for self-reflection and growth",
    type: "website",
    locale: "en_US",
    siteName: "Rosebud Journal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rosebud Journal",
    description:
      "Your personal journaling companion for self-reflection and growth",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1b1e" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="rosebud-theme">
          <ClerkProvider
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-sm normal-case dark:bg-blue-500 dark:hover:bg-blue-600",
                card: "shadow-none dark:bg-gray-900 dark:border dark:border-gray-800",
                headerTitle: "text-xl font-semibold dark:text-white",
                headerSubtitle: "text-gray-600 dark:text-gray-400",
                socialButtonsBlockButton:
                  "border border-gray-300 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white",
                formFieldInput:
                  "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
                footerActionLink:
                  "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
              // Use direct color values instead of CSS variables to fix the Clerk error
              variables: {
                colorBackground: "#ffffff", // Light mode background
                colorPrimary: "#ec4899", // Pink primary color
                colorText: "#0f172a", // Dark text for light mode
              },
            }}
          >
            <div className="bg-background text-foreground min-h-screen">
              <ConditionalHeader />
              <TransitionLayout>{children}</TransitionLayout>
            </div>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

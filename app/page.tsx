// app/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Flower } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ContinueButton } from "@/components/ui/ContinueButton"
import { SignInButton, useAuth } from "@clerk/nextjs"

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { isSignedIn, isLoaded } = useAuth()

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard")
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading state until auth is loaded
  if (!isLoaded) {
    return (
      <div
        className="h-screen w-full flex items-center justify-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #ff5bae 0%, #ef4da0 25%, #d53a88 50%, #b92877 75%, #9c1665 100%)",
          backgroundSize: "200% 200%",
          animation: "gradient 15s ease infinite",
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  // If signed in, we'll redirect (handled in the useEffect)
  // This is just a fallback in case the redirect doesn't happen immediately
  if (isSignedIn) {
    return null
  }

  const handleBeginJourney = () => {
    setIsLoading(true)

    // Navigate to the unified onboarding page
    setTimeout(() => {
      router.push("/onboarding")
      setIsLoading(false)
    }, 800)
  }

  // Fixed light theme with pink gradient background - separated properties
  const backgroundStyle = {
    backgroundImage:
      "radial-gradient(circle at center, #ff5bae 0%, #ef4da0 25%, #d53a88 50%, #b92877 75%, #9c1665 100%)",
    backgroundSize: "200% 200%",
    animation: "gradient 15s ease infinite",
  }

  return (
    <div
      className="h-screen w-full flex items-center justify-center p-4"
      style={backgroundStyle}
    >
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border-none">
          <CardContent className="p-8 flex flex-col items-center">
            {/* Logo */}
            <motion.div
              className="mb-6 text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Flower size={48} />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-2xl font-bold text-white text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Welcome to Rosebud
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-sm text-white/80 text-center mt-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              The #1 AI-powered journal for personal growth and mental health
            </motion.p>

            {/* Dashed Arrow */}
            <motion.div
              className="h-10 w-px border-l-2 border-dashed border-white/40 mb-8"
              initial={{ height: 0 }}
              animate={{ height: 40 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />

            {/* CTA Button */}
            <motion.div
              className="w-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <ContinueButton
                onClick={handleBeginJourney}
                isSubmitting={isLoading}
                label="Begin your journey"
                className="hover:scale-105 transition-transform font-medium mt-0 bg-white text-pink-800 hover:bg-white/90"
                disabled={false}
                theme="light"
              />
            </motion.div>

            {/* Sign In Button */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <SignInButton mode="modal">
                <button className="text-xs text-white/70 hover:text-white underline text-center cursor-pointer transition-colors">
                  I already have an account
                </button>
              </SignInButton>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* CSS for background animation */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes appear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-appear {
          animation: appear 0.3s ease forwards;
        }

        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}

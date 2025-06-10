// components/auth/SignUpModal.tsx

"use client"

import { SignUp } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"

interface SignUpModalProps {
  isOpen: boolean
  onComplete?: () => void
  routing?: "hash" | "virtual"
}

export function SignUpModal({
  isOpen,
  onComplete,
  routing = "hash",
}: SignUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onComplete} // Allow clicking backdrop to close
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-md z-10"
          >
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="pt-8 pb-4 px-6 flex justify-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  R
                </div>
              </div>

              <div className="px-6 pb-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
                  Complete Your Journey
                </h1>
                <p className="text-center text-gray-500 mb-6">
                  Sign up to save your journal entries and continue your
                  reflection journey
                </p>

                <SignUp
                  routing={routing} // Add routing prop to fix Clerk routing issues
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white",
                      card: "shadow-none border-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      dividerLine: "hidden",
                      dividerText: "hidden",
                      footer: "hidden",
                      socialButtonsBlockButton: "border-gray-300",
                      formFieldLabel: "text-gray-700",
                      formFieldInput:
                        "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                      footerActionLink: "text-blue-600 hover:text-blue-700",
                    },
                  }}
                  afterSignUpUrl="/dashboard"
                  afterSignInUrl="/dashboard"
                />
              </div>

              <div className="py-4 px-6 border-t text-center text-xs text-gray-500 bg-gray-50">
                <p>© 2025 Reflections App. All rights reserved.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

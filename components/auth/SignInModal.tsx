// components/auth/SignInModal.tsx

"use client"

import { useState, useEffect } from "react"
import { SignIn } from "@clerk/nextjs"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp?: () => void
}

export function SignInModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: SignInModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Made more transparent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-bold">Sign in to continue</h2>
                <p className="text-sm opacity-90">
                  Welcome back to your journaling space
                </p>
              </div>

              {/* Clerk SignIn component */}
              <div className="p-4">
                <SignIn
                  appearance={{
                    elements: {
                      formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                      card: "shadow-none",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      dividerLine: "hidden",
                      dividerText: "hidden",
                      footer: "hidden",
                    },
                  }}
                  redirectUrl="/dashboard"
                  afterSignInUrl="/dashboard"
                />
              </div>

              {/* Footer */}
              <div className="p-4 border-t text-center text-sm text-gray-500">
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={onSwitchToSignUp}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

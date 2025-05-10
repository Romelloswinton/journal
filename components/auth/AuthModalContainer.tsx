// components/auth/AuthModalContainer.tsx

"use client"

import { useState } from "react"
import { SignInModal } from "./SignInModal"
import { SignUpModal } from "./SignUpModal"

interface AuthModalContainerProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signin" | "signup"
}

/**
 * Container component that manages both SignIn and SignUp modals
 * Allows switching between the two modals
 */
export function AuthModalContainer({
  isOpen,
  onClose,
  initialMode = "signin",
}: AuthModalContainerProps) {
  // State to track which modal to show
  const [mode, setMode] = useState<"signin" | "signup">(initialMode)

  // Handler to switch between signin and signup
  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
  }

  // Custom close handler that resets to initial mode when closed
  const handleClose = () => {
    onClose()
    // Reset to initial mode after animation completes
    setTimeout(() => {
      setMode(initialMode)
    }, 300)
  }

  return (
    <>
      {/* Sign In Modal */}
      <SignInModal
        isOpen={isOpen && mode === "signin"}
        onClose={handleClose}
        onSwitchToSignUp={() => setMode("signup")}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={isOpen && mode === "signup"}
        onClose={handleClose}
        onSwitchToSignIn={() => setMode("signin")}
      />
    </>
  )
}

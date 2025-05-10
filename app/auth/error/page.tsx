"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowLeft } from "lucide-react"

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>(
    "An authentication error occurred"
  )

  useEffect(() => {
    // Get the error from search parameters
    const error = searchParams.get("error")

    if (error) {
      switch (error) {
        case "Configuration":
          setErrorMessage("There is a problem with the server configuration.")
          break
        case "AccessDenied":
          setErrorMessage(
            "Access denied. You may not have permission to sign in."
          )
          break
        case "Verification":
          setErrorMessage(
            "The verification link may have expired or already been used."
          )
          break
        case "OAuthAccountNotLinked":
          setErrorMessage(
            "This email is already associated with another account."
          )
          break
        case "OAuthCallback":
          setErrorMessage("There was an error during the OAuth callback.")
          break
        case "OAuthSignin":
          setErrorMessage(
            "There was an error during the OAuth sign-in process."
          )
          break
        case "EmailCreateAccount":
          setErrorMessage("There was an error creating your account.")
          break
        case "EmailSignin":
          setErrorMessage(
            "There was an error sending the email. Please try again."
          )
          break
        case "CredentialsSignin":
          setErrorMessage(
            "Sign in failed. Check the details you provided are correct."
          )
          break
        default:
          setErrorMessage(`Authentication error: ${error}`)
      }
    }
  }, [searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full rounded-xl shadow-lg border-0">
          <CardHeader className="flex flex-col items-center pt-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-red-100 p-4 rounded-full mb-4 text-red-600"
            >
              <AlertTriangle size={32} />
            </motion.div>
            <h2 className="text-2xl font-bold text-center">
              Authentication Error
            </h2>
          </CardHeader>

          <CardContent className="text-center pb-8 px-8">
            <p className="text-gray-600 mb-6">{errorMessage}</p>

            <div className="p-4 mb-6 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700">
                If this problem persists, please contact support.
              </p>
            </div>

            <Button
              onClick={() => router.push("/auth/signin")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

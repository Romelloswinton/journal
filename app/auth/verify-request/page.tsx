"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, ArrowLeft } from "lucide-react"

export default function VerifyRequestPage() {
  const router = useRouter()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <Card className="w-full rounded-xl shadow-lg border-0">
          <CardHeader className="flex flex-col items-center pt-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600"
            >
              <Mail size={32} />
            </motion.div>
            <h2 className="text-2xl font-bold text-center">Check Your Email</h2>
          </CardHeader>

          <CardContent className="text-center pb-8 px-8">
            <p className="text-gray-600 mb-6">
              We've sent you a magic link to sign in. Please check your email
              inbox and click the link to continue.
            </p>

            <div className="p-4 mb-6 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700">
                The link is valid for 10 minutes and can only be used once.
              </p>
            </div>

            <Button
              onClick={() => router.push("/auth/signin")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Button>

            <p className="text-xs text-gray-500 mt-6">
              Didn't receive an email? Check your spam folder or try signing in
              again.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

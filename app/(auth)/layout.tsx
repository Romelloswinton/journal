// app/(auth)/layout.tsx

import { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        {/* Auth container with styling */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Logo area */}
          <div className="pt-8 pb-4 px-6 flex justify-center">
            {/* You can replace this with your actual logo */}
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
          </div>

          <div className="px-6 pb-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
              Reflections
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Your personal space for mindful journaling
            </p>

            {/* This is where sign-in or sign-up forms will be rendered */}
            {children}
          </div>

          {/* Footer with additional links */}
          <div className="py-4 px-6 border-t text-center text-xs text-gray-500 bg-gray-50">
            <p>© 2025 Reflections App. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

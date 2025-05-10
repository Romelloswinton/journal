// app/(auth)/sign-up/[[...sign-up]]/page.tsx

import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          formButtonPrimary: "bg-pink-600 hover:bg-pink-700",
          card: "shadow-none",
          headerTitle: "text-2xl font-bold text-gray-800",
          headerSubtitle: "text-gray-600",
          dividerLine: "bg-gray-200",
          dividerText: "text-gray-500",
          footer: "hidden",
          formFieldInput:
            "border-gray-300 focus:border-pink-500 focus:ring-pink-500",
          formFieldLabel: "text-gray-700",
          identityPreviewText: "text-gray-700",
          identityPreviewEditButton: "text-pink-600 hover:text-pink-700",
          socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
          socialButtonsBlockButtonText: "text-gray-700",
          socialButtonsProviderIcon: "opacity-100",
          formFieldAction: "text-pink-600 hover:text-pink-700",
          footerActionLink: "text-pink-600 hover:text-pink-700",
        },
        layout: {
          socialButtonsPlacement: "top",
          socialButtonsVariant: "blockButton",
        },
      }}
      redirectUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      afterSignInUrl="/dashboard"
    />
  )
}

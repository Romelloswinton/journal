// app/sign-in/[[...sign-in]]/page.tsx

import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            card: "shadow-none",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  )
}

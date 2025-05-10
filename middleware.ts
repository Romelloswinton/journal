// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/onboarding(.*)",
  "/api/webhook(.*)",
])

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  // Allow access to public routes
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  // Special handling for dashboard route
  if (isDashboardRoute(request)) {
    // If user is not signed in, allow access to dashboard page
    // (the page itself will show the sign-up modal)
    if (!userId) {
      return NextResponse.next()
    }
  }

  // For all other protected routes, require authentication
  if (!userId) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("redirect_url", request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}

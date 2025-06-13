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
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const url = request.nextUrl

  console.log(
    `🔍 Middleware: ${url.pathname}, User: ${
      userId ? "authenticated" : "not authenticated"
    }`
  )

  // 🔧 NEW: Handle API routes that need authentication
  if (url.pathname.startsWith("/api/")) {
    // Routes that require authentication
    const protectedApiRoutes = ["/api/journal", "/api/rosebud"]
    const isProtectedApi = protectedApiRoutes.some((route) =>
      url.pathname.startsWith(route)
    )

    if (isProtectedApi && !userId) {
      console.log("🔒 Protected API route requires authentication")
      return Response.json(
        {
          error: "Unauthorized",
          message: "Please sign in to access this resource",
        },
        { status: 401 }
      )
    }

    // Allow API routes to continue
    return NextResponse.next()
  }

  // 🔧 NEW: Redirect authenticated users away from auth pages to dashboard
  if (userId && isAuthRoute(request)) {
    console.log(
      "✅ Authenticated user accessing auth page, redirecting to dashboard"
    )
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 🔧 NEW: Redirect authenticated users from home page to dashboard
  if (userId && url.pathname === "/") {
    console.log("✅ Authenticated user on home page, redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Allow access to public routes
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  // Special handling for dashboard route
  if (isDashboardRoute(request)) {
    // If user is not signed in, allow access to dashboard page
    // (the page itself will show the sign-up modal)
    if (!userId) {
      console.log(
        "🔓 Unauthenticated user accessing dashboard, allowing (will show auth modal)"
      )
      return NextResponse.next()
    } else {
      console.log("✅ Authenticated user accessing dashboard, proceeding")
      return NextResponse.next()
    }
  }

  // 🔧 ENHANCED: For all other protected routes, require authentication
  if (!userId) {
    console.log(
      "🔒 Protected route requires authentication, redirecting to sign-in"
    )
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("redirect_url", request.url)
    return NextResponse.redirect(signInUrl)
  }

  // 🔧 NEW: Handle successful authentication redirects
  // Check if user just came from a sign-in/sign-up flow
  const referer = request.headers.get("referer")
  if (userId && referer) {
    const refererUrl = new URL(referer)
    if (
      refererUrl.pathname.includes("/sign-in") ||
      refererUrl.pathname.includes("/sign-up")
    ) {
      console.log(
        "✅ User just authenticated, ensuring they reach their destination"
      )
      // Let them proceed to their intended destination
      return NextResponse.next()
    }
  }

  console.log("✅ Authenticated user accessing protected route, proceeding")
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Match all request paths including API routes that need authentication
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Explicitly include API routes
    "/api/(.*)",
  ],
}

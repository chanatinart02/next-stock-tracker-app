import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Middleware to protect all routes
 * Used here to protect authenticated pages.
 * Uses Better Auth session cookies (not JWTs)
 *  - NextRequest → request object for middleware (Edge-compatible)
 *  - NextResponse → allows redirect / continue
 *  - getSessionCookie → Better Auth helper to read auth cookie safely
 */
export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // If no session cookie, redirect to home page (sign-in)
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware configuration:
 * Apply this middleware to ALL routes
 * except:
 * - API routes
 * - Next.js internal files
 * - Auth pages (sign-in, sign-up)
 * - Static assets
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)"],
};

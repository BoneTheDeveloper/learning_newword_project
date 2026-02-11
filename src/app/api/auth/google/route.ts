/**
 * Google OAuth API Route
 *
 * Handles Google OAuth authentication flow.
 * Redirects to Google OAuth consent screen.
 */

import { NextRequest, NextResponse } from "next/server";
import { signInWithGoogle } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Initiate Google OAuth flow
    // Note: This function will redirect the response, so we don't return a NextResponse
    await signInWithGoogle();

    // This code should not be reached due to redirect
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } catch (error) {
    console.error("Google OAuth API error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=oauth_failed", request.url)
    );
  }
}

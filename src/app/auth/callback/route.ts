/**
 * Auth Callback Route
 *
 * Handles OAuth callback redirects from Supabase.
 * This route is used by Supabase Auth to redirect users after OAuth flow completes.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(
        `/auth/login?error=${encodeURIComponent(errorDescription || error)}`,
        request.url
      )
    );
  }

  // Handle successful OAuth
  if (code) {
    try {
      const supabase = await createClient();

      // Exchange code for session
      await supabase.auth.exchangeCodeForSession(code);

      // Redirect to dashboard on success
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        new URL(
          "/auth/login?error=Failed to complete authentication",
          request.url
        )
      );
    }
  }

  // Redirect to login if no code or error
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

/**
 * Logout API Route
 *
 * Handles user logout by ending the current session.
 */

import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/lib/auth";

export async function POST(_request: NextRequest) {
  try {
    // Attempt to sign out
    const result = await signOut();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

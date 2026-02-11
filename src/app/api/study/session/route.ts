/**
 * Study Session API Route
 *
 * POST /api/study/session
 * Creates a new study session
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createStudySession } from "@/lib/db/srs-progress";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get collection ID from request body (optional)
    const body = await request.json().catch(() => ({}));
    const { collectionId } = body as { collectionId?: string };

    // Create study session
    const session = await createStudySession(collectionId);

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error creating study session:", error);
    return NextResponse.json(
      { error: "Failed to create study session" },
      { status: 500 }
    );
  }
}

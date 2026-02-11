/**
 * Collections API Routes
 *
 * GET /api/collections - List all collections
 * POST /api/collections - Create a new collection
 */

import { createClient } from "@/lib/supabase/server";
import {
  getCollections,
  getCollectionsWithStats,
  createCollection,
} from "@/lib/db/collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get("include_stats") === "true";

    const collections = includeStats
      ? await getCollectionsWithStats()
      : await getCollections();

    return NextResponse.json({ data: collections });
  } catch (error) {
    console.error("Error in GET /api/collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, color } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const collection = await createCollection({
      name,
      description,
      color,
    });

    return NextResponse.json({ data: collection }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/collections:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}

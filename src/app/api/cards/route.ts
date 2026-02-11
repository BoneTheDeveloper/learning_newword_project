/**
 * Cards API Routes
 *
 * GET /api/cards - List cards with filters
 * POST /api/cards - Create a new card
 */

import { createClient } from "@/lib/supabase/server";
import { getCards, createCard, createCards } from "@/lib/db/cards";
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
    const filters = {
      search: searchParams.get("search") || undefined,
      difficulty: searchParams.get("difficulty") || undefined,
      part_of_speech: searchParams.get("part_of_speech") || undefined,
      collection_id: searchParams.get("collection_id") || undefined,
      sort_by: (searchParams.get("sort_by") as any) || undefined,
      sort_order: (searchParams.get("sort_order") as any) || undefined,
    };

    const cards = await getCards(filters);

    return NextResponse.json({ data: cards });
  } catch (error) {
    console.error("Error in GET /api/cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
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

    // Support single or batch creation
    if (Array.isArray(body)) {
      const cards = await createCards(body);
      return NextResponse.json({ data: cards }, { status: 201 });
    } else {
      const card = await createCard(body);
      return NextResponse.json({ data: card }, { status: 201 });
    }
  } catch (error) {
    console.error("Error in POST /api/cards:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}

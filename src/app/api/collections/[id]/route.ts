/**
 * Collection by ID API Routes
 *
 * GET /api/collections/[id] - Get a single collection
 * PATCH /api/collections/[id] - Update a collection
 * DELETE /api/collections/[id] - Delete a collection
 */

import { createClient } from "@/lib/supabase/server";
import {
  getCollectionById,
  getCollectionWithStats,
  updateCollection,
  deleteCollection,
} from "@/lib/db/collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get("include_stats") === "true";

    const collection = includeStats
      ? await getCollectionWithStats(id)
      : await getCollectionById(id);

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (collection.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: collection });
  } catch (error) {
    console.error("Error in GET /api/collections/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingCollection = await getCollectionById(id);

    if (!existingCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existingCollection.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const collection = await updateCollection(id, body);

    return NextResponse.json({ data: collection });
  } catch (error) {
    console.error("Error in PATCH /api/collections/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingCollection = await getCollectionById(id);

    if (!existingCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existingCollection.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteCollection(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/collections/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}

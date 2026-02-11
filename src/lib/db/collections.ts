/**
 * Collections Database Layer
 *
 * CRUD operations for vocabulary collections
 */

import { createClient } from "@/lib/supabase/client";
import type { Collection } from "@/types/database";

export interface CreateCollectionData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCollectionData extends Partial<CreateCollectionData> {}

/**
 * Get all collections for current user
 */
export async function getCollections(): Promise<Collection[]> {
  const supabase = createClient();

  const { data, error } = await (supabase
    .from("collections") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching collections:", error);
    throw new Error("Failed to fetch collections");
  }

  return data || [];
}

/**
 * Get a single collection by ID
 */
export async function getCollectionById(id: string): Promise<Collection | null> {
  const supabase = createClient();

  const { data, error } = await (supabase
    .from("collections") as any)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching collection:", error);
    return null;
  }

  return data;
}

/**
 * Create a new collection
 */
export async function createCollection(
  collectionData: CreateCollectionData
): Promise<Collection | null> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await (supabase
    .from("collections") as any)
    .insert({
      user_id: userData.user.id,
      name: collectionData.name,
      description: collectionData.description,
      color: collectionData.color,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating collection:", error);
    throw new Error("Failed to create collection");
  }

  return data;
}

/**
 * Update a collection
 */
export async function updateCollection(
  id: string,
  collectionData: UpdateCollectionData
): Promise<Collection | null> {
  const supabase = createClient();

  const { data, error } = await (supabase
    .from("collections") as any)
    .update({ ...collectionData })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating collection:", error);
    throw new Error("Failed to update collection");
  }

  return data;
}

/**
 * Delete a collection
 */
export async function deleteCollection(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await (supabase
    .from("collections") as any)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting collection:", error);
    throw new Error("Failed to delete collection");
  }

  return true;
}

/**
 * Get collection with card count
 */
export async function getCollectionWithStats(id: string) {
  const supabase = createClient();

  const { data, error } = await (supabase
    .from("collections") as any)
    .select(`
      *,
      card_collections(card_id)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching collection stats:", error);
    throw new Error("Failed to fetch collection stats");
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    card_count: data.card_collections?.length || 0,
  };
}

/**
 * Get all collections with card counts
 */
export async function getCollectionsWithStats() {
  const supabase = createClient();

  const { data, error } = await (supabase
    .from("collections") as any)
    .select(`
      *,
      card_collections(card_id)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching collections with stats:", error);
    throw new Error("Failed to fetch collections with stats");
  }

  return (data || []).map((collection: any) => ({
    ...collection,
    card_count: collection.card_collections?.length || 0,
  }));
}

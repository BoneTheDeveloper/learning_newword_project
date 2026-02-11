/**
 * Selection Operations
 *
 * Batch operations for managing card selection and saving to collections
 */

import { createClient } from "@/lib/supabase/client";
import type { CreateCardData } from "./cards";

export interface SaveToCollectionOptions {
  cardIds: string[];
  collectionId: string;
}

/**
 * Save multiple generated cards to database and add to collection
 */
export async function saveGeneratedCardsToCollection(
  generatedCards: CreateCardData[],
  collectionId: string
): Promise<{ success: boolean; cards: any[]; errors: string[] }> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const errors: string[] = [];

  // Create all cards first
  const cardsToInsert = generatedCards.map((card) => ({
    user_id: userData.user.id,
    ...card,
  }));

  const { data: createdCards, error: createError } = await (supabase
    .from("cards") as any)
    .insert(cardsToInsert)
    .select();

  if (createError) {
    console.error("Error creating cards:", createError);
    throw new Error("Failed to create cards");
  }

  if (!createdCards || createdCards.length === 0) {
    return { success: true, cards: [], errors: [] };
  }

  // Add all cards to collection
  const cardCollectionRelations = createdCards.map((card: any) => ({
    card_id: card.id,
    collection_id: collectionId,
  }));

  const { error: relationError } = await (supabase
    .from("card_collections") as any)
    .insert(cardCollectionRelations);

  if (relationError) {
    console.error("Error adding cards to collection:", relationError);
    // Cards were created but not added to collection
    return {
      success: false,
      cards: createdCards,
      errors: ["Cards created but failed to add to collection"],
    };
  }

  return {
    success: true,
    cards: createdCards,
    errors,
  };
}

/**
 * Save existing cards to a collection
 */
export async function addCardsToCollection(
  cardIds: string[],
  collectionId: string
): Promise<{ success: boolean; errors: string[] }> {
  const supabase = createClient();

  const relations = cardIds.map((cardId) => ({
    card_id: cardId,
    collection_id: collectionId,
  }));

  const { error } = await (supabase
    .from("card_collections") as any)
    .insert(relations);

  if (error) {
    console.error("Error adding cards to collection:", error);
    throw new Error("Failed to add cards to collection");
  }

  return { success: true, errors: [] };
}

/**
 * Remove cards from a collection
 */
export async function removeCardsFromCollection(
  cardIds: string[],
  collectionId: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await (supabase
    .from("card_collections") as any)
    .delete()
    .in("card_id", cardIds)
    .eq("collection_id", collectionId);

  if (error) {
    console.error("Error removing cards from collection:", error);
    throw new Error("Failed to remove cards from collection");
  }

  return true;
}

/**
 * Move cards between collections
 */
export async function moveCardsBetweenCollections(
  cardIds: string[],
  fromCollectionId: string,
  toCollectionId: string
): Promise<boolean> {
  const supabase = createClient();

  // Remove from source collection
  const { error: removeError } = await (supabase
    .from("card_collections") as any)
    .delete()
    .in("card_id", cardIds)
    .eq("collection_id", fromCollectionId);

  if (removeError) {
    console.error("Error removing from source collection:", removeError);
    throw new Error("Failed to remove cards from source collection");
  }

  // Add to destination collection
  const relations = cardIds.map((cardId) => ({
    card_id: cardId,
    collection_id: toCollectionId,
  }));

  const { error: addError } = await (supabase
    .from("card_collections") as any)
    .insert(relations);

  if (addError) {
    console.error("Error adding to destination collection:", addError);
    throw new Error("Failed to add cards to destination collection");
  }

  return true;
}

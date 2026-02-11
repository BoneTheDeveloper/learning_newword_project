/**
 * Cards Database Layer
 *
 * CRUD operations for vocabulary cards
 */

import { createClient } from "@/lib/supabase/client";
import type { SavedCard, Definition, Collocations, Synonym } from "@/types/vocabulary";

export interface CreateCardData {
  word: string;
  part_of_speech?: string;
  phonetic?: string;
  definitions: Array<{ text: string; examples: string[] }>;
  collocations?: {
    adjectiveNoun: string[];
    verbNoun: string[];
    nounPreposition: string[];
    adverbAdjective: string[];
  };
  synonyms?: Array<{ word: string; formality: string }>;
  difficulty?: string;
  context?: string;
}

export interface UpdateCardData extends Partial<CreateCardData> {}

export interface CardFilters {
  search?: string;
  difficulty?: string;
  part_of_speech?: string;
  collection_id?: string;
}

/**
 * Helper function to convert any card to SavedCard
 */
function toSavedCard(card: any): SavedCard {
  return {
    id: card.id,
    user_id: card.user_id,
    word: card.word,
    part_of_speech: card.part_of_speech,
    phonetic: card.phonetic,
    definitions: (card.definitions as any) as Definition[],
    collocations: (card.collocations as any) as Collocations,
    synonyms: (card.synonyms as any) as Synonym[],
    difficulty: card.difficulty,
    context: card.context,
    created_at: card.created_at,
    updated_at: card.updated_at,
    collections: card.collections || [],
  };
}

/**
 * Get all cards for current user with optional filters
 */
export async function getCards(filters?: CardFilters): Promise<SavedCard[]> {
  const supabase = createClient();

  let query = supabase
    .from("cards")
    .select(`
      *,
      collections:card_collections(
        collection_id,
        collections(name)
      )
    `)
    .order("created_at", { ascending: false });

  // Apply filters
  if (filters?.search) {
    query = query.ilike("word", `%${filters.search}%`);
  }

  if (filters?.difficulty) {
    query = query.eq("difficulty", filters.difficulty);
  }

  if (filters?.part_of_speech) {
    query = query.eq("part_of_speech", filters.part_of_speech);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching cards:", error);
    throw new Error("Failed to fetch cards");
  }

  // Transform data to include collections and convert JSON types
  return (data || []).map((card: any) => toSavedCard({
    ...card,
    collections: card.collections?.map((cc: any) => ({
      collection_id: cc.collection_id,
      name: cc.collections?.name,
    })) || [],
  }));
}

/**
 * Get a single card by ID
 */
export async function getCardById(id: string): Promise<SavedCard | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching card:", error);
    return null;
  }

  return data ? toSavedCard(data) : null;
}

/**
 * Create a new card
 */
export async function createCard(cardData: CreateCardData): Promise<SavedCard | null> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await (supabase
    .from("cards") as any)
    .insert({
      user_id: userData.user.id,
      word: cardData.word,
      part_of_speech: cardData.part_of_speech,
      phonetic: cardData.phonetic,
      definitions: cardData.definitions as any,
      collocations: cardData.collocations as any,
      synonyms: cardData.synonyms as any,
      difficulty: cardData.difficulty,
      context: cardData.context,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating card:", error);
    throw new Error("Failed to create card");
  }

  return data ? toSavedCard(data) : null;
}

/**
 * Create multiple cards in batch
 */
export async function createCards(cardsData: CreateCardData[]): Promise<SavedCard[]> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const cardsToInsert = cardsData.map((card) => ({
    user_id: userData.user.id,
    ...card,
  }));

  const { data, error } = await (supabase
    .from("cards") as any)
    .insert(cardsToInsert)
    .select();

  if (error) {
    console.error("Error creating cards:", error);
    throw new Error("Failed to create cards");
  }

  return (data || []).map((card: any) => toSavedCard(card));
}

/**
 * Update a card
 */
export async function updateCard(id: string, cardData: UpdateCardData): Promise<SavedCard | null> {
  const supabase = createClient();

  const { data, error } = await (supabase
    .from("cards") as any)
    .update({ ...cardData })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating card:", error);
    throw new Error("Failed to update card");
  }

  return data ? toSavedCard(data) : null;
}

/**
 * Delete a card
 */
export async function deleteCard(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from("cards").delete().eq("id", id);

  if (error) {
    console.error("Error deleting card:", error);
    throw new Error("Failed to delete card");
  }

  return true;
}

/**
 * Delete multiple cards in batch
 */
export async function deleteCards(ids: string[]): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from("cards").delete().in("id", ids);

  if (error) {
    console.error("Error deleting cards:", error);
    throw new Error("Failed to delete cards");
  }

  return true;
}

/**
 * Get cards for a specific collection
 */
export async function getCardsByCollectionId(
  collectionId: string
): Promise<SavedCard[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("card_collections")
    .select(`
      cards(*)
    `)
    .eq("collection_id", collectionId);

  if (error) {
    console.error("Error fetching collection cards:", error);
    throw new Error("Failed to fetch collection cards");
  }

  return (data || []).map((item: any) => toSavedCard({
    ...item.cards,
    collections: [{ collection_id: collectionId, name: "" }],
  }));
}

/**
 * Add card to collection
 */
export async function addCardToCollection(
  cardId: string,
  collectionId: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await (supabase
    .from("card_collections") as any)
    .insert({
      card_id: cardId,
      collection_id: collectionId,
    });

  if (error) {
    console.error("Error adding card to collection:", error);
    throw new Error("Failed to add card to collection");
  }

  return true;
}

/**
 * Remove card from collection
 */
export async function removeCardFromCollection(
  cardId: string,
  collectionId: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("card_collections")
    .delete()
    .eq("card_id", cardId)
    .eq("collection_id", collectionId);

  if (error) {
    console.error("Error removing card from collection:", error);
    throw new Error("Failed to remove card from collection");
  }

  return true;
}

/**
 * SRS Progress Database Layer
 *
 * Database operations for spaced repetition progress tracking
 */

import { createClient } from "@/lib/supabase/client";
import { calculateNextReview, type Sm2Quality, type Sm2Card } from "@/lib/srs/sm2";
import type { SavedCard } from "@/types/vocabulary";

export interface SrsProgress {
  id: string;
  card_id: string;
  user_id: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  last_review_at?: string;
  total_reviews: number;
  correct_reviews: number;
  incorrect_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface CardWithProgress extends SavedCard {
  progress?: SrsProgress;
  isDue?: boolean;
}

export interface ReviewCard {
  id: string;
  card_id: string;
  word: string;
  definitions: Array<{ text: string; examples: string[] }>;
  part_of_speech?: string;
  phonetic?: string;
  context?: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  started_at: string;
  completed_at?: string;
  cards_reviewed: number;
  cards_correct: number;
  collection_id?: string;
}

/**
 * Get SRS progress for a card
 */
export async function getSrsProgress(cardId: string): Promise<SrsProgress | null> {
  const supabase = createClient();

  const { data, error } = await (supabase
    .from("srs_progress") as any)
    .select("*")
    .eq("card_id", cardId)
    .single();

  if (error) {
    console.error("Error fetching SRS progress:", error);
    return null;
  }

  return data;
}

/**
 * Get SRS progress for all user's cards
 */
export async function getAllSrsProgress(): Promise<SrsProgress[]> {
  const supabase = createClient();

  const { data, error } = await (supabase
    .from("srs_progress") as any)
    .select("*")
    .order("next_review_at", { ascending: true });

  if (error) {
    console.error("Error fetching SRS progress:", error);
    return [];
  }

  return data || [];
}

/**
 * Get cards due for review
 */
export async function getDueCards(limit: number = 50): Promise<ReviewCard[]> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await (supabase
    .from("srs_progress") as any)
    .select(`
      *,
      cards:card_id(
        id,
        word,
        part_of_speech,
        phonetic,
        definitions,
        context
      )
    `)
    .eq("user_id", userData.user.id)
    .lte("next_review_at", new Date().toISOString())
    .order("next_review_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching due cards:", error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    card_id: item.card_id,
    word: item.cards?.word || "",
    definitions: (item.cards?.definitions as any) || [],
    part_of_speech: item.cards?.part_of_speech,
    phonetic: item.cards?.phonetic,
    context: item.cards?.context,
    ease_factor: item.ease_factor,
    interval_days: item.interval_days,
    repetitions: item.repetitions,
    next_review_at: item.next_review_at,
  }));
}

/**
 * Update SRS progress after a review
 */
export async function updateSrsProgress(
  cardId: string,
  quality: Sm2Quality
): Promise<SrsProgress | null> {
  const supabase = createClient();

  // Get current progress
  const currentProgress = await getSrsProgress(cardId);
  if (!currentProgress) {
    throw new Error("SRS progress not found for card");
  }

  // Calculate next review using SM-2
  const cardState: Sm2Card = {
    id: cardId,
    easeFactor: currentProgress.ease_factor,
    interval: currentProgress.interval_days,
    repetitions: currentProgress.repetitions,
    nextReviewDate: new Date(currentProgress.next_review_at),
    lastReviewDate: currentProgress.last_review_at
      ? new Date(currentProgress.last_review_at)
      : undefined,
  };

  const nextReview = calculateNextReview(cardState, quality);

  // Update progress
  const isCorrect = quality >= 3;

  const { data, error } = await (supabase
    .from("srs_progress") as any)
    .update({
      ease_factor: nextReview.easeFactor,
      interval_days: nextReview.interval,
      repetitions: nextReview.repetitions,
      next_review_at: nextReview.nextReviewDate.toISOString(),
      last_review_at: new Date().toISOString(),
      total_reviews: currentProgress.total_reviews + 1,
      correct_reviews: isCorrect
        ? currentProgress.correct_reviews + 1
        : currentProgress.correct_reviews,
      incorrect_reviews: !isCorrect
        ? currentProgress.incorrect_reviews + 1
        : currentProgress.incorrect_reviews,
    })
    .eq("card_id", cardId)
    .select()
    .single();

  if (error) {
    console.error("Error updating SRS progress:", error);
    throw new Error("Failed to update SRS progress");
  }

  return data;
}

/**
 * Initialize SRS progress for a new card
 */
export async function initializeSrsProgress(
  cardId: string
): Promise<SrsProgress | null> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await (supabase
    .from("srs_progress") as any)
    .insert({
      card_id: cardId,
      user_id: userData.user.id,
      ease_factor: 2.5,
      interval_days: 0,
      repetitions: 0,
      next_review_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error initializing SRS progress:", error);
    throw new Error("Failed to initialize SRS progress");
  }

  return data;
}

/**
 * Get study sessions
 */
export async function getStudySessions(limit: number = 10): Promise<StudySession[]> {
  const supabase = createClient();

  const { data, error } = await (supabase
    .from("study_sessions") as any)
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching study sessions:", error);
    return [];
  }

  return data || [];
}

/**
 * Create a new study session
 */
export async function createStudySession(
  collectionId?: string
): Promise<StudySession | null> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await (supabase
    .from("study_sessions") as any)
    .insert({
      user_id: userData.user.id,
      collection_id: collectionId || null,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating study session:", error);
    throw new Error("Failed to create study session");
  }

  return data;
}

/**
 * Update a study session with completion data
 */
export async function completeStudySession(
  sessionId: string,
  cardsReviewed: number,
  cardsCorrect: number
): Promise<StudySession | null> {
  const supabase = createClient();

  const { data, error } = await (supabase
    .from("study_sessions") as any)
    .update({
      completed_at: new Date().toISOString(),
      cards_reviewed: cardsReviewed,
      cards_correct: cardsCorrect,
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    console.error("Error completing study session:", error);
    throw new Error("Failed to complete study session");
  }

  return data;
}

/**
 * Get user statistics
 */
export interface UserStats {
  totalCards: number;
  cardsDueToday: number;
  totalReviews: number;
  accuracy: number;
  streak: number;
}

export async function getUserStats(): Promise<UserStats> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  // Get total cards
  const { count: totalCards } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id);

  // Get cards due today
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const { count: cardsDueToday } = await supabase
    .from("srs_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id)
    .lte("next_review_at", endOfDay.toISOString());

  // Get total reviews and accuracy
  const { data: progressData } = await (supabase
    .from("srs_progress") as any)
    .select("total_reviews, correct_reviews");

  let totalReviews = 0;
  let correctReviews = 0;

  if (progressData) {
    for (const row of progressData) {
      totalReviews += row.total_reviews || 0;
      correctReviews += row.correct_reviews || 0;
    }
  }

  const accuracy = totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0;

  return {
    totalCards: totalCards || 0,
    cardsDueToday: cardsDueToday || 0,
    totalReviews,
    accuracy: Math.round(accuracy),
    streak: 0, // TODO: Implement streak calculation
  };
}

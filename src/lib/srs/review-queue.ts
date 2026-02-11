/**
 * SRS Review Queue Management
 *
 * Manages the queue of cards due for review and handles review sessions
 */

import type { Sm2Card, Sm2Quality } from "./sm2";

export interface ReviewCard extends Sm2Card {
  // Additional properties for the review interface
  word: string;
  definitions: Array<{ text: string; examples: string[] }>;
  part_of_speech?: string;
  phonetic?: string;
  context?: string;
}

export interface ReviewSession {
  id: string;
  userId: string;
  cards: ReviewCard[];
  currentIndex: number;
  correctAnswers: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface ReviewStats {
  totalCards: number;
  cardsReviewed: number;
  correctAnswers: number;
  accuracy: number;
  avgEaseFactor: number;
}

/**
 * Calculate review statistics from a completed session
 */
export function calculateReviewStats(session: ReviewSession): ReviewStats {
  const cardsReviewed = session.currentIndex;
  const totalCards = session.cards.length;
  const accuracy = totalCards > 0 ? (session.correctAnswers / totalCards) * 100 : 0;

  const avgEaseFactor =
    totalCards > 0
      ? session.cards.reduce((sum, card) => sum + card.easeFactor, 0) / totalCards
      : 2.5;

  return {
    totalCards,
    cardsReviewed,
    correctAnswers: session.correctAnswers,
    accuracy,
    avgEaseFactor,
  };
}

/**
 * Get the current card to review in a session
 */
export function getCurrentCard(session: ReviewSession): ReviewCard | null {
  if (session.currentIndex >= session.cards.length) {
    return null;
  }
  return session.cards[session.currentIndex];
}

/**
 * Move to the next card in the review session
 */
export function advanceToNextCard(session: ReviewSession): ReviewSession {
  return {
    ...session,
    currentIndex: session.currentIndex + 1,
  };
}

/**
 * Check if the review session is complete
 */
export function isSessionComplete(session: ReviewSession): boolean {
  return session.currentIndex >= session.cards.length;
}

/**
 * Mark a card as correct and advance
 */
export function markCardCorrect(session: ReviewSession): ReviewSession {
  return {
    ...session,
    correctAnswers: session.correctAnswers + 1,
    currentIndex: session.currentIndex + 1,
  };
}

/**
 * Update session with review result and move to next card
 */
export function submitReview(
  session: ReviewSession,
  _quality: Sm2Quality
): ReviewSession {
  // The quality rating will be used to update the card's SRS parameters
  // This is handled separately in the database layer
  return advanceToNextCard(session);
}

/**
 * Complete the review session
 */
export function completeSession(session: ReviewSession): ReviewSession {
  return {
    ...session,
    completedAt: new Date(),
  };
}

/**
 * Calculate streak information
 */
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastReviewDate: Date | null;
}

/**
 * Get cards due today (within 24 hours)
 */
export function getCardsDueToday(cards: Sm2Card[]): Sm2Card[] {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  return cards.filter((card) => {
    return card.nextReviewDate <= endOfDay;
  });
}

/**
 * Get cards due by specific date
 */
export function getCardsDueByDate(cards: Sm2Card[], date: Date): Sm2Card[] {
  return cards.filter((card) => card.nextReviewDate <= date);
}

/**
 * Get upcoming cards in the next N days
 */
export function getUpcomingCards(cards: Sm2Card[], days: number): {
  today: Sm2Card[];
  tomorrow: Sm2Card[];
  week: Sm2Card[];
} {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);

  const week = new Date(now);
  week.setDate(week.getDate() + days);
  week.setHours(23, 59, 59, 999);

  const todayCards: Sm2Card[] = [];
  const tomorrowCards: Sm2Card[] = [];
  const weekCards: Sm2Card[] = [];

  for (const card of cards) {
    if (card.nextReviewDate <= tomorrow) {
      todayCards.push(card);
    } else if (card.nextReviewDate <= week) {
      tomorrowCards.push(card);
    }
    weekCards.push(card);
  }

  return {
    today: todayCards,
    tomorrow: tomorrowCards,
    week: weekCards,
  };
}

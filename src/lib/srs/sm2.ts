/**
 * SM-2 Algorithm Implementation
 *
 * SuperMemo 2 (SM-2) algorithm for spaced repetition scheduling.
 * Based on the original algorithm by Piotr Woźniak.
 *
 * Reference: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

export interface Sm2Card {
  id: string;
  easeFactor: number;
  interval: number; // in days
  repetitions: number;
  nextReviewDate: Date;
  lastReviewDate?: Date;
}

export interface Sm2ReviewResult {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

export type Sm2Quality = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Quality rating for SM-2 algorithm:
 * 5 - perfect response
 * 4 - correct response after a hesitation
 * 3 - correct response recalled with serious difficulty
 * 2 - incorrect response; where the correct one seemed easy to recall
 * 1 - incorrect response; the correct one remembered
 * 0 - complete blackout
 */

export const SM2_QUALITY_LABELS: Record<Sm2Quality, string> = {
  0: "Again",
  1: "Hard",
  2: "Hard",
  3: "Good",
  4: "Good",
  5: "Easy",
};

/**
 * Default parameters for SM-2 algorithm
 */
const DEFAULT_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;
const DEFAULT_INTERVAL = 1; // 1 day for first review

/**
 * Calculate next review parameters using SM-2 algorithm
 *
 * @param card - Current card state
 * @param quality - Quality rating (0-5) from user's response
 * @returns New card state with updated parameters
 */
export function calculateNextReview(
  card: Sm2Card,
  quality: Sm2Quality
): Sm2ReviewResult {
  let { easeFactor, interval, repetitions } = card;

  // If quality < 3, reset repetitions and interval
  if (quality < 3) {
    repetitions = 0;
    interval = DEFAULT_INTERVAL;
  } else {
    // Increment repetitions
    repetitions += 1;

    // Calculate new interval based on repetitions
    if (repetitions === 1) {
      interval = DEFAULT_INTERVAL;
    } else if (repetitions === 2) {
      interval = 6; // 6 days
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ensure ease factor doesn't go below minimum
  if (easeFactor < MINIMUM_EASE_FACTOR) {
    easeFactor = MINIMUM_EASE_FACTOR;
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
  };
}

/**
 * Initialize a new card with default SM-2 parameters
 *
 * @param id - Card ID
 * @returns Initial card state
 */
export function initializeCard(id: string): Omit<Sm2Card, 'nextReviewDate'> & { nextReviewDate: Date } {
  return {
    id,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date(), // Due immediately
  };
}

/**
 * Check if a card is due for review
 *
 * @param card - Card to check
 * @returns True if card is due for review
 */
export function isCardDue(card: Sm2Card): boolean {
  return new Date() >= card.nextReviewDate;
}

/**
 * Get cards that are due for review from a list of cards
 *
 * @param cards - All cards to check
 * @returns Cards that are due for review
 */
export function getDueCards(cards: Sm2Card[]): Sm2Card[] {
  return cards.filter(isCardDue);
}

/**
 * Calculate the number of days until next review
 *
 * @param card - Card to check
 * @returns Number of days until next review (0 if due)
 */
export function getDaysUntilReview(card: Sm2Card): number {
  const now = new Date();
  const diffTime = card.nextReviewDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Convert SRS response button labels to quality ratings
 *
 * Maps UI button clicks to quality ratings:
 * - "Again" -> 0 (complete blackout, reset)
 * - "Hard" -> 2 (incorrect but easy to recall)
 * - "Good" -> 3 (correct with difficulty) or 4 (correct with hesitation)
 * - "Easy" -> 5 (perfect response)
 */
export function responseButtonToQuality(
  button: "again" | "hard" | "good" | "easy"
): Sm2Quality {
  switch (button) {
    case "again":
      return 0;
    case "hard":
      return 2;
    case "good":
      return 4;
    case "easy":
      return 5;
  }
}

/**
 * Get recommended quality based on response time
 * This is optional and can be used for automatic quality assessment
 *
 * @param wasCorrect - Whether the answer was correct
 * @param responseTimeMs - Time taken to respond in milliseconds
 * @returns Quality rating
 */
export function calculateQualityFromResponse(
  wasCorrect: boolean,
  responseTimeMs: number
): Sm2Quality {
  if (!wasCorrect) {
    // If incorrect, determine quality based on whether they remembered afterwards
    // This is a simplified version - actual implementation might need more context
    return 1;
  }

  // If correct, determine quality based on response time
  // These thresholds are adjustable based on user feedback
  if (responseTimeMs < 3000) {
    return 5; // Easy - quick response
  } else if (responseTimeMs < 10000) {
    return 4; // Good - reasonable response time
  } else {
    return 3; // Good but struggled - took a long time
  }
}

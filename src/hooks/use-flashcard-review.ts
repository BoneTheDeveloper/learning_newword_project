/**
 * Flashcard Review Hook
 *
 * React hook for managing flashcard review sessions
 */

import { useState, useCallback, useEffect } from "react";
import type { Sm2Quality } from "@/lib/srs/sm2";
import type { ReviewCard, ReviewSession } from "@/lib/srs/review-queue";
import {
  getCurrentCard,
  isSessionComplete,
  submitReview,
  completeSession,
  type ReviewStats,
  calculateReviewStats,
} from "@/lib/srs/review-queue";

export interface UseFlashcardReviewOptions {
  cards: ReviewCard[];
  onCardReviewed?: (cardId: string, quality: Sm2Quality) => Promise<void>;
  onSessionComplete?: (session: ReviewSession, stats: ReviewStats) => Promise<void>;
}

export interface UseFlashcardReviewReturn {
  session: ReviewSession | null;
  currentCard: ReviewCard | null;
  isComplete: boolean;
  stats: ReviewStats | null;
  isLoading: boolean;
  error: string | null;
  startSession: () => void;
  submitAnswer: (quality: Sm2Quality) => Promise<void>;
  skipCard: () => void;
  resetSession: () => void;
}

export function useFlashcardReview({
  cards,
  onCardReviewed,
  onSessionComplete,
}: UseFlashcardReviewOptions): UseFlashcardReviewReturn {
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current card from session
  const currentCard = session ? getCurrentCard(session) : null;
  const isComplete = session ? isSessionComplete(session) : false;
  const stats = session && isComplete ? calculateReviewStats(session) : null;

  // Start a new review session
  const startSession = useCallback(() => {
    if (cards.length === 0) {
      setError("No cards available for review");
      return;
    }

    const newSession: ReviewSession = {
      id: crypto.randomUUID(),
      userId: "", // Will be set by database
      cards: [...cards],
      currentIndex: 0,
      correctAnswers: 0,
      startedAt: new Date(),
    };

    setSession(newSession);
    setError(null);
  }, [cards]);

  // Submit an answer for the current card
  const submitAnswer = useCallback(
    async (quality: Sm2Quality) => {
      if (!session || !currentCard) {
        setError("No active session or current card");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Call the callback to update the card in the database
        if (onCardReviewed) {
          await onCardReviewed(currentCard.id, quality);
        }

        // Update session state
        let updatedSession = submitReview(session, quality);

        // Track correct answers (quality >= 3 is considered correct)
        if (quality >= 3) {
          updatedSession = {
            ...updatedSession,
            correctAnswers: updatedSession.correctAnswers + 1,
          };
        }

        // Check if session is complete
        if (isSessionComplete(updatedSession)) {
          updatedSession = completeSession(updatedSession);
          setSession(updatedSession);

          // Call session complete callback
          if (onSessionComplete) {
            const finalStats = calculateReviewStats(updatedSession);
            await onSessionComplete(updatedSession, finalStats);
          }
        } else {
          setSession(updatedSession);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit answer");
      } finally {
        setIsLoading(false);
      }
    },
    [session, currentCard, onCardReviewed, onSessionComplete]
  );

  // Skip the current card (marks as quality 1)
  const skipCard = useCallback(() => {
    submitAnswer(1);
  }, [submitAnswer]);

  // Reset the session
  const resetSession = useCallback(() => {
    setSession(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Auto-start session when cards change if not already in a session
  useEffect(() => {
    if (!session && cards.length > 0) {
      startSession();
    }
  }, [cards, session, startSession]);

  return {
    session,
    currentCard,
    isComplete,
    stats,
    isLoading,
    error,
    startSession,
    submitAnswer,
    skipCard,
    resetSession,
  };
}

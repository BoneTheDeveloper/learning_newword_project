"use client";

/**
 * Study Page
 *
 * Main page for reviewing flashcards using spaced repetition
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFlashcardReview } from "@/hooks/use-flashcard-review";
import { FlashcardReview } from "@/components/study/flashcard-review";
import { ReviewSummary } from "@/components/study/review-summary";
import { updateSrsProgress, completeStudySession } from "@/lib/db/srs-progress";
import type { ReviewCard } from "@/lib/srs/review-queue";
import type { Sm2Quality } from "@/lib/srs/sm2";
import type { ReviewSession } from "@/lib/srs/review-queue";
import type { ReviewStats } from "@/lib/srs/review-queue";

export default function StudyPage() {
  const router = useRouter();
  const [dueCards, setDueCards] = useState<ReviewCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Fetch due cards on mount
  useEffect(() => {
    async function fetchDueCards() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/study/due");
        if (!response.ok) {
          throw new Error("Failed to fetch due cards");
        }
        const data = await response.json();
        setDueCards(data.cards || []);

        // Create a new study session
        if (data.cards && data.cards.length > 0) {
          const sessionResponse = await fetch("/api/study/session", {
            method: "POST",
          });
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            setSessionId(sessionData.session.id);
          }
        }
      } catch (error) {
        console.error("Error fetching due cards:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDueCards();
  }, []);

  // Handle card review
  const handleCardReviewed = async (cardId: string, quality: Sm2Quality) => {
    try {
      await updateSrsProgress(cardId, quality);
      setShowAnswer(false);
    } catch (error) {
      console.error("Error updating SRS progress:", error);
    }
  };

  // Handle session completion
  const handleSessionComplete = async (_session: ReviewSession, stats: ReviewStats) => {
    if (sessionId) {
      try {
        await completeStudySession(
          sessionId,
          stats.totalCards,
          stats.correctAnswers
        );
      } catch (error) {
        console.error("Error completing study session:", error);
      }
    }
  };

  // Use flashcard review hook
  const {
    currentCard,
    isComplete,
    stats,
    submitAnswer,
    resetSession,
  } = useFlashcardReview({
    cards: dueCards,
    onCardReviewed: handleCardReviewed,
    onSessionComplete: handleSessionComplete,
  });

  // Handle answer toggle
  const handleToggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  // Handle skip
  const handleSkip = () => {
    if (currentCard) {
      submitAnswer(1);
    }
  };

  // Handle response button click
  const handleResponse = (quality: Sm2Quality) => {
    if (currentCard) {
      submitAnswer(quality);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading flashcards...
          </p>
        </div>
      </div>
    );
  }

  // No cards due
  if (dueCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
            All caught up!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You have no cards due for review right now. Come back later!
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Session complete - show summary
  if (isComplete && stats) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ReviewSummary
          cardsReviewed={stats.totalCards}
          correctAnswers={stats.correctAnswers}
          accuracy={stats.accuracy}
          avgEaseFactor={stats.avgEaseFactor}
          onRestart={resetSession}
          onBackToDashboard={() => router.push("/dashboard")}
        />
      </div>
    );
  }

  // Active review session
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
            Review Session
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Practice your vocabulary using spaced repetition
          </p>
        </div>

        {currentCard && (
          <FlashcardReview
            key={currentCard.id}
            card={currentCard}
            currentIndex={dueCards.findIndex((c) => c.id === currentCard.id)}
            totalCards={dueCards.length}
            onResponse={handleResponse}
            onSkip={handleSkip}
            showAnswer={showAnswer}
            onToggleAnswer={handleToggleAnswer}
          />
        )}
      </div>
    </div>
  );
}

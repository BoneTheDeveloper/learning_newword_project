"use client";

/**
 * Flashcard Review Component
 *
 * Flashcard review interface with SRS response buttons
 */

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { ReviewCard } from "@/lib/srs/review-queue";
import { cn } from "@/lib/utils";

export interface FlashcardReviewProps {
  card: ReviewCard;
  currentIndex: number;
  totalCards: number;
  onResponse: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
  onSkip?: () => void;
  showAnswer?: boolean;
  onToggleAnswer?: () => void;
}

export function FlashcardReview({
  card,
  currentIndex,
  totalCards,
  onResponse,
  onSkip,
  showAnswer = false,
  onToggleAnswer,
}: FlashcardReviewProps) {
  const [isFlipped, setIsFlipped] = useState(showAnswer);

  // Handle answer toggle
  const handleToggle = () => {
    const newState = !isFlipped;
    setIsFlipped(newState);
    onToggleAnswer?.();
  };

  // Handle response button click
  const handleResponse = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    onResponse(quality);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Card {currentIndex + 1} of {totalCards}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSkip}
            className="text-gray-600 hover:text-gray-800"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Skip
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / totalCards) * 100}%`,
          }}
        />
      </div>

      {/* Flashcard */}
      <Card
        className={cn(
          "relative min-h-[400px] cursor-pointer transition-all duration-500",
          "bg-white dark:bg-slate-900",
          isFlipped ? "shadow-xl" : "shadow-lg"
        )}
        onClick={handleToggle}
      >
        <div className="p-8">
          {/* Front of card (word) */}
          {!isFlipped ? (
            <div className="flex flex-col items-center justify-center min-h-[320px]">
              <div className="text-center">
                <h2 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-4">
                  {card.word}
                </h2>

                {card.phonetic && (
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    /{card.phonetic}/
                  </p>
                )}

                {card.part_of_speech && (
                  <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                    {card.part_of_speech}
                  </span>
                )}
              </div>

              <div className="mt-8 text-gray-400 dark:text-gray-500 text-sm">
                Click to reveal answer
              </div>
            </div>
          ) : (
            /* Back of card (definitions and examples) */
            <div className="flex flex-col min-h-[320px]">
              <div className="text-center mb-6">
                <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
                  {card.word}
                </h3>
                {card.phonetic && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    /{card.phonetic}/
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-6">
                {card.definitions.map((def, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">
                      {index + 1}. {def.text}
                    </p>
                    {def.examples.length > 0 && (
                      <ul className="space-y-1">
                        {def.examples.map((example, i) => (
                          <li
                            key={i}
                            className="text-gray-600 dark:text-gray-400 text-sm italic"
                          >
                            &quot;{example}&quot;
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {card.context && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Context:</span> {card.context}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Response Buttons (only show when answer is revealed) */}
      {isFlipped && (
        <div className="mt-6 grid grid-cols-4 gap-3">
          <Button
            onClick={() => handleResponse(0)}
            variant="outline"
            className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            Again
          </Button>
          <Button
            onClick={() => handleResponse(2)}
            variant="outline"
            className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30"
          >
            Hard
          </Button>
          <Button
            onClick={() => handleResponse(4)}
            variant="outline"
            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            Good
          </Button>
          <Button
            onClick={() => handleResponse(5)}
            variant="outline"
            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30"
          >
            Easy
          </Button>
        </div>
      )}

      {/* Helper text for response buttons */}
      {isFlipped && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Rate how well you knew this answer to schedule the next review
        </div>
      )}
    </div>
  );
}

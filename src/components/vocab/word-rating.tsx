"use client";

/**
 * Word Rating Component
 *
 * Phase 1: Interactive star rating for word quality feedback
 * Integrates with V2.0 personalization system
 */

import { useState, useCallback } from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface WordRatingProps {
  wordId: string;
  word: string;
  userRating?: number | null;
  communityRating?: number;
  ratingCount?: number;
  onRate?: (rating: number) => Promise<void>;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

type RatingState = "idle" | "rating" | "success" | "error";

// ============================================================================
// Size Configurations
// ============================================================================

const SIZE_CONFIG = {
  sm: { star: "w-4 h-4", container: "gap-0.5", text: "text-xs" },
  md: { star: "w-5 h-5", container: "gap-1", text: "text-sm" },
  lg: { star: "w-6 h-6", container: "gap-1.5", text: "text-base" },
} as const;

// ============================================================================
// Component
// ============================================================================

export function WordRating({
  wordId: _wordId,
  word,
  userRating = null,
  communityRating = 0,
  ratingCount = 0,
  onRate,
  readonly = false,
  size = "md",
}: WordRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [state, setState] = useState<RatingState>("idle");
  const [displayRating, setDisplayRating] = useState(userRating);

  const sizeClass = SIZE_CONFIG[size];
  const hasUserRating = userRating !== null && userRating > 0;

  // Handle star click
  const handleRate = useCallback(
    async (rating: number) => {
      if (readonly || !onRate) return;

      setState("rating");

      try {
        await onRate(rating);
        setDisplayRating(rating);
        setState("success");
      } catch (error) {
        console.error("Failed to submit rating:", error);
        setState("error");
      }

      // Reset state after delay
      setTimeout(() => setState("idle"), 2000);
    },
    [readonly, onRate]
  );

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (readonly || !onRate) return;

      const key = e.key;
      if (key >= "1" && key <= "5") {
        e.preventDefault();
        handleRate(parseInt(key, 10));
      }
    },
    [readonly, onRate, handleRate]
  );

  // Get star icon based on fill state
  const getStarIcon = (index: number) => {
    const ratingValue = hoverRating || displayRating || 0;
    const filled = index <= ratingValue;
    const half = !filled && index === Math.ceil(ratingValue) && index > ratingValue;

    if (half) {
      return <StarHalf className="w-full h-full" />;
    }
    return <Star className="w-full h-full" />;
  };

  // Get star color class
  const getStarColor = (index: number) => {
    const ratingValue = hoverRating || displayRating || 0;
    const filled = index <= ratingValue;

    if (filled) {
      return "text-amber-400 fill-amber-400";
    }
    return "text-gray-300 dark:text-gray-600";
  };

  return (
    <div
      className="inline-flex flex-col items-center gap-1"
      role="group"
      aria-label={`Rate ${word}: ${displayRating || 0} out of 5 stars`}
    >
      {/* Stars */}
      {!readonly && (
        <div
          className={cn(
            "flex items-center",
            sizeClass.container,
            "transition-opacity",
            state === "rating" && "opacity-50 pointer-events-none"
          )}
          role="slider"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={displayRating || 0}
          aria-valuetext={`${displayRating || 0} stars`}
          tabIndex={readonly ? -1 : 0}
          onKeyDown={handleKeyDown}
        >
          {[1, 2, 3, 4, 5].map((index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "p-0.5 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                sizeClass.star
              )}
              onClick={() => handleRate(index)}
              onMouseEnter={() => setHoverRating(index)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${index} stars`}
              disabled={readonly || state === "rating"}
            >
              <svg
                viewBox="0 0 24 24"
                className={cn(
                  "transition-colors",
                  getStarColor(index)
                )}
                fill="currentColor"
              >
                {getStarIcon(index)}
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Readonly display */}
      {readonly && (displayRating ?? 0) > 0 && (
        <div
          className={cn("flex items-center", sizeClass.container)}
          aria-label={`Your rating: ${displayRating} stars`}
        >
          {[1, 2, 3, 4, 5].map((index) => (
            <svg
              key={index}
              viewBox="0 0 24 24"
              className={cn(
                sizeClass.star,
                getStarColor(index)
              )}
              fill="currentColor"
            >
              {getStarIcon(index)}
            </svg>
          ))}
        </div>
      )}

      {/* Community rating */}
      <div className={cn("flex items-center gap-1", sizeClass.text)}>
        {!readonly && (
          <>
            {state === "success" && (
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                Saved!
              </span>
            )}
            {state === "error" && (
              <span className="text-red-600 dark:text-red-400 text-xs font-medium">
                Failed
              </span>
            )}
          </>
        )}

        <span
          className={cn(
            "text-gray-600 dark:text-gray-400 font-medium",
            hasUserRating && "text-gray-500 dark:text-gray-500"
          )}
        >
          {communityRating > 0 ? communityRating.toFixed(1) : "—"}
        </span>

        <span
          className={cn(
            "text-gray-500 dark:text-gray-500",
            sizeClass.text
          )}
        >
          ({ratingCount.toLocaleString()})
        </span>
      </div>
    </div>
  );
}

/**
 * Compact word rating badge (for card lists)
 */
export interface WordRatingBadgeProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}

export function WordRatingBadge({
  rating,
  count = 0,
  size = "sm",
}: WordRatingBadgeProps) {
  const sizeClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700",
        sizeClass
      )}
      aria-label={`${rating.toFixed(1)} stars from ${count} ratings`}
    >
      <Star className="w-3 h-3 text-amber-500 dark:text-amber-400 fill-amber-500" />
      <span className="font-semibold text-amber-700 dark:text-amber-300">
        {rating.toFixed(1)}
      </span>
      {count > 0 && (
        <span className="text-amber-600 dark:text-amber-400">
          ({count})
        </span>
      )}
    </div>
  );
}

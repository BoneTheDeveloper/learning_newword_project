"use client";

/**
 * Example Display Component
 *
 * Phase 4: Contextual example display with ratings
 * Simplified version without filters to avoid encoding issues
 */

import { useState, useCallback } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ContextExample {
  id: string;
  word_id: string;
  sentence: string;
  context_type: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  language: string;
  translation?: string | null;
  is_community: boolean;
  is_ai_generated: boolean;
  rating_avg?: number;
  rating_count?: number;
  user_rating?: number | null;
  created_at: string;
}

export interface ExampleCardProps {
  example: ContextExample;
  onRate?: (exampleId: string, rating: number) => Promise<void>;
  onCopy?: (text: string) => void;
  onRegenerate?: (exampleId: string) => void;
  showSource?: boolean;
  compact?: boolean;
}

export interface ExampleDisplayProps {
  examples?: ContextExample[];
  loading?: boolean;
  onRegenerate?: () => void;
  onRate?: (exampleId: string, rating: number) => Promise<void>;
  onCopy?: (text: string) => void;
}

const CONTEXT_COLORS: Record<string, string> = {
  business: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  academic: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  casual: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  medical: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  technical: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  creative: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
  general: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  advanced: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export function ExampleCard({
  example,
  onRate,
  onCopy,
  onRegenerate,
  showSource = true,
  compact = false,
}: ExampleCardProps) {
  const [rating, setRating] = useState(example.user_rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [copied, setCopied] = useState(false);
  const [ratingState, setRatingState] = useState<"idle" | "rating" | "success" | "error">("idle");

  const handleRate = useCallback(async () => {
    if (!onRate || rating === 0) return;

    setRatingState("rating");
    try {
      await onRate(example.id, rating);
      setRatingState("success");
    } catch (error) {
      console.error("Failed to rate example:", error);
      setRatingState("error");
    }

    setTimeout(() => setRatingState("idle"), 2000);
  }, [rating, onRate, example.id]);

  const handleCopy = useCallback(() => {
    if (onCopy) {
      onCopy(example.sentence);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [onCopy, example.sentence]);

  // Wrapper for handleRate to set rating first
  const handleStarClick = useCallback(
    (star: number) => {
      setRating(star);
      handleRate();
    },
    [handleRate]
  );

  const contextColor = CONTEXT_COLORS[example.context_type] || CONTEXT_COLORS.general;
  const difficultyColor = DIFFICULTY_COLORS[example.difficulty_level];

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        compact ? "p-4" : "p-5"
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={cn("capitalize", contextColor)}>
            {example.context_type.replace(/-/g, " ")}
          </Badge>

          <Badge className={difficultyColor}>
            {example.difficulty_level}
          </Badge>

          {showSource && (
            <Badge
              variant={example.is_ai_generated ? "secondary" : "success"}
              className="text-xs"
            >
              {example.is_ai_generated ? "AI" : "Community"}
            </Badge>
          )}
        </div>

        <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
          {example.sentence}
        </p>

        {example.translation && !compact && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            {example.translation}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 rounded"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star} stars`}
                  disabled={ratingState === "rating"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={cn(
                      "w-4 h-4 transition-colors",
                      (hoverRating || rating) >= star
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300 dark:text-gray-600"
                    )}
                  >
                    {star <= 5 ? (
                      <path d="M12 2l3.09 6.26L22 9.27l-6.91 1.83-2.91 5.18-6.91 1.83L15.55 4.36 4.27 9.27 12 2z" />
                    ) : (
                      <path d="M12 2l3.09 6.26L22 9.27l-6.91 1.83-2.91 5.18-6.91 1.83L15.55 4.36 4.27 9.27 12 2z M12 15.5a.5.5 0 01-.5-.5.5-.5 0 01-.5-.5z" fill="none" stroke="currentColor" strokeWidth="2" />
                    )}
                  </svg>
                </button>
              ))}
            </div>

            {example.rating_avg !== undefined && example.rating_count !== undefined && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {example.rating_avg.toFixed(1)} ({example.rating_count})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400",
                copied && "text-emerald-600 dark:text-emerald-400"
              )}
              onClick={handleCopy}
              aria-label="Copy example"
            >
              {copied ? (
                <span className="text-xs font-medium">Copied!</span>
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>

            {onRegenerate && example.is_ai_generated && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                onClick={() => onRegenerate(example.id)}
                aria-label="Regenerate example"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {ratingState === "success" && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
            Thanks for your feedback!
          </p>
        )}
        {ratingState === "error" && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            Failed to submit rating. Try again.
          </p>
        )}
      </div>
    </Card>
  );
}

export function ExampleDisplay({
  examples = [],
  loading = false,
  onRegenerate,
  onRate,
  onCopy,
}: ExampleDisplayProps) {
  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-indigo-600" />
        </div>
      ) : (
        <>
          {examples.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {examples.map((example) => (
                <ExampleCard
                  key={example.id}
                  example={example}
                  onRate={onRate}
                  onCopy={onCopy}
                  onRegenerate={onRegenerate}
                  showSource={true}
                  compact={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 bg-gray-50 dark:bg-slate-900 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                No examples available for this word yet.
              </p>
              {onRegenerate && (
                <Button onClick={onRegenerate} className="mt-2">
                  Generate Examples
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

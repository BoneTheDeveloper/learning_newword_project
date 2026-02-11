"use client";

/**
 * Review Summary Component
 *
 * Displays statistics and summary after completing a review session
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, TrendingUp, Award } from "lucide-react";

export interface ReviewSummaryProps {
  cardsReviewed: number;
  correctAnswers: number;
  accuracy: number;
  avgEaseFactor: number;
  onRestart: () => void;
  onBackToDashboard: () => void;
}

export function ReviewSummary({
  cardsReviewed,
  correctAnswers,
  accuracy,
  avgEaseFactor: _avgEaseFactor,
  onRestart,
  onBackToDashboard,
}: ReviewSummaryProps) {
  const incorrectAnswers = cardsReviewed - correctAnswers;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-white dark:bg-slate-900 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-2">
            Session Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Great job! You&apos;ve completed this review session.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Cards Reviewed */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {cardsReviewed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cards Reviewed
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {accuracy.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
          </div>

          {/* Correct */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                {correctAnswers}
              </span>
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">
              Correct
            </div>
          </div>

          {/* Incorrect */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-2xl font-bold text-red-700 dark:text-red-300">
                {incorrectAnswers}
              </span>
            </div>
            <div className="text-sm text-red-600 dark:text-red-400 mt-1">
              Need Review
            </div>
          </div>
        </div>

        {/* Performance Message */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-indigo-900 dark:text-indigo-100 mb-1">
                Performance Summary
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                {accuracy >= 80
                  ? "Excellent work! Your memory is strong and these cards are well-learned."
                  : accuracy >= 60
                  ? "Good progress! Keep practicing to strengthen your recall."
                  : "Keep at it! Regular practice will help improve your retention."}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onRestart}
            className="flex-1"
          >
            Review Again
          </Button>
          <Button
            onClick={onBackToDashboard}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}

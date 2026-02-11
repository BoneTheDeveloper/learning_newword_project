"use client";

/**
 * Loading State Component
 *
 * Phase 03: Loading animation for vocabulary generation
 */

import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export function LoadingState({
  message = "AI is generating your vocabulary...",
  subtext = "This usually takes 10-15 seconds",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Spinner */}
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
        <Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400 absolute top-0 left-0 animate-spin" />
      </div>

      {/* Message */}
      <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2 text-center">
        {message}
      </h3>

      {/* Subtext */}
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {subtext}
      </p>

      {/* Animated dots */}
      <div className="flex gap-2 mt-6">
        <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  );
}

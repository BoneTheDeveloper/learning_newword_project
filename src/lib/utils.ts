import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  return date.toLocaleDateString();
}

/**
 * Format date to short format (e.g., "Jan 15, 2026")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Calculate SRS interval based on response
 * Based on SM-2 algorithm simplified
 */
export function calculateNextReview(
  response: "again" | "hard" | "good" | "easy",
  currentInterval: number = 0,
  easeFactor: number = 2.5
): { interval: number; easeFactor: number } {
  let newInterval = currentInterval;
  let newEaseFactor = easeFactor;

  switch (response) {
    case "again":
      newInterval = 0; // Review again in 1 minute
      newEaseFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    case "hard":
      if (currentInterval === 0) {
        newInterval = 6; // 6 minutes
      } else {
        newInterval = Math.floor(currentInterval * 1.2);
      }
      newEaseFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    case "good":
      if (currentInterval === 0) {
        newInterval = 10; // 10 minutes
      } else {
        newInterval = Math.floor(currentInterval * easeFactor);
      }
      break;
    case "easy":
      if (currentInterval === 0) {
        newInterval = 4 * 24 * 60; // 4 days in minutes
      } else {
        newInterval = Math.floor(currentInterval * easeFactor * 1.3);
      }
      newEaseFactor = easeFactor + 0.15;
      break;
  }

  return { interval: newInterval, easeFactor: newEaseFactor };
}

/**
 * Get SRS response color class
 */
export function getSrsColor(response: "again" | "hard" | "good" | "easy"): string {
  const colors = {
    again: "bg-red-500 hover:bg-red-600",
    hard: "bg-orange-500 hover:bg-orange-600",
    good: "bg-emerald-500 hover:bg-emerald-600",
    easy: "bg-teal-500 hover:bg-teal-600",
  };
  return colors[response];
}

/**
 * Get difficulty badge color
 */
export function getDifficultyColor(difficulty: "easy" | "medium" | "hard"): string {
  const colors = {
    easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    hard: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  };
  return colors[difficulty];
}

/**
 * Get status badge color
 */
export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    learning: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
    mastered: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
    review: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  };
  return colors[status] || colors.new;
}

"use client";

/**
 * SRS Progress Visualization Component
 *
 * Phase 5: Visual dashboard for study progress, streaks, and statistics
 * Integrates with V2.0 SRS system
 */

import { useState, useEffect, useMemo } from "react";
import {
  Flame,
  Zap,
  Trophy,
  Sparkles,
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface SrsStats {
  totalWords: number;
  wordsDue: number;
  streakDays: number;
  retentionRate: number;
  reviewsToday: number;
  dailyGoal: number;
  stageDistribution: {
    new: number;
    learning: number;
    review: number;
    graduated: number;
  };
  weeklyActivity: { day: string; reviews: number }[];
}

export interface SRSProgressProps {
  userId?: string;
  timeRange?: "week" | "month" | "year";
  showActions?: boolean;
  compact?: boolean;
  onStartReview?: () => void;
  onViewDueCards?: () => void;
}

// ============================================================================
// Achievement Definitions
// ============================================================================

interface Achievement {
  id: string;
  icon: typeof Flame;
  title: string;
  description: string;
  threshold: number;
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_card",
    icon: Sparkles,
    title: "First Card",
    description: "Study your first card",
    threshold: 1,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  },
  {
    id: "streak_7",
    icon: Flame,
    title: "Week Streak",
    description: "Study for 7 days in a row",
    threshold: 7,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  },
  {
    id: "streak_30",
    icon: Zap,
    title: "Monthly Master",
    description: "Study for 30 days in a row",
    threshold: 30,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  },
  {
    id: "words_100",
    icon: Target,
    title: "Century Club",
    description: "Learn 100 words",
    threshold: 100,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  },
  {
    id: "streak_100",
    icon: Trophy,
    title: "100 Day Streak",
    description: "Study for 100 days in a row",
    threshold: 100,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
];

// ============================================================================
// Helper Components
// ============================================================================

// Circular Progress for Streak
interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}

function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-indigo-500 dark:text-indigo-400 transition-all duration-500"
          style={{ strokeDashoffset: `${strokeDashoffset}px` }}
        />
      </svg>

      {/* Center Icon */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {value >= 7 ? (
          <Flame className="w-8 h-8 text-orange-500" />
        ) : (
          <Calendar className="w-8 h-8 text-gray-400" />
        )}
      </div>
    </div>
  );
}

// Stage Distribution Bar
interface StageDistributionProps {
  distribution: SrsStats["stageDistribution"];
  compact?: boolean;
}

function StageDistribution({ distribution, compact: _compact = false }: StageDistributionProps) {
  const total =
    distribution.new +
    distribution.learning +
    distribution.review +
    distribution.graduated;

  const getPercentage = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Card Distribution
        </h4>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {total} total cards
        </span>
      </div>

      <div className="space-y-2">
        {/* New */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">New</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {distribution.new}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(distribution.new)}%` }}
            />
          </div>
        </div>

        {/* Learning */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Learning</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {distribution.learning}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(distribution.learning)}%` }}
            />
          </div>
        </div>

        {/* Review */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Review</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {distribution.review}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(distribution.review)}%` }}
            />
          </div>
        </div>

        {/* Graduated */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Graduated</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {distribution.graduated}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(distribution.graduated)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Today's Progress Bar
interface TodayProgressProps {
  reviewsToday: number;
  dailyGoal: number;
}

function TodayProgress({ reviewsToday, dailyGoal }: TodayProgressProps) {
  const progress = Math.min((reviewsToday / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - reviewsToday, 0);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Today&apos;s Progress
        </h4>
        <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
          {reviewsToday} / {dailyGoal}
        </span>
      </div>

      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {remaining > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {remaining} more to reach your daily goal
        </p>
      )}

      {reviewsToday >= dailyGoal && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
          <span>🎉</span>
          Daily goal achieved!
        </p>
      )}
    </Card>
  );
}

// Achievement Badge
interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  delay?: number;
}

function AchievementBadge({ achievement, unlocked, delay = 0 }: AchievementBadgeProps) {
  const Icon = achievement.icon;

  return (
    <div
      className={cn(
        "relative p-4 rounded-xl transition-all duration-300",
        unlocked
          ? achievement.color
          : "bg-gray-100 dark:bg-slate-800 opacity-50 grayscale"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className="w-8 h-8" />
        <span
          className={cn(
            "text-xs font-semibold text-center",
            unlocked ? "text-current" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {achievement.title}
        </span>
      </div>

      {unlocked && (
        <div className="absolute -top-1 -right-1">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main SRS Progress Component
// ============================================================================

export function SRSProgress({
  userId,
  timeRange = "week",
  showActions = true,
  compact = false,
  onStartReview,
  onViewDueCards,
}: SRSProgressProps) {
  const [stats, setStats] = useState<SrsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stats
  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");

        const { stats: data } = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();

    // Set up realtime subscription for updates
    const channel = new BroadcastChannel("srs-updates");
    channel.onmessage = (event) => {
      if (event.data.type === "review_completed") {
        fetchStats();
      }
    };

    return () => {
      channel.close();
    };
  }, [userId, timeRange]);

  // Calculate unlocked achievements
  const unlockedAchievements = useMemo(() => {
    if (!stats) return [];

    return ACHIEVEMENTS.filter((achievement) => {
      if (achievement.id === "streak_7" || achievement.id === "streak_30" || achievement.id === "streak_100") {
        return stats.streakDays >= achievement.threshold;
      }
      if (achievement.id === "words_100") {
        return stats.totalWords >= achievement.threshold;
      }
      if (achievement.id === "first_card") {
        return stats.totalWords >= achievement.threshold;
      }
      return false;
    });
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Unable to load statistics
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", compact && "space-y-4")}>
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <Card className="p-4 flex items-center gap-3">
          <CircularProgress value={stats.streakDays} max={100} size={80} />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Current Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.streakDays}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
          </div>
        </Card>

        {/* Total Words */}
        <Card className="p-4">
          <BookOpen className="w-8 h-8 text-indigo-500 mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Words</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalWords}
          </p>
        </Card>

        {/* Due Today */}
        <Card className="p-4">
          <Target className="w-8 h-8 text-orange-500 mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Due Today</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.wordsDue}
          </p>
        </Card>

        {/* Retention Rate */}
        <Card className="p-4">
          <TrendingUp className="w-8 h-8 text-emerald-500 mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Retention</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.retentionRate.toFixed(0)}%
          </p>
        </Card>
      </div>

      {/* Today's Progress */}
      <TodayProgress
        reviewsToday={stats.reviewsToday}
        dailyGoal={stats.dailyGoal}
      />

      {/* Stage Distribution */}
      <Card className="p-4">
        <StageDistribution distribution={stats.stageDistribution} />
      </Card>

      {/* Achievements */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Achievements
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {ACHIEVEMENTS.map((achievement, index) => {
            const unlocked = unlockedAchievements.some((a) => a.id === achievement.id);
            return (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={unlocked}
                delay={index * 50}
              />
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      {showActions && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quick Actions
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.wordsDue > 0
                  ? `You have ${stats.wordsDue} cards due for review`
                  : "No cards due right now"}
              </p>
            </div>

            <div className="flex gap-2">
              {onViewDueCards && stats.wordsDue > 0 && (
                <Button onClick={onViewDueCards} variant="outline">
                  View Due Cards
                </Button>
              )}
              {onStartReview && (
                <Button onClick={onStartReview}>
                  Start Review
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

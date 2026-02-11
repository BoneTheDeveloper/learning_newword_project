"use client";

/**
 * Dashboard Page
 *
 * Main dashboard showing user stats and quick actions
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, TrendingUp, Target, Clock, CheckCircle } from "lucide-react";

export interface UserStats {
  totalCards: number;
  cardsDueToday: number;
  totalReviews: number;
  accuracy: number;
  streak: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: "Study Now",
      description: "Review cards due today",
      icon: Brain,
      onClick: () => router.push("/study"),
      color: "indigo",
      disabled: stats?.cardsDueToday === 0,
    },
    {
      title: "Generate Vocabulary",
      description: "Create new vocabulary cards",
      icon: BookOpen,
      onClick: () => router.push("/generate"),
      color: "purple",
    },
    {
      title: "Browse Cards",
      description: "View all saved vocabulary",
      icon: Target,
      onClick: () => router.push("/vocabulary"),
      color: "blue",
    },
    {
      title: "Collections",
      description: "Organize your vocabulary",
      icon: Clock,
      onClick: () => router.push("/collections"),
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Track your vocabulary learning progress.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 bg-white dark:bg-slate-900 animate-pulse">
                <div className="h-16 bg-gray-200 dark:bg-slate-700 rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Cards Due Today */}
            <Card className="p-6 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Due Today
                </span>
                <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.cardsDueToday || 0}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stats?.cardsDueToday === 0
                  ? "All caught up!"
                  : "cards to review"}
              </p>
            </Card>

            {/* Total Cards */}
            <Card className="p-6 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Cards
                </span>
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalCards || 0}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                vocabulary items
              </p>
            </Card>

            {/* Total Reviews */}
            <Card className="p-6 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Reviews
                </span>
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalReviews || 0}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                reviews completed
              </p>
            </Card>

            {/* Accuracy */}
            <Card className="p-6 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Accuracy
                </span>
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.accuracy || 0}%
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                correct answers
              </p>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`
                    p-6 bg-white dark:bg-slate-900 rounded-xl
                    border border-gray-200 dark:border-slate-800
                    hover:border-${action.color}-300 dark:hover:border-${action.color}-700
                    hover:shadow-lg transition-all
                    text-left
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <Icon className={`w-8 h-8 text-${action.color}-600 dark:text-${action.color}-400 mb-3`} />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Call to Action - if cards are due */}
        {stats && stats.cardsDueToday > 0 && (
          <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  You have {stats.cardsDueToday} cards due for review!
                </h3>
                <p className="text-indigo-100 dark:text-indigo-200">
                  Start your study session to keep your vocabulary fresh.
                </p>
              </div>
              <Button
                onClick={() => router.push("/study")}
                className="bg-white text-indigo-600 hover:bg-indigo-50"
              >
                Start Studying
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

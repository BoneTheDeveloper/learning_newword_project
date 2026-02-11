"use client";

/**
 * Navigation Component
 *
 * Main navigation for the dashboard
 */

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  Brain,
  BookOpen,
  Target,
  FolderOpen,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Study",
    href: "/study",
    icon: Brain,
  },
  {
    label: "Generate",
    href: "/generate",
    icon: BookOpen,
  },
  {
    label: "Vocabulary",
    href: "/vocabulary",
    icon: Target,
  },
  {
    label: "Collections",
    href: "/collections",
    icon: FolderOpen,
  },
];

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [cardsDue, setCardsDue] = useState<number>(0);
  const supabase = createClient();

  useEffect(() => {
    // Get user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Get cards due count
    const getCardsDue = async () => {
      try {
        const response = await fetch("/api/user/stats");
        if (response.ok) {
          const data = await response.json();
          setCardsDue(data.stats.cardsDueToday || 0);
        }
      } catch (error) {
        console.error("Error fetching cards due:", error);
      }
    };

    getCardsDue();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          {/* Logo */}
          <div className="flex items-center pr-8">
            <a
              href="/dashboard"
              className="font-display font-bold text-xl text-indigo-600 dark:text-indigo-400"
            >
              VocabBuilder
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const badge = item.href === "/study" ? cardsDue : undefined;

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`
                    relative px-3 py-2 rounded-lg text-sm font-medium
                    flex items-center gap-2 transition-colors
                    ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {user.email}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

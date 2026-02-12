"use client";

/**
 * SRS Algorithm Toggle Component
 *
 * Allows users to choose between SM-2 and FSRS algorithms
 * with descriptions and pros/cons
 */

import { cn } from "@/lib/utils";

export interface SrsOption {
  value: "sm2" | "fsrs";
  label: string;
  description: string;
  pros: string[];
  badge?: string;
}

export interface SrsToggleProps {
  value: "sm2" | "fsrs";
  onChange: (value: "sm2" | "fsrs") => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const SRS_OPTIONS: SrsOption[] = [
  {
    value: "sm2",
    label: "SM-2",
    description: "Classic SuperMemo 2 algorithm",
    pros: ["Proven retention", "Predictable intervals", "Simple calculations"],
    badge: "Classic",
  },
  {
    value: "fsrs",
    label: "FSRS",
    description: "Free Spaced Repetition Scheduler",
    pros: ["ML-based scheduling", "90% retention target", "Adaptive to memory"],
    badge: "Modern",
  },
];

export function SrsToggle({
  value,
  onChange,
  disabled = false,
  size = "md",
}: SrsToggleProps) {
  const sizeClasses = {
    sm: {
      container: "p-3 gap-3",
      label: "text-sm",
      description: "text-xs",
      pros: "text-xs",
    },
    md: {
      container: "p-4 gap-4",
      label: "text-base",
      description: "text-sm",
      pros: "text-sm",
    },
    lg: {
      container: "p-5 gap-5",
      label: "text-lg",
      description: "text-base",
      pros: "text-base",
    },
  }[size];

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3",
        "bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700"
      )}
      role="radiogroup"
      aria-label="SRS Algorithm Selection"
    >
      {SRS_OPTIONS.map((option) => {
        const isSelected = option.value === value;

        return (
          <label
            key={option.value}
            className={cn(
              "relative flex flex-col cursor-pointer rounded-lg transition-all",
              "border-2",
              isSelected
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                : "border-transparent hover:border-gray-300 dark:hover:border-slate-600",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <input
              type="radio"
              name="srs-algorithm"
              value={option.value}
              checked={isSelected}
              onChange={() => !disabled && onChange(option.value)}
              disabled={disabled}
              className="sr-only"
              aria-describedby={`${option.value}-desc`}
            />

            <div className={cn("flex-1", sizeClasses.container)}>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={cn("font-semibold text-gray-900 dark:text-white", sizeClasses.label)}>
                    {option.label}
                  </span>

                  {/* Badge */}
                  {option.badge && (
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full font-medium",
                        isSelected
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-300"
                          : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300",
                        option.value === "fsrs" && "bg-purple-100 text-purple-700 dark:bg-purple-500/30 dark:text-purple-300"
                      )}
                    >
                      {option.badge}
                    </span>
                  )}
                </div>

                {/* Radio indicator */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    isSelected
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-gray-300 dark:border-slate-600"
                  )}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
              </div>

              {/* Description */}
              <p
                className={cn(
                  "text-gray-600 dark:text-gray-400 mt-1",
                  sizeClasses.description
                )}
                id={`${option.value}-desc`}
              >
                {option.description}
              </p>

              {/* Pros */}
              <div className="mt-3">
                <span
                  className={cn(
                    "text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wide",
                    sizeClasses.pros
                  )}
                >
                  Benefits:
                </span>
                <ul className="mt-1.5 space-y-1">
                  {option.pros.map((pro, i) => (
                    <li
                      key={i}
                      className={cn(
                        "flex items-start gap-1.5",
                        "text-gray-700 dark:text-gray-300",
                        sizeClasses.pros
                      )}
                    >
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}

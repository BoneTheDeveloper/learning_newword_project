import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
        secondary: "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        error: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
        outline: "border-2 border-gray-200 text-gray-700 dark:border-slate-700 dark:text-gray-300",
        difficulty: {
          easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
          medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
          hard: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
        },
        status: {
          new: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
          learning: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
          mastered: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
          review: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
        },
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

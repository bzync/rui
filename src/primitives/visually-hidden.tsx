"use client"

import { cn } from "@/lib/cn"
import { HTMLAttributes, forwardRef } from "react"

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * When true, the element remains visually hidden but becomes visible
   * when focused — useful for skip links.
   */
  focusable?: boolean
}

/**
 * VisuallyHidden — hides content visually while keeping it accessible to
 * assistive technologies. Mirrors Radix / React Aria primitive semantics.
 *
 * - Default: absolute 1px clip, not visible.
 * - `focusable`: becomes visible on :focus-visible (skip-link pattern).
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, focusable = false, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          focusable
            ? "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:shadow-overlay focus:ring-2 focus:ring-focus-ring"
            : "sr-only",
          className,
        )}
        {...props}
      />
    )
  },
)
VisuallyHidden.displayName = "VisuallyHidden"

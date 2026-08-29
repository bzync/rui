"use client"

import { type ReactNode } from "react"
import { createPortal } from "react-dom"

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

/**
 * Fixed-order categorical series colors. Backed by CSS custom properties
 * (`--chart-1`…`--chart-6` in globals.css) so light and dark each use their own
 * validated steps. Assign in order and never cycle — a 7th+ series folds into
 * an "Other" bucket, small multiples, or a second encoding.
 */
export const CHART_SERIES = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
] as const

/** Positive / negative accents for waterfall & diff charts (theme-aware). */
export const CHART_POSITIVE = "var(--chart-2)"
export const CHART_NEGATIVE = "var(--chart-4)"

/**
 * Single-hue cobalt ramp, dark → light. For magnitude of one measure
 * (funnel stages, a sequential legend). Not for categorical identity.
 */
export const CHART_SEQUENTIAL = [
  "var(--color-accent-700)",
  "var(--color-accent-600)",
  "var(--color-accent-500)",
  "var(--color-accent-400)",
  "var(--color-accent-300)",
  "var(--color-accent-200)",
] as const

export interface TooltipState {
  x: number
  y: number
  content: ReactNode
}

// Thins dense x-axis labels down to at most `max` evenly-spaced entries
// (always keeping the last one) so labels never overlap at high point counts
// (e.g. an hour of 1m-resolution samples = 60 points).
export function visibleLabelAt(n: number, max: number) {
  const step = n <= max ? 1 : Math.ceil(n / max)
  return (i: number) => i % step === 0 || i === n - 1
}

export function ChartTooltip({ tooltip }: { tooltip: TooltipState | null }) {
  if (!tooltip || typeof document === "undefined") return null
  return createPortal(
    <div
      className="pointer-events-none fixed z-[9999] px-3 py-2 rounded-[var(--radius-md)] border border-border bg-surface-raised shadow-floating text-sm text-foreground whitespace-nowrap"
      style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
    >
      {tooltip.content}
    </div>,
    document.body
  )
}

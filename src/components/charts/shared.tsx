"use client"

import { type ReactNode } from "react"
import { createPortal } from "react-dom"

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

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
      className="pointer-events-none fixed z-[9999] px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-navy-700 shadow-xl shadow-black/30 text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap"
      style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
    >
      {tooltip.content}
    </div>,
    document.body
  )
}

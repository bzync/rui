"use client"

import { cn } from "@/lib/cn"
import { motion } from "framer-motion"
import { HTMLAttributes } from "react"

export type ProgressVariant = "default" | "success" | "warning" | "error" | "info"
export type ProgressSize = "xs" | "sm" | "md" | "lg"

export interface ProgressbarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value?: number // 0-100
  variant?: ProgressVariant
  size?: ProgressSize
  label?: string
  showValue?: boolean
  indeterminate?: boolean
  /** Render as segmented steps instead of a continuous bar */
  steps?: number
  animated?: boolean
}

const variantTrack: Record<ProgressVariant, string> = {
  default: "bg-black/6 dark:bg-white/6",
  success: "bg-emerald-500/10",
  warning: "bg-amber-500/10",
  error:   "bg-red-500/10",
  info:    "bg-sky-500/10",
}

const variantFill: Record<ProgressVariant, string> = {
  default: "bg-accent-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error:   "bg-red-500",
  info:    "bg-sky-500",
}

const variantText: Record<ProgressVariant, string> = {
  default: "text-accent-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  error:   "text-red-400",
  info:    "text-sky-400",
}

const heights: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
}

export function Progressbar({
  value = 0,
  variant = "default",
  size = "md",
  label,
  showValue = false,
  indeterminate = false,
  steps,
  animated = true,
  className,
  ...props
}: ProgressbarProps) {
  const pct = Math.min(100, Math.max(0, value))
  const hasHeader = label !== undefined || showValue

  if (steps !== undefined && steps > 0) {
    const filledSteps = Math.round((pct / 100) * steps)
    return (
      <div className={cn("flex flex-col gap-1.5", className)} {...props}>
        {hasHeader && (
          <div className="flex items-center justify-between gap-2">
            {label && <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>}
            {showValue && (
              <span className={cn("text-xs font-medium tabular-nums ml-auto", variantText[variant])}>
                {filledSteps}/{steps}
              </span>
            )}
          </div>
        )}
        <div className="flex gap-1">
          {Array.from({ length: steps }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "flex-1 rounded-full",
                heights[size],
                i < filledSteps ? variantFill[variant] : variantTrack[variant],
              )}
              initial={animated ? { opacity: 0.4 } : undefined}
              animate={animated ? { opacity: 1 } : undefined}
              transition={{ delay: i * 0.04, duration: 0.2 }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {hasHeader && (
        <div className="flex items-center justify-between gap-2">
          {label && <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>}
          {showValue && !indeterminate && (
            <span className={cn("text-xs font-medium tabular-nums ml-auto", variantText[variant])}>
              {pct}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "w-full overflow-hidden rounded-full",
          heights[size],
          variantTrack[variant],
        )}
      >
        {indeterminate ? (
          <motion.div
            className={cn("h-full w-1/3 rounded-full", variantFill[variant])}
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <motion.div
            className={cn("h-full rounded-full", variantFill[variant])}
            initial={animated ? { width: 0 } : { width: `${pct}%` }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        )}
      </div>
    </div>
  )
}

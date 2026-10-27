"use client"

import { cn } from "@/lib/cn"
import { statusSolidStyles, statusTextStyles, statusTrackStyles } from "@/lib/status-styles"
import { motion } from "@/lib/motion-components"
import { HTMLAttributes, forwardRef } from "react"

/** `error` is a deprecated alias of `danger`. */
export type ProgressVariant = "default" | "success" | "warning" | "danger" | "info" | "error"
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
  /** Class for the track (and the unfilled steps). */
  trackClassName?: string
  /** Class for the fill (and the filled steps). */
  fillClassName?: string
  labelClassName?: string
  valueClassName?: string
}

const variantTrack: Record<ProgressVariant, string> = {
  default: "bg-foreground/6",
  success: statusTrackStyles.success,
  warning: statusTrackStyles.warning,
  danger:  statusTrackStyles.danger,
  error:   statusTrackStyles.danger,
  info:    statusTrackStyles.info,
}

const variantFill: Record<ProgressVariant, string> = {
  default: "bg-accent-500",
  success: statusSolidStyles.success,
  warning: statusSolidStyles.warning,
  danger:  statusSolidStyles.danger,
  error:   statusSolidStyles.danger,
  info:    statusSolidStyles.info,
}

const variantText: Record<ProgressVariant, string> = {
  default: "text-accent-strong",
  success: statusTextStyles.success,
  warning: statusTextStyles.warning,
  danger:  statusTextStyles.danger,
  error:   statusTextStyles.danger,
  info:    statusTextStyles.info,
}

const heights: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
}

export const Progressbar = forwardRef<HTMLDivElement, ProgressbarProps>(function Progressbar({
  value = 0,
  variant = "default",
  size = "md",
  label,
  showValue = false,
  indeterminate = false,
  steps,
  animated = true,
  className,
  trackClassName,
  fillClassName,
  labelClassName,
  valueClassName,
  ...props
}, ref) {
  const pct = Math.min(100, Math.max(0, value))
  const hasHeader = label !== undefined || showValue

  if (steps !== undefined && steps > 0) {
    const filledSteps = Math.round((pct / 100) * steps)
    return (
      <div className={cn("flex flex-col gap-1.5", className)} {...props}>
        {hasHeader && (
          <div className="flex items-center justify-between gap-2">
            {label && <span className={cn("text-xs text-muted-foreground", labelClassName)}>{label}</span>}
            {showValue && (
              <span className={cn("text-xs font-medium tabular-nums ml-auto", variantText[variant], valueClassName)}>
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
                i < filledSteps ? cn(variantFill[variant], fillClassName) : cn(variantTrack[variant], trackClassName),
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
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
      {hasHeader && (
        <div className="flex items-center justify-between gap-2">
          {label && <span className={cn("text-xs text-muted-foreground", labelClassName)}>{label}</span>}
          {showValue && !indeterminate && (
            <span className={cn("text-xs font-medium tabular-nums ml-auto", variantText[variant], valueClassName)}>
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
          trackClassName,
        )}
      >
        {indeterminate ? (
          <motion.div
            className={cn("h-full w-1/3 rounded-full", variantFill[variant], fillClassName)}
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <motion.div
            className={cn("h-full rounded-full", variantFill[variant], fillClassName)}
            initial={animated ? { width: 0 } : { width: `${pct}%` }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        )}
      </div>
    </div>
  )
})
Progressbar.displayName = "Progressbar"

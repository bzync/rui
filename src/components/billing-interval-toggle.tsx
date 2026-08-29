"use client"

import { cn } from "@/lib/cn"
import { forwardRef, type HTMLAttributes } from "react"

export type BillingInterval = "monthly" | "quarterly" | "yearly"

export interface BillingIntervalToggleOption {
  value: BillingInterval
  label: string
  badge?: string
}

const DEFAULT_OPTIONS: BillingIntervalToggleOption[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Annually" },
]

export interface BillingIntervalToggleProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: BillingInterval
  onChange: (interval: BillingInterval) => void
  options?: BillingIntervalToggleOption[]
  disabled?: boolean
  /** Controls the density and selected-state emphasis. */
  size?: "sm" | "lg"
}

export const BillingIntervalToggle = forwardRef<HTMLDivElement, BillingIntervalToggleProps>(({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  disabled = false,
  size = "sm",
  className,
  "aria-label": ariaLabel = "Billing interval",
  ...props
}, ref) => {
  const isLg = size === "lg"

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "isolate inline-flex max-w-full items-center border border-border bg-surface-muted shadow-inner",
        isLg
          ? "gap-1 rounded-xl p-1"
          : "gap-0.5 rounded-lg p-0.5",
        className,
      )}
      {...props}
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => !disabled && onChange(opt.value)}
            disabled={disabled}
            aria-pressed={active}
            data-state={active ? "active" : "inactive"}
            className={cn(
              "relative flex min-w-0 cursor-pointer items-center justify-center rounded-md font-medium",
              "transition-[background-color,color,box-shadow,opacity] duration-200",
              "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-muted",
              isLg
                ? "min-h-10 gap-1 rounded-lg px-2 py-2 text-xs sm:gap-2 sm:px-4 sm:text-sm"
                : "min-h-7 gap-1.5 px-3 py-1 text-xs",
              disabled && "cursor-not-allowed opacity-50",
              active
                ? isLg
                  ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                  : "bg-surface text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:bg-surface/70 hover:text-foreground",
            )}
          >
            {opt.label}
            {opt.badge && (
              <span
                className={cn(
                  "whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[10px] font-bold leading-none transition-colors",
                  active && isLg
                    ? "border-primary-foreground/25 bg-primary-foreground/15 text-primary-foreground"
                    : "border-success/25 bg-success/10 text-success",
                )}
              >
                {opt.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
})
BillingIntervalToggle.displayName = "BillingIntervalToggle"

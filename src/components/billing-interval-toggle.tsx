"use client"

import { cn } from "@/lib/cn"

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

export interface BillingIntervalToggleProps {
  value: BillingInterval
  onChange: (interval: BillingInterval) => void
  options?: BillingIntervalToggleOption[]
  disabled?: boolean
  /** "sm" (default) matches the subtle inline pill used in onboarding/billing
   * pages; "lg" matches the bolder blue-accent pill used on the marketing
   * pricing section. */
  size?: "sm" | "lg"
  className?: string
}

// Shared 3-way segmented pill for choosing a billing interval — replaces the
// three previously independent bespoke toggles (marketing page, onboarding,
// and the workspace billing page's binary flip-button).
export function BillingIntervalToggle({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  disabled = false,
  size = "sm",
  className,
}: BillingIntervalToggleProps) {
  const isLg = size === "lg"

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-black/[0.08] dark:border-white/[0.08]",
        isLg
          ? "rounded-xl bg-black/[0.025] dark:bg-white/[0.025] p-0.5 gap-0.5 sm:p-1 sm:gap-1"
          : "bg-black/[0.02] dark:bg-white/[0.03] p-0.5",
        className,
      )}
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => !disabled && onChange(opt.value)}
            disabled={disabled}
            className={cn(
              "flex items-center justify-center rounded-md font-medium transition-[background-color,border-color,opacity,transform] duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35",
              isLg
                ? "flex-col gap-0.5 px-2 py-1.5 text-[11px] rounded-lg sm:flex-row sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                : "px-3 py-1 text-xs",
              disabled && "opacity-50 cursor-not-allowed",
              active
                ? isLg
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
            )}
          >
            {opt.label}
            {opt.badge && (
              <span
                className={cn(
                  "rounded-full px-1 py-0.5 text-[9px] font-bold border transition-colors sm:px-1.5 sm:text-[10px]",
                  active
                    ? "bg-white/[0.18] text-white border-white/25"
                    : "bg-green-500/[0.12] text-green-600 dark:text-green-400 border-green-500/20",
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
}

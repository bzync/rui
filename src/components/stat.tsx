import { cn } from "@/lib/cn"
import { HTMLAttributes, ReactNode } from "react"

type Trend = "up" | "down" | "neutral"

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  unit?: string
  valueClassName?: string
  trend?: Trend
  trendValue?: string
  icon?: ReactNode
  description?: string
  /** Rendered next to the icon in the header row — e.g. a small toggle.
   * Clicks inside it are not stopped from bubbling; wrap with
   * `onClick={(e) => e.stopPropagation()}` if the Stat sits inside a link. */
  action?: ReactNode
}

const trendStyles: Record<Trend, { color: string; icon: ReactNode }> = {
  up: {
    color: "text-emerald-400",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
      </svg>
    ),
  },
  down: {
    color: "text-red-400",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    ),
  },
  neutral: {
    color: "text-slate-500",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
      </svg>
    ),
  },
}

export function Stat({ label, value, unit, valueClassName, trend, trendValue, icon, description, action, className, ...props }: StatProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-navy-900 p-4 shadow-sm shadow-black/[0.04] dark:shadow-none",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.07em]">{label}</p>
        <span className="flex items-center gap-1.5 shrink-0">
          {action}
          {icon && (
            <span className="text-slate-400 dark:text-slate-500">
              {icon}
            </span>
          )}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5 mt-1.5">
        <span className={cn("text-[26px] font-semibold tabular-nums text-slate-900 dark:text-white leading-none tracking-tight", valueClassName)}>
          {value}
        </span>
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>
      {(trend || description) && (
        <div className="flex items-center gap-1.5 mt-1">
          {trend && trendValue && (
            <span className={cn("flex items-center gap-0.5 text-xs font-medium", trendStyles[trend].color)}>
              {trendStyles[trend].icon}
              {trendValue}
            </span>
          )}
          {description && <span className="text-xs text-slate-500">{description}</span>}
        </div>
      )}
    </div>
  )
}

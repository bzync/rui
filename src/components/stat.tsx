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
    color: "text-emerald-700 dark:text-emerald-400",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
      </svg>
    ),
  },
  down: {
    color: "text-red-700 dark:text-red-400",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    ),
  },
  neutral: {
    color: "text-muted-foreground",
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
        "flex flex-col gap-1 rounded-[var(--radius-xl)] border border-border bg-surface p-4 shadow-xs",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.06em]">{label}</p>
        <span className="flex items-center gap-1.5 shrink-0">
          {action}
          {icon && (
            <span className="text-muted-foreground">
              {icon}
            </span>
          )}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5 mt-1.5">
        <span className={cn("text-[26px] font-semibold tabular-nums text-foreground leading-none tracking-tight", valueClassName)}>
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
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

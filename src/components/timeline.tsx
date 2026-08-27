import { cn } from "@/lib/cn"
import { ReactNode } from "react"

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  timestamp?: string
  icon?: ReactNode
  variant?: "default" | "success" | "warning" | "error" | "info"
}

export interface TimelineProps {
  events: TimelineEvent[]
  className?: string
}

const dotVariants = {
  default: "bg-slate-400 border-slate-400/30",
  success: "bg-emerald-400 border-emerald-400/30",
  warning: "bg-amber-400 border-amber-400/30",
  error:   "bg-red-400 border-red-400/30",
  info:    "bg-sky-400 border-sky-400/30",
}

const iconVariants = {
  default: "bg-slate-500/15 text-slate-400",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  error:   "bg-red-500/15 text-red-400",
  info:    "bg-sky-500/15 text-sky-400",
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {events.map((event, i) => {
        const isLast = i === events.length - 1
        const variant = event.variant ?? "default"

        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              {event.icon ? (
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", iconVariants[variant])}>
                  <span className="w-4 h-4 flex items-center justify-center">{event.icon}</span>
                </div>
              ) : (
                <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 border-2 mt-1.5", dotVariants[variant])} />
              )}
              {!isLast && (
                <div className="flex-1 w-px bg-black/10 dark:bg-white/10 my-1" />
              )}
            </div>
            <div className={cn("pb-5 min-w-0", isLast && "pb-0")}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{event.title}</p>
                {event.timestamp && (
                  <span className="text-xs text-slate-500">{event.timestamp}</span>
                )}
              </div>
              {event.description && (
                <p className="text-sm text-slate-500 mt-0.5">{event.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

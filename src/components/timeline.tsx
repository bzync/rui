import { cn } from "@/lib/cn"
import { statusSolidStyles, statusTextStyles } from "@/lib/status-styles"
import { ReactNode } from "react"

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  timestamp?: string
  icon?: ReactNode
  /** `error` is a deprecated alias of `danger`. */
  variant?: "default" | "success" | "warning" | "danger" | "info" | "error"
  /** Class for this event's dot or icon badge. */
  markerClassName?: string
}

export interface TimelineProps {
  events: TimelineEvent[]
  className?: string
}

const dotVariants = {
  default: "bg-muted-foreground border-muted-foreground/30",
  success: `${statusSolidStyles.success} border-success/30`,
  warning: `${statusSolidStyles.warning} border-warning/30`,
  danger:  `${statusSolidStyles.danger} border-danger/30`,
  error:   `${statusSolidStyles.danger} border-danger/30`,
  info:    `${statusSolidStyles.info} border-info/30`,
}

const iconVariants = {
  default: "bg-muted-foreground/15 text-muted-foreground",
  success: `bg-success/15 ${statusTextStyles.success}`,
  warning: `bg-warning/15 ${statusTextStyles.warning}`,
  danger:  `bg-danger/15 ${statusTextStyles.danger}`,
  error:   `bg-danger/15 ${statusTextStyles.danger}`,
  info:    `bg-info/15 ${statusTextStyles.info}`,
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
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", iconVariants[variant], event.markerClassName)}>
                  <span className="w-4 h-4 flex items-center justify-center">{event.icon}</span>
                </div>
              ) : (
                <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 border-2 mt-1.5", dotVariants[variant], event.markerClassName)} />
              )}
              {!isLast && (
                <div className="flex-1 w-px bg-border my-1" />
              )}
            </div>
            <div className={cn("pb-5 min-w-0", isLast && "pb-0")}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                {event.timestamp && (
                  <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                )}
              </div>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{event.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

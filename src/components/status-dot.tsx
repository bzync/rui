import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/cn"
import { statusSolidStyles, type Tone } from "@/lib/status-styles"

export type StatusDotPresence = "online" | "offline" | "idle" | "busy" | "error" | "pending"
/** A presence state, or any of the shared tones (`success`, `danger`, …) a Badge takes. */
export type StatusDotStatus = StatusDotPresence | Tone

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  status: StatusDotStatus
  label?: string
  pulse?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  /** Class for the dot itself (and its pulse ring). */
  dotClassName?: string
  /** Class for the label text. */
  labelClassName?: string
  /** Override or extend the status → dot color map per call. */
  variants?: Partial<Record<StatusDotStatus, string>>
}

export const statusDotVariants: Record<StatusDotStatus, string> = {
  online:  statusSolidStyles.success,
  offline: "bg-muted-foreground",
  idle:    statusSolidStyles.warning,
  busy:    statusSolidStyles.danger,
  error:   statusSolidStyles.danger,
  pending: statusSolidStyles.info,
  default: "bg-accent-500",
  success: statusSolidStyles.success,
  warning: statusSolidStyles.warning,
  danger:  statusSolidStyles.danger,
  info:    statusSolidStyles.info,
  muted:   "bg-muted-foreground",
}

const pulsing = new Set<StatusDotStatus>(["online", "pending", "success", "info"])

const sizes = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
}

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot({
  status,
  label,
  pulse = false,
  size = "md",
  className,
  dotClassName,
  labelClassName,
  variants,
  ...props
}, ref) {
  const dotCls = variants?.[status] ?? statusDotVariants[status]
  return (
    <span ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props}>
      <span className="relative flex items-center justify-center">
        {pulse && pulsing.has(status) && (
          <span
            className={cn(
              "absolute inline-flex rounded-full opacity-75 animate-ping",
              dotCls,
              sizes[size],
              dotClassName,
            )}
          />
        )}
        <span className={cn("relative inline-flex rounded-full", dotCls, sizes[size], dotClassName)} />
      </span>
      {label && (
        <span className={cn("text-sm text-muted-foreground", labelClassName)}>{label}</span>
      )}
    </span>
  )
})
StatusDot.displayName = "StatusDot"

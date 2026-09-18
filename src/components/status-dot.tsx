import { cn } from "@/lib/cn"
import { statusSolidStyles } from "@/lib/status-styles"

export type StatusDotStatus = "online" | "offline" | "idle" | "busy" | "error" | "pending"

export interface StatusDotProps {
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
}

const sizes = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
}

export function StatusDot({
  status,
  label,
  pulse = false,
  size = "md",
  className,
  dotClassName,
  labelClassName,
  variants,
}: StatusDotProps) {
  const dotCls = variants?.[status] ?? statusDotVariants[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative flex items-center justify-center">
        {pulse && (status === "online" || status === "pending") && (
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
}

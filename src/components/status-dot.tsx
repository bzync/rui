import { cn } from "@/lib/cn"

type Status = "online" | "offline" | "idle" | "busy" | "error" | "pending"

export interface StatusDotProps {
  status: Status
  label?: string
  pulse?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const dotStyles: Record<Status, string> = {
  online:  "bg-emerald-400",
  offline: "bg-slate-500",
  idle:    "bg-amber-400",
  busy:    "bg-red-400",
  error:   "bg-red-500",
  pending: "bg-sky-400",
}

const sizes = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
}

export function StatusDot({ status, label, pulse = false, size = "md", className }: StatusDotProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative flex items-center justify-center">
        {pulse && (status === "online" || status === "pending") && (
          <span
            className={cn(
              "absolute inline-flex rounded-full opacity-75 animate-ping",
              dotStyles[status],
              sizes[size],
            )}
          />
        )}
        <span className={cn("relative inline-flex rounded-full", dotStyles[status], sizes[size])} />
      </span>
      {label && (
        <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      )}
    </span>
  )
}

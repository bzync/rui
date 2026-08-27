import { cn } from "@/lib/cn"
import { HTMLAttributes } from "react"

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  label?: string
}

export function Separator({
  orientation = "horizontal",
  label,
  className,
  ...props
}: SeparatorProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn("w-px self-stretch bg-black/8 dark:bg-white/8", className)}
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div
        className={cn("flex items-center gap-3", className)}
        {...props}
      >
        <div className="flex-1 h-px bg-black/8 dark:bg-white/8" />
        <span className="text-xs text-slate-500 font-medium shrink-0">
          {label}
        </span>
        <div className="flex-1 h-px bg-black/8 dark:bg-white/8" />
      </div>
    )
  }

  return (
    <div
      className={cn("h-px w-full bg-black/8 dark:bg-white/8", className)}
      {...props}
    />
  )
}

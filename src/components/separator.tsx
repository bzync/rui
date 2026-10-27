import { cn } from "@/lib/cn"
import { HTMLAttributes, forwardRef } from "react"

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  label?: string
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator({
  orientation = "horizontal",
  label,
  className,
  ...props
}, ref) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn("w-px self-stretch bg-foreground/8", className)}
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
        <div className="flex-1 h-px bg-foreground/8" />
        <span className="text-xs text-muted-foreground font-medium shrink-0">
          {label}
        </span>
        <div className="flex-1 h-px bg-foreground/8" />
      </div>
    )
  }

  return (
    <div ref={ref}
      className={cn("h-px w-full bg-foreground/8", className)}
      {...props}
    />
  )
})
Separator.displayName = "Separator"

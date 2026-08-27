import { cn } from "@/lib/cn"
import { HTMLAttributes, ReactNode, forwardRef } from "react"

export type DividerOrientation = "horizontal" | "vertical"
export type DividerVariant = "solid" | "dashed" | "dotted"
export type DividerSpacing = "none" | "sm" | "md" | "lg"

const lineStyles: Record<DividerVariant, string> = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
}

const horizontalSpacing: Record<DividerSpacing, string> = {
  none: "my-0",
  sm: "my-2",
  md: "my-4",
  lg: "my-6",
}

const verticalSpacing: Record<DividerSpacing, string> = {
  none: "mx-0",
  sm: "mx-2",
  md: "mx-4",
  lg: "mx-6",
}

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation
  variant?: DividerVariant
  spacing?: DividerSpacing
  label?: ReactNode
  decorative?: boolean
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(({
  orientation = "horizontal",
  variant = "solid",
  spacing = "md",
  label,
  decorative = true,
  className,
  ...props
}, ref) => {
  const vertical = orientation === "vertical"
  const lineClassName = cn(
    "min-w-0 flex-1 border-border",
    lineStyles[variant],
    vertical ? "w-0 border-l" : "h-0 border-t",
  )

  return (
    <div
      ref={ref}
      role={decorative ? "presentation" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "flex shrink-0 items-center",
        vertical ? "h-full min-h-4 self-stretch flex-col" : "w-full min-w-0 flex-row",
        vertical ? verticalSpacing[spacing] : horizontalSpacing[spacing],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={lineClassName} />
      {label && (
        <span className={cn(
          "shrink-0 text-xs font-medium text-muted-foreground",
          vertical ? "my-2 [writing-mode:vertical-rl]" : "mx-3",
        )}>{label}</span>
      )}
      {label && <span aria-hidden="true" className={lineClassName} />}
    </div>
  )
})
Divider.displayName = "Divider"

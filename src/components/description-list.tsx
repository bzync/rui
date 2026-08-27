import { cn } from "@/lib/cn"
import { HTMLAttributes, forwardRef } from "react"

export type DescriptionListColumns = 1 | 2 | 3
export type DescriptionListDensity = "compact" | "default" | "relaxed"

const columnStyles: Record<DescriptionListColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}

const densityStyles: Record<DescriptionListDensity, string> = {
  compact: "gap-x-4 gap-y-3",
  default: "gap-x-6 gap-y-5",
  relaxed: "gap-x-8 gap-y-7",
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  columns?: DescriptionListColumns
  density?: DescriptionListDensity
}

export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(({
  columns = 1,
  density = "default",
  className,
  ...props
}, ref) => {
  return (
    <dl
      ref={ref}
      className={cn("grid min-w-0", columnStyles[columns], densityStyles[density], className)}
      {...props}
    />
  )
})
DescriptionList.displayName = "DescriptionList"

export interface DescriptionItemProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "stacked" | "inline"
}

export const DescriptionItem = forwardRef<HTMLDivElement, DescriptionItemProps>(({
  orientation = "stacked",
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "min-w-0",
        orientation === "inline" ? "flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4" : "flex flex-col gap-1",
        className,
      )}
      {...props}
    />
  )
})
DescriptionItem.displayName = "DescriptionItem"

export const DescriptionTerm = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(({
  className,
  ...props
}, ref) => {
  return <dt ref={ref} className={cn("text-xs font-medium text-muted-foreground", className)} {...props} />
})
DescriptionTerm.displayName = "DescriptionTerm"

export const DescriptionDetails = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(({
  className,
  ...props
}, ref) => {
  return <dd ref={ref} className={cn("min-w-0 break-words text-sm font-medium text-foreground", className)} {...props} />
})
DescriptionDetails.displayName = "DescriptionDetails"

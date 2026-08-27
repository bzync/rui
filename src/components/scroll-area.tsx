import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { HTMLAttributes, forwardRef } from "react"

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both"

const orientationStyles: Record<ScrollAreaOrientation, string> = {
  vertical: "overflow-y-auto overflow-x-hidden",
  horizontal: "overflow-x-auto overflow-y-hidden",
  both: "overflow-auto",
}

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ScrollAreaOrientation
  hideScrollbar?: boolean
  keyboardNavigable?: boolean
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(({
  orientation = "vertical",
  hideScrollbar = false,
  keyboardNavigable = true,
  className,
  tabIndex,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      data-orientation={orientation}
      tabIndex={tabIndex ?? (keyboardNavigable ? 0 : undefined)}
      className={cn(
        "relative overscroll-contain rounded-[var(--radius-sm)]",
        keyboardNavigable && focusRingStyles,
        orientationStyles[orientation],
        hideScrollbar && "scrollbar-none",
        className,
      )}
      {...props}
    />
  )
})
ScrollArea.displayName = "ScrollArea"

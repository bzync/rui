import { cn } from "@/lib/cn"
import { HTMLAttributes, ReactNode, forwardRef } from "react"

export type ButtonGroupOrientation = "horizontal" | "vertical"

const orientationStyles: Record<ButtonGroupOrientation, string> = {
  horizontal: [
    "max-w-full flex-row items-center overflow-x-auto overscroll-x-contain p-0.5 scrollbar-none [&>*]:shrink-0",
    "[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none",
    "[&>*:not(:last-child)]:rounded-r-none",
  ].join(" "),
  vertical: [
    "flex-col items-stretch",
    "[&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none",
    "[&>*:not(:last-child)]:rounded-b-none",
  ].join(" "),
}

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ButtonGroupOrientation
  children: ReactNode
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(({
  orientation = "horizontal",
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation}
      className={cn(
        "inline-flex w-fit [&>*:focus-visible]:relative [&>*:focus-visible]:z-10",
        orientationStyles[orientation],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ButtonGroup.displayName = "ButtonGroup"

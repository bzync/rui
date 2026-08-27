import { cn } from "@/lib/cn"
import { HTMLAttributes, ReactNode, forwardRef } from "react"

export type AvatarGroupSpacing = "tight" | "normal" | "loose"
export type AvatarGroupOverflowSize = "xs" | "sm" | "md" | "lg" | "xl"

const spacingStyles: Record<AvatarGroupSpacing, string> = {
  tight: "-space-x-3",
  normal: "-space-x-2",
  loose: "-space-x-1",
}

const overflowSizeStyles: Record<AvatarGroupOverflowSize, string> = {
  xs: "size-6 text-[9px]",
  sm: "size-8 text-[10px]",
  md: "size-9 text-xs",
  lg: "size-11 text-xs",
  xl: "size-14 text-sm",
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  spacing?: AvatarGroupSpacing
  children: ReactNode
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(({
  spacing = "normal",
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        "flex w-fit max-w-full items-center justify-start overflow-x-auto overscroll-x-contain px-0.5 py-0.5 scrollbar-none [&>*]:shrink-0 [&>*]:ring-2 [&>*]:ring-surface",
        spacingStyles[spacing],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
AvatarGroup.displayName = "AvatarGroup"

export interface AvatarGroupOverflowProps extends HTMLAttributes<HTMLSpanElement> {
  count: number
  size?: AvatarGroupOverflowSize
  label?: string
}

export const AvatarGroupOverflow = forwardRef<HTMLSpanElement, AvatarGroupOverflowProps>(({
  count,
  size = "md",
  label,
  className,
  ...props
}, ref) => {
  const normalizedCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0
  const resolvedLabel = label ?? `${normalizedCount} more people`

  return (
    <span
      ref={ref}
      aria-label={resolvedLabel}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-surface-muted font-semibold text-muted-foreground",
        overflowSizeStyles[size],
        className,
      )}
      {...props}
    >
      +{normalizedCount}
    </span>
  )
})
AvatarGroupOverflow.displayName = "AvatarGroupOverflow"

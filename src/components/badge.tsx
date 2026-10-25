import { cn } from "@/lib/cn"
import { statusSoftStyles, statusSolidStyles } from "@/lib/status-styles"
import { HTMLAttributes } from "react"

/** `error` is a deprecated alias of `danger`. */
export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "muted" | "error"
export type BadgeSize = "sm" | "md" | "lg"

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
  size?: BadgeSize
  /** Override or extend variant map — enables end-to-end customization */
  variants?: Partial<Record<BadgeVariant, string>>
}

export const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-accent-500/10 text-accent-strong border-accent-500/25",
  success: statusSoftStyles.success,
  warning: statusSoftStyles.warning,
  danger: statusSoftStyles.danger,
  error: statusSoftStyles.danger,
  info: statusSoftStyles.info,
  muted: "bg-muted text-muted-foreground border-border",
}

const badgeSizes: Record<BadgeSize, string> = {
  sm: "px-1.5 py-px text-[10.5px] gap-1 font-medium tracking-[-0.01em]",
  md: "px-2 py-0.5 text-[11.5px] gap-1.5 font-medium tracking-[-0.01em]",
  lg: "px-2.5 py-1 text-xs gap-1.5 font-medium tracking-[-0.01em]",
}

const badgeDots: Record<BadgeVariant, string> = {
  default: "bg-accent-400",
  success: statusSolidStyles.success,
  warning: statusSolidStyles.warning,
  danger: statusSolidStyles.danger,
  error: statusSolidStyles.danger,
  info: statusSolidStyles.info,
  muted: "bg-muted-foreground",
}

export function Badge({
  variant = "default",
  dot = false,
  size = "md",
  variants,
  className,
  children,
  ...props
}: BadgeProps) {
  const variantCls = variants?.[variant] ?? badgeVariants[variant]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] font-medium border leading-none whitespace-nowrap",
        variantCls,
        badgeSizes[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", badgeDots[variant])}
        />
      )}
      {children}
    </span>
  )
}

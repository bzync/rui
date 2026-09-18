"use client"

import { cn } from "@/lib/cn"
import { statusSoftStyles, statusTextStyles } from "@/lib/status-styles"
import { HTMLAttributes, ReactNode } from "react"

type TagVariant = "default" | "success" | "warning" | "error" | "info"
type TagSize = "sm" | "md"

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant
  size?: TagSize
  onRemove?: () => void
  icon?: ReactNode
  disabled?: boolean
}

const variants: Record<TagVariant, string> = {
  default: "bg-muted text-foreground border-border",
  success: statusSoftStyles.success,
  warning: statusSoftStyles.warning,
  error:   statusSoftStyles.danger,
  info:    statusSoftStyles.info,
}

const removeColor: Record<TagVariant, string> = {
  default: "text-muted-foreground hover:text-foreground",
  success: `${statusTextStyles.success} opacity-70 hover:opacity-100`,
  warning: `${statusTextStyles.warning} opacity-70 hover:opacity-100`,
  error:   `${statusTextStyles.danger} opacity-70 hover:opacity-100`,
  info:    `${statusTextStyles.info} opacity-70 hover:opacity-100`,
}

const sizes: Record<TagSize, string> = {
  sm: "px-2 py-0.5 text-xs gap-1 rounded-md",
  md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
}

export function Tag({
  variant = "default",
  size = "md",
  onRemove,
  icon,
  disabled,
  className,
  children,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border transition-colors",
        variants[variant],
        sizes[size],
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0 w-3 h-3 flex items-center justify-center">{icon}</span>}
      <span className="truncate">{children}</span>
      {onRemove && !disabled && (
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className={cn("shrink-0 ml-0.5 transition-colors cursor-pointer", removeColor[variant])}
          aria-label={`Remove${typeof children === "string" ? ` ${children}` : ""}`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

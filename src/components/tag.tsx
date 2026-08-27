"use client"

import { cn } from "@/lib/cn"
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
  default: "bg-black/8 dark:bg-white/8 text-slate-700 dark:text-slate-200 border-black/12 dark:border-white/12",
  success: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/12 text-amber-400 border-amber-500/20",
  error:   "bg-red-500/12 text-red-400 border-red-500/20",
  info:    "bg-sky-500/12 text-sky-400 border-sky-500/20",
}

const removeColor: Record<TagVariant, string> = {
  default: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200",
  success: "text-emerald-400 hover:text-emerald-300",
  warning: "text-amber-400 hover:text-amber-300",
  error:   "text-red-400 hover:text-red-300",
  info:    "text-sky-400 hover:text-sky-300",
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

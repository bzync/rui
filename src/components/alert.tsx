"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { HTMLMotionProps, motion } from "framer-motion"
import { ReactNode } from "react"

type Variant = "info" | "success" | "warning" | "error"

export interface AlertProps extends Omit<HTMLMotionProps<"div">, "title" | "children"> {
  variant?: Variant
  title?: string
  icon?: ReactNode
  children?: ReactNode
  dismissable?: boolean
  onDismiss?: () => void
}

const styles: Record<
  Variant,
  { container: string; accent: string; icon: string; title: string; body: string }
> = {
  info: {
    container: "bg-sky-500/[0.07] dark:bg-sky-500/[0.09] border-sky-400/25 dark:border-sky-500/20",
    accent: "bg-sky-500",
    icon: "text-sky-600 dark:text-sky-400",
    title: "text-sky-900 dark:text-sky-100",
    body: "text-sky-800/90 dark:text-sky-200/70",
  },
  success: {
    container: "bg-emerald-500/[0.07] dark:bg-emerald-500/[0.09] border-emerald-400/25 dark:border-emerald-500/20",
    accent: "bg-emerald-500",
    icon: "text-emerald-600 dark:text-emerald-400",
    title: "text-emerald-900 dark:text-emerald-100",
    body: "text-emerald-800/90 dark:text-emerald-200/70",
  },
  warning: {
    container: "bg-amber-500/[0.07] dark:bg-amber-500/[0.09] border-amber-400/30 dark:border-amber-500/20",
    accent: "bg-amber-500",
    icon: "text-amber-600 dark:text-amber-400",
    title: "text-amber-900 dark:text-amber-100",
    body: "text-amber-800/90 dark:text-amber-200/70",
  },
  error: {
    container: "bg-red-500/[0.07] dark:bg-red-500/[0.09] border-red-400/25 dark:border-red-500/20",
    accent: "bg-red-500",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-900 dark:text-red-100",
    body: "text-red-800/90 dark:text-red-200/70",
  },
}

const defaultIcons: Record<Variant, ReactNode> = {
  info: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  success: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  ),
  warning: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  error: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  ),
}

export function Alert({
  variant = "info",
  title,
  icon,
  className,
  children,
  dismissable = false,
  onDismiss,
  ...props
}: AlertProps) {
  const s = styles[variant]
  const displayIcon = icon ?? defaultIcons[variant]
  const liveRole = variant === "error" || variant === "warning" ? "alert" : "status"

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      role={liveRole}
      className={cn("relative flex gap-3 rounded-[var(--radius-lg)] border overflow-hidden pl-4 pr-4 py-3.5", s.container, className)}
      {...props}
    >
      <span className={cn("absolute left-0 inset-y-0 w-[3px]", s.accent)} aria-hidden="true" />
      <span className={cn("shrink-0 mt-0.5", s.icon)}>{displayIcon}</span>
      <div className="min-w-0 flex-1">
        {title && (
          <p className={cn("text-sm font-semibold leading-snug mb-0.5", s.title)}>{title}</p>
        )}
        {children && <div className={cn("text-sm leading-relaxed", s.body)}>{children}</div>}
      </div>
      {dismissable && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn("shrink-0 mt-0.5 rounded-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer", focusRingStyles, s.icon)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  )
}

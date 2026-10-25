"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { resolveTone, statusSolidStyles, statusSurfaceStyles, statusTextStyles } from "@/lib/status-styles"
import { HTMLMotionProps } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { ReactNode } from "react"

/** `error` is a deprecated alias of `danger`; `muted` renders like `default`. */
export type AlertVariant = "default" | "success" | "warning" | "danger" | "info" | "muted" | "error"
type Variant = Exclude<AlertVariant, "error" | "muted">

export interface AlertProps extends Omit<HTMLMotionProps<"div">, "title" | "children"> {
  variant?: AlertVariant
  title?: string
  icon?: ReactNode
  children?: ReactNode
  dismissable?: boolean
  onDismiss?: () => void
  /** Class for the colored bar on the leading edge. */
  accentClassName?: string
  /** Class for the icon (and the dismiss button, which shares its color). */
  iconClassName?: string
  titleClassName?: string
  bodyClassName?: string
}

const styles: Record<
  Variant,
  { container: string; accent: string; icon: string; title: string; body: string }
> = {
  default: {
    container: "bg-muted border-border",
    accent: "bg-border-strong",
    icon: "text-muted-foreground",
    title: "text-foreground",
    body: "text-foreground/80",
  },
  info: {
    container: statusSurfaceStyles.info,
    accent: statusSolidStyles.info,
    icon: statusTextStyles.info,
    title: statusTextStyles.info,
    body: "text-foreground/80",
  },
  success: {
    container: statusSurfaceStyles.success,
    accent: statusSolidStyles.success,
    icon: statusTextStyles.success,
    title: statusTextStyles.success,
    body: "text-foreground/80",
  },
  warning: {
    container: statusSurfaceStyles.warning,
    accent: statusSolidStyles.warning,
    icon: statusTextStyles.warning,
    title: statusTextStyles.warning,
    body: "text-foreground/80",
  },
  danger: {
    container: statusSurfaceStyles.danger,
    accent: statusSolidStyles.danger,
    icon: statusTextStyles.danger,
    title: statusTextStyles.danger,
    body: "text-foreground/80",
  },
}

const infoIcon = (
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
)

const defaultIcons: Record<Variant, ReactNode> = {
  default: infoIcon,
  info: infoIcon,
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
  danger: (
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
  accentClassName,
  iconClassName,
  titleClassName,
  bodyClassName,
  ...props
}: AlertProps) {
  const resolved = resolveTone(variant)
  const tone: Variant = resolved === "muted" ? "default" : resolved
  const s = styles[tone]
  const displayIcon = icon ?? defaultIcons[tone]
  const liveRole = tone === "danger" || tone === "warning" ? "alert" : "status"

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      role={liveRole}
      className={cn("relative flex gap-3 rounded-[var(--radius-lg)] border overflow-hidden pl-4 pr-4 py-3.5", s.container, className)}
      {...props}
    >
      <span className={cn("absolute left-0 inset-y-0 w-[3px]", s.accent, accentClassName)} aria-hidden="true" />
      <span className={cn("shrink-0 mt-0.5", s.icon, iconClassName)}>{displayIcon}</span>
      <div className="min-w-0 flex-1">
        {title && (
          <p className={cn("text-sm font-semibold leading-snug mb-0.5", s.title, titleClassName)}>{title}</p>
        )}
        {children && <div className={cn("text-sm leading-relaxed", s.body, bodyClassName)}>{children}</div>}
      </div>
      {dismissable && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn("shrink-0 mt-0.5 rounded-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer", focusRingStyles, s.icon, iconClassName)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  )
}

import { cn } from "@/lib/cn"
import { resolveTone, statusSurfaceStyles, statusTextStyles } from "@/lib/status-styles"
import { HTMLAttributes, ReactNode, forwardRef } from "react"

/** `error` is a deprecated alias of `danger`; `muted` renders like `default`. */
export type CalloutVariant = "default" | "success" | "warning" | "danger" | "info" | "muted" | "error"

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant
  icon?: ReactNode
  title?: string
  iconClassName?: string
  titleClassName?: string
  bodyClassName?: string
}

const styles: Record<Exclude<CalloutVariant, "error" | "muted">, { wrap: string; icon: string; defaultIcon: ReactNode }> = {
  default: {
    wrap: "bg-muted border-border",
    icon: "text-muted-foreground",
    defaultIcon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
      </svg>
    ),
  },
  info: {
    wrap: statusSurfaceStyles.info,
    icon: statusTextStyles.info,
    defaultIcon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
      </svg>
    ),
  },
  success: {
    wrap: statusSurfaceStyles.success,
    icon: statusTextStyles.success,
    defaultIcon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
      </svg>
    ),
  },
  warning: {
    wrap: statusSurfaceStyles.warning,
    icon: statusTextStyles.warning,
    defaultIcon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" /><path d="M12 17h.01" />
      </svg>
    ),
  },
  danger: {
    wrap: statusSurfaceStyles.danger,
    icon: statusTextStyles.danger,
    defaultIcon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
      </svg>
    ),
  },
}

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(function Callout({ variant = "info", icon, title, className, children, iconClassName, titleClassName, bodyClassName, ...props }, ref) {
  const tone = resolveTone(variant)
  const { wrap, icon: iconCls, defaultIcon } = styles[tone === "muted" ? "default" : tone]

  return (
    <div ref={ref}
      className={cn("flex gap-3 rounded-[var(--radius-lg)] border px-4 py-3.5", wrap, className)}
      role="note"
      {...props}
    >
      <span className={cn("shrink-0 mt-0.5", iconCls, iconClassName)}>{icon ?? defaultIcon}</span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn("text-sm font-semibold text-foreground mb-0.5 leading-snug", titleClassName)}>{title}</p>
        )}
        <div className={cn("text-sm leading-relaxed text-foreground/80", bodyClassName)}>{children}</div>
      </div>
    </div>
  )
})
Callout.displayName = "Callout"

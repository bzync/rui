"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { CloseIcon } from "@/lib/icons"
import { type StatusTone, statusSurfaceStyles, statusTextStyles } from "@/lib/status-styles"
import { type HTMLAttributes, type ReactNode, forwardRef, useEffect, useState } from "react"

export type BannerTone = "default" | StatusTone

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: BannerTone
  /** `subtle` is tinted with a bottom border; `solid` is a filled strip for high-priority notices. */
  variant?: "subtle" | "solid"
  icon?: ReactNode
  title?: ReactNode
  /** Call to action rendered after the message (a link or small button). */
  action?: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  /** Remembers the dismissal in localStorage under this key, so the banner stays hidden. */
  storageKey?: string
  /** Sticks to the top of the scroll container. */
  sticky?: boolean
  /** Centers the content (marketing announcements). Default false. */
  centered?: boolean
  dismissAriaLabel?: string
  contentClassName?: string
}

const subtleStyles: Record<BannerTone, string> = {
  default: "bg-surface-muted border-border text-foreground",
  info: cn(statusSurfaceStyles.info, "text-foreground"),
  success: cn(statusSurfaceStyles.success, "text-foreground"),
  warning: cn(statusSurfaceStyles.warning, "text-foreground"),
  danger: cn(statusSurfaceStyles.danger, "text-foreground"),
}

const subtleIconStyles: Record<BannerTone, string> = {
  default: "text-muted-foreground",
  ...statusTextStyles,
}

const solidStyles: Record<BannerTone, string> = {
  default: "bg-foreground text-bg border-transparent",
  info: "bg-accent-600 text-white border-transparent",
  success: "bg-success text-white border-transparent",
  warning: "bg-warning text-black/85 border-transparent",
  danger: "bg-danger text-white border-transparent",
}

/**
 * Page-level announcement strip: maintenance windows, trial expiry, product
 * launches. Spans its container; place it above the app shell. Warning and
 * danger tones are announced as alerts, others as status.
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner({
  tone = "default",
  variant = "subtle",
  icon,
  title,
  action,
  dismissible = false,
  onDismiss,
  storageKey,
  sticky = false,
  centered = false,
  dismissAriaLabel = "Dismiss",
  className,
  contentClassName,
  children,
  ...props
}, ref) {
  const [dismissed, setDismissed] = useState(false)

  // Read after mount: the server cannot see storage, and hiding later keeps hydration clean.
  useEffect(() => {
    if (!storageKey) return
    try { if (window.localStorage.getItem(storageKey) === "dismissed") setDismissed(true) } catch { /* storage unavailable */ }
  }, [storageKey])

  if (dismissed) return null

  const dismiss = () => {
    setDismissed(true)
    if (storageKey) {
      try { window.localStorage.setItem(storageKey, "dismissed") } catch { /* storage unavailable */ }
    }
    onDismiss?.()
  }

  const urgent = tone === "warning" || tone === "danger"
  const solid = variant === "solid"

  return (
    <div
      ref={ref}
      role={urgent ? "alert" : "status"}
      data-tone={tone}
      className={cn(
        "w-full border-b text-sm",
        solid ? solidStyles[tone] : subtleStyles[tone],
        sticky && "sticky top-0 z-(--z-sticky)",
        className,
      )}
      {...props}
    >
      <div className={cn("mx-auto flex min-h-11 w-full items-center gap-x-3 gap-y-1 px-4 py-2 sm:px-6", centered && "justify-center text-center", contentClassName)}>
        {icon && <span aria-hidden="true" className={cn("flex shrink-0 [&_svg]:size-4", !solid && subtleIconStyles[tone])}>{icon}</span>}
        <div className={cn("flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1", centered ? "justify-center" : "flex-1")}>
          <p className="min-w-0">
            {title && <span className="font-semibold">{title}</span>}
            {title && children ? <span className={cn("mx-1.5", solid ? "opacity-60" : "text-muted-foreground")} aria-hidden="true">·</span> : null}
            {children && <span className={solid ? "opacity-90" : "text-foreground/80"}>{children}</span>}
          </p>
          {action && <div className="flex shrink-0 items-center gap-2 font-medium [&_a]:underline [&_a]:underline-offset-4">{action}</div>}
        </div>
        {dismissible && (
          <button
            type="button"
            aria-label={dismissAriaLabel}
            onClick={dismiss}
            className={cn("-mr-1.5 grid size-7 shrink-0 place-items-center rounded-md opacity-70 transition hover:bg-current/10 hover:opacity-100", focusRingStyles)}
          >
            <CloseIcon size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
})
Banner.displayName = "Banner"

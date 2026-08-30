"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { motionTokens } from "@/lib/motion"
import { AnimatePresence, motion } from "framer-motion"
import { ReactNode } from "react"
import type { SnackbarPosition, SnackbarVariant } from "./snackbar"

interface SnackbarItem {
  id: string
  message: ReactNode
  variant?: SnackbarVariant
  className?: string
  actionClassName?: string
  action?: { label: string; onClick: () => void }
}

const variantConfig: Record<SnackbarVariant, { bg: string; icon: ReactNode }> = {
  default: {
    bg: "border-border bg-surface-raised",
    icon: null,
  },
  info: {
    bg: "bg-sky-500/[0.09] dark:bg-sky-500/[0.12] border-sky-500/25",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
      </svg>
    ),
  },
  success: {
    bg: "bg-emerald-500/[0.09] dark:bg-emerald-500/[0.12] border-emerald-500/25",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-amber-500/[0.09] dark:bg-amber-500/[0.12] border-amber-500/25",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" /><path d="M12 17h.01" />
      </svg>
    ),
  },
  error: {
    bg: "bg-red-500/[0.09] dark:bg-red-500/[0.12] border-red-500/25",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
        <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
      </svg>
    ),
  },
}

// Top-anchored positions sit well below the fixed icon bar (44px) *and* the
// sticky Topbar's breadcrumb+title row (~70px) that most dashboard pages
// stack underneath it on mobile — top-32 (128px) clears both with room to
// spare. At top-3 they sat in the exact same rows as that chrome, directly
// overlapping its text. Wide desktop layouts don't have this collision (the
// topbar's title and a right-aligned toast never share horizontal space
// there), so sm:+ keeps the original tight offset.
const positionClass: Record<SnackbarPosition, string> = {
  "top-left":      "top-32 left-3 sm:top-4 sm:left-4",
  "top-center":    "top-32 left-1/2 -translate-x-1/2 sm:top-4",
  "top-right":     "top-32 right-3 sm:top-4 sm:right-4",
  "bottom-left":   "bottom-3 left-3 sm:bottom-4 sm:left-4",
  "bottom-center": "bottom-3 left-1/2 -translate-x-1/2 sm:bottom-4",
  "bottom-right":  "bottom-3 right-3 sm:bottom-4 sm:right-4",
}

const enterFrom: Record<SnackbarPosition, object> = {
  "top-left":      { x: -14 },
  "top-center":    { y: -14 },
  "top-right":     { x: 14 },
  "bottom-left":   { x: -14 },
  "bottom-center": { y: 14 },
  "bottom-right":  { x: 14 },
}

export interface SnackbarViewportProps {
  items: SnackbarItem[]
  position: SnackbarPosition
  className?: string
  toastClassName?: string
  onDismiss: (id: string) => void
}

/**
 * The framer-motion-backed toast stack for {@link SnackbarProvider}, split into
 * its own async chunk so the motion runtime stays off the initial critical
 * path — it loads the first time a toast is shown, not on page load.
 */
export default function SnackbarViewport({
  items,
  position,
  className,
  toastClassName,
  onDismiss,
}: SnackbarViewportProps) {
  const from = enterFrom[position]

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className={cn(
        "fixed z-[100] flex flex-col gap-2 pointer-events-none",
        positionClass[position],
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => {
          const { bg, icon } = variantConfig[item.variant ?? "default"]
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ ...from, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={motionTokens.spring.snappy}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-[var(--radius-lg)] border px-4 py-3",
                "w-[calc(100vw-1.5rem)] max-w-sm shadow-floating sm:w-auto sm:min-w-[280px]",
                bg,
                toastClassName,
                item.className,
              )}
            >
              {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
              <div className="flex-1 min-w-0">
                <div className="text-sm leading-snug text-foreground">{item.message}</div>
                {item.action && (
                  <button
                    type="button"
                    onClick={() => {
                      item.action!.onClick()
                      onDismiss(item.id)
                    }}
                    className={cn("mt-1.5 text-xs font-semibold text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors", item.actionClassName)}
                  >
                    {item.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(item.id)}
                aria-label="Dismiss"
                className={cn("mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground", focusRingStyles)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

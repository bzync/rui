"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { AnimatePresence, motion } from "framer-motion"
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

export type SnackbarVariant = "default" | "info" | "success" | "warning" | "error"
export type SnackbarPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

export interface SnackbarOptions {
  message: ReactNode
  variant?: SnackbarVariant
  className?: string
  actionClassName?: string
  /** Auto-dismiss delay in ms. Set to 0 to persist until dismissed. Default: 4000 */
  duration?: number
  action?: { label: string; onClick: () => void }
  /**
   * Stable id for deduplication — if a toast with this id is already
   * showing, calling show() again with the same id replaces it in place
   * (and resets its dismiss timer) instead of stacking a second copy.
   * Without an id, every call always adds a new toast, even if the
   * message is identical to one already on screen (e.g. two components
   * independently failing the same request in the same render pass).
   */
  id?: string
}

interface SnackbarItem extends SnackbarOptions {
  id: string
}

interface SnackbarContextValue {
  show: (opts: SnackbarOptions) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

const SnackbarCtx = createContext<SnackbarContextValue | null>(null)

export function useSnackbar() {
  const ctx = useContext(SnackbarCtx)
  if (!ctx) throw new Error("useSnackbar must be inside <SnackbarProvider>")
  return ctx
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

export interface SnackbarProviderProps {
  children: ReactNode
  position?: SnackbarPosition
  maxVisible?: number
  className?: string
  toastClassName?: string
}

export function SnackbarProvider({
  children,
  position = "bottom-right",
  maxVisible = 5,
  className,
  toastClassName,
}: SnackbarProviderProps) {
  const [items, setItems] = useState<SnackbarItem[]>([])
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    Object.values(timers.current).forEach(clearTimeout)
    timers.current = {}
    setItems([])
  }, [])

  const show = useCallback(
    (opts: SnackbarOptions) => {
      const id = opts.id ?? Math.random().toString(36).slice(2, 9)
      setItems((prev) => {
        const existingIdx = opts.id ? prev.findIndex((i) => i.id === id) : -1
        if (existingIdx === -1) return [{ ...opts, id }, ...prev].slice(0, maxVisible)
        // Replace in place rather than stacking a duplicate — keeps its
        // original position instead of jumping to the front.
        const next = [...prev]
        next[existingIdx] = { ...opts, id }
        return next
      })
      clearTimeout(timers.current[id])
      const duration = opts.duration ?? 4000
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss, maxVisible],
  )

  const from = enterFrom[position]

  return (
    <SnackbarCtx.Provider value={{ show, dismiss, dismissAll }}>
      {children}
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
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
                        dismiss(item.id)
                      }}
                      className={cn("mt-1.5 text-xs font-semibold text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors", item.actionClassName)}
                    >
                      {item.action.label}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
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
    </SnackbarCtx.Provider>
  )
}

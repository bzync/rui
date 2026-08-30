"use client"

import {
  ReactNode,
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

// The toast stack pulls in framer-motion, so it lives in its own async chunk.
// It's fetched the first time a toast is shown and then kept mounted so
// subsequent toasts — and exit animations — are instant.
const SnackbarViewport = lazy(() => import("./snackbar-viewport"))

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
  // Latches true on the first toast so the lazy viewport stays mounted for
  // exit animations and instant subsequent toasts.
  const [viewportMounted, setViewportMounted] = useState(false)
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])

  useEffect(() => {
    if (items.length > 0) setViewportMounted(true)
  }, [items.length])

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

  return (
    <SnackbarCtx.Provider value={{ show, dismiss, dismissAll }}>
      {children}
      {viewportMounted && (
        <Suspense fallback={null}>
          <SnackbarViewport
            items={items}
            position={position}
            className={className}
            toastClassName={toastClassName}
            onDismiss={dismiss}
          />
        </Suspense>
      )}
    </SnackbarCtx.Provider>
  )
}

"use client"

import { cn } from "@/lib/cn"
import { iconButtonStyles } from "@/lib/component-styles"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { ReactNode, useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"
import { useEventCallback } from "@/hooks/use-event-callback"
import { getFocusable } from "@/utils/focus"

export interface DrawerProps {
  open: boolean
  onClose: () => void
  position?: "left" | "right" | "bottom"
  title?: ReactNode
  children: ReactNode
  width?: number | string
  className?: string
  overlayClassName?: string
  panelClassName?: string
  unstyled?: boolean
  ariaLabel?: string
  closeAriaLabel?: string
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
}

export function Drawer({
  open,
  onClose,
  position = "left",
  title,
  children,
  width = 320,
  className,
  overlayClassName,
  panelClassName,
  unstyled = false,
  ariaLabel = "Drawer",
  closeAriaLabel = "Close drawer",
  closeOnEscape = true,
  closeOnOverlayClick = true,
}: DrawerProps) {
  const onCloseStable = useEventCallback(onClose)
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(open)
  const titleId = useId()

  if (open && !wasOpenRef.current && typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
    previouslyFocusedRef.current = document.activeElement
  }
  wasOpenRef.current = open

  useEffect(() => {
    if (open) return
    const rememberFocus = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) previouslyFocusedRef.current = event.target
    }
    if (!previouslyFocusedRef.current && document.activeElement instanceof HTMLElement) previouslyFocusedRef.current = document.activeElement
    document.addEventListener("focusin", rememberFocus)
    return () => document.removeEventListener("focusin", rememberFocus)
  }, [open])

  useEffect(() => {
    if (!open) return
    if (!previouslyFocusedRef.current && document.activeElement instanceof HTMLElement) previouslyFocusedRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) { e.preventDefault(); onCloseStable(); return }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = getFocusable(panelRef.current)
        if (focusable.length === 0) { e.preventDefault(); panelRef.current.focus(); return }
        const first = focusable[0], last = focusable[focusable.length-1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    // focus first
    const t = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>("a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex=\"-1\"])")
      ;(first ?? panelRef.current)?.focus()
    }, 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [closeOnEscape, open, onCloseStable])

  useEffect(() => {
    if (open || !previouslyFocusedRef.current) return
    const previouslyFocused = previouslyFocusedRef.current
    const timer = window.setTimeout(() => previouslyFocused.focus(), 240)
    return () => window.clearTimeout(timer)
  }, [open])

  const restoreFocus = () => {
    const previouslyFocused = previouslyFocusedRef.current
    previouslyFocusedRef.current = null
    window.setTimeout(() => previouslyFocused?.focus(), 0)
  }

  if (typeof document === "undefined") return null
  if (unstyled && open) {
    return createPortal(<div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : ariaLabel} className={cn(className, panelClassName)}>{children}</div>, document.body)
  }

  if (position === "bottom") {
    return createPortal(
      <AnimatePresence onExitComplete={restoreFocus}>
        {open && (
          <>
            <motion.div key="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className={cn("fixed inset-0 z-[100] bg-overlay", overlayClassName)} onClick={closeOnOverlayClick ? onCloseStable : undefined} />
            <motion.div ref={panelRef} tabIndex={-1} key="drawer-panel" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : ariaLabel} className={cn("fixed bottom-0 left-0 right-0 z-[101] flex max-h-[80dvh] flex-col rounded-t-[var(--radius-xl)] border-t border-border bg-surface-raised shadow-overlay", panelClassName, className)}>
              <div className="flex justify-center pb-1 pt-3 shrink-0" aria-hidden="true"><div className="h-1 w-9 rounded-full bg-border-strong" /></div>
              {title && (<div className="flex items-center justify-between border-b border-border px-5 py-3 shrink-0"><h2 id={titleId} className="text-sm font-semibold text-foreground">{title}</h2><button type="button" onClick={onCloseStable} className={iconButtonStyles} aria-label={closeAriaLabel}><X size={14} aria-hidden="true" /></button></div>)}
              <div className="flex-1 overflow-y-auto pb-safe-bottom">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>, document.body,
    )
  }

  const xHidden = position === "left" ? "-100%" : "100%"
  return createPortal(
    <AnimatePresence onExitComplete={restoreFocus}>
      {open && (
        <>
          <motion.div key="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className={cn("fixed inset-0 z-[100] bg-overlay", overlayClassName)} onClick={closeOnOverlayClick ? onCloseStable : undefined} />
          <motion.div ref={panelRef} tabIndex={-1} key="drawer-panel" initial={{ x: xHidden }} animate={{ x: 0 }} exit={{ x: xHidden }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : ariaLabel} className={cn("fixed top-0 bottom-0 z-[101] flex max-w-[100vw] flex-col bg-surface-raised shadow-overlay", position === "left" ? "left-0 border-r border-border" : "right-0 border-l border-border", panelClassName, className)} style={{ width }}>
            {title && (<div className="flex h-14 items-center justify-between gap-3 border-b border-border px-5 shrink-0"><h2 id={titleId} className="min-w-0 truncate text-sm font-semibold text-foreground">{title}</h2><button type="button" onClick={onCloseStable} className={iconButtonStyles} aria-label={closeAriaLabel}><X size={14} aria-hidden="true" /></button></div>)}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>, document.body,
  )
}

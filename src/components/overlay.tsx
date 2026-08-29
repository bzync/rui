"use client"

import { cn } from "@/lib/cn"
import { AnimatePresence, motion } from "framer-motion"
import { transitions } from "@/lib/motion"
import { ReactNode, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useEventCallback } from "@/hooks/use-event-callback"
import { useFocusTrap, useRestoreFocus } from "@/hooks/use-focus-trap"

/**
 * Overlay — shared primitive for Modal / Drawer / Dialog / Popover / Dropdown.
 * Standardizes:
 *  - Portal (to document.body)
 *  - z-index layering
 *  - Escape handling
 *  - Outside click
 *  - Focus trap + restore
 *  - Scroll lock
 *
 * Individual components keep their own layout/animation but delegate
 * overlay concerns here.
 */

export interface OverlayProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** Render without portal (for non-portaled overlays like inline Modal) */
  portal?: boolean
  /** Disable scroll lock */
  disableScrollLock?: boolean
  closeOnEscape?: boolean
  closeOnOutsideClick?: boolean
  /** z-index base (overlay) — panel renders at +1 */
  zIndex?: number
  /** Class for the backdrop */
  backdropClassName?: string
  /** Class for the panel wrapper */
  panelClassName?: string
  /** Alias for the panel's root class, matching the component styling contract. */
  className?: string
  /** Class for the fixed positioning container. */
  containerClassName?: string
  /** Accessible label when no title is provided */
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  /** If true, render as dialog */
  role?: "dialog" | "menu" | "listbox"
}

export function Overlay({
  open,
  onClose,
  children,
  portal = true,
  disableScrollLock = false,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  zIndex = 50,
  backdropClassName,
  panelClassName,
  className,
  containerClassName,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  role = "dialog",
}: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseStable = useEventCallback(onClose)
  const { restoreNow } = useRestoreFocus(open)

  useFocusTrap(panelRef, {
    active: open,
    onEscape: onCloseStable,
    closeOnEscape,
    disableScrollLock,
  })

  // Outside click
  useEffect(() => {
    if (!open || !closeOnOutsideClick) return
    function onMouseDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onCloseStable()
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [open, closeOnOutsideClick, onCloseStable])

  const content = (
    <AnimatePresence onExitComplete={restoreNow}>
      {open && (
        <div className={cn("fixed inset-0 flex items-center justify-center p-4", containerClassName)} style={{ zIndex }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.overlay}
            className={cn("absolute inset-0 bg-overlay", backdropClassName)}
            onClick={closeOnOutsideClick ? onCloseStable : undefined}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={transitions.panelEnter}
            role={role}
            aria-modal={role === "dialog" ? true : undefined}
            aria-label={ariaLabelledby ? undefined : ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            tabIndex={-1}
            className={cn(
              "relative w-full rounded-[var(--radius-xl)] border border-border bg-surface-raised shadow-overlay",
              panelClassName,
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  if (!portal || typeof document === "undefined") return content
  return createPortal(content, document.body)
}

/**
 * OverlayBackdrop — standalone backdrop for Drawer/Popover that need custom positioning.
 */
export function OverlayBackdrop({
  open,
  onClose,
  className,
  zIndex = 50,
  closeOnClick = true,
}: {
  open: boolean
  onClose: () => void
  className?: string
  zIndex?: number
  closeOnClick?: boolean
}) {
  const onCloseStable = useEventCallback(onClose)
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transitions.overlay}
          className={cn("fixed inset-0 bg-overlay", className)}
          style={{ zIndex }}
          onClick={closeOnClick ? onCloseStable : undefined}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  )
}

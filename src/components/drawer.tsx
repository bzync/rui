"use client"

import { cn } from "@/lib/cn"
import { iconButtonStyles } from "@/lib/component-styles"
import { AnimatePresence, motion } from "framer-motion"
import { transitions } from "@/lib/motion"
import { X } from "lucide-react"
import { ReactNode, useId, useRef } from "react"
import { createPortal } from "react-dom"
import { useEventCallback } from "@/hooks/use-event-callback"
import { useFocusTrap, useRestoreFocus } from "@/hooks/use-focus-trap"

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
  headerClassName?: string
  titleClassName?: string
  closeButtonClassName?: string
  contentClassName?: string
  handleClassName?: string
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
  headerClassName,
  titleClassName,
  closeButtonClassName,
  contentClassName,
  handleClassName,
  unstyled = false,
  ariaLabel = "Drawer",
  closeAriaLabel = "Close drawer",
  closeOnEscape = true,
  closeOnOverlayClick = true,
}: DrawerProps) {
  const onCloseStable = useEventCallback(onClose)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const { previouslyFocusedRef, restoreNow } = useRestoreFocus(open)

  useFocusTrap(panelRef, {
    active: open,
    onEscape: onCloseStable,
    closeOnEscape,
  })

  const restoreFocus = restoreNow

  if (typeof document === "undefined") return null
  if (unstyled && open) {
    return createPortal(<div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : ariaLabel} className={cn(className, panelClassName)}>{children}</div>, document.body)
  }

  if (position === "bottom") {
    return createPortal(
      <AnimatePresence onExitComplete={restoreFocus}>
        {open && (
          <>
            <motion.div key="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transitions.overlay} className={cn("fixed inset-0 z-[100] bg-overlay", overlayClassName)} onClick={closeOnOverlayClick ? onCloseStable : undefined} />
            <motion.div ref={panelRef} tabIndex={-1} key="drawer-panel" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={transitions.panelEnter} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : ariaLabel} className={cn("fixed bottom-0 left-0 right-0 z-[101] flex max-h-[80dvh] flex-col rounded-t-[var(--radius-xl)] border-t border-border bg-surface-raised shadow-overlay", panelClassName, className)}>
              <div className="flex justify-center pb-1 pt-3 shrink-0" aria-hidden="true"><div className={cn("h-1 w-9 rounded-full bg-border-strong", handleClassName)} /></div>
              {title && (<div className={cn("flex items-center justify-between border-b border-border px-5 py-3 shrink-0", headerClassName)}><h2 id={titleId} className={cn("text-sm font-semibold text-foreground", titleClassName)}>{title}</h2><button type="button" onClick={onCloseStable} className={cn(iconButtonStyles, closeButtonClassName)} aria-label={closeAriaLabel}><X size={14} aria-hidden="true" /></button></div>)}
              <div className={cn("flex-1 overflow-y-auto pb-safe-bottom", contentClassName)}>{children}</div>
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
          <motion.div key="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transitions.overlay} className={cn("fixed inset-0 z-[100] bg-overlay", overlayClassName)} onClick={closeOnOverlayClick ? onCloseStable : undefined} />
          <motion.div ref={panelRef} tabIndex={-1} key="drawer-panel" initial={{ x: xHidden }} animate={{ x: 0 }} exit={{ x: xHidden }} transition={transitions.panelEnter} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : ariaLabel} className={cn("fixed top-0 bottom-0 z-[101] flex max-w-[100vw] flex-col bg-surface-raised shadow-overlay", position === "left" ? "left-0 border-r border-border" : "right-0 border-l border-border", panelClassName, className)} style={{ width }}>
            {title && (<div className={cn("flex h-14 items-center justify-between gap-3 border-b border-border px-5 shrink-0", headerClassName)}><h2 id={titleId} className={cn("min-w-0 truncate text-sm font-semibold text-foreground", titleClassName)}>{title}</h2><button type="button" onClick={onCloseStable} className={cn(iconButtonStyles, closeButtonClassName)} aria-label={closeAriaLabel}><X size={14} aria-hidden="true" /></button></div>)}
            <div className={cn("flex-1 overflow-y-auto", contentClassName)}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>, document.body,
  )
}

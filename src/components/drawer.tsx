"use client"

import { cn } from "@/lib/cn"
import { mergeRefs } from "@/lib/merge-refs"
import { ThemePortal } from "./theme-provider"
import { iconButtonStyles } from "@/lib/component-styles"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { transitions } from "@/lib/motion"
import { CloseIcon } from "@/lib/icons"
import { HTMLAttributes, ReactNode, forwardRef, useId, useRef } from "react"
import { useEventCallback } from "@/hooks/use-event-callback"
import { useFocusTrap, useRestoreFocus } from "@/hooks/use-focus-trap"
import { useHydrated } from "@/hooks/use-hydrated"

export interface DrawerProps {
  open: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  position?: "left" | "right" | "bottom"
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  width?: number | string
  className?: string
  overlayClassName?: string
  panelClassName?: string
  headerClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  closeButtonClassName?: string
  contentClassName?: string
  handleClassName?: string
  showCloseButton?: boolean
  portalled?: boolean
  unstyled?: boolean
  ariaLabel?: string
  closeAriaLabel?: string
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer({
  open,
  onClose,
  onOpenChange,
  position = "left",
  title,
  description,
  children,
  width = 320,
  className,
  overlayClassName,
  panelClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  closeButtonClassName,
  contentClassName,
  handleClassName,
  showCloseButton = true,
  portalled = true,
  unstyled = false,
  ariaLabel = "Drawer",
  closeAriaLabel = "Close drawer",
  closeOnEscape = true,
  closeOnOverlayClick = true,
}, ref) {
  const handleClose = useEventCallback(() => {
    onClose?.()
    onOpenChange?.(false)
  })
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const { restoreNow } = useRestoreFocus(open)
  // The portalled panel does not exist until after hydration; arm the trap then.
  const hydrated = useHydrated()

  useFocusTrap(panelRef, {
    active: open && (hydrated || !portalled),
    onEscape: handleClose,
    closeOnEscape,
  })

  const restoreFocus = restoreNow
  const portal = (content: ReactNode) => (portalled ? <ThemePortal>{content}</ThemePortal> : content)

  if (unstyled && open) {
    return portal(<div ref={mergeRefs(panelRef, ref)} tabIndex={-1} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : ariaLabel} className={cn(className, panelClassName)}>{children}</div>)
  }

  if (position === "bottom") {
    return portal(
      <AnimatePresence onExitComplete={restoreFocus}>
        {open && (
          <>
            <motion.div key="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transitions.overlay} className={cn("fixed inset-0 z-(--z-modal) bg-overlay", overlayClassName)} onClick={closeOnOverlayClick ? handleClose : undefined} />
            <motion.div ref={mergeRefs(panelRef, ref)} tabIndex={-1} key="drawer-panel" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={transitions.panelEnter} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-describedby={description ? descriptionId : undefined} aria-label={title ? undefined : ariaLabel} className={cn("fixed bottom-0 left-0 right-0 z-(--z-modal) flex max-h-[80dvh] flex-col rounded-t-[var(--radius-xl)] border-t border-border bg-surface-raised shadow-overlay", panelClassName, className)}>
              <div className="flex justify-center pb-1 pt-3 shrink-0" aria-hidden="true"><div className={cn("h-1 w-9 rounded-full bg-border-strong", handleClassName)} /></div>
              {(title || description) && (
                <div className={cn("flex items-center justify-between gap-3 border-b border-border px-5 py-3 shrink-0", headerClassName)}>
                  <div className="min-w-0 flex-1">
                    {title && <h2 id={titleId} className={cn("text-sm font-semibold text-foreground", titleClassName)}>{title}</h2>}
                    {description && <p id={descriptionId} className={cn("mt-0.5 text-xs text-muted-foreground", descriptionClassName)}>{description}</p>}
                  </div>
                  {showCloseButton && (
                    <button type="button" onClick={handleClose} className={cn(iconButtonStyles, closeButtonClassName)} aria-label={closeAriaLabel}><CloseIcon size={14} aria-hidden="true" /></button>
                  )}
                </div>
              )}
              <div className={cn("flex-1 overflow-y-auto pb-safe-bottom", contentClassName)}>{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
    )
  }

  const xHidden = position === "left" ? "-100%" : "100%"
  return portal(
    <AnimatePresence onExitComplete={restoreFocus}>
      {open && (
        <>
          <motion.div key="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transitions.overlay} className={cn("fixed inset-0 z-(--z-modal) bg-overlay", overlayClassName)} onClick={closeOnOverlayClick ? handleClose : undefined} />
          <motion.div ref={mergeRefs(panelRef, ref)} tabIndex={-1} key="drawer-panel" initial={{ x: xHidden }} animate={{ x: 0 }} exit={{ x: xHidden }} transition={transitions.panelEnter} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-describedby={description ? descriptionId : undefined} aria-label={title ? undefined : ariaLabel} className={cn("fixed top-0 bottom-0 z-(--z-modal) flex max-w-[100vw] flex-col bg-surface-raised shadow-overlay", position === "left" ? "left-0 border-r border-border" : "right-0 border-l border-border", panelClassName, className)} style={{ width }}>
            {(title || description) && (
              <div className={cn("flex min-h-14 items-center justify-between gap-3 border-b border-border px-5 py-3 shrink-0", headerClassName)}>
                <div className="min-w-0 flex-1">
                  {title && <h2 id={titleId} className={cn("min-w-0 truncate text-sm font-semibold text-foreground", titleClassName)}>{title}</h2>}
                  {description && <p id={descriptionId} className={cn("mt-0.5 text-xs text-muted-foreground", descriptionClassName)}>{description}</p>}
                </div>
                {showCloseButton && (
                  <button type="button" onClick={handleClose} className={cn(iconButtonStyles, closeButtonClassName)} aria-label={closeAriaLabel}><CloseIcon size={14} aria-hidden="true" /></button>
                )}
              </div>
            )}
            <div className={cn("flex-1 overflow-y-auto", contentClassName)}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
  )
})
Drawer.displayName = "Drawer"

export const DrawerHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DrawerHeader({ className, children, ...props }, ref) {
  return <div ref={ref} className={cn("px-5 pt-4 pb-3 border-b border-border shrink-0", className)} {...props}>{children}</div>
})
DrawerHeader.displayName = "DrawerHeader"

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> { scrollable?: boolean }
export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(function DrawerBody({ className, scrollable = true, children, ...props }, ref) {
  return <div ref={ref} className={cn("px-5 py-4", scrollable && "overflow-y-auto flex-1 overscroll-contain", className)} {...props}>{children}</div>
})
DrawerBody.displayName = "DrawerBody"

export const DrawerFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DrawerFooter({ className, children, ...props }, ref) {
  return <div ref={ref} className={cn("flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 pb-4 pt-3 shrink-0", className)} {...props}>{children}</div>
})
DrawerFooter.displayName = "DrawerFooter"

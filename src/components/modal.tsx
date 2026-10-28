"use client"

import { cn } from "@/lib/cn"
import { iconButtonStyles } from "@/lib/component-styles"
import { mergeRefs } from "@/lib/merge-refs"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { transitions } from "@/lib/motion"
import { HTMLAttributes, ReactNode, useId, useRef, forwardRef, type Ref } from "react"
import { useEventCallback } from "@/hooks/use-event-callback"
import { useFocusTrap, useRestoreFocus } from "@/hooks/use-focus-trap"
import { useHydrated } from "@/hooks/use-hydrated"
import { ThemePortal } from "./theme-provider"

export interface ModalProps {
  open: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  children: ReactNode
  className?: string
  overlayClassName?: string
  panelClassName?: string
  containerClassName?: string
  headerClassName?: string
  iconClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  closeButtonClassName?: string
  contentClassName?: string
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full"
  title?: string
  description?: string
  icon?: ReactNode
  showCloseButton?: boolean
  closeAriaLabel?: string
  scrollable?: boolean
  unstyled?: boolean
  ariaLabel?: string
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
  /**
   * Render the overlay through `ThemePortal` (to `document.body`) so ancestors
   * with `overflow`, `transform`, `contain` or their own stacking context
   * cannot clip it or trap its z-index. Defaults to true. Set false to render
   * the dialog inline where it is declared.
   */
  portalled?: boolean
}

const sizes = {
  sm:   "max-w-[380px]",
  md:   "max-w-[480px]",
  lg:   "max-w-[560px]",
  xl:   "max-w-[640px]",
  "2xl": "max-w-[720px]",
  "7xl": "max-w-3xl",
  full: "max-w-[calc(100vw-2rem)]",
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal({
  open,
  onClose,
  onOpenChange,
  children,
  className,
  overlayClassName,
  panelClassName,
  containerClassName,
  headerClassName,
  iconClassName,
  titleClassName,
  descriptionClassName,
  closeButtonClassName,
  contentClassName,
  size = "md",
  title,
  description,
  icon,
  showCloseButton = true,
  closeAriaLabel = "Close dialog",
  scrollable = false,
  unstyled = false,
  ariaLabel = "Dialog",
  closeOnEscape = true,
  closeOnOverlayClick = true,
  portalled = true,
}, ref) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const handleClose = useEventCallback(() => {
    onClose?.()
    onOpenChange?.(false)
  })
  const { restoreNow } = useRestoreFocus(open)
  // A portalled panel does not exist until after hydration; arm the trap then.
  const hydrated = useHydrated()

  useFocusTrap(panelRef, {
    active: open && (hydrated || !portalled),
    onEscape: handleClose,
    closeOnEscape,
  })

  const portal = (content: ReactNode) => (portalled ? <ThemePortal>{content}</ThemePortal> : content)

  if (unstyled) {
    return open ? portal(<div ref={mergeRefs(panelRef, ref)} role="dialog" aria-modal="true" className={cn(className, panelClassName)}>{children}</div>) : null
  }

  return portal(
    <AnimatePresence onExitComplete={restoreNow}>
      {open && (
        <div className={cn("fixed inset-0 z-(--z-modal) flex items-center justify-center p-4 sm:p-6", containerClassName)}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.overlay}
            className={cn("absolute inset-0 bg-overlay", overlayClassName)}
            onClick={closeOnOverlayClick ? handleClose : undefined}
          />
          <motion.div
            ref={mergeRefs(panelRef, ref)}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={transitions.panelEnter}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            aria-label={title ? undefined : ariaLabel}
            tabIndex={-1}
            className={cn(
              "relative w-full overflow-hidden flex flex-col",
              "rounded-[var(--radius-xl)] border border-border bg-surface-raised shadow-overlay",
              "max-h-[min(90dvh,720px)]",
              sizes[size],
              panelClassName,
              className,
            )}
          >
            {title && (
              <div className={cn("flex items-start justify-between gap-4 border-b border-border px-5 pb-3 pt-4 sm:px-6 shrink-0", headerClassName)}>
                <div className="flex gap-3.5 min-w-0 flex-1">
                  {icon && <div className={cn("mt-0.5 shrink-0 text-muted-foreground [&_svg]:size-5", iconClassName)} aria-hidden="true">{icon}</div>}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h2 id={titleId} className={cn("text-base font-semibold leading-6 text-foreground", titleClassName)}>{title}</h2>
                    {description && <p id={descriptionId} className={cn("mt-1 text-sm leading-5 text-muted-foreground", descriptionClassName)}>{description}</p>}
                  </div>
                </div>
                {showCloseButton && (
                  <button
                    type="button"
                    data-modal-close
                    aria-label={closeAriaLabel}
                    onClick={handleClose}
                    className={cn(iconButtonStyles, closeButtonClassName)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            )}
            {!title && showCloseButton && (
              <button
                type="button"
                data-modal-close
                aria-label={closeAriaLabel}
                onClick={handleClose}
                className={cn("absolute right-4 top-4 z-10", iconButtonStyles, closeButtonClassName)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            )}
            <div data-modal-content className={cn("px-5 py-4 sm:px-6 flex-1", scrollable ? "overflow-y-auto overscroll-contain" : "overflow-y-auto", contentClassName)}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
  )
})
Modal.displayName = "Modal"

export const ModalHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ModalHeader({ className, children, ...props }, ref) {
  return <div ref={ref} className={cn("px-5 pt-4 pb-3 sm:px-6 border-b border-border shrink-0", className)} {...props}>{children}</div>
})
ModalHeader.displayName = "ModalHeader"
export const ModalTitle = forwardRef<HTMLElement, HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "div" }>(function ModalTitle({ as: Tag = "h2", className, children, ...props }, ref) {
  return <Tag ref={ref as Ref<HTMLHeadingElement>} className={cn("text-base font-semibold leading-6 text-foreground", className)} {...props}>{children}</Tag>
})
ModalTitle.displayName = "ModalTitle"
export const ModalDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function ModalDescription({ className, children, ...props }, ref) {
  return <p ref={ref} className={cn("mt-1 text-sm leading-5 text-muted-foreground", className)} {...props}>{children}</p>
})
ModalDescription.displayName = "ModalDescription"
export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> { scrollable?: boolean }
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody({ className, scrollable = false, children, ...props }, ref) {
  return <div ref={ref} data-modal-content className={cn("px-5 py-4 sm:px-6", scrollable && "overflow-y-auto flex-1 overscroll-contain", className)} {...props}>{children}</div>
})
ModalBody.displayName = "ModalBody"
export const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ModalFooter({ className, children, ...props }, ref) {
  return <div ref={ref} className={cn("flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 pb-4 pt-3 sm:px-6 max-sm:flex-col-reverse max-sm:items-stretch", className)} {...props}>{children}</div>
})
ModalFooter.displayName = "ModalFooter"

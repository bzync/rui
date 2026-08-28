"use client"

import { cn } from "@/lib/cn"
import { iconButtonStyles } from "@/lib/component-styles"
import { AnimatePresence, motion } from "framer-motion"
import { transitions } from "@/lib/motion"
import { HTMLAttributes, ReactNode, useId, useRef } from "react"
import { useEventCallback } from "@/hooks/use-event-callback"
import { useFocusTrap, useRestoreFocus } from "@/hooks/use-focus-trap"

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  overlayClassName?: string
  panelClassName?: string
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

export function Modal({
  open,
  onClose,
  children,
  className,
  overlayClassName,
  panelClassName,
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
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const onCloseStable = useEventCallback(onClose)
  const { previouslyFocusedRef, restoreNow } = useRestoreFocus(open)

  useFocusTrap(panelRef, {
    active: open,
    onEscape: onCloseStable,
    closeOnEscape,
  })

  if (unstyled) {
    return open ? <div ref={panelRef} role="dialog" aria-modal="true" className={cn(className, panelClassName)}>{children}</div> : null
  }

  return (
    <AnimatePresence onExitComplete={restoreNow}>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.overlay}
            className={cn("absolute inset-0 bg-overlay", overlayClassName)}
            onClick={closeOnOverlayClick ? onCloseStable : undefined}
          />
          <motion.div
            ref={panelRef}
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
              <div className="flex items-start justify-between gap-4 border-b border-border px-5 pb-3 pt-4 sm:px-6 shrink-0">
                <div className="flex gap-3.5 min-w-0 flex-1">
                  {icon && <div className="mt-0.5 shrink-0 text-muted-foreground [&_svg]:size-5" aria-hidden="true">{icon}</div>}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h2 id={titleId} className="text-base font-semibold leading-6 text-foreground">{title}</h2>
                    {description && <p id={descriptionId} className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>}
                  </div>
                </div>
                {showCloseButton && (
                  <button
                    type="button"
                    data-modal-close
                    aria-label={closeAriaLabel}
                    onClick={onCloseStable}
                    className={iconButtonStyles}
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
                onClick={onCloseStable}
                className={cn("absolute right-4 top-4 z-10", iconButtonStyles)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            )}
            <div data-modal-content className={cn("px-5 py-4 sm:px-6 flex-1", scrollable ? "overflow-y-auto overscroll-contain" : "overflow-y-auto")}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function ModalHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-4 pb-3 sm:px-6 border-b border-border shrink-0", className)} {...props}>{children}</div>
}
export function ModalTitle({ as: Tag = "h2", className, children, ...props }: HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "div" }) {
  return <Tag className={cn("text-base font-semibold leading-6 text-foreground", className)} {...props}>{children}</Tag>
}
export function ModalDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-sm leading-5 text-muted-foreground", className)} {...props}>{children}</p>
}
export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> { scrollable?: boolean }
export function ModalBody({ className, scrollable = false, children, ...props }: ModalBodyProps) {
  return <div data-modal-content className={cn("px-5 py-4 sm:px-6", scrollable && "overflow-y-auto flex-1 overscroll-contain", className)} {...props}>{children}</div>
}
export function ModalFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 pb-4 pt-3 sm:px-6 max-sm:flex-col-reverse max-sm:items-stretch", className)} {...props}>{children}</div>
}

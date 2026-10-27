"use client"

import { cn } from "@/lib/cn"
import { useBreakpoint } from "@/hooks/use-breakpoint"
import { useControllableState } from "@/hooks/use-controllable-state"
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalDescription } from "./modal"
import { Sheet } from "./sheet"
import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  forwardRef,
  useContext,
  useId,
} from "react"

interface ResponsiveDialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  isMobile: boolean
}

const ResponsiveDialogContext = createContext<ResponsiveDialogContextValue | null>(null)

export function useResponsiveDialog() {
  const ctx = useContext(ResponsiveDialogContext)
  if (!ctx) throw new Error("ResponsiveDialog subcomponents must be used within <ResponsiveDialog>")
  return ctx
}

/* ------------------------------------------------------------------ */
/* ResponsiveDialog Root                                              */
/* ------------------------------------------------------------------ */

export interface ResponsiveDialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function ResponsiveDialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: ResponsiveDialogProps) {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  const { down, ready } = useBreakpoint()
  // Default to desktop modal until client breakpoint is ready (hydration safe)
  const isMobile = ready && down("sm")

  return (
    <ResponsiveDialogContext.Provider value={{ open, setOpen, isMobile }}>
      {children}
    </ResponsiveDialogContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/* ResponsiveDialog Trigger                                           */
/* ------------------------------------------------------------------ */

export interface ResponsiveDialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const ResponsiveDialogTrigger = forwardRef<HTMLButtonElement, ResponsiveDialogTriggerProps>(function ResponsiveDialogTrigger(
  { children, onClick, ...props },
  ref,
) {
  const { setOpen } = useResponsiveDialog()

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) setOpen(true)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger"

/* ------------------------------------------------------------------ */
/* ResponsiveDialog Content                                           */
/* ------------------------------------------------------------------ */

export interface ResponsiveDialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

export const ResponsiveDialogContent = forwardRef<HTMLDivElement, ResponsiveDialogContentProps>(function ResponsiveDialogContent(
  { children, title, description, className, ...props },
  ref,
) {
  const { open, setOpen, isMobile } = useResponsiveDialog()

  if (isMobile) {
    return (
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        className={className}
      >
        <div ref={ref} className="px-4 pb-6 pt-2" {...props}>
          {children}
        </div>
      </Sheet>
    )
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title={title}
      description={description}
      className={className}
    >
      <div ref={ref} {...props}>
        {children}
      </div>
    </Modal>
  )
})
ResponsiveDialogContent.displayName = "ResponsiveDialogContent"

/* ------------------------------------------------------------------ */
/* Subcomponents                                                      */
/* ------------------------------------------------------------------ */

export const ResponsiveDialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ResponsiveDialogHeader(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5 pb-3 text-left", className)} {...props}>
      {children}
    </div>
  )
})
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader"

export const ResponsiveDialogTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function ResponsiveDialogTitle(
  { className, children, ...props },
  ref,
) {
  return (
    <h2 ref={ref} className={cn("text-base font-semibold leading-none text-foreground", className)} {...props}>
      {children}
    </h2>
  )
})
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle"

export const ResponsiveDialogDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function ResponsiveDialogDescription(
  { className, children, ...props },
  ref,
) {
  return (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
})
ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription"

export const ResponsiveDialogBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ResponsiveDialogBody(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("py-2", className)} {...props}>
      {children}
    </div>
  )
})
ResponsiveDialogBody.displayName = "ResponsiveDialogBody"

export const ResponsiveDialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ResponsiveDialogFooter(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3", className)} {...props}>
      {children}
    </div>
  )
})
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter"

export const ResponsiveDialogClose = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function ResponsiveDialogClose(
  { children, onClick, ...props },
  ref,
) {
  const { setOpen } = useResponsiveDialog()
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) setOpen(false)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
ResponsiveDialogClose.displayName = "ResponsiveDialogClose"

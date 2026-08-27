"use client"

import { cn } from "@/lib/cn"
import { AnimatePresence, motion } from "framer-motion"
import { HTMLAttributes, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react"

type PopoverSide = "top" | "bottom" | "left" | "right"
type PopoverAlign = "start" | "center" | "end"

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  side?: PopoverSide
  align?: PopoverAlign
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  ariaLabel?: string
}

const sideStyles: Record<PopoverSide, { container: string; initial: object }> = {
  top:    { container: "bottom-full mb-2",   initial: { y: 4 } },
  bottom: { container: "top-full mt-2",      initial: { y: -4 } },
  left:   { container: "right-full mr-2",    initial: { x: 4 } },
  right:  { container: "left-full ml-2",     initial: { x: -4 } },
}

const alignStyles: Record<PopoverSide, Record<PopoverAlign, string>> = {
  top:    { start: "left-0",                center: "left-1/2 -translate-x-1/2", end: "right-0" },
  bottom: { start: "left-0",                center: "left-1/2 -translate-x-1/2", end: "right-0" },
  left:   { start: "top-0",                 center: "top-1/2 -translate-y-1/2",  end: "bottom-0" },
  right:  { start: "top-0",                 center: "top-1/2 -translate-y-1/2",  end: "bottom-0" },
}

export function Popover({
  trigger,
  children,
  side = "bottom",
  align = "start",
  className,
  open: controlledOpen,
  onOpenChange,
  ariaLabel = "Popover",
}: PopoverProps) {
  const [localOpen, setLocalOpen] = useState(false)
  const open = controlledOpen ?? localOpen
  const containerRef = useRef<HTMLDivElement>(null)
  const contentId = useId()

  function toggle() {
    const next = !open
    if (controlledOpen === undefined) setLocalOpen(next)
    onOpenChange?.(next)
  }

  function close() {
    if (controlledOpen === undefined) setLocalOpen(false)
    onOpenChange?.(false)
  }

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) close()
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        e.preventDefault()
        close()
        containerRef.current?.querySelector<HTMLElement>('[aria-haspopup="dialog"]')?.focus()
      }
    }
    document.addEventListener("mousedown", onOutside)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onOutside)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [contentId, open])

  const { container, initial } = sideStyles[side]
  const alignCls = alignStyles[side][align]
  type PopoverTriggerProps = HTMLAttributes<HTMLElement> & {
    "aria-haspopup"?: "dialog"
    "aria-expanded"?: boolean
    "aria-controls"?: string
  }
  const triggerElement = isValidElement(trigger) ? cloneElement(trigger as ReactElement<PopoverTriggerProps>, {
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": contentId,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      ;(trigger.props as PopoverTriggerProps).onClick?.(event)
      if (!event.defaultPrevented) toggle()
    },
  }) : <button type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={contentId} onClick={toggle}>{trigger}</button>

  return (
    <div ref={containerRef} className="relative inline-flex">
      {triggerElement}
      <AnimatePresence>
        {open && (
          <motion.div
            id={contentId}
            role="dialog"
            aria-label={ariaLabel}
            initial={{ opacity: 0, ...initial }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, ...initial }}
            transition={{ duration: 0.13 }}
            className={cn(
              "absolute z-50 min-w-[180px] rounded-[var(--radius-lg)] border border-border bg-surface-raised shadow-floating",
              container,
              alignCls,
              className,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function PopoverContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-3", className)} {...props}>
      {children}
    </div>
  )
}

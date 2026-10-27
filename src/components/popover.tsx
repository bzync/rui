"use client"

import { cn } from "@/lib/cn"
import { mergeRefs } from "@/lib/merge-refs"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { transitions } from "@/lib/motion"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { ThemePortal } from "./theme-provider"
import { useControllableState } from "@/hooks/use-controllable-state"
import { FocusEvent as ReactFocusEvent, HTMLAttributes, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, cloneElement, isValidElement, useEffect, useId, useRef, forwardRef } from "react"

type PopoverSide = "top" | "bottom" | "left" | "right"
type PopoverAlign = "start" | "center" | "end"

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  side?: PopoverSide
  align?: PopoverAlign
  className?: string
  wrapperClassName?: string
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  ariaLabel?: string
}

const enterFrom: Record<PopoverSide, object> = {
  top: { y: 4 },
  bottom: { y: -4 },
  left: { x: 4 },
  right: { x: -4 },
}

const FOCUSABLE = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover({
  trigger,
  children,
  side = "bottom",
  align = "start",
  className,
  wrapperClassName,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  ariaLabel = "Popover",
}, ref) {
  const [open, setOpen] = useControllableState({ value: controlledOpen, defaultValue: defaultOpen, onChange: onOpenChange })
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const contentId = useId()
  // The panel is portalled with fixed coordinates so a table cell, scroll
  // area or overflow-hidden card can never clip it or stack above it.
  const { setFloating, style, placement } = useAnchoredPosition({ open, anchorRef: containerRef, side, align, gap: 8 })

  const toggle = () => setOpen(!open)
  const close = () => setOpen(false)

  const focusTrigger = () => containerRef.current?.querySelector<HTMLElement>('[aria-haspopup="dialog"]')?.focus()

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      const target = e.target as Node
      if (containerRef.current?.contains(target) || panelRef.current?.contains(target)) return
      close()
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
        focusTrigger()
      }
    }
    document.addEventListener("mousedown", onOutside)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onOutside)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [contentId, open])

  // The portalled panel is outside the trigger's tab sequence, so move focus
  // into it when it opens (if it has anything focusable).
  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [open])

  function handlePanelBlur(event: ReactFocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null
    if (!next || panelRef.current?.contains(next) || containerRef.current?.contains(next)) return
    close()
  }

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
    <div ref={mergeRefs(containerRef, ref)} className={cn("relative inline-flex", wrapperClassName)}>
      {triggerElement}
      <ThemePortal>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={(element: HTMLDivElement | null) => { panelRef.current = element; setFloating(element) }}
              id={contentId}
              role="dialog"
              aria-label={ariaLabel}
              onBlur={handlePanelBlur}
              initial={{ opacity: 0, ...enterFrom[placement] }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, ...enterFrom[placement] }}
              transition={transitions.fade}
              style={style}
              className={cn(
                "z-(--z-popover) w-max min-w-[180px] max-w-[min(24rem,calc(100vw-2rem))] max-h-[calc(100dvh-1rem)] overflow-auto rounded-[var(--radius-lg)] border border-border bg-surface-raised shadow-floating",
                className,
              )}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </ThemePortal>
    </div>
  )
})
Popover.displayName = "Popover"

export const PopoverContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function PopoverContent({ className, children, ...props }, ref) {
  return (
    <div ref={ref} className={cn("p-3", className)} {...props}>
      {children}
    </div>
  )
})
PopoverContent.displayName = "PopoverContent"

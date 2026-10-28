"use client"

import { cn } from "@/lib/cn"
import { mergeRefs } from "@/lib/merge-refs"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { transitions } from "@/lib/motion"
import { type AnchoredAlign, type AnchoredSide, useAnchoredPosition } from "@/hooks/use-anchored-position"
import { useControllableState } from "@/hooks/use-controllable-state"
import { type FocusEvent, type HTMLAttributes, type MouseEvent, type ReactElement, type ReactNode, cloneElement, forwardRef, isValidElement, useEffect, useId, useRef } from "react"
import { ThemePortal } from "./theme-provider"

export interface HoverCardProps {
  /** Rich preview content. */
  content: ReactNode
  /** The trigger (usually a link or button). */
  children: ReactNode
  side?: AnchoredSide
  align?: AnchoredAlign
  /** Delay before opening, in ms. Default 500. */
  openDelay?: number
  /** Delay before closing once the pointer leaves, in ms. Default 200. */
  closeDelay?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Card width (any CSS length). Default 18rem. */
  width?: number | string
  className?: string
  wrapperClassName?: string
}

const enterFrom: Record<AnchoredSide, { y?: number; x?: number }> = { top: { y: 4 }, bottom: { y: -4 }, left: { x: 4 }, right: { x: -4 } }

/**
 * Preview card shown while the pointer rests on (or keyboard focus is on) a
 * trigger: profile previews, link previews. Unlike Tooltip it is interactive:
 * the pointer can move onto the card and it stays open. Treat it as
 * supplementary; content essential to a task should also be reachable
 * without hovering.
 */
export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard({
  content,
  children,
  side = "bottom",
  align = "center",
  openDelay = 500,
  closeDelay = 200,
  open,
  defaultOpen = false,
  onOpenChange,
  width = "18rem",
  className,
  wrapperClassName,
}, ref) {
  const [visible, setVisible] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const cardId = useId()
  const { setFloating, style, placement } = useAnchoredPosition({ open: visible, anchorRef: wrapperRef, side, align, gap: 8 })

  const schedule = (next: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const delay = next ? openDelay : closeDelay
    if (delay <= 0) { if (visible !== next) setVisible(next); return }
    timerRef.current = setTimeout(() => { if (visible !== next) setVisible(next) }, delay)
  }
  const cancel = () => { if (timerRef.current) clearTimeout(timerRef.current) }

  useEffect(() => () => cancel(), [])

  useEffect(() => {
    if (!visible) return
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { cancel(); setVisible(false) } }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [visible, setVisible])

  type TriggerProps = HTMLAttributes<HTMLElement> & { "aria-describedby"?: string }
  const handlers = {
    onMouseEnter: (event: MouseEvent<HTMLElement>) => { (children as ReactElement<TriggerProps>).props?.onMouseEnter?.(event); schedule(true) },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => { (children as ReactElement<TriggerProps>).props?.onMouseLeave?.(event); schedule(false) },
    onFocus: (event: FocusEvent<HTMLElement>) => { (children as ReactElement<TriggerProps>).props?.onFocus?.(event); schedule(true) },
    onBlur: (event: FocusEvent<HTMLElement>) => { (children as ReactElement<TriggerProps>).props?.onBlur?.(event); schedule(false) },
  }
  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<TriggerProps>, { ...handlers, "aria-describedby": visible ? cardId : undefined })
    : <span tabIndex={0} aria-describedby={visible ? cardId : undefined} {...handlers}>{children}</span>

  return (
    <span ref={mergeRefs(wrapperRef, ref)} className={cn("inline-flex", wrapperClassName)}>
      {trigger}
      <ThemePortal>
        <AnimatePresence>
          {visible && (
            <motion.div
              ref={setFloating}
              id={cardId}
              data-side={placement}
              initial={{ opacity: 0, ...enterFrom[placement] }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, ...enterFrom[placement] }}
              transition={transitions.fade}
              onMouseEnter={cancel}
              onMouseLeave={() => schedule(false)}
              onFocusCapture={cancel}
              onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) schedule(false)
              }}
              style={{ ...style, width: typeof width === "number" ? `${width}px` : width, maxWidth: "calc(100vw - 1rem)" }}
              className={cn("z-(--z-popover) rounded-[var(--radius-lg)] border border-border bg-surface-raised p-4 text-sm text-foreground shadow-floating", className)}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </ThemePortal>
    </span>
  )
})
HoverCard.displayName = "HoverCard"

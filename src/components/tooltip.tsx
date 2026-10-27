"use client"

import { cn } from "@/lib/cn"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { transitions } from "@/lib/motion"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { ThemePortal } from "./theme-provider"
import { FocusEvent, HTMLAttributes, MouseEvent, ReactElement, ReactNode, cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react"

type Position = "top" | "bottom" | "left" | "right"

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: Position
  delayMs?: number
  className?: string
  wrapperClassName?: string
  /** Width cap for the bubble. The bubble always sizes to its content and only
   * wraps once it reaches this cap. Accepts any CSS length (`320`, `"28rem"`)
   * or `"none"` to never wrap. It is additionally clamped to the viewport.
   * Defaults to 20rem. */
  maxWidth?: number | string
}

const enterFrom: Record<Position, { y?: number; x?: number }> = {
  top: { y: 4 },
  bottom: { y: -4 },
  left: { x: 4 },
  right: { x: -4 },
}

export function Tooltip({
  content,
  children,
  position = "top",
  delayMs = 0,
  className,
  wrapperClassName,
  maxWidth,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  // Portalled with fixed coordinates: never clipped by a table, scroll area or
  // overflow-hidden card, and always above modals (--z-tooltip is the top layer).
  const { setFloating, style, placement } = useAnchoredPosition({ open: visible, anchorRef: wrapperRef, side: position, align: "center", gap: 8 })
  const initial = enterFrom[placement]

  function handleMouseEnter() {
    if (delayMs > 0) {
      timerRef.current = setTimeout(() => setVisible(true), delayMs)
    } else {
      setVisible(true)
    }
  }

  function handleMouseLeave() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  type TooltipTriggerProps = HTMLAttributes<HTMLElement> & { "aria-describedby"?: string }
  const triggerElement = isValidElement(children) ? cloneElement(children as ReactElement<TooltipTriggerProps>, {
    "aria-describedby": visible ? tooltipId : undefined,
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      ;(children.props as TooltipTriggerProps).onMouseEnter?.(event)
      if (!event.defaultPrevented) handleMouseEnter()
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      ;(children.props as TooltipTriggerProps).onMouseLeave?.(event)
      handleMouseLeave()
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      ;(children.props as TooltipTriggerProps).onFocus?.(event)
      if (!event.defaultPrevented) handleMouseEnter()
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      ;(children.props as TooltipTriggerProps).onBlur?.(event)
      handleMouseLeave()
    },
  }) : <span tabIndex={0} aria-describedby={visible ? tooltipId : undefined} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onFocus={handleMouseEnter} onBlur={handleMouseLeave}>{children}</span>

  return (
    <div ref={wrapperRef} className={cn("relative inline-flex", wrapperClassName)}>
      {triggerElement}
      <ThemePortal>
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={setFloating}
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, ...initial }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, ...initial }}
            transition={transitions.fade}
            // w-max: size to the content instead of the shrink-to-fit width an
            // absolutely positioned flex child gets from its inline-flex
            // wrapper, which collapsed long text into a narrow column. The
            // max-width cap is what makes it wrap.
            style={maxWidth === undefined ? style : {
              ...style,
              maxWidth: maxWidth === "none"
                ? "calc(100vw - 2rem)"
                : `min(${typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth}, calc(100vw - 2rem))`,
            }}
            className={cn(
              "z-(--z-tooltip) pointer-events-none",
              "w-max max-w-[min(20rem,calc(100vw-2rem))] whitespace-normal break-words rounded-md px-2.5 py-1.5 text-xs font-medium leading-4",
              "border border-tooltip-border bg-tooltip text-tooltip-foreground shadow-floating",
              className,
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
      </ThemePortal>
    </div>
  )
}

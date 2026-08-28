"use client"

import { cn } from "@/lib/cn"
import { AnimatePresence, motion } from "framer-motion"
import { transitions } from "@/lib/motion"
import { FocusEvent, HTMLAttributes, MouseEvent, ReactElement, ReactNode, cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react"

type Position = "top" | "bottom" | "left" | "right"

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: Position
  delayMs?: number
  className?: string
}

const positions: Record<
  Position,
  { container: string; initial: { y?: number; x?: number } }
> = {
  top: { container: "bottom-full left-1/2 -translate-x-1/2 mb-2", initial: { y: 4 } },
  bottom: { container: "top-full left-1/2 -translate-x-1/2 mt-2", initial: { y: -4 } },
  left: { container: "right-full top-1/2 -translate-y-1/2 mr-2", initial: { x: 4 } },
  right: { container: "left-full top-1/2 -translate-y-1/2 ml-2", initial: { x: -4 } },
}

export function Tooltip({
  content,
  children,
  position = "top",
  delayMs = 0,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = useId()
  const { container, initial } = positions[position]

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
    <div className="relative inline-flex">
      {triggerElement}
      <AnimatePresence>
        {visible && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, ...initial }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, ...initial }}
            transition={transitions.fade}
            className={cn(
              "absolute z-50 pointer-events-none",
              "max-w-[min(20rem,calc(100vw-2rem))] rounded-md px-2.5 py-1.5 text-xs font-medium leading-4",
              "border border-slate-700 bg-slate-900 text-slate-50 shadow-floating dark:border-border-strong dark:bg-surface-raised dark:text-foreground",
              container,
              className,
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

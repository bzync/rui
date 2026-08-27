"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { AnimatePresence, motion } from "framer-motion"
import { HTMLAttributes, ReactNode, useId, useState } from "react"

export interface AccordionItem {
  id: string
  trigger: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[]
  multiple?: boolean
  defaultOpen?: string[]
}

export function Accordion({ items, multiple = false, defaultOpen = [], className, ...props }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen))
  const accordionId = useId()

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!multiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={cn("flex flex-col divide-y divide-border", className)} {...props}>
      {items.map((item) => {
        const isOpen = open.has(item.id)
        const safeId = encodeURIComponent(item.id)
        const triggerId = `${accordionId}-trigger-${safeId}`
        const panelId = `${accordionId}-panel-${safeId}`
        return (
          <div key={item.id}>
            <button
              type="button"
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
              className={cn(
                "flex items-center justify-between w-full py-3.5 text-left gap-3 transition-colors",
                "text-foreground hover:text-foreground",
                focusRingStyles,
                item.disabled && "opacity-40 cursor-not-allowed",
              )}
            >
              <span className="flex-1 min-w-0">{item.trigger}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 text-slate-500"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 text-sm leading-6 text-muted-foreground">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  trigger: ReactNode
  children: ReactNode
  className?: string
}

export function Collapsible({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  trigger,
  children,
  className,
}: CollapsibleProps) {
  const [localOpen, setLocalOpen] = useState(defaultOpen)
  const contentId = useId()
  const open = controlledOpen ?? localOpen

  function toggle() {
    const next = !open
    if (controlledOpen === undefined) setLocalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={contentId}
        className="block w-full cursor-pointer text-left"
      >
        {trigger}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

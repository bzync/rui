"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { useControllableState } from "@/hooks/use-controllable-state"
import { HTMLAttributes, ReactNode, useId, forwardRef } from "react"

export interface AccordionItem {
  id: string
  trigger: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[]
  multiple?: boolean
  /** Initially open item IDs when uncontrolled. */
  defaultOpen?: string[]
  /** Controlled open item IDs. */
  value?: string[]
  /** Called with the next open item IDs. */
  onValueChange?: (value: string[]) => void
  /** Trigger and content scale. */
  size?: "sm" | "md" | "lg"
  /** Disables every item. */
  disabled?: boolean
  /** Styles each item wrapper. */
  itemClassName?: string
  /** Styles each trigger button. */
  triggerClassName?: string
  /** Styles each content panel. */
  contentClassName?: string
}

const accordionSizes = {
  sm: { trigger: "py-2.5 text-sm", content: "pb-3 text-xs leading-5" },
  md: { trigger: "py-3.5", content: "pb-4 text-sm leading-6" },
  lg: { trigger: "py-4.5 text-base", content: "pb-5 text-base leading-7" },
} as const

const EMPTY: string[] = []

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion({ items, multiple = false, defaultOpen = EMPTY, value, onValueChange, size = "md", disabled = false, itemClassName, triggerClassName, contentClassName, className, ...props }, ref) {
  const [openIds, setOpenIds] = useControllableState({ value, defaultValue: defaultOpen, onChange: onValueChange })
  const open = new Set(openIds)
  const accordionId = useId()

  function toggle(id: string) {
    if (open.has(id)) setOpenIds(openIds.filter((openId) => openId !== id))
    else setOpenIds(multiple ? [...openIds, id] : [id])
  }

  return (
    <div ref={ref} className={cn("flex flex-col divide-y divide-border", className)} {...props}>
      {items.map((item) => {
        const isOpen = open.has(item.id)
        const safeId = encodeURIComponent(item.id)
        const triggerId = `${accordionId}-trigger-${safeId}`
        const panelId = `${accordionId}-panel-${safeId}`
        return (
          <div key={item.id} className={itemClassName}>
            <button
              type="button"
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              disabled={item.disabled || disabled}
              onClick={() => toggle(item.id)}
              className={cn(
                "flex items-center justify-between w-full text-left gap-3 transition-colors",
                accordionSizes[size].trigger,
                "text-foreground hover:text-foreground",
                focusRingStyles,
                (item.disabled || disabled) && "opacity-40 cursor-not-allowed",
                triggerClassName,
              )}
            >
              <span className="flex-1 min-w-0">{item.trigger}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 text-muted-foreground"
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
                  <div className={cn("text-muted-foreground", accordionSizes[size].content, contentClassName)}>
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
})
Accordion.displayName = "Accordion"

export interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  trigger: ReactNode
  children: ReactNode
  className?: string
}

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  trigger,
  children,
  className,
}, ref) {
  const [open, setOpen] = useControllableState({ value: controlledOpen, defaultValue: defaultOpen, onChange: onOpenChange })
  const contentId = useId()
  const toggle = () => setOpen(!open)

  return (
    <div ref={ref} className={className}>
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
})
Collapsible.displayName = "Collapsible"

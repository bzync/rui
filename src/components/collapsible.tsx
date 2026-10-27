"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { useControllableState } from "@/hooks/use-controllable-state"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  forwardRef,
  useContext,
  useId,
} from "react"

interface CollapsibleContextValue {
  open: boolean
  toggle: () => void
  contentId: string
  disabled: boolean
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null)

export function useCollapsible() {
  const ctx = useContext(CollapsibleContext)
  if (!ctx) throw new Error("CollapsibleTrigger and CollapsibleContent must be inside <Collapsible>")
  return ctx
}

/* ------------------------------------------------------------------ */
/* Collapsible Root                                                   */
/* ------------------------------------------------------------------ */

export interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  /** Optional legacy trigger prop. When provided, automatically renders the trigger button and animated content wrapper. */
  trigger?: ReactNode
  children: ReactNode
}

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { open: controlledOpen, defaultOpen = false, onOpenChange, disabled = false, trigger, children, className, ...props },
  ref,
) {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  const contentId = useId()
  const toggle = () => {
    if (!disabled) setOpen(!open)
  }

  if (trigger) {
    return (
      <CollapsibleContext.Provider value={{ open, toggle, contentId, disabled }}>
        <div ref={ref} data-state={open ? "open" : "closed"} className={cn("w-full", className)} {...props}>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={contentId}
            disabled={disabled}
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
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CollapsibleContext.Provider>
    )
  }

  return (
    <CollapsibleContext.Provider value={{ open, toggle, contentId, disabled }}>
      <div ref={ref} data-state={open ? "open" : "closed"} className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
})
Collapsible.displayName = "Collapsible"

/* ------------------------------------------------------------------ */
/* Collapsible Trigger                                                */
/* ------------------------------------------------------------------ */

export interface CollapsibleTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(function CollapsibleTrigger(
  { children, className, onClick, ...props },
  ref,
) {
  const { open, toggle, contentId, disabled } = useCollapsible()

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      aria-controls={contentId}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) toggle()
      }}
      className={cn(
        "inline-flex items-center justify-between rounded-[var(--radius-md)] text-sm font-medium transition-colors",
        focusRingStyles,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

/* ------------------------------------------------------------------ */
/* Collapsible Content                                                */
/* ------------------------------------------------------------------ */

export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** When true, keeps content rendered in DOM when closed (just hidden) */
  forceMount?: boolean
}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(function CollapsibleContent(
  { children, className, forceMount = false, ...props },
  ref,
) {
  const { open, contentId } = useCollapsible()

  if (forceMount) {
    return (
      <div
        ref={ref}
        id={contentId}
        hidden={!open}
        data-state={open ? "open" : "closed"}
        className={cn("overflow-hidden transition-all", className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="content"
          id={contentId}
          data-state="open"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div ref={ref} className={cn("pt-2", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
CollapsibleContent.displayName = "CollapsibleContent"

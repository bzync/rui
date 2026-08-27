"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { AnimatePresence, motion } from "framer-motion"
import { HTMLMotionProps } from "framer-motion"
import {
  HTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useId,
  useState,
} from "react"

interface TabsContextValue {
  active: string
  setActive: (v: string) => void
  orientation: "horizontal" | "vertical"
  tabsId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsCtx() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("Tabs subcomponents must be inside <Tabs>")
  return ctx
}

export interface TabsProps {
  defaultValue: string
  value?: string
  children: ReactNode
  className?: string
  orientation?: "horizontal" | "vertical"
  onChange?: (value: string) => void
}

export function Tabs({
  defaultValue,
  value,
  children,
  className,
  orientation = "horizontal",
  onChange,
}: TabsProps) {
  const [localActive, setLocalActive] = useState(defaultValue)
  const active = value ?? localActive
  const tabsId = useId()

  const handleSet = (v: string) => {
    if (value === undefined) setLocalActive(v)
    onChange?.(v)
  }

  return (
    <TabsContext.Provider value={{ active, setActive: handleSet, orientation, tabsId }}>
      <div
        className={cn(
          orientation === "vertical"
            ? "flex flex-col gap-4 sm:flex-row"
            : "flex flex-col",
          className,
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { orientation } = useTabsCtx()

  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-border bg-surface-muted p-1",
        orientation === "vertical"
          ? "flex flex-row sm:flex-col gap-0.5 w-full sm:w-36 sm:shrink-0 overflow-x-auto"
          : "flex items-center gap-0.5 overflow-x-auto max-w-full scrollbar-none",
        className,
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  icon?: ReactNode
}

export function TabsTrigger({
  value,
  className,
  children,
  icon,
  onKeyDown,
  ...props
}: TabsTriggerProps) {
  const { active, setActive, orientation, tabsId } = useTabsCtx()
  const isActive = active === value
  const safeValue = encodeURIComponent(value)
  const triggerId = `${tabsId}-tab-${safeValue}`
  const panelId = `${tabsId}-panel-${safeValue}`

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const keys = orientation === "vertical" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"]
    if (!keys.includes(event.key) && event.key !== "Home" && event.key !== "End") return
    const list = event.currentTarget.closest('[role="tablist"]')
    const tabs = Array.from(list?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [])
    const index = tabs.indexOf(event.currentTarget)
    if (index < 0 || tabs.length === 0) return
    event.preventDefault()
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + tabs.length) % tabs.length
    tabs[nextIndex]?.focus()
    tabs[nextIndex]?.click()
  }

  return (
    <button
      role="tab"
      type="button"
      id={triggerId}
      aria-controls={panelId}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActive(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative text-sm font-medium cursor-pointer transition-colors",
        orientation === "vertical"
          ? "flex items-center gap-2 w-full px-3 py-2 rounded-md text-left"
          : "px-3 py-1.5 rounded-md",
        focusRingStyles,
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId={`tab-bg-${tabsId}`}
          className="absolute inset-0 rounded-md border border-border bg-surface shadow-xs"
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
        />
      )}
      {icon && (
        <span className="relative z-10 shrink-0 opacity-70">{icon}</span>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export interface TabsContentProps extends Omit<HTMLMotionProps<"div">, "children"> {
  value: string
  children?: ReactNode
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { active, orientation, tabsId } = useTabsCtx()
  const safeValue = encodeURIComponent(value)

  return (
    <AnimatePresence mode="wait">
      {active === value && (
        <motion.div
          key={value}
          initial={orientation === "vertical" ? { opacity: 0, x: 6 } : { opacity: 0, y: 4 }}
          animate={orientation === "vertical" ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
          exit={orientation === "vertical" ? { opacity: 0, x: -6 } : { opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          role="tabpanel"
          id={`${tabsId}-panel-${safeValue}`}
          aria-labelledby={`${tabsId}-tab-${safeValue}`}
          tabIndex={0}
          className={cn(
            orientation === "vertical" ? "flex-1 min-w-0" : "mt-4",
            className,
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

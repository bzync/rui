"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import {
  HTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useId,
  useState,
  forwardRef,
} from "react"

interface TabsContextValue {
  active: string
  setActive: (v: string) => void
  orientation: "horizontal" | "vertical"
  tabsId: string
  size: TabsSize
}

export type TabsSize = "sm" | "md" | "lg"

// Trigger text and padding per size; the base layout lives in triggerLayout.
const triggerSizes: Record<TabsSize, string> = {
  sm: "text-xs px-2.5 py-1",
  md: "text-sm",
  lg: "text-sm px-4 py-2",
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsCtx() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("Tabs subcomponents must be inside <Tabs>")
  return ctx
}

export interface TabsProps {
  /** Initially active tab when uncontrolled. */
  defaultValue?: string
  /** Controlled active tab. */
  value?: string
  children: ReactNode
  className?: string
  orientation?: "horizontal" | "vertical"
  /** Trigger scale. */
  size?: TabsSize
  /** Preferred — called when the active tab changes. */
  onValueChange?: (value: string) => void
  /** @deprecated Use onValueChange */
  onChange?: (value: string) => void
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs({
  defaultValue,
  value,
  children,
  className,
  orientation = "horizontal",
  size = "md",
  onValueChange,
  onChange,
}, ref) {
  const [localActive, setLocalActive] = useState(defaultValue ?? "")
  const active = value ?? localActive
  const tabsId = useId()

  const handleSet = (v: string) => {
    if (value === undefined) setLocalActive(v)
    onValueChange?.(v)
    onChange?.(v)
  }

  return (
    <TabsContext.Provider value={{ active, setActive: handleSet, orientation, tabsId, size }}>
      <div
        ref={ref}
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
})
Tabs.displayName = "Tabs"

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function TabsList({
  className,
  children,
  ...props
}, ref) {
  const { orientation } = useTabsCtx()

  return (
    <div ref={ref}
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
})
TabsList.displayName = "TabsList"

export type TabsIconPosition = "left" | "right" | "top"

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  icon?: ReactNode
  /** Where `icon` sits relative to the label. `top` stacks it above (icon tab bars). */
  iconPosition?: TabsIconPosition
}

// Both orientations lay the icon and label out with flex: preflight makes
// <svg> display:block, so without it the icon broke onto its own line.
const triggerLayout: Record<"horizontal" | "vertical", Record<TabsIconPosition, string>> = {
  horizontal: {
    left: "inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-1.5",
    right: "inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-1.5",
    top: "inline-flex flex-col items-center justify-center gap-1 whitespace-nowrap px-3 py-2",
  },
  vertical: {
    left: "flex w-full items-center gap-2 px-3 py-2 text-left",
    right: "flex w-full items-center justify-between gap-2 px-3 py-2 text-left",
    top: "flex w-full flex-col items-center gap-1 px-3 py-2 text-center",
  },
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger({
  value,
  className,
  children,
  icon,
  iconPosition = "left",
  onKeyDown,
  ...props
}, ref) {
  const { active, setActive, orientation, tabsId, size } = useTabsCtx()
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
    <button ref={ref}
      role="tab"
      type="button"
      id={triggerId}
      aria-controls={panelId}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActive(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative rounded-md text-sm font-medium cursor-pointer transition-colors",
        triggerLayout[orientation === "vertical" ? "vertical" : "horizontal"][iconPosition],
        triggerSizes[size],
        focusRingStyles,
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {/* Always mounted; cross-fades via CSS so Tabs stays off the animation
          runtime. (framer-motion's layoutId slide is traded for an opacity
          transition here.) */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-md border transition-opacity duration-200 motion-reduce:transition-none",
          isActive
            ? "border-border bg-surface shadow-xs opacity-100"
            : "border-transparent opacity-0",
        )}
      />
      {icon && iconPosition !== "right" && (
        <span className="relative z-10 inline-flex shrink-0 opacity-70">{icon}</span>
      )}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === "right" && (
        <span className="relative z-10 inline-flex shrink-0 opacity-70">{icon}</span>
      )}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  children?: ReactNode
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent({
  value,
  className,
  children,
  ...props
}, ref) {
  const { active, orientation, tabsId } = useTabsCtx()
  const safeValue = encodeURIComponent(value)

  if (active !== value) return null

  return (
    <div ref={ref}
      // `key` re-triggers the CSS enter animation on every tab change.
      key={value}
      role="tabpanel"
      id={`${tabsId}-panel-${safeValue}`}
      aria-labelledby={`${tabsId}-tab-${safeValue}`}
      tabIndex={0}
      data-orientation={orientation}
      className={cn(
        "rui-tabs-content",
        orientation === "vertical" ? "flex-1 min-w-0" : "mt-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

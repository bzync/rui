"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useState,
} from "react"

export type ToggleVariant = "default" | "outline"
export type ToggleSize = "sm" | "md" | "lg" | "icon"

export const toggleVariants: Record<ToggleVariant, string> = {
  default: [
    "border border-transparent bg-transparent text-muted-foreground",
    "hover:bg-muted hover:text-foreground",
    "data-[state=on]:bg-accent-100 data-[state=on]:text-accent-800",
    "dark:data-[state=on]:bg-accent-900/45 dark:data-[state=on]:text-accent-200",
  ].join(" "),
  outline: [
    "border border-border bg-surface text-muted-foreground shadow-xs",
    "hover:border-border-strong hover:bg-surface-muted hover:text-foreground",
    "data-[state=on]:border-accent-300 data-[state=on]:bg-accent-50 data-[state=on]:text-accent-800",
    "dark:data-[state=on]:border-accent-700 dark:data-[state=on]:bg-accent-900/35 dark:data-[state=on]:text-accent-200",
  ].join(" "),
}

export const toggleSizes: Record<ToggleSize, string> = {
  sm: "h-8 rounded-[var(--radius-md)] px-2.5 text-xs gap-1.5",
  md: "h-9 rounded-[var(--radius-md)] px-3 text-sm gap-2",
  lg: "h-10 rounded-[var(--radius-lg)] px-4 text-sm gap-2",
  icon: "size-9 rounded-[var(--radius-md)] p-0",
}

const toggleBaseStyles = [
  "inline-flex shrink-0 cursor-pointer select-none items-center justify-center font-medium",
  "transition-[color,background-color,border-color,box-shadow] duration-150",
  "disabled:pointer-events-none disabled:opacity-40",
  focusRingStyles,
].join(" ")

export interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  variant?: ToggleVariant
  size?: ToggleSize
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(({
  pressed: controlledPressed,
  defaultPressed = false,
  onPressedChange,
  variant = "default",
  size = "md",
  className,
  type = "button",
  onClick,
  ...props
}, ref) => {
  const [localPressed, setLocalPressed] = useState(defaultPressed)
  const pressed = controlledPressed ?? localPressed

  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      className={cn(toggleBaseStyles, toggleVariants[variant], toggleSizes[size], className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        const next = !pressed
        if (controlledPressed === undefined) setLocalPressed(next)
        onPressedChange?.(next)
      }}
      {...props}
    />
  )
})
Toggle.displayName = "Toggle"

type ToggleGroupValue = string | string[]

interface ToggleGroupContextValue {
  disabled: boolean
  isPressed: (value: string) => boolean
  loop: boolean
  orientation: "horizontal" | "vertical"
  select: (value: string) => void
  size: ToggleSize
  variant: ToggleVariant
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

function useToggleGroup() {
  const context = useContext(ToggleGroupContext)
  if (!context) throw new Error("ToggleGroupItem must be inside <ToggleGroup>")
  return context
}

interface ToggleGroupBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  orientation?: "horizontal" | "vertical"
  variant?: ToggleVariant
  size?: ToggleSize
  disabled?: boolean
  loop?: boolean
  children: ReactNode
}

export interface ToggleGroupSingleProps extends ToggleGroupBaseProps {
  type?: "single"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export interface ToggleGroupMultipleProps extends ToggleGroupBaseProps {
  type: "multiple"
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(({
  type = "single",
  value: controlledValue,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  variant = "default",
  size = "md",
  disabled = false,
  loop = true,
  className,
  children,
  ...props
}, ref) => {
  const [localValue, setLocalValue] = useState<ToggleGroupValue>(() => defaultValue ?? (type === "multiple" ? [] : ""))
  const value = controlledValue ?? localValue
  const notifyValueChange = onValueChange as ((value: ToggleGroupValue) => void) | undefined

  function isPressed(itemValue: string) {
    return type === "multiple"
      ? Array.isArray(value) && value.includes(itemValue)
      : value === itemValue
  }

  function select(itemValue: string) {
    const next = type === "multiple"
      ? (() => {
          const current = Array.isArray(value) ? value : []
          return current.includes(itemValue)
            ? current.filter((item) => item !== itemValue)
            : [...current, itemValue]
        })()
      : value === itemValue ? "" : itemValue

    if (controlledValue === undefined) setLocalValue(next)
    notifyValueChange?.(next)
  }

  return (
    <ToggleGroupContext.Provider value={{ disabled, isPressed, loop, orientation, select, size, variant }}>
      <div
        ref={ref}
        role="group"
        data-rui-toggle-group=""
        data-orientation={orientation}
        className={cn(
          "inline-flex w-fit rounded-[var(--radius-lg)]",
          orientation === "horizontal"
            ? "max-w-full flex-row items-center gap-1 overflow-x-auto overscroll-x-contain p-0.5 scrollbar-none [&>*]:shrink-0"
            : "max-w-full flex-col items-stretch gap-1",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
})
ToggleGroup.displayName = "ToggleGroup"

export interface ToggleGroupItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string
  variant?: ToggleVariant
  size?: ToggleSize
}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(({
  value,
  variant: itemVariant,
  size: itemSize,
  className,
  disabled,
  type = "button",
  onClick,
  onKeyDown,
  ...props
}, ref) => {
  const group = useToggleGroup()
  const pressed = group.isPressed(value)
  const isDisabled = group.disabled || disabled

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const previousKey = group.orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"
    const nextKey = group.orientation === "horizontal" ? "ArrowRight" : "ArrowDown"
    if (event.key !== previousKey && event.key !== nextKey && event.key !== "Home" && event.key !== "End") return

    const root = event.currentTarget.closest<HTMLElement>("[data-rui-toggle-group]")
    const items = Array.from(root?.querySelectorAll<HTMLButtonElement>("[data-rui-toggle-item]:not(:disabled)") ?? [])
      .filter((item) => item.closest("[data-rui-toggle-group]") === root)
    const index = items.indexOf(event.currentTarget)
    if (index < 0 || items.length === 0) return

    event.preventDefault()
    let nextIndex = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : index + (event.key === nextKey ? 1 : -1)
    if (group.loop) nextIndex = (nextIndex + items.length) % items.length
    else nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex))
    items[nextIndex]?.focus()
  }

  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={pressed}
      data-rui-toggle-item=""
      data-state={pressed ? "on" : "off"}
      disabled={isDisabled}
      className={cn(toggleBaseStyles, toggleVariants[itemVariant ?? group.variant], toggleSizes[itemSize ?? group.size], className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) group.select(value)
      }}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
})
ToggleGroupItem.displayName = "ToggleGroupItem"

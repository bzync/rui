"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { mergeRefs } from "@/lib/merge-refs"
import { type HTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, Suspense, forwardRef, lazy, useEffect, useRef, useState } from "react"
import type { DropdownMenuSection } from "./dropdown-menu"

const DropdownMenuPanel = lazy(() => import("./dropdown-menu-panel"))

export interface MenubarMenu {
  label: string
  items: DropdownMenuSection[]
  disabled?: boolean
}

export interface MenubarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  menus: MenubarMenu[]
  ariaLabel?: string
  triggerClassName?: string
  menuClassName?: string
}

/**
 * Application-style menu bar (File / Edit / View). Implements the WAI-ARIA
 * menubar pattern: one tab stop, Left/Right move between menus, Down / Enter
 * / Space open a menu, Left/Right switch menus while one is open, hover
 * switches menus once any is open, and Escape returns to the bar.
 */
export const Menubar = forwardRef<HTMLDivElement, MenubarProps>(function Menubar({
  menus,
  ariaLabel = "Menu bar",
  className,
  triggerClassName,
  menuClassName,
  ...props
}, ref) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [focusIndex, setFocusIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuRef = useRef<HTMLDivElement | null>(null)
  // The lazy, portalled menu mounts after the open state flips; focus its
  // first item once the element exists (and again when the menu switches).
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!(openIndex !== null) || !menuEl) return
    const frame = requestAnimationFrame(() => menuEl.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus())
    return () => cancelAnimationFrame(frame)
  }, [openIndex, menuEl])
  const anchorRef = useRef<HTMLElement | null>(null)
  anchorRef.current = openIndex === null ? null : triggerRefs.current[openIndex] ?? null
  const { setFloating, style, placement } = useAnchoredPosition({ open: openIndex !== null, anchorRef, side: "bottom", align: "start", gap: 4 })

  const enabled = menus.map((menu, index) => (menu.disabled ? -1 : index)).filter((index) => index >= 0)
  const step = (from: number, delta: number) => {
    const position = enabled.indexOf(from)
    return enabled[(position + delta + enabled.length) % enabled.length] ?? from
  }

  const openMenu = (index: number) => {
    setOpenIndex(index)
    setFocusIndex(index)
    setMounted(true)
  }

  const closeMenu = (focusTrigger: boolean) => {
    const index = openIndex
    setOpenIndex(null)
    if (focusTrigger && index !== null) triggerRefs.current[index]?.focus()
  }

  useEffect(() => {
    if (openIndex === null) return
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (barRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpenIndex(null)
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
    }
  }, [openIndex])

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault()
      const next = step(index, event.key === "ArrowRight" ? 1 : -1)
      setFocusIndex(next)
      triggerRefs.current[next]?.focus()
      if (openIndex !== null) openMenu(next)
    } else if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openMenu(index)
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault()
      const next = event.key === "Home" ? enabled[0] : enabled[enabled.length - 1]
      setFocusIndex(next)
      triggerRefs.current[next]?.focus()
    }
  }

  const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (openIndex === null) return
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === "Escape") {
      event.preventDefault()
      closeMenu(true)
    } else if (event.key === "Tab") {
      setOpenIndex(null)
    } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault()
      const next = step(openIndex, event.key === "ArrowRight" ? 1 : -1)
      triggerRefs.current[next]?.focus()
      openMenu(next)
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && items.length) {
      event.preventDefault()
      const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (Math.max(index, 0) + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length
      items[next]?.focus()
    }
  }

  return (
    <div
      ref={mergeRefs(barRef, ref)}
      role="menubar"
      aria-label={ariaLabel}
      className={cn("inline-flex items-center gap-0.5 rounded-[var(--radius-md)] border border-border bg-surface p-0.5", className)}
      {...props}
    >
      {menus.map((menu, index) => (
        <button
          key={menu.label}
          ref={(node) => { triggerRefs.current[index] = node }}
          type="button"
          role="menuitem"
          aria-haspopup="menu"
          aria-expanded={openIndex === index}
          disabled={menu.disabled}
          tabIndex={index === focusIndex ? 0 : -1}
          onClick={() => (openIndex === index ? closeMenu(false) : openMenu(index))}
          onMouseEnter={() => { if (openIndex !== null && openIndex !== index && !menu.disabled) openMenu(index) }}
          onKeyDown={(event) => onTriggerKeyDown(event, index)}
          className={cn(
            "h-7 rounded-[var(--radius-sm)] px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/6 disabled:cursor-not-allowed disabled:opacity-40",
            openIndex === index && "bg-foreground/8",
            focusRingStyles,
            triggerClassName,
          )}
        >
          {menu.label}
        </button>
      ))}
      {mounted && (
        <Suspense fallback={null}>
          <DropdownMenuPanel
            open={openIndex !== null}
            menuRef={(element) => { menuRef.current = element; setFloating(element); setMenuEl(element) }}
            items={openIndex === null ? [] : menus[openIndex].items}
            side={placement === "top" ? "top" : "bottom"}
            style={style}
            className={menuClassName}
            ariaLabel={openIndex === null ? "Menu" : menus[openIndex].label}
            onKeyDown={onMenuKeyDown}
            onSelect={() => closeMenu(true)}
          />
        </Suspense>
      )}
    </div>
  )
})
Menubar.displayName = "Menubar"

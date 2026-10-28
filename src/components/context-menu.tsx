"use client"

import { cn } from "@/lib/cn"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { mergeRefs } from "@/lib/merge-refs"
import { Slot } from "./slot"
import { ThemePortal } from "./theme-provider"
import { type HTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode, Suspense, forwardRef, lazy, useEffect, useRef, useState } from "react"
import type { DropdownMenuSection } from "./dropdown-menu"

const DropdownMenuPanel = lazy(() => import("./dropdown-menu-panel"))

export interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Items shown on right-click (same model as DropdownMenu). */
  items: DropdownMenuSection[]
  /** The region that opens the menu. */
  children: ReactNode
  ariaLabel?: string
  /** Disables the custom menu (the browser menu shows instead). */
  disabled?: boolean
  menuClassName?: string
  onOpenChange?: (open: boolean) => void
  /** Merges trigger props directly onto a single child element (e.g. TableRow). */
  asChild?: boolean
}

/**
 * Right-click menu for any region. Opens at the pointer on contextmenu, and
 * from the keyboard with Shift+F10 or the ContextMenu key (at the focused
 * region). Shares DropdownMenu's item model, keyboard behaviour and panel.
 */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu({
  items,
  children,
  ariaLabel = "Context menu",
  disabled = false,
  className,
  menuClassName,
  onOpenChange,
  asChild = false,
  ...props
}, ref) {
  const [open, setOpenState] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [point, setPoint] = useState({ x: 0, y: 0 })
  const regionRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  // The lazy, portalled menu mounts after the open state flips; focus its
  // first item once the element exists (and again when the menu switches).
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!(open) || !menuEl) return
    const frame = requestAnimationFrame(() => menuEl.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open, menuEl])
  const restoreRef = useRef<HTMLElement | null>(null)
  const { setFloating, style, placement } = useAnchoredPosition({ open, anchorRef, side: "bottom", align: "start", gap: 2 })

  const setOpen = (next: boolean) => {
    setOpenState(next)
    if (next) setMounted(true)
    onOpenChange?.(next)
  }

  const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  /** Focus returns to the right-clicked control (if focusable), else to what had focus. */
  const openAt = (x: number, y: number, target?: EventTarget | null) => {
    const clicked = target instanceof Element ? target.closest<HTMLElement>(FOCUSABLE) : null
    const active = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null
    restoreRef.current = (clicked && regionRef.current?.contains(clicked) ? clicked : null) ?? active
    setPoint({ x, y })
    setOpen(true)
  }

  const close = (restore: boolean) => {
    setOpen(false)
    if (restore) requestAnimationFrame(() => restoreRef.current?.focus())
  }

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => { if (!menuRef.current?.contains(event.target as Node)) close(false) }
    const onScroll = () => close(false)
    document.addEventListener("mousedown", onPointerDown)
    window.addEventListener("scroll", onScroll, true)
    window.addEventListener("resize", onScroll)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      window.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("resize", onScroll)
    }
  }, [open])

  const onContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    props.onContextMenu?.(event)
    if (disabled || event.defaultPrevented) return
    event.preventDefault()
    openAt(event.clientX, event.clientY, event.target)
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    props.onKeyDown?.(event)
    if (disabled || event.defaultPrevented) return
    if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
      event.preventDefault()
      const target = (document.activeElement instanceof HTMLElement && regionRef.current?.contains(document.activeElement) ? document.activeElement : regionRef.current)!
      const rect = target.getBoundingClientRect()
      openAt(rect.left + 8, rect.top + Math.min(rect.height, 24))
    }
  }

  const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const menuItems = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])
    const index = menuItems.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === "Escape" || event.key === "Tab") {
      event.preventDefault()
      close(true)
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && menuItems.length) {
      event.preventDefault()
      const next = event.key === "Home" ? 0 : event.key === "End" ? menuItems.length - 1 : (Math.max(index, 0) + (event.key === "ArrowDown" ? 1 : -1) + menuItems.length) % menuItems.length
      menuItems[next]?.focus()
    }
  }

  const Comp = asChild ? Slot : "div"

  return (
    <>
      <Comp
        ref={mergeRefs(regionRef, ref)}
        {...props}
        aria-haspopup={disabled ? undefined : "menu"}
        onContextMenu={onContextMenu}
        onKeyDown={onKeyDown}
        className={cn(className)}
      >
        {children}
      </Comp>
      {mounted && (
        <>
          <ThemePortal>
            {/* Zero-size anchor at the pointer: portalled so it never disrupts table row / list item DOM nesting */}
            <span ref={anchorRef} aria-hidden="true" style={{ position: "fixed", left: point.x, top: point.y, width: 0, height: 0, pointerEvents: "none" }} />
          </ThemePortal>
          <Suspense fallback={null}>
            <DropdownMenuPanel
              open={open}
              menuRef={(element) => { menuRef.current = element; setFloating(element); setMenuEl(element) }}
              items={items}
              side={placement === "top" ? "top" : "bottom"}
              style={style}
              className={menuClassName}
              ariaLabel={ariaLabel}
              onKeyDown={onMenuKeyDown}
              onSelect={() => close(true)}
            />
          </Suspense>
        </>
      )}
    </>
  )
})
ContextMenu.displayName = "ContextMenu"

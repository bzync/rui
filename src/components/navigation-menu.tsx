"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { mergeRefs } from "@/lib/merge-refs"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { type FocusEvent, type HTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, forwardRef, useEffect, useId, useRef, useState } from "react"

export interface NavigationMenuLink {
  label: string
  href: string
  description?: string
  icon?: ReactNode
}

export interface NavigationMenuItem {
  label: string
  /** A plain top-level link. */
  href?: string
  /** Links shown in the panel, laid out in a responsive grid. */
  links?: NavigationMenuLink[]
  /** Custom panel content (rendered after `links`). */
  content?: ReactNode
  /** Panel grid columns at desktop widths. Default 2. */
  columns?: 1 | 2 | 3
  active?: boolean
}

export interface NavigationMenuProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: NavigationMenuItem[]
  ariaLabel?: string
  /** Hover delay before a panel opens, in ms. Default 120. */
  openDelay?: number
  /** Delay before a panel closes after the pointer leaves, in ms. Default 200. */
  closeDelay?: number
  triggerClassName?: string
  panelClassName?: string
}

const columnStyles = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3" } as const

const Chevron = ({ open }: { open: boolean }) => (
  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cn("transition-transform duration-150", open && "rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
)

/**
 * Site navigation with dropdown ("mega menu") panels, using the disclosure
 * navigation pattern: triggers are buttons with aria-expanded and the panel
 * follows in tab order. Hover opens panels on pointer devices; click, Enter,
 * Space or Arrow Down opens from the keyboard; Left/Right move between top-level
 * items; Escape closes and returns focus to the trigger.
 */
export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu({
  items,
  ariaLabel = "Main",
  openDelay = 120,
  closeDelay = 200,
  className,
  triggerClassName,
  panelClassName,
  ...props
}, ref) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const rootRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const id = useId()

  // Keep the open panel inside the viewport: shift it left when it would overflow.
  const [shift, setShift] = useState(0)
  useIsomorphicLayoutEffect(() => {
    const panel = openIndex === null ? null : panelRefs.current[openIndex]
    if (!panel) return
    const measure = () => {
      panel.style.translate = ""
      const overflow = panel.getBoundingClientRect().right - (window.innerWidth - 8)
      setShift(overflow > 0 ? -overflow : 0)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [openIndex])

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current) }
  const schedule = (next: number | null, delay: number) => {
    clearTimer()
    timerRef.current = setTimeout(() => setOpenIndex(next), delay)
  }
  useEffect(() => clearTimer, [])

  useEffect(() => {
    if (openIndex === null) return
    const onPointerDown = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpenIndex(null) }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [openIndex])

  const focusItem = (index: number) => itemRefs.current[(index + items.length) % items.length]?.focus()
  const focusPanelLink = (index: number) => requestAnimationFrame(() => panelRefs.current[index]?.querySelector<HTMLElement>("a[href], button:not(:disabled)")?.focus())

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLElement>, index: number) => {
    const hasPanel = Boolean(items[index].links?.length || items[index].content)
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault()
      const next = (index + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length
      focusItem(next)
      if (openIndex !== null) setOpenIndex(items[next].links?.length || items[next].content ? next : null)
    } else if (event.key === "ArrowDown" && hasPanel) {
      event.preventDefault()
      setOpenIndex(index)
      focusPanelLink(index)
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault()
      focusItem(event.key === "Home" ? 0 : items.length - 1)
    }
  }

  const onRootKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    const panel = openIndex === null ? null : panelRefs.current[openIndex]
    if (panel?.contains(document.activeElement) && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault()
      const links = Array.from(panel.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)"))
      const current = links.indexOf(document.activeElement as HTMLElement)
      links[(current + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length]?.focus()
      return
    }
    if (event.key === "Escape" && openIndex !== null) {
      event.preventDefault()
      const index = openIndex
      setOpenIndex(null)
      itemRefs.current[index]?.focus()
    }
  }

  // Close once focus leaves the whole menu (Tab past the last panel link).
  const onRootBlur = (event: FocusEvent<HTMLElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpenIndex(null)
  }

  return (
    <nav
      ref={mergeRefs(rootRef, ref)}
      aria-label={ariaLabel}
      onKeyDown={onRootKeyDown}
      onBlur={onRootBlur}
      onMouseLeave={() => { if (openIndex !== null) schedule(null, closeDelay) }}
      className={cn("relative", className)}
      {...props}
    >
      <ul className="flex items-center gap-0.5">
        {items.map((item, index) => {
          const hasPanel = Boolean(item.links?.length || item.content)
          const open = openIndex === index
          const triggerStyles = cn(
            "inline-flex h-9 items-center gap-1 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors",
            item.active || open ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            open && "bg-foreground/6",
            "hover:bg-foreground/6",
            focusRingStyles,
            triggerClassName,
          )
          return (
            <li key={item.label}>
              {hasPanel ? (
                <button
                  ref={(node) => { itemRefs.current[index] = node }}
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${id}-panel-${index}`}
                  onClick={() => { clearTimer(); setOpenIndex(open ? null : index) }}
                  onMouseEnter={() => schedule(index, openIndex === null ? openDelay : 0)}
                  onKeyDown={(event) => onTriggerKeyDown(event, index)}
                  className={triggerStyles}
                >
                  {item.label}
                  <Chevron open={open} />
                </button>
              ) : (
                <a
                  ref={(node) => { itemRefs.current[index] = node }}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  onMouseEnter={() => { if (openIndex !== null) schedule(null, closeDelay) }}
                  onKeyDown={(event) => onTriggerKeyDown(event, index)}
                  className={triggerStyles}
                >
                  {item.label}
                </a>
              )}
              {hasPanel && (
                <div
                  ref={(node) => { panelRefs.current[index] = node }}
                  id={`${id}-panel-${index}`}
                  hidden={!open}
                  onMouseEnter={clearTimer}
                  style={open && shift ? { translate: `${shift}px 0` } : undefined}
                  className={cn(
                    "absolute left-0 top-full z-(--z-popover) mt-2 w-[min(40rem,calc(100vw-1rem))] rounded-[var(--radius-lg)] border border-border bg-surface-raised p-2 shadow-floating",
                    panelClassName,
                  )}
                >
                  {item.links?.length ? (
                    <ul className={cn("grid gap-1", columnStyles[item.columns ?? 2])}>
                      {item.links.map((link) => (
                        <li key={link.href + link.label}>
                          <a
                            href={link.href}
                            onClick={() => setOpenIndex(null)}
                            className={cn("flex gap-3 rounded-[var(--radius-md)] p-3 transition-colors hover:bg-foreground/6", focusRingStyles)}
                          >
                            {link.icon && <span aria-hidden="true" className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md border border-border bg-surface text-muted-foreground [&_svg]:size-4">{link.icon}</span>}
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-foreground">{link.label}</span>
                              {link.description && <span className="mt-0.5 block text-sm leading-5 text-muted-foreground">{link.description}</span>}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {item.content}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
})
NavigationMenu.displayName = "NavigationMenu"

"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles, iconButtonStyles } from "@/lib/component-styles"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { useControllableState } from "@/hooks/use-controllable-state"
import { mergeRefs } from "@/lib/merge-refs"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { ThemePortal } from "./theme-provider"
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  forwardRef,
  type Ref,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

export interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: ReactNode
  badge?: ReactNode
  disabled?: boolean
  children?: NavigationItem[]
  defaultOpen?: boolean
}

interface NavigationItemProps extends NavigationItem {
  active?: boolean
  compact?: boolean
  /** Icon-only rail: the label becomes a tooltip-style bubble (still the accessible name). */
  rail?: boolean
  onSelect?: (id: string) => void
  className?: string
}

export const NavigationLink = forwardRef<HTMLButtonElement, NavigationItemProps>(function NavigationLink({
  id,
  label,
  href,
  icon,
  badge,
  disabled,
  active,
  compact,
  rail,
  onSelect,
  className,
}, ref) {
  const content = rail ? (
    <>
      {icon ? <span className="shrink-0" aria-hidden="true">{icon}</span> : <span aria-hidden="true" className="text-xs font-semibold">{label.slice(0, 2)}</span>}
      <span className="pointer-events-none absolute left-full top-1/2 z-(--z-tooltip) ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-tooltip-border bg-tooltip px-2 py-1 text-xs font-medium text-tooltip-foreground opacity-0 shadow-floating transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{label}</span>
      {badge && <span aria-hidden="true" className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent-500 ring-2 ring-surface" />}
    </>
  ) : (
    <>
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      <span className={cn("truncate", compact && "text-[11px]")}>{label}</span>
      {badge && <span className="ml-auto shrink-0">{badge}</span>}
    </>
  )
  const styles = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors",
    focusRingStyles,
    compact ? "min-h-11 flex-col px-2 py-1.5" : rail ? "size-10 shrink-0" : "h-9 px-3 text-sm",
    active
      ? "bg-accent-500/10 text-accent-strong"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
    disabled && "pointer-events-none opacity-40",
    className,
  )

  if (href) {
    return (
      <a
        href={href}
        className={styles}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled || undefined}
        onClick={(event) => {
          if (onSelect) {
            event.preventDefault()
            onSelect(id)
          }
        }}
      >
        {content}
      </a>
    )
  }

  return (
    <button ref={ref}
      type="button"
      className={styles}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={() => onSelect?.(id)}
    >
      {content}
    </button>
  )
})
NavigationLink.displayName = "NavigationLink"

export interface NavigationListProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  items: NavigationItem[]
  activeId?: string
  onSelect?: (id: string) => void
  ariaLabel?: string
}

export const Navbar = forwardRef<HTMLElement, NavigationListProps>(function Navbar({
  items,
  activeId,
  onSelect,
  ariaLabel = "Primary navigation",
  className,
  children,
  ...props
}, ref) {
  return (
    <nav ref={ref}
      aria-label={ariaLabel}
      className={cn(
        "flex min-h-14 items-center gap-1 border border-border bg-surface px-3",
        className,
      )}
      {...props}
    >
      {children}
      <div className="ml-auto flex items-center gap-1 overflow-x-auto">
        {items.map((item) => (
          <NavigationLink key={item.id} {...item} active={activeId === item.id} onSelect={onSelect} />
        ))}
      </div>
    </nav>
  )
})
Navbar.displayName = "Navbar"

export const Topbar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Topbar({ className, children, ...props }, ref) {
  return (
    <header ref={ref}
      className={cn(
        "flex min-h-14 items-center gap-3 border-b border-border bg-bg/95 px-4 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  )
})
Topbar.displayName = "Topbar"

export const TopbarTitle = forwardRef<HTMLElement, HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "div" | "p" }>(function TopbarTitle({ as: Tag = "h2", className, children, ...props }, ref) {
  return (
    <Tag ref={ref as Ref<HTMLHeadingElement>} className={cn("min-w-0 flex-1 truncate text-sm font-semibold text-foreground", className)} {...props}>
      {children}
    </Tag>
  )
})
TopbarTitle.displayName = "TopbarTitle"

export interface SidebarProps extends NavigationListProps {
  /** Header content; pass a function to render differently when collapsed. */
  header?: ReactNode | ((collapsed: boolean) => ReactNode)
  footer?: ReactNode | ((collapsed: boolean) => ReactNode)
  /** Shows a button that collapses the sidebar to an icon rail. */
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Remembers the collapsed state in localStorage under this key. */
  storageKey?: string
  collapseLabel?: string
  expandLabel?: string
}

function SidebarItem({
  item,
  activeId,
  onSelect,
  rail,
}: {
  item: NavigationItem
  activeId?: string
  onSelect?: (id: string) => void
  rail?: boolean
}) {
  const hasChildren = Boolean(item.children && item.children.length > 0)
  const isChildActive = Boolean(hasChildren && item.children!.some((child) => child.id === activeId))
  const isSelfActive = activeId === item.id
  const isActive = isSelfActive || isChildActive

  const [open, setOpen] = useState(item.defaultOpen ?? isChildActive)
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const subMenuId = useId()

  const { setFloating, style, placement } = useAnchoredPosition({
    open: Boolean(rail && flyoutOpen),
    anchorRef: triggerRef,
    side: "right",
    align: "start",
    gap: 8,
    padding: 8,
  })

  useEffect(() => {
    if (isChildActive) setOpen(true)
  }, [isChildActive])

  if (!hasChildren) {
    return (
      <NavigationLink
        {...item}
        rail={rail}
        active={isSelfActive}
        onSelect={onSelect}
        className={rail ? undefined : "w-full justify-start"}
      />
    )
  }

  if (rail) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setFlyoutOpen(true)}
        onMouseLeave={() => setFlyoutOpen(false)}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={flyoutOpen}
          aria-label={item.label}
          onClick={() => setFlyoutOpen(!flyoutOpen)}
          className={cn(
            "group relative inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors",
            focusRingStyles,
            isActive
              ? "bg-accent-500/10 text-accent-strong"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            item.disabled && "pointer-events-none opacity-40",
          )}
        >
          {item.icon ? (
            <span className="shrink-0" aria-hidden="true">{item.icon}</span>
          ) : (
            <span aria-hidden="true" className="text-xs font-semibold">{item.label.slice(0, 2)}</span>
          )}
          {item.badge && <span aria-hidden="true" className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent-500 ring-2 ring-surface" />}
        </button>

        <ThemePortal>
          <AnimatePresence>
            {flyoutOpen && (
              <motion.div
                ref={mergeRefs(panelRef, setFloating)}
                style={{
                  ...style,
                  transformOrigin: placement === "left" ? "top right" : "top left",
                }}
                role="menu"
                aria-label={item.label}
                onMouseEnter={() => setFlyoutOpen(true)}
                onMouseLeave={() => setFlyoutOpen(false)}
                initial={{
                  opacity: 0,
                  scale: 0.96,
                  x: placement === "left" ? 6 : -6,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  x: placement === "left" ? 4 : -4,
                }}
                transition={{
                  duration: 0.16,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="z-(--z-popover) min-w-[170px] flex flex-col gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1.5 shadow-floating ring-1 ring-foreground/5 select-none"
              >
                <div className="px-2.5 py-1 text-xs font-semibold text-foreground border-b border-border/60 mb-0.5">
                  {item.label}
                </div>
                {item.children!.map((child) => (
                  <NavigationLink
                    key={child.id}
                    {...child}
                    active={activeId === child.id}
                    onSelect={(id) => {
                      onSelect?.(id)
                      setFlyoutOpen(false)
                    }}
                    className="w-full justify-start text-xs h-8 px-2"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </ThemePortal>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={subMenuId}
        disabled={item.disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "group relative flex w-full items-center justify-between gap-2 rounded-[var(--radius-md)] px-3 h-9 text-sm font-medium transition-colors",
          focusRingStyles,
          isActive
            ? "text-foreground font-semibold"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          item.disabled && "pointer-events-none opacity-40",
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
          <span className="truncate">{item.label}</span>
        </span>

        <span className="flex items-center gap-1.5 shrink-0">
          {item.badge}
          <span className={cn("text-muted-foreground transition-transform duration-200", open && "rotate-180")}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </span>
      </button>

      {open && (
        <div
          id={subMenuId}
          role="group"
          aria-label={item.label}
          className="ml-4 flex flex-col gap-0.5 border-l border-border pl-2.5 pt-0.5 mt-0.5"
        >
          {item.children!.map((child) => (
            <NavigationLink
              key={child.id}
              {...child}
              active={activeId === child.id}
              onSelect={onSelect}
              className="w-full justify-start text-xs h-8 px-2"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar({
  items,
  activeId,
  onSelect,
  ariaLabel = "Sidebar navigation",
  header,
  footer,
  collapsible = false,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  storageKey,
  collapseLabel = "Collapse sidebar",
  expandLabel = "Expand sidebar",
  className,
  ...props
}, ref) {
  const [collapsed, setCollapsedState] = useControllableState({ value: collapsedProp, defaultValue: defaultCollapsed, onChange: onCollapsedChange })
  const rail = collapsible && collapsed

  // Restore after mount so server and client render the same markup first.
  useEffect(() => {
    if (!storageKey || collapsedProp !== undefined) return
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored !== null && (stored === "1") !== collapsed) setCollapsedState(stored === "1")
    } catch { /* storage unavailable */ }
    // Only on mount / key change.
  }, [storageKey])

  const setCollapsed = (next: boolean) => {
    setCollapsedState(next)
    if (storageKey) {
      try { window.localStorage.setItem(storageKey, next ? "1" : "0") } catch { /* storage unavailable */ }
    }
  }

  const render = (slot: SidebarProps["header"]) => (typeof slot === "function" ? slot(rail) : slot)

  return (
    <aside ref={ref}
      data-collapsed={rail || undefined}
      className={cn(
        "flex flex-col border border-border bg-surface transition-[width] duration-200",
        rail ? "w-16" : "w-60",
        className,
      )}
      {...props}
    >
      {header && <div className={cn("border-b border-border", rail ? "grid place-items-center px-2 py-4" : "p-4")}>{render(header)}</div>}
      <nav aria-label={ariaLabel} className={cn("flex flex-1 flex-col gap-1 p-2", rail && "items-center")}>
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            rail={rail}
            activeId={activeId}
            onSelect={onSelect}
          />
        ))}
      </nav>
      {(footer || collapsible) && (
        <div className={cn("flex gap-2 border-t border-border p-3", rail ? "flex-col items-center px-2" : "items-center")}>
          {footer && <div className={cn("min-w-0", !rail && "flex-1")}>{render(footer)}</div>}
          {collapsible && (
            <button
              type="button"
              aria-expanded={!rail}
              aria-label={rail ? expandLabel : collapseLabel}
              title={rail ? expandLabel : collapseLabel}
              onClick={() => setCollapsed(!collapsed)}
              className={cn(iconButtonStyles, !footer && !rail && "ml-auto")}
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("transition-transform", rail && "rotate-180")}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M16 15l-3-3 3-3" /></svg>
            </button>
          )}
        </div>
      )}
    </aside>
  )
})
Sidebar.displayName = "Sidebar"

export interface BottomBarProps extends NavigationListProps {
  /** Pins the bar to the bottom of the viewport (with safe-area padding). */
  fixed?: boolean
  /** "bar" spans the width with a hairline top border; "floating" is a detached rounded pill. */
  variant?: "bar" | "floating"
  /** How the active tab is marked. */
  indicator?: "pill" | "line" | "dot" | "none"
  /** "active" shows only the selected tab's label; "hidden" is icon-only (labels stay as accessible names). */
  labels?: "always" | "active" | "hidden"
  /** A raised primary action rendered in the middle slot (e.g. a "New" button). */
  centerAction?: ReactNode
}

/**
 * Mobile tab bar in the native idiom (iOS / Material 3): icon over a short
 * label, an active indicator, badges as a count on the icon corner, full-height
 * touch targets. Combine variant, indicator, labels and centerAction for the
 * common layouts.
 */
export const BottomBar = forwardRef<HTMLElement, BottomBarProps>(function BottomBar({
  items,
  activeId,
  onSelect,
  ariaLabel = "Mobile navigation",
  fixed = false,
  variant = "bar",
  indicator = "pill",
  labels = "always",
  centerAction,
  className,
  ...props
}, ref) {
  const floating = variant === "floating"
  const middle = Math.ceil(items.length / 2)
  const columns = items.length + (centerAction ? 1 : 0)

  const renderTab = (item: NavigationItem) => {
    const active = activeId === item.id
    const badgeText = typeof item.badge === "string" || typeof item.badge === "number" ? String(item.badge) : undefined
    const showLabel = labels === "always" || (labels === "active" && active)
    const content = (
      <>
        {indicator === "line" && <span aria-hidden="true" className={cn("absolute inset-x-1/4 top-0 h-0.5 rounded-full transition-colors", active ? "bg-primary" : "bg-transparent")} />}
        <span
          className={cn(
            "relative grid h-7 w-14 place-items-center rounded-full transition-colors [&_svg]:size-5",
            active ? "text-accent-strong" : "text-muted-foreground group-hover/tab:text-foreground",
            active && indicator === "pill" && "bg-accent-500/12",
          )}
          aria-hidden="true"
        >
          {item.icon}
          {/* Numbers/strings get the count bubble; custom nodes are placed as given. */}
          {badgeText !== undefined ? (
            <span className="absolute -top-1 left-1/2 ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-surface">
              {badgeText}
            </span>
          ) : item.badge ? (
            <span className="absolute -top-1.5 left-1/2 ml-1.5">{item.badge}</span>
          ) : null}
        </span>
        <span
          className={cn(
            "max-w-full truncate px-1 text-[11px] leading-4 transition-opacity",
            active ? "font-semibold text-foreground" : "font-medium text-muted-foreground group-hover/tab:text-foreground",
            !showLabel && "sr-only",
          )}
        >
          {item.label}
        </span>
        {indicator === "dot" && <span aria-hidden="true" className={cn("size-1 rounded-full transition-colors", active ? "bg-primary" : "bg-transparent")} />}
      </>
    )
    const tabClass = cn(
      "group/tab relative flex min-w-0 flex-col items-center justify-center outline-none",
      floating ? "h-14 rounded-full" : "h-16",
      indicator === "dot" ? "gap-0.5" : "gap-1",
      focusRingStyles,
      item.disabled && "pointer-events-none opacity-40",
    )
    const label = badgeText ? `${item.label}, ${badgeText}` : undefined
    return item.href ? (
      <a key={item.id} href={item.href} aria-label={label} aria-current={active ? "page" : undefined} aria-disabled={item.disabled || undefined} className={tabClass}
        onClick={(event) => { if (onSelect) { event.preventDefault(); onSelect(item.id) } }}>
        {content}
      </a>
    ) : (
      <button key={item.id} type="button" aria-label={label} aria-current={active ? "page" : undefined} disabled={item.disabled} className={tabClass} onClick={() => onSelect?.(item.id)}>
        {content}
      </button>
    )
  }

  const tabs = items.map(renderTab)
  if (centerAction) {
    tabs.splice(middle, 0, (
      <div key="__center" className="flex items-center justify-center">
        <div className={cn(!floating && "-mt-6")}>{centerAction}</div>
      </div>
    ))
  }

  return (
    <nav ref={ref}
      aria-label={ariaLabel}
      className={cn(
        "grid",
        floating
          ? "mx-3 mb-3 rounded-full border border-border bg-surface/95 px-1 shadow-floating backdrop-blur-sm"
          : "border-t border-border bg-surface/95 pb-safe-bottom backdrop-blur-sm",
        fixed && (floating ? "fixed inset-x-0 bottom-[max(0px,env(safe-area-inset-bottom))] z-(--z-sticky)" : "fixed inset-x-0 bottom-0 z-(--z-sticky)"),
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      {...props}
    >
      {tabs}
    </nav>
  )
})
BottomBar.displayName = "BottomBar"

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ label, className, children, type = "button", ...props }, ref) {
  return (
    <button ref={ref}
      type={type}
      aria-label={label}
      className={cn(
        iconButtonStyles,
        "size-9",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
IconButton.displayName = "IconButton"

export interface BrandLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  mark?: ReactNode
}

export const BrandLink = forwardRef<HTMLAnchorElement, BrandLinkProps>(function BrandLink({ mark, className, children, ...props }, ref) {
  return (
    <a ref={ref} className={cn("inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground", focusRingStyles, className)} {...props}>
      {mark}
      {children}
    </a>
  )
})
BrandLink.displayName = "BrandLink"

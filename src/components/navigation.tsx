"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles, iconButtonStyles } from "@/lib/component-styles"
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  forwardRef,
  type Ref,
} from "react"

export interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: ReactNode
  badge?: ReactNode
  disabled?: boolean
}

interface NavigationItemProps extends NavigationItem {
  active?: boolean
  compact?: boolean
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
  onSelect,
  className,
}, ref) {
  const content = (
    <>
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      <span className={cn("truncate", compact && "text-[11px]")}>{label}</span>
      {badge && <span className="ml-auto shrink-0">{badge}</span>}
    </>
  )
  const styles = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors",
    focusRingStyles,
    compact ? "min-h-11 flex-col px-2 py-1.5" : "h-9 px-3 text-sm",
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
  header?: ReactNode
  footer?: ReactNode
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar({
  items,
  activeId,
  onSelect,
  ariaLabel = "Sidebar navigation",
  header,
  footer,
  className,
  ...props
}, ref) {
  return (
    <aside ref={ref}
      className={cn(
        "flex w-60 flex-col border border-border bg-surface",
        className,
      )}
      {...props}
    >
      {header && <div className="border-b border-border p-4">{header}</div>}
      <nav aria-label={ariaLabel} className="flex flex-1 flex-col gap-1 p-2">
        {items.map((item) => (
          <NavigationLink
            key={item.id}
            {...item}
            active={activeId === item.id}
            onSelect={onSelect}
            className="w-full justify-start"
          />
        ))}
      </nav>
      {footer && <div className="border-t border-border p-3">{footer}</div>}
    </aside>
  )
})
Sidebar.displayName = "Sidebar"

export const BottomBar = forwardRef<HTMLElement, NavigationListProps>(function BottomBar({
  items,
  activeId,
  onSelect,
  ariaLabel = "Mobile navigation",
  className,
  ...props
}, ref) {
  return (
    <nav ref={ref}
      aria-label={ariaLabel}
      className={cn(
        "grid min-h-16 border border-border bg-surface/95 px-1 pb-safe-bottom shadow-floating backdrop-blur-sm",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      {...props}
    >
      {items.map((item) => (
        <NavigationLink
          key={item.id}
          {...item}
          compact
          active={activeId === item.id}
          onSelect={onSelect}
          className="rounded-none"
        />
      ))}
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

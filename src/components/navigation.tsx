"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles, iconButtonStyles } from "@/lib/component-styles"
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
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

export function NavigationLink({
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
}: NavigationItemProps) {
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
      ? "bg-accent-50 text-accent-700 dark:bg-accent-500/12 dark:text-accent-300"
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
    <button
      type="button"
      className={styles}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={() => onSelect?.(id)}
    >
      {content}
    </button>
  )
}

export interface NavigationListProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  items: NavigationItem[]
  activeId?: string
  onSelect?: (id: string) => void
  ariaLabel?: string
}

export function Navbar({
  items,
  activeId,
  onSelect,
  ariaLabel = "Primary navigation",
  className,
  children,
  ...props
}: NavigationListProps) {
  return (
    <nav
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
}

export function Topbar({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        "flex min-h-14 items-center gap-3 border-b border-border bg-bg/95 px-4 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  )
}

export function TopbarTitle({ as: Tag = "h2", className, children, ...props }: HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "div" | "p" }) {
  return (
    <Tag className={cn("min-w-0 flex-1 truncate text-sm font-semibold text-foreground", className)} {...props}>
      {children}
    </Tag>
  )
}

export interface SidebarProps extends NavigationListProps {
  header?: ReactNode
  footer?: ReactNode
}

export function Sidebar({
  items,
  activeId,
  onSelect,
  ariaLabel = "Sidebar navigation",
  header,
  footer,
  className,
  ...props
}: SidebarProps) {
  return (
    <aside
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
}

export function BottomBar({
  items,
  activeId,
  onSelect,
  ariaLabel = "Mobile navigation",
  className,
  ...props
}: NavigationListProps) {
  return (
    <nav
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
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export function IconButton({ label, className, children, type = "button", ...props }: IconButtonProps) {
  return (
    <button
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
}

export interface BrandLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  mark?: ReactNode
}

export function BrandLink({ mark, className, children, ...props }: BrandLinkProps) {
  return (
    <a className={cn("inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground", focusRingStyles, className)} {...props}>
      {mark}
      {children}
    </a>
  )
}

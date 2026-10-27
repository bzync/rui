"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { useAnchoredPosition, type AnchoredSide, type AnchoredAlign } from "@/hooks/use-anchored-position"
import { useControllableState } from "@/hooks/use-controllable-state"
import { useEventCallback } from "@/hooks/use-event-callback"
import { mergeRefs } from "@/lib/merge-refs"
import { type Tone, statusSolidStyles } from "@/lib/status-styles"
import { ThemePortal } from "./theme-provider"
import {
  type ForwardedRef,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

export interface NotificationItem {
  id: string
  title: string
  description?: ReactNode
  timestamp?: string | Date
  read?: boolean
  category?: string
  tone?: Tone
  avatar?: string | { src?: string; name: string }
  action?: { label: string; onClick?: () => void }
}

export interface NotificationCenterProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  items?: NotificationItem[]
  defaultItems?: NotificationItem[]
  onItemsChange?: (items: NotificationItem[]) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title?: ReactNode
  /** Override unread count. Defaults to count of items with !read. */
  unreadCount?: number
  categories?: string[]
  onItemClick?: (item: NotificationItem) => void
  onItemDismiss?: (id: string) => void
  onMarkAllAsRead?: () => void
  onClearAll?: () => void
  trigger?: ReactNode
  triggerClassName?: string
  panelClassName?: string
  side?: AnchoredSide
  align?: AnchoredAlign
  emptyLabel?: ReactNode
  ariaLabel?: string
}

function formatTime(timestamp?: string | Date): string {
  if (!timestamp) return ""
  if (typeof timestamp === "string") return timestamp
  const diff = Math.floor((Date.now() - timestamp.getTime()) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const BellIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
)

const CheckCheckIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 7 17l-5-5" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
)

const XIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

export const NotificationCenter = forwardRef<HTMLDivElement, NotificationCenterProps>(function NotificationCenter(
  {
    items: controlledItems,
    defaultItems = [],
    onItemsChange,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    title = "Notifications",
    unreadCount: explicitUnreadCount,
    categories,
    onItemClick,
    onItemDismiss,
    onMarkAllAsRead,
    onClearAll,
    trigger,
    triggerClassName,
    panelClassName,
    side = "bottom",
    align = "end",
    emptyLabel = "No notifications yet",
    ariaLabel = "Notifications",
    className,
    ...props
  },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [items, setItems] = useControllableState<NotificationItem[]>({
    value: controlledItems,
    defaultValue: defaultItems,
    onChange: onItemsChange,
  })

  const [open, setOpen] = useControllableState<boolean>({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  const [activeCategory, setActiveCategory] = useState<string>("all")
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()

  const { setFloating, style } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    side,
    align,
    gap: 8,
    padding: 12,
  })

  const unreadCount = explicitUnreadCount ?? items.filter((item) => !item.read).length

  const handleMarkAllRead = useEventCallback(() => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead()
    } else {
      setItems(items.map((item) => ({ ...item, read: true })))
    }
  })

  const handleDismiss = useEventCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onItemDismiss) {
      onItemDismiss(id)
    } else {
      setItems(items.filter((item) => item.id !== id))
    }
  })

  const handleItemClick = useEventCallback((item: NotificationItem) => {
    if (!item.read) {
      setItems(items.map((i) => (i.id === item.id ? { ...i, read: true } : i)))
    }
    onItemClick?.(item)
  })

  // Keyboard navigation & outside click handling
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [open, setOpen])

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeCategory === "all") return true
    if (activeCategory === "unread") return !item.read
    return item.category?.toLowerCase() === activeCategory.toLowerCase()
  })

  const tabOptions = categories ?? ["all", "unread"]

  return (
    <div ref={ref} className={cn("relative inline-block", className)} {...props}>
      {trigger ? (
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`${ariaLabel}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          onClick={() => setOpen(!open)}
          className={cn("cursor-pointer", triggerClassName)}
        >
          {trigger}
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`${ariaLabel}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          onClick={() => setOpen(!open)}
          className={cn(
            "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-foreground/6 focus:outline-none",
            focusRingStyles,
            triggerClassName,
          )}
        >
          <BellIcon />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      )}

      {open && (
        <ThemePortal>
          <div
            ref={mergeRefs(panelRef, setFloating)}
            style={style}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "z-(--z-popover) flex w-80 sm:w-96 flex-col rounded-[var(--radius-lg)] border border-border bg-surface shadow-floating ring-1 ring-foreground/5",
              panelClassName,
            )}
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <h2 id={titleId} className="text-sm font-semibold text-foreground">
                  {title}
                </h2>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent-strong">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                    aria-label="Mark all as read"
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground",
                      focusRingStyles,
                    )}
                  >
                    <CheckCheckIcon />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    triggerRef.current?.focus()
                  }}
                  aria-label="Close notifications"
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground",
                    focusRingStyles,
                  )}
                >
                  <XIcon />
                </button>
              </div>
            </header>

            {/* Filter Tabs */}
            {tabOptions.length > 1 && (
              <div role="tablist" className="flex border-b border-border bg-surface-muted/40 px-3 py-1.5 gap-1">
                {tabOptions.map((cat) => {
                  const isSelected = activeCategory === cat.toLowerCase()
                  const label = cat.charAt(0).toUpperCase() + cat.slice(1)
                  const count = cat === "unread" ? unreadCount : undefined
                  return (
                    <button
                      key={cat}
                      role="tab"
                      type="button"
                      aria-selected={isSelected}
                      onClick={() => setActiveCategory(cat.toLowerCase())}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        focusRingStyles,
                        isSelected
                          ? "bg-surface text-foreground shadow-xs"
                          : "text-muted-foreground hover:bg-foreground/6 hover:text-foreground",
                      )}
                    >
                      <span>{label}</span>
                      {count !== undefined && count > 0 && (
                        <span className="rounded-full bg-foreground/10 px-1.5 py-0.2 text-[10px] tabular-nums">
                          {count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Notification items */}
            <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/6 text-muted-foreground">
                    <BellIcon />
                  </div>
                  <p className="text-sm font-medium">{emptyLabel}</p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const toneColor = item.tone && item.tone !== "default" && item.tone !== "muted"
                    ? statusSolidStyles[item.tone]
                    : "bg-accent"

                  return (
                    <div
                      key={item.id}
                      role="article"
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "group relative flex cursor-pointer gap-3 p-3 transition-colors hover:bg-foreground/4",
                        !item.read && "bg-accent/4",
                      )}
                    >
                      {/* Avatar or tone indicator */}
                      <div className="relative shrink-0 pt-0.5">
                        {item.avatar ? (
                          typeof item.avatar === "string" ? (
                            <img src={item.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                          ) : item.avatar.src ? (
                            <img src={item.avatar.src} alt="" className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                              {item.avatar.name.slice(0, 2).toUpperCase()}
                            </div>
                          )
                        ) : (
                          <div className={cn("mt-1.5 h-2 w-2 rounded-full", item.read ? "bg-border-strong" : toneColor)} />
                        )}
                        {!item.read && item.avatar && (
                          <span className={cn("absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface", toneColor)} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-xs font-medium", item.read ? "text-foreground" : "font-semibold text-foreground")}>
                            {item.title}
                          </p>
                          {item.timestamp && (
                            <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                              {formatTime(item.timestamp)}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </div>
                        )}
                        {item.action && (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                item.action?.onClick?.()
                              }}
                              className={cn(
                                "inline-flex rounded border border-border bg-surface px-2 py-0.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/6",
                                focusRingStyles,
                              )}
                            >
                              {item.action.label}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Dismiss button */}
                      <button
                        type="button"
                        onClick={(e) => handleDismiss(item.id, e)}
                        aria-label={`Dismiss notification: ${item.title}`}
                        className={cn(
                          "opacity-0 group-hover:opacity-100 focus:opacity-100 flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-opacity hover:bg-foreground/8 hover:text-foreground",
                          focusRingStyles,
                        )}
                      >
                        <XIcon />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {onClearAll && items.length > 0 && (
              <footer className="flex items-center justify-center border-t border-border p-2">
                <button
                  type="button"
                  onClick={onClearAll}
                  className={cn(
                    "rounded px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground",
                    focusRingStyles,
                  )}
                >
                  Clear all notifications
                </button>
              </footer>
            )}
          </div>
        </ThemePortal>
      )}
    </div>
  )
})

NotificationCenter.displayName = "NotificationCenter"

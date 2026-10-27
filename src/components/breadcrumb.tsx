import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { HTMLAttributes, ReactNode, forwardRef } from "react"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: ReactNode
  /** Collapses middle items into "…" when there are more than this many (keeps the first and the last maxItems - 1). */
  maxItems?: number
  /** Styles each list item. */
  itemClassName?: string
  /** Styles linked crumbs. */
  linkClassName?: string
  /** Styles the current (last) crumb. */
  currentClassName?: string
  /** Styles each separator. */
  separatorClassName?: string
}

const DefaultSeparator = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/70">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb({
  items,
  separator,
  maxItems,
  className,
  itemClassName,
  linkClassName,
  currentClassName,
  separatorClassName,
  ...props
}, ref) {
  const collapsed = maxItems !== undefined && maxItems >= 2 && items.length > maxItems
  const visible: (BreadcrumbItem | null)[] = collapsed ? [items[0], null, ...items.slice(items.length - (maxItems - 1))] : items

  return (
    <nav ref={ref} aria-label="Breadcrumb" className={cn("flex min-w-0", className)} {...props}>
      <ol className="flex min-w-0 items-center gap-1.5 overflow-x-auto">
        {visible.map((item, i) => {
          const isLast = i === visible.length - 1
          const sep = i > 0 && <span aria-hidden="true" className={cn("flex items-center shrink-0", separatorClassName)}>{separator ?? <DefaultSeparator />}</span>
          if (!item) {
            return (
              <li key="ellipsis" className={cn("flex items-center gap-1.5", itemClassName)}>
                {sep}
                <span className="text-sm text-muted-foreground" aria-label={`${items.length - maxItems!} hidden levels`}>…</span>
              </li>
            )
          }
          return (
            <li key={i} className={cn("flex items-center gap-1.5", itemClassName)}>
              {sep}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className={cn("flex items-center gap-1 rounded-sm text-sm text-muted-foreground hover:text-foreground transition-colors", focusRingStyles, linkClassName)}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    isLast
                      ? cn("text-foreground font-medium", currentClassName)
                      : "text-muted-foreground",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
})
Breadcrumb.displayName = "Breadcrumb"

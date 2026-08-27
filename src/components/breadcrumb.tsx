import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { HTMLAttributes, ReactNode } from "react"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: ReactNode
}

const DefaultSeparator = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export function Breadcrumb({ items, separator, className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex min-w-0", className)} {...props}>
      <ol className="flex min-w-0 items-center gap-1.5 overflow-x-auto">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="flex items-center shrink-0">{separator ?? <DefaultSeparator />}</span>}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className={cn("flex items-center gap-1 rounded-sm text-sm text-muted-foreground hover:text-foreground transition-colors", focusRingStyles)}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    isLast
                      ? "text-foreground font-medium"
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
}

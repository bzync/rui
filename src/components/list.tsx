import { cn } from "@/lib/cn"
import { HTMLAttributes, ReactNode } from "react"

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  divided?: boolean
}

export function List({ divided = true, className, children, ...props }: ListProps) {
  return (
    <ul
      className={cn(
        divided && "divide-y divide-border",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  )
}

export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  icon?: ReactNode
  trailing?: ReactNode
  description?: string
  href?: string
  active?: boolean
}

export function ListItem({ icon, trailing, description, href, active, className, children, onClick, ...props }: ListItemProps) {
  const isInteractive = !!href || !!onClick

  const inner = (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 transition-colors rounded-lg",
        isInteractive && "cursor-pointer hover:bg-foreground/4",
        active && "bg-accent-500/8 text-accent-400",
      )}
    >
      {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", active ? "text-accent-400" : "text-foreground")}>
          {children}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
        )}
      </div>
      {trailing && <span className="shrink-0 text-muted-foreground">{trailing}</span>}
    </div>
  )

  return (
    <li className={cn(className)} onClick={onClick} {...props}>
      {href ? <a href={href}>{inner}</a> : inner}
    </li>
  )
}

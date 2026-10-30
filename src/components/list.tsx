"use client"

import { cn } from "@/lib/cn"
import { HTMLAttributes, ReactNode, forwardRef } from "react"

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  divided?: boolean
}

export const List = forwardRef<HTMLUListElement, ListProps>(function List({ divided = true, className, children, ...props }, ref) {
  return (
    <ul ref={ref}
      className={cn(
        divided && "divide-y divide-border",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  )
})
List.displayName = "List"

export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  icon?: ReactNode
  trailing?: ReactNode
  description?: string
  href?: string
  active?: boolean
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem({ icon, trailing, description, href, active, className, children, onClick, ...props }, ref) {
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
    <li ref={ref} className={cn(className)} onClick={onClick} {...props}>
      {href ? <a href={href}>{inner}</a> : inner}
    </li>
  )
})
ListItem.displayName = "ListItem"

import { cn } from "@/lib/cn"
import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, forwardRef } from "react"

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  containerClassName?: string
  scrollAreaClassName?: string
  density?: "compact" | "comfortable"
}

export const Table = forwardRef<HTMLDivElement, TableProps>(function Table({
  className,
  containerClassName,
  scrollAreaClassName,
  density = "comfortable",
  children,
  ...props
}, ref) {
  return (
    <div ref={ref} className={cn("w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface", containerClassName)}>
      {/* relative: the scroller must be the containing block of absolutely
          positioned cell content (sr-only labels, badges); otherwise that
          content escapes the overflow clip and widens the page on phones. */}
      <div className={cn("relative w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain scrollbar-thin", scrollAreaClassName)}>
        <table data-density={density} className={cn("group/table w-full border-collapse text-sm", className)} {...props}>
          {children}
        </table>
      </div>
    </div>
  )
})
Table.displayName = "Table"

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableHeader({
  className,
  children,
  ...props
}, ref) {
  return (
    <thead ref={ref}
      className={cn("border-b border-border bg-surface-muted", className)}
      {...props}
    >
      {children}
    </thead>
  )
})
TableHeader.displayName = "TableHeader"

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableBody({
  className,
  children,
  ...props
}, ref) {
  return (
    <tbody ref={ref} className={cn("divide-y divide-border", className)} {...props}>
      {children}
    </tbody>
  )
})
TableBody.displayName = "TableBody"

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(function TableRow({
  className,
  children,
  ...props
}, ref) {
  return (
    <tr ref={ref}
      className={cn(
        "transition-colors duration-100 hover:bg-surface-muted aria-selected:bg-accent-500/8",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  )
})
TableRow.displayName = "TableRow"

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(function TableHead({
  className,
  children,
  ...props
}, ref) {
  return (
    <th ref={ref}
      className={cn(
        "px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground whitespace-nowrap group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  )
})
TableHead.displayName = "TableHead"

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(function TableCell({
  className,
  children,
  ...props
}, ref) {
  return (
    <td ref={ref} className={cn("px-4 py-3 text-sm tabular-nums text-foreground whitespace-nowrap group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2", className)} {...props}>
      {children}
    </td>
  )
})
TableCell.displayName = "TableCell"

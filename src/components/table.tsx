import { cn } from "@/lib/cn"
import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react"

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  containerClassName?: string
  scrollAreaClassName?: string
  density?: "compact" | "comfortable"
}

export function Table({
  className,
  containerClassName,
  scrollAreaClassName,
  density = "comfortable",
  children,
  ...props
}: TableProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface", containerClassName)}>
      <div className={cn("w-full overflow-x-auto overscroll-x-contain scrollbar-thin", scrollAreaClassName)}>
        <table data-density={density} className={cn("group/table w-full border-collapse text-sm", className)} {...props}>
          {children}
        </table>
      </div>
    </div>
  )
}

export function TableHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-border bg-surface-muted", className)}
      {...props}
    >
      {children}
    </thead>
  )
}

export function TableBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-border", className)} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition-colors duration-100 hover:bg-surface-muted aria-selected:bg-accent-50/70 dark:aria-selected:bg-accent-500/10",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({
  className,
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground whitespace-nowrap group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({
  className,
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-4 py-3 text-sm tabular-nums text-foreground whitespace-nowrap group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2", className)} {...props}>
      {children}
    </td>
  )
}

import { ReactNode } from "react"

export type SortDir = "asc" | "desc" | null

export interface ColumnDef<T> {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  sortable?: boolean
  searchable?: boolean
  width?: string
  align?: "left" | "center" | "right"
  /** Styles this column's body cells. */
  className?: string
  /** Styles this column's header cell. */
  headerClassName?: string
}

export interface DataTableProps<T extends { id: string | number }> {
  columns: ColumnDef<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  className?: string
  toolbarClassName?: string
  tableClassName?: string
  /** Styles the header row group. */
  headerClassName?: string
  /** Styles body rows; a function receives the row for conditional styling. */
  rowClassName?: string | ((row: T) => string | undefined)
  /** Styles every body cell. */
  cellClassName?: string
  /** Removes the default table chrome while preserving its data behavior. */
  unstyled?: boolean
  /** Show search bar. Pass column keys to search — defaults to all searchable columns */
  searchable?: boolean
  searchPlaceholder?: string
  /** Rows per page options. Pass false to disable pagination entirely. Default: [10, 25, 50] */
  pageSizeOptions?: number[] | false
  defaultPageSize?: number
  density?: "compact" | "comfortable"
  ariaLabel?: string
  getRowLabel?: (row: T) => string
}

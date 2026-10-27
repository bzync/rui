import { ReactNode } from "react"

export type SortDir = "asc" | "desc" | null

export interface DataTableSort {
  key: string | null
  dir: SortDir
}

export interface ColumnDef<T> {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  sortable?: boolean
  searchable?: boolean
  width?: string
  /** Minimum width in px when columns are resizable. Default 60. */
  minWidth?: number
  align?: "left" | "center" | "right"
  /** Sticks the column to an edge while the table scrolls horizontally. */
  pinned?: "left" | "right"
  /** Whether the column can be hidden from the column menu. Default true. */
  hideable?: boolean
  /** Value used for sorting; defaults to `row[key]`. */
  sortValue?: (row: T) => string | number | Date | null | undefined
  /** Text matched by the search box; defaults to `row[key]`. */
  filterValue?: (row: T) => string
  /** Styles this column's body cells. */
  className?: string
  /** Styles this column's header cell. */
  headerClassName?: string
}

export interface DataTableVirtualization {
  /** Height of the scrolling body area in px. */
  height: number
  /** Fixed row height in px (rows are rendered at this height). */
  rowHeight: number
  /** Extra rows rendered above and below the viewport. Default 6. */
  overscan?: number
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

  // ─── Selection ───────────────────────────────────────────────────────────
  /** Adds a checkbox column. `"single"` allows one row at a time. */
  selectable?: boolean | "single" | "multiple"
  /** Controlled selected row ids. */
  selectedIds?: (string | number)[]
  /** Initially selected row ids when uncontrolled. */
  defaultSelectedIds?: (string | number)[]
  onSelectionChange?: (ids: (string | number)[], rows: T[]) => void
  /** Rows that cannot be selected. */
  isRowSelectable?: (row: T) => boolean
  /** Rendered in a bar above the table while rows are selected. */
  bulkActions?: (selectedRows: T[], clearSelection: () => void) => ReactNode

  // ─── Columns ─────────────────────────────────────────────────────────────
  /** Shows a "Columns" menu for hiding/showing hideable columns. */
  columnToggle?: boolean
  /** Controlled hidden column keys. */
  hiddenColumns?: string[]
  /** Initially hidden column keys when uncontrolled. */
  defaultHiddenColumns?: string[]
  onHiddenColumnsChange?: (keys: string[]) => void
  /** Drag (or arrow-key) handles on header edges to resize columns. */
  resizableColumns?: boolean
  onColumnResize?: (widths: Record<string, number>) => void

  // ─── Sorting / search / pagination state ─────────────────────────────────
  /** Controlled sort. */
  sort?: DataTableSort
  onSortChange?: (sort: DataTableSort) => void
  /** Controlled search text. */
  query?: string
  onQueryChange?: (query: string) => void
  /** Controlled one-based page. */
  page?: number
  onPageChange?: (page: number) => void
  /** Controlled page size. */
  pageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  /**
   * Server-side mode: `data` is already the current page, filtered and sorted
   * by your API. The table only reports sort/query/page changes. Pass
   * `rowCount` for the total number of matching rows.
   */
  manual?: boolean
  /** Total matching rows (server-side mode). */
  rowCount?: number

  // ─── Large data ──────────────────────────────────────────────────────────
  /** Renders only visible rows; disables pagination. For thousands of rows. */
  virtualized?: DataTableVirtualization
}

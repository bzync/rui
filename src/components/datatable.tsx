"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { useControllableState } from "@/hooks/use-controllable-state"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type Ref,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { Checkbox } from "./checkbox"
import { Popover, PopoverContent } from "./popover"
import { PaginationFooter } from "./datatable/pagination-footer"
import { RowsDropdown } from "./datatable/rows-dropdown"
import { SkeletonRow } from "./datatable/skeleton-row"
import { SortIcon } from "./datatable/sort-icon"
import type { ColumnDef, DataTableProps, DataTableSort, SortDir } from "./datatable/types"

export type { SortDir, ColumnDef, DataTableProps, DataTableSort, DataTableVirtualization } from "./datatable/types"

const alignClass = { left: "text-left", center: "text-center", right: "text-right" } as const
const SELECT_KEY = "__select"
const SELECT_WIDTH = 44
const NO_IDS: (string | number)[] = []
const NO_KEYS: string[] = []
const NO_SORT: DataTableSort = { key: null, dir: null }

type Id = string | number

function valueOf<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function compare(a: unknown, b: unknown): number {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true })
}

function DataTableInner<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data",
  onRowClick,
  className,
  toolbarClassName,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  searchable = false,
  searchPlaceholder = "Search…",
  pageSizeOptions = [10, 25, 50],
  defaultPageSize,
  density = "comfortable",
  ariaLabel = "Data table",
  getRowLabel,
  unstyled = false,
  selectable = false,
  selectedIds: controlledSelected,
  defaultSelectedIds = NO_IDS,
  onSelectionChange,
  isRowSelectable,
  bulkActions,
  columnToggle = false,
  hiddenColumns: controlledHidden,
  defaultHiddenColumns = NO_KEYS,
  onHiddenColumnsChange,
  resizableColumns = false,
  onColumnResize,
  sort: controlledSort,
  onSortChange,
  query: controlledQuery,
  onQueryChange,
  page: controlledPage,
  onPageChange,
  pageSize: controlledPageSize,
  onPageSizeChange,
  manual = false,
  rowCount,
  virtualized,
}: DataTableProps<T>, ref: Ref<HTMLDivElement>) {
  const paginate = pageSizeOptions !== false && !virtualized
  const [sort, setSort] = useControllableState<DataTableSort>({ value: controlledSort, defaultValue: NO_SORT, onChange: onSortChange })
  const [query, setQueryState] = useControllableState({ value: controlledQuery, defaultValue: "", onChange: onQueryChange })
  const [page, setPage] = useControllableState({ value: controlledPage, defaultValue: 1, onChange: onPageChange })
  const [pageSize, setPageSizeState] = useControllableState<number>({
    value: controlledPageSize,
    defaultValue: defaultPageSize ?? (pageSizeOptions === false ? Infinity : (pageSizeOptions[0] ?? 10)),
    onChange: onPageSizeChange,
  })
  const [hidden, setHidden] = useControllableState({ value: controlledHidden, defaultValue: defaultHiddenColumns, onChange: onHiddenColumnsChange })
  const selectionMode = selectable === true ? "multiple" : selectable || null
  const [selectedIds, setSelectedIdsState] = useState<Id[]>(defaultSelectedIds)
  const selected = controlledSelected ?? selectedIds

  const visibleColumns = useMemo(() => columns.filter((col) => !hidden.includes(col.key)), [columns, hidden])

  // ─── Data pipeline (skipped in manual / server-side mode) ────────────────
  const searchableCols = useMemo(() => columns.filter((c) => c.searchable !== false && c.key), [columns])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (manual || !q) return data
    return data.filter((row) =>
      searchableCols.some((col) => String(col.filterValue ? col.filterValue(row) : valueOf(row, col.key) ?? "").toLowerCase().includes(q)),
    )
  }, [data, query, searchableCols, manual])

  const sorted = useMemo(() => {
    if (manual || !sort.key || !sort.dir) return filtered
    const column = columns.find((col) => col.key === sort.key)
    const read = (row: T) => (column?.sortValue ? column.sortValue(row) : valueOf(row, sort.key!))
    const factor = sort.dir === "asc" ? 1 : -1
    return [...filtered].sort((a, b) => compare(read(a), read(b)) * factor)
  }, [filtered, sort, columns, manual])

  const total = manual ? (rowCount ?? data.length) : sorted.length
  const effectivePageSize = paginate ? pageSize : Infinity
  const totalPages = effectivePageSize === Infinity ? 1 : Math.max(1, Math.ceil(total / effectivePageSize))
  const rows = useMemo(() => {
    if (manual || effectivePageSize === Infinity) return sorted
    const start = (page - 1) * effectivePageSize
    return sorted.slice(start, start + effectivePageSize)
  }, [sorted, page, effectivePageSize, manual])

  const hasPagination = paginate && effectivePageSize !== Infinity && totalPages > 1
  const showRowsDropdown = paginate && Array.isArray(pageSizeOptions) && pageSizeOptions.length > 1

  const handleSort = useCallback((key: string) => {
    const next: SortDir = sort.key !== key ? "asc" : sort.dir === "asc" ? "desc" : null
    setSort(next ? { key, dir: next } : NO_SORT)
    setPage(1)
  }, [sort, setSort, setPage])

  const setQuery = (value: string) => { setQueryState(value); setPage(1) }
  const setPageSize = (value: number) => { setPageSizeState(value); setPage(1) }

  // ─── Selection ───────────────────────────────────────────────────────────
  const canSelect = useCallback((row: T) => (isRowSelectable ? isRowSelectable(row) : true), [isRowSelectable])
  const rowsById = useMemo(() => new Map(data.map((row) => [row.id, row])), [data])
  const updateSelection = (ids: Id[]) => {
    if (controlledSelected === undefined) setSelectedIdsState(ids)
    onSelectionChange?.(ids, ids.map((id) => rowsById.get(id)).filter((row): row is T => Boolean(row)))
  }
  const toggleRow = (row: T) => {
    if (!canSelect(row)) return
    const isSelected = selected.includes(row.id)
    if (selectionMode === "single") updateSelection(isSelected ? [] : [row.id])
    else updateSelection(isSelected ? selected.filter((id) => id !== row.id) : [...selected, row.id])
  }
  // Select-all targets every selectable row that matches the current search
  // (all pages), or the current page in server-side mode.
  const selectAllPool = (manual ? rows : sorted).filter(canSelect)
  const selectedInPool = selectAllPool.filter((row) => selected.includes(row.id)).length
  const allSelected = selectAllPool.length > 0 && selectedInPool === selectAllPool.length
  const toggleAll = () => {
    const poolIds = selectAllPool.map((row) => row.id)
    updateSelection(allSelected ? selected.filter((id) => !poolIds.includes(id)) : [...new Set([...selected, ...poolIds])])
  }
  const selectedRows = selected.map((id) => rowsById.get(id)).filter((row): row is T => Boolean(row))
  const clearSelection = () => updateSelection([])

  // ─── Column sizing and pinning ───────────────────────────────────────────
  const tableRef = useRef<HTMLTableElement>(null)
  const headerRefs = useRef(new Map<string, HTMLTableCellElement>())
  const [widths, setWidths] = useState<Record<string, number>>({})
  const [offsets, setOffsets] = useState<Record<string, CSSProperties>>({})
  const layoutKey = visibleColumns.map((col) => `${col.key}:${col.pinned ?? ""}`).join("|") + (selectionMode ? "|sel" : "")
  const hasPinned = visibleColumns.some((col) => col.pinned)

  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      if (resizableColumns) {
        setWidths((current) => {
          const next = { ...current }
          let changed = false
          for (const col of visibleColumns) {
            if (next[col.key] !== undefined) continue
            const width = headerRefs.current.get(col.key)?.getBoundingClientRect().width
            if (width) { next[col.key] = Math.round(width); changed = true }
          }
          return changed ? next : current
        })
      }
      if (!hasPinned) return
      const width = (key: string) => (key === SELECT_KEY ? SELECT_WIDTH : headerRefs.current.get(key)?.getBoundingClientRect().width ?? 0)
      const next: Record<string, CSSProperties> = {}
      let left = 0
      if (selectionMode && visibleColumns.some((col) => col.pinned === "left")) {
        next[SELECT_KEY] = { position: "sticky", left: 0 }
        left = SELECT_WIDTH
      }
      for (const col of visibleColumns) {
        if (col.pinned !== "left") continue
        next[col.key] = { position: "sticky", left }
        left += width(col.key)
      }
      let right = 0
      for (const col of [...visibleColumns].reverse()) {
        if (col.pinned !== "right") continue
        next[col.key] = { position: "sticky", right }
        right += width(col.key)
      }
      setOffsets(next)
    }
    measure()
    const table = tableRef.current
    if (!table || typeof ResizeObserver === "undefined" || !hasPinned) return
    const observer = new ResizeObserver(measure)
    observer.observe(table)
    return () => observer.disconnect()
  }, [layoutKey, resizableColumns, hasPinned, widths])

  const resizeTo = (key: string, width: number, minWidth = 60) => {
    setWidths((current) => {
      const next = { ...current, [key]: Math.max(minWidth, Math.round(width)) }
      onColumnResize?.(next)
      return next
    })
  }

  const startResize = (event: ReactPointerEvent<HTMLSpanElement>, col: ColumnDef<T>) => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = widths[col.key] ?? headerRefs.current.get(col.key)?.getBoundingClientRect().width ?? 120
    const handle = event.currentTarget
    handle.setPointerCapture?.(event.pointerId)
    const onMove = (move: PointerEvent) => resizeTo(col.key, startWidth + move.clientX - startX, col.minWidth)
    const onUp = () => {
      handle.removeEventListener("pointermove", onMove)
      handle.removeEventListener("pointerup", onUp)
    }
    handle.addEventListener("pointermove", onMove)
    handle.addEventListener("pointerup", onUp)
  }

  const resizeWithKeys = (event: ReactKeyboardEvent<HTMLSpanElement>, col: ColumnDef<T>) => {
    const step = event.shiftKey ? 50 : 10
    const current = widths[col.key] ?? headerRefs.current.get(col.key)?.getBoundingClientRect().width ?? 120
    if (event.key === "ArrowLeft") { event.preventDefault(); resizeTo(col.key, current - step, col.minWidth) }
    if (event.key === "ArrowRight") { event.preventDefault(); resizeTo(col.key, current + step, col.minWidth) }
  }

  const sizedTable = resizableColumns && visibleColumns.every((col) => widths[col.key] !== undefined)
  const tableWidth = sizedTable ? visibleColumns.reduce((sum, col) => sum + widths[col.key], selectionMode ? SELECT_WIDTH : 0) : undefined

  // ─── Virtualization ──────────────────────────────────────────────────────
  const [scrollTop, setScrollTop] = useState(0)
  const overscan = virtualized?.overscan ?? 6
  const windowStart = virtualized ? Math.max(0, Math.floor(scrollTop / virtualized.rowHeight) - overscan) : 0
  const windowEnd = virtualized ? Math.min(rows.length, Math.ceil((scrollTop + virtualized.height) / virtualized.rowHeight) + overscan) : rows.length
  const visibleRows = virtualized ? rows.slice(windowStart, windowEnd) : rows

  const columnCount = visibleColumns.length + (selectionMode ? 1 : 0)

  if (unstyled) {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        {searchable && <input aria-label={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} />}
        <table aria-label={ariaLabel} className={tableClassName}><tbody>{rows.map(r => <tr key={r.id} onClick={onRowClick ? () => onRowClick(r) : undefined}>{visibleColumns.map(c => <td key={c.key}>{c.cell(r)}</td>)}</tr>)}</tbody></table>
      </div>
    )
  }

  const pinnedClass = (key: string, header: boolean) => {
    if (!offsets[key]) return undefined
    const index = visibleColumns.findIndex((c) => c.key === key)
    const col = visibleColumns[index]
    const lastLeft = col?.pinned === "left" && !visibleColumns.slice(index + 1).some((c) => c.pinned === "left")
    const firstRight = col?.pinned === "right" && !visibleColumns.slice(0, index).some((c) => c.pinned === "right")
    return cn(
      header ? "z-[3] bg-surface-muted" : "z-[1] bg-surface group-hover/row:bg-surface-muted",
      lastLeft && "shadow-[inset_-1px_0_0_var(--color-border)]",
      firstRight && "shadow-[inset_1px_0_0_var(--color-border)]",
    )
  }

  const toolbar = (searchable || showRowsDropdown || columnToggle) && (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-3", toolbarClassName)}>
      {searchable ? (
        <div className="relative flex-1 sm:max-w-xs">
          <svg aria-hidden="true" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input aria-label={searchPlaceholder} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} className="h-8 w-full rounded-[var(--radius-md)] border border-border bg-surface pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-accent-500 focus:outline-none focus:ring-[3px] focus:ring-focus-ring/25" />
        </div>
      ) : <div />}
      <div className="flex items-center gap-2">
        {columnToggle && (
          <Popover
            align="end"
            ariaLabel="Visible columns"
            trigger={
              <button type="button" className={cn("inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 text-xs font-medium text-foreground hover:bg-surface-muted", focusRingStyles)}>
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></svg>
                Columns
              </button>
            }
          >
            <PopoverContent className="grid w-52 gap-2">
              {columns.filter((col) => col.hideable !== false).map((col) => (
                <Checkbox
                  key={col.key}
                  size="sm"
                  label={typeof col.header === "string" ? col.header : col.key}
                  checked={!hidden.includes(col.key)}
                  onChange={(event) => setHidden(event.target.checked ? hidden.filter((key) => key !== col.key) : [...hidden, col.key])}
                />
              ))}
            </PopoverContent>
          </Popover>
        )}
        {showRowsDropdown && <RowsDropdown options={pageSizeOptions as number[]} value={pageSize} onChange={setPageSize} />}
      </div>
    </div>
  )

  return (
    <div ref={ref} className={cn("w-full min-w-0 max-w-full flex flex-col gap-3", className)}>
      {toolbar}
      {bulkActions && selectedRows.length > 0 && (
        <div role="region" aria-label="Bulk actions" className="flex flex-wrap items-center gap-2 rounded-[var(--radius-lg)] border border-accent-500/25 bg-accent-500/8 px-3 py-2 text-sm">
          <span className="font-medium text-accent-strong" aria-live="polite">{`${selectedRows.length} selected`}</span>
          <span className="flex flex-1 flex-wrap items-center justify-end gap-2">{bulkActions(selectedRows, clearSelection)}</span>
        </div>
      )}
      <div style={{ contain: "inline-size paint" }} className={cn("w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface", tableClassName)}>
        <div
          className={cn("relative w-full min-w-0 max-w-full overscroll-contain scrollbar-thin", virtualized ? "overflow-auto" : "overflow-x-auto")}
          style={virtualized ? { height: virtualized.height } : undefined}
          onScroll={virtualized ? (event) => setScrollTop(event.currentTarget.scrollTop) : undefined}
        >
          <table
            ref={tableRef}
            aria-label={ariaLabel}
            aria-rowcount={virtualized ? rows.length + 1 : undefined}
            aria-multiselectable={selectionMode === "multiple" || undefined}
            data-density={density}
            style={sizedTable ? { tableLayout: "fixed", width: tableWidth, minWidth: "100%" } : undefined}
            className="group/table w-full text-sm border-collapse"
          >
            <thead className={cn("border-b border-border bg-surface-muted", virtualized && "sticky top-0 z-[4]", headerClassName)}>
              <tr aria-rowindex={virtualized ? 1 : undefined}>
                {selectionMode && (
                  <th scope="col" style={{ width: SELECT_WIDTH, ...offsets[SELECT_KEY] }} className={cn("px-3 py-2.5", pinnedClass(SELECT_KEY, true))}>
                    {selectionMode === "multiple" && (
                      <Checkbox
                        size="sm"
                        aria-label="Select all rows"
                        checked={allSelected}
                        indeterminate={selectedInPool > 0 && !allSelected}
                        disabled={selectAllPool.length === 0}
                        onChange={toggleAll}
                      />
                    )}
                  </th>
                )}
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    ref={(node) => { if (node) headerRefs.current.set(col.key, node); else headerRefs.current.delete(col.key) }}
                    scope="col"
                    aria-sort={sort.key === col.key ? (sort.dir === "asc" ? "ascending" : sort.dir === "desc" ? "descending" : "none") : undefined}
                    style={{ width: widths[col.key] ?? col.width, ...offsets[col.key] }}
                    className={cn("relative px-4 py-2.5 text-[11px] font-semibold text-muted-foreground group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2", alignClass[col.align ?? "left"], pinnedClass(col.key, true), col.headerClassName)}
                  >
                    {col.sortable ? <button type="button" className="inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring/35" onClick={() => handleSort(col.key)}>{col.header}<SortIcon dir={sort.key === col.key ? sort.dir : null} /></button> : col.header}
                    {resizableColumns && (
                      <span
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Resize ${typeof col.header === "string" ? col.header : col.key} column`}
                        aria-valuenow={widths[col.key]}
                        aria-valuemin={col.minWidth ?? 60}
                        tabIndex={0}
                        onPointerDown={(event) => startResize(event, col)}
                        onKeyDown={(event) => resizeWithKeys(event, col)}
                        className="absolute inset-y-1 right-0 w-2 cursor-col-resize touch-none rounded-sm after:absolute after:inset-y-1 after:left-1/2 after:w-px after:bg-border hover:after:bg-accent-500 focus-visible:outline-none focus-visible:after:w-0.5 focus-visible:after:bg-accent-500"
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columnCount} />) : rows.length === 0 ? (
                <tr><td colSpan={columnCount} className="px-4 py-12 text-center text-sm text-muted-foreground">{query ? `No results for “${query}”` : emptyMessage}</td></tr>
              ) : (
                <>
                  {virtualized && windowStart > 0 && <tr aria-hidden="true" style={{ height: windowStart * virtualized.rowHeight }} />}
                  {visibleRows.map((row, index) => {
                    const isSelected = selected.includes(row.id)
                    const rowSelectable = canSelect(row)
                    return (
                      <tr
                        key={row.id}
                        aria-rowindex={virtualized ? windowStart + index + 2 : undefined}
                        aria-selected={selectionMode ? isSelected : undefined}
                        tabIndex={onRowClick ? 0 : undefined}
                        aria-label={getRowLabel?.(row)}
                        style={virtualized ? { height: virtualized.rowHeight } : undefined}
                        className={cn("group/row transition-colors duration-100 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-focus-ring/35", isSelected && "bg-accent-500/8 hover:bg-accent-500/12", onRowClick && "cursor-pointer", typeof rowClassName === "function" ? rowClassName(row) : rowClassName)}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        onKeyDown={onRowClick ? (event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onRowClick(row) } } : undefined}
                      >
                        {selectionMode && (
                          <td style={virtualized ? { ...offsets[SELECT_KEY], height: virtualized.rowHeight } : offsets[SELECT_KEY]} className={cn("px-3 py-2", virtualized && "py-0", pinnedClass(SELECT_KEY, false))} onClick={(event) => event.stopPropagation()}>
                            <Checkbox
                              size="sm"
                              aria-label={`Select ${getRowLabel?.(row) ?? `row ${row.id}`}`}
                              checked={isSelected}
                              disabled={!rowSelectable}
                              onChange={() => toggleRow(row)}
                            />
                          </td>
                        )}
                        {visibleColumns.map((col) => (
                          <td key={col.key} style={virtualized ? { ...offsets[col.key], height: virtualized.rowHeight } : offsets[col.key]} className={cn("px-4 py-3 text-sm tabular-nums text-foreground group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2", (sizedTable || virtualized) && "overflow-hidden text-ellipsis whitespace-nowrap", virtualized && "py-0 group-data-[density=compact]/table:py-0", alignClass[col.align ?? "left"], pinnedClass(col.key, false), cellClassName, col.className)}>{col.cell(row)}</td>
                        ))}
                      </tr>
                    )
                  })}
                  {virtualized && windowEnd < rows.length && <tr aria-hidden="true" style={{ height: (rows.length - windowEnd) * virtualized.rowHeight }} />}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {(hasPagination || (!loading && total > 0)) && (
        <PaginationFooter loading={loading} sortedLength={total} pageSizeOptions={paginate ? pageSizeOptions : false} pageSize={effectivePageSize} page={page} totalPages={totalPages} hasPagination={hasPagination} setPage={(next) => setPage(typeof next === "function" ? next(page) : next)} />
      )}
    </div>
  )
}

// forwardRef erases generics; the cast keeps DataTable<T> typed by its rows.
export const DataTable = forwardRef(DataTableInner) as <T extends { id: string | number }>(
  props: DataTableProps<T> & { ref?: Ref<HTMLDivElement> },
) => ReactElement

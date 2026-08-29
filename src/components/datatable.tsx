"use client"

import { cn } from "@/lib/cn"
import { useState, useMemo, useCallback } from "react"
import { PaginationFooter } from "./datatable/pagination-footer"
import { RowsDropdown } from "./datatable/rows-dropdown"
import { SkeletonRow } from "./datatable/skeleton-row"
import { SortIcon } from "./datatable/sort-icon"
import { DataTableProps, SortDir } from "./datatable/types"

export type { SortDir, ColumnDef, DataTableProps } from "./datatable/types"

const alignClass = { left: "text-left", center: "text-center", right: "text-right" } as const

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data",
  onRowClick,
  className,
  toolbarClassName,
  tableClassName,
  searchable = false,
  searchPlaceholder = "Search…",
  pageSizeOptions = [10, 25, 50],
  defaultPageSize,
  density = "comfortable",
  ariaLabel = "Data table",
  getRowLabel,
  unstyled = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(
    defaultPageSize ?? (pageSizeOptions === false ? Infinity : (pageSizeOptions[0] ?? 10)),
  )

  const handleSort = useCallback((key: string) => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir("asc")
    } else if (sortDir === "asc") {
      setSortDir("desc")
    } else {
      setSortKey(null)
      setSortDir(null)
    }
    setPage(1)
  }, [sortDir, sortKey])

  const searchableCols = useMemo(() => columns.filter((c) => c.searchable !== false && c.key), [columns])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((row) =>
      searchableCols.some((col) => {
        const val = (row as Record<string, unknown>)[col.key]
        return String(val ?? "").toLowerCase().includes(q)
      }),
    )
  }, [data, query, searchableCols])

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey]
      const bv = (b as Record<string, unknown>)[sortKey]
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true })
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const paginated = useMemo(() => {
    if (pageSizeOptions === false || pageSize === Infinity) return sorted
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize, pageSizeOptions])

  const totalPages = useMemo(() => pageSizeOptions !== false && pageSize !== Infinity ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1, [sorted.length, pageSize, pageSizeOptions])

  const hasPagination = pageSizeOptions !== false && pageSize !== Infinity && totalPages > 1
  const hasToolbar = searchable || (pageSizeOptions !== false && Array.isArray(pageSizeOptions) && pageSizeOptions.length > 1)

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setPage(1) }, [])
  const handlePageSizeChange = useCallback((n: number) => { setPageSize(n); setPage(1) }, [])

  if (unstyled) {
    return (
      <div className={cn("w-full", className)}>
        {searchable && <input aria-label={searchPlaceholder} value={query} onChange={handleQueryChange} placeholder={searchPlaceholder} />}
        <table aria-label={ariaLabel} className={tableClassName}><tbody>{paginated.map(r => <tr key={r.id} onClick={onRowClick ? () => onRowClick(r) : undefined}>{columns.map(c => <td key={c.key}>{c.cell(r)}</td>)}</tr>)}</tbody></table>
      </div>
    )
  }

  return (
    <div className={cn("w-full min-w-0 max-w-full flex flex-col gap-3", className)}>
      {hasToolbar && (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-3", toolbarClassName)}>
          {searchable ? (
            <div className="relative flex-1 sm:max-w-xs">
              <svg aria-hidden="true" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input aria-label={searchPlaceholder} type="search" value={query} onChange={handleQueryChange} placeholder={searchPlaceholder} className="h-8 w-full rounded-[var(--radius-md)] border border-border bg-surface pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-accent-500 focus:outline-none focus:ring-[3px] focus:ring-focus-ring/25" />
            </div>
          ) : <div />}
          {pageSizeOptions !== false && Array.isArray(pageSizeOptions) && pageSizeOptions.length > 1 && (
            <RowsDropdown options={pageSizeOptions} value={pageSize} onChange={handlePageSizeChange} />
          )}
        </div>
      )}
      <div style={{ contain: "inline-size paint" }} className={cn("w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface", tableClassName)}>
        <div className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain scrollbar-thin">
        <table aria-label={ariaLabel} data-density={density} className="group/table w-full text-sm border-collapse">
          <thead className="border-b border-border bg-surface-muted">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" aria-sort={sortKey === col.key ? (sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none") : undefined} style={{ width: col.width }} className={cn("px-4 py-2.5 text-[11px] font-semibold text-muted-foreground group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2", alignClass[col.align ?? "left"])}>
                  {col.sortable ? <button type="button" className="inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring/35" onClick={() => handleSort(col.key)}>{col.header}<SortIcon dir={sortKey === col.key ? sortDir : null} /></button> : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />) : paginated.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">{query ? `No results for “${query}”` : emptyMessage}</td></tr>
            ) : paginated.map((row) => (
                <tr key={row.id} tabIndex={onRowClick ? 0 : undefined} aria-label={getRowLabel?.(row)} className={cn("transition-colors duration-100 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-focus-ring/35", onRowClick && "cursor-pointer")} onClick={onRowClick ? () => onRowClick(row) : undefined} onKeyDown={onRowClick ? (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onRowClick(row) } } : undefined}>
                  {columns.map((col) => (<td key={col.key} className={cn("px-4 py-3 text-sm tabular-nums text-foreground group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2", alignClass[col.align ?? "left"])}>{col.cell(row)}</td>))}
                </tr>
              ))}
          </tbody>
        </table>
        </div>
      </div>
      {(hasPagination || (!loading && sorted.length > 0)) && (
        <PaginationFooter loading={loading} sortedLength={sorted.length} pageSizeOptions={pageSizeOptions} pageSize={pageSize} page={page} totalPages={totalPages} hasPagination={hasPagination} setPage={setPage} />
      )}
    </div>
  )
}

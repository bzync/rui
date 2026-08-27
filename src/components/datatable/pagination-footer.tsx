import { cn } from "@/lib/cn"
import { iconButtonStyles } from "@/lib/component-styles"

export function PaginationFooter({
  loading, sortedLength, pageSizeOptions, pageSize, page, totalPages, hasPagination, setPage,
}: {
  loading: boolean
  sortedLength: number
  pageSizeOptions: number[] | false
  pageSize: number
  page: number
  totalPages: number
  hasPagination: boolean
  setPage: (p: number | ((prev: number) => number)) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>
        {loading ? "Loading…" : sortedLength === 0 ? "0 results" : (
          pageSizeOptions !== false && pageSize !== Infinity
            ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, sortedLength)} of ${sortedLength}`
            : `${sortedLength} row${sortedLength !== 1 ? "s" : ""}`
        )}
      </span>

      {hasPagination && (
        <nav aria-label="Table pagination" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage(1)}
            disabled={page === 1}
            className={cn(iconButtonStyles, "size-7 max-sm:hidden")}
            aria-label="First page"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={cn(iconButtonStyles, "size-7")}
            aria-label="Previous page"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let p: number
            if (totalPages <= 5) {
              p = i + 1
            } else if (page <= 3) {
              p = i + 1
            } else if (page >= totalPages - 2) {
              p = totalPages - 4 + i
            } else {
              p = page - 2 + i
            }
            return (
              <button
                type="button"
                key={p}
                onClick={() => setPage(p)}
                aria-label={`Page ${p}`}
                aria-current={page === p ? "page" : undefined}
                className={cn(
                  iconButtonStyles,
                  "size-7 text-xs font-medium",
                  page === p ? "bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300" : "text-muted-foreground",
                )}
              >
                {p}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={cn(iconButtonStyles, "size-7")}
            aria-label="Next page"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className={cn(iconButtonStyles, "size-7 max-sm:hidden")}
            aria-label="Last page"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m13 17 5-5-5-5" /><path d="m6 17 5-5-5-5" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  )
}

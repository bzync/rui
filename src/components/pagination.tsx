"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function buildPages(page: number, total: number, siblings: number): (number | "…")[] {
  if (total <= 7) return range(1, total)

  const left = Math.max(2, page - siblings)
  const right = Math.min(total - 1, page + siblings)

  const showLeftDots = left > 2
  const showRightDots = right < total - 1

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + siblings * 2), "…", total]
  }
  if (showLeftDots && !showRightDots) {
    return [1, "…", ...range(total - 2 - siblings * 2, total)]
  }
  return [1, "…", ...range(left, right), "…", total]
}

const chevronLeft = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const chevronRight = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = buildPages(page, totalPages, siblingCount)

  function btn(label: React.ReactNode, target: number, disabled: boolean, active = false) {
    return (
      <button
        key={typeof label === "number" ? label : `${label}-${target}`}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onPageChange(target)}
        aria-current={active ? "page" : undefined}
        aria-label={typeof label === "number" ? `Page ${label}` : target < page ? "Previous page" : "Next page"}
        className={cn(
          "flex items-center justify-center min-w-8 h-8 px-2 rounded-[var(--radius-md)] border text-sm font-medium transition-colors",
          focusRingStyles,
          active
            ? "border-accent-200 bg-accent-50 text-accent-700 dark:border-accent-500/20 dark:bg-accent-500/15 dark:text-accent-300"
            : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
          disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        )}
      >
        {label}
      </button>
    )
  }

  return (
    <nav className={cn("flex items-center gap-1", className)} aria-label="Pagination">
      {btn(chevronLeft, page - 1, page <= 1)}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="flex items-end justify-center w-8 h-8 text-slate-500 text-sm pb-1">
            …
          </span>
        ) : (
          btn(p, p, false, p === page)
        ),
      )}
      {btn(chevronRight, page + 1, page >= totalPages)}
    </nav>
  )
}

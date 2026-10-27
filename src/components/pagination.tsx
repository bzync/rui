"use client"
import { forwardRef } from "react"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { useControllableState } from "@/hooks/use-controllable-state"

export interface PaginationProps {
  /** Controlled one-based page. */
  page?: number
  /** Initial page when uncontrolled. */
  defaultPage?: number
  totalPages: number
  onPageChange?: (page: number) => void
  siblingCount?: number
  /** Button scale. */
  size?: "sm" | "md" | "lg"
  /** Disables every page button (e.g. while a page is loading). */
  disabled?: boolean
  className?: string
  /** Styles each page and arrow button. */
  itemClassName?: string
  /** Styles the current page button. */
  activeItemClassName?: string
}

const pageSizes = {
  sm: "min-w-7 h-7 px-1.5 text-xs",
  md: "min-w-8 h-8 px-2 text-sm",
  lg: "min-w-10 h-10 px-3 text-sm",
} as const

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

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination({
  page: controlledPage,
  defaultPage = 1,
  totalPages,
  onPageChange: onPageChangeProp,
  siblingCount = 1,
  size = "md",
  disabled: allDisabled = false,
  className,
  itemClassName,
  activeItemClassName,
}, ref) {
  const [page, onPageChange] = useControllableState({ value: controlledPage, defaultValue: defaultPage, onChange: onPageChangeProp })
  if (totalPages <= 1) return null

  const pages = buildPages(page, totalPages, siblingCount)

  function btn(label: React.ReactNode, target: number, edgeDisabled: boolean, active = false) {
    const disabled = edgeDisabled || allDisabled
    return (
      <button
        key={typeof label === "number" ? label : `${label}-${target}`}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onPageChange(target)}
        aria-current={active ? "page" : undefined}
        aria-label={typeof label === "number" ? `Page ${label}` : target < page ? "Previous page" : "Next page"}
        className={cn(
          "flex items-center justify-center rounded-[var(--radius-md)] border font-medium transition-colors",
          pageSizes[size],
          focusRingStyles,
          active
            ? "border-accent-500/25 bg-accent-500/10 text-accent-strong"
            : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
          disabled && "opacity-40 cursor-not-allowed pointer-events-none",
          itemClassName,
          active && activeItemClassName,
        )}
      >
        {label}
      </button>
    )
  }

  return (
    <nav ref={ref} className={cn("flex flex-wrap items-center gap-1", className)} aria-label="Pagination" aria-disabled={allDisabled || undefined}>
      {btn(chevronLeft, page - 1, page <= 1)}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className={cn("flex items-end justify-center pb-1 text-muted-foreground", pageSizes[size])}>
            …
          </span>
        ) : (
          btn(p, p, false, p === page)
        ),
      )}
      {btn(chevronRight, page + 1, page >= totalPages)}
    </nav>
  )
})
Pagination.displayName = "Pagination"

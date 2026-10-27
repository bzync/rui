import { cn } from "@/lib/cn"
import { HTMLAttributes, ReactNode, forwardRef } from "react"

// ─── Loading region ─────────────────────────────────────────────────────────────

/** `label` on composite skeletons: the announced text, or false for none. */
export type SkeletonLabel = string | false

export interface SkeletonRegionProps extends HTMLAttributes<HTMLDivElement> {
  /** Visually hidden text announced to screen readers. */
  label?: string
}

/**
 * Busy status region for a loading layout. Skeleton bars are aria-hidden, so
 * without this a screen-reader user hears nothing while content loads. Wrap a
 * page's skeletons in one region and pass `label={false}` to the composite
 * skeletons inside it so they don't each announce.
 */
export const SkeletonRegion = forwardRef<HTMLDivElement, SkeletonRegionProps>(function SkeletonRegion({ label = "Loading…", className, children, ...props }, ref) {
  return (
    <div ref={ref} role="status" aria-busy="true" aria-live="polite" className={className} {...props}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
})
SkeletonRegion.displayName = "SkeletonRegion"

/** Root props for a composite skeleton: a status region when labelled, hidden otherwise. */
function loadingRoot(label: SkeletonLabel | undefined): { props: HTMLAttributes<HTMLDivElement>; announce: ReactNode } {
  if (!label) return { props: { "aria-hidden": true }, announce: null }
  return {
    props: { role: "status", "aria-busy": true, "aria-live": "polite" },
    announce: <span className="sr-only">{label}</span>,
  }
}

// ─── Base skeleton ─────────────────────────────────────────────────────────────

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  rounded?: "sm" | "md" | "lg" | "full"
}

const roundedMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({
  className,
  width,
  height,
  rounded = "md",
  style,
  ...props
}, ref) {
  return (
    <div ref={ref}
      className={cn(
        "animate-pulse bg-muted",
        roundedMap[rounded],
        className,
      )}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  )
})
Skeleton.displayName = "Skeleton"
// ─── Text lines ─────────────────────────────────────────────────────────────────

export interface SkeletonTextProps {
  lines?: number
  className?: string
  lastLineWidth?: string
  /** Announce a loading status with this text. Off by default. */
  label?: SkeletonLabel
}

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText({
  lines = 3,
  className,
  lastLineWidth = "60%",
  label,
}, ref) {
  const root = loadingRoot(label)
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...root.props}>
      {root.announce}
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  )
})
SkeletonText.displayName = "SkeletonText"

// ─── Avatar skeleton ────────────────────────────────────────────────────────────

export interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const avatarSizes = { sm: 32, md: 36, lg: 44 }

export const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(function SkeletonAvatar({ size = "md", className }, ref) {
  const s = avatarSizes[size]
  return <Skeleton ref={ref} width={s} height={s} rounded="full" className={className} />
})
SkeletonAvatar.displayName = "SkeletonAvatar"

// ─── Card skeleton ──────────────────────────────────────────────────────────────

export interface SkeletonCardProps {
  lines?: number
  hasAvatar?: boolean
  hasFooter?: boolean
  className?: string
  /** Visually hidden loading announcement. Defaults to "Loading…"; false hides the skeleton from assistive tech entirely (use inside a `SkeletonRegion`). */
  label?: SkeletonLabel
}

export const SkeletonCard = forwardRef<HTMLDivElement, SkeletonCardProps>(function SkeletonCard({
  lines = 3,
  hasAvatar = false,
  hasFooter = false,
  className,
  label = "Loading…",
}, ref) {
  const root = loadingRoot(label)
  return (
    <div ref={ref}
      className={cn("rounded-[var(--radius-lg)] border border-border bg-surface", className)}
      {...root.props}
    >
      {root.announce}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        {hasAvatar && <SkeletonAvatar />}
        <div className="flex-1 space-y-1.5">
          <Skeleton height={14} width="40%" />
          <Skeleton height={11} width="25%" />
        </div>
      </div>
      <div className="px-5 py-4 space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            height={13}
            width={i === lines - 1 ? "65%" : "100%"}
          />
        ))}
      </div>
      {hasFooter && (
        <div className="flex items-center gap-2 border-t border-border px-5 py-3.5">
          <Skeleton height={28} width={72} rounded="lg" />
          <Skeleton height={28} width={72} rounded="lg" />
        </div>
      )}
    </div>
  )
})
SkeletonCard.displayName = "SkeletonCard"

// ─── Topbar skeleton ────────────────────────────────────────────────────────────

export interface SkeletonTopbarProps {
  hasBreadcrumb?: boolean
  hasAction?: boolean
  className?: string
  /** Announce a loading status with this text. Off by default. */
  label?: SkeletonLabel
}

export const SkeletonTopbar = forwardRef<HTMLDivElement, SkeletonTopbarProps>(function SkeletonTopbar({
  hasBreadcrumb = true,
  hasAction = true,
  className,
  label,
}, ref) {
  const root = loadingRoot(label)
  return (
    <div ref={ref}
      className={cn(
        "w-full px-4 py-3 sm:px-6 sm:py-4",
        "bg-surface/90",
        "border-b border-border",
        "sticky top-0 z-(--z-sticky)",
        className,
      )}
      {...root.props}
    >
      {root.announce}
      {hasBreadcrumb && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <Skeleton height={10} width={72} />
          <Skeleton height={10} width={6} rounded="full" />
          <Skeleton height={10} width={52} />
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton height={18} width={148} />
          <Skeleton height={11} width={196} />
        </div>
        {hasAction && <Skeleton height={30} width={100} rounded="lg" />}
      </div>
    </div>
  )
})
SkeletonTopbar.displayName = "SkeletonTopbar"

// ─── Table skeleton ─────────────────────────────────────────────────────────────

export interface SkeletonTableProps {
  rows?: number
  cols?: number
  density?: "compact" | "comfortable"
  className?: string
  /** Visually hidden loading announcement. Defaults to "Loading…"; false hides the skeleton from assistive tech entirely (use inside a `SkeletonRegion`). */
  label?: SkeletonLabel
}

export const SkeletonTable = forwardRef<HTMLDivElement, SkeletonTableProps>(function SkeletonTable({
  rows = 5,
  cols = 4,
  density = "comfortable",
  className,
  label = "Loading…",
}, ref) {
  const root = loadingRoot(label)
  return (
    <div ref={ref}
      data-density={density}
      className={cn("overflow-hidden rounded-[var(--radius-lg)] border border-border", className)}
      {...root.props}
    >
      {root.announce}
      <div className="flex items-center gap-4 border-b border-border bg-surface-muted px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height={11} width={`${50 + (i * 13) % 50}px`} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-none"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} height={13} width={`${55 + ((r + c) * 11) % 45}%`} />
          ))}
        </div>
      ))}
    </div>
  )
})
SkeletonTable.displayName = "SkeletonTable"
// ─── List skeleton ────────────────────────────────────────────────────────────

export interface SkeletonListProps {
  items?: number
  hasAvatar?: boolean
  density?: "compact" | "comfortable"
  className?: string
  /** Visually hidden loading announcement. Defaults to "Loading…"; false hides the skeleton from assistive tech entirely (use inside a `SkeletonRegion`). */
  label?: SkeletonLabel
}

export const SkeletonList = forwardRef<HTMLDivElement, SkeletonListProps>(function SkeletonList({
  items = 4,
  hasAvatar = false,
  density = "comfortable",
  className,
  label = "Loading…",
}, ref) {
  const py = density === "compact" ? "py-2" : "py-3"
  const root = loadingRoot(label)
  return (
    <div ref={ref} className={cn("divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface", className)} {...root.props}>
      {root.announce}
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className={cn("flex items-center gap-3 px-4", py)}>
          {hasAvatar && <SkeletonAvatar size="sm" />}
          <div className="flex-1 space-y-1.5">
            <Skeleton height={12} width={`${60 + (i * 7) % 30}%`} />
            <Skeleton height={10} width={`${40 + (i * 11) % 30}%`} />
          </div>
          <Skeleton height={20} width={48} rounded="full" />
        </div>
      ))}
    </div>
  )
})
SkeletonList.displayName = "SkeletonList"

// ─── Stat skeleton ────────────────────────────────────────────────────────────

export interface SkeletonStatProps {
  count?: number
  className?: string
  /** Visually hidden loading announcement. Defaults to "Loading…"; false hides the skeleton from assistive tech entirely (use inside a `SkeletonRegion`). */
  label?: SkeletonLabel
}

export const SkeletonStat = forwardRef<HTMLDivElement, SkeletonStatProps>(function SkeletonStat({ count = 3, className, label = "Loading…" }, ref) {
  const root = loadingRoot(label)
  return (
    <div ref={ref} className={cn("grid gap-4", count === 2 ? "grid-cols-2" : count === 4 ? "grid-cols-4" : "grid-cols-3", className)} {...root.props}>
      {root.announce}
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 space-y-3">
          <Skeleton height={10} width={64} />
          <Skeleton height={20} width={96} />
          <Skeleton height={10} width={120} />
        </div>
      ))}
    </div>
  )
})
SkeletonStat.displayName = "SkeletonStat"

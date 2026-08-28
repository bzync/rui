import { cn } from "@/lib/cn"
import { HTMLAttributes } from "react"

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

export function Skeleton({
  className,
  width,
  height,
  rounded = "md",
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
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
}
// ─── Text lines ─────────────────────────────────────────────────────────────────

export interface SkeletonTextProps {
  lines?: number
  className?: string
  lastLineWidth?: string
}

export function SkeletonText({
  lines = 3,
  className,
  lastLineWidth = "60%",
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  )
}

// ─── Avatar skeleton ────────────────────────────────────────────────────────────

export interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const avatarSizes = { sm: 32, md: 36, lg: 44 }

export function SkeletonAvatar({ size = "md", className }: SkeletonAvatarProps) {
  const s = avatarSizes[size]
  return <Skeleton width={s} height={s} rounded="full" className={className} />
}

// ─── Card skeleton ──────────────────────────────────────────────────────────────

export interface SkeletonCardProps {
  lines?: number
  hasAvatar?: boolean
  hasFooter?: boolean
  className?: string
}

export function SkeletonCard({
  lines = 3,
  hasAvatar = false,
  hasFooter = false,
  className,
}: SkeletonCardProps) {
  return (
    <div
      className={cn("rounded-[var(--radius-lg)] border border-border bg-surface", className)}
      aria-hidden="true"
    >
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
}

// ─── Topbar skeleton ────────────────────────────────────────────────────────────

export interface SkeletonTopbarProps {
  hasBreadcrumb?: boolean
  hasAction?: boolean
  className?: string
}

export function SkeletonTopbar({
  hasBreadcrumb = true,
  hasAction = true,
  className,
}: SkeletonTopbarProps) {
  return (
    <div
      className={cn(
        "w-full px-4 py-3 sm:px-6 sm:py-4",
        "bg-surface/90",
        "border-b border-border",
        "sticky top-0 z-30",
        className,
      )}
      aria-hidden="true"
    >
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
}

// ─── Table skeleton ─────────────────────────────────────────────────────────────

export interface SkeletonTableProps {
  rows?: number
  cols?: number
  density?: "compact" | "comfortable"
  className?: string
}

export function SkeletonTable({
  rows = 5,
  cols = 4,
  density = "comfortable",
  className,
}: SkeletonTableProps) {
  return (
    <div
      data-density={density}
      className={cn("overflow-hidden rounded-[var(--radius-lg)] border border-border", className)}
      aria-hidden="true"
    >
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
}
// ─── List skeleton ────────────────────────────────────────────────────────────

export interface SkeletonListProps {
  items?: number
  hasAvatar?: boolean
  density?: "compact" | "comfortable"
  className?: string
}

export function SkeletonList({
  items = 4,
  hasAvatar = false,
  density = "comfortable",
  className,
}: SkeletonListProps) {
  const py = density === "compact" ? "py-2" : "py-3"
  return (
    <div className={cn("divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface", className)} aria-hidden="true">
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
}

// ─── Stat skeleton ────────────────────────────────────────────────────────────

export interface SkeletonStatProps {
  count?: number
  className?: string
}

export function SkeletonStat({ count = 3, className }: SkeletonStatProps) {
  return (
    <div className={cn("grid gap-4", count === 2 ? "grid-cols-2" : count === 4 ? "grid-cols-4" : "grid-cols-3", className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 space-y-3">
          <Skeleton height={10} width={64} />
          <Skeleton height={20} width={96} />
          <Skeleton height={10} width={120} />
        </div>
      ))}
    </div>
  )
}

"use client"

import { cn } from "@/lib/cn"
import { type HTMLAttributes, type KeyboardEvent, type MouseEvent, forwardRef, useId, useRef, useState } from "react"
import { ChartTooltip, type TooltipState, visibleLabelAt } from "./shared"
import { ChartDataTable, ChartLegend, type ChartSeries, TooltipRows, niceTicks, seriesColor } from "./axis"

export interface AreaChartProps extends HTMLAttributes<HTMLElement> {
  labels: string[]
  series: ChartSeries[]
  /** Stacks series on top of each other (part-to-whole over time). */
  stacked?: boolean
  curve?: "smooth" | "linear"
  height?: number
  /** Number of y-axis intervals (approximate). Default 4. */
  ticks?: number
  formatValue?: (value: number) => string
  /** Max x-axis labels before thinning. Default 8. */
  maxLabels?: number
  /** Accessible summary; also captions the screen-reader data table. */
  ariaLabel?: string
  showLegend?: boolean
  className?: string
}

const toPath = (points: { x: number; y: number }[], curve: "smooth" | "linear") => {
  if (!points.length) return ""
  let d = `M${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    if (curve === "linear") d += ` L${b.x},${b.y}`
    else {
      // Control points share each endpoint's y: smooth, never overshoots the data.
      const cx = (a.x + b.x) / 2
      d += ` C${cx},${a.y} ${cx},${b.y} ${b.x},${b.y}`
    }
  }
  return d
}

/**
 * Area chart for one or more series over an ordered axis, optionally stacked.
 * Hover or focus the plot and use Left/Right to inspect a column: a crosshair
 * marks each series and the tooltip lists every value (and the stack total).
 */
export const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(function AreaChart({
  labels,
  series,
  stacked = false,
  curve = "smooth",
  height = 240,
  ticks: tickCount = 4,
  formatValue = (value) => value.toLocaleString(),
  maxLabels = 8,
  ariaLabel = "Area chart",
  showLegend = true,
  className,
  ...props
}, ref) {
  const [active, setActive] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const plotRef = useRef<HTMLDivElement>(null)
  const uid = useId().replace(/:/g, "")
  const n = labels.length

  // Cumulative tops per series when stacked.
  const tops = series.map((_, si) => labels.map((__, i) => (stacked ? series.slice(0, si + 1) : [series[si]]).reduce((sum, item) => sum + (item.data[i] ?? 0), 0)))
  const values = tops.flat()
  const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values), tickCount)
  const lo = ticks[0]
  const hi = ticks[ticks.length - 1]
  const xAt = (i: number) => (n <= 1 ? 50 : (i / (n - 1)) * 100)
  const yAt = (value: number) => 100 - ((value - lo) / (hi - lo)) * 100
  const isVisibleLabel = visibleLabelAt(n, maxLabels)

  const show = (index: number, clientX?: number, clientY?: number) => {
    setActive(index)
    const rect = plotRef.current?.getBoundingClientRect()
    if (!rect) return
    const rows = series.map((item, si) => ({ label: item.label, value: formatValue(item.data[index] ?? 0), color: seriesColor(si, item.color) })).reverse()
    const total = stacked && series.length > 1 ? formatValue(series.reduce((sum, item) => sum + (item.data[index] ?? 0), 0)) : undefined
    setTooltip({
      x: clientX ?? rect.left + (xAt(index) / 100) * rect.width,
      y: clientY ?? rect.top + 8,
      content: <TooltipRows title={labels[index]} rows={stacked ? rows : rows.reverse()} total={total} />,
    })
  }
  const hide = () => { setActive(null); setTooltip(null) }

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const index = Math.round(((event.clientX - rect.left) / rect.width) * (n - 1))
    show(Math.min(Math.max(index, 0), n - 1), event.clientX, event.clientY)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = active ?? -1
    let next: number | null = null
    if (event.key === "ArrowRight") next = Math.min(current + 1, n - 1)
    else if (event.key === "ArrowLeft") next = Math.max(current - 1, 0)
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = n - 1
    else if (event.key === "Escape") { hide(); return }
    if (next === null) return
    event.preventDefault()
    show(next)
  }

  return (
    <figure ref={ref} className={cn("grid w-full gap-3", className)} {...props}>
      {showLegend && <ChartLegend series={series} />}
      <div className="flex w-full select-none" style={{ height }}>
        {/* Y axis */}
        <div aria-hidden="true" className="relative mr-2 w-10 shrink-0 pb-6">
          <div className="relative h-full">
            {ticks.map((tick) => (
              <span key={tick} className="absolute right-0 -translate-y-1/2 text-[11px] tabular-nums text-muted-foreground" style={{ top: `${yAt(tick)}%` }}>{formatValue(tick)}</span>
            ))}
          </div>
        </div>
        <div className="relative min-w-0 flex-1 pb-6">
          <div
            ref={plotRef}
            role="img"
            aria-label={`${ariaLabel}. Use the arrow keys to read values.`}
            tabIndex={0}
            onMouseMove={onMove}
            onMouseLeave={hide}
            onFocus={() => show(active ?? n - 1)}
            onBlur={hide}
            onKeyDown={onKeyDown}
            className="relative h-full rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50"
          >
            {ticks.map((tick) => (
              <div key={tick} aria-hidden="true" className={cn("absolute inset-x-0 border-t", tick === 0 ? "border-border-strong" : "border-foreground/6")} style={{ top: `${yAt(tick)}%` }} />
            ))}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                {series.map((item, si) => (
                  <linearGradient key={si} id={`${uid}-area-${si}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={seriesColor(si, item.color)} stopOpacity={stacked ? 0.55 : 0.22} />
                    <stop offset="100%" stopColor={seriesColor(si, item.color)} stopOpacity={stacked ? 0.35 : 0.02} />
                  </linearGradient>
                ))}
              </defs>
              {series.map((item, si) => {
                const top = tops[si].map((value, i) => ({ x: xAt(i), y: yAt(value) }))
                const bottom = stacked && si > 0 ? tops[si - 1].map((value, i) => ({ x: xAt(i), y: yAt(value) })) : top.map((p) => ({ x: p.x, y: yAt(Math.max(lo, 0)) }))
                const line = toPath(top, curve)
                const base = toPath([...bottom].reverse(), curve).replace(/^M/, "L")
                return (
                  <g key={item.label}>
                    <path d={`${line} ${base} Z`} fill={`url(#${uid}-area-${si})`} />
                    <path d={line} fill="none" stroke={seriesColor(si, item.color)} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                  </g>
                )
              })}
            </svg>
            {active !== null && (
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 border-l border-foreground/25" style={{ left: `${xAt(active)}%` }}>
                {series.map((item, si) => (
                  <span key={item.label} className="absolute -left-[4.5px] size-2 -translate-y-1/2 rounded-full ring-2 ring-surface" style={{ top: `${yAt(tops[si][active])}%`, background: seriesColor(si, item.color) }} />
                ))}
              </div>
            )}
          </div>
          {/* X axis */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-5">
            {labels.map((label, i) => (isVisibleLabel(i) ? (
              <span key={`${label}-${i}`} className={cn("absolute whitespace-nowrap text-[11px] leading-5 text-muted-foreground", i === 0 ? "" : i === n - 1 ? "-translate-x-full" : "-translate-x-1/2")} style={{ left: `${xAt(i)}%` }}>{label}</span>
            ) : null))}
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{active === null ? "" : `${labels[active]}: ${series.map((item) => `${item.label} ${formatValue(item.data[active] ?? 0)}`).join(", ")}`}</p>
      <ChartDataTable caption={ariaLabel} labels={labels} series={series} formatValue={formatValue} />
      <ChartTooltip tooltip={tooltip} />
    </figure>
  )
})
AreaChart.displayName = "AreaChart"

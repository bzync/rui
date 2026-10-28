"use client"

import { cn } from "@/lib/cn"
import { type HTMLAttributes, type KeyboardEvent, forwardRef, useRef, useState } from "react"
import { ChartTooltip, type TooltipState, visibleLabelAt } from "./shared"
import { ChartDataTable, ChartLegend, type ChartSeries, TooltipRows, niceTicks, seriesColor } from "./axis"

export interface StackedBarChartProps extends HTMLAttributes<HTMLElement> {
  labels: string[]
  series: ChartSeries[]
  /** `stacked` sums series, `percent` normalizes each column to 100%, `grouped` places bars side by side. */
  mode?: "stacked" | "percent" | "grouped"
  height?: number
  ticks?: number
  formatValue?: (value: number) => string
  maxLabels?: number
  ariaLabel?: string
  showLegend?: boolean
  className?: string
}

/**
 * Column chart for several series per category: stacked totals, 100% shares,
 * or grouped comparisons. Values must be zero or positive. Hover a column, or
 * focus the chart and use Left/Right, to read every series in it.
 */
export const StackedBarChart = forwardRef<HTMLDivElement, StackedBarChartProps>(function StackedBarChart({
  labels,
  series,
  mode = "stacked",
  height = 240,
  ticks: tickCount = 4,
  formatValue = (value) => value.toLocaleString(),
  maxLabels = 12,
  ariaLabel = "Bar chart",
  showLegend = true,
  className,
  ...props
}, ref) {
  const [active, setActive] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const plotRef = useRef<HTMLDivElement>(null)
  const n = labels.length
  const value = (si: number, i: number) => Math.max(0, series[si].data[i] ?? 0)
  const totals = labels.map((_, i) => series.reduce((sum, __, si) => sum + value(si, i), 0))
  const percent = mode === "percent"
  const max = percent ? 100 : mode === "grouped" ? Math.max(0, ...series.flatMap((_, si) => labels.map((__, i) => value(si, i)))) : Math.max(0, ...totals)
  const ticks = percent ? [0, 25, 50, 75, 100] : niceTicks(0, max, tickCount)
  const hi = ticks[ticks.length - 1] || 1
  const pct = (v: number, i: number) => (percent ? (totals[i] ? (v / totals[i]) * 100 : 0) : (v / hi) * 100)
  const formatTick = (tick: number) => (percent ? `${tick}%` : formatValue(tick))
  const isVisibleLabel = visibleLabelAt(n, maxLabels)

  const show = (index: number, clientX?: number, clientY?: number) => {
    setActive(index)
    const rect = plotRef.current?.getBoundingClientRect()
    if (!rect) return
    const rows = series.map((item, si) => ({
      label: item.label,
      value: percent ? `${formatValue(value(si, index))} · ${Math.round(pct(value(si, index), index))}%` : formatValue(value(si, index)),
      color: seriesColor(si, item.color),
    }))
    setTooltip({
      x: clientX ?? rect.left + ((index + 0.5) / n) * rect.width,
      y: clientY ?? rect.top + 8,
      content: <TooltipRows title={labels[index]} rows={mode === "grouped" ? rows : rows.reverse()} total={mode !== "grouped" && series.length > 1 ? formatValue(totals[index]) : undefined} />,
    })
  }
  const hide = () => { setActive(null); setTooltip(null) }

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
        <div aria-hidden="true" className="relative mr-2 w-10 shrink-0 pb-6">
          <div className="relative h-full">
            {ticks.map((tick) => (
              <span key={tick} className="absolute right-0 translate-y-1/2 text-[11px] tabular-nums text-muted-foreground" style={{ bottom: `${(tick / hi) * 100}%` }}>{formatTick(tick)}</span>
            ))}
          </div>
        </div>
        <div className="relative min-w-0 flex-1 pb-6">
          <div
            ref={plotRef}
            role="img"
            aria-label={`${ariaLabel}. Use the arrow keys to read values.`}
            tabIndex={0}
            onMouseLeave={hide}
            onFocus={() => show(active ?? 0)}
            onBlur={hide}
            onKeyDown={onKeyDown}
            className="relative flex h-full items-end rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50"
          >
            {ticks.map((tick) => (
              <div key={tick} aria-hidden="true" className={cn("absolute inset-x-0 border-t", tick === 0 ? "border-border-strong" : "border-foreground/6")} style={{ bottom: `${(tick / hi) * 100}%` }} />
            ))}
            {labels.map((label, i) => (
              <div
                key={`${label}-${i}`}
                aria-hidden="true"
                onMouseMove={(event) => show(i, event.clientX, event.clientY)}
                className={cn("relative flex h-full min-w-0 flex-1 items-end justify-center transition-colors", active === i && "bg-foreground/4")}
              >
                {mode === "grouped" ? (
                  <div className="flex h-full w-[72%] max-w-16 items-end gap-[2px]">
                    {series.map((item, si) => (
                      <div key={item.label} className="flex-1 rounded-t-[4px] transition-[height] duration-300" style={{ height: `${pct(value(si, i), i)}%`, background: seriesColor(si, item.color) }} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full w-[60%] max-w-12 flex-col-reverse gap-[2px]">
                    {series.map((item, si) => {
                      const h = pct(value(si, i), i)
                      if (!h) return null
                      const topmost = series.slice(si + 1).every((_, k) => !value(si + 1 + k, i))
                      return <div key={item.label} className={cn("shrink-0 transition-[height] duration-300", topmost && "rounded-t-[4px]")} style={{ height: `calc(${h}% - 2px)`, background: seriesColor(si, item.color) }} />
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 flex h-5">
            {labels.map((label, i) => (
              <span key={`${label}-${i}`} className="flex-1 truncate text-center text-[11px] leading-5 text-muted-foreground">{isVisibleLabel(i) ? label : ""}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{active === null ? "" : `${labels[active]}: ${series.map((item, si) => `${item.label} ${formatValue(value(si, active))}`).join(", ")}`}</p>
      <ChartDataTable caption={ariaLabel} labels={labels} series={series} formatValue={formatValue} />
      <ChartTooltip tooltip={tooltip} />
    </figure>
  )
})
StackedBarChart.displayName = "StackedBarChart"

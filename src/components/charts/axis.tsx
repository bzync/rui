"use client"

import { cn } from "@/lib/cn"
import { CHART_SERIES } from "./shared"

/** Round tick values covering [min, max] (1, 2, 2.5 or 5 × 10ⁿ steps). */
export function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) max = min + 1
  const rough = (max - min) / count
  const power = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? rough
  const start = Math.floor(min / step) * step
  const ticks: number[] = []
  for (let value = start; value <= max + step * 0.5; value += step) ticks.push(Number(value.toFixed(10)))
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step)
  return ticks
}

/** Series color in fixed order (never cycled past the palette; extras reuse the last slot). */
export const seriesColor = (index: number, override?: string) => override ?? CHART_SERIES[Math.min(index, CHART_SERIES.length - 1)]

export interface ChartSeries {
  label: string
  data: number[]
  color?: string
}

export function ChartLegend({ series, className }: { series: ChartSeries[]; className?: string }) {
  if (series.length < 2) return null
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground", className)}>
      {series.map((item, index) => (
        <li key={item.label} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ background: seriesColor(index, item.color) }} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

/** Screen-reader table with every value, so the chart never relies on sight or color. */
export function ChartDataTable({ caption, labels, series, formatValue }: { caption: string; labels: string[]; series: ChartSeries[]; formatValue: (value: number) => string }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr><th scope="col">Label</th>{series.map((item) => <th key={item.label} scope="col">{item.label}</th>)}</tr>
      </thead>
      <tbody>
        {labels.map((label, index) => (
          <tr key={`${label}-${index}`}><th scope="row">{label}</th>{series.map((item) => <td key={item.label}>{formatValue(item.data[index] ?? 0)}</td>)}</tr>
        ))}
      </tbody>
    </table>
  )
}

export function TooltipRows({ title, rows, total }: { title: string; rows: { label: string; value: string; color: string }[]; total?: string }) {
  return (
    <div className="grid min-w-36 gap-1">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      {rows.map((row) => (
        <p key={row.label} className="flex items-center gap-2 text-xs">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-[2px]" style={{ background: row.color }} />
          <span className="text-muted-foreground">{row.label}</span>
          <span className="ml-auto pl-3 font-semibold tabular-nums text-foreground">{row.value}</span>
        </p>
      ))}
      {total !== undefined && (
        <p className="mt-0.5 flex border-t border-border pt-1 text-xs"><span className="text-muted-foreground">Total</span><span className="ml-auto font-semibold tabular-nums text-foreground">{total}</span></p>
      )}
    </div>
  )
}

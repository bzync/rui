"use client"

import { cn } from "@/lib/cn"
import { type HTMLAttributes, useState, forwardRef } from "react"
import { type TooltipState, ChartTooltip } from "./shared"

export interface HeatmapChartProps extends HTMLAttributes<HTMLDivElement> {
  data: number[][]
  rowLabels?: string[]
  colLabels?: string[]
  color?: string
  cellSize?: number
  className?: string
  formatValue?: (v: number) => string
  ariaLabel?: string
}

export const HeatmapChart = forwardRef<HTMLDivElement, HeatmapChartProps>(function HeatmapChart({
  data,
  rowLabels,
  colLabels,
  color = "var(--chart-1)",
  cellSize = 34,
  className,
  formatValue = String,
  ariaLabel,
  ...props
}, ref) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const flat = data.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat, 1)
  const range = max - min || 1

  const cellOpacity = (v: number) => 0.08 + ((v - min) / range) * 0.88

  const LABEL_W = rowLabels ? 56 : 0

  return (
    <div
      ref={ref}
      role="img"
      aria-label={ariaLabel ?? props["aria-label"] ?? "Heatmap chart"}
      className={cn("select-none overflow-x-auto", className)}
      {...props}
    >
      <div style={{ display: "inline-flex", flexDirection: "column", gap: 3 }}>
        {colLabels && (
          <div style={{ display: "flex", gap: 3, paddingLeft: LABEL_W + 3 }}>
            {colLabels.map((l, c) => (
              <div key={c} style={{ width: cellSize, flexShrink: 0 }}
                className="text-center text-xs text-muted-foreground leading-none truncate">
                {l}
              </div>
            ))}
          </div>
        )}
        {data.map((row, r) => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            {rowLabels && (
              <div style={{ width: LABEL_W, flexShrink: 0 }}
                className="text-xs text-muted-foreground text-right pr-2 leading-none truncate">
                {rowLabels[r]}
              </div>
            )}
            {row.map((v, c) => {
              const cellLabel = `${[rowLabels?.[r], colLabels?.[c]].filter(Boolean).join(" ") || `Row ${r + 1}, Column ${c + 1}`}: ${formatValue(v)}`
              const content = (
                <span>
                  {rowLabels?.[r] && <span className="text-tooltip-foreground/75 mr-1.5">{rowLabels[r]}</span>}
                  {colLabels?.[c] && <span className="text-tooltip-foreground/75 mr-2">{colLabels[c]}</span>}
                  <span className="font-semibold text-tooltip-foreground">{formatValue(v)}</span>
                </span>
              )
              return (
                <div
                  key={c}
                  data-heatmap-cell=""
                  tabIndex={0}
                  aria-label={cellLabel}
                  className="outline-none focus-visible:opacity-85"
                  style={{
                    width: cellSize, height: cellSize, flexShrink: 0,
                    backgroundColor: color,
                    opacity: cellOpacity(v),
                    borderRadius: 5, cursor: "pointer",
                    transition: "background-color 0.12s, opacity 0.12s",
                  }}
                  onMouseMove={(e) =>
                    setTooltip({
                      x: e.clientX, y: e.clientY,
                      content,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setTooltip({
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      content,
                    })
                  }}
                  onBlur={() => setTooltip(null)}
                />
              )
            })}
          </div>
        ))}
      </div>

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
})
HeatmapChart.displayName = "HeatmapChart"

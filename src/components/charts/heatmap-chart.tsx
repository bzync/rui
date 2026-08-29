"use client"

import { cn } from "@/lib/cn"
import { useState } from "react"
import { type TooltipState, ChartTooltip } from "./shared"

export interface HeatmapChartProps {
  data: number[][]
  rowLabels?: string[]
  colLabels?: string[]
  color?: string
  cellSize?: number
  className?: string
  formatValue?: (v: number) => string
}

export function HeatmapChart({
  data,
  rowLabels,
  colLabels,
  color = "var(--chart-1)",
  cellSize = 34,
  className,
  formatValue = String,
}: HeatmapChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const flat = data.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat, 1)
  const range = max - min || 1

  const cellOpacity = (v: number) => 0.08 + ((v - min) / range) * 0.88

  const LABEL_W = rowLabels ? 56 : 0

  return (
    <div className={cn("select-none overflow-x-auto", className)}>
      <div style={{ display: "inline-flex", flexDirection: "column", gap: 3 }}>
        {colLabels && (
          <div style={{ display: "flex", gap: 3, paddingLeft: LABEL_W + 3 }}>
            {colLabels.map((l, c) => (
              <div key={c} style={{ width: cellSize, flexShrink: 0 }}
                className="text-center text-xs text-slate-600 dark:text-slate-400 leading-none truncate">
                {l}
              </div>
            ))}
          </div>
        )}
        {data.map((row, r) => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            {rowLabels && (
              <div style={{ width: LABEL_W, flexShrink: 0 }}
                className="text-xs text-slate-600 dark:text-slate-400 text-right pr-2 leading-none truncate">
                {rowLabels[r]}
              </div>
            )}
            {row.map((v, c) => (
              <div key={c}
                data-heatmap-cell=""
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
                    content: (
                      <span>
                        {rowLabels?.[r] && <span className="text-slate-500 dark:text-slate-400 mr-1.5">{rowLabels[r]}</span>}
                        {colLabels?.[c] && <span className="text-slate-500 dark:text-slate-400 mr-2">{colLabels[c]}</span>}
                        <span className="font-semibold text-foreground">{formatValue(v)}</span>
                      </span>
                    ),
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}

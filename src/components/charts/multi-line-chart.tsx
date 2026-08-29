"use client"

import { cn } from "@/lib/cn"
import { motion } from "framer-motion"
import { useState, useId } from "react"
import { type TooltipState, ChartTooltip, visibleLabelAt, CHART_SERIES } from "./shared"

export interface MultiLineSeries {
  label: string
  color?: string
  data: number[]
}

export interface MultiLineChartProps {
  labels: string[]
  series: MultiLineSeries[]
  height?: number
  area?: boolean
  dots?: boolean
  gridLines?: number
  className?: string
  formatValue?: (v: number) => string
  /** Max number of x-axis labels to show before thinning them out evenly. Default 8. */
  maxLabels?: number
}

const DEFAULT_COLORS = CHART_SERIES

export function MultiLineChart({
  labels,
  series,
  height = 220,
  area = true,
  dots = true,
  gridLines = 4,
  className,
  formatValue = String,
  maxLabels = 8,
}: MultiLineChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const uid = useId().replace(/:/g, "")
  const allValues = series.flatMap((s) => s.data)
  const max = Math.max(...allValues, 1)
  const min = Math.min(...allValues, 0)
  const range = max - min || 1
  const n = labels.length
  const isVisibleLabel = visibleLabelAt(n, maxLabels)

  function pts(vals: number[]) {
    return vals.map((v, i) => ({
      x: n === 1 ? 50 : (i / (n - 1)) * 92 + 4,
      y: 90 - ((v - min) / range) * 80,
    }))
  }

  function buildPath(points: Array<{ x: number; y: number }>) {
    if (points.length < 2) return ""
    let d = `M${points[0].x},${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const cx = (p0.x + p1.x) / 2
      d += ` C${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`
    }
    return d
  }

  return (
    <div className={cn("relative w-full select-none", className)} style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible text-black dark:text-white">
        <defs>
          {series.map((s, i) => {
            const c = s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
            return (
              <linearGradient key={i} id={`${uid}-mlg-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity="0.2" />
                <stop offset="100%" stopColor={c} stopOpacity="0.01" />
              </linearGradient>
            )
          })}
        </defs>

        {Array.from({ length: gridLines + 1 }).map((_, i) => (
          <line key={i} x1="4" y1={(i / gridLines) * 84 + 4} x2="96" y2={(i / gridLines) * 84 + 4} stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.3" />
        ))}

        {series.map((s, si) => {
          const c = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length]
          const points = pts(s.data)
          const linePath = buildPath(points)
          const areaPath = linePath
            ? `${linePath} L${points[points.length - 1].x},92 L${points[0].x},92 Z`
            : ""
          return (
            <g key={si}>
              {area && areaPath && (
                <path d={areaPath} fill={`url(#${uid}-mlg-${si})`} style={{ pointerEvents: "none" }} />
              )}
              {linePath && (
                <motion.path
                  d={linePath}
                  fill="none"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: si * 0.1, duration: 0.7, ease: "easeOut" }}
                  style={{ stroke: c, pointerEvents: "none" }}
                />
              )}
              {dots && points.map((p, pi) => (
                <g key={pi}>
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r="1.2"
                    style={{ fill: c, pointerEvents: "none" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + si * 0.1 + pi * 0.02 }}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseMove={(e) =>
                      setTooltip({
                        x: e.clientX, y: e.clientY,
                        content: (
                          <span>
                            <span className="text-slate-500 dark:text-slate-400 mr-2">{labels[pi]} · {s.label}</span>
                            <span className="font-semibold" style={{ color: c }}>{formatValue(s.data[pi])}</span>
                          </span>
                        ),
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  />
                </g>
              ))}
            </g>
          )
        })}
      </svg>

      {/* X-axis labels — absolutely positioned, thinned to maxLabels so they never get squashed at high data densities */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 20 }}>
        {labels.map((l, i) => l && isVisibleLabel(i) ? (
          <span
            key={i}
            className="absolute text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap leading-5 select-none"
            style={{
              left: `${n === 1 ? 50 : (i / (n - 1)) * 92 + 4}%`,
              transform: "translateX(-50%)",
            }}
          >
            {l}
          </span>
        ) : null)}
      </div>

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}


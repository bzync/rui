"use client"

import { cn } from "@/lib/cn"
import { motion } from "framer-motion"
import { useState, useId } from "react"
import { type ChartDataPoint, type TooltipState, ChartTooltip, visibleLabelAt } from "./shared"

export interface LineChartProps {
  data: ChartDataPoint[]
  height?: number
  color?: string
  area?: boolean
  dots?: boolean
  gridLines?: number
  className?: string
  formatValue?: (v: number) => string
  smooth?: boolean
  showXLabels?: boolean
  /** Max number of x-axis labels to show before thinning them out evenly. Default 8. */
  maxLabels?: number
}

export function LineChart({
  data,
  height = 220,
  color = "var(--chart-1)",
  area = true,
  dots = true,
  gridLines = 4,
  className,
  formatValue = String,
  smooth = true,
  showXLabels = true,
  maxLabels = 8,
}: LineChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const uid = useId().replace(/:/g, "")
  const max = Math.max(...data.map((d) => d.value), 1)
  const min = Math.min(...data.map((d) => d.value), 0)
  const range = max - min || 1
  const n = data.length

  // Map data to SVG coords (viewBox 0 0 100 100)
  const pts = data.map((d, i) => ({
    x: n === 1 ? 50 : (i / (n - 1)) * 92 + 4,
    y: 90 - ((d.value - min) / range) * 80,
    d,
  }))

  // Build path
  function buildPath(points: typeof pts) {
    if (points.length === 0) return ""
    if (!smooth || points.length < 3) {
      return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
    }
    let d = `M${points[0].x},${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const cx = (p0.x + p1.x) / 2
      d += ` C${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`
    }
    return d
  }

  const linePath = buildPath(pts)
  const areaPath = linePath
    ? `${linePath} L${pts[pts.length - 1].x},92 L${pts[0].x},92 Z`
    : ""
  const isVisibleLabel = visibleLabelAt(n, maxLabels)

  return (
    <div className={cn("relative w-full select-none", className)} style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible text-black dark:text-white"
      >
        <defs>
          <linearGradient id={`${uid}-ag`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = (i / gridLines) * 84 + 4
          return (
            <line key={i} x1="4" y1={y} x2="96" y2={y} stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.3" />
          )
        })}

        {/* Area fill */}
        {area && areaPath && (
          <path d={areaPath} fill={`url(#${uid}-ag)`} style={{ pointerEvents: "none" }} />
        )}

        {/* Line */}
        {linePath && (
          <motion.path
            d={linePath}
            fill="none"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ stroke: color, pointerEvents: "none" }}
          />
        )}

        {/* Dots */}
        {dots && pts.map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="1.2"
              style={{ fill: color, pointerEvents: "none" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.03, duration: 0.2 }}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill="transparent"
              className="cursor-pointer"
              onMouseMove={(e) =>
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  content: (
                    <span>
                      <span className="text-slate-500 dark:text-slate-400 mr-2">{p.d.label}</span>
                      <span className="font-semibold text-foreground">{formatValue(p.d.value)}</span>
                    </span>
                  ),
                })
              }
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        ))}
      </svg>

      {/* X-axis labels — absolutely positioned at each data-point's x%, thinned to maxLabels so they never overlap */}
      {showXLabels && (
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 20 }}>
          {data.map((d, i) => d.label && isVisibleLabel(i) ? (
            <span
              key={i}
              className="absolute text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap leading-5 select-none"
              style={{
                left: `${n === 1 ? 50 : (i / (n - 1)) * 92 + 4}%`,
                transform: "translateX(-50%)",
              }}
            >
              {d.label}
            </span>
          ) : null)}
        </div>
      )}

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}


"use client"

import { cn } from "@/lib/cn"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { type HTMLAttributes, useRef, useState, forwardRef } from "react"
import { type TooltipState, ChartTooltip, CHART_SERIES } from "./shared"

export interface RadarSeries {
  label: string
  color?: string
  data: number[]
}

export interface RadarChartProps extends HTMLAttributes<HTMLDivElement> {
  axes: string[]
  series: RadarSeries[]
  size?: number
  gridLines?: number
  className?: string
  ariaLabel?: string
}

const RADAR_COLORS = CHART_SERIES

export const RadarChart = forwardRef<HTMLDivElement, RadarChartProps>(function RadarChart({
  axes,
  series,
  size = 240,
  gridLines = 4,
  className,
  ariaLabel,
  ...props
}, ref) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  // Axis labels are anchored outward, so long ones run past the 100×100 plot; grow the box to fit them.
  const [box, setBox] = useState({ x: 0, y: 0, w: 100, h: 100 })

  useIsomorphicLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg || typeof svg.getBBox !== "function") return
    const b = svg.getBBox()
    const x = Math.floor(Math.min(0, b.x - 1))
    const y = Math.floor(Math.min(0, b.y - 1))
    const next = {
      x,
      y,
      w: Math.ceil(Math.max(100, b.x + b.width + 1)) - x,
      h: Math.ceil(Math.max(100, b.y + b.height + 1)) - y,
    }
    setBox((prev) => (prev.x === next.x && prev.y === next.y && prev.w === next.w && prev.h === next.h ? prev : next))
  }, [axes])

  const n = axes.length
  const cx = 50
  const cy = 50
  const R = 38
  const labelR = 46

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2
  const point = (r: number, i: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  })

  const maxVal = Math.max(...series.flatMap((s) => s.data), 1)

  const seriesPath = (vals: number[]) =>
    vals.map((v, i) => {
      const { x, y } = point((v / maxVal) * R, i)
      return `${i === 0 ? "M" : "L"}${x},${y}`
    }).join(" ") + "Z"

  const svgLabel = ariaLabel ?? props["aria-label"] ?? "Radar chart"

  return (
    <div ref={ref} className={cn("inline-flex flex-col items-center gap-4", className)} {...props}>
      <svg ref={svgRef} role="img" aria-label={svgLabel} viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{ width: (size * box.w) / 100, height: (size * box.h) / 100 }} className="max-w-full text-foreground">
        {Array.from({ length: gridLines }).map((_, gi) => {
          const r = R * ((gi + 1) / gridLines)
          const pts = Array.from({ length: n }, (_, i) => point(r, i))
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z"
          return <path key={gi} d={d} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.4" />
        })}
        {axes.map((_, i) => {
          const { x, y } = point(R, i)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.4" />
        })}
        {series.map((s, si) => {
          const c = s.color ?? RADAR_COLORS[si % RADAR_COLORS.length]
          return (
            <g key={si}>
              <path d={seriesPath(s.data)} fill={c} fillOpacity="0.12"
                style={{ stroke: c, strokeWidth: 1.2, strokeOpacity: 0.85, strokeLinejoin: "round" as const }}
              />
              {s.data.map((v, i) => {
                const { x, y } = point((v / maxVal) * R, i)
                const content = (
                  <span>
                    <span className="text-tooltip-foreground/75 mr-2">{axes[i]}</span>
                    <span className="font-semibold" style={{ color: c }}>{v}</span>
                  </span>
                )
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="1.5"
                    tabIndex={0}
                    aria-label={`${s.label} ${axes[i]}: ${v}`}
                    className="outline-none focus-visible:opacity-85"
                    style={{ fill: c, fillOpacity: 0.9, cursor: "pointer" }}
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
            </g>
          )
        })}
        {axes.map((label, i) => {
          const { x, y } = point(labelR, i)
          const anchor = x < cx - 2 ? "end" : x > cx + 2 ? "start" : "middle"
          return (
            <text key={i} x={x} y={y} textAnchor={anchor} dominantBaseline="middle"
              fontSize="5.5" fill="currentColor" className="text-muted-foreground">
              {label}
            </text>
          )
        })}
      </svg>

      {series.length > 1 && (
        <div className="flex items-center gap-5">
          {series.map((s, si) => (
            <div key={si} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color ?? RADAR_COLORS[si % RADAR_COLORS.length] }} />
              <span className="text-sm text-foreground/80">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
})
RadarChart.displayName = "RadarChart"


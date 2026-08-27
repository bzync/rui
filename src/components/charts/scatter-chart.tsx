"use client"

import { cn } from "@/lib/cn"
import { useState } from "react"
import { type TooltipState, ChartTooltip } from "./shared"

export interface ScatterPoint {
  x: number
  y: number
  /** Dot radius multiplier (0.5–2). Default 1. */
  r?: number
  label?: string
  color?: string
}

export interface ScatterSeries {
  label: string
  color?: string
  data: ScatterPoint[]
}

export interface ScatterChartProps {
  series: ScatterSeries[]
  height?: number
  xLabel?: string
  yLabel?: string
  gridLines?: number
  className?: string
  formatX?: (v: number) => string
  formatY?: (v: number) => string
}

const SCATTER_COLORS = ["var(--color-accent-500)", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"]

export function ScatterChart({
  series,
  height = 260,
  xLabel,
  gridLines = 4,
  className,
  formatX = String,
  formatY = String,
}: ScatterChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const allX = series.flatMap((s) => s.data.map((p) => p.x))
  const allY = series.flatMap((s) => s.data.map((p) => p.y))
  const xMin = Math.min(...allX)
  const xMax = Math.max(...allX)
  const yMin = Math.min(...allY)
  const yMax = Math.max(...allY)
  const xRange = xMax - xMin || 1
  const yRange = yMax - yMin || 1

  // SVG coordinate space: x 8→96, y 6→88 (matches grid below)
  const PLOT_X0 = 8, PLOT_X1 = 96, PLOT_Y0 = 6, PLOT_Y1 = 88
  const PLOT_W = PLOT_X1 - PLOT_X0
  const PLOT_H = PLOT_Y1 - PLOT_Y0

  // Convert data value → % of container (SVG is preserveAspectRatio=none, so 1 SVG unit = 1%)
  const toPct = (x: number, y: number) => ({
    left: PLOT_X0 + ((x - xMin) / xRange) * PLOT_W,  // already in %
    top:  PLOT_Y0 + ((yMax - y) / yRange) * PLOT_H,
  })

  return (
    <div className={cn("relative w-full select-none", className)} style={{ height }}>
      {/* Background: gridlines + axes only (no circles — preserveAspectRatio=none distorts SVG circles into ellipses) */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full text-black dark:text-white">
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const gy = PLOT_Y0 + (i / gridLines) * PLOT_H
          const gx = PLOT_X0 + (i / gridLines) * PLOT_W
          return (
            <g key={i}>
              <line x1={PLOT_X0} y1={gy} x2={PLOT_X1} y2={gy} stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.35" />
              <line x1={gx} y1={PLOT_Y0} x2={gx} y2={PLOT_Y1} stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.35" />
            </g>
          )
        })}
        <line x1={PLOT_X0} y1={PLOT_Y1} x2={PLOT_X1} y2={PLOT_Y1} stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.4" />
        <line x1={PLOT_X0} y1={PLOT_Y0} x2={PLOT_X0} y2={PLOT_Y1} stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.4" />
      </svg>

      {/* Dots as absolutely-positioned divs — CSS border-radius:50% = perfect circle regardless of container aspect ratio */}
      {series.map((s, si) => {
        const c = s.color ?? SCATTER_COLORS[si % SCATTER_COLORS.length]
        return s.data.map((p, pi) => {
          const { left, top } = toPct(p.x, p.y)
          const diameter = (p.r ?? 1) * 10  // px
          const key = `${si}-${pi}`
          const isHov = hovered === key
          return (
            <div
              key={key}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: `${top}%`,
                width: diameter,
                height: diameter,
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: p.color ?? c,
                opacity: hovered && !isHov ? 0.2 : 0.85,
                outline: isHov ? "2px solid rgba(255,255,255,0.55)" : "none",
                outlineOffset: 2,
                cursor: "pointer",
                transition: "opacity 0.12s",
                zIndex: isHov ? 10 : 1,
              }}
              onMouseEnter={() => setHovered(key)}
              onMouseMove={(e) =>
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  content: (
                    <span>
                      {(p.label || s.label) && (
                        <span className="text-slate-500 dark:text-slate-400 mr-2">{p.label ?? s.label}</span>
                      )}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ({formatX(p.x)}, {formatY(p.y)})
                      </span>
                    </span>
                  ),
                })
              }
              onMouseLeave={() => { setHovered(null); setTooltip(null) }}
            />
          )
        })
      })}

      {xLabel && (
        <div className="absolute bottom-0 left-0 right-0 text-center pointer-events-none">
          <span className="text-xs text-slate-600 dark:text-slate-400">{xLabel}</span>
        </div>
      )}

      {series.length > 1 && (
        <div className="absolute top-2 right-2 flex flex-col gap-2 pointer-events-none">
          {series.map((s, si) => (
            <div key={si} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color ?? SCATTER_COLORS[si % SCATTER_COLORS.length] }} />
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}


"use client"

import { cn } from "@/lib/cn"
import { useState } from "react"
import { type TooltipState, ChartTooltip, CHART_SERIES } from "./shared"

export interface RadarSeries {
  label: string
  color?: string
  data: number[]
}

export interface RadarChartProps {
  axes: string[]
  series: RadarSeries[]
  size?: number
  gridLines?: number
  className?: string
}

const RADAR_COLORS = CHART_SERIES

export function RadarChart({
  axes,
  series,
  size = 240,
  gridLines = 4,
  className,
}: RadarChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

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

  return (
    <div className={cn("inline-flex flex-col items-center gap-4", className)}>
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="text-black dark:text-white">
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
                return (
                  <circle key={i} cx={x} cy={y} r="1.5"
                    style={{ fill: c, fillOpacity: 0.9, cursor: "pointer" }}
                    onMouseMove={(e) =>
                      setTooltip({
                        x: e.clientX, y: e.clientY,
                        content: (
                          <span>
                            <span className="text-slate-500 dark:text-slate-400 mr-2">{axes[i]}</span>
                            <span className="font-semibold" style={{ color: c }}>{v}</span>
                          </span>
                        ),
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
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
              fontSize="5.5" fill="currentColor" className="text-slate-600 dark:text-slate-400">
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
              <span className="text-sm text-slate-600 dark:text-slate-300">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}


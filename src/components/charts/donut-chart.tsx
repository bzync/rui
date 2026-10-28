"use client"

import { cn } from "@/lib/cn"
import { motion } from "@/lib/motion-components"
import { type HTMLAttributes, type ReactNode, useState, forwardRef } from "react"
import { type ChartDataPoint, type TooltipState, ChartTooltip, CHART_SERIES } from "./shared"

export interface DonutChartProps extends HTMLAttributes<HTMLDivElement> {
  data: ChartDataPoint[]
  size?: number
  thickness?: number
  centerLabel?: ReactNode
  className?: string
  ariaLabel?: string
}

const DONUT_COLORS = CHART_SERIES

export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(function DonutChart({
  data,
  size = 190,
  thickness = 28,
  centerLabel,
  className,
  ariaLabel,
  ...props
}, ref) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const r = 50 - thickness / 2
  const cx = 50
  const cy = 50
  const circumference = 2 * Math.PI * r

  let cumulative = 0
  const segments = data.map((d, i) => {
    const frac = d.value / total
    const offset = cumulative
    cumulative += frac
    return {
      ...d,
      frac,
      offset,
      color: d.color ?? DONUT_COLORS[i % DONUT_COLORS.length],
    }
  })

  const svgLabel = ariaLabel ?? props["aria-label"] ?? "Donut chart"

  return (
    <div ref={ref} className={cn("inline-flex flex-col items-center gap-5", className)} {...props}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg role="img" aria-label={svgLabel} viewBox="0 0 100 100" className="w-full h-full -rotate-90 text-foreground">
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.07"
            strokeWidth={thickness / 2}
          />
          {/* Segments */}
          {segments.map((seg, i) => {
            const dash = seg.frac * circumference
            const gap = circumference - dash
            const rotateOffset = seg.offset * 360
            const pctText = `${(seg.frac * 100).toFixed(1)}%`
            const content = (
              <span>
                <span className="text-tooltip-foreground/75 mr-2">{seg.label}</span>
                <span className="font-semibold text-tooltip-foreground">{seg.value}</span>
                <span className="text-tooltip-foreground/75 ml-1.5">({pctText})</span>
              </span>
            )

            return (
              <motion.circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={hovered === i ? thickness / 2 + 1.5 : thickness / 2}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={0}
                transform={`rotate(${rotateOffset} ${cx} ${cy})`}
                tabIndex={0}
                aria-label={`${seg.label}: ${seg.value} (${pctText})`}
                style={{
                  strokeOpacity: hovered !== null && hovered !== i ? 0.35 : 0.9,
                  transition: "stroke-opacity 0.15s, stroke-width 0.15s",
                  pointerEvents: "all",
                }}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${dash} ${gap}` }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                onMouseMove={(e) => {
                  setHovered(i)
                  setTooltip({
                    x: e.clientX, y: e.clientY,
                    content,
                  })
                }}
                onMouseLeave={() => { setHovered(null); setTooltip(null) }}
                onFocus={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setHovered(i)
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    content,
                  })
                }}
                onBlur={() => { setHovered(null); setTooltip(null) }}
                className="cursor-pointer outline-none focus-visible:opacity-85"
              />
            )
          })}
        </svg>

        {centerLabel && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {centerLabel}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-sm text-muted-foreground">{seg.label}</span>
          </div>
        ))}
      </div>

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
})
DonutChart.displayName = "DonutChart"


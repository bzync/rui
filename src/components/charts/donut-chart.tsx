"use client"

import { cn } from "@/lib/cn"
import { motion } from "framer-motion"
import { type ReactNode, useState } from "react"
import { type ChartDataPoint, type TooltipState, ChartTooltip, CHART_SERIES } from "./shared"

export interface DonutChartProps {
  data: ChartDataPoint[]
  size?: number
  thickness?: number
  centerLabel?: ReactNode
  className?: string
}

const DONUT_COLORS = CHART_SERIES

export function DonutChart({
  data,
  size = 190,
  thickness = 28,
  centerLabel,
  className,
}: DonutChartProps) {
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

  return (
    <div className={cn("inline-flex flex-col items-center gap-5", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 text-black dark:text-white">
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
                    content: (
                      <span>
                        <span className="text-slate-500 dark:text-slate-400 mr-2">{seg.label}</span>
                        <span className="font-semibold text-foreground">{seg.value}</span>
                        <span className="text-slate-500 ml-1.5">({(seg.frac * 100).toFixed(1)}%)</span>
                      </span>
                    ),
                  })
                }}
                onMouseLeave={() => { setHovered(null); setTooltip(null) }}
                className="cursor-pointer"
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
            <span className="text-sm text-slate-500">{seg.label}</span>
          </div>
        ))}
      </div>

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}


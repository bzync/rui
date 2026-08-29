"use client"

import { cn } from "@/lib/cn"
import { useEffect, useId, useState } from "react"
import { type TooltipState, ChartTooltip, CHART_POSITIVE, CHART_NEGATIVE } from "./shared"

export interface WaterfallItem {
  label: string
  value: number
  /** If true, renders as a full summary bar from zero. */
  total?: boolean
  color?: string
}

export interface WaterfallChartProps {
  data: WaterfallItem[]
  height?: number
  className?: string
  formatValue?: (v: number) => string
}

export function WaterfallChart({
  data,
  height = 240,
  className,
  formatValue = String,
}: WaterfallChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const uid = useId().replace(/:/g, "")

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  let running = 0
  const bars = data.map((d) => {
    const base = d.total ? 0 : running
    if (!d.total) running += d.value
    const end = d.total ? running : base + d.value
    return { ...d, base, end, color: d.color ?? (d.total ? "var(--color-slate-500)" : d.value >= 0 ? CHART_POSITIVE : CHART_NEGATIVE) }
  })

  const allVals = bars.flatMap((b) => [b.base, b.end])
  const minVal = Math.min(...allVals, 0)
  const maxVal = Math.max(...allVals, 1)
  const range = maxVal - minVal || 1

  const BASELINE_Y = 88
  const TOP_PAD = 6
  const CHART_H = BASELINE_Y - TOP_PAD
  const toY = (v: number) => TOP_PAD + ((maxVal - v) / range) * CHART_H

  const barW = 100 / bars.length
  const barPad = barW * 0.2
  const barPct = barW - barPad * 2

  return (
    <div className={cn("relative w-full select-none", className)} style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full text-slate-900 dark:text-white">
        <defs>
          {bars.map((b, i) => (
            <linearGradient key={i} id={`${uid}-wf-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={b.color} stopOpacity="1" />
              <stop offset="100%" stopColor={b.color} stopOpacity="0.5" />
            </linearGradient>
          ))}
        </defs>

        {minVal < 0 && (
          <line x1="0" y1={toY(0)} x2="100" y2={toY(0)}
            stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.4" strokeDasharray="2 2" />
        )}
        {[0.25, 0.5, 0.75].map((t, i) => (
          <line key={i} x1="0" y1={TOP_PAD + t * CHART_H} x2="100" y2={TOP_PAD + t * CHART_H}
            stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.35" />
        ))}

        {bars.map((b, i) => {
          if (i === bars.length - 1) return null
          const x2 = (i + 1) * barW + barPad
          const x1 = i * barW + barPad + barPct
          const y = toY(b.end)
          return <line key={i} x1={x1} y1={y} x2={x2} y2={y}
            stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.35" strokeDasharray="1.5 1" />
        })}

        {bars.map((b, i) => {
          const top = toY(Math.max(b.base, b.end))
          const bot = toY(Math.min(b.base, b.end))
          const barH = Math.max(bot - top, 0.5)
          const x = i * barW + barPad
          const dur = 0.4
          const delay = i * 0.05
          return (
            <rect key={i} x={x} width={barPct} rx="1.2"
              y={ready ? top : bot}
              height={ready ? barH : 0}
              onMouseEnter={() => setHovered(i)}
              onMouseMove={(e) =>
                setTooltip({
                  x: e.clientX, y: e.clientY,
                  content: (
                    <span>
                      <span className="text-slate-500 dark:text-slate-400 mr-2">{b.label}</span>
                      <span className="font-semibold" style={{ color: b.color }}>
                        {b.value >= 0 && !b.total ? "+" : ""}{formatValue(b.value)}
                      </span>
                    </span>
                  ),
                })
              }
              onMouseLeave={() => { setHovered(null); setTooltip(null) }}
              className="cursor-pointer"
              style={{
                fill: `url(#${uid}-wf-${i})`,
                fillOpacity: hovered !== null && hovered !== i ? 0.35 : 1,
                transition: ready
                  ? `y ${dur}s ${delay}s cubic-bezier(0.25,0.46,0.45,0.94), height ${dur}s ${delay}s cubic-bezier(0.25,0.46,0.45,0.94), fill-opacity 0.12s`
                  : "none",
              }}
            />
          )
        })}

        <line x1="0" y1={BASELINE_Y} x2="100" y2={BASELINE_Y}
          stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.35" />
      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex" style={{ height: 20 }}>
        {bars.map((b, i) => (
          <div key={i} className={cn(
            "flex-1 text-center text-xs truncate px-1 leading-5",
            b.total ? "text-slate-500 dark:text-slate-400 font-medium" : "text-slate-500",
          )}>
            {b.label}
          </div>
        ))}
      </div>

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}

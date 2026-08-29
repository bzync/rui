"use client"

import { cn } from "@/lib/cn"
import { useState, useId, useEffect } from "react"
import { type ChartDataPoint, type TooltipState, ChartTooltip } from "./shared"

// ─── BarChart ─────────────────────────────────────────────────────────────────

export interface BarChartProps {
  data: ChartDataPoint[]
  height?: number
  /** Color applied to all bars unless each data point specifies its own */
  color?: string
  /** Show value label on each bar */
  showValues?: boolean
  /** Number of gridlines */
  gridLines?: number
  /** "vertical" (default) = columns; "horizontal" = rows */
  orientation?: "vertical" | "horizontal"
  className?: string
  formatValue?: (v: number) => string
}

export function BarChart({
  data,
  height = 220,
  color = "var(--chart-1)",
  showValues = false,
  gridLines = 4,
  orientation = "vertical",
  className,
  formatValue = String,
}: BarChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const uid = useId().replace(/:/g, "")
  const max = Math.max(...data.map((d) => d.value), 1)

  // Trigger CSS transitions on the frame after initial paint
  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (orientation === "horizontal") {
    return (
      <HorizontalBarChart
        data={data}
        height={height}
        color={color}
        showValues={showValues}
        gridLines={gridLines}
        className={className}
        formatValue={formatValue}
      />
    )
  }

  // SVG coordinate constants (viewBox 0 0 100 100, preserveAspectRatio=none)
  const BASELINE = 88
  const TOP_PAD = 6
  const CHART_H = BASELINE - TOP_PAD  // 82 usable SVG units

  const barW = 100 / data.length
  const barPad = barW * 0.18
  const barPct = barW - barPad * 2

  const svgYtoPx = (svgY: number) => (svgY / 100) * height

  return (
    <div className={cn("relative w-full select-none", className)} style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full text-black dark:text-white">
        <defs>
          {data.map((d, i) => {
            const c = d.color ?? color
            return (
              <linearGradient key={i} id={`${uid}-bcg-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={c} stopOpacity="1" />
                <stop offset="100%" stopColor={c} stopOpacity="0.45" />
              </linearGradient>
            )
          })}
        </defs>

        {/* Gridlines */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = TOP_PAD + (i / gridLines) * CHART_H
          return (
            <line key={i} x1="0" y1={y} x2="100" y2={y}
              stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.35" />
          )
        })}

        {/* Bars — CSS transitions on SVG geometry props (framer-motion v12 mishandles SVG user units) */}
        {data.map((d, i) => {
          const barH = Math.max((d.value / max) * CHART_H, d.value > 0 ? 0.5 : 0)
          const x = i * barW + barPad
          const y = BASELINE - barH
          const dur = 0.45
          const delay = i * 0.05
          return (
            <rect
              key={i}
              x={x}
              width={barPct}
              rx="1.2"
              y={ready ? y : BASELINE}
              height={ready ? barH : 0}
              onMouseEnter={() => setHovered(i)}
              onMouseMove={(e) =>
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  content: (
                    <span>
                      <span className="text-slate-500 dark:text-slate-400 mr-2">{d.label}</span>
                      <span className="font-semibold text-foreground">{formatValue(d.value)}</span>
                    </span>
                  ),
                })
              }
              onMouseLeave={() => { setHovered(null); setTooltip(null) }}
              className="cursor-pointer"
              style={{
                fill: `url(#${uid}-bcg-${i})`,
                fillOpacity: hovered !== null && hovered !== i ? 0.35 : 1,
                transition: ready
                  ? `y ${dur}s ${delay}s cubic-bezier(0.25,0.46,0.45,0.94), height ${dur}s ${delay}s cubic-bezier(0.25,0.46,0.45,0.94), fill-opacity 0.12s`
                  : "none",
              }}
            />
          )
        })}

        {/* Baseline */}
        <line x1="0" y1={BASELINE} x2="100" y2={BASELINE}
          stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.35" />
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex" style={{ height: 20 }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-xs text-slate-500 truncate px-1 leading-5">
            {d.label}
          </div>
        ))}
      </div>

      {/* Value labels — pixel-accurate via SVG→px coordinate mapping */}
      {showValues && (
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ bottom: 20 }}>
          {data.map((d, i) => {
            const pct = d.value / max
            const barTopPx = svgYtoPx(TOP_PAD + (1 - pct) * CHART_H)
            return (
              <div
                key={i}
                className="absolute flex justify-center"
                style={{
                  left: `${(i / data.length) * 100}%`,
                  width: `${100 / data.length}%`,
                  top: barTopPx,
                  transform: "translateY(calc(-100% - 4px))",
                }}
              >
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-none tabular-nums">
                  {formatValue(d.value)}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}


// ─── HorizontalBarChart (internal — used via BarChart orientation="horizontal") ─
// Pure HTML/CSS layout: [label col] [bar track] — avoids SVG label-over-bar overlap

function HorizontalBarChart({
  data,
  color,
  showValues,
  className,
  formatValue = String,
}: Omit<BarChartProps, "orientation">) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const max = Math.max(...data.map((d) => d.value), 1)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={cn("w-full select-none flex flex-col gap-2.5", className)}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100
        const c = d.color ?? color ?? "var(--chart-1)"
        const isHov = hovered === i
        return (
          <div key={i} className="flex items-center gap-3">
            {/* Label — fixed width so bars all start at the same x */}
            <span className="text-xs text-slate-600 dark:text-slate-300 text-right shrink-0 leading-none" style={{ width: 64 }}>
              {d.label}
            </span>

            {/* Bar track */}
            <div className="flex-1 h-8 relative rounded-md bg-black/5 dark:bg-white/5 overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 rounded-md cursor-pointer"
                style={{
                  width: ready ? `${pct}%` : 0,
                  background: `linear-gradient(90deg, ${c}70, ${c})`,
                  opacity: hovered !== null && !isHov ? 0.35 : 1,
                  outline: isHov ? `1.5px solid ${c}` : "none",
                  outlineOffset: -1,
                  transition: ready
                    ? `width 0.45s ${i * 0.05}s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.12s`
                    : "none",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseMove={(e) =>
                  setTooltip({
                    x: e.clientX, y: e.clientY,
                    content: (
                      <span>
                        <span className="text-slate-500 dark:text-slate-400 mr-2">{d.label}</span>
                        <span className="font-semibold text-foreground">{formatValue(d.value)}</span>
                      </span>
                    ),
                  })
                }
                onMouseLeave={() => { setHovered(null); setTooltip(null) }}
              />

              {/* Value label — sits to the right of the bar end */}
              {showValues && (
                <div
                  className="absolute top-0 bottom-0 flex items-center pointer-events-none"
                  style={{ left: `${pct}%`, paddingLeft: 8 }}
                >
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">
                    {formatValue(d.value)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}


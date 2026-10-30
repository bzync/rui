"use client"

import { cn } from "@/lib/cn"
import { type HTMLAttributes, useEffect, useState, forwardRef } from "react"
import { type ChartDataPoint, type TooltipState, ChartTooltip, CHART_SEQUENTIAL } from "./shared"

export interface FunnelChartProps extends HTMLAttributes<HTMLDivElement> {
  data: ChartDataPoint[]
  height?: number
  className?: string
  formatValue?: (v: number) => string
  ariaLabel?: string
}

const FUNNEL_COLORS = CHART_SEQUENTIAL

export const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>(function FunnelChart({
  data,
  height: _height,
  className,
  formatValue = String,
  ariaLabel,
  ...props
}, ref) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const max = Math.max(...data.map((d) => d.value), 1)
  const MIN_W_PCT = 18  // narrowest bar as % of container

  return (
    <div
      ref={ref}
      role="img"
      aria-label={ariaLabel ?? props["aria-label"] ?? "Funnel chart"}
      className={cn("w-full select-none flex flex-col gap-2", className)}
      {...props}
    >
      {data.map((d, i) => {
        const pct = d.value / max
        const barW = MIN_W_PCT + pct * (100 - MIN_W_PCT)  // % of container
        const c = d.color ?? FUNNEL_COLORS[i % FUNNEL_COLORS.length]
        const isHov = hovered === i
        const dropPct = i > 0 ? ((d.value / data[0].value) * 100).toFixed(0) : null
        const content = (
          <span>
            <span className="text-tooltip-foreground/75 mr-2">{d.label}</span>
            <span className="font-semibold text-tooltip-foreground">{formatValue(d.value)}</span>
            {dropPct && (
              <span className="text-tooltip-foreground/75 ml-2">{dropPct}% of total</span>
            )}
          </span>
        )

        return (
          <div key={i} className="flex items-center gap-3">
            {/* Label — fixed-width column so bars all align to the same centre */}
            <span className="text-sm text-foreground font-[500] text-right shrink-0 leading-none truncate" style={{ width: 80 }}>
              {d.label}
            </span>

            {/* Bar — centred, width proportional to value */}
            <div className="flex-1 flex justify-center">
              <div
                tabIndex={0}
                aria-label={`${d.label}: ${formatValue(d.value)}${dropPct ? ` (${dropPct}% of total)` : ""}`}
                className="relative h-10 rounded-md flex items-center justify-center cursor-pointer outline-none focus-visible:opacity-85"
                style={{
                  width: ready ? `${barW}%` : `${MIN_W_PCT}%`,
                  backgroundColor: c,
                  opacity: hovered !== null && !isHov ? 0.3 : isHov ? 1 : 0.78,
                  boxShadow: isHov ? `0 0 0 2px color-mix(in srgb, ${c} 53%, transparent)` : "none",
                  transition: ready
                    ? `width 0.45s ${i * 0.06}s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.12s, box-shadow 0.12s`
                    : "none",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseMove={(e) =>
                  setTooltip({
                    x: e.clientX, y: e.clientY,
                    content,
                  })
                }
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
              />
            </div>

            {/* Value + drop-off */}
            <div className="shrink-0 text-right" style={{ width: 80 }}>
              <span className="text-sm font-semibold text-foreground tabular-nums leading-none">
                {formatValue(d.value)}
              </span>
              {dropPct && (
                <span className="ml-2 text-xs text-muted-foreground tabular-nums">{dropPct}%</span>
              )}
            </div>
          </div>
        )
      })}

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
})
FunnelChart.displayName = "FunnelChart"


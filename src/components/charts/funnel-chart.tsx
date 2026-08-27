"use client"

import { cn } from "@/lib/cn"
import { useEffect, useState } from "react"
import { type ChartDataPoint, type TooltipState, ChartTooltip } from "./shared"

export interface FunnelChartProps {
  data: ChartDataPoint[]
  height?: number
  className?: string
  formatValue?: (v: number) => string
}

const FUNNEL_COLORS = ["var(--color-accent-500)", "#6366f1", "#8b5cf6", "#a855f7", "#c084fc"]

export function FunnelChart({
  data,
  className,
  formatValue = String,
}: FunnelChartProps) {
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
    <div className={cn("w-full select-none flex flex-col gap-2", className)}>
      {data.map((d, i) => {
        const pct = d.value / max
        const barW = MIN_W_PCT + pct * (100 - MIN_W_PCT)  // % of container
        const c = d.color ?? FUNNEL_COLORS[i % FUNNEL_COLORS.length]
        const isHov = hovered === i
        const dropPct = i > 0 ? ((d.value / data[0].value) * 100).toFixed(0) : null

        return (
          <div key={i} className="flex items-center gap-3">
            {/* Label — fixed-width column so bars all align to the same centre */}
            <span className="text-sm text-slate-800 dark:text-slate-100 font-[500] text-right shrink-0 leading-none truncate" style={{ width: 80 }}>
              {d.label}
            </span>

            {/* Bar — centred, width proportional to value */}
            <div className="flex-1 flex justify-center">
              <div
                className="relative h-10 rounded-md flex items-center justify-center cursor-pointer"
                style={{
                  width: ready ? `${barW}%` : `${MIN_W_PCT}%`,
                  backgroundColor: c,
                  opacity: hovered !== null && !isHov ? 0.3 : isHov ? 1 : 0.78,
                  boxShadow: isHov ? `0 0 0 2px ${c}88` : "none",
                  transition: ready
                    ? `width 0.45s ${i * 0.06}s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.12s, box-shadow 0.12s`
                    : "none",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseMove={(e) =>
                  setTooltip({
                    x: e.clientX, y: e.clientY,
                    content: (
                      <span>
                        <span className="text-slate-500 dark:text-slate-400 mr-2">{d.label}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatValue(d.value)}</span>
                        {dropPct && (
                          <span className="text-slate-500 dark:text-slate-400 ml-2">{dropPct}% of total</span>
                        )}
                      </span>
                    ),
                  })
                }
                onMouseLeave={() => { setHovered(null); setTooltip(null) }}
              />
            </div>

            {/* Value + drop-off */}
            <div className="shrink-0 text-right" style={{ width: 80 }}>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 tabular-nums leading-none">
                {formatValue(d.value)}
              </span>
              {dropPct && (
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">{dropPct}%</span>
              )}
            </div>
          </div>
        )
      })}

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}


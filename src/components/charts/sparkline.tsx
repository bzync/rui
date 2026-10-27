"use client"

import { cn } from "@/lib/cn"
import { type SVGAttributes, forwardRef, useId } from "react"

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, "values"> {
  data: number[]
  /** CSS width; the line stretches to fill it. Default 96. */
  width?: number | string
  height?: number
  color?: string
  /** Soft fill under the line. */
  area?: boolean
  /** Dot on the latest value. Default true. */
  showLast?: boolean
  /** Marks the minimum and maximum points. */
  showExtremes?: boolean
  /** Draws a dashed reference line (e.g. a target or the previous period's average). */
  reference?: number
  type?: "line" | "bar"
  /** Accessible description; defaults to a summary of first, last, min and max. */
  ariaLabel?: string
  formatValue?: (value: number) => string
}

/**
 * Word-sized trend line or bar strip for tables, stat tiles and lists. It has
 * no axes, so it describes itself to assistive technology with a summary.
 */
export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(function Sparkline({
  data,
  width = 96,
  height = 28,
  color = "var(--chart-1)",
  area = false,
  showLast = true,
  showExtremes = false,
  reference,
  type = "line",
  ariaLabel,
  formatValue = (value) => value.toLocaleString(),
  className,
  style,
  ...props
}, ref) {
  const uid = useId().replace(/:/g, "")
  const values = data.length ? data : [0]
  const min = Math.min(...values, reference ?? Infinity)
  const max = Math.max(...values, reference ?? -Infinity)
  const range = max - min || 1
  const W = 100
  const pad = 3
  const x = (i: number) => (values.length === 1 ? W / 2 : (i / (values.length - 1)) * W)
  const y = (v: number) => pad + (1 - (v - min) / range) * (height - pad * 2)
  const minIndex = values.indexOf(Math.min(...values))
  const maxIndex = values.indexOf(Math.max(...values))
  const last = values.length - 1
  const summary = ariaLabel ?? `Trend from ${formatValue(values[0])} to ${formatValue(values[last])}; low ${formatValue(values[minIndex])}, high ${formatValue(values[maxIndex])}.`
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ")

  // Dots are drawn as zero-length round-capped strokes so they stay circular when the viewBox stretches.
  const dot = (i: number, fill: string, key: string) => (
    <path key={key} d={`M${x(i)},${y(values[i])} l0,0`} stroke={fill} strokeWidth={6} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
  )

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={summary}
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      className={cn("inline-block shrink-0 overflow-visible align-middle", className)}
      style={{ width, height, ...style }}
      {...props}
    >
      {reference !== undefined && (
        <line x1={0} x2={W} y1={y(reference)} y2={y(reference)} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 3" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      )}
      {type === "bar" ? (
        values.map((v, i) => {
          const slot = W / values.length
          const base = y(Math.max(min, Math.min(0, max)))
          return <rect key={i} x={i * slot + slot * 0.15} width={slot * 0.7} y={Math.min(y(v), base)} height={Math.max(Math.abs(base - y(v)), 1)} fill={color} opacity={i === last ? 1 : 0.55} />
        })
      ) : (
        <>
          {area && (
            <>
              <defs>
                <linearGradient id={`${uid}-spark`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={`${line} L${x(last)},${height} L${x(0)},${height} Z`} fill={`url(#${uid}-spark)`} />
            </>
          )}
          <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {showExtremes && [dot(minIndex, "var(--chart-4)", "min"), dot(maxIndex, "var(--chart-2)", "max")]}
          {showLast && dot(last, color, "last")}
        </>
      )}
    </svg>
  )
})
Sparkline.displayName = "Sparkline"

"use client"

import { cn } from "@/lib/cn"
import { type HTMLAttributes, type ReactNode, forwardRef } from "react"

export type GaugeTone = "default" | "success" | "warning" | "danger" | "info"

export interface GaugeThreshold {
  /** Applies from this value upward (until the next threshold). */
  from: number
  tone: GaugeTone
  label?: string
}

export interface GaugeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value: number
  min?: number
  max?: number
  /** Accessible and visible name. */
  label: string
  /** Colors the value arc by range, e.g. danger above 80. Without it the arc uses `tone`. */
  thresholds?: GaugeThreshold[]
  tone?: GaugeTone
  /** Draws the threshold bands faintly along the track. Default true when thresholds are set. */
  showBands?: boolean
  /** Arc sweep: a half circle or a 270° dial. */
  variant?: "half" | "dial"
  size?: number
  /** Text in the center; defaults to the formatted value. */
  valueLabel?: ReactNode
  formatValue?: (value: number) => string
  /** Small text under the value, e.g. a target. */
  caption?: ReactNode
}

const toneColor: Record<GaugeTone, string> = {
  default: "var(--chart-1)",
  info: "var(--color-info)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
}

const polar = (cx: number, cy: number, r: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

const arc = (cx: number, cy: number, r: number, start: number, end: number) => {
  if (end - start < 0.01) return ""
  const a = polar(cx, cy, r, start)
  const b = polar(cx, cy, r, end)
  return `M${a.x},${a.y} A${r},${r} 0 ${end - start > 180 ? 1 : 0} 1 ${b.x},${b.y}`
}

/**
 * Single-value meter on an arc (CPU, quota, score). Exposed as role="meter"
 * with min, max, value and a text value; threshold tones also carry a text
 * label so state is not conveyed by color alone.
 */
export const Gauge = forwardRef<HTMLDivElement, GaugeProps>(function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  thresholds,
  tone = "default",
  showBands,
  variant = "half",
  size = 180,
  valueLabel,
  formatValue = (v) => `${Math.round(v)}`,
  caption,
  className,
  ...props
}, ref) {
  const clamped = Math.min(max, Math.max(min, value))
  const ratio = (clamped - min) / (max - min || 1)
  const sweep = variant === "dial" ? 270 : 180
  const start = -sweep / 2
  const angle = (v: number) => start + ((Math.min(max, Math.max(min, v)) - min) / (max - min || 1)) * sweep
  const sorted = [...(thresholds ?? [])].sort((a, b) => a.from - b.from)
  const current = [...sorted].reverse().find((threshold) => clamped >= threshold.from)
  const activeTone = current?.tone ?? tone
  const stroke = 10
  const r = 50 - stroke / 2
  const cx = 50
  const cy = 50
  const viewHeight = variant === "dial" ? 50 + r * Math.cos((45 * Math.PI) / 180) + stroke / 2 + 2 : 50 + stroke / 2 + 1
  const bands = (showBands ?? sorted.length > 0) ? sorted.map((threshold, index) => ({ ...threshold, to: sorted[index + 1]?.from ?? max })) : []
  const text = formatValue(clamped)

  return (
    <div
      ref={ref}
      role="meter"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-valuetext={current?.label ? `${text} (${current.label})` : text}
      className={cn("inline-grid justify-items-center", className)}
      style={{ width: size }}
      {...props}
    >
      <div className="relative w-full">
        <svg viewBox={`0 0 100 ${viewHeight}`} aria-hidden="true" className="block w-full overflow-visible">
          <path d={arc(cx, cy, r, start, start + sweep)} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={stroke} strokeLinecap="round" className="text-foreground" />
          {bands.map((band) => (
            <path key={band.from} d={arc(cx, cy, r + stroke / 2 + 2.5, angle(band.from) + 0.6, angle(band.to) - 0.6)} fill="none" stroke={toneColor[band.tone]} strokeOpacity={0.45} strokeWidth={1.5} strokeLinecap="round" />
          ))}
          {ratio > 0 && (
            <path d={arc(cx, cy, r, start, start + Math.max(ratio * sweep, 0.5))} fill="none" stroke={toneColor[activeTone]} strokeWidth={stroke} strokeLinecap="round" className="transition-[stroke] duration-300" />
          )}
        </svg>
        <div className={cn("absolute inset-x-0 grid justify-items-center", variant === "dial" ? "top-1/2 -translate-y-1/2" : "bottom-0")}>
          <span className="text-2xl font-semibold tabular-nums leading-none text-foreground" style={{ fontSize: size / 7 }}>{valueLabel ?? text}</span>
          {current?.label && <span className="mt-1 text-xs font-medium text-muted-foreground">{current.label}</span>}
        </div>
      </div>
      <div className="mt-2 grid justify-items-center gap-0.5 text-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {caption && <span className="text-xs text-muted-foreground">{caption}</span>}
      </div>
    </div>
  )
})
Gauge.displayName = "Gauge"

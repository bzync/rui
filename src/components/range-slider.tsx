"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles, focusRingStyles } from "@/lib/component-styles"
import { useControllableState } from "@/hooks/use-controllable-state"
import {
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
} from "react"

export type RangeSliderSize = "sm" | "md" | "lg"

export interface RangeSliderMark {
  value: number
  label: ReactNode
}

export interface RangeSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  label?: string
  hint?: string
  error?: string
  name?: string
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  value?: [number, number]
  defaultValue?: [number, number]
  onChange?: (val: [number, number]) => void
  onValueChange?: (val: [number, number]) => void
  onChangeEnd?: (val: [number, number]) => void
  formatValue?: (val: number) => string
  showValue?: boolean
  showTooltip?: boolean
  marks?: Record<number, ReactNode> | RangeSliderMark[]
  size?: RangeSliderSize
  disabled?: boolean
  minAriaLabel?: string
  maxAriaLabel?: string
}

const sizeConfig: Record<RangeSliderSize, {
  track: string
  thumb: string
  thumbPx: number
  tooltip: string
}> = {
  sm: { track: "h-1", thumb: "h-3.5 w-3.5", thumbPx: 14, tooltip: "text-[10px] py-0.5 px-1.5" },
  md: { track: "h-2", thumb: "h-4 w-4", thumbPx: 16, tooltip: "text-xs py-0.5 px-2" },
  lg: { track: "h-2.5", thumb: "h-5 w-5", thumbPx: 20, tooltip: "text-xs py-1 px-2.5" },
}

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(function RangeSlider(
  {
    label,
    hint,
    error,
    name,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetweenThumbs = 0,
    value: controlledValue,
    defaultValue = [min, max],
    onChange,
    onValueChange,
    onChangeEnd,
    formatValue = (v) => String(v),
    showValue = true,
    showTooltip = false,
    marks,
    size = "md",
    disabled = false,
    minAriaLabel = "Minimum value",
    maxAriaLabel = "Maximum value",
    className,
    id,
    ...props
  },
  ref,
) {
  const uid = useId()
  const inputId = id ?? uid
  const labelId = `${inputId}-label`
  const hasError = Boolean(error)
  const errorId = hasError ? `${inputId}-error` : undefined
  const hintId = hint && !hasError ? `${inputId}-hint` : undefined
  const describedBy = errorId ?? hintId
  const trackRef = useRef<HTMLDivElement | null>(null)

  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null)
  const [hoveredThumb, setHoveredThumb] = useState<0 | 1 | null>(null)

  const [range, setRangeState] = useControllableState<[number, number]>({
    value: controlledValue,
    defaultValue,
    onChange: (next) => {
      onChange?.(next)
      onValueChange?.(next)
    },
  })

  const rangeRef = useRef<[number, number]>(range)
  rangeRef.current = range

  const setRange = useCallback((next: [number, number]) => {
    rangeRef.current = next
    setRangeState(next)
  }, [setRangeState])

  const [valMin, valMax] = range
  const cfg = sizeConfig[size]

  const clamp = useCallback((val: number) => {
    const stepped = Math.round((val - min) / step) * step + min
    const rounded = Number(stepped.toFixed(6))
    return Math.max(min, Math.min(max, rounded))
  }, [max, min, step])

  const getPercent = useCallback((val: number) => {
    if (max <= min) return 0
    return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100))
  }, [max, min])

  const minPercent = getPercent(valMin)
  const maxPercent = getPercent(valMax)

  const updateThumb = useCallback((index: 0 | 1, nextRaw: number) => {
    const next = clamp(nextRaw)
    const minDiff = minStepsBetweenThumbs * step
    const [curMin, curMax] = rangeRef.current

    if (index === 0) {
      const allowedMax = curMax - minDiff
      const clamped = Math.min(next, allowedMax)
      const nextRange: [number, number] = [clamped, curMax]
      setRange(nextRange)
    } else {
      const allowedMin = curMin + minDiff
      const clamped = Math.max(next, allowedMin)
      const nextRange: [number, number] = [curMin, clamped]
      setRange(nextRange)
    }
  }, [clamp, minStepsBetweenThumbs, setRange, step])

  const handlePointerDown = (e: ReactPointerEvent, thumbIndex?: 0 | 1) => {
    if (disabled || e.button !== 0 || !trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const clickX = e.clientX
    const ratio = Math.max(0, Math.min(1, (clickX - rect.left) / rect.width))
    const clickVal = min + ratio * (max - min)

    let targetThumb = thumbIndex
    if (targetThumb === undefined) {
      // Find closest thumb
      const distMin = Math.abs(clickVal - valMin)
      const distMax = Math.abs(clickVal - valMax)
      targetThumb = distMin <= distMax ? 0 : 1
    }

    setActiveThumb(targetThumb)
    updateThumb(targetThumb, clickVal)

    const handlePointerMove = (ev: PointerEvent) => {
      if (!trackRef.current) return
      const currentRect = trackRef.current.getBoundingClientRect()
      const currentRatio = Math.max(0, Math.min(1, (ev.clientX - currentRect.left) / currentRect.width))
      const currentVal = min + currentRatio * (max - min)
      updateThumb(targetThumb!, currentVal)
    }

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      setActiveThumb(null)
      onChangeEnd?.(rangeRef.current)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
  }

  const handleKeyDown = (e: ReactKeyboardEvent, index: 0 | 1) => {
    if (disabled) return
    const currentVal = index === 0 ? valMin : valMax
    let delta = 0

    if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step
    else if (e.key === "PageUp") delta = step * 10
    else if (e.key === "PageDown") delta = -step * 10
    else if (e.key === "Home") {
      e.preventDefault()
      updateThumb(index, index === 0 ? min : valMin + minStepsBetweenThumbs * step)
      return
    } else if (e.key === "End") {
      e.preventDefault()
      updateThumb(index, index === 1 ? max : valMax - minStepsBetweenThumbs * step)
      return
    }

    if (delta !== 0) {
      e.preventDefault()
      updateThumb(index, currentVal + delta)
    }
  }

  return (
    <div ref={ref} className={cn(fieldRootStyles, className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label id={labelId} className={cn(fieldLabelStyles, disabled && "opacity-50")}>
              {label}
            </label>
          )}
          {showValue && (
            <span className="font-mono text-xs font-medium text-foreground">
              {formatValue(valMin)} — {formatValue(valMax)}
            </span>
          )}
        </div>
      )}

      {name && !disabled && (
        <input type="hidden" name={name} value={`${range[0]},${range[1]}`} />
      )}

      {/* Slider Track Area */}
      <div
        ref={trackRef}
        onPointerDown={(e) => handlePointerDown(e)}
        className={cn(
          "relative flex w-full cursor-pointer items-center py-2 select-none touch-none",
          disabled && "cursor-not-allowed opacity-50 pointer-events-none",
        )}
      >
        {/* Rail background */}
        <div className={cn("relative w-full rounded-full bg-muted", cfg.track)}>
          {/* Highlighted Range Bar */}
          <div
            className="absolute inset-y-0 rounded-full bg-accent"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
        </div>

        {/* Thumb 1 (Min) */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={minAriaLabel}
          id={`${inputId}-thumb-0`}
          aria-labelledby={label ? `${labelId} ${inputId}-thumb-0` : undefined}
          aria-valuemin={min}
          aria-valuemax={valMax - minStepsBetweenThumbs * step}
          aria-valuenow={valMin}
          aria-valuetext={formatValue(valMin)}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          onPointerDown={(e) => {
            e.stopPropagation()
            handlePointerDown(e, 0)
          }}
          onKeyDown={(e) => handleKeyDown(e, 0)}
          onMouseEnter={() => setHoveredThumb(0)}
          onMouseLeave={() => setHoveredThumb(null)}
          className={cn(
            "absolute -translate-x-1/2 rounded-full border-2 border-accent bg-surface shadow-xs transition-shadow",
            focusRingStyles,
            cfg.thumb,
            activeThumb === 0 && "scale-110 shadow-md ring-2 ring-accent/30",
          )}
          style={{ left: `${minPercent}%` }}
        >
          {showTooltip && (activeThumb === 0 || hoveredThumb === 0) && (
            <div
              aria-hidden="true"
              className={cn(
                "absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-foreground font-mono font-medium text-bg shadow-sm",
                cfg.tooltip,
              )}
            >
              {formatValue(valMin)}
            </div>
          )}
        </div>

        {/* Thumb 2 (Max) */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={maxAriaLabel}
          id={`${inputId}-thumb-1`}
          aria-labelledby={label ? `${labelId} ${inputId}-thumb-1` : undefined}
          aria-valuemin={valMin + minStepsBetweenThumbs * step}
          aria-valuemax={max}
          aria-valuenow={valMax}
          aria-valuetext={formatValue(valMax)}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          onPointerDown={(e) => {
            e.stopPropagation()
            handlePointerDown(e, 1)
          }}
          onKeyDown={(e) => handleKeyDown(e, 1)}
          onMouseEnter={() => setHoveredThumb(1)}
          onMouseLeave={() => setHoveredThumb(null)}
          className={cn(
            "absolute -translate-x-1/2 rounded-full border-2 border-accent bg-surface shadow-xs transition-shadow",
            focusRingStyles,
            cfg.thumb,
            activeThumb === 1 && "scale-110 shadow-md ring-2 ring-accent/30",
          )}
          style={{ left: `${maxPercent}%` }}
        >
          {showTooltip && (activeThumb === 1 || hoveredThumb === 1) && (
            <div
              aria-hidden="true"
              className={cn(
                "absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-foreground font-mono font-medium text-bg shadow-sm",
                cfg.tooltip,
              )}
            >
              {formatValue(valMax)}
            </div>
          )}
        </div>
      </div>

      {/* Marks list */}
      {marks && (
        <div className="relative mt-1 w-full text-[11px] text-muted-foreground select-none" aria-hidden="true">
          {(Array.isArray(marks)
            ? marks.map((m) => [m.value, m.label] as const)
            : Object.entries(marks).map(([k, v]) => [Number(k), v] as const)
          ).map(([markVal, label]) => {
            const pct = getPercent(markVal)
            return (
              <div
                key={markVal}
                className="absolute -translate-x-1/2 text-center"
                style={{ left: `${pct}%` }}
              >
                <div className="mx-auto mb-1 h-1 w-px bg-border-strong" />
                <span>{label}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Message & error */}
      {error ? (
        <p id={errorId} aria-live="polite" className={fieldErrorStyles}>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={fieldDescriptionStyles}>
          {hint}
        </p>
      ) : null}
    </div>
  )
})
RangeSlider.displayName = "RangeSlider"

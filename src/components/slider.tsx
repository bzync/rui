"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { InputHTMLAttributes, forwardRef, useEffect, useId, useState } from "react"

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string
  hint?: string
  error?: string
  showValue?: boolean
  formatValue?: (v: number) => string
  min?: number
  max?: number
  step?: number
  /** Track and thumb scale. */
  size?: "sm" | "md" | "lg"
}

const sliderSizes = {
  sm: { root: "h-4", track: "h-1", thumb: "[&::-webkit-slider-thumb]:size-3.5 [&::-moz-range-thumb]:size-3.5" },
  md: { root: "h-5", track: "h-1.5", thumb: "[&::-webkit-slider-thumb]:size-4 [&::-moz-range-thumb]:size-4" },
  lg: { root: "h-6", track: "h-2", thumb: "[&::-webkit-slider-thumb]:size-5 [&::-moz-range-thumb]:size-5" },
} as const

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      hint,
      error,
      showValue = true,
      formatValue,
      min = 0,
      max = 100,
      step = 1,
      size = "md",
      value: controlledValue,
      defaultValue,
      onChange,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const uid = useId()
    const inputId = id ?? uid
    const messageId = `${inputId}-message`
    const [localValue, setLocalValue] = useState<number>(
      Number(controlledValue ?? defaultValue ?? min),
    )

    useEffect(() => {
      if (controlledValue !== undefined) setLocalValue(Number(controlledValue))
    }, [controlledValue])

    const v = Number(controlledValue ?? localValue)
    const pct = max === min ? 0 : Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100))
    const display = formatValue ? formatValue(v) : String(v)

    return (
      <div className={cn(fieldRootStyles, className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label htmlFor={inputId} className={fieldLabelStyles}>
                {label}
              </label>
            )}
            {showValue && (
              <output htmlFor={inputId} className="text-sm font-medium tabular-nums text-foreground">
                {display}
              </output>
            )}
          </div>
        )}
        <div className={cn("relative flex items-center", sliderSizes[size].root)}>
          <div className={cn("absolute inset-x-0 rounded-full bg-muted", sliderSizes[size].track)}>
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-accent-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <input
            ref={ref}
            type="range"
            id={inputId}
            min={min}
            max={max}
            step={step}
            value={v}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? messageId : undefined}
            aria-valuetext={display}
            onChange={(e) => {
              const next = Number(e.target.value)
              if (controlledValue === undefined) setLocalValue(next)
              onChange?.(e)
            }}
            className={cn(
              "relative w-full appearance-none bg-transparent cursor-pointer",
              "focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-focus-ring/25",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "[&::-webkit-slider-thumb]:appearance-none",
              sliderSizes[size].thumb,
              "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
              "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent-500",
              "[&::-webkit-slider-thumb]:shadow-sm",
              "[&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent-500",
              "[&::-moz-range-thumb]:shadow-md",
            )}
            {...props}
          />
        </div>
        {error && <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
        {hint && !error && <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>}
      </div>
    )
  },
)

Slider.displayName = "Slider"

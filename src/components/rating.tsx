"use client"

import { cn } from "@/lib/cn"
import { fieldLabelStyles } from "@/lib/component-styles"
import { FieldsetHTMLAttributes, forwardRef, useId, useState } from "react"

export type RatingSize = "sm" | "md" | "lg"

const ratingSizeStyles: Record<RatingSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
}

const ratingTargetStyles: Record<RatingSize, string> = {
  sm: "size-8",
  md: "size-9",
  lg: "size-10",
}

export interface RatingProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  label: string
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  max?: number
  name?: string
  size?: RatingSize
  readOnly?: boolean
  showLabel?: boolean
  showValue?: boolean
}

export const Rating = forwardRef<HTMLFieldSetElement, RatingProps>(({
  label,
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  max = 5,
  name: externalName,
  size = "md",
  readOnly = false,
  showLabel = true,
  showValue = false,
  disabled,
  className,
  ...props
}, ref) => {
  const generatedName = useId()
  const name = externalName ?? generatedName
  const itemCount = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 5
  const normalizeValue = (next: number) => Number.isFinite(next) ? Math.max(0, Math.min(itemCount, next)) : 0
  const [localValue, setLocalValue] = useState(() => normalizeValue(defaultValue))
  const value = normalizeValue(controlledValue ?? localValue)

  function select(next: number) {
    if (disabled || readOnly) return
    if (controlledValue === undefined) setLocalValue(next)
    onValueChange?.(next)
  }

  return (
    <fieldset
      ref={ref}
      role="radiogroup"
      aria-readonly={readOnly || undefined}
      disabled={disabled}
      className={cn("min-w-0", className)}
      {...props}
    >
      <legend className={cn(fieldLabelStyles, !showLabel && "sr-only")}>{label}</legend>
      <div className="mt-1 flex w-fit max-w-full items-center overflow-x-auto overscroll-x-contain py-1 scrollbar-none">
        {Array.from({ length: itemCount }, (_, index) => {
          const itemValue = index + 1
          const selected = itemValue <= value
          return (
            <label
              key={itemValue}
              className={cn(
                "relative inline-flex shrink-0 items-center justify-center rounded-sm",
                ratingTargetStyles[size],
                disabled ? "cursor-not-allowed opacity-40" : readOnly ? "cursor-default" : "cursor-pointer",
              )}
            >
              <input
                type="radio"
                name={name}
                value={itemValue}
                checked={value === itemValue}
                disabled={disabled}
                readOnly={readOnly}
                aria-label={`${itemValue} ${itemValue === 1 ? "star" : "stars"}`}
                onChange={() => select(itemValue)}
                className="peer sr-only"
              />
              <span className="block rounded-sm peer-focus-visible:ring-[3px] peer-focus-visible:ring-focus-ring/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={cn(
                    ratingSizeStyles[size],
                    "transition-colors",
                    selected ? "fill-warning text-warning" : "fill-transparent text-border-strong",
                    !disabled && !readOnly && "hover:text-warning",
                  )}
                >
                  <path stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" d="m12 2.8 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 16.83l-5.5 2.89 1.05-6.12L3.1 9.27l6.15-.9L12 2.8Z" />
                </svg>
              </span>
            </label>
          )
        })}
        {showValue && <output className="ml-2 text-xs tabular-nums text-muted-foreground" aria-live="polite">{value}/{itemCount}</output>}
      </div>
    </fieldset>
  )
})
Rating.displayName = "Rating"

"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { InputHTMLAttributes, KeyboardEvent, forwardRef, useEffect, useId, useRef, useState } from "react"

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange"> {
  label?: string
  hint?: string
  error?: string
  size?: "sm" | "md" | "lg"
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  formatDisplay?: (v: number) => string
  fullWidth?: boolean
}

const sizes = {
  sm: { wrap: "h-7 text-xs", btn: "w-6", input: "w-16" },
  md: { wrap: "h-9 text-sm", btn: "w-8", input: "w-20" },
  lg: { wrap: "h-11 text-sm", btn: "w-9", input: "w-24" },
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      label,
      hint,
      error,
      size = "md",
      min = -Infinity,
      max = Infinity,
      step = 1,
      value: controlledValue,
      defaultValue = 0,
      onChange,
      disabled,
      id,
      autoComplete = "on",
      fullWidth = false,
      formatDisplay,
      onFocus,
      onBlur,
      onKeyDown,
      required,
      ...props
    },
    ref,
  ) => {
    const uid = useId()
    const inputId = id ?? uid
    const messageId = `${inputId}-message`
    const [localValue, setLocalValue] = useState(defaultValue)
    const v = controlledValue ?? localValue
    const s = sizes[size]

    const decimals = step.toString().includes(".") ? step.toString().split(".")[1].length : 0
    const round = (n: number) => decimals > 0 ? Math.round(n * 10 ** decimals) / 10 ** decimals : Math.round(n)
    const clamp = (n: number) => Math.min(max, Math.max(min, n))

    function update(next: number) {
      const clamped = clamp(round(next))
      if (controlledValue === undefined) setLocalValue(clamped)
      onChange?.(clamped)
      setText(String(clamped))
    }

    useEffect(() => {
      if (controlledValue !== undefined) setLocalValue(controlledValue)
    }, [controlledValue])

    // Typing holds its own raw text so intermediate states like "" or
    // "12." aren't immediately clamped/rounded away mid-keystroke — that
    // only happens on blur (or via the +/- buttons, which call update()
    // directly since they're discrete steps, not free typing).
    const [text, setText] = useState(() => String(v))
    const focusedRef = useRef(false)

    useEffect(() => {
      if (!focusedRef.current) setText(String(v))
       
    }, [v])

    // onChange only fires on commit (blur / Enter / the +/- buttons), not on
    // every keystroke — consumers that wire onChange to a network save
    // (e.g. the compute node hosting row) would otherwise fire a request
    // per character and disable the input mid-typing while it's in flight.
    function handleTextChange(raw: string) {
      setText(raw)
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      focusedRef.current = false
      const n = Number(text)
      update(Number.isNaN(n) ? v : n)
      onBlur?.(e)
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      onKeyDown?.(e)
      if (e.defaultPrevented) return
      if (e.key === "Enter") {
        e.currentTarget.blur()
      }
    }

    return (
      <div className={cn(fieldRootStyles, !fullWidth && "w-auto", className)}>
        {label && (
          <label htmlFor={inputId} className={fieldLabelStyles}>
            {label}
            {required && <><span aria-hidden="true" className="ml-1 text-destructive">*</span><span className="sr-only"> (required)</span></>}
          </label>
        )}
        <div
          className={cn(
            "inline-flex items-center overflow-hidden rounded-[var(--radius-md)]",
            controlBaseStyles,
            s.wrap,
            fullWidth && "flex w-full",
            error && controlInvalidStyles,
            disabled && "opacity-50",
          )}
        >
          <button
            type="button"
            aria-label={label ? `Decrease ${label}` : "Decrease value"}
            tabIndex={-1}
            disabled={disabled || v <= min}
            onClick={() => update(v - step)}
            className={cn(
              "flex items-center justify-center shrink-0 border-r border-border",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              "disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
              s.btn,
            )}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>
          <input
            ref={ref}
            type="number"
            id={inputId}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? messageId : undefined}
            aria-valuetext={formatDisplay?.(v)}
            autoComplete={autoComplete}
            min={Number.isFinite(min) ? min : undefined}
            max={Number.isFinite(max) ? max : undefined}
            step={step}
            value={text}
            disabled={disabled}
            onFocus={(e) => { focusedRef.current = true; onFocus?.(e) }}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex-1 text-center bg-transparent text-foreground outline-none tabular-nums",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              "disabled:cursor-not-allowed",
              fullWidth ? "min-w-0" : s.input,
            )}
            {...props}
          />
          <button
            type="button"
            aria-label={label ? `Increase ${label}` : "Increase value"}
            tabIndex={-1}
            disabled={disabled || v >= max}
            onClick={() => update(v + step)}
            className={cn(
              "flex items-center justify-center shrink-0 border-l border-border",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              "disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
              s.btn,
            )}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        {error && <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
        {hint && !error && <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>}
      </div>
    )
  },
)

NumberInput.displayName = "NumberInput"

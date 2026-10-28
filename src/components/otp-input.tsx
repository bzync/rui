"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, fieldDescriptionStyles, fieldErrorStyles } from "@/lib/component-styles"
import { ClipboardEvent, HTMLAttributes, KeyboardEvent, forwardRef, useId, useRef, useState } from "react"

export interface OtpInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  length?: number
  /** Controlled code. */
  value?: string
  /** Initial code when uncontrolled. */
  defaultValue?: string
  onChange?: (value: string) => void
  onValueChange?: (value: string) => void
  onComplete?: (value: string) => void
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  name?: string
  required?: boolean
  className?: string
  masked?: boolean
}

export const OtpInput = forwardRef<HTMLDivElement, OtpInputProps>(function OtpInput({
  length = 6,
  value: controlledValue,
  defaultValue = "",
  onChange,
  onValueChange,
  onComplete,
  label,
  hint,
  error,
  disabled,
  name,
  required,
  className,
  masked = false,
  ...props
}, ref) {
  const uid = useId()
  const [localValue, setLocalValue] = useState(defaultValue)
  const value = controlledValue ?? localValue
  const digits = value.split("").slice(0, length)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const hasError = Boolean(error)
  const errorId = hasError ? `${uid}-error` : undefined
  const hintId = hint && !hasError ? `${uid}-hint` : undefined
  const describedBy = errorId ?? hintId

  function update(next: string) {
    if (controlledValue === undefined) setLocalValue(next)
    onChange?.(next)
    onValueChange?.(next)
    if (next.length === length) onComplete?.(next)
  }

  function handleChange(idx: number, char: string) {
    if (!/^\d*$/.test(char)) return
    const arr = digits.slice()
    arr[idx] = char.slice(-1)
    const next = arr.join("").slice(0, length)
    update(next)
    if (char && idx < length - 1) inputsRef.current[idx + 1]?.focus()
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        const arr = digits.slice()
        arr[idx] = ""
        update(arr.join(""))
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    update(pasted)
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
      {label && (
        <label htmlFor={`${uid}-0`} className="text-sm font-medium text-foreground">{label}</label>
      )}
      {name && (
        <input type="hidden" name={name} value={digits.join("")} required={required} disabled={disabled} />
      )}
      <div className="flex items-center gap-2">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el }}
            id={`${uid}-${i}`}
            name={`${uid}-${i}`}
            type={masked ? "password" : "text"}
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            value={digits[i] ?? ""}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "w-10 h-12 text-center text-lg font-semibold rounded-lg outline-none",
              controlBaseStyles,
              hasError && controlInvalidStyles,
              disabled && "opacity-50 cursor-not-allowed",
            )}
          />
        ))}
      </div>
      {error && <p id={errorId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
      {hint && !error && <p id={hintId} className={fieldDescriptionStyles}>{hint}</p>}
    </div>
  )
})
OtpInput.displayName = "OtpInput"

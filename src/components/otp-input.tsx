"use client"

import { cn } from "@/lib/cn"
import { ClipboardEvent, KeyboardEvent, useId, useRef, useState } from "react"

export interface OtpInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
  masked?: boolean
}

export function OtpInput({
  length = 6,
  value: controlledValue,
  onChange,
  onComplete,
  label,
  hint,
  error,
  disabled,
  className,
  masked = false,
}: OtpInputProps) {
  const uid = useId()
  const [localValue, setLocalValue] = useState("")
  const value = controlledValue ?? localValue
  const digits = value.split("").slice(0, length)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  function update(next: string) {
    if (controlledValue === undefined) setLocalValue(next)
    onChange?.(next)
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
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={`${uid}-0`} className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
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
            value={digits[i] ?? ""}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "w-10 h-12 text-center text-lg font-semibold rounded-lg border bg-black/4 dark:bg-white/4",
              "text-foreground outline-none transition-colors",
              "focus:ring-[3px] focus:ring-accent-500/30",
              error
                ? "border-red-500/40 focus:border-red-500/50"
                : "border-slate-300 dark:border-white/10 focus:border-accent-500/40",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

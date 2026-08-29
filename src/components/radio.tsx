"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { motion } from "framer-motion"
import { createContext, useContext, useId, ReactNode } from "react"

interface RadioContextValue {
  name: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const RadioContext = createContext<RadioContextValue | null>(null)

function useRadioCtx() {
  const ctx = useContext(RadioContext)
  if (!ctx) throw new Error("Radio must be inside <RadioGroup>")
  return ctx
}

export interface RadioGroupProps {
  name?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  label?: string
  hint?: string
  error?: string
  orientation?: "vertical" | "horizontal"
  className?: string
  children: ReactNode
}

export function RadioGroup({
  name: externalName,
  value,
  onChange,
  disabled,
  label,
  hint,
  error,
  orientation = "vertical",
  className,
  children,
}: RadioGroupProps) {
  const uid = useId()
  const name = externalName ?? uid
  const labelId = `${name}-label`
  const messageId = `${name}-message`

  return (
    <div className={cn(fieldRootStyles, className)}>
      {label && (
        <p id={labelId} className={fieldLabelStyles}>{label}</p>
      )}
      <RadioContext.Provider value={{ name, value, onChange, disabled }}>
        <div
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            "flex gap-2",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          )}
        >
          {children}
        </div>
      </RadioContext.Provider>
      {error && <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
      {hint && !error && <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>}
    </div>
  )
}

export interface RadioProps {
  value: string
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

export function Radio({ value, label, description, disabled: localDisabled, className }: RadioProps) {
  const { name, value: groupValue, onChange, disabled: groupDisabled } = useRadioCtx()
  const id = useId()
  const isChecked = groupValue === value
  const isDisabled = localDisabled ?? groupDisabled

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-2.5 cursor-pointer",
        isDisabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <div className="relative mt-0.5 shrink-0 w-4 h-4">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={() => onChange(value)}
          className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-[120ms] peer-focus-visible:ring-[3px] peer-focus-visible:ring-focus-ring/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg",
            isChecked
              ? "bg-primary border-primary"
              : "bg-transparent border-black/25 dark:border-white/25",
          )}
        >
          {isChecked && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
              className="w-1.5 h-1.5 rounded-full bg-white"
            />
          )}
        </div>
      </div>
      {(label || description) && (
        <div className="min-w-0">
          {label && (
            <p className="text-sm font-medium text-foreground leading-snug">{label}</p>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </label>
  )
}

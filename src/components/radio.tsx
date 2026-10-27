"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { motion } from "@/lib/motion-components"
import { useControllableState } from "@/hooks/use-controllable-state"
import { createContext, useContext, useId, ReactNode, forwardRef } from "react"

interface RadioContextValue {
  name: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  size: RadioSize
}

export type RadioSize = "sm" | "md" | "lg"

// Mirrors Checkbox sizes so mixed choice groups line up.
const radioSizes: Record<RadioSize, { circle: string; dot: string; label: string; desc: string }> = {
  sm: { circle: "size-3.5", dot: "size-[5px]", label: "text-xs", desc: "text-[11px]" },
  md: { circle: "size-4", dot: "size-1.5", label: "text-sm", desc: "text-xs" },
  lg: { circle: "size-5", dot: "size-2", label: "text-sm", desc: "text-xs" },
}

const RadioContext = createContext<RadioContextValue | null>(null)

function useRadioCtx() {
  const ctx = useContext(RadioContext)
  if (!ctx) throw new Error("Radio must be inside <RadioGroup>")
  return ctx
}

export interface RadioGroupProps {
  name?: string
  /** Controlled selected value. */
  value?: string
  /** Initially selected value when uncontrolled. */
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
  label?: string
  hint?: string
  error?: string
  orientation?: "vertical" | "horizontal"
  /** Radio and label scale, matching Checkbox. */
  size?: RadioSize
  className?: string
  children: ReactNode
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup({
  name: externalName,
  value: controlledValue,
  defaultValue = "",
  onChange: onValueChange,
  disabled,
  label,
  hint,
  error,
  orientation = "vertical",
  size = "md",
  className,
  children,
}, ref) {
  const [value, onChange] = useControllableState({ value: controlledValue, defaultValue, onChange: onValueChange })
  const uid = useId()
  const name = externalName ?? uid
  const labelId = `${name}-label`
  const messageId = `${name}-message`

  return (
    <div ref={ref} className={cn(fieldRootStyles, className)}>
      {label && (
        <p id={labelId} className={fieldLabelStyles}>{label}</p>
      )}
      <RadioContext.Provider value={{ name, value, onChange, disabled, size }}>
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
})
RadioGroup.displayName = "RadioGroup"

export interface RadioProps {
  value: string
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

export const Radio = forwardRef<HTMLLabelElement, RadioProps>(function Radio({ value, label, description, disabled: localDisabled, className }, ref) {
  const { name, value: groupValue, onChange, disabled: groupDisabled, size } = useRadioCtx()
  const s = radioSizes[size]
  const id = useId()
  const isChecked = groupValue === value
  const isDisabled = localDisabled ?? groupDisabled

  return (
    <label ref={ref}
      htmlFor={id}
      className={cn(
        "flex items-start gap-2.5 cursor-pointer",
        isDisabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <div className={cn("relative mt-0.5 shrink-0", s.circle)}>
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
            "size-full rounded-full border-2 flex items-center justify-center transition-colors duration-[120ms] peer-focus-visible:ring-[3px] peer-focus-visible:ring-focus-ring/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg",
            isChecked
              ? "bg-primary border-primary"
              : "bg-transparent border-foreground/25",
          )}
        >
          {isChecked && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
              className={cn("rounded-full bg-white", s.dot)}
            />
          )}
        </div>
      </div>
      {(label || description) && (
        <div className="min-w-0">
          {label && (
            <p className={cn("font-medium text-foreground leading-snug", s.label)}>{label}</p>
          )}
          {description && (
            <p className={cn("mt-0.5 text-muted-foreground", s.desc)}>{description}</p>
          )}
        </div>
      )}
    </label>
  )
})
Radio.displayName = "Radio"

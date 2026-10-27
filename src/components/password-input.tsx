"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { useControllableState } from "@/hooks/use-controllable-state"
import { forwardRef, useId, useState } from "react"
import { Input, type InputProps } from "./input"

export interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

export interface PasswordInputProps extends Omit<InputProps, "type" | "suffix"> {
  /** Shows a four-step strength meter under the field. */
  showStrength?: boolean
  /** Custom scorer returning 0 (too weak) to 4 (strong). */
  strength?: (password: string) => 0 | 1 | 2 | 3 | 4
  strengthLabels?: [string, string, string, string, string]
  /** Checklist shown under the field; each item is ticked as it is met. */
  requirements?: PasswordRequirement[]
  visible?: boolean
  defaultVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
  showLabel?: string
  hideLabel?: string
}

/** Length, mixed case, digits and symbols, mapped to 0–4. */
export function scorePassword(password: string): 0 | 1 | 2 | 3 | 4 {
  const points = [password.length >= 8, password.length >= 12, /[a-z]/.test(password) && /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
  return Math.max(0, Math.min(4, points - 1)) as 0 | 1 | 2 | 3 | 4
}

const DEFAULT_LABELS: [string, string, string, string, string] = ["Too weak", "Weak", "Fair", "Good", "Strong"]
const meterStyles = ["bg-danger", "bg-danger", "bg-warning", "bg-success", "bg-success"]

const EyeIcon = ({ off }: { off: boolean }) => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {off ? (
      <><path d="M10.7 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.2 3.2M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M2 2l20 20" /></>
    ) : (
      <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>
    )}
  </svg>
)

/**
 * Password field with a show/hide toggle, an optional strength meter and a
 * requirements checklist. The toggle is a pressed-state button that keeps
 * focus in place; meter and checklist are linked to the input with
 * aria-describedby and announced politely.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({
  showStrength = false,
  strength = scorePassword,
  strengthLabels = DEFAULT_LABELS,
  requirements,
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  showLabel = "Show password",
  hideLabel = "Hide password",
  value,
  defaultValue,
  onChange,
  autoComplete,
  disabled,
  size = "md",
  wrapperClassName,
  "aria-describedby": describedBy,
  ...props
}, ref) {
  const [visible, setVisible] = useControllableState({ value: visibleProp, defaultValue: defaultVisible, onChange: onVisibleChange })
  const [innerValue, setInnerValue] = useState(String(defaultValue ?? ""))
  const password = value !== undefined ? String(value) : innerValue
  const id = useId()
  const inputId = props.id ?? `${id}-input`
  const feedbackId = `${id}-feedback`
  const hasFeedback = showStrength || Boolean(requirements?.length)
  const level = strength(password)

  return (
    <div className={cn("grid gap-2", wrapperClassName)}>
      <Input
        ref={ref}
        {...props}
        id={inputId}
        size={size}
        disabled={disabled}
        type={visible ? "text" : "password"}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={(event) => { setInnerValue(event.target.value); onChange?.(event) }}
        autoComplete={autoComplete ?? (showStrength || requirements ? "new-password" : "current-password")}
        autoCapitalize="none"
        spellCheck={false}
        aria-describedby={[describedBy, props.error || props.hint ? `${inputId}-message` : undefined, hasFeedback ? feedbackId : undefined].filter(Boolean).join(" ") || undefined}
        suffix={
          <button
            type="button"
            aria-pressed={visible}
            aria-label={visible ? hideLabel : showLabel}
            title={visible ? hideLabel : showLabel}
            disabled={disabled}
            onClick={() => setVisible(!visible)}
            className={cn("-mr-1.5 grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground disabled:pointer-events-none", focusRingStyles)}
          >
            <EyeIcon off={visible} />
          </button>
        }
      />
      {hasFeedback && (
        <div id={feedbackId} className="grid gap-2">
          {showStrength && (
            <div className="flex items-center gap-3">
              <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden="true">
                {[1, 2, 3, 4].map((step) => (
                  <span key={step} className={cn("h-1 rounded-full transition-colors", password && level >= step ? meterStyles[level] : "bg-foreground/10")} />
                ))}
              </div>
              <span className="min-w-14 text-right text-xs font-medium text-muted-foreground" aria-live="polite">
                {password ? <><span className="sr-only">Password strength: </span>{strengthLabels[level]}</> : null}
              </span>
            </div>
          )}
          {requirements?.length ? (
            <ul className="grid gap-1 text-xs">
              {requirements.map((requirement) => {
                const met = requirement.test(password)
                return (
                  <li key={requirement.label} className={cn("flex items-center gap-2", met ? "text-success-strong" : "text-muted-foreground")}>
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      {met ? <path d="M20 6 9 17l-5-5" /> : <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />}
                    </svg>
                    {requirement.label}
                    <span className="sr-only">{met ? " (met)" : " (not met)"}</span>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"

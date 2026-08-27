"use client"
import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { InputHTMLAttributes, ReactNode, forwardRef, useId, CSSProperties } from "react"

type InputSize = "sm" | "md" | "lg"

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix" | "size"> {
  label?: string
  hint?: string
  error?: string
  prefix?: ReactNode
  suffix?: ReactNode
  size?: InputSize
  /** Slot customization — end-to-end */
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
  inputClassName?: string
  labelClassName?: string
  hintClassName?: string
  unstyled?: boolean
}

const inputSizes: Record<InputSize, { wrap: string; text: string }> = {
  sm: { wrap: "h-7 px-2 gap-1.5",    text: "text-xs" },
  md: { wrap: "h-9 px-3 gap-2",      text: "text-sm" },
  lg: { wrap: "h-10 px-3.5 gap-2.5", text: "text-sm" },
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      wrapperStyle,
      inputClassName,
      labelClassName,
      hintClassName,
      unstyled = false,
      label,
      hint,
      error,
      prefix,
      suffix,
      size = "md",
      id,
      autoComplete = "on",
      style,
      required,
      ...props
    },
    ref,
  ) => {
    const uid = useId()
    const inputId = id ?? uid
    const messageId = `${inputId}-message`
    const s = inputSizes[size]

    if (unstyled) {
      return (
        <div className={cn(fieldRootStyles, wrapperClassName)} style={wrapperStyle}>
          {label && <label htmlFor={inputId} className={cn(fieldLabelStyles, labelClassName)}>{label}{required && <><span aria-hidden="true" className="ml-1 text-destructive">*</span><span className="sr-only"> (required)</span></>}</label>}
          <input ref={ref} id={inputId} required={required} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? messageId : undefined} autoComplete={autoComplete} className={cn(inputClassName, className)} style={style} {...props} />
          {error && <p id={messageId} aria-live="polite" className={cn(fieldErrorStyles, hintClassName)}>{error}</p>}
          {hint && !error && <p id={messageId} className={cn(fieldDescriptionStyles, hintClassName)}>{hint}</p>}
        </div>
      )
    }

    return (
      <div className={cn(fieldRootStyles, wrapperClassName)} style={wrapperStyle}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(fieldLabelStyles, labelClassName)}
          >
            {label}
            {required && <><span aria-hidden="true" className="ml-1 text-destructive">*</span><span className="sr-only"> (required)</span></>}
          </label>
        )}
        <div
          className={cn(
            "flex items-center rounded-[var(--radius-md)]",
            s.wrap,
            controlBaseStyles,
            error && controlInvalidStyles,
          )}
        >
          {prefix && (
            <span className={cn("text-slate-400 dark:text-slate-500 shrink-0", s.text)}>
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? messageId : undefined}
            autoComplete={autoComplete}
            className={cn(
              "flex-1 min-w-0 bg-transparent outline-none",
              "text-foreground placeholder:text-muted-foreground",
              "disabled:cursor-not-allowed disabled:opacity-50",
              s.text,
              inputClassName,
              className,
            )}
            style={style}
            {...props}
          />
          {suffix && (
            <span className={cn("text-slate-400 dark:text-slate-500 shrink-0", s.text)}>
              {suffix}
            </span>
          )}
        </div>
        {error && <p id={messageId} aria-live="polite" className={cn(fieldErrorStyles, hintClassName)}>{error}</p>}
        {hint && !error && <p id={messageId} className={cn(fieldDescriptionStyles, hintClassName)}>{hint}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

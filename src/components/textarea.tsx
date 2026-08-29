"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { TextareaHTMLAttributes, forwardRef, useId } from "react"

type TextareaSize = "sm" | "md" | "lg"

const textareaSizes: Record<TextareaSize, string> = {
  sm: "min-h-[64px] px-2 py-1.5 text-xs",
  md: "min-h-[88px] px-3 py-2.5 text-sm",
  lg: "min-h-[120px] px-4 py-3 text-sm",
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  size?: TextareaSize
  wrapperClassName?: string
  labelClassName?: string
  messageClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, wrapperClassName, labelClassName, messageClassName, label, hint, error, size = "md", id, autoComplete = "on", required, ...props }, ref) => {
    const uid = useId()
    const textareaId = id ?? uid
    const messageId = `${textareaId}-message`

    return (
      <div className={cn(fieldRootStyles, wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(fieldLabelStyles, labelClassName)}
          >
            {label}
            {required && <><span aria-hidden="true" className="ml-1 text-destructive">*</span><span className="sr-only"> (required)</span></>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          autoComplete={autoComplete}
          className={cn(
            "w-full rounded-[var(--radius-md)] text-foreground placeholder:text-muted-foreground outline-none resize-y",
            controlBaseStyles,
            textareaSizes[size],
            "focus:border-accent-500 focus:ring-[3px] focus:ring-focus-ring/25",
            error && controlInvalidStyles,
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        {error && <p id={messageId} aria-live="polite" className={cn(fieldErrorStyles, messageClassName)}>{error}</p>}
        {hint && !error && <p id={messageId} className={cn(fieldDescriptionStyles, messageClassName)}>{hint}</p>}
      </div>
    )
  },
)

Textarea.displayName = "Textarea"

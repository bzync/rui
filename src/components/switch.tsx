"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, peerFocusRingStyles } from "@/lib/component-styles"
import {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useEffect,
  useId,
  useState,
} from "react"

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: ReactNode
  description?: ReactNode
  hint?: ReactNode
  error?: string
  size?: "sm" | "md"
  onCheckedChange?: (checked: boolean) => void
  onValueChange?: (checked: boolean) => void
}

const track = {
  sm: { w: 36, h: 20, thumb: 14, gap: 3 },
  md: { w: 44, h: 24, thumb: 18, gap: 3 },
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      hint,
      error,
      size = "md",
      checked,
      defaultChecked,
      onChange,
      onCheckedChange,
      onValueChange,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const [isChecked, setIsChecked] = useState<boolean>(
      checked !== undefined ? checked : (defaultChecked ?? false),
    )

    useEffect(() => {
      if (checked !== undefined) setIsChecked(checked)
    }, [checked])

    const uid = useId()
    const inputId = id ?? uid
    const labelId = `${inputId}-label`
    const helperText = description ?? hint
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`
    const describedBy = [
      props["aria-describedby"],
      error ? errorId : undefined,
      helperText ? hintId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined
    const dims = track[size]
    const thumbX = isChecked ? dims.w - dims.thumb - dims.gap : dims.gap

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "flex items-start gap-3 cursor-pointer",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <div className="relative mt-0.5 shrink-0" style={{ width: dims.w, height: dims.h }}>
          <input
            {...props}
            ref={ref}
            type="checkbox"
            role="switch"
            id={inputId}
            aria-labelledby={props["aria-labelledby"] ?? (!props["aria-label"] && label ? labelId : undefined)}
            aria-invalid={Boolean(error) || props["aria-invalid"]}
            aria-describedby={describedBy}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            checked={isChecked}
            disabled={disabled}
            onChange={(e) => {
              if (checked === undefined) setIsChecked(e.target.checked)
              onChange?.(e)
              onCheckedChange?.(e.target.checked)
              onValueChange?.(e.target.checked)
            }}
          />
          <div
            className={cn(
              "rounded-full w-full h-full border transition-all duration-200",
              peerFocusRingStyles,
              isChecked
                ? "bg-primary border-primary"
                : "bg-muted border-border-strong",
            )}
          />
          {/* CSS transform instead of framer-motion — keeps this very common
              control off the animation runtime. The bezier approximates the
              gentle spring the motion tokens describe. */}
          <span
            className="absolute rounded-full bg-white shadow-md shadow-black/20 transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none"
            style={{
              width: dims.thumb,
              height: dims.thumb,
              top: dims.gap,
              transform: `translateX(${thumbX}px)`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(0,0,0,0.06)",
            }}
          />
        </div>
        {(label || helperText || error) && (
          <div className="min-w-0 flex flex-col gap-0.5">
            {label && (
              <p id={labelId} className="text-sm font-medium text-foreground">{label}</p>
            )}
            {helperText && (
              <span id={hintId} className={fieldDescriptionStyles}>{helperText}</span>
            )}
            {error && (
              <span id={errorId} role="alert" className={fieldErrorStyles}>{error}</span>
            )}
          </div>
        )}
      </label>
    )
  },
)

Switch.displayName = "Switch"

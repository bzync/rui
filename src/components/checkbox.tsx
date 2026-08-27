"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles } from "@/lib/component-styles"
import { motion, AnimatePresence } from "framer-motion"
import { InputHTMLAttributes, forwardRef, useEffect, useId, useRef, useState } from "react"

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string
  description?: string
  size?: "sm" | "md" | "lg"
  indeterminate?: boolean
  error?: string
}

const sizes = {
  sm: { box: "w-3.5 h-3.5 rounded", check: 10, label: "text-xs", desc: "text-[10px]" },
  md: { box: "w-4 h-4 rounded-[4px]", check: 11, label: "text-sm", desc: "text-xs" },
  lg: { box: "w-5 h-5 rounded-md", check: 13, label: "text-sm", desc: "text-xs" },
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      size = "md",
      checked,
      defaultChecked,
      indeterminate = false,
      onChange,
      disabled,
      error,
      id,
      ...props
    },
    ref,
  ) => {
    const [isChecked, setIsChecked] = useState(
      checked !== undefined ? checked : (defaultChecked ?? false),
    )

    useEffect(() => {
      if (checked !== undefined) setIsChecked(checked)
    }, [checked])

    const uid = useId()
    const checkboxId = id ?? uid
    const messageId = `${checkboxId}-message`
    const inputRef = useRef<HTMLInputElement | null>(null)
    const s = sizes[size]
    const isActive = isChecked || indeterminate

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate
    }, [indeterminate])

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <label
          htmlFor={checkboxId}
          className={cn(
            "flex items-start gap-2.5 cursor-pointer",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <div className={cn("relative mt-0.5 shrink-0", s.box)}>
            <input
              ref={(node) => {
                inputRef.current = node
                if (typeof ref === "function") ref(node)
                else if (ref) ref.current = node
              }}
              type="checkbox"
              id={checkboxId}
              className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              aria-invalid={error ? true : undefined}
              aria-describedby={error || description ? messageId : undefined}
              aria-checked={indeterminate ? "mixed" : isChecked}
              checked={isChecked}
              disabled={disabled}
              onChange={(e) => {
                if (checked === undefined) setIsChecked(e.target.checked)
                onChange?.(e)
              }}
              {...props}
            />
            <div
              className={cn(
                "w-full h-full border-2 flex items-center justify-center transition-colors duration-[120ms] peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg",
                s.box,
                isActive
                  ? "bg-accent-600 border-accent-600 dark:bg-accent-500 dark:border-accent-500"
                  : error
                  ? "bg-transparent border-red-500/50"
                  : "bg-transparent border-black/25 dark:border-white/25",
              )}
            >
              <AnimatePresence mode="wait">
                {indeterminate ? (
                  <motion.svg
                    key="minus"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    width={s.check}
                    height={s.check}
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M3 7h8" />
                  </motion.svg>
                ) : isChecked ? (
                  <motion.svg
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 30 }}
                    width={s.check}
                    height={s.check}
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.5 7l3 3 6-6" />
                  </motion.svg>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {(label || description) && (
            <div className="min-w-0">
              {label && (
                <p className={cn("font-medium text-foreground leading-snug", s.label)}>
                  {label}
                </p>
              )}
              {description && (
                <p id={!error ? messageId : undefined} className={cn("mt-0.5 text-muted-foreground", s.desc)}>{description}</p>
              )}
            </div>
          )}
        </label>
        {error && <p id={messageId} aria-live="polite" className={cn(fieldErrorStyles, "ml-[26px]")}>{error}</p>}
      </div>
    )
  },
)

Checkbox.displayName = "Checkbox"

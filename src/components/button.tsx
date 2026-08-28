"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { Slot } from "@/components/slot"
import { ButtonHTMLAttributes, ReactNode, forwardRef, memo } from "react"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive" | "link"
export type ButtonSize = "sm" | "md" | "lg" | "icon"

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconPosition?: "left" | "right"
  /** End-to-end override */
  variantClassName?: string
  unstyled?: boolean
  /** When true, merges props onto the single child via Slot (Radix-style). */
  asChild?: boolean
}

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary hover:bg-primary-hover active:bg-primary-hover",
    "text-primary-foreground font-semibold",
    "border border-primary shadow-xs",
  ].join(" "),

  secondary: [
    "bg-surface hover:bg-surface-muted active:bg-muted",
    "text-foreground font-medium",
    "border border-border hover:border-border-strong shadow-xs",
  ].join(" "),

  ghost: [
    "bg-transparent",
    "hover:bg-muted active:bg-surface-muted",
    "text-muted-foreground font-medium hover:text-foreground",
  ].join(" "),

  outline: [
    "bg-transparent",
    "border border-border-strong hover:border-foreground/35",
    "text-foreground font-medium hover:bg-muted",
  ].join(" "),

  destructive: [
    "bg-destructive hover:bg-destructive-hover active:bg-destructive-hover",
    "text-destructive-foreground font-semibold",
    "border border-transparent shadow-xs",
  ].join(" "),

  link: "h-auto bg-transparent p-0 text-accent-700 underline-offset-4 hover:underline dark:text-accent-300",
}

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-[var(--radius-md)] gap-1.5",
  md: "h-9 px-4 text-sm rounded-[var(--radius-lg)] gap-2",
  lg: "h-10 px-5 text-sm rounded-[var(--radius-lg)] gap-2.5",
  icon: "size-9 rounded-[var(--radius-md)] p-0",
}

const ButtonInner = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      variantClassName,
      unstyled = false,
      asChild = false,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading
    // Loading with children: preserve width via invisible duplicate; spinner centered (§24).
    const loadingWithChildren = loading && children != null && children !== ""

    if (unstyled) {
      if (asChild) return <Slot ref={ref as any} className={cn(className, variantClassName)} {...(props as any)}>{children}</Slot>
      return <button ref={ref} type={type} disabled={isDisabled} className={cn(className, variantClassName)} {...props}>{loading ? "Loading…" : children}</button>
    }

    const buttonClassName = cn(
      "inline-flex items-center justify-center cursor-pointer select-none whitespace-nowrap",
      "transition-[color,background-color,border-color,box-shadow] duration-150",
      "disabled:opacity-40 disabled:cursor-not-allowed",
      focusRingStyles,
      buttonVariants[variant],
      variantClassName,
      buttonSizes[size],
      loadingWithChildren && "relative",
      className,
    )

    if (asChild) {
      return (
        <Slot
          ref={ref as any}
          className={buttonClassName}
          data-loading={loading || undefined}
          aria-busy={loading || undefined}
          aria-disabled={isDisabled || undefined}
          {...(props as any)}
        >
          {children as any}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        type={type}
        data-loading={loading || undefined}
        className={buttonClassName}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loadingWithChildren ? (
          <>
            <span className="invisible inline-flex items-center gap-2">
              {icon && iconPosition === "left" && <span className="shrink-0 w-3.5 h-3.5" />}
              <span>{children}</span>
              {icon && iconPosition === "right" && <span className="shrink-0 w-3.5 h-3.5" />}
            </span>
            <span className="absolute inset-0 inline-flex items-center justify-center">
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </span>
          </>
        ) : (
          <>
            {loading && (
              <svg className="animate-spin shrink-0 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {!loading && icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
            {children && <span>{children}</span>}
            {!loading && icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
          </>
        )}
      </button>
    )
  },
)
ButtonInner.displayName = "Button"
export const Button = memo(ButtonInner)

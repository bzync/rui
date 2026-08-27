import { cn } from "@/lib/cn"
import { HTMLAttributes, ReactNode, forwardRef } from "react"

export type CurrencyTone = "auto" | "default" | "positive" | "negative" | "muted"
export type CurrencySize = "xs" | "sm" | "md" | "lg" | "xl"

export type CurrencyFormatOptions = Omit<
  Intl.NumberFormatOptions,
  "style" | "currency" | "currencySign"
>

const toneStyles: Record<Exclude<CurrencyTone, "auto">, string> = {
  default: "text-foreground",
  positive: "text-success",
  negative: "text-destructive",
  muted: "text-muted-foreground",
}

const sizeStyles: Record<CurrencySize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl",
}

function isNegative(value: number | bigint) {
  return typeof value === "bigint" ? value < 0n : value < 0
}

function isValidValue(value: number | bigint) {
  return typeof value === "bigint" || Number.isFinite(value)
}

export interface FormatCurrencyOptions {
  currency?: string
  locale?: Intl.LocalesArgument
  accounting?: boolean
  options?: CurrencyFormatOptions
}

export function formatCurrency(value: number | bigint, {
  currency = "USD",
  locale = "en-US",
  accounting = false,
  options,
}: FormatCurrencyOptions = {}) {
  if (!isValidValue(value)) return null

  try {
    return new Intl.NumberFormat(locale, {
      ...options,
      style: "currency",
      currency,
      currencySign: accounting ? "accounting" : "standard",
    }).format(value)
  } catch {
    return null
  }
}

export interface CurrencyProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children">, FormatCurrencyOptions {
  value: number | bigint
  tone?: CurrencyTone
  size?: CurrencySize
  fallback?: ReactNode
}

export const Currency = forwardRef<HTMLSpanElement, CurrencyProps>(({
  value,
  currency = "USD",
  locale = "en-US",
  accounting = false,
  options,
  tone = "auto",
  size = "md",
  fallback = "—",
  className,
  ...props
}, ref) => {
  const formatted = formatCurrency(value, { currency, locale, accounting, options })
  const resolvedTone = tone === "auto" ? (isNegative(value) ? "negative" : "default") : tone
  const accessibleLabel = options?.notation === "compact"
    ? formatCurrency(value, { currency, locale, accounting, options: { ...options, notation: "standard" } }) ?? undefined
    : undefined

  return (
    <span
      ref={ref}
      data-invalid={formatted === null ? true : undefined}
      aria-label={accessibleLabel}
      className={cn(
        "inline whitespace-nowrap font-medium tabular-nums",
        toneStyles[resolvedTone],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {formatted ?? fallback}
    </span>
  )
})
Currency.displayName = "Currency"

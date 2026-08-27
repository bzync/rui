import { cn } from "@/lib/cn"
import { CurrencyFormatOptions, formatCurrency } from "@/components/currency"
import { ElementType, HTMLAttributes, ReactNode, forwardRef } from "react"

export type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
export type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
export type TypographyTone = "default" | "muted" | "accent"
export type TypographyWeight = "normal" | "medium" | "semibold" | "bold"

const headingSizes: Record<HeadingSize, string> = {
  xs: "text-base leading-6 sm:text-lg sm:leading-7",
  sm: "text-lg leading-7 sm:text-xl sm:leading-8",
  md: "text-xl leading-8 sm:text-2xl sm:leading-9",
  lg: "text-2xl leading-9 sm:text-3xl sm:leading-10",
  xl: "text-3xl leading-10 sm:text-4xl sm:leading-[2.9rem] lg:text-5xl lg:leading-[3.5rem]",
  "2xl": "text-4xl leading-[2.9rem] sm:text-5xl sm:leading-[3.5rem] lg:text-6xl lg:leading-[4.25rem]",
}

const defaultHeadingSizes: Record<HeadingElement, HeadingSize> = {
  h1: "2xl",
  h2: "xl",
  h3: "lg",
  h4: "md",
  h5: "sm",
  h6: "xs",
}

const toneStyles: Record<TypographyTone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  accent: "text-accent-700 dark:text-accent-300",
}

const weightStyles: Record<TypographyWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingElement
  size?: HeadingSize
  tone?: TypographyTone
  weight?: TypographyWeight
  balance?: boolean
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({
  as = "h2",
  size,
  tone = "default",
  weight = "semibold",
  balance = true,
  className,
  ...props
}, ref) => {
  const Component = as
  return (
    <Component
      ref={ref}
      className={cn(
        "min-w-0 font-display tracking-tight",
        headingSizes[size ?? defaultHeadingSizes[as]],
        toneStyles[tone],
        weightStyles[weight],
        balance && "text-balance",
        className,
      )}
      {...props}
    />
  )
})
Heading.displayName = "Heading"

export type TextElement = "p" | "span" | "div" | "time"
export type TextVariant = "body" | "lead" | "muted" | "caption" | "overline" | "date" | "time" | "currency"
export type TextSize = "xs" | "sm" | "md" | "lg"
export type TextAlign = "left" | "center" | "right"
export type TextWrap = "normal" | "nowrap" | "balance" | "pretty"

const textVariants: Record<TextVariant, string> = {
  body: "text-base leading-7 text-foreground",
  lead: "text-lg leading-8 text-muted-foreground",
  muted: "text-sm leading-6 text-muted-foreground",
  caption: "text-xs leading-5 text-muted-foreground",
  overline: "text-xs leading-5 font-semibold uppercase tracking-wider text-muted-foreground",
  date: "text-sm leading-6 text-foreground tabular-nums",
  time: "text-sm leading-6 text-foreground tabular-nums",
  currency: "text-sm leading-6 font-medium text-foreground tabular-nums",
}

const textSizes: Record<TextSize, string> = {
  xs: "text-xs leading-5",
  sm: "text-sm leading-6",
  md: "text-base leading-7",
  lg: "text-lg leading-8",
}

const textAlignments: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

const textWrapStyles: Record<TextWrap, string> = {
  normal: "whitespace-normal",
  nowrap: "truncate whitespace-nowrap",
  balance: "text-balance",
  pretty: "text-pretty",
}

export type TextFormatValue = Date | number | bigint | string

interface ParsedTextValue {
  date: Date
  dateTime: string
  dateOnly?: boolean
}

function parseDateTextValue(value: TextFormatValue): ParsedTextValue | null {
  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? { date: value, dateTime: value.toISOString() } : null
  }
  if (typeof value === "number") {
    const date = new Date(value)
    return Number.isFinite(date.getTime()) ? { date, dateTime: date.toISOString() } : null
  }
  if (typeof value === "bigint") return null

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (dateOnly) {
    const year = Number(dateOnly[1])
    const month = Number(dateOnly[2])
    const day = Number(dateOnly[3])
    const date = new Date(Date.UTC(year, month - 1, day, 12))
    const valid = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
    return valid ? { date, dateTime: value, dateOnly: true } : null
  }

  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? { date, dateTime: value } : null
}

function parseTimeTextValue(value: TextFormatValue): ParsedTextValue | null {
  if (typeof value === "string") {
    const timeOnly = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(value)
    if (timeOnly) {
      return {
        date: new Date(1970, 0, 1, Number(timeOnly[1]), Number(timeOnly[2]), Number(timeOnly[3] ?? 0)),
        dateTime: value,
      }
    }
  }
  return parseDateTextValue(value)
}

function formatTextValue(
  variant: "date" | "time",
  value: TextFormatValue,
  locale: Intl.LocalesArgument,
  timeZone?: string,
  hour12?: boolean,
  formatOptions?: Intl.DateTimeFormatOptions,
) {
  const parsed = variant === "date" ? parseDateTextValue(value) : parseTimeTextValue(value)
  if (!parsed) return { formatted: null, parsed: null }

  try {
    const hasStyle = variant === "date" ? formatOptions?.dateStyle !== undefined : formatOptions?.timeStyle !== undefined
    const defaults: Intl.DateTimeFormatOptions = variant === "date"
      ? hasStyle ? {} : { year: "numeric", month: "short", day: "numeric" }
      : hasStyle ? {} : { hour: "numeric", minute: "2-digit" }
    const formatted = new Intl.DateTimeFormat(locale, {
      ...defaults,
      ...formatOptions,
      ...(parsed.dateOnly ? { timeZone: "UTC" } : timeZone ? { timeZone } : {}),
      ...(variant === "time" && hour12 !== undefined ? { hour12 } : {}),
    }).format(parsed.date)
    return { formatted, parsed }
  } catch {
    return { formatted: null, parsed }
  }
}

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: TextElement
  variant?: TextVariant
  size?: TextSize
  weight?: TypographyWeight
  align?: TextAlign
  wrap?: TextWrap
  children?: ReactNode
  value?: TextFormatValue
  locale?: Intl.LocalesArgument
  timeZone?: string
  hour12?: boolean
  formatOptions?: Intl.DateTimeFormatOptions
  currency?: string
  accounting?: boolean
  currencyOptions?: CurrencyFormatOptions
  dateTime?: string
  fallback?: ReactNode
}

export const Text = forwardRef<HTMLElement, TextProps>(({
  as,
  variant = "body",
  size,
  weight,
  align = "left",
  wrap,
  children,
  value,
  locale = "en-US",
  timeZone,
  hour12,
  formatOptions,
  currency = "USD",
  accounting = false,
  currencyOptions,
  dateTime,
  fallback = "—",
  className,
  ...props
}, ref) => {
  const temporalVariant = variant === "date" || variant === "time" ? variant : null
  const currencyVariant = variant === "currency"
  const Component = (as ?? (temporalVariant ? "time" : currencyVariant ? "span" : "p")) as ElementType
  const result = temporalVariant && value !== undefined
    ? formatTextValue(temporalVariant, value, locale, timeZone, hour12, formatOptions)
    : null
  const currencyResult = currencyVariant && (typeof value === "number" || typeof value === "bigint")
    ? formatCurrency(value, { currency, locale, accounting, options: currencyOptions })
    : null
  const formattedVariant = temporalVariant !== null || currencyVariant
  const invalid = formattedVariant && value !== undefined && (temporalVariant ? result?.formatted === null : currencyResult === null)
  const resolvedWrap = wrap ?? (formattedVariant ? "nowrap" : "normal")
  return (
    <Component
      ref={ref}
      dateTime={Component === "time" ? dateTime ?? result?.parsed?.dateTime : undefined}
      data-invalid={invalid ? true : undefined}
      className={cn(
        "min-w-0",
        textVariants[variant],
        size && textSizes[size],
        weight && weightStyles[weight],
        textAlignments[align],
        textWrapStyles[resolvedWrap],
        currencyVariant && (typeof value === "bigint" ? value < 0n : typeof value === "number" && value < 0) && "text-destructive",
        className,
      )}
      {...props}
    >
      {temporalVariant && value !== undefined
        ? result?.formatted ?? fallback
        : currencyVariant && value !== undefined
          ? currencyResult ?? fallback
          : children}
    </Component>
  )
})
Text.displayName = "Text"

export type TimeProps = Omit<TextProps, "variant" | "currency" | "currencyOptions" | "accounting">

export const Time = forwardRef<HTMLElement, TimeProps>((props, ref) => (
  <Text ref={ref} variant="time" {...props} />
))
Time.displayName = "Time"

export type ProseElement = "div" | "article" | "section"
export type ProseSize = "sm" | "md" | "lg"
export type ProseWidth = "none" | "sm" | "md" | "lg"

const proseSizes: Record<ProseSize, string> = {
  sm: "text-sm leading-6",
  md: "text-base leading-7",
  lg: "text-lg leading-8",
}

const proseWidths: Record<ProseWidth, string> = {
  none: "max-w-none",
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
}

const proseAnatomyStyles = [
  "break-words text-foreground",
  "[&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:tracking-tight sm:[&_h1]:text-4xl",
  "[&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-tight",
  "[&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-snug",
  "[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:font-display [&_h4]:text-lg [&_h4]:font-semibold",
  "[&_p]:my-4 [&_p]:text-muted-foreground",
  "[&_strong]:font-semibold [&_strong]:text-foreground",
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6",
  "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6",
  "[&_li]:pl-1 [&_li]:text-muted-foreground [&_li::marker]:text-border-strong",
  "[&_a]:rounded-sm [&_a]:font-medium [&_a]:text-accent-700 [&_a]:underline [&_a]:decoration-accent-300 [&_a]:underline-offset-4 hover:[&_a]:text-accent-800",
  "[&_a]:focus-visible:outline-none [&_a]:focus-visible:ring-2 [&_a]:focus-visible:ring-focus-ring/35",
  "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
  "[&_code]:rounded-md [&_code]:border [&_code]:border-border [&_code]:bg-surface-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em] [&_code]:text-foreground",
  "[&_pre]:my-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface-muted [&_pre]:p-4",
  "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_hr]:my-8 [&_hr]:border-border",
  "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg",
  "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_th]:border-b [&_th]:border-border [&_th]:p-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold",
  "[&_td]:border-b [&_td]:border-border [&_td]:p-2 [&_td]:align-top [&_td]:text-sm [&_td]:text-muted-foreground",
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
].join(" ")

export interface ProseProps extends HTMLAttributes<HTMLElement> {
  as?: ProseElement
  size?: ProseSize
  width?: ProseWidth
}

export const Prose = forwardRef<HTMLElement, ProseProps>(({
  as = "article",
  size = "md",
  width = "sm",
  className,
  ...props
}, ref) => {
  const Component = as as ElementType
  return (
    <Component
      ref={ref}
      className={cn("w-full min-w-0", proseSizes[size], proseWidths[width], proseAnatomyStyles, className)}
      {...props}
    />
  )
})
Prose.displayName = "Prose"

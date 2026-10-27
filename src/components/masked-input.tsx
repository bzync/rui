"use client"

import { cn } from "@/lib/cn"
import { mergeRefs } from "@/lib/merge-refs"
import { useControllableState } from "@/hooks/use-controllable-state"
import { type ChangeEvent, type FocusEvent, forwardRef, useMemo, useRef, useState } from "react"
import { Input, type InputProps } from "./input"

/* ------------------------------------------------------------------ */
/* Shared caret handling                                               */
/* ------------------------------------------------------------------ */

/**
 * Re-formats the input and puts the caret back after the same number of
 * "significant" characters (digits, letters…) it had before, so typing or
 * deleting in the middle of a formatted value does not jump to the end.
 */
function applyFormatted(input: HTMLInputElement, formatted: string, isSignificant: (char: string) => boolean) {
  const caret = input.selectionStart ?? input.value.length
  const significantBefore = Array.from(input.value.slice(0, caret)).filter(isSignificant).length
  input.value = formatted
  let position = 0
  let seen = 0
  while (position < formatted.length && seen < significantBefore) {
    if (isSignificant(formatted[position])) seen += 1
    position += 1
  }
  if (document.activeElement === input) input.setSelectionRange(position, position)
}

/* ------------------------------------------------------------------ */
/* MaskedInput                                                         */
/* ------------------------------------------------------------------ */

export interface MaskedInputProps extends Omit<InputProps, "value" | "defaultValue" | "onChange"> {
  /** Pattern: `9` digit, `a` letter, `*` letter or digit; anything else is a literal. E.g. `"(999) 999-9999"`. */
  mask: string
  /** Controlled raw value (slot characters only, no literals). */
  value?: string
  defaultValue?: string
  /** Receives the raw value, the formatted text and whether every slot is filled. */
  onValueChange?: (raw: string, formatted: string, complete: boolean) => void
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const SLOT: Record<string, RegExp> = { "9": /\d/, a: /[A-Za-z]/, "*": /[A-Za-z0-9]/ }
const isSlotChar = (char: string) => /[A-Za-z0-9]/.test(char)

export function applyMask(mask: string, raw: string): { raw: string; formatted: string; complete: boolean } {
  let formatted = ""
  let accepted = ""
  let index = 0
  const chars = Array.from(raw).filter(isSlotChar)
  for (const token of mask) {
    if (index >= chars.length) break
    const slot = SLOT[token]
    if (!slot) { formatted += token; continue }
    // Drop characters that do not fit this slot.
    while (index < chars.length && !slot.test(chars[index])) index += 1
    if (index >= chars.length) break
    formatted += chars[index]
    accepted += chars[index]
    index += 1
  }
  const slots = Array.from(mask).filter((token) => SLOT[token]).length
  return { raw: accepted, formatted, complete: accepted.length === slots }
}

/** Free-form input mask for codes, dates, card numbers and IDs. */
export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(function MaskedInput({
  mask,
  value,
  defaultValue = "",
  onValueChange,
  onChange,
  placeholder,
  inputMode,
  ...props
}, ref) {
  const [raw, setRaw] = useControllableState({ value, defaultValue, onChange: undefined })
  const inputRef = useRef<HTMLInputElement>(null)
  const formatted = applyMask(mask, raw).formatted
  const numeric = !/[a*]/.test(mask)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = applyMask(mask, event.target.value)
    applyFormatted(event.target, next.formatted, isSlotChar)
    setRaw(next.raw)
    onValueChange?.(next.raw, next.formatted, next.complete)
    onChange?.(event)
  }

  return (
    <Input
      ref={mergeRefs(inputRef, ref)}
      {...props}
      value={formatted}
      onChange={handleChange}
      inputMode={inputMode ?? (numeric ? "numeric" : "text")}
      placeholder={placeholder ?? mask.replace(/[9a*]/g, "_")}
      maxLength={mask.length}
    />
  )
})
MaskedInput.displayName = "MaskedInput"

/* ------------------------------------------------------------------ */
/* CurrencyInput                                                       */
/* ------------------------------------------------------------------ */

export interface CurrencyInputProps extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "prefix" | "type"> {
  /** Controlled amount; `null` when empty. */
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number | null) => void
  /** ISO 4217 code. Default "USD". */
  currency?: string
  locale?: string
  /** Fraction digits; defaults to the currency's own (2 for USD, 0 for JPY). */
  decimals?: number
  min?: number
  max?: number
  allowNegative?: boolean
  /** Hides the currency symbol prefix (e.g. when the label already names it). */
  hideSymbol?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

function currencyParts(locale: string | undefined, currency: string) {
  const format = new Intl.NumberFormat(locale, { style: "currency", currency })
  const parts = format.formatToParts(-1234.5)
  const group = new Intl.NumberFormat(locale).formatToParts(1234.5).find((part) => part.type === "group")?.value ?? ","
  const decimal = new Intl.NumberFormat(locale).formatToParts(1.5).find((part) => part.type === "decimal")?.value ?? "."
  return {
    symbol: parts.find((part) => part.type === "currency")?.value ?? currency,
    symbolAfter: parts.findIndex((part) => part.type === "currency") > parts.findIndex((part) => part.type === "integer"),
    fraction: format.resolvedOptions().maximumFractionDigits ?? 2,
    group,
    decimal,
  }
}

/**
 * Amount input that groups thousands as you type in the locale's format and
 * pads decimals on blur, while reporting a plain number.
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput({
  value,
  defaultValue = null,
  onValueChange,
  currency = "USD",
  locale,
  decimals,
  min,
  max,
  allowNegative = false,
  hideSymbol = false,
  onChange,
  onBlur,
  onFocus,
  suffix,
  placeholder,
  ...props
}, ref) {
  const meta = useMemo(() => currencyParts(locale, currency), [locale, currency])
  const fraction = decimals ?? meta.fraction
  const [amount, setAmount] = useControllableState<number | null>({ value, defaultValue, onChange: onValueChange })
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState<string | null>(null)

  const groupInteger = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, meta.group)
  const formatFull = (number: number | null) => {
    if (number === null) return ""
    const [int, frac = ""] = Math.abs(number).toFixed(fraction).split(".")
    return (number < 0 ? "-" : "") + groupInteger(int) + (fraction ? meta.decimal + frac : "")
  }

  /** Normalizes typed text: keeps digits, one decimal separator and a leading minus. */
  const clean = (text: string) => {
    const negative = allowNegative && text.trim().startsWith("-")
    const [intRaw, ...rest] = text.split(meta.decimal)
    const int = intRaw.replace(/\D/g, "").replace(/^0+(?=\d)/, "")
    const frac = rest.join("").replace(/\D/g, "").slice(0, fraction)
    const hasDecimal = fraction > 0 && rest.length > 0
    const display = (negative ? "-" : "") + groupInteger(int) + (hasDecimal ? meta.decimal + frac : "")
    const numeric = int || frac ? Number(`${negative ? "-" : ""}${int || "0"}.${frac || "0"}`) : null
    return { display, numeric }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { display, numeric } = clean(event.target.value)
    applyFormatted(event.target, display, (char) => /\d/.test(char) || char === meta.decimal || char === "-")
    setDraft(display)
    setAmount(numeric)
    onChange?.(event)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    setDraft(null)
    if (amount !== null) {
      const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, amount))
      const rounded = Number(clamped.toFixed(fraction))
      if (rounded !== amount) setAmount(rounded)
    }
    onBlur?.(event)
  }

  const symbol = hideSymbol ? null : <span aria-hidden="true">{meta.symbol}</span>
  const text = focused && draft !== null ? draft : formatFull(amount)

  return (
    <Input
      ref={ref}
      {...props}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={text}
      placeholder={placeholder ?? formatFull(0)}
      onChange={handleChange}
      onFocus={(event) => { setFocused(true); setDraft(formatFull(amount)); onFocus?.(event) }}
      onBlur={handleBlur}
      prefix={meta.symbolAfter ? undefined : symbol}
      suffix={suffix ?? (meta.symbolAfter ? symbol : undefined)}
      aria-description={hideSymbol ? undefined : `Amount in ${currency}`}
      inputClassName={cn("tabular-nums", props.inputClassName)}
    />
  )
})
CurrencyInput.displayName = "CurrencyInput"

/* ------------------------------------------------------------------ */
/* PhoneInput                                                          */
/* ------------------------------------------------------------------ */

export interface PhoneCountry {
  /** ISO 3166 alpha-2 code. */
  code: string
  name: string
  dialCode: string
  /** National number mask, `9` per digit. */
  mask: string
}

export const defaultPhoneCountries: PhoneCountry[] = [
  { code: "US", name: "United States", dialCode: "1", mask: "(999) 999-9999" },
  { code: "CA", name: "Canada", dialCode: "1", mask: "(999) 999-9999" },
  { code: "GB", name: "United Kingdom", dialCode: "44", mask: "9999 999999" },
  { code: "AU", name: "Australia", dialCode: "61", mask: "999 999 999" },
  { code: "DE", name: "Germany", dialCode: "49", mask: "9999 9999999" },
  { code: "FR", name: "France", dialCode: "33", mask: "9 99 99 99 99" },
  { code: "IN", name: "India", dialCode: "91", mask: "99999 99999" },
  { code: "JP", name: "Japan", dialCode: "81", mask: "99 9999 9999" },
  { code: "PH", name: "Philippines", dialCode: "63", mask: "999 999 9999" },
  { code: "SG", name: "Singapore", dialCode: "65", mask: "9999 9999" },
]

export interface PhoneInputProps extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "prefix" | "type"> {
  /** Controlled national digits (no dial code, no formatting). */
  value?: string
  defaultValue?: string
  /** Receives the national digits, the E.164 number (`+15551234567`) and whether it is complete. */
  onValueChange?: (digits: string, e164: string, complete: boolean) => void
  country?: string
  defaultCountry?: string
  onCountryChange?: (code: string) => void
  countries?: PhoneCountry[]
  countryLabel?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

/** Phone number input with a country selector and per-country formatting. */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput({
  value,
  defaultValue = "",
  onValueChange,
  country: countryProp,
  defaultCountry = "US",
  onCountryChange,
  countries = defaultPhoneCountries,
  countryLabel = "Country code",
  onChange,
  disabled,
  size = "md",
  placeholder,
  ...props
}, ref) {
  const [code, setCode] = useControllableState({ value: countryProp, defaultValue: defaultCountry, onChange: onCountryChange })
  const [digits, setDigits] = useControllableState({ value, defaultValue, onChange: undefined })
  const country = countries.find((item) => item.code === code) ?? countries[0]
  const masked = applyMask(country.mask, digits)

  const emit = (nextDigits: string, nextCountry: PhoneCountry) => {
    const result = applyMask(nextCountry.mask, nextDigits)
    onValueChange?.(result.raw, result.raw ? `+${nextCountry.dialCode}${result.raw}` : "", result.complete)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = applyMask(country.mask, event.target.value)
    applyFormatted(event.target, next.formatted, (char) => /\d/.test(char))
    setDigits(next.raw)
    emit(next.raw, country)
    onChange?.(event)
  }

  return (
    <Input
      ref={ref}
      {...props}
      size={size}
      disabled={disabled}
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      value={masked.formatted}
      placeholder={placeholder ?? country.mask.replace(/9/g, "0")}
      onChange={handleChange}
      prefix={
        <span className="relative -ml-1 flex items-center">
          <select
            aria-label={countryLabel}
            value={country.code}
            disabled={disabled}
            onChange={(event) => {
              const next = countries.find((item) => item.code === event.target.value) ?? countries[0]
              setCode(next.code)
              emit(digits, next)
            }}
            className="h-7 cursor-pointer appearance-none rounded-md bg-transparent py-0 pl-1.5 pr-5 text-sm text-foreground outline-none hover:bg-foreground/6 focus-visible:ring-2 focus-visible:ring-focus-ring/50 disabled:cursor-not-allowed"
          >
            {countries.map((item) => (
              <option key={item.code} value={item.code}>{`${item.code} +${item.dialCode}`}</option>
            ))}
          </select>
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-1.5 text-muted-foreground"><path d="m6 9 6 6 6-6" /></svg>
          <span aria-hidden="true" className="ml-1.5 h-4 w-px bg-border" />
        </span>
      }
    />
  )
})
PhoneInput.displayName = "PhoneInput"

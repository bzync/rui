import { InputHTMLAttributes, ReactNode } from "react"
import type { ControlSize } from "@/lib/component-styles"

export interface AutocompleteOption<V = string> {
  value: V
  label: string
  description?: string
  icon?: ReactNode
  disabled?: boolean
}

export interface AutocompletePropsBase<V = string>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "onSelect" | "prefix" | "size"> {
  /** Static options. Optional with `loadOptions`. */
  options?: AutocompleteOption<V>[]
  /** Submits the selected option value(s) with the form (one entry per value), not the typed text. */
  name?: string
  /** Associates the Autocomplete with a `<form>` elsewhere in the document by its id. */
  form?: string
  /** Requires a selection; enforced by native constraint validation inside a form. */
  required?: boolean
  inputValue?: string
  onInputChange?: (value: string) => void
  label?: string
  hint?: string
  error?: string
  prefix?: ReactNode
  clearable?: boolean
  /** Trigger height and text scale, matching Input and Button. */
  size?: ControlSize
  loading?: boolean
  emptyMessage?: string
  /** Offers "Create “…”" when the text matches no option. */
  creatable?: boolean
  /** Builds the created option (defaults to `{ value: text, label: text }`). */
  onCreate?: (text: string) => AutocompleteOption<V> | void
  /** Text of the create row. */
  createLabel?: (text: string) => string
  /** Async search: return options for the query. Stale requests are aborted. */
  loadOptions?: (query: string, signal: AbortSignal) => Promise<AutocompleteOption<V>[]>
  /** Debounce for loadOptions in ms. Default 250. */
  debounceMs?: number
  maxVisible?: number
  /** Styles the component root. */
  wrapperClassName?: string
  /** Styles the input control surface. */
  triggerClassName?: string
  /** Styles the native text input. */
  inputClassName?: string
  labelClassName?: string
  messageClassName?: string
  /** Styles the portalled options list. */
  listClassName?: string
  optionClassName?: string
  loadingClassName?: string
  emptyClassName?: string
  /** Removes the default component chrome while preserving behavior. */
  unstyled?: boolean
}

export interface AutocompletePropsSingle<V = string> extends AutocompletePropsBase<V> {
  multiple?: false
  /** Controlled selected value; its option label is shown in the input. */
  value?: V | null
  /** Initially selected value when uncontrolled. */
  defaultValue?: V | null
  onSelect?: (option: AutocompleteOption<V>) => void
  onDeselect?: never
}

export interface AutocompletePropsMulti<V = string> extends AutocompletePropsBase<V> {
  multiple: true
  /** Controlled selected values. */
  value?: V[]
  /** Initially selected values when uncontrolled. */
  defaultValue?: V[]
  onSelect?: (option: AutocompleteOption<V>, allSelected: AutocompleteOption<V>[]) => void
  onDeselect?: (option: AutocompleteOption<V>, allSelected: AutocompleteOption<V>[]) => void
}

export type AutocompleteProps<V = string> = AutocompletePropsSingle<V> | AutocompletePropsMulti<V>

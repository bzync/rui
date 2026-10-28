import type { ControlSize } from "@/lib/component-styles"
import { ReactNode } from "react"

/** `error` is a deprecated alias of `danger`. */
export type SelectOptionColor = "default" | "success" | "warning" | "danger" | "info" | "error"

export interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: ReactNode
  disabled?: boolean
  color?: SelectOptionColor
}

export interface SelectOptionGroup {
  group: string
  options: SelectOption[]
}

export type SelectItem = SelectOption | SelectOptionGroup

export interface SelectPropsBase {
  options: SelectItem[]
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  /** Enforced by native constraint validation when the Select is inside a form. */
  required?: boolean
  /** Submits the selection with the form: one `name=value` entry per selected value. */
  name?: string
  /** Associates the Select with a `<form>` elsewhere in the document by its id. */
  form?: string
  clearable?: boolean
  /** Trigger height and text scale, matching Input and Button. */
  size?: ControlSize
  className?: string
  wrapperClassName?: string
  triggerClassName?: string
  listClassName?: string
  labelClassName?: string
  messageClassName?: string
  optionClassName?: string
  groupLabelClassName?: string
  id?: string
  unstyled?: boolean
}

export interface SelectPropsSingle extends SelectPropsBase {
  multiple?: false
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onValueChange?: (value: string) => void
}

export interface SelectPropsMulti extends SelectPropsBase {
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  onValueChange?: (value: string[]) => void
}

export type SelectSingleProps = SelectPropsSingle
export type SelectMultiProps = SelectPropsMulti

export type SelectProps = SelectPropsSingle | SelectPropsMulti

export interface FlatOption extends SelectOption { flatIdx: number }

export interface MenuPos {
  top: number
  left: number
  width: number
  maxHeight: number
  placement: "top" | "bottom"
}

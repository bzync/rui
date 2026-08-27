import { forwardRef } from "react"
import { SelectSingle } from "./select/select-single"
import { SelectMulti } from "./select/select-multi"
import type { SelectPropsSingle, SelectProps } from "./select/types"

export type {
  SelectOptionColor,
  SelectOption,
  SelectOptionGroup,
  SelectItem,
  SelectPropsBase,
  SelectPropsSingle,
  SelectPropsMulti,
  SelectProps,
} from "./select/types"

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (props, ref) => {
    if (props.multiple) return <SelectMulti {...props} ref={ref} />
    return <SelectSingle {...(props as SelectPropsSingle)} ref={ref} />
  },
)

Select.displayName = "Select"

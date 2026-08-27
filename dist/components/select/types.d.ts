import { ReactNode } from 'react';
export type SelectOptionColor = "default" | "success" | "warning" | "error" | "info";
export interface SelectOption {
    value: string;
    label: string;
    description?: string;
    icon?: ReactNode;
    disabled?: boolean;
    color?: SelectOptionColor;
}
export interface SelectOptionGroup {
    group: string;
    options: SelectOption[];
}
export type SelectItem = SelectOption | SelectOptionGroup;
export interface SelectPropsBase {
    options: SelectItem[];
    placeholder?: string;
    label?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    clearable?: boolean;
    className?: string;
    wrapperClassName?: string;
    triggerClassName?: string;
    listClassName?: string;
    id?: string;
    unstyled?: boolean;
}
export interface SelectPropsSingle extends SelectPropsBase {
    multiple?: false;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
}
export interface SelectPropsMulti extends SelectPropsBase {
    multiple: true;
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
}
export type SelectProps = SelectPropsSingle | SelectPropsMulti;
export interface FlatOption extends SelectOption {
    flatIdx: number;
}
export interface MenuPos {
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    placement: "top" | "bottom";
}

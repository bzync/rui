import { InputHTMLAttributes, ReactNode } from 'react';
export interface AutocompleteOption<V = string> {
    value: V;
    label: string;
    description?: string;
    icon?: ReactNode;
    disabled?: boolean;
}
export interface AutocompletePropsBase<V = string> extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onSelect" | "prefix"> {
    options: AutocompleteOption<V>[];
    inputValue?: string;
    onInputChange?: (value: string) => void;
    label?: string;
    hint?: string;
    error?: string;
    prefix?: ReactNode;
    clearable?: boolean;
    loading?: boolean;
    emptyMessage?: string;
    maxVisible?: number;
}
export interface AutocompletePropsSingle<V = string> extends AutocompletePropsBase<V> {
    multiple?: false;
    value?: V | null;
    onSelect?: (option: AutocompleteOption<V>) => void;
    onDeselect?: never;
}
export interface AutocompletePropsMulti<V = string> extends AutocompletePropsBase<V> {
    multiple: true;
    value?: V[];
    onSelect?: (option: AutocompleteOption<V>, allSelected: AutocompleteOption<V>[]) => void;
    onDeselect?: (option: AutocompleteOption<V>, allSelected: AutocompleteOption<V>[]) => void;
}
export type AutocompleteProps<V = string> = AutocompletePropsSingle<V> | AutocompletePropsMulti<V>;

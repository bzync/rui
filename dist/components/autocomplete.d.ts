import { AutocompleteProps } from './autocomplete/types';
export type { AutocompleteOption, AutocompleteProps, AutocompletePropsSingle, AutocompletePropsMulti, } from './autocomplete/types';
export declare const Autocomplete: <V = string>(props: AutocompleteProps<V> & {
    ref?: React.Ref<HTMLInputElement>;
}) => React.ReactElement;

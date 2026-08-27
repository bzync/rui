import { FlatOption, MenuPos, SelectItem, SelectOption, SelectOptionColor } from './types';
export declare function OptionList({ listId, listRef, open, pos, options, flat, activeIdx, setActiveIdx, isSelected, onSelect, colorDot, multiselectable, className, }: {
    listId: string;
    listRef: React.RefObject<HTMLUListElement | null>;
    open: boolean;
    pos: MenuPos | null;
    options: SelectItem[];
    flat: FlatOption[];
    activeIdx: number;
    setActiveIdx: (i: number) => void;
    isSelected: (value: string) => boolean;
    onSelect: (opt: SelectOption) => void;
    colorDot: Record<SelectOptionColor, string>;
    multiselectable?: boolean;
    className?: string;
}): import('react').ReactPortal | null;

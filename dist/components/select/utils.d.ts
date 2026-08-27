import { RefObject } from 'react';
import { FlatOption, MenuPos, SelectItem, SelectOptionColor, SelectOptionGroup } from './types';
export declare function isGroup(item: SelectItem): item is SelectOptionGroup;
export declare const colorDot: Record<SelectOptionColor, string>;
export declare function flatten(items: SelectItem[]): FlatOption[];
export declare function useMenuPosition(open: boolean, anchorRef: RefObject<HTMLElement | null>): MenuPos | null;
export declare const XIcon: () => import("react").JSX.Element;
export declare const ChevronIcon: ({ open }: {
    open: boolean;
}) => import("react").JSX.Element;

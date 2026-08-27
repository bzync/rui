import { HTMLAttributes } from 'react';
type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Status = "online" | "offline" | "away" | "busy";
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string;
    name?: string;
    /** Accessible name for the image; defaults to name or empty for decorative */
    alt?: string;
    size?: Size;
    status?: Status;
    /** Defaults to lazy to avoid CLS/LCP penalties */
    loading?: "eager" | "lazy";
    decoding?: "async" | "auto" | "sync";
    referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"];
}
export declare function Avatar({ src, name, alt, size, status, loading, decoding, referrerPolicy, className, ...props }: AvatarProps): import("react").JSX.Element;
export {};

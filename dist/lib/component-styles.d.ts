/** Shared visual anatomy for high-frequency controls. Keep these as static
 * Tailwind strings so the library stylesheet can discover every utility. */
export declare const fieldRootStyles = "flex w-full flex-col gap-1.5";
export declare const fieldLabelStyles = "text-sm font-medium leading-5 text-foreground";
export declare const fieldDescriptionStyles = "text-xs leading-5 text-muted-foreground";
export declare const fieldErrorStyles = "text-xs leading-5 text-destructive";
export declare const controlBaseStyles: string;
export declare const controlInvalidStyles = "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/20";
export declare const focusRingStyles = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
export declare const iconButtonStyles: string;

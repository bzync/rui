import { HTMLAttributes, ReactNode } from 'react';
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<Theme, "system">;
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type ColorPalette = Partial<Record<ColorShade, string>>;
export type ThemeTokens = Partial<Record<`--${string}`, string | number>>;
/** Radius scale — maps to --radius-* */
export type ThemeRadius = Partial<Record<"sm" | "md" | "lg" | "xl" | "2xl" | "full", string>>;
/** Font families — maps to --font-* and scoped rui font variables. */
export interface ThemeFonts {
    /** Main sans stack -> --font-sans & --rui-font-family */
    sans?: string;
    /** Monospace stack -> --font-mono */
    mono?: string;
    /** Display/heading stack -> --font-display & --rui-heading-family */
    display?: string;
    /** Explicit heading override -> --rui-heading-family */
    heading?: string;
}
/** Spacing / padding scale — keys become --spacing-* and --padding-* */
export type ThemeSpacing = Record<string, string>;
/** Shadow scale — maps to --shadow-* */
export type ThemeShadows = Partial<Record<"xs" | "sm" | "md" | "lg" | "xl" | "2xl", string>>;
/** Semantic surface colors */
export interface ThemeColors {
    bg?: string;
    surface?: string;
    surfaceRaised?: string;
    surfaceMuted?: string;
    border?: string;
    borderStrong?: string;
    text?: string;
    muted?: string;
    mutedForeground?: string;
    primary?: string;
    primaryHover?: string;
    primaryForeground?: string;
    danger?: string;
    dangerForeground?: string;
    success?: string;
    warning?: string;
    info?: string;
    focusRing?: string;
}
export interface ThemePalette {
    /** Replaces the blue scale used for primary actions, focus rings, and selected states. */
    accent?: ColorPalette;
    /** Replaces both the slate and gray scales used by text, borders, and neutral surfaces. */
    neutral?: ColorPalette;
    /** Semantic colors (bg, surface, border, etc.) -> --color-* */
    colors?: ThemeColors;
    /** Border radii -> --radius-* */
    radius?: ThemeRadius;
    /** Font stacks -> --font-* / --rui-* */
    fonts?: ThemeFonts;
    /** Spacing / padding -> --spacing-* & --padding-* */
    spacing?: ThemeSpacing;
    /** Shadows -> --shadow-* */
    shadows?: ThemeShadows;
    /** Arbitrary CSS custom properties, such as `--color-bg` or `--radius-lg`. Escape hatch for anything not covered above. */
    tokens?: ThemeTokens;
}
interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}
export interface ThemeProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
    children: ReactNode;
    /** Initial theme when the provider is uncontrolled. */
    defaultTheme?: Theme;
    /** Controlled theme value. */
    theme?: Theme;
    onThemeChange?: (theme: Theme) => void;
    /** localStorage key. Set to false to disable persistence. */
    storageKey?: string | false;
    /** Theme-independent colors and tokens. */
    palette?: ThemePalette;
    /** Overrides only active in light mode. */
    lightPalette?: ThemePalette;
    /** Overrides only active in dark mode. */
    darkPalette?: ThemePalette;
    /** Also sync the theme class to `<html>`, useful for portals and document backgrounds. */
    applyToRoot?: boolean;
}
export declare function ThemeProvider({ children, defaultTheme, theme: controlledTheme, onThemeChange, storageKey, palette, lightPalette, darkPalette, applyToRoot, className, style, ...props }: ThemeProviderProps): import("react").JSX.Element;
export declare function useTheme(): ThemeContextValue;
export {};

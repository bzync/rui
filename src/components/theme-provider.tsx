"use client"

import { cn } from "@/lib/cn"
import type { CSSProperties, HTMLAttributes, ReactNode } from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type Theme = "light" | "dark" | "system"
export type ResolvedTheme = Exclude<Theme, "system">
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
export type ColorPalette = Partial<Record<ColorShade, string>>
export type ThemeTokens = Partial<Record<`--${string}`, string | number>>

/** Radius scale — maps to --radius-* */
export type ThemeRadius = Partial<Record<"sm" | "md" | "lg" | "xl" | "2xl" | "full", string>>
/** Font families — maps to --font-* and scoped rui font variables. */
export interface ThemeFonts {
  /** Main sans stack -> --font-sans & --rui-font-family */
  sans?: string
  /** Monospace stack -> --font-mono */
  mono?: string
  /** Display/heading stack -> --font-display & --rui-heading-family */
  display?: string
  /** Explicit heading override -> --rui-heading-family */
  heading?: string
}
/** Spacing / padding scale — keys become --spacing-* and --padding-* */
export type ThemeSpacing = Record<string, string>
/** Shadow scale — maps to --shadow-* */
export type ThemeShadows = Partial<Record<"xs" | "sm" | "md" | "lg" | "xl" | "2xl", string>>
/** Semantic surface colors */
export interface ThemeColors {
  bg?: string
  surface?: string
  surfaceRaised?: string
  surfaceMuted?: string
  border?: string
  borderStrong?: string
  text?: string
  muted?: string
  mutedForeground?: string
  primary?: string
  primaryHover?: string
  primaryForeground?: string
  danger?: string
  dangerForeground?: string
  success?: string
  warning?: string
  info?: string
  focusRing?: string
}

export interface ThemePalette {
  /** Replaces the blue scale used for primary actions, focus rings, and selected states. */
  accent?: ColorPalette
  /** Replaces both the slate and gray scales used by text, borders, and neutral surfaces. */
  neutral?: ColorPalette
  /** Semantic colors (bg, surface, border, etc.) -> --color-* */
  colors?: ThemeColors
  /** Border radii -> --radius-* */
  radius?: ThemeRadius
  /** Font stacks -> --font-* / --rui-* */
  fonts?: ThemeFonts
  /** Spacing / padding -> --spacing-* & --padding-* */
  spacing?: ThemeSpacing
  /** Shadows -> --shadow-* */
  shadows?: ThemeShadows
  /** Arbitrary CSS custom properties, such as `--color-bg` or `--radius-lg`. Escape hatch for anything not covered above. */
  tokens?: ThemeTokens
}

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export interface ThemeProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  children: ReactNode
  /** Initial theme when the provider is uncontrolled. */
  defaultTheme?: Theme
  /** Controlled theme value. */
  theme?: Theme
  onThemeChange?: (theme: Theme) => void
  /** localStorage key. Set to false to disable persistence. */
  storageKey?: string | false
  /** Theme-independent colors and tokens. */
  palette?: ThemePalette
  /** Overrides only active in light mode. */
  lightPalette?: ThemePalette
  /** Overrides only active in dark mode. */
  darkPalette?: ThemePalette
  /** Also sync the theme class to `<html>`, useful for portals and document backgrounds. */
  applyToRoot?: boolean
}

function systemTheme(): ResolvedTheme {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function paletteStyle(...palettes: Array<ThemePalette | undefined>): CSSProperties {
  const style: Record<string, string | number> = {}
  for (const palette of palettes) {
    if (!palette) continue
    for (const [shade, value] of Object.entries(palette.accent ?? {})) {
      style[`--color-blue-${shade}`] = value
      style[`--color-accent-${shade}`] = value
    }
    for (const [shade, value] of Object.entries(palette.neutral ?? {})) {
      style[`--color-slate-${shade}`] = value
      style[`--color-gray-${shade}`] = value
    }
    if (palette.colors) {
      if (palette.colors.bg !== undefined) style["--color-bg"] = palette.colors.bg
      if (palette.colors.surface !== undefined) style["--color-surface"] = palette.colors.surface
      if (palette.colors.surfaceRaised !== undefined) style["--color-surface-raised"] = palette.colors.surfaceRaised
      if (palette.colors.surfaceMuted !== undefined) style["--color-surface-muted"] = palette.colors.surfaceMuted
      if (palette.colors.border !== undefined) style["--color-border"] = palette.colors.border
      if (palette.colors.borderStrong !== undefined) style["--color-border-strong"] = palette.colors.borderStrong
      if (palette.colors.text !== undefined) { style["--color-text"] = palette.colors.text; style["--color-foreground"] = palette.colors.text }
      if (palette.colors.muted !== undefined) style["--color-muted"] = palette.colors.muted
      if (palette.colors.mutedForeground !== undefined) style["--color-muted-foreground"] = palette.colors.mutedForeground
      if (palette.colors.primary !== undefined) style["--color-primary"] = palette.colors.primary
      if (palette.colors.primaryHover !== undefined) style["--color-primary-hover"] = palette.colors.primaryHover
      if (palette.colors.primaryForeground !== undefined) style["--color-primary-foreground"] = palette.colors.primaryForeground
      if (palette.colors.danger !== undefined) { style["--color-danger"] = palette.colors.danger; style["--color-destructive"] = palette.colors.danger }
      if (palette.colors.dangerForeground !== undefined) style["--color-destructive-foreground"] = palette.colors.dangerForeground
      if (palette.colors.success !== undefined) style["--color-success"] = palette.colors.success
      if (palette.colors.warning !== undefined) style["--color-warning"] = palette.colors.warning
      if (palette.colors.info !== undefined) style["--color-info"] = palette.colors.info
      if (palette.colors.focusRing !== undefined) style["--color-focus-ring"] = palette.colors.focusRing
    }
    if (palette.radius) {
      for (const [k, v] of Object.entries(palette.radius)) style[`--radius-${k}`] = v as string
    }
    if (palette.fonts) {
      if (palette.fonts.sans !== undefined) { style["--font-sans"] = palette.fonts.sans; style["--rui-font-family"] = palette.fonts.sans; style["--rtui-font-family"] = palette.fonts.sans }
      if (palette.fonts.mono !== undefined) style["--font-mono"] = palette.fonts.mono
      if (palette.fonts.display !== undefined) { style["--font-display"] = palette.fonts.display; style["--rui-heading-family"] = palette.fonts.display; style["--rtui-heading-family"] = palette.fonts.display }
      if (palette.fonts.heading !== undefined) { style["--rui-heading-family"] = palette.fonts.heading; style["--rtui-heading-family"] = palette.fonts.heading }
    }
    if (palette.spacing) {
      for (const [k, v] of Object.entries(palette.spacing)) {
        style[`--spacing-${k}`] = v
        style[`--padding-${k}`] = v
      }
    }
    if (palette.shadows) {
      for (const [k, v] of Object.entries(palette.shadows)) style[`--shadow-${k}`] = v as string
    }
    Object.assign(style, palette.tokens)
  }
  return style as CSSProperties
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  theme: controlledTheme,
  onThemeChange,
  storageKey = "rui-theme",
  palette,
  lightPalette,
  darkPalette,
  applyToRoot = false,
  className,
  style,
  ...props
}: ThemeProviderProps) {
  const [internalTheme, setInternalTheme] = useState<Theme>(() => {
    if (controlledTheme || !storageKey || typeof window === "undefined") return defaultTheme
    const stored = window.localStorage.getItem(storageKey) ?? (storageKey === "rui-theme" ? window.localStorage.getItem("rtui-theme") : null)
    return stored === "light" || stored === "dark" || stored === "system" ? stored : defaultTheme
  })
  const [systemValue, setSystemValue] = useState<ResolvedTheme>(systemTheme)
  const theme = controlledTheme ?? internalTheme
  const resolvedTheme = theme === "system" ? systemValue : theme

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => setSystemValue(media.matches ? "dark" : "light")
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  const setTheme = useCallback((nextTheme: Theme) => {
    if (!controlledTheme) setInternalTheme(nextTheme)
    if (storageKey) window.localStorage.setItem(storageKey, nextTheme)
    onThemeChange?.(nextTheme)
  }, [controlledTheme, onThemeChange, storageKey])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme, toggleTheme }), [resolvedTheme, setTheme, theme, toggleTheme])
  const paletteVars = useMemo(
    () => paletteStyle(palette, resolvedTheme === "dark" ? darkPalette : lightPalette),
    [darkPalette, lightPalette, palette, resolvedTheme],
  )
  const customStyle = { ...paletteVars, ...style }

  useEffect(() => {
    if (!applyToRoot) return
    const root = document.documentElement
    const hadDark = root.classList.contains("dark")
    const hadRuiTheme = root.classList.contains("rui-theme")
    const hadRtuiTheme = root.classList.contains("rtui-theme")
    const previousTheme = root.dataset.theme
    const previousColorScheme = root.style.colorScheme
    const previousTokens = Object.keys(paletteVars).map((key) => [key, root.style.getPropertyValue(key)] as const)
    root.classList.toggle("dark", resolvedTheme === "dark")
    root.classList.add("rui-theme", "rtui-theme")
    root.dataset.theme = resolvedTheme
    root.style.colorScheme = resolvedTheme
    for (const [key, tokenValue] of Object.entries(paletteVars)) root.style.setProperty(key, String(tokenValue))
    return () => {
      root.classList.toggle("dark", hadDark)
      root.classList.toggle("rui-theme", hadRuiTheme)
      root.classList.toggle("rtui-theme", hadRtuiTheme)
      if (previousTheme === undefined) delete root.dataset.theme
      else root.dataset.theme = previousTheme
      root.style.colorScheme = previousColorScheme
      for (const [key, tokenValue] of previousTokens) {
        if (tokenValue) root.style.setProperty(key, tokenValue)
        else root.style.removeProperty(key)
      }
    }
  }, [applyToRoot, paletteVars, resolvedTheme])

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-theme={resolvedTheme}
        data-theme-preference={theme}
        className={cn("rui-theme rtui-theme", resolvedTheme === "dark" && "dark", className)}
        style={{ colorScheme: resolvedTheme, ...customStyle }}
        {...props}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used inside a ThemeProvider")
  return context
}

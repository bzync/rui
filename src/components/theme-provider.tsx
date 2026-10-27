"use client"

import { cn } from "@/lib/cn"
import type { CSSProperties, HTMLAttributes, ReactNode } from "react"
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { useHydrated } from "@/hooks/use-hydrated"

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
  /**
   * Replaces the blue scale used for primary actions, focus rings, and selected states.
   *
   * Setting it also points `--color-primary`, `--color-primary-hover` and
   * `--color-focus-ring` at accent 600/700/500 inside the provider's scope
   * (unless `colors.primary` / `colors.primaryHover` / `colors.focusRing` are
   * given), because the stylesheet's own aliases resolve on `:root` against
   * the default accent. Those derived tokens are emitted with zero specificity,
   * so any app rule that targets the scope (`.rui-theme { --color-primary: … }`)
   * wins; pass `deriveAccentTokens={false}` on the provider to skip them.
   */
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

export interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

/** What a portal needs to re-create the nearest ThemeProvider's scope. */
interface ThemeScopeValue {
  id: string
  preference: Theme
  className: string
  resolvedTheme: ResolvedTheme
  style: CSSProperties
}

const ThemeScopeContext = createContext<ThemeScopeValue | null>(null)

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
  /** Also sync the theme class and tokens to `<html>`, for document backgrounds and scrollbars.
   * Not needed for the library's own portals (Drawer, Select, Autocomplete, chart tooltips),
   * which carry the theme scope with them via ThemePortal. */
  applyToRoot?: boolean
  /**
   * When `palette.accent` is set, also point `--color-primary`,
   * `--color-primary-hover` and `--color-focus-ring` at the new accent scale.
   * Defaults to true. Set false when the app defines those tokens in its own
   * CSS (for example on `:root`), which the scope would otherwise shadow.
   */
  deriveAccentTokens?: boolean
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
  if (style["--color-destructive"] !== undefined && style["--color-danger"] === undefined) {
    style["--color-danger"] = "var(--color-destructive)"
  }
  return style as CSSProperties
}

const accentAliases = [["--color-primary", 600], ["--color-primary-hover", 700], ["--color-focus-ring", 500]] as const

/**
 * Aliases such as --color-primary: var(--color-accent-600) are declared on
 * :root by the stylesheet, so they resolve against the default accent there
 * and never see an accent set on the provider. Re-declare them next to the
 * overridden scale (unless a palette set them explicitly) so primary buttons,
 * checkboxes and focus rings follow palette.accent.
 */
function accentAliasStyle(palettes: Array<ThemePalette | undefined>, explicit: CSSProperties): CSSProperties {
  if (!palettes.some((palette) => palette?.accent && Object.keys(palette.accent).length > 0)) return {}
  const style: Record<string, string> = {}
  for (const [token, shade] of accentAliases) {
    if ((explicit as Record<string, unknown>)[token] === undefined) style[token] = `var(--color-accent-${shade})`
  }
  return style as CSSProperties
}

/** Declarations for a generated rule. Drops anything that could end the rule or the <style> element. */
function declarations(style: CSSProperties): string {
  return Object.entries(style)
    .filter(([key, value]) => /^--[\w-]+$/.test(key) && !/[{}]|<\//.test(String(value)))
    .map(([key, value]) => `${key}:${value};`)
    .join("")
}

/**
 * Palette tokens as a stylesheet instead of inline style. An inline style can
 * only hold the theme resolved during render, which on the server is the
 * `defaultTheme` fallback (stored choice and prefers-color-scheme are
 * client-only), so dark-mode users got light tokens until hydration. Emitting
 * every mode keyed on `.dark` lets a pre-paint `<html class="dark">` (or the
 * provider's own class) pick the right set before React runs.
 */
function paletteCss(
  id: string,
  palettes: { palette?: ThemePalette; lightPalette?: ThemePalette; darkPalette?: ThemePalette },
  { applyToRoot, deriveAccentTokens }: { applyToRoot: boolean; deriveAccentTokens: boolean },
): string {
  const scope = `[data-rui-scope="${id}"]`
  const base = paletteStyle(palettes.palette)
  const light = paletteStyle(palettes.lightPalette)
  const dark = paletteStyle(palettes.darkPalette)
  const lightAliases = deriveAccentTokens ? accentAliasStyle([palettes.palette, palettes.lightPalette], { ...base, ...light }) : {}
  const darkAliases = deriveAccentTokens ? accentAliasStyle([palettes.palette, palettes.darkPalette], { ...base, ...dark }) : {}

  const lightSel = [`${scope}:not(.dark):not(.dark *)`, `${scope}[data-theme-preference="light"]`]
  const darkSel = [`${scope}.dark`, `.dark ${scope}:not([data-theme-preference="light"])`]
  const rootLight = ":root:not(.dark)"
  const rootDark = ":root.dark"

  const sameAliases = declarations(lightAliases) === declarations(darkAliases)
  const rules: Array<[string[], CSSProperties]> = [
    // Derived aliases first and at zero specificity, so explicit tokens and app CSS win.
    ...(sameAliases
      ? [[[`:where(${scope})`], lightAliases] as [string[], CSSProperties]]
      : [
          [lightSel.map((sel) => `:where(${sel})`), lightAliases] as [string[], CSSProperties],
          [darkSel.map((sel) => `:where(${sel})`), darkAliases] as [string[], CSSProperties],
        ]),
    [[scope], base],
    [lightSel, light],
    [darkSel, dark],
  ]
  if (applyToRoot) {
    rules.push(
      [[`:where(${rootLight})`], lightAliases],
      [[`:where(${rootDark})`], darkAliases],
      [[":root"], base],
      [[rootLight], light],
      [[rootDark], dark],
    )
  }
  return rules
    .map(([selectors, style]) => {
      const body = declarations(style)
      return body ? `${selectors.join(",")}{${body}}` : ""
    })
    .join("")
}

/** Custom properties from a style object (the theme-relevant part of it). */
function customProperties(style: CSSProperties | undefined): CSSProperties {
  if (!style) return {}
  return Object.fromEntries(Object.entries(style).filter(([key]) => key.startsWith("--"))) as CSSProperties
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
  deriveAccentTokens = true,
  className,
  style,
  ...props
}: ThemeProviderProps) {
  const scopeId = useId()
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
  // Independent of the resolved theme, so server and client output match.
  const css = useMemo(
    () => paletteCss(scopeId, { palette, lightPalette, darkPalette }, { applyToRoot, deriveAccentTokens }),
    [applyToRoot, darkPalette, deriveAccentTokens, lightPalette, palette, scopeId],
  )
  const scope = useMemo<ThemeScopeValue>(() => ({
    id: scopeId,
    preference: theme,
    className: cn("rui-theme rtui-theme", resolvedTheme === "dark" && "dark"),
    resolvedTheme,
    style: { colorScheme: resolvedTheme, ...customProperties(style) },
  }), [resolvedTheme, scopeId, style, theme])

  useEffect(() => {
    if (!applyToRoot) return
    const root = document.documentElement
    const hadDark = root.classList.contains("dark")
    const hadRuiTheme = root.classList.contains("rui-theme")
    const hadRtuiTheme = root.classList.contains("rtui-theme")
    const previousTheme = root.dataset.theme
    const previousColorScheme = root.style.colorScheme
    // Palette tokens reach <html> through the generated :root rules, which
    // follow this class.
    root.classList.toggle("dark", resolvedTheme === "dark")
    root.classList.add("rui-theme", "rtui-theme")
    root.dataset.theme = resolvedTheme
    root.style.colorScheme = resolvedTheme
    return () => {
      root.classList.toggle("dark", hadDark)
      root.classList.toggle("rui-theme", hadRuiTheme)
      root.classList.toggle("rtui-theme", hadRtuiTheme)
      if (previousTheme === undefined) delete root.dataset.theme
      else root.dataset.theme = previousTheme
      root.style.colorScheme = previousColorScheme
    }
  }, [applyToRoot, resolvedTheme])

  return (
    <ThemeContext.Provider value={value}>
      <ThemeScopeContext.Provider value={scope}>
      {/* A sibling, not a child, so it never shifts :first-child selectors on the app's content. */}
      {css && <style data-rui-palette={scopeId} dangerouslySetInnerHTML={{ __html: css }} />}
      <div
        data-theme={resolvedTheme}
        data-theme-preference={theme}
        data-rui-scope={scopeId}
        className={cn("rui-theme rtui-theme", resolvedTheme === "dark" && "dark", className)}
        style={{ colorScheme: resolvedTheme, ...style }}
        {...props}
      >
        {children}
      </div>
      </ThemeScopeContext.Provider>
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used inside a ThemeProvider")
  return context
}

/**
 * Portals `children` (to `document.body` by default) while keeping them inside
 * the nearest ThemeProvider's theme. A plain portal leaves the `.rui-theme`
 * element, so it loses dark mode, palette overrides and the scoped base
 * styles. This wraps the content in a `display: contents` copy of the scope
 * (theme classes, `data-theme`, and the scope attribute the provider's palette
 * rules select), which
 * restores all of that without adding a layout box. Outside a ThemeProvider it
 * is a plain portal. Use it for any custom overlay rendered next to the
 * library's own.
 *
 * Nothing is rendered on the server or during hydration (the server has no
 * `document` to portal into), so closed and open overlays alike hydrate
 * without a mismatch; the portal appears on the render after hydration.
 */
export function ThemePortal({ children, container }: { children: ReactNode; container?: Element | DocumentFragment | null }) {
  const scope = useContext(ThemeScopeContext)
  const hydrated = useHydrated()
  if (!hydrated || typeof document === "undefined") return null
  const target = container ?? document.body
  if (!scope) return createPortal(children, target)
  return createPortal(
    <div
      className={scope.className}
      data-theme={scope.resolvedTheme}
      data-theme-preference={scope.preference}
      data-rui-scope={scope.id}
      data-rui-portal=""
      style={{ ...scope.style, display: "contents" }}
    >
      {children}
    </div>,
    target,
  )
}

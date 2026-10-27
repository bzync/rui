"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { CheckIcon, ChevronDownIcon, MonitorIcon, MoonIcon, SunIcon } from "@/lib/icons"
import { mergeRefs } from "@/lib/merge-refs"
import { ThemePortal, type Theme, type ResolvedTheme, ThemeContext } from "./theme-provider"
import {
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

export type ThemeSwitcherVariant = "segmented" | "dropdown" | "switch" | "radio" | "icon-button"
export type ThemeSwitcherSize = "sm" | "md" | "lg"

export interface ThemeSwitcherOption {
  value: Theme
  label: string
  icon: ReactNode
  description?: string
}

export interface ThemeSwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Layout presentation:
   * - "segmented": inline pill track with tabs (default)
   * - "dropdown": compact menu button with anchored popover panel
   * - "switch": sliding toggle between light and dark
   * - "radio": full-width settings cards with miniature previews
   * - "icon-button": single compact button that cycles modes
   */
  variant?: ThemeSwitcherVariant
  /** Control size matching library standard (sm: 32px, md: 36px, lg: 40px). */
  size?: ThemeSwitcherSize
  /** Whether to include the "system" (OS preference) option. Default: true. */
  includeSystem?: boolean
  /** Whether to show text labels. Defaults to true for segmented/dropdown/radio, false for icon-button/switch. */
  showLabels?: boolean
  /** Custom label for light mode. Default: "Light". */
  lightLabel?: string
  /** Custom label for dark mode. Default: "Dark". */
  darkLabel?: string
  /** Custom label for system mode. Default: "System". */
  systemLabel?: string
  /** Custom icon for light mode. */
  lightIcon?: ReactNode
  /** Custom icon for dark mode. */
  darkIcon?: ReactNode
  /** Custom icon for system mode. */
  systemIcon?: ReactNode
  /** Controlled theme value (overrides useTheme() value when provided). */
  value?: Theme
  /** Callback when theme changes. */
  onChange?: (theme: Theme) => void
  /** Accessible label for the switcher. */
  ariaLabel?: string
}

const sizeConfig: Record<ThemeSwitcherSize, {
  container: string
  button: string
  iconSize: number
  text: string
  switchTrack: string
  switchThumb: string
  switchThumbTranslate: string
}> = {
  sm: {
    container: "h-8 p-0.5",
    button: "h-7 px-2 text-xs gap-1.5",
    iconSize: 13,
    text: "text-xs",
    switchTrack: "h-7 w-12 p-0.5",
    switchThumb: "h-6 w-6",
    switchThumbTranslate: "translate-x-5",
  },
  md: {
    container: "h-9 p-1",
    button: "h-7 px-2.5 text-xs gap-1.5",
    iconSize: 14,
    text: "text-xs",
    switchTrack: "h-8 w-14 p-1",
    switchThumb: "h-6 w-6",
    switchThumbTranslate: "translate-x-6",
  },
  lg: {
    container: "h-10 p-1",
    button: "h-8 px-3 text-sm gap-2",
    iconSize: 16,
    text: "text-sm",
    switchTrack: "h-9 w-16 p-1",
    switchThumb: "h-7 w-7",
    switchThumbTranslate: "translate-x-7",
  },
}

export const ThemeSwitcher = forwardRef<HTMLDivElement, ThemeSwitcherProps>(function ThemeSwitcher(
  {
    variant = "segmented",
    size = "md",
    includeSystem = true,
    showLabels,
    lightLabel = "Light",
    darkLabel = "Dark",
    systemLabel = "System",
    lightIcon,
    darkIcon,
    systemIcon,
    value: controlledValue,
    onChange,
    ariaLabel = "Color theme",
    className,
    ...props
  },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const context = useContext(ThemeContext)
  const currentTheme = controlledValue ?? context?.theme ?? "system"
  const resolved = context?.resolvedTheme ?? (currentTheme === "dark" ? "dark" : "light")
  const cfg = sizeConfig[size]

  const shouldShowLabels = showLabels ?? (variant === "segmented" || variant === "dropdown" || variant === "radio")

  const defaultLightIcon = lightIcon ?? <SunIcon size={cfg.iconSize} aria-hidden="true" />
  const defaultDarkIcon = darkIcon ?? <MoonIcon size={cfg.iconSize} aria-hidden="true" />
  const defaultSystemIcon = systemIcon ?? <MonitorIcon size={cfg.iconSize} aria-hidden="true" />

  const options: ThemeSwitcherOption[] = [
    { value: "light", label: lightLabel, icon: defaultLightIcon, description: "Light appearance for bright environments" },
    { value: "dark", label: darkLabel, icon: defaultDarkIcon, description: "Dark appearance for low-light environments" },
    ...(includeSystem
      ? [{ value: "system" as Theme, label: systemLabel, icon: defaultSystemIcon, description: "Sync appearance with your operating system preference" }]
      : []),
  ]

  const handleSelect = (next: Theme) => {
    onChange?.(next)
    context?.setTheme(next)
  }

  // --- Variant 1: Segmented Pill Track ---
  if (variant === "segmented") {
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center rounded-[var(--radius-lg)] border border-border bg-surface-muted/60 shadow-xs",
          cfg.container,
          className,
        )}
        {...props}
      >
        {options.map((opt) => {
          const isSelected = currentTheme === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={opt.label}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-[background-color,color,box-shadow]",
                focusRingStyles,
                cfg.button,
                isSelected
                  ? "bg-surface text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-foreground/4 hover:text-foreground",
              )}
            >
              <span className="shrink-0">{opt.icon}</span>
              {shouldShowLabels && <span>{opt.label}</span>}
            </button>
          )
        })}
      </div>
    )
  }

  // --- Variant 2: Dropdown Menu ---
  if (variant === "dropdown") {
    return (
      <DropdownThemeSwitcher
        ref={ref}
        options={options}
        currentTheme={currentTheme}
        onSelectOption={handleSelect}
        size={size}
        showLabels={shouldShowLabels}
        ariaLabel={ariaLabel}
        className={className}
        {...props}
      />
    )
  }

  // --- Variant 3: Sliding Switch ---
  if (variant === "switch") {
    const isDark = resolved === "dark"
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={ariaLabel}
          title={isDark ? darkLabel : lightLabel}
          onClick={() => handleSelect(isDark ? "light" : "dark")}
          className={cn(
            "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-border bg-surface-muted transition-colors hover:border-border-strong",
            focusRingStyles,
            cfg.switchTrack,
          )}
        >
          {/* Track icons */}
          <span className="absolute left-1.5 flex text-muted-foreground" aria-hidden="true">
            <SunIcon size={cfg.iconSize - 2} />
          </span>
          <span className="absolute right-1.5 flex text-muted-foreground" aria-hidden="true">
            <MoonIcon size={cfg.iconSize - 2} />
          </span>

          {/* Sliding Thumb */}
          <span
            className={cn(
              "pointer-events-none flex items-center justify-center rounded-full bg-surface text-foreground shadow-sm transition-transform duration-200",
              cfg.switchThumb,
              isDark ? cfg.switchThumbTranslate : "translate-x-0",
            )}
          >
            {isDark ? defaultDarkIcon : defaultLightIcon}
          </span>
        </button>

        {shouldShowLabels && (
          <span className={cn("font-medium text-foreground", cfg.text)}>
            {currentTheme === "system" ? `${systemLabel} (${resolved === "dark" ? darkLabel : lightLabel})` : (isDark ? darkLabel : lightLabel)}
          </span>
        )}
      </div>
    )
  }

  // --- Variant 4: Radio Cards (Settings Layout) ---
  if (variant === "radio") {
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn("grid gap-3 sm:grid-cols-3", className)}
        {...props}
      >
        {options.map((opt) => {
          const isSelected = currentTheme === opt.value
          return (
            <div
              key={opt.value}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => handleSelect(opt.value)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault()
                  handleSelect(opt.value)
                }
              }}
              className={cn(
                "group relative flex cursor-pointer flex-col justify-between rounded-[var(--radius-lg)] border p-3.5 transition-all outline-none",
                focusRingStyles,
                isSelected
                  ? "border-accent ring-2 ring-accent/25 bg-accent/4 shadow-sm"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-muted/40",
              )}
            >
              {/* Miniature Preview Mockup */}
              <div
                aria-hidden="true"
                className={cn(
                  "mb-3 flex h-20 w-full flex-col overflow-hidden rounded-[var(--radius-md)] border text-[10px]",
                  opt.value === "light" && "border-border bg-surface text-foreground",
                  opt.value === "dark" && "border-foreground/15 bg-foreground/95 text-bg",
                  opt.value === "system" && "border-border bg-gradient-to-r from-surface to-foreground/90 text-foreground",
                )}
              >
                {/* Mockup Header */}
                <div
                  className={cn(
                    "flex h-4 items-center justify-between border-b px-2",
                    opt.value === "light" && "border-border bg-surface-muted",
                    opt.value === "dark" && "border-foreground/10 bg-foreground/90",
                    opt.value === "system" && "border-border bg-surface-muted/80",
                  )}
                >
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  </div>
                  <span className="h-1.5 w-8 rounded-full bg-foreground/20" />
                </div>
                {/* Mockup Body */}
                <div className="flex flex-1 gap-1.5 p-2">
                  <div className="h-full w-1/4 rounded bg-foreground/10" />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="h-2 w-3/4 rounded bg-foreground/20" />
                    <div className="h-2 w-1/2 rounded bg-foreground/10" />
                  </div>
                </div>
              </div>

              {/* Label & Description */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-foreground">{opt.icon}</span>
                  <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                </div>
                {isSelected && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <CheckIcon size={11} strokeWidth={3} />
                  </span>
                )}
              </div>
              {opt.description && (
                <p className="mt-1 text-xs text-muted-foreground">{opt.description}</p>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // --- Variant 5: Icon Button Cycle ---
  const activeOption = options.find((o) => o.value === currentTheme) ?? options[0]
  const cycleNext = () => {
    const idx = options.findIndex((o) => o.value === currentTheme)
    const nextIdx = (idx + 1) % options.length
    handleSelect(options[nextIdx].value)
  }

  return (
    <div ref={ref} className={cn("inline-flex", className)} {...props}>
      <button
        type="button"
        aria-label={`${ariaLabel}: ${activeOption.label}. Click to cycle.`}
        title={`${activeOption.label} mode`}
        onClick={cycleNext}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface text-foreground shadow-xs transition-colors hover:border-border-strong hover:bg-surface-muted",
          focusRingStyles,
          size === "sm" && "h-8 w-8",
          size === "md" && "h-9 w-9",
          size === "lg" && "h-10 w-10",
        )}
      >
        {activeOption.icon}
      </button>
    </div>
  )
})

ThemeSwitcher.displayName = "ThemeSwitcher"

/* ------------------------------------------------------------------ */
/* Subcomponent: Dropdown Theme Switcher                              */
/* ------------------------------------------------------------------ */

interface DropdownThemeSwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect" | "onChange"> {
  options: ThemeSwitcherOption[]
  currentTheme: Theme
  onSelectOption: (theme: Theme) => void
  size: ThemeSwitcherSize
  showLabels: boolean
  ariaLabel: string
}

const DropdownThemeSwitcher = forwardRef<HTMLDivElement, DropdownThemeSwitcherProps>(function DropdownThemeSwitcher(
  { options, currentTheme, onSelectOption, size, showLabels, ariaLabel, className, ...props },
  ref,
) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const menuId = useId()
  const cfg = sizeConfig[size]

  const { setFloating, style } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    side: "bottom",
    align: "start",
    gap: 4,
    padding: 8,
  })

  const activeOption = options.find((o) => o.value === currentTheme) ?? options[0]

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [open])

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${ariaLabel}: ${activeOption.label}`}
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-3 font-medium text-foreground shadow-xs transition-colors hover:border-border-strong hover:bg-surface-muted",
          focusRingStyles,
          size === "sm" && "h-8 text-xs",
          size === "md" && "h-9 text-xs",
          size === "lg" && "h-10 text-sm",
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="shrink-0">{activeOption.icon}</span>
          {showLabels && <span>{activeOption.label}</span>}
        </span>
        <span className={cn("text-muted-foreground transition-transform duration-150", open && "rotate-180")}>
          <ChevronDownIcon size={12} />
        </span>
      </button>

      {open && (
        <ThemePortal>
          <div
            ref={mergeRefs(panelRef, setFloating)}
            style={style}
            role="menu"
            id={menuId}
            aria-label={ariaLabel}
            className="z-(--z-popover) min-w-[130px] rounded-[var(--radius-md)] border border-border bg-surface p-1 shadow-floating ring-1 ring-foreground/5 animate-in fade-in zoom-in-95 duration-100"
          >
            {options.map((opt) => {
              const isSelected = currentTheme === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => {
                    onSelectOption(opt.value)
                    setOpen(false)
                    triggerRef.current?.focus()
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors text-foreground",
                    focusRingStyles,
                    isSelected ? "bg-accent/10 text-accent-strong font-semibold" : "hover:bg-foreground/6",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {opt.icon}
                    <span>{opt.label}</span>
                  </span>
                  {isSelected && (
                    <span className="text-accent-strong">
                      <CheckIcon size={12} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </ThemePortal>
      )}
    </div>
  )
})

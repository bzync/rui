"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles, focusRingStyles } from "@/lib/component-styles"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { useControllableState } from "@/hooks/use-controllable-state"
import { mergeRefs } from "@/lib/merge-refs"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { ThemePortal } from "./theme-provider"
import {
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

export type ColorPickerSize = "sm" | "md" | "lg"

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: string
  defaultValue?: string
  onChange?: (hex: string) => void
  onValueChange?: (hex: string) => void
  name?: string
  required?: boolean
  label?: string
  hint?: string
  error?: string
  presets?: string[]
  swatches?: string[]
  showAlpha?: boolean
  showEyeDropper?: boolean
  disabled?: boolean
  size?: ColorPickerSize
}

const DEFAULT_PRESETS = [
  "#ef4444", "#f97316", "#f59e0b", "#10b981",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
  "#ec4899", "#111827", "#64748b", "#ffffff",
]

const triggerSizes: Record<ColorPickerSize, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-3.5 text-sm",
}

const CHECKERBOARD_BG =
  "repeating-conic-gradient(rgba(128,128,128,0.22) 0% 25%, transparent 0% 50%) 50% / 8px 8px"

// Color math helpers (HSV <-> RGB <-> HEX)
function hexToHsv(hex: string): [number, number, number] {
  let clean = hex.replace("#", "")
  if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("")
  const num = parseInt(clean.slice(0, 6), 16) || 0
  const r = ((num >> 16) & 255) / 255
  const g = ((num >> 8) & 255) / 255
  const b = (num & 255) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)]
}

function hsvToHex(h: number, s: number, v: number): string {
  const normS = s / 100
  const normV = v / 100
  const i = Math.floor((h / 60) % 6)
  const f = h / 60 - i
  const p = normV * (1 - normS)
  const q = normV * (1 - f * normS)
  const t = normV * (1 - (1 - f) * normS)

  let r = 0, g = 0, b = 0
  switch (i) {
    case 0: r = normV; g = t; b = p; break
    case 1: r = q; g = normV; b = p; break
    case 2: r = p; g = normV; b = t; break
    case 3: r = p; g = q; b = normV; break
    case 4: r = t; g = p; b = normV; break
    case 5: r = normV; g = p; b = q; break
  }

  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function parseAlpha(color: string): number {
  const hex8 = /^#[0-9a-fA-F]{8}$/.exec(color.trim())
  if (hex8) {
    return Math.round((parseInt(color.trim().slice(7, 9), 16) / 255) * 100)
  }
  const rgba = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*([0-9.]+))?\s*\)$/i.exec(color.trim())
  if (rgba && rgba[1] !== undefined) {
    const parsed = parseFloat(rgba[1])
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(100, Math.round(parsed * 100)))
    }
  }
  return 100
}

function formatHexWithAlpha(baseHex: string, alpha: number, showAlpha: boolean): string {
  const hex6 = baseHex.slice(0, 7)
  if (showAlpha && alpha < 100) {
    const alphaHex = Math.round((Math.max(0, Math.min(100, alpha)) / 100) * 255)
      .toString(16)
      .padStart(2, "0")
    return `${hex6}${alphaHex}`
  }
  return hex6
}

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  {
    value: controlledValue,
    defaultValue = "#3b82f6",
    onChange,
    onValueChange,
    name,
    required,
    label,
    hint,
    error,
    presets: propPresets,
    swatches,
    showAlpha = false,
    showEyeDropper = true,
    disabled = false,
    size = "md",
    className,
    id,
    ...props
  },
  ref,
) {
  const presets = propPresets ?? swatches ?? DEFAULT_PRESETS
  const [color, setColor] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange: (next) => {
      onChange?.(next)
      onValueChange?.(next)
    },
  })

  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const alphaTrackRef = useRef<HTMLDivElement | null>(null)

  const uid = useId()
  const inputId = id ?? uid
  const messageId = `${inputId}-message`
  const hasError = Boolean(error)
  const describedBy = error || hint ? messageId : undefined

  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(color))
  const [alpha, setAlpha] = useState<number>(() => parseAlpha(color))
  const [hue, sat, val] = hsv

  // Sync internal HSV and alpha when external color prop changes
  useEffect(() => {
    if (color) {
      setHsv(hexToHsv(color))
      setAlpha(parseAlpha(color))
    }
  }, [color])

  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false)
  const [isDraggingAlpha, setIsDraggingAlpha] = useState(false)

  const { setFloating, style, placement } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    side: "bottom",
    align: "start",
    gap: 6,
    padding: 8,
  })

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

  const updateColorFromHsv = useCallback((h: number, s: number, v: number, a: number = alpha) => {
    setHsv([h, s, v])
    setAlpha(a)
    const hex = formatHexWithAlpha(hsvToHex(h, s, v), a, showAlpha)
    setColor(hex)
  }, [alpha, showAlpha, setColor])

  const updateAlphaAtClientX = (clientX: number) => {
    if (!alphaTrackRef.current) return
    const rect = alphaTrackRef.current.getBoundingClientRect()
    const x = rect.width > 0 ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0
    const nextAlpha = Math.round(x * 100)
    updateColorFromHsv(hue, sat, val, nextAlpha)
  }

  const handleAlphaPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!alphaTrackRef.current || disabled) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDraggingAlpha(true)
    updateAlphaAtClientX(e.clientX)
  }

  const handleAlphaPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingAlpha) return
    updateAlphaAtClientX(e.clientX)
  }

  const handleAlphaPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isDraggingAlpha) {
      setIsDraggingAlpha(false)
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // Pointer capture might have been automatically released
      }
    }
  }

  const handleAlphaKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      updateColorFromHsv(hue, sat, val, Math.max(0, alpha - 1))
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      updateColorFromHsv(hue, sat, val, Math.min(100, alpha + 1))
    } else if (e.key === "Home") {
      e.preventDefault()
      updateColorFromHsv(hue, sat, val, 0)
    } else if (e.key === "End") {
      e.preventDefault()
      updateColorFromHsv(hue, sat, val, 100)
    }
  }

  const updateCanvasAtClientCoord = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    const s = Math.round(x * 100)
    const v = Math.round((1 - y) * 100)
    updateColorFromHsv(hue, s, v)
  }

  const handleCanvasPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!canvasRef.current || disabled) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDraggingCanvas(true)
    updateCanvasAtClientCoord(e.clientX, e.clientY)
  }

  const handleCanvasPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingCanvas) return
    updateCanvasAtClientCoord(e.clientX, e.clientY)
  }

  const handleCanvasPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isDraggingCanvas) {
      setIsDraggingCanvas(false)
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // Pointer capture might have been automatically released
      }
    }
  }

  const handleCanvasKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    let nextSat = sat
    let nextVal = val
    let handled = true

    if (e.key === "ArrowLeft") nextSat = Math.max(0, sat - 2)
    else if (e.key === "ArrowRight") nextSat = Math.min(100, sat + 2)
    else if (e.key === "ArrowUp") nextVal = Math.min(100, val + 2)
    else if (e.key === "ArrowDown") nextVal = Math.max(0, val - 2)
    else handled = false

    if (handled) {
      e.preventDefault()
      updateColorFromHsv(hue, nextSat, nextVal)
    }
  }

  const handleEyeDropper = async () => {
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eyeDropper = new (window as any).EyeDropper()
        const result = await eyeDropper.open()
        if (result?.sRGBHex) {
          setColor(result.sRGBHex)
          setHsv(hexToHsv(result.sRGBHex))
        }
      } catch {
        // User cancelled picker
      }
    }
  }

  const hasEyeDropper = typeof window !== "undefined" && "EyeDropper" in window

  return (
    <div ref={ref} className={cn(fieldRootStyles, className)} {...props}>
      {label && (
        <label id={`${inputId}-label`} htmlFor={inputId} className={cn(fieldLabelStyles, disabled && "opacity-50")}>
          {label}
        </label>
      )}
      {name && !disabled && <input type="hidden" name={name} value={color} required={required} />}

      <div className="relative w-full">
        <button
          ref={triggerRef}
          type="button"
          id={inputId}
          aria-labelledby={label ? `${inputId}-label` : undefined}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-[var(--radius-md)] font-mono text-left outline-none",
            controlBaseStyles,
            triggerSizes[size],
            open && "border-accent-500 ring-[3px] ring-focus-ring/25",
            hasError && controlInvalidStyles,
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span
              className="relative size-4.5 shrink-0 overflow-hidden rounded-[5px] border border-foreground/15 shadow-2xs"
              style={{ background: CHECKERBOARD_BG }}
            >
              <span className="absolute inset-0" style={{ backgroundColor: color }} />
            </span>
            <span className="truncate text-xs font-semibold uppercase tracking-wider text-foreground">{color}</span>
          </span>
          <svg
            aria-hidden="true"
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
              open && "rotate-180 text-foreground",
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <ThemePortal>
          <AnimatePresence>
            {open && (
              <>
                {/* Mobile backdrop */}
                <motion.div
                  aria-hidden="true"
                  className="fixed inset-0 z-(--z-popover) bg-overlay/40 sm:hidden"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />

                <motion.div
                  ref={mergeRefs(panelRef, setFloating)}
                  id={`${inputId}-dialog`}
                  role="dialog"
                  aria-label={label ? `${label} color picker` : "Color picker"}
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                    y: placement === "top" ? 6 : -6,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    y: placement === "top" ? 4 : -4,
                  }}
                  transition={{
                    duration: 0.16,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    ...style,
                    transformOrigin: placement === "top" ? "bottom left" : "top left",
                  }}
                  className="z-(--z-popover) flex w-68 flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-3.5 shadow-floating ring-1 ring-foreground/5 select-none"
                >
                  {/* Saturation / Value Gradient Canvas */}
                  <div
                    ref={canvasRef}
                    role="slider"
                    tabIndex={disabled ? -1 : 0}
                    aria-label="Color saturation and brightness"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={sat}
                    aria-valuetext={`Saturation ${sat}%, Brightness ${val}%`}
                    onPointerDown={handleCanvasPointerDown}
                    onPointerMove={handleCanvasPointerMove}
                    onPointerUp={handleCanvasPointerUp}
                    onPointerCancel={handleCanvasPointerUp}
                    onKeyDown={handleCanvasKeyDown}
                    className={cn(
                      "relative h-36 w-full rounded-[var(--radius-md)] ring-1 ring-inset ring-foreground/15 select-none touch-none overflow-hidden transition-shadow",
                      isDraggingCanvas ? "cursor-grabbing" : "cursor-crosshair",
                      focusRingStyles,
                    )}
                    style={{
                      backgroundColor: `hsl(${hue}, 100%, 50%)`,
                      backgroundImage:
                        "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)",
                    }}
                  >
                    {/* Thumb pointer */}
                    <div
                      className={cn(
                        "absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none",
                        isDraggingCanvas
                          ? "scale-125 shadow-lg ring-2 ring-white/90"
                          : "transition-transform duration-100 ease-out hover:scale-115 ring-1 ring-black/40",
                      )}
                      style={{
                        left: `${sat}%`,
                        top: `${100 - val}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>

                  {/* Hue Rainbow Slider */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={hue}
                        aria-label="Hue"
                        onChange={(e) => updateColorFromHsv(Number(e.target.value), sat, val)}
                        className={cn(
                          "h-3.5 w-full cursor-pointer appearance-none rounded-full outline-none transition-shadow",
                          "focus-visible:ring-2 focus-visible:ring-focus-ring",
                          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-border-strong [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-120 active:[&::-webkit-slider-thumb]:scale-130",
                          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-border-strong [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-transform hover:[&::-moz-range-thumb]:scale-120 active:[&::-moz-range-thumb]:scale-130",
                        )}
                        style={{
                          background:
                            "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                        }}
                      />
                    </div>
                    {showEyeDropper && hasEyeDropper && (
                      <button
                        type="button"
                        aria-label="Pick color from screen"
                        title="Pick color from screen"
                        onClick={handleEyeDropper}
                        className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface text-muted-foreground transition-all duration-150 hover:bg-surface-muted hover:text-foreground hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m2 22 1-1h3l9-9" />
                          <path d="M3 21v-3l9-9" />
                          <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {showAlpha && (
                    <div
                      ref={alphaTrackRef}
                      role="slider"
                      tabIndex={disabled ? -1 : 0}
                      aria-label="Opacity"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={alpha}
                      aria-valuetext={`${alpha}%`}
                      onPointerDown={handleAlphaPointerDown}
                      onPointerMove={handleAlphaPointerMove}
                      onPointerUp={handleAlphaPointerUp}
                      onPointerCancel={handleAlphaPointerUp}
                      onKeyDown={handleAlphaKeyDown}
                      className={cn(
                        "relative h-3.5 w-full cursor-pointer rounded-full ring-1 ring-inset ring-foreground/15 select-none touch-none",
                        focusRingStyles,
                      )}
                      style={{
                        backgroundImage: `linear-gradient(to right, transparent, ${hsvToHex(hue, sat, val)}), ${CHECKERBOARD_BG}`,
                      }}
                    >
                      <div
                        className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-border-strong bg-white shadow-md pointer-events-none"
                        style={{ left: `${alpha}%` }}
                      />
                    </div>
                  )}

                  {/* Hex Input & Swatch Preview */}
                  <div className="flex items-center gap-2">
                    <div
                      className="relative size-8 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-foreground/15 shadow-2xs"
                      style={{ background: CHECKERBOARD_BG }}
                    >
                      <span className="absolute inset-0 transition-colors duration-150" style={{ backgroundColor: color }} />
                    </div>
                    <input
                      type="text"
                      aria-label="Hex color code"
                      value={color}
                      onChange={(e) => {
                        const val = e.target.value
                        setColor(val)
                        if (/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(val)) {
                          setHsv(hexToHsv(val))
                          setAlpha(parseAlpha(val))
                        }
                      }}
                      className={cn(
                        "h-8 w-full rounded-[var(--radius-sm)] px-2.5 font-mono text-xs uppercase text-foreground outline-none",
                        controlBaseStyles,
                      )}
                    />
                  </div>

                  {/* Presets Grid */}
                  {presets.length > 0 && (
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                      <span className="text-[11px] font-medium text-muted-foreground">Presets</span>
                      <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Color presets">
                        {presets.map((preset) => {
                          const isSelected = color.toLowerCase() === preset.toLowerCase()
                          return (
                            <button
                              key={preset}
                              type="button"
                              aria-label={`Select color ${preset}`}
                              aria-pressed={isSelected}
                              onClick={() => {
                                setColor(preset)
                                setHsv(hexToHsv(preset))
                              }}
                              className={cn(
                                "group relative h-6 w-full cursor-pointer rounded-[var(--radius-sm)] border border-foreground/15 shadow-2xs transition-all duration-150 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                                isSelected && "ring-2 ring-accent ring-offset-2 ring-offset-surface",
                              )}
                              style={{ backgroundColor: preset }}
                            >
                              {isSelected && (
                                <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-xs">
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </ThemePortal>
      </div>

      {error ? (
        <p id={messageId} className={fieldErrorStyles}>{error}</p>
      ) : hint ? (
        <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>
      ) : null}
    </div>
  )
})
ColorPicker.displayName = "ColorPicker"

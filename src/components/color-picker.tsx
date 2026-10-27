"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles, focusRingStyles } from "@/lib/component-styles"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { useControllableState } from "@/hooks/use-controllable-state"
import { mergeRefs } from "@/lib/merge-refs"
import { ThemePortal } from "./theme-provider"
import {
  type HTMLAttributes,
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
  sm: "h-8 px-2 text-xs",
  md: "h-9 px-2.5 text-sm",
  lg: "h-10 px-3 text-sm",
}

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

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  {
    value: controlledValue,
    defaultValue = "#3b82f6",
    onChange,
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
    onChange,
  })

  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)

  const uid = useId()
  const inputId = id ?? uid

  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(color))
  const [hue, sat, val] = hsv

  // Sync internal HSV when external color prop changes
  useEffect(() => {
    if (color) setHsv(hexToHsv(color))
  }, [color])

  const { setFloating, style } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    side: "bottom",
    align: "start",
    gap: 4,
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

  const updateColorFromHsv = useCallback((h: number, s: number, v: number) => {
    setHsv([h, s, v])
    const hex = hsvToHex(h, s, v)
    setColor(hex)
  }, [setColor])

  const handleCanvasPointer = (e: ReactPointerEvent) => {
    if (!canvasRef.current) return
    const update = (clientX: number, clientY: number) => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
      const s = Math.round(x * 100)
      const v = Math.round((1 - y) * 100)
      updateColorFromHsv(hue, s, v)
    }

    update(e.clientX, e.clientY)

    const handlePointerMove = (ev: PointerEvent) => update(ev.clientX, ev.clientY)
    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
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
        <label id={`${inputId}-label`} className={cn(fieldLabelStyles, disabled && "opacity-50")}>
          {label}
        </label>
      )}

      <div className="relative inline-block w-full">
        <button
          ref={triggerRef}
          type="button"
          id={inputId}
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            controlBaseStyles,
            triggerSizes[size],
            "w-full justify-between font-mono text-left",
            disabled && "cursor-not-allowed opacity-50",
            focusRingStyles,
          )}
        >
          <span className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-full border border-border shrink-0 shadow-xs"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs uppercase">{color}</span>
          </span>
          <span className="text-muted-foreground text-xs">▼</span>
        </button>

        {open && (
          <ThemePortal>
            <div
              ref={mergeRefs(panelRef, setFloating)}
              style={style}
              role="dialog"
              aria-label="Color picker"
              className="z-(--z-popover) flex w-64 flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-3 shadow-floating ring-1 ring-foreground/5 animate-in fade-in zoom-in-95 duration-100"
            >
              {/* Saturation / Value Gradient Canvas */}
              <div
                ref={canvasRef}
                onPointerDown={handleCanvasPointer}
                className="relative h-36 w-full cursor-crosshair rounded-[var(--radius-md)] select-none touch-none overflow-hidden"
                style={{
                  backgroundColor: `hsl(${hue}, 100%, 50%)`,
                  backgroundImage:
                    "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)",
                }}
              >
                {/* Thumb pointer */}
                <div
                  className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/40"
                  style={{
                    left: `${sat}%`,
                    top: `${100 - val}%`,
                    backgroundColor: color,
                  }}
                />
              </div>

              {/* Hue Rainbow Slider */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  aria-label="Hue"
                  onChange={(e) => updateColorFromHsv(Number(e.target.value), sat, val)}
                  className="h-3 w-full cursor-pointer appearance-none rounded-full outline-none"
                  style={{
                    background:
                      "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                  }}
                />
                {showEyeDropper && hasEyeDropper && (
                  <button
                    type="button"
                    aria-label="Pick color from screen"
                    title="Pick color from screen"
                    onClick={handleEyeDropper}
                    className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface-muted text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m2 22 1-1h3l9-9" />
                      <path d="M3 21v-3l9-9" />
                      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Hex Input & Swatch Preview */}
              <div className="flex items-center gap-2">
                <div
                  className="h-7 w-7 rounded-[var(--radius-sm)] border border-border shadow-xs shrink-0"
                  style={{ backgroundColor: color }}
                />
                <input
                  type="text"
                  aria-label="Hex color code"
                  value={color}
                  onChange={(e) => {
                    const val = e.target.value
                    setColor(val)
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                      setHsv(hexToHsv(val))
                    }
                  }}
                  className="w-full rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1 font-mono text-xs uppercase text-foreground outline-none focus:border-accent"
                />
              </div>

              {/* Presets Grid */}
              {presets.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      aria-label={`Select color ${preset}`}
                      onClick={() => {
                        setColor(preset)
                        setHsv(hexToHsv(preset))
                      }}
                      className={cn(
                        "h-5 w-5 rounded-[var(--radius-sm)] border border-border shadow-xs transition-transform hover:scale-110",
                        color.toLowerCase() === preset.toLowerCase() && "ring-2 ring-accent ring-offset-1",
                      )}
                      style={{ backgroundColor: preset }}
                    />
                  ))}
                </div>
              )}
            </div>
          </ThemePortal>
        )}
      </div>

      {error ? (
        <p className={fieldErrorStyles}>{error}</p>
      ) : hint ? (
        <p className={fieldDescriptionStyles}>{hint}</p>
      ) : null}
    </div>
  )
})
ColorPicker.displayName = "ColorPicker"

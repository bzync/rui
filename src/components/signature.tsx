"use client"

import { cn } from "@/lib/cn"
import {
  fieldRootStyles,
  fieldLabelStyles,
  fieldDescriptionStyles,
  fieldErrorStyles,
  focusRingStyles,
  controlInvalidStyles,
} from "@/lib/component-styles"
import { useControllableState } from "@/hooks/use-controllable-state"
import { Icons } from "@/components/icon"
import { Button } from "@/components/button"
import {
  type SignatureCropRect,
  type ProcessSignatureOptions,
  autoDetectSignatureBounds,
  processSignatureImageData,
  processSignatureImage,
  createSampleSignature,
} from "./signature/image-processor"
import {
  type SignatureEditorViewMode,
  type SignatureImageEditorProps,
  type SignatureEditorModalProps,
  SignatureImageEditor,
  SignatureEditorModal,
} from "./signature/signature-editor"
import {
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type Ref,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

export type SignatureMode = "draw" | "upload"
export type SignatureStrokeWidthPreset = "fine" | "regular" | "bold"

export interface SignaturePoint {
  x: number
  y: number
  time?: number
}

export interface SignatureStroke {
  points: SignaturePoint[]
  color: string
  width: number
}

export interface SignatureRef {
  /** Clears all strokes and resets the signature. */
  clear: () => void
  /** Undoes the last committed stroke. */
  undo: () => void
  /** Returns true if the canvas has no drawn strokes or content. */
  isEmpty: () => boolean
  /** Exports the signature as a base64 Data URL (default image/png). */
  toDataURL: (type?: "image/png" | "image/jpeg" | "image/svg+xml", quality?: number) => string | null
  /** Exports the signature as an SVG string. */
  toSVG: () => string | null
  /** Loads an external signature image Data URL into the canvas. */
  fromDataURL: (dataUrl: string) => void
  /** Opens the signature crop, background removal and zoom editor dialog. */
  openEditor: (dataUrl?: string) => void
  /** Direct reference to the underlying HTMLCanvasElement. */
  canvas: HTMLCanvasElement | null
}

export interface SignatureProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Controlled signature Data URL. */
  value?: string | null
  /** Initial signature Data URL when uncontrolled. */
  defaultValue?: string | null
  /** Callback triggered when the signature changes (returns Data URL or null when cleared). */
  onChange?: (dataUrl: string | null) => void
  /** Alias for onChange matching RUI standard. */
  onValueChange?: (dataUrl: string | null) => void
  /** Callback triggered when user begins a stroke. */
  onBegin?: () => void
  /** Callback triggered when user finishes a stroke. */
  onEnd?: () => void
  /** Allowed signing modes. Defaults to ["draw", "upload"]. */
  modes?: SignatureMode[]
  /** Default active mode. Defaults to "draw". */
  defaultMode?: SignatureMode
  /** Width of the signature pad. Defaults to "100%". */
  width?: number | string
  /** Height of the signature canvas in pixels. Defaults to 180. */
  height?: number
  /** Default pen stroke color. Defaults to "#0f172a" in light, adapts cleanly. */
  strokeColor?: string
  /** Available pen color swatches. */
  colors?: string[]
  /** Stroke line width: "fine" (1.5px), "regular" (2.5px), "bold" (4px) or custom pixel number. Defaults to "regular". */
  strokeWidth?: SignatureStrokeWidthPreset | number
  /** Canvas background fill color for exported images. Defaults to transparent "rgba(0,0,0,0)". */
  backgroundColor?: string
  /** Whether to show the baseline signing guide. Defaults to true. */
  guideLine?: boolean
  /** Text shown alongside the baseline guide. Defaults to "Sign above this line". */
  guideText?: string
  /** Whether to show the top action toolbar. Defaults to true. */
  showToolbar?: boolean
  /** Whether to enable the built-in background removal, crop, and zoom editor. Defaults to true. */
  enableEditor?: boolean
  /** Automatically open the editor when an image file is uploaded. Defaults to true. */
  autoEditOnUpload?: boolean
  /** Label for the form field. */
  label?: string
  /** Descriptive hint text. */
  hint?: string
  /** Error message string. */
  error?: string
  /** Name attribute for native form submission (submits hidden input). */
  name?: string
  /** Disables drawing and all interactive controls. */
  disabled?: boolean
  /** Read-only mode: renders signature without editing capabilities. */
  readOnly?: boolean
  /** Whether the field is required in form submissions. */
  required?: boolean
  /** Optional imperative ref for calling clear, undo, toDataURL, toSVG, and openEditor. */
  signatureRef?: Ref<SignatureRef>
  /** Additional CSS class names for the canvas element. */
  canvasClassName?: string
}

const DEFAULT_MODES: SignatureMode[] = ["draw", "upload"]
const DEFAULT_COLORS = ["#0f172a", "#1d4ed8", "#b91c1c"]

const STROKE_WIDTH_MAP: Record<SignatureStrokeWidthPreset, number> = {
  fine: 1.5,
  regular: 2.5,
  bold: 4,
}

export const Signature = forwardRef<HTMLDivElement, SignatureProps>(function Signature(
  {
    value: controlledValue,
    defaultValue = null,
    onChange,
    onValueChange,
    onBegin,
    onEnd,
    modes = DEFAULT_MODES,
    defaultMode = "draw",
    width = "100%",
    height = 180,
    strokeColor = "#0f172a",
    colors = DEFAULT_COLORS,
    strokeWidth = "regular",
    backgroundColor = "rgba(0,0,0,0)",
    guideLine = true,
    guideText = "Sign above this line",
    showToolbar = true,
    enableEditor = true,
    autoEditOnUpload = true,
    label,
    hint,
    error,
    name,
    disabled = false,
    readOnly = false,
    required = false,
    signatureRef,
    className,
    canvasClassName,
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`

  const [value, setValue] = useControllableState<string | null>({
    value: controlledValue,
    defaultValue,
    onChange: (next) => {
      onChange?.(next)
      onValueChange?.(next)
    },
  })

  const [activeMode, setActiveMode] = useState<SignatureMode>(defaultMode)
  const [activeColor, setActiveColor] = useState<string>(strokeColor)
  const [selectedWidthPreset, setSelectedWidthPreset] = useState<SignatureStrokeWidthPreset | number>(strokeWidth)
  const [strokeCount, setStrokeCount] = useState(0)

  // Drag state for upload mode
  const [isDragging, setIsDragging] = useState(false)

  // Signature editor dialog state
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editorSourceImage, setEditorSourceImage] = useState<string>("")

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const strokesRef = useRef<SignatureStroke[]>([])
  const currentPointsRef = useRef<SignaturePoint[]>([])
  const isDrawingRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const loadedImageRef = useRef<HTMLImageElement | null>(null)
  const lastCommittedRef = useRef<string | null>(null)

  const numericWidth = typeof selectedWidthPreset === "number" ? selectedWidthPreset : STROKE_WIDTH_MAP[selectedWidthPreset] ?? 2.5

  const isEmpty = useCallback(() => {
    return strokesRef.current.length === 0 && !loadedImageRef.current && !value
  }, [value])

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const w = rect.width || canvas.width
    const h = rect.height || canvas.height

    ctx.clearRect(0, 0, w, h)

    if (backgroundColor && backgroundColor !== "rgba(0,0,0,0)" && backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, w, h)
    }

    if (loadedImageRef.current) {
      ctx.drawImage(loadedImageRef.current, 0, 0, w, h)
    }

    for (const stroke of strokesRef.current) {
      if (stroke.points.length === 0) continue

      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      if (stroke.points.length === 1) {
        ctx.beginPath()
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.width / 2, 0, Math.PI * 2)
        ctx.fillStyle = stroke.color
        ctx.fill()
        continue
      }

      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)

      for (let i = 1; i < stroke.points.length; i++) {
        const prev = stroke.points[i - 1]
        const curr = stroke.points[i]
        const midX = (prev.x + curr.x) / 2
        const midY = (prev.y + curr.y) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
      }

      const last = stroke.points[stroke.points.length - 1]
      ctx.lineTo(last.x, last.y)
      ctx.stroke()
    }
  }, [backgroundColor])

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    redrawCanvas()
  }, [redrawCanvas])

  useEffect(() => {
    setupCanvas()
    const handleResize = () => setupCanvas()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [setupCanvas])

  // Sync external controlled value or initial value into canvas
  useEffect(() => {
    if (value && value !== lastCommittedRef.current) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        loadedImageRef.current = img
        redrawCanvas()
      }
      img.src = value
    } else if (!value && loadedImageRef.current && strokesRef.current.length === 0) {
      loadedImageRef.current = null
      redrawCanvas()
    }
  }, [value, redrawCanvas])

  const commitDataURL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const dataUrl = canvas.toDataURL("image/png")
      lastCommittedRef.current = dataUrl
      setValue(dataUrl)
    } catch {
      // Fallback for jsdom
    }
  }, [setValue])

  const clear = useCallback(() => {
    strokesRef.current = []
    currentPointsRef.current = []
    loadedImageRef.current = null
    lastCommittedRef.current = null
    setStrokeCount(0)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        ctx.clearRect(0, 0, rect.width, rect.height)
        if (backgroundColor && backgroundColor !== "transparent") {
          ctx.fillStyle = backgroundColor
          ctx.fillRect(0, 0, rect.width, rect.height)
        }
      }
    }
    setValue(null)
  }, [backgroundColor, setValue])

  const undo = useCallback(() => {
    if (strokesRef.current.length === 0) return
    strokesRef.current.pop()
    setStrokeCount(strokesRef.current.length)
    redrawCanvas()
    if (strokesRef.current.length > 0) {
      commitDataURL()
    } else {
      setValue(null)
    }
  }, [redrawCanvas, commitDataURL, setValue])

  const toDataURL = useCallback(
    (type: "image/png" | "image/jpeg" | "image/svg+xml" = "image/png", quality = 0.92) => {
      const canvas = canvasRef.current
      if (!canvas || typeof canvas.toDataURL !== "function") return null
      try {
        return canvas.toDataURL(type, quality)
      } catch {
        return null
      }
    },
    [],
  )

  const toSVG = useCallback(() => {
    const canvas = canvasRef.current
    const rect = canvas?.getBoundingClientRect()
    const w = rect?.width || 400
    const h = rect?.height || height || 180

    let paths = ""
    for (const stroke of strokesRef.current) {
      if (stroke.points.length === 0) continue
      if (stroke.points.length === 1) {
        paths += `<circle cx="${stroke.points[0].x}" cy="${stroke.points[0].y}" r="${stroke.width / 2}" fill="${stroke.color}" />`
        continue
      }
      let d = `M ${stroke.points[0].x} ${stroke.points[0].y}`
      for (let i = 1; i < stroke.points.length; i++) {
        const prev = stroke.points[i - 1]
        const curr = stroke.points[i]
        const midX = (prev.x + curr.x) / 2
        const midY = (prev.y + curr.y) / 2
        d += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`
      }
      const last = stroke.points[stroke.points.length - 1]
      d += ` L ${last.x} ${last.y}`
      paths += `<path d="${d}" fill="none" stroke="${stroke.color}" stroke-width="${stroke.width}" stroke-linecap="round" stroke-linejoin="round" />`
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${paths}</svg>`
  }, [height])

  const fromDataURL = useCallback(
    (dataUrl: string) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        loadedImageRef.current = img
        strokesRef.current = []
        setStrokeCount(1)
        redrawCanvas()
        lastCommittedRef.current = dataUrl
        setValue(dataUrl)
      }
      img.src = dataUrl
    },
    [redrawCanvas, setValue],
  )

  const openEditor = useCallback(
    (customImage?: string) => {
      const target = customImage || toDataURL("image/png") || value
      if (target) {
        setEditorSourceImage(target)
        setIsEditorOpen(true)
      }
    },
    [toDataURL, value],
  )

  useImperativeHandle(
    signatureRef,
    () => ({
      clear,
      undo,
      isEmpty,
      toDataURL,
      toSVG,
      fromDataURL,
      openEditor,
      canvas: canvasRef.current,
    }),
    [clear, undo, isEmpty, toDataURL, toSVG, fromDataURL, openEditor],
  )

  // Pointer event handlers for drawing
  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (disabled || readOnly) return
    const canvas = canvasRef.current
    if (!canvas) return

    e.currentTarget.setPointerCapture?.(e.pointerId)
    const rect = canvas.getBoundingClientRect()
    const point: SignaturePoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      time: Date.now(),
    }

    currentPointsRef.current = [point]
    isDrawingRef.current = true
    onBegin?.()

    // Draw initial dot
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.arc(point.x, point.y, numericWidth / 2, 0, Math.PI * 2)
      ctx.fillStyle = activeColor
      ctx.fill()
    }
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || disabled || readOnly) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const point: SignaturePoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      time: Date.now(),
    }

    const points = currentPointsRef.current
    points.push(point)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = activeColor
    ctx.lineWidth = numericWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (points.length >= 3) {
      const prev = points[points.length - 2]
      const prevPrev = points[points.length - 3]
      const mid1X = (prevPrev.x + prev.x) / 2
      const mid1Y = (prevPrev.y + prev.y) / 2
      const mid2X = (prev.x + point.x) / 2
      const mid2Y = (prev.y + point.y) / 2

      ctx.beginPath()
      ctx.moveTo(mid1X, mid1Y)
      ctx.quadraticCurveTo(prev.x, prev.y, mid2X, mid2Y)
      ctx.stroke()
    }
  }

  const handlePointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      // ignore
    }

    const points = [...currentPointsRef.current]
    if (points.length > 0) {
      strokesRef.current.push({
        points,
        color: activeColor,
        width: numericWidth,
      })
      setStrokeCount(strokesRef.current.length)
      commitDataURL()
    }

    currentPointsRef.current = []
    onEnd?.()
  }

  // File upload handling
  const handleUploadedData = (dataUrl: string) => {
    if (enableEditor && autoEditOnUpload) {
      setEditorSourceImage(dataUrl)
      setIsEditorOpen(true)
    } else {
      fromDataURL(dataUrl)
      setActiveMode("draw")
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      if (dataUrl) {
        handleUploadedData(dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || readOnly) return

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        if (dataUrl) {
          handleUploadedData(dataUrl)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = () => {
    const dataUrl = toDataURL("image/png")
    if (!dataUrl) return
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = `signature-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div
      ref={ref}
      className={cn(fieldRootStyles, "w-full", className)}
      style={{ width }}
      {...props}
    >
      {label && (
        <label htmlFor={inputId} className={fieldLabelStyles}>
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}

      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-xs transition-colors",
          error && controlInvalidStyles,
          disabled && "pointer-events-none opacity-60",
        )}
      >
        {/* Toolbar Header */}
        {showToolbar && !readOnly && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 bg-surface-muted/30 px-3 py-2 text-xs">
            {/* Mode switchers */}
            {modes.length > 1 && (
              <div className="flex items-center rounded-lg border border-border bg-bg p-0.5">
                {modes.map((mode) => {
                  const isActive = activeMode === mode
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setActiveMode(mode)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors min-h-[28px]",
                        isActive
                          ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {mode === "draw" && <Icons.PenLine size="xs" className="shrink-0" />}
                      {mode === "upload" && <Icons.Upload size="xs" className="shrink-0" />}
                      <span>{mode}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Controls per mode */}
            {activeMode === "draw" && (
              <div className="flex flex-wrap items-center gap-2">
                {/* Pen color picker */}
                {colors.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setActiveColor(c)}
                        title={`Color: ${c}`}
                        aria-label={`Select pen color ${c}`}
                        className={cn(
                          "size-5.5 sm:size-5 rounded-full border transition-transform",
                          activeColor === c ? "scale-110 border-foreground shadow-xs ring-1 ring-accent" : "border-transparent opacity-80 hover:opacity-100",
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}

                {/* Pen stroke width */}
                <div className="flex items-center rounded-lg border border-border bg-bg p-0.5">
                  {(["fine", "regular", "bold"] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWidthPreset(w)}
                      className={cn(
                        "inline-flex items-center justify-center rounded px-2.5 py-0.5 text-[11px] capitalize transition-colors min-h-[24px]",
                        selectedWidthPreset === w
                          ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>

                {/* Editor, Undo & Clear */}
                <div className="flex items-center gap-1">
                  {enableEditor && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      icon={<Icons.Sparkles size="xs" className="shrink-0" />}
                      onClick={() => openEditor()}
                      disabled={isEmpty()}
                      title="Enhance &amp; Crop signature (Remove background, crop, zoom)"
                      aria-label="Enhance signature"
                      className="h-7 gap-1.5 px-2 text-xs font-semibold text-accent-strong"
                    >
                      <span className="hidden sm:inline">Enhance &amp; Crop</span>
                      <span className="sm:hidden">Enhance</span>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={undo}
                    disabled={strokeCount === 0}
                    title="Undo last stroke"
                    aria-label="Undo last stroke"
                    className="size-7 p-0"
                  >
                    <Icons.RotateCcw size="xs" className="shrink-0" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clear}
                    disabled={isEmpty()}
                    title="Clear signature"
                    aria-label="Clear signature"
                    className="size-7 p-0 text-muted-foreground hover:text-danger"
                  >
                    <Icons.Eraser size="xs" className="shrink-0" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    disabled={isEmpty()}
                    title="Download signature as PNG"
                    aria-label="Download signature"
                    className="size-7 p-0"
                  >
                    <Icons.Download size="xs" className="shrink-0" />
                  </Button>
                </div>
              </div>
            )}

            {activeMode === "upload" && (
              <div className="flex items-center gap-2">
                {enableEditor && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={<Icons.Sparkles size="xs" className="shrink-0" />}
                    onClick={() => openEditor()}
                    disabled={isEmpty()}
                    title="Crop &amp; Clean signature"
                    className="h-7 gap-1.5 px-2 text-xs font-semibold text-accent-strong"
                  >
                    <span>Enhance &amp; Crop</span>
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  disabled={isEmpty()}
                  title="Clear signature"
                  className="size-7 p-0 text-muted-foreground hover:text-danger"
                >
                  <Icons.Eraser size="xs" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Canvas & Interactive Viewport */}
        <div
          className="rui-light relative w-full select-none overflow-hidden bg-surface text-foreground touch-none"
          style={{ height }}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {/* Baseline Signing Guide */}
          {guideLine && activeMode === "draw" && (
            <div className="pointer-events-none absolute bottom-8 left-6 right-6 flex items-center gap-2 border-b border-border/80 text-[11px] text-muted-foreground/75 select-none">
              <span className="font-serif font-bold italic text-muted-foreground/90">✕</span>
              <span className="text-[10px] tracking-wide uppercase">{guideText}</span>
            </div>
          )}

          {/* Empty state hint */}
          {activeMode === "draw" && isEmpty() && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-muted-foreground select-none">
              <Icons.PenLine size="md" className="mb-1 opacity-40" />
              <p className="text-xs font-medium">Draw your signature smoothly with mouse, pen, or touch</p>
            </div>
          )}

          {/* Draw mode canvas */}
          <canvas
            ref={canvasRef}
            id={inputId}
            role="img"
            tabIndex={disabled ? -1 : 0}
            aria-label={label ?? "Signature pad"}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={cn(
              "size-full cursor-crosshair touch-none focus:outline-none",
              focusRingStyles,
              activeMode !== "draw" && "hidden",
              canvasClassName,
            )}
          />

          {/* Subtle recorded indicator */}
          {value && activeMode === "draw" && (
            <div className="pointer-events-none absolute bottom-2.5 right-3 select-none flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-medium text-success-strong border border-success/30 shadow-2xs backdrop-blur-xs">
              <Icons.Check size="xs" className="shrink-0" />
              <span>Signed</span>
            </div>
          )}

          {/* Upload mode overlay */}
          {activeMode === "upload" && (
            <div
              onClick={(e) => {
                // input.click() dispatches a click that bubbles back here; don't re-open
                if (e.target !== fileInputRef.current) fileInputRef.current?.click()
              }}
              className={cn(
                "flex size-full cursor-pointer flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-6 text-center transition-colors",
                isDragging ? "bg-accent/10 border-2 border-dashed border-accent-strong" : "hover:bg-surface-muted/50",
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              {/* Real button so keyboard users can reach the file dialog; its click bubbles to the zone above */}
              <button
                type="button"
                className={cn("flex flex-col items-center gap-1.5 sm:gap-2 rounded-lg px-2 py-1", focusRingStyles)}
              >
                <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-surface-muted text-muted-foreground shadow-xs">
                  <Icons.Upload size="sm" />
                </span>
                <span className="text-xs font-semibold text-foreground">
                  Click to browse or drag and drop signature image
                </span>
              </button>
              <p className="text-[11px] text-muted-foreground px-2 hidden xs:block">
                Auto-removes paper background, crops signature, and enhances ink
              </p>

              {/* Sample Scan Quick Launchers */}
              <div
                className="mt-1 flex flex-wrap items-center justify-center gap-1.5 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[11px] text-muted-foreground">Or sample scan:</span>
                <button
                  type="button"
                  onClick={() => handleUploadedData(createSampleSignature("parchment"))}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-muted shadow-2xs transition-colors min-h-[28px]"
                >
                  <Icons.Scroll size="xs" className="shrink-0 text-muted-foreground" />
                  <span>Parchment</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUploadedData(createSampleSignature("notebook"))}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-muted shadow-2xs transition-colors min-h-[28px]"
                >
                  <Icons.Book size="xs" className="shrink-0 text-muted-foreground" />
                  <span>Notebook</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden input for native form submission */}
      {name && <input type="hidden" name={name} value={value || ""} />}

      {/* Hint / Error messages */}
      {error ? (
        <p id={errorId} className={fieldErrorStyles} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={fieldDescriptionStyles}>
          {hint}
        </p>
      ) : null}

      {/* Signature Editor Modal (Crop, Remove Background, Zoom, Before & After) */}
      {enableEditor && (
        <SignatureEditorModal
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          image={editorSourceImage}
          onSave={(cleanedDataUrl) => {
            fromDataURL(cleanedDataUrl)
            setActiveMode("draw")
          }}
        />
      )}
    </div>
  )
})

Signature.displayName = "Signature"

export const SignaturePad = Signature

// Re-export editor components and image processor utilities
export {
  SignatureImageEditor,
  SignatureEditorModal,
  autoDetectSignatureBounds,
  processSignatureImageData,
  processSignatureImage,
  createSampleSignature,
}
export type {
  SignatureCropRect,
  ProcessSignatureOptions,
  SignatureEditorViewMode,
  SignatureImageEditorProps,
  SignatureEditorModalProps,
}

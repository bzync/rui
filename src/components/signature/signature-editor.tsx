"use client"

import { cn } from "@/lib/cn"
import { Button } from "@/components/button"
import { Icons } from "@/components/icon"
import { Modal, ModalBody } from "@/components/modal"
import {
  type SignatureCropRect,
  type ProcessSignatureOptions,
  autoDetectSignatureBounds,
  processSignatureImageData,
  processSignatureImage,
} from "./image-processor"
import {
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

export type SignatureEditorViewMode = "edit" | "split" | "side-by-side"

export interface SignatureImageEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSave"> {
  /** The source image Data URL or URL to edit. */
  image: string
  /** Callback fired when user applies changes, returning the final cleaned and cropped Data URL. */
  onSave?: (dataUrl: string) => void
  /** Callback fired when user cancels editing. */
  onCancel?: () => void
  /** Initial view mode: "edit", "split", or "side-by-side". Defaults to "edit". */
  defaultViewMode?: SignatureEditorViewMode
  /** Initial remove background state. Defaults to true. */
  defaultRemoveBackground?: boolean
  /** Initial threshold (0-255). Defaults to 210. */
  defaultThreshold?: number
  /** Dialog or inline title. Defaults to "Enhance & Clean Signature". */
  title?: string
  /** Whether to show the top header toolbar. Defaults to true. */
  showHeader?: boolean
  /** Additional CSS class names. */
  className?: string
}

export const SignatureImageEditor = forwardRef<HTMLDivElement, SignatureImageEditorProps>(
  function SignatureImageEditor(
    {
      image,
      onSave,
      onCancel,
      defaultViewMode = "edit",
      defaultRemoveBackground = true,
      defaultThreshold = 210,
      title = "Enhance & Clean Signature",
      showHeader = true,
      className,
      ...props
    },
    ref,
  ) {
    // Processing options
    const [removeBackground, setRemoveBackground] = useState(defaultRemoveBackground)
    const [threshold, setThreshold] = useState(defaultThreshold)
    const [smoothness, setSmoothness] = useState(35)
    const [inkColor, setInkColor] = useState<string | null>(null)
    const [boostContrast, setBoostContrast] = useState(true)
    const [rotation, setRotation] = useState(0)

    // Crop state (normalized 0 to 1)
    const [crop, setCrop] = useState<SignatureCropRect>({ x: 0, y: 0, width: 1, height: 1 })

    // Viewport transforms (Zoom & Pan)
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isPanning, setIsPanning] = useState(false)
    const [isPanMode, setIsPanMode] = useState(false)
    const panStartRef = useRef({ startX: 0, startY: 0, startPanX: 0, startPanY: 0 })

    // View mode & comparison
    const [viewMode, setViewMode] = useState<SignatureEditorViewMode>(defaultViewMode)
    const [splitPosition, setSplitPosition] = useState(50) // percentage 0 - 100
    const [isDraggingSplit, setIsDraggingSplit] = useState(false)

    // Interactive Crop handle dragging
    const [activeHandle, setActiveHandle] = useState<string | null>(null)
    const dragStartRef = useRef({ startX: 0, startY: 0, initialCrop: { x: 0, y: 0, width: 1, height: 1 } })

    // DOM & Canvas refs
    const imageContainerRef = useRef<HTMLDivElement | null>(null)
    const splitContainerRef = useRef<HTMLDivElement | null>(null)
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const originalImageRef = useRef<HTMLImageElement | null>(null)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedDataUrl, setProcessedDataUrl] = useState<string | null>(null)

    // Load source image
    useEffect(() => {
      setImageLoaded(false)
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        originalImageRef.current = img
        setImageLoaded(true)
      }
      img.onerror = () => {
        setImageLoaded(true)
      }
      img.src = image
      if (img.complete && img.naturalWidth > 0) {
        originalImageRef.current = img
        setImageLoaded(true)
      }
    }, [image])

    // Update processed preview canvas directly for 60fps responsiveness
    const updateProcessedCanvas = useCallback(() => {
      const img = originalImageRef.current
      if (!img) return

      const canvas = previewCanvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const srcW = img.naturalWidth || img.width || 400
      const srcH = img.naturalHeight || img.height || 200

      canvas.width = srcW
      canvas.height = srcH

      ctx.clearRect(0, 0, srcW, srcH)
      ctx.drawImage(img, 0, 0, srcW, srcH)

      try {
        const imgData = ctx.getImageData(0, 0, srcW, srcH)
        processSignatureImageData(imgData, {
          removeBackground,
          threshold,
          smoothness,
          inkColor,
          boostContrast,
        })
        ctx.putImageData(imgData, 0, 0)
        setProcessedDataUrl(canvas.toDataURL("image/png"))
      } catch {
        // Fallback
      }
    }, [removeBackground, threshold, smoothness, inkColor, boostContrast])

    useEffect(() => {
      if (imageLoaded) {
        updateProcessedCanvas()
      }
    }, [imageLoaded, updateProcessedCanvas])

    // Smart Auto-Crop
    const handleAutoCrop = () => {
      const img = originalImageRef.current
      if (!img) return

      const tempCanvas = document.createElement("canvas")
      const srcW = img.naturalWidth || img.width || 400
      const srcH = img.naturalHeight || img.height || 200
      tempCanvas.width = srcW
      tempCanvas.height = srcH
      const ctx = tempCanvas.getContext("2d")
      if (!ctx) return

      ctx.drawImage(img, 0, 0, srcW, srcH)
      try {
        const imgData = ctx.getImageData(0, 0, srcW, srcH)
        const detected = autoDetectSignatureBounds(imgData, threshold)
        setCrop(detected)
      } catch {
        // ignore
      }
    }

    // 1-Click Magic Auto-Clean
    const handleMagicAutoClean = () => {
      setRemoveBackground(true)
      setThreshold(215)
      setSmoothness(30)
      setBoostContrast(true)
      setInkColor("#0f172a")
      handleAutoCrop()
    }

    // Preset tuning shortcuts
    const applyPreset = (preset: "magic" | "clean" | "parchment" | "darken") => {
      setRemoveBackground(true)
      if (preset === "magic") {
        setThreshold(215)
        setSmoothness(30)
        setBoostContrast(true)
        setInkColor("#0f172a")
        handleAutoCrop()
      } else if (preset === "clean") {
        setThreshold(230)
        setSmoothness(25)
        setBoostContrast(false)
        setInkColor(null)
      } else if (preset === "parchment") {
        setThreshold(205)
        setSmoothness(40)
        setBoostContrast(true)
        setInkColor("#1e3a8a")
      } else if (preset === "darken") {
        setThreshold(220)
        setSmoothness(30)
        setBoostContrast(true)
        setInkColor("#0f172a")
      }
    }

    // Reset crop to full
    const handleResetCrop = () => {
      setCrop({ x: 0, y: 0, width: 1, height: 1 })
    }

    // Zoom controls
    const handleZoomIn = () => setZoom((z) => Math.min(3.5, Math.round((z + 0.25) * 100) / 100))
    const handleZoomOut = () => setZoom((z) => Math.max(0.5, Math.round((z - 0.25) * 100) / 100))
    const handleResetZoom = () => {
      setZoom(1)
      setPan({ x: 0, y: 0 })
    }

    const handleWheel = (e: ReactWheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setZoom((z) => Math.min(3.5, Math.max(0.5, Math.round((z + delta) * 100) / 100)))
      }
    }

    // Window-level smooth pointer tracking for crop dragging
    useEffect(() => {
      if (!activeHandle) return

      const handlePointerMove = (e: PointerEvent) => {
        const container = imageContainerRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        const dx = (e.clientX - dragStartRef.current.startX) / (rect.width * zoom)
        const dy = (e.clientY - dragStartRef.current.startY) / (rect.height * zoom)
        const init = dragStartRef.current.initialCrop

        let newX = init.x
        let newY = init.y
        let newW = init.width
        let newH = init.height

        if (activeHandle === "move") {
          newX = Math.max(0, Math.min(1 - newW, init.x + dx))
          newY = Math.max(0, Math.min(1 - newH, init.y + dy))
        } else {
          if (activeHandle.includes("w")) {
            const potentialW = init.width - dx
            if (potentialW >= 0.05 && init.x + dx >= 0) {
              newX = init.x + dx
              newW = potentialW
            }
          }
          if (activeHandle.includes("e")) {
            newW = Math.max(0.05, Math.min(1 - init.x, init.width + dx))
          }
          if (activeHandle.includes("n")) {
            const potentialH = init.height - dy
            if (potentialH >= 0.05 && init.y + dy >= 0) {
              newY = init.y + dy
              newH = potentialH
            }
          }
          if (activeHandle.includes("s")) {
            newH = Math.max(0.05, Math.min(1 - init.y, init.height + dy))
          }
        }

        setCrop({
          x: Math.round(newX * 1000) / 1000,
          y: Math.round(newY * 1000) / 1000,
          width: Math.round(newW * 1000) / 1000,
          height: Math.round(newH * 1000) / 1000,
        })
      }

      const handlePointerUp = () => {
        setActiveHandle(null)
      }

      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
      return () => {
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)
      }
    }, [activeHandle, zoom])

    // Window-level smooth pointer tracking for split view dragging
    useEffect(() => {
      if (!isDraggingSplit) return

      const handlePointerMove = (e: PointerEvent) => {
        const container = splitContainerRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        const relX = (e.clientX - rect.left) / rect.width
        const clamped = Math.max(5, Math.min(95, Math.round(relX * 100)))
        setSplitPosition(clamped)
      }

      const handlePointerUp = () => {
        setIsDraggingSplit(false)
      }

      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
      return () => {
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)
      }
    }, [isDraggingSplit])

    // Pan interaction
    const handlePanDown = (e: ReactPointerEvent<HTMLDivElement>) => {
      if ((!isPanMode && activeHandle) || isDraggingSplit) return
      if (e.button !== 0) return
      setIsPanning(true)
      panStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      }
      e.currentTarget.setPointerCapture?.(e.pointerId)
    }

    const handlePanMove = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isPanning) return
      const dx = e.clientX - panStartRef.current.startX
      const dy = e.clientY - panStartRef.current.startY
      setPan({
        x: panStartRef.current.startPanX + dx,
        y: panStartRef.current.startPanY + dy,
      })
    }

    const handlePanUp = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (isPanning) {
        setIsPanning(false)
        try {
          e.currentTarget.releasePointerCapture?.(e.pointerId)
        } catch {
          // ignore
        }
      }
    }

    const startCropDrag = (handle: string, e: ReactPointerEvent) => {
      if (isPanMode) return
      e.stopPropagation()
      setActiveHandle(handle)
      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialCrop: { ...crop },
      }
    }

    // Apply final export
    const handleApply = async () => {
      setIsProcessing(true)
      try {
        const finalResult = await processSignatureImage(image, {
          removeBackground,
          threshold,
          smoothness,
          inkColor,
          boostContrast,
          crop,
          rotation,
        })
        onSave?.(finalResult)
      } catch {
        const fallback = previewCanvasRef.current?.toDataURL("image/png") || image
        onSave?.(fallback)
      } finally {
        setIsProcessing(false)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-sm",
          className,
        )}
        {...props}
      >
        {/* Top Header & Toolbar */}
        {showHeader && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-surface-muted/30 px-4 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent-strong">
                <Icons.Sparkles size="sm" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
                <p className="truncate text-[11px] text-muted-foreground">
                  Remove paper background, crop signature, and adjust ink
                </p>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={<Icons.Sparkles size="xs" className="shrink-0" />}
                onClick={handleMagicAutoClean}
                className="h-7 shrink-0 gap-1.5 px-2.5 text-xs font-semibold text-accent-strong shadow-2xs"
                title="1-Click Magic Clean: removes background, auto-crops, and boosts ink"
              >
                <span>Magic Clean</span>
              </Button>

              <div className="flex items-center rounded-lg border border-border bg-bg p-0.5 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode("edit")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded px-2 sm:px-2.5 py-1 font-medium transition-colors text-xs",
                    viewMode === "edit"
                      ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icons.Crop size="xs" className="shrink-0" />
                  <span>Crop &amp; Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded px-2 sm:px-2.5 py-1 font-medium transition-colors text-xs",
                    viewMode === "split"
                      ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icons.Split size="xs" className="shrink-0" />
                  <span>Compare Split</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("side-by-side")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded px-2 sm:px-2.5 py-1 font-medium transition-colors text-xs",
                    viewMode === "side-by-side"
                      ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icons.GitCompare size="xs" className="shrink-0" />
                  <span>Side by Side</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Studio Viewport */}
        <div
          className="relative flex h-[320px] sm:h-[350px] w-full select-none items-center justify-center overflow-hidden bg-surface-muted/20"
          onWheel={handleWheel}
          onPointerDown={handlePanDown}
          onPointerMove={handlePanMove}
          onPointerUp={handlePanUp}
          style={{
            cursor: isPanMode ? (isPanning ? "grabbing" : "grab") : isPanning ? "grabbing" : "default",
            backgroundImage:
              "repeating-conic-gradient(rgba(128,128,128,0.08) 0% 25%, transparent 0% 50%)",
            backgroundSize: "16px 16px",
          }}
        >
          {/* Hidden preview worker canvas */}
          <canvas ref={previewCanvasRef} className="hidden" />

          {/* View Mode 1: Edit & Crop Viewport */}
          {viewMode === "edit" && (
            <div
              className="relative flex items-center justify-center transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              {/* Base Image Container */}
              <div
                ref={imageContainerRef}
                className="relative max-h-[min(280px,50vh)] max-w-full overflow-hidden rounded-md border border-border/80 shadow-md touch-none"
              >
                <img
                  src={processedDataUrl || image}
                  alt="Signature preview"
                  className="max-h-[min(280px,50vh)] max-w-full object-contain select-none pointer-events-none"
                  draggable={false}
                />

                {/* Crop Scrim Overlay (shaded cropped-out regions) */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.45)`,
                    left: `${crop.x * 100}%`,
                    top: `${crop.y * 100}%`,
                    width: `${crop.width * 100}%`,
                    height: `${crop.height * 100}%`,
                  }}
                />

                {/* Crop Box Window */}
                <div
                  className="absolute border-2 border-accent shadow-sm"
                  style={{
                    left: `${crop.x * 100}%`,
                    top: `${crop.y * 100}%`,
                    width: `${crop.width * 100}%`,
                    height: `${crop.height * 100}%`,
                    cursor: isPanMode ? "grab" : "move",
                  }}
                  onPointerDown={(e) => startCropDrag("move", e)}
                >
                  {/* Rule-of-thirds grid guides */}
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                    <div className="border-r border-b border-accent-foreground" />
                    <div className="border-r border-b border-accent-foreground" />
                    <div className="border-b border-accent-foreground" />
                    <div className="border-r border-b border-accent-foreground" />
                    <div className="border-r border-b border-accent-foreground" />
                    <div className="border-b border-accent-foreground" />
                  </div>

                  {/* Corner Handles (Large touch targets with invisible hit expansion) */}
                  <div
                    className="absolute -top-2 -left-2 size-4 rounded-full border-2 border-surface bg-accent shadow cursor-nwse-resize hover:scale-125 transition-transform before:absolute before:-inset-2.5 before:content-['']"
                    onPointerDown={(e) => startCropDrag("nw", e)}
                  />
                  <div
                    className="absolute -top-2 -right-2 size-4 rounded-full border-2 border-surface bg-accent shadow cursor-nesw-resize hover:scale-125 transition-transform before:absolute before:-inset-2.5 before:content-['']"
                    onPointerDown={(e) => startCropDrag("ne", e)}
                  />
                  <div
                    className="absolute -bottom-2 -left-2 size-4 rounded-full border-2 border-surface bg-accent shadow cursor-nesw-resize hover:scale-125 transition-transform before:absolute before:-inset-2.5 before:content-['']"
                    onPointerDown={(e) => startCropDrag("sw", e)}
                  />
                  <div
                    className="absolute -bottom-2 -right-2 size-4 rounded-full border-2 border-surface bg-accent shadow cursor-nwse-resize hover:scale-125 transition-transform before:absolute before:-inset-2.5 before:content-['']"
                    onPointerDown={(e) => startCropDrag("se", e)}
                  />

                  {/* Edge Handles */}
                  <div
                    className="absolute top-1/2 -left-2 h-4 w-2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent shadow cursor-ew-resize hover:scale-125 transition-transform before:absolute before:-inset-2.5 before:content-['']"
                    onPointerDown={(e) => startCropDrag("w", e)}
                  />
                  <div
                    className="absolute top-1/2 -right-2 h-4 w-2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent shadow cursor-ew-resize hover:scale-125 transition-transform before:absolute before:-inset-2.5 before:content-['']"
                    onPointerDown={(e) => startCropDrag("e", e)}
                  />
                  <div
                    className="absolute -top-2 left-1/2 h-2 w-4 -translate-x-1/2 rounded-full border-2 border-surface bg-accent shadow cursor-ns-resize hover:scale-125 transition-transform before:absolute before:-inset-2.5 before:content-['']"
                    onPointerDown={(e) => startCropDrag("n", e)}
                  />
                  <div
                    className="absolute -bottom-2 left-1/2 h-2 w-4 -translate-x-1/2 rounded-full border-2 border-surface bg-accent shadow cursor-ns-resize hover:scale-125 transition-transform before:absolute before:-inset-2.5 before:content-['']"
                    onPointerDown={(e) => startCropDrag("s", e)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* View Mode 2: Interactive Split Compare */}
          {viewMode === "split" && (
            <div
              className="relative flex items-center justify-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              <div
                ref={splitContainerRef}
                className="relative max-h-[min(280px,50vh)] max-w-full overflow-hidden rounded-md border border-border shadow-md select-none touch-none"
              >
                {/* Guide badge */}
                <div className="pointer-events-none absolute top-2 inset-x-0 flex justify-center z-10">
                  <span className="rounded-full bg-surface/90 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-xs backdrop-blur-xs">
                    Drag slider to compare Before &amp; After
                  </span>
                </div>

                {/* Processed (After) Image in Background */}
                <img
                  src={processedDataUrl || image}
                  alt="After"
                  className="max-h-[min(280px,50vh)] max-w-full object-contain select-none pointer-events-none"
                  draggable={false}
                />
                <span className="absolute bottom-2 right-2 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-semibold text-accent-strong shadow-xs backdrop-blur-xs">
                  After (Cleaned)
                </span>

                {/* Original (Before) Image Clipped on Left */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{
                    clipPath: `polygon(0 0, ${splitPosition}% 0, ${splitPosition}% 100%, 0 100%)`,
                  }}
                >
                  <img
                    src={image}
                    alt="Before"
                    className="max-h-[min(280px,50vh)] max-w-full object-contain select-none"
                    draggable={false}
                  />
                  <span className="absolute bottom-2 left-2 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-xs backdrop-blur-xs">
                    Before (Original)
                  </span>
                </div>

                {/* Vertical Drag Handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-accent cursor-ew-resize z-20"
                  style={{ left: `${splitPosition}%` }}
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    setIsDraggingSplit(true)
                  }}
                >
                  <div className="absolute top-1/2 -left-3.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border-2 border-surface bg-accent text-accent-foreground shadow-lg hover:scale-110 transition-transform">
                    <Icons.Split size="xs" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Mode 3: Side-by-Side Dual Preview */}
          {viewMode === "side-by-side" && (
            <div className="flex flex-col sm:flex-row size-full items-center justify-center gap-3 p-3 overflow-auto">
              {/* Original Card */}
              <div className="flex w-full max-w-[240px] sm:w-[240px] flex-col items-center gap-1.5 rounded-lg border border-border bg-surface p-2.5 shadow-xs">
                <span className="text-[11px] font-semibold text-muted-foreground">Original (Before)</span>
                <div className="flex h-[160px] sm:h-[190px] w-full items-center justify-center overflow-hidden rounded bg-surface-muted/30 p-2">
                  <img
                    src={image}
                    alt="Original signature"
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Cleaned Card */}
              <div className="flex w-full max-w-[240px] sm:w-[240px] flex-col items-center gap-1.5 rounded-lg border border-accent/40 bg-surface p-2.5 shadow-xs">
                <span className="text-[11px] font-semibold text-accent-strong">Cleaned (After)</span>
                <div
                  className="flex h-[160px] sm:h-[190px] w-full items-center justify-center overflow-hidden rounded p-2"
                  style={{
                    backgroundImage:
                      "repeating-conic-gradient(rgba(128,128,128,0.12) 0% 25%, transparent 0% 50%)",
                    backgroundSize: "12px 12px",
                  }}
                >
                  <img
                    src={processedDataUrl || image}
                    alt="Cleaned signature"
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Floating Zoom & Crop Quick Controls */}
          <div className="absolute bottom-2.5 right-2 sm:bottom-3 sm:right-3 flex items-center gap-0.5 sm:gap-1 rounded-lg border border-border bg-surface/90 px-1.5 sm:px-2 py-1 shadow-md backdrop-blur-xs z-10">
            <button
              type="button"
              onClick={() => setIsPanMode(!isPanMode)}
              title={isPanMode ? "Pan mode active: drag canvas to move" : "Enable pan tool to move canvas"}
              aria-label="Toggle pan mode"
              className={cn(
                "inline-flex size-6 items-center justify-center rounded transition-colors",
                isPanMode ? "bg-accent font-semibold text-accent-foreground" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <Icons.Move size="xs" className="shrink-0" />
            </button>

            <div className="mx-0.5 h-3.5 w-px bg-border" />

            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              title="Zoom out"
              aria-label="Zoom out"
              className="inline-flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-surface-muted hover:text-foreground disabled:opacity-40"
            >
              <Icons.ZoomOut size="xs" className="shrink-0" />
            </button>

            <span className="inline-flex items-center justify-center h-6 w-9 sm:w-11 text-center text-[10px] sm:text-[11px] font-medium text-foreground">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3.5}
              title="Zoom in"
              aria-label="Zoom in"
              className="inline-flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-surface-muted hover:text-foreground disabled:opacity-40"
            >
              <Icons.ZoomIn size="xs" className="shrink-0" />
            </button>

            <div className="hidden xs:block mx-1 h-3.5 w-px bg-border" />

            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset zoom &amp; fit view"
              aria-label="Reset zoom"
              className="hidden xs:inline-flex h-6 items-center justify-center rounded px-1.5 text-[11px] font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground"
            >
              Fit
            </button>
          </div>

          {/* Floating Auto-Crop Shortcut */}
          {viewMode === "edit" && (
            <div className="absolute bottom-2.5 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 rounded-lg border border-border bg-surface/90 p-1 shadow-md backdrop-blur-xs z-10">
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={<Icons.Crop size="xs" className="shrink-0" />}
                onClick={handleAutoCrop}
                className="h-7 gap-1.5 px-2.5 text-xs font-semibold shadow-xs"
                title="Automatically crop tight bounding box around signature ink"
              >
                <span>Auto Crop</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetCrop}
                className="h-7 px-1.5 sm:px-2 text-xs text-muted-foreground hover:text-foreground"
                title="Reset crop to full image"
              >
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* Adjustments & Tuning Controls Panel */}
        <div className="border-t border-border/80 bg-surface p-4">
          {/* Quick Presets Bar */}
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground whitespace-nowrap">
              <Icons.Sparkles size="xs" className="text-accent-strong shrink-0" />
              <span>Smart Enhancement Presets:</span>
            </span>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => applyPreset("magic")}
                className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-strong hover:bg-accent/20 transition-colors shadow-2xs min-h-[28px]"
              >
                <Icons.Sparkles size="xs" className="shrink-0 text-accent-strong" />
                <span>Auto Clean</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("clean")}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shadow-2xs min-h-[28px]"
              >
                <Icons.FileText size="xs" className="shrink-0 text-muted-foreground" />
                <span>White Paper</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("parchment")}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shadow-2xs min-h-[28px]"
              >
                <Icons.Scroll size="xs" className="shrink-0 text-muted-foreground" />
                <span>Yellow Paper</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("darken")}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shadow-2xs min-h-[28px]"
              >
                <Icons.PenLine size="xs" className="shrink-0 text-muted-foreground" />
                <span>Darken Ink</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Column 1: Background Removal */}
            <div className="space-y-2.5 rounded-lg border border-border/70 bg-surface-muted/20 p-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="sig-remove-bg"
                  className="flex items-center gap-1.5 text-xs font-semibold text-foreground cursor-pointer whitespace-nowrap"
                >
                  <Icons.Sparkles size="xs" className="text-accent-strong shrink-0" />
                  <span>Remove Background</span>
                </label>
                <input
                  id="sig-remove-bg"
                  type="checkbox"
                  checked={removeBackground}
                  onChange={(e) => setRemoveBackground(e.target.checked)}
                  className="size-4 rounded border-border text-accent focus:ring-accent"
                />
              </div>

              {removeBackground && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="whitespace-nowrap">Sensitivity</span>
                    <span className="font-mono font-medium text-foreground whitespace-nowrap">
                      {Math.round((threshold / 255) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="250"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-accent h-1.5 rounded-lg bg-surface-muted"
                  />

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span className="whitespace-nowrap">Edge Feather</span>
                    <span className="font-mono font-medium text-foreground whitespace-nowrap">{smoothness}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={smoothness}
                    onChange={(e) => setSmoothness(Number(e.target.value))}
                    className="w-full accent-accent h-1.5 rounded-lg bg-surface-muted"
                  />
                </div>
              )}
            </div>

            {/* Column 2: Ink Enhancement & Tint */}
            <div className="space-y-2.5 rounded-lg border border-border/70 bg-surface-muted/20 p-3">
              <div className="flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground whitespace-nowrap">
                  <Icons.Palette size="xs" className="shrink-0" />
                  <span>Ink Enhancement</span>
                </span>

                <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={boostContrast}
                    onChange={(e) => setBoostContrast(e.target.checked)}
                    className="size-3.5 rounded border-border text-accent focus:ring-accent"
                  />
                  <span>Boost Contrast</span>
                </label>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-muted-foreground">Ink Palette:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "Original", color: null },
                    { label: "Black", color: "#0f172a" },
                    { label: "Navy", color: "#1e3a8a" },
                    { label: "Royal Blue", color: "#2563eb" },
                  ].map((item) => {
                    const isSelected = inkColor === item.color
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setInkColor(item.color)}
                        className={cn(
                          "inline-flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors min-h-[26px]",
                          isSelected
                            ? "border-accent bg-accent/10 font-semibold text-accent-strong"
                            : "border-border bg-surface text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {item.color ? (
                          <span
                            className="size-2.5 shrink-0 rounded-full border border-border/60"
                            style={{ backgroundColor: item.color }}
                          />
                        ) : (
                          <Icons.Sparkles size="xs" className="size-2.5 shrink-0" />
                        )}
                        <span className="truncate">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Column 3: Orientation & Crop Info */}
            <div className="space-y-2.5 rounded-lg border border-border/70 bg-surface-muted/20 p-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground whitespace-nowrap">
                <Icons.RotateCw size="xs" className="shrink-0" />
                <span>Orientation &amp; Bounds</span>
              </span>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={<Icons.RotateCcw size="xs" className="shrink-0" />}
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                  className="h-8 w-full justify-center gap-1.5 px-1 text-xs"
                >
                  <span className="truncate">Rotate Left</span>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={<Icons.RotateCw size="xs" className="shrink-0" />}
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="h-8 w-full justify-center gap-1.5 px-1 text-xs"
                >
                  <span className="truncate">Rotate Right</span>
                </Button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span className="whitespace-nowrap">Crop Bounds:</span>
                <span className="font-mono font-medium text-foreground whitespace-nowrap">
                  {Math.round(crop.width * 100)}% × {Math.round(crop.height * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border/80 bg-surface-muted/30 px-4 py-3">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={<Icons.Check size="xs" className="shrink-0" />}
              onClick={handleApply}
              disabled={isProcessing}
              className="gap-1.5 font-semibold"
            >
              <span>Apply Signature</span>
            </Button>
          </div>
        </div>
      </div>
    )
  },
)

SignatureImageEditor.displayName = "SignatureImageEditor"

export interface SignatureEditorModalProps {
  /** Controlled open state. */
  open: boolean
  /** Callback fired when dialog open state changes. */
  onOpenChange: (open: boolean) => void
  /** The signature image Data URL to edit. */
  image: string
  /** Callback fired when user saves changes. */
  onSave: (cleanedDataUrl: string) => void
  /** Modal title. Defaults to "Enhance & Clean Signature". */
  title?: string
  /** Modal description. */
  description?: string
}

export function SignatureEditorModal({
  open,
  onOpenChange,
  image,
  onSave,
  title = "Enhance & Clean Signature",
  description = "Remove paper background, crop signature bounds, and verify quality before adopting.",
}: SignatureEditorModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={title}
      description={description}
      scrollable={true}
    >
      <ModalBody className="p-0 overflow-y-auto max-h-[85vh]">
        <SignatureImageEditor
          image={image}
          showHeader={false}
          className="border-0 shadow-none rounded-none"
          onSave={(dataUrl) => {
            onSave(dataUrl)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
        />
      </ModalBody>
    </Modal>
  )
}

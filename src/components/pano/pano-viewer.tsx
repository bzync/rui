"use client"

import { cn } from "@/lib/cn"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from "react"
import { getHotspotIcon, PanoIcons } from "./hotspot-icons"
import { PanoEngine, prefetchPanorama } from "./pano-engine"
import type {
  PanoEditorState,
  PanoHandle,
  PanoHotspot,
  PanoHotspotMedia,
  PanoHotspotSize,
  PanoHotspotTone,
  PanoScene,
  PanoView,
} from "./types"

export const DEFAULT_PANO_ACTION_LABELS: Record<string, string> = {
  book: "Book now",
  call: "Call us",
  directions: "Get directions",
  message: "Message us",
}

const hotspotToneStyles: Record<PanoHotspotTone, string> = {
  default: "bg-white/95 text-black ring-1 ring-black/10 backdrop-blur-sm",
  accent: "bg-accent-600 text-white ring-1 ring-white/25",
  success: "bg-success text-white ring-1 ring-white/25",
  warning: "bg-warning text-black ring-1 ring-black/10",
  danger: "bg-danger text-white ring-1 ring-white/25",
  glass: "bg-black/60 text-white ring-1 ring-white/30 backdrop-blur-md",
  ["dark"]: "bg-black/80 text-white ring-2 ring-white/85 backdrop-blur-sm",
}

const hotspotSizeStyles: Record<PanoHotspotSize, { pill: string; iconOnly: string; icon: string }> = {
  sm: { pill: "h-7 px-2.5 text-[11px]", iconOnly: "size-7", icon: "size-3.5" },
  md: { pill: "h-9 px-3 text-xs", iconOnly: "size-9", icon: "size-4" },
  lg: { pill: "h-10 px-4 text-sm", iconOnly: "size-10", icon: "size-4.5" },
}

export interface PanoViewerOverlayContext {
  scene: PanoScene
  view: PanoView
  lookAt: PanoHandle["lookAt"]
  zoom: PanoHandle["zoom"]
  goToScene: (id: string | number) => void
}

export interface PanoViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onLoad" | "onSelect"> {
  /** Single scene to display. Optional when `scenes` is provided. */
  scene?: PanoScene
  /** Optional multi-scene array for self-contained inline tour navigation. */
  scenes?: PanoScene[]
  /** Controlled active scene id when `scenes` is provided. */
  sceneId?: string | number
  /** Uncontrolled initial scene id when `scenes` is provided. */
  defaultSceneId?: string | number
  /** Called when the active scene changes in multi-scene mode. */
  onSceneChange?: (scene: PanoScene, index: number) => void
  /** Scene id -> name map, so `scene` hotspots without a custom label can show where they go. */
  names?: Record<string | number, string>
  /** Custom default labels for `action` hotspots. */
  actionLabels?: Record<string, string>
  /** Called when any hotspot is clicked. */
  onHotspot?: (hotspot: PanoHotspot) => void
  /** Called when an `action` hotspot is triggered. */
  onAction?: (action: string, hotspot: PanoHotspot, scene: PanoScene) => void
  /** Studio editor state (internal/advanced). */
  editor?: PanoEditorState
  /** Auto-rotation speed in degrees per second. */
  autoRotate?: number
  /** Live camera orientation callback. */
  onView?: (v: PanoView) => void
  /** Overrides `scene.yaw/pitch/fov` when this scene loads (e.g. a Walk hotspot's arrival view). */
  arrival?: Partial<PanoView> | null
  /** Decorative background mode: no pointer/keyboard input, no hotspots, hidden from screen readers. */
  background?: boolean
  /** Shows a live 360° compass & hotspot radar in the bottom-left corner. Defaults to `true` in guest mode. */
  showCompass?: boolean
  /** Shows floating HUD controls (hotspot tour stepper, auto-rotate, zoom +/-, reset, fullscreen). Defaults to `false` unless enabled. */
  showControls?: boolean
  /** Shows an inline scene filmstrip at the bottom when `scenes` has multiple scenes. */
  showFilmstrip?: boolean
  /** Shows a brief onboarding hint ("Drag to look around") until first interaction. */
  showHint?: boolean
  /** Custom fullscreen handler (e.g., to open `PanoTourDialog` instead of browser fullscreen). */
  onFullscreen?: () => void
  /** Custom hotspot pin renderer. */
  renderHotspot?: (hotspot: PanoHotspot, state: { selected: boolean; open: boolean; text?: string }) => ReactNode
  /** Custom HUD overlay renderer receiving live camera & scene controls. */
  renderOverlay?: (ctx: PanoViewerOverlayContext) => ReactNode
  onLoad?: () => void
  handle?: Ref<PanoHandle>
  hotspotClassName?: string
  children?: ReactNode
}

export const PanoViewer = forwardRef<HTMLDivElement, PanoViewerProps>(
  (
    {
      scene: sceneProp,
      scenes,
      sceneId: controlledSceneId,
      defaultSceneId,
      onSceneChange,
      names: namesProp,
      actionLabels = DEFAULT_PANO_ACTION_LABELS,
      onHotspot,
      onAction,
      editor,
      autoRotate,
      onView,
      arrival: arrivalProp,
      background = false,
      showCompass = true,
      showControls = false,
      showFilmstrip = false,
      showHint = false,
      onFullscreen,
      renderHotspot,
      renderOverlay,
      onLoad,
      handle,
      className,
      hotspotClassName,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const [internalSceneId, setInternalSceneId] = useState<string | number | undefined>(
      () => defaultSceneId ?? scenes?.[0]?.id ?? sceneProp?.id,
    )
    const [internalArrival, setInternalArrival] = useState<Partial<PanoView> | null>(null)
    const [inlineMedia, setInlineMedia] = useState<PanoHotspotMedia | null>(null)
    const [toastText, setToastText] = useState<string | null>(null)
    const [tourSpotIndex, setTourSpotIndex] = useState<number>(-1)
    const [spinning, setSpinning] = useState<boolean>(() => Boolean(autoRotate && autoRotate !== 0))
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [interacted, setInteracted] = useState(false)

    const activeSceneId = controlledSceneId ?? internalSceneId
    const scene = useMemo(() => {
      if (scenes && scenes.length > 0) {
        return scenes.find((s) => s.id === activeSceneId) ?? sceneProp ?? scenes[0]
      }
      return (
        sceneProp ?? {
          id: "empty",
          name: "Empty scene",
          image: "",
          yaw: 0,
          pitch: 0,
          fov: 75,
          hotspots: [],
        }
      )
    }, [scenes, activeSceneId, sceneProp])

    const names = useMemo(() => {
      const map: Record<string | number, string> = {}
      if (scenes) {
        for (const s of scenes) map[s.id] = s.name
      }
      return { ...map, ...namesProp }
    }, [scenes, namesProp])

    const arrival = arrivalProp !== undefined ? arrivalProp : internalArrival

    const box = useRef<HTMLDivElement | null>(null)
    const eng = useRef<PanoEngine | null>(null)
    const pins = useRef<Map<string, HTMLButtonElement>>(new Map())
    const compassDialRef = useRef<SVGSVGElement | null>(null)
    const compassLabelRef = useRef<HTMLSpanElement | null>(null)
    const spotsRef = useRef<PanoHotspot[]>(scene.hotspots)
    const onViewRef = useRef(onView)
    const onLoadRef = useRef(onLoad)
    const arrivalRef = useRef(arrival)
    const [note, setNote] = useState<string | null>(null)
    const [loadedId, setLoadedId] = useState<string | number | null>(null)
    const [liveViewState, setLiveViewState] = useState<PanoView>({
      yaw: scene.yaw,
      pitch: scene.pitch,
      fov: scene.fov,
    })
    const ready = loadedId === scene.id

    spotsRef.current = scene.hotspots
    onViewRef.current = onView
    onLoadRef.current = onLoad
    arrivalRef.current = arrival

    useEffect(() => {
      setSpinning(Boolean(autoRotate && autoRotate !== 0))
    }, [autoRotate])

    useEffect(() => {
      if (!toastText) return
      const t = window.setTimeout(() => setToastText(null), 3200)
      return () => window.clearTimeout(t)
    }, [toastText])

    useEffect(() => {
      if (typeof document === "undefined") return
      const onFsChange = () => {
        setIsFullscreen(Boolean(document.fullscreenElement && document.fullscreenElement === box.current))
      }
      document.addEventListener("fullscreenchange", onFsChange)
      return () => document.removeEventListener("fullscreenchange", onFsChange)
    }, [])

    const placeMarkers = () => {
      const e = eng.current
      if (!e) return
      const v = e.getView()
      if (compassDialRef.current) {
        compassDialRef.current.style.transform = `rotate(${-v.yaw}deg)`
      }
      if (compassLabelRef.current) {
        const deg = Math.round(((v.yaw % 360) + 360) % 360)
        const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        const dir = dirs[Math.round(deg / 45) % 8]
        compassLabelRef.current.textContent = `360° · ${deg}° ${dir}`
      }
      for (const h of spotsRef.current) {
        const el = pins.current.get(h.id)
        if (!el) continue
        const p = e.project(h.yaw, h.pitch)
        if (!p) {
          el.style.display = "none"
        } else {
          el.style.display = ""
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`
        }
      }
    }

    useImperativeHandle(
      handle,
      () => ({
        view: () => eng.current?.getView() ?? { yaw: scene.yaw, pitch: scene.pitch, fov: scene.fov },
        lookAt: (v, ms = 360, done) => eng.current?.setView(v, ms, done),
        zoom: (factor) => eng.current?.zoomBy(factor),
        gyroscope: (on) => eng.current?.setGyroscope(on) ?? Promise.resolve(false),
      }),
      [scene.yaw, scene.pitch, scene.fov],
    )

    useEffect(() => {
      if (!box.current) return
      const e = new PanoEngine(box.current, {
        interactive: !background,
        onUpdate: (v) => {
          placeMarkers()
          onViewRef.current?.(v)
          if (renderOverlay) setLiveViewState(v)
        },
      })
      eng.current = e
      return () => {
        e.destroy()
        eng.current = null
      }
    }, [background])

    useEffect(() => {
      const e = eng.current
      if (!e || !scene.image) return
      const a = arrivalRef.current
      const id = scene.id
      setNote(null)
      setTourSpotIndex(-1)
      e.setView({
        yaw: a?.yaw ?? scene.yaw,
        pitch: a?.pitch ?? scene.pitch,
        fov: a?.fov ?? scene.fov,
      })
      void e.show(scene.image, scene.preview, {
        onFirst: () => {
          setLoadedId(id)
          onLoadRef.current?.()
        },
      })
      // Prefetch linked scenes
      if (scenes && scenes.length > 1) {
        const targets = scene.hotspots
          .filter((h) => h.type === "scene" && h.target !== undefined)
          .map((h) => scenes.find((s) => s.id === h.target))
          .filter((s): s is PanoScene => Boolean(s))
        prefetchPanorama(targets.flatMap((t) => [t.preview, t.image]))
      }
    }, [scene.id, scene.image, scene.preview])

    useEffect(() => {
      const calm =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const speed = spinning ? (autoRotate || 1.8) : 0
      eng.current?.setAutoRotate(calm ? 0 : speed)
    }, [spinning, autoRotate, scene.id])

    useEffect(() => {
      placeMarkers()
    })

    const goToScene = (targetId: string | number, nextArrival?: Partial<PanoView> | null) => {
      if (!scenes) return
      const idx = scenes.findIndex((s) => s.id === targetId)
      if (idx < 0) return
      setInternalArrival(nextArrival ?? null)
      if (controlledSceneId === undefined) setInternalSceneId(targetId)
      onSceneChange?.(scenes[idx], idx)
    }

    const handleHotspotActivate = (h: PanoHotspot) => {
      const open = h.type === "info" && note === h.id
      if (h.type === "info") {
        setNote(open ? null : h.id)
        eng.current?.setView({ yaw: h.yaw, pitch: h.pitch }, 280)
        return
      }
      onHotspot?.(h)
      if (h.type === "scene" && h.target !== undefined && scenes?.some((s) => s.id === h.target)) {
        const targetId = h.target
        eng.current?.setView({ yaw: h.yaw, pitch: h.pitch }, 240, () => {
          goToScene(targetId, h.arrival ?? null)
        })
        return
      }
      if (h.type === "media" && h.media && !onHotspot) {
        setInlineMedia(h.media)
        return
      }
      if (h.type === "link" && h.url && !onHotspot) {
        window.open(h.url, "_blank", "noopener,noreferrer")
        return
      }
      if (h.type === "action") {
        const act = h.action ?? "book"
        onAction?.(act, h, scene)
        if (!onHotspot && !onAction) {
          setToastText(`${h.label || actionLabels[act] || "Action"} selected`)
        }
      }
    }

    const downPos = useRef<{ x: number; y: number } | null>(null)
    const onBoxDown = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!interacted) setInteracted(true)
      if (!editor?.picking) return
      if ((e.target as HTMLElement).closest("[data-pano-ui]")) return
      downPos.current = { x: e.clientX, y: e.clientY }
    }
    const onBoxUp = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!editor?.picking || !downPos.current || !eng.current) return
      const moved = Math.hypot(e.clientX - downPos.current.x, e.clientY - downPos.current.y)
      downPos.current = null
      if (moved < 6) {
        const { yaw, pitch } = eng.current.unproject(e.clientX, e.clientY)
        editor.onPick(yaw, pitch)
      }
    }

    const onDoubleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
      if (background || editor) return
      if ((e.target as HTMLElement).closest("[data-pano-ui]")) return
      if (!eng.current) return
      const { yaw, pitch } = eng.current.unproject(e.clientX, e.clientY)
      const currentFov = eng.current.getView().fov
      const nextFov = currentFov > 52 ? Math.max(38, currentFov * 0.72) : 75
      eng.current.setView({ yaw, pitch, fov: nextFov }, 320)
    }

    const grab = (h: PanoHotspot) => (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (!editor || !eng.current) return
      e.stopPropagation()
      const btn = e.currentTarget
      btn.setPointerCapture?.(e.pointerId)
      const x0 = e.clientX
      const y0 = e.clientY
      let dragged = false

      const move = (ev: PointerEvent) => {
        if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 4) dragged = true
        if (!dragged || !eng.current) return
        const { yaw, pitch } = eng.current.unproject(ev.clientX, ev.clientY)
        editor.onMove(h.id, yaw, pitch)
      }
      const up = (ev: PointerEvent) => {
        btn.removeEventListener("pointermove", move)
        btn.removeEventListener("pointerup", up)
        btn.removeEventListener("pointercancel", up)
        if (!dragged) editor.onSelect(h.id)
        else if (eng.current) {
          const { yaw, pitch } = eng.current.unproject(ev.clientX, ev.clientY)
          editor.onMove(h.id, yaw, pitch)
        }
      }
      btn.addEventListener("pointermove", move)
      btn.addEventListener("pointerup", up)
      btn.addEventListener("pointercancel", up)
    }

    const spots = editor ? scene.hotspots : scene.hotspots.filter((h) => h.enabled !== false)

    const stepHotspot = (dir: 1 | -1) => {
      if (!spots.length || !eng.current) return
      const nextIdx =
        tourSpotIndex < 0
          ? dir > 0
            ? 0
            : spots.length - 1
          : (tourSpotIndex + dir + spots.length) % spots.length
      setTourSpotIndex(nextIdx)
      const targetSpot = spots[nextIdx]
      eng.current.setView({ yaw: targetSpot.yaw, pitch: targetSpot.pitch }, 380)
      if (targetSpot.type === "info") setNote(targetSpot.id)
      else setNote(null)
    }

    const toggleFullscreen = () => {
      if (onFullscreen) {
        onFullscreen()
        return
      }
      if (typeof document === "undefined" || !box.current) return
      if (document.fullscreenElement) {
        void document.exitFullscreen?.()
      } else {
        void box.current.requestFullscreen?.()
      }
    }

    return (
      <div
        ref={(node) => {
          box.current = node
          if (typeof forwardedRef === "function") forwardedRef(node)
          else if (forwardedRef) forwardedRef.current = node
        }}
        tabIndex={background ? undefined : 0}
        role={background ? undefined : "application"}
        aria-roledescription={background ? undefined : "360 degree panorama"}
        aria-label={background ? undefined : `${scene.name}. Drag or press arrow keys to look around.`}
        aria-hidden={background || undefined}
        onPointerDown={onBoxDown}
        onPointerUp={onBoxUp}
        onDoubleClick={onDoubleClick}
        className={cn(
          "relative overflow-hidden bg-surface outline-none select-none touch-none focus-visible:ring-2 focus-visible:ring-accent-500",
          background ? "pointer-events-none" : editor?.picking ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing",
          className,
        )}
        {...props}
      >
        {!ready && !background && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-white/75" aria-live="polite">
            <PanoIcons.Loader className="size-6 animate-spin" />
            <span className="sr-only">Loading {scene.name}</span>
          </div>
        )}

        {/* Editor center crosshair when placing hotspots */}
        {editor?.picking && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="grid size-10 place-items-center rounded-full border border-white/60 bg-black/25 text-white shadow-sm backdrop-blur-[1px]">
              <PanoIcons.Crosshair className="size-5 opacity-90" />
            </div>
          </div>
        )}

        {/* Hotspots layer */}
        {!background && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {spots.map((h) => {
              const Icon = getHotspotIcon(h)
              const selected = editor?.selected === h.id
              const open = !editor && h.type === "info" && note === h.id
              const text =
                h.label ||
                (h.type === "scene" && h.target !== undefined ? names[h.target] : undefined) ||
                (h.type === "action" ? (actionLabels[h.action ?? "book"] ?? "Action") : undefined) ||
                (h.type === "media" ? h.media?.caption : undefined) ||
                (h.type === "link" ? "Open link" : undefined)

              const cta = h.type === "action"
              const defaultShowLabel =
                h.type === "scene" || h.type === "action" || h.type === "link" || Boolean(editor) || Boolean(h.badge)
              const pill =
                h.showLabel === "always"
                  ? true
                  : h.showLabel === "never" || h.showLabel === "hover"
                    ? false
                    : defaultShowLabel
              const hoverTooltip = !pill && text && h.showLabel !== "never" && !open

              const resolvedTone: PanoHotspotTone =
                h.tone ?? (cta ? "accent" : pill ? "default" : "dark")
              const resolvedSize = hotspotSizeStyles[h.size ?? "md"]

              return (
                <button
                  key={h.id}
                  ref={(el) => {
                    if (el) pins.current.set(h.id, el)
                    else pins.current.delete(h.id)
                  }}
                  type="button"
                  data-pano-ui
                  onPointerDown={editor ? grab(h) : undefined}
                  onClick={editor ? undefined : () => handleHotspotActivate(h)}
                  aria-expanded={h.type === "info" && !editor ? open : undefined}
                  aria-label={text || "Detail"}
                  style={{ left: 0, top: 0, willChange: "transform" }}
                  className={cn(
                    "group pointer-events-auto absolute flex items-center gap-1.5 rounded-full font-semibold shadow-lg transition-shadow hover:ring-2 hover:ring-white/95 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none after:absolute after:-inset-2 after:rounded-full after:content-['']",
                    pill ? resolvedSize.pill : cn("grid place-items-center", resolvedSize.iconOnly),
                    hotspotToneStyles[resolvedTone],
                    selected && "ring-2 ring-accent-500 ring-offset-2 ring-offset-black/60",
                    editor && h.enabled === false && "opacity-55",
                    editor && "cursor-move",
                    hotspotClassName,
                  )}
                >
                  {h.pulse && !editor && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute inset-0 animate-ping rounded-full opacity-50 [animation-duration:2.2s]",
                        resolvedTone === "accent" ? "bg-accent-500" : "bg-white",
                      )}
                    />
                  )}
                  {renderHotspot ? (
                    renderHotspot(h, { selected: Boolean(selected), open, text })
                  ) : (
                    <>
                      <Icon className={cn("relative flex-none", resolvedSize.icon)} />
                      {pill && text && <span className="relative max-w-44 truncate">{text}</span>}
                      {h.badge && (
                        <span
                          className={cn(
                            "relative rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-tight",
                            resolvedTone === "default"
                              ? "bg-accent-600/12 text-accent-700"
                              : "bg-black/25 text-white",
                          )}
                        >
                          {h.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Hover label tooltip for icon-only pins */}
                  {hoverTooltip && (
                    <span className="pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-56 -translate-x-1/2 rounded-md bg-black/85 px-2.5 py-1 text-[11px] font-medium whitespace-normal text-white opacity-0 shadow-md transition-opacity group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100">
                      {text}
                    </span>
                  )}

                  {/* Expanded rich info card (desktop anchored tooltip) */}
                  {open && (h.label || h.description) && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2.5 hidden w-max max-w-68 -translate-x-1/2 rounded-xl border border-white/15 bg-black/90 px-3.5 py-2.5 text-left text-xs font-normal whitespace-normal text-white shadow-xl backdrop-blur-md sm:block"
                    >
                      {h.badge && (
                        <span className="mb-1 inline-block rounded bg-accent-500/25 px-1.5 py-0.5 text-[10px] font-semibold text-accent-200">
                          {h.badge}
                        </span>
                      )}
                      {h.label && <span className="block font-semibold text-white">{h.label}</span>}
                      {h.description && (
                        <span className="mt-1 block text-[11px] leading-relaxed text-white/80">
                          {h.description}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Mobile bottom info sheet for active note hotspot */}
        {!background && !editor && note && (() => {
          const activeSpot = spots.find((s) => s.id === note && s.type === "info")
          if (!activeSpot || (!activeSpot.label && !activeSpot.description)) return null
          return (
            <div
              data-pano-ui
              role="status"
              className="pointer-events-auto absolute inset-x-3 bottom-3 z-30 block rounded-xl border border-white/20 bg-black/95 p-3.5 text-white shadow-2xl backdrop-blur-md sm:hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {activeSpot.badge && (
                    <span className="mb-1 inline-block rounded bg-accent-500/25 px-1.5 py-0.5 text-[10px] font-semibold text-accent-200">
                      {activeSpot.badge}
                    </span>
                  )}
                  {activeSpot.label && <span className="block text-sm font-semibold text-white">{activeSpot.label}</span>}
                  {activeSpot.description && (
                    <p className="mt-1 text-xs leading-relaxed text-white/80">{activeSpot.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setNote(null)}
                  aria-label="Close note"
                  className="grid size-7 flex-none cursor-pointer place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 active:bg-white/30"
                >
                  <PanoIcons.X className="size-3.5" />
                </button>
              </div>
            </div>
          )
        })()}

        {/* Onboarding hint */}
        {!background && !editor && showHint && !interacted && ready && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/65 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
              <PanoIcons.Rotate3d className="size-4" />
              <span>Drag to look around · Double-click to zoom</span>
            </div>
          </div>
        )}

        {/* Toast notification for inline actions */}
        {toastText && (
          <div
            role="status"
            data-pano-ui
            className="absolute top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/80 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm"
          >
            {toastText}
          </div>
        )}

        {/* Live 360° Compass with Hotspot Radar Dots */}
        {!background && !editor && showCompass && (
          <button
            type="button"
            data-pano-ui
            onClick={() => eng.current?.setView({ yaw: scene.yaw, pitch: scene.pitch, fov: scene.fov }, 320)}
            title="Reset 360° camera view (radar dots show hotspot directions)"
            aria-label="Reset 360° camera view"
            className={cn(
              "absolute left-3 z-10 inline-flex h-8 sm:h-7 cursor-pointer items-center gap-1.5 rounded-full bg-black/60 px-2 sm:px-2.5 text-[11px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80",
              showFilmstrip && scenes && scenes.length > 1 ? "bottom-14" : "bottom-3",
            )}
          >
            <svg
              ref={compassDialRef}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="size-4 shrink-0"
            >
              <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
              {/* Radar dots for each hotspot in the current scene */}
              {spots.map((h) => {
                const rad = (h.yaw * Math.PI) / 180
                const cx = 12 + Math.sin(rad) * 9.5
                const cy = 12 - Math.cos(rad) * 9.5
                return (
                  <circle
                    key={h.id}
                    cx={cx}
                    cy={cy}
                    r="1.7"
                    fill={h.type === "scene" || h.type === "action" ? "#38bdf8" : "#ffffff"}
                  />
                )
              })}
              <polygon points="12,4.5 14.2,12 12,10.6 9.8,12" fill="#f87171" />
              <polygon points="12,19.5 14.2,12 12,13.4 9.8,12" fill="currentColor" fillOpacity="0.7" />
            </svg>
            <span ref={compassLabelRef} className="hidden sm:inline tabular-nums">
              360° · Drag to look
            </span>
            <span className="sm:hidden font-mono text-[10px] tabular-nums">360°</span>
          </button>
        )}

        {/* Built-in Floating HUD Controls */}
        {!background && !editor && showControls && (
          <div
            data-pano-ui
            className={cn(
              "absolute right-3 z-10 flex items-center gap-0.5 sm:gap-1 rounded-full bg-black/60 p-1 text-white backdrop-blur-sm",
              showFilmstrip && scenes && scenes.length > 1 ? "bottom-14" : "bottom-3",
            )}
          >
            {spots.length > 0 && (
              <div className="flex items-center border-r border-white/20 pr-1">
                <button
                  type="button"
                  onClick={() => stepHotspot(-1)}
                  title="Previous hotspot"
                  aria-label="Previous hotspot"
                  className="grid size-7 sm:size-6 cursor-pointer place-items-center rounded-full hover:bg-white/15"
                >
                  <PanoIcons.ChevronLeft className="size-4 sm:size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => stepHotspot(1)}
                  title="Step through hotspots in this scene"
                  className="cursor-pointer px-1.5 text-[11px] font-medium tabular-nums hover:text-white/90"
                >
                  {tourSpotIndex >= 0 ? `${tourSpotIndex + 1}/${spots.length}` : `${spots.length} pins`}
                </button>
                <button
                  type="button"
                  onClick={() => stepHotspot(1)}
                  title="Next hotspot"
                  aria-label="Next hotspot"
                  className="grid size-7 sm:size-6 cursor-pointer place-items-center rounded-full hover:bg-white/15"
                >
                  <PanoIcons.ChevronRight className="size-4 sm:size-3.5" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSpinning((s) => !s)}
              aria-pressed={spinning}
              title={spinning ? "Pause 360° rotation" : "Auto-rotate 360°"}
              aria-label={spinning ? "Pause 360° rotation" : "Auto-rotate 360°"}
              className="grid size-7 sm:size-6 cursor-pointer place-items-center rounded-full hover:bg-white/15"
            >
              {spinning ? <PanoIcons.Pause className="size-3.5 sm:size-3" /> : <PanoIcons.Play className="size-3.5 sm:size-3" />}
            </button>
            <button
              type="button"
              onClick={() => eng.current?.zoomBy(1.2)}
              title="Zoom out"
              aria-label="Zoom out"
              className="hidden sm:grid size-6 cursor-pointer place-items-center rounded-full hover:bg-white/15"
            >
              <PanoIcons.ZoomOut className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => eng.current?.zoomBy(1 / 1.2)}
              title="Zoom in"
              aria-label="Zoom in"
              className="hidden sm:grid size-6 cursor-pointer place-items-center rounded-full hover:bg-white/15"
            >
              <PanoIcons.ZoomIn className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen 360° view"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen 360° view"}
              className="grid size-7 sm:size-6 cursor-pointer place-items-center rounded-full hover:bg-white/15"
            >
              {isFullscreen ? <PanoIcons.Minimize className="size-4 sm:size-3.5" /> : <PanoIcons.Maximize className="size-4 sm:size-3.5" />}
            </button>
          </div>
        )}

        {/* Inline multi-scene filmstrip switcher */}
        {!background && !editor && showFilmstrip && scenes && scenes.length > 1 && (
          <nav
            data-pano-ui
            aria-label="Tour scenes"
            className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-1.5 overflow-x-auto bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-2 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
          >
            {scenes.map((s) => {
              const active = s.id === scene.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToScene(s.id, null)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "inline-flex h-8 sm:h-7 flex-none cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors backdrop-blur-sm",
                    active
                      ? "bg-white font-semibold text-black shadow-sm"
                      : "bg-black/55 text-white/90 hover:bg-black/75",
                  )}
                >
                  {(s.preview || s.image) && (
                    <img
                      src={s.preview ?? s.image}
                      alt=""
                      className="size-4.5 sm:size-4 rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <span className="max-w-28 sm:max-w-36 truncate">{s.name}</span>
                </button>
              )
            })}
          </nav>
        )}

        {/* Built-in inline media popup when clicking a media hotspot without external handler */}
        {inlineMedia && (
          <div
            data-pano-ui
            onClick={() => setInlineMedia(null)}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-black/90 p-2 text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setInlineMedia(null)}
                aria-label="Close media"
                className="absolute top-3 right-3 z-10 grid size-7 cursor-pointer place-items-center rounded-full bg-black/70 text-white hover:bg-black"
              >
                <PanoIcons.X className="size-4" />
              </button>
              {inlineMedia.kind === "image" && inlineMedia.src && (
                <img
                  src={inlineMedia.src}
                  alt={inlineMedia.caption ?? ""}
                  className="max-h-64 w-full rounded-lg object-contain"
                />
              )}
              {inlineMedia.caption && (
                <p className="px-2 pt-2 pb-1 text-center text-xs text-white/90">{inlineMedia.caption}</p>
              )}
            </div>
          </div>
        )}

        {renderOverlay && (
          <div data-pano-ui className="contents">
            {renderOverlay({
              scene,
              view: liveViewState,
              lookAt: (v, ms = 360, done) => eng.current?.setView(v, ms, done),
              zoom: (factor) => eng.current?.zoomBy(factor),
              goToScene: (id) => goToScene(id, null),
            })}
          </div>
        )}

        <div data-pano-ui className="contents">
          {children}
        </div>
      </div>
    )
  },
)

PanoViewer.displayName = "PanoViewer"
export type { PanoHandle }

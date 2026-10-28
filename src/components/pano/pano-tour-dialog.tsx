"use client"

import { useHydrated } from "@/hooks/use-hydrated"
import { cn } from "@/lib/cn"
import { forwardRef, useEffect, useId, useMemo, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes } from "react"
import { ThemePortal } from "../theme-provider"
import { PanoIcons } from "./hotspot-icons"
import { prefetchPanorama } from "./pano-engine"
import { canSpeak, primeSpeech, speakText } from "./pano-speech"
import { PanoViewer, type PanoHandle } from "./pano-viewer"
import type { PanoHotspot, PanoHotspotMedia, PanoScene, PanoView } from "./types"

export interface PanoTourContactInfo {
  phone?: string
  address?: string
  messageUrl?: string
  bookUrl?: string
}

export interface PanoTourDialogProps {
  /** Whether the modal is open. Defaults to `true` when rendered conditionally. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  /** Title of the place or tour shown in the top bar. */
  title?: string
  /** Alias for `title` (backwards-compatible with HHC `TourDialog`). */
  placeName?: string
  /** Direct array of 360° scenes. */
  scenes?: PanoScene[]
  /** Async loader returning scenes when opened. */
  loadScenes?: () => Promise<PanoScene[] | { scenes: PanoScene[] }>
  /** Scene id to start at. Defaults to the first scene. */
  startScene?: string | number
  /** Ambient rotation speed in degrees/sec. Set 0 to disable. */
  autoRotate?: number
  /** Custom handler when an `action` hotspot is clicked. */
  onAction?: (action: string, hotspot: PanoHotspot, scene: PanoScene) => void
  /** Custom handler when a `link` hotspot is clicked. */
  onNavigate?: (url: string, hotspot: PanoHotspot) => void
  /** Optional contact info used by default `book`/`call`/`directions`/`message` actions. */
  contactInfo?: PanoTourContactInfo
  className?: string
}

export function PanoTourDialog({
  open = true,
  onOpenChange,
  onClose,
  title,
  placeName,
  scenes: scenesProp,
  loadScenes,
  startScene,
  autoRotate = 2.2,
  onAction,
  onNavigate,
  contactInfo,
  className,
}: PanoTourDialogProps) {
  const hydrated = useHydrated()
  const titleId = useId()
  const tourTitle = title ?? placeName ?? "360° Tour"

  const [loadedScenes, setLoadedScenes] = useState<PanoScene[] | null>(scenesProp ?? null)
  const [failed, setFailed] = useState(false)
  const [index, setIndex] = useState(0)
  const [arrival, setArrival] = useState<Partial<PanoView> | null>(null)
  const [media, setMedia] = useState<PanoHotspotMedia | null>(null)
  const [gyro, setGyro] = useState(false)
  const [narrate, setNarrate] = useState(false)
  const [caption, setCaption] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const pano = useRef<PanoHandle>(null)

  const close = () => {
    onOpenChange?.(false)
    onClose?.()
  }

  useEffect(() => {
    if (scenesProp) {
      setLoadedScenes(scenesProp)
      setFailed(false)
      if (startScene !== undefined) {
        const i = scenesProp.findIndex((s) => s.id === startScene)
        if (i >= 0) setIndex(i)
      }
      return
    }
    if (!open || !loadScenes) return
    let alive = true
    setFailed(false)
    setLoadedScenes(null)
    loadScenes()
      .then((res) => {
        if (!alive) return
        const list = Array.isArray(res) ? res : res.scenes
        setLoadedScenes(list)
        if (startScene !== undefined) {
          const i = list.findIndex((s) => s.id === startScene)
          if (i >= 0) setIndex(i)
        }
      })
      .catch(() => {
        if (alive) setFailed(true)
      })
    return () => {
      alive = false
    }
  }, [open, scenesProp, loadScenes, startScene])

  useEffect(() => {
    if (!open || !hydrated) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeBtnRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        if (media) setMedia(null)
        else close()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
  }, [open, hydrated, media])

  const scenes = loadedScenes
  const scene = scenes?.[index]
  const names = useMemo(() => Object.fromEntries((scenes ?? []).map((s) => [s.id, s.name])), [scenes])

  useEffect(() => {
    if (!scene || !scenes) return
    const linked = scene.hotspots
      .filter((h) => h.type === "scene" && h.target !== undefined)
      .map((h) => scenes.find((s) => s.id === h.target))
    prefetchPanorama([
      ...linked.map((s) => s?.preview),
      ...linked.map((s) => s?.image),
      ...scenes.map((s) => s.preview),
    ])
  }, [scene, scenes])

  useEffect(() => {
    if (!narrate) return
    const text = scene?.description?.trim()
    if (!text) return
    const stop = speakText(text, {
      sentence: (s) => setCaption(s),
      end: () => setCaption(null),
    })
    return () => {
      stop()
      setCaption(null)
    }
  }, [narrate, scene?.id, scene?.description])

  useEffect(() => {
    if (!notice) return
    const t = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(t)
  }, [notice])

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onFs)
    return () => document.removeEventListener("fullscreenchange", onFs)
  }, [])

  if (!open || !hydrated) return null

  const go = (i: number, via: Partial<PanoView> | null = null) => {
    setArrival(via)
    setMedia(null)
    setIndex(i)
  }

  const runHotspot = (h: PanoHotspot) => {
    if (!scenes || !scene) return
    if (h.type === "scene" && h.target !== undefined) {
      const i = scenes.findIndex((s) => s.id === h.target)
      if (i >= 0) {
        const v = pano.current?.view()
        pano.current?.lookAt(
          { yaw: h.yaw, pitch: h.pitch, fov: Math.max(35, (v?.fov ?? 75) * 0.7) },
          320,
          () => go(i, h.arrival ?? null),
        )
      }
    } else if (h.type === "media" && h.media) {
      setMedia(h.media)
    } else if (h.type === "link" && h.url) {
      if (onNavigate) {
        onNavigate(h.url, h)
      } else if (/^https?:\/\//i.test(h.url)) {
        window.open(h.url, "_blank", "noopener,noreferrer")
      } else {
        close()
        window.location.assign(h.url)
      }
    } else if (h.type === "action") {
      const act = h.action ?? "book"
      if (onAction) {
        onAction(act, h, scene)
        return
      }
      if (act === "book" && contactInfo?.bookUrl) {
        close()
        window.location.assign(contactInfo.bookUrl)
      } else if (act === "call" && contactInfo?.phone) {
        window.location.href = `tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`
      } else if (act === "directions" && contactInfo?.address) {
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`,
          "_blank",
          "noopener,noreferrer",
        )
      } else if (act === "message" && contactInfo?.messageUrl) {
        window.open(contactInfo.messageUrl, "_blank", "noopener,noreferrer")
      } else {
        setNotice(`Triggered action: ${h.label || act}`)
      }
    }
  }

  const toggleGyro = async () => {
    const on = !gyro
    const ok = (await pano.current?.gyroscope(on)) ?? false
    setGyro(on && ok)
    if (on && !ok) setNotice("Tilt controls aren’t available on this device.")
  }

  const toggleNarration = () => {
    const on = !narrate
    if (on) {
      primeSpeech()
      if (!scene?.description?.trim() && !scenes?.some((s) => s.description?.trim())) {
        setNotice("This tour doesn’t have spoken descriptions yet.")
      }
    }
    setNarrate(on)
  }

  const toggleFullscreen = () => {
    const el = rootRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
    } else {
      el.requestFullscreen?.().catch(() => setNotice("Fullscreen isn’t supported in this browser."))
    }
  }

  const hasDescriptions = Boolean(scenes?.some((s) => s.description?.trim()))
  const speechOk = canSpeak()
  const canGyro = typeof window !== "undefined" && "DeviceOrientationEvent" in window
  const roundBtn =
    "grid size-10 cursor-pointer place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"

  return (
    <ThemePortal>
      <div
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed inset-0 z-(--z-modal) flex h-dvh w-screen max-w-none flex-col overflow-hidden bg-black p-0 text-white",
          className,
        )}
      >
        <h2 id={titleId} className="sr-only">
          {tourTitle} — 360° tour
        </h2>

        <div className="relative flex-1">
          {scene ? (
            <PanoViewer
              handle={pano}
              scene={scene}
              arrival={arrival}
              names={names}
              onHotspot={runHotspot}
              autoRotate={autoRotate}
              className="size-full"
            />
          ) : (
            <div className="grid size-full place-items-center text-sm text-white/75">
              {failed
                ? "Couldn’t load this 360° tour."
                : scenes
                  ? "This 360° tour has no scenes yet."
                  : "Loading 360° tour…"}
            </div>
          )}

          {/* Top HUD bar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-3 sm:p-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white/75">{tourTitle}</p>
              {scene && (
                <p className="truncate text-base font-semibold">
                  {scene.name}
                  {scenes && scenes.length > 1 && (
                    <span className="ml-2 text-xs font-normal text-white/65">
                      {index + 1} of {scenes.length}
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="pointer-events-auto flex flex-none items-center gap-1.5">
              {scene && (
                <>
                  <button
                    type="button"
                    onClick={() => pano.current?.zoom(1 / 1.25)}
                    aria-label="Zoom in"
                    title="Zoom in (+)"
                    className={cn(roundBtn, "hidden sm:grid")}
                  >
                    <PanoIcons.ZoomIn className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => pano.current?.zoom(1.25)}
                    aria-label="Zoom out"
                    title="Zoom out (-)"
                    className={cn(roundBtn, "hidden sm:grid")}
                  >
                    <PanoIcons.ZoomOut className="size-4" />
                  </button>
                  {canGyro && (
                    <button
                      type="button"
                      onClick={toggleGyro}
                      aria-pressed={gyro}
                      aria-label="Tilt phone to look around"
                      title="Tilt to look around"
                      className={cn(roundBtn, "sm:hidden", gyro && "bg-white text-black hover:bg-white/90")}
                    >
                      <PanoIcons.Compass className="size-4" />
                    </button>
                  )}
                  {(hasDescriptions || speechOk) && (
                    <button
                      type="button"
                      onClick={toggleNarration}
                      aria-pressed={narrate}
                      aria-label={narrate ? "Turn narration off" : "Read scene descriptions aloud"}
                      title={narrate ? "Narration on" : "Read descriptions aloud"}
                      className={cn(roundBtn, narrate && "bg-white text-black hover:bg-white/90")}
                    >
                      {narrate ? <PanoIcons.Volume2 className="size-4" /> : <PanoIcons.VolumeX className="size-4" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                    title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                    className={cn(roundBtn, "hidden sm:grid")}
                  >
                    {fullscreen ? <PanoIcons.Minimize className="size-4" /> : <PanoIcons.Maximize className="size-4" />}
                  </button>
                </>
              )}
              <button
                ref={closeBtnRef}
                type="button"
                onClick={close}
                aria-label="Close 360° tour"
                className={roundBtn}
              >
                <PanoIcons.X className="size-5" />
              </button>
            </div>
          </div>

          {/* Captions & notices */}
          {(caption || (narrate && scene?.description) || notice) && (
            <div
              role="status"
              aria-live="polite"
              className="pointer-events-none absolute inset-x-3 bottom-24 flex justify-center sm:bottom-28"
            >
              <p className="max-w-xl rounded-lg bg-black/75 px-3.5 py-2 text-center text-xs leading-relaxed text-white backdrop-blur-sm sm:text-sm">
                {notice ?? caption ?? scene?.description}
              </p>
            </div>
          )}

          {/* Scene filmstrip */}
          {scenes && scenes.length > 1 && (
            <nav
              aria-label="Scenes"
              className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:justify-center sm:p-4"
            >
              {scenes.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "relative h-14 w-24 flex-none cursor-pointer overflow-hidden rounded-md ring-2 transition-opacity sm:h-16 sm:w-28",
                    i === index ? "ring-white" : "opacity-75 ring-transparent hover:opacity-100",
                  )}
                >
                  <img
                    src={s.preview ?? s.image}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                  <span className="absolute inset-x-0 bottom-0 truncate bg-black/65 px-1.5 py-0.5 text-[0.7rem] font-medium">
                    {s.name}
                  </span>
                </button>
              ))}
            </nav>
          )}

          {media && <PanoMediaPopup media={media} onClose={() => setMedia(null)} />}
        </div>
      </div>
    </ThemePortal>
  )
}

export const TourDialog = PanoTourDialog
export const PanoTourModal = PanoTourDialog

function PanoMediaPopup({ media, onClose }: { media: PanoHotspotMedia; onClose: () => void }) {
  const embed = media.kind === "video" ? videoEmbed(media.url ?? "") : null
  return (
    <div
      role="dialog"
      aria-label={media.caption || "Media"}
      onClick={onClose}
      className="absolute inset-0 z-20 grid place-items-center bg-black/80 p-4 backdrop-blur-xs"
    >
      <figure
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85dvh] w-full max-w-3xl overflow-hidden rounded-xl bg-surface text-foreground shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close media"
          className="absolute top-2.5 right-2.5 z-10 grid size-9 cursor-pointer place-items-center rounded-full bg-black/65 text-white hover:bg-black/85"
        >
          <PanoIcons.X className="size-4" />
        </button>
        {media.kind === "image" && media.src && (
          <img src={media.src} alt={media.caption ?? ""} className="max-h-[75dvh] w-full bg-black object-contain" />
        )}
        {media.kind === "video" &&
          (embed ? (
            <iframe
              src={embed}
              title={media.caption || "Video"}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full bg-black"
            />
          ) : (
            <p className="p-6 text-sm text-muted-foreground">This video link couldn’t be played.</p>
          ))}
        {media.caption && <figcaption className="px-4 py-2.5 text-sm">{media.caption}</figcaption>}
      </figure>
    </div>
  )
}

function videoEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0]
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
    }
    if (u.hostname.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") || u.pathname.match(/\/(embed|shorts)\/([^/?]+)/)?.[2]
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
    }
    if (u.hostname.endsWith("vimeo.com")) {
      const id = u.pathname.match(/\/(\d+)/)?.[1]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {
    /* invalid URL */
  }
  return null
}

/* ---------------- PanoTourButton ---------------- */

export interface PanoTourButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string
  scenes?: PanoScene[]
  loadScenes?: () => Promise<PanoScene[] | { scenes: PanoScene[] }>
  startScene?: string | number
  variant?: "chip" | "link" | "solid"
  label?: string
  contactInfo?: PanoTourContactInfo
  onAction?: (action: string, hotspot: PanoHotspot, scene: PanoScene) => void
}

const buttonVariants: Record<NonNullable<PanoTourButtonProps["variant"]>, string> = {
  chip: "inline-flex h-8 items-center gap-1.5 rounded-full bg-black/65 px-3 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/80",
  link: "inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong hover:underline",
  solid: "inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-md)] bg-accent-600 px-3.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-accent-700",
}

export const PanoTourButton = forwardRef<HTMLButtonElement, PanoTourButtonProps>(
  (
    {
      title = "360° Tour",
      scenes,
      loadScenes,
      startScene,
      variant = "chip",
      label = "360° tour",
      contactInfo,
      onAction,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false)

    if (scenes && scenes.length === 0 && !loadScenes) return null

    return (
      <>
        <button
          ref={ref}
          type="button"
          onClick={(e) => {
            onClick?.(e)
            if (!e.defaultPrevented) setOpen(true)
          }}
          aria-label={label === "360° tour" && title ? `360° tour of ${title}` : label}
          className={cn("cursor-pointer", buttonVariants[variant], className)}
          {...props}
        >
          <PanoIcons.Rotate3d className="size-3.5" />
          {label}
        </button>
        {open && (
          <PanoTourDialog
            open={open}
            onOpenChange={setOpen}
            title={title}
            scenes={scenes}
            loadScenes={loadScenes}
            startScene={startScene}
            contactInfo={contactInfo}
            onAction={onAction}
          />
        )}
      </>
    )
  },
)

PanoTourButton.displayName = "PanoTourButton"
export const TourButton = PanoTourButton
export const PanoTourTrigger = PanoTourButton

/* ---------------- PanoBackdrop ---------------- */

export interface PanoBackdropProps extends HTMLAttributes<HTMLDivElement> {
  scene: PanoScene | null
  title?: string
  scenes?: PanoScene[]
  fallbackPhoto: string
  fallbackAlt?: string
  spinSpeed?: number
  fov?: number
  triggerLabel?: string
  /** Whether users can also drag to look around directly in the backdrop. Defaults to `true`. */
  interactive?: boolean
}

export const PanoBackdrop = forwardRef<HTMLDivElement, PanoBackdropProps>(
  (
    {
      scene,
      title = "Featured Tour",
      scenes,
      fallbackPhoto,
      fallbackAlt = "",
      spinSpeed = 2.4,
      fov = 60,
      triggerLabel,
      interactive = true,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const box = useRef<HTMLDivElement | null>(null)
    const [on, setOn] = useState(false)
    const [shown, setShown] = useState(false)
    const [inView, setInView] = useState(true)
    const [touring, setTouring] = useState(false)

    useEffect(() => {
      if (!scene) return
      const calm =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const net = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
      if (calm || net?.saveData || /(^|-)2g$/.test(net?.effectiveType ?? "")) return
      setOn(true)
    }, [scene])

    useEffect(() => {
      const el = box.current
      if (!el || !on || typeof IntersectionObserver === "undefined") return
      const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 })
      io.observe(el)
      return () => io.disconnect()
    }, [on])

    return (
      <div
        ref={(node) => {
          box.current = node
          if (typeof forwardedRef === "function") forwardedRef(node)
          else if (forwardedRef) forwardedRef.current = node
        }}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <img src={fallbackPhoto} alt={fallbackAlt} className="pointer-events-none absolute inset-0 size-full object-cover" />
        {scene && on && (
          <PanoViewer
            background={!interactive}
            showCompass={interactive && !children}
            scene={{ ...scene, fov: Math.min(scene.fov, fov), hotspots: [] }}
            autoRotate={inView ? spinSpeed : 0}
            onLoad={() => setShown(true)}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              shown ? "opacity-100" : "opacity-0",
            )}
          />
        )}
        {children && <div className="pointer-events-none relative z-10 h-full">{children}</div>}
        {scene && (
          <button
            type="button"
            onClick={() => setTouring(true)}
            className="absolute top-3 right-3 z-20 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-black/55 px-3 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/75"
          >
            <PanoIcons.Rotate3d className="size-3.5" />
            <span>{triggerLabel ?? `Look around: ${scene.name}`}</span>
          </button>
        )}
        {touring && scene && (
          <PanoTourDialog
            open={touring}
            onOpenChange={setTouring}
            title={title}
            scenes={scenes ?? [scene]}
            startScene={scene.id}
          />
        )}
      </div>
    )
  },
)

PanoBackdrop.displayName = "PanoBackdrop"
export const HeroBackdrop = PanoBackdrop

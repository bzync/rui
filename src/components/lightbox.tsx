"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { CloseIcon } from "@/lib/icons"
import { useControllableState } from "@/hooks/use-controllable-state"
import { useEventCallback } from "@/hooks/use-event-callback"
import { useFocusTrap, useRestoreFocus } from "@/hooks/use-focus-trap"
import { useHydrated } from "@/hooks/use-hydrated"
import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useId, useRef, useState } from "react"
import { ThemePortal } from "./theme-provider"

export interface LightboxImage {
  src: string
  alt: string
  caption?: ReactNode
  /** Smaller image for the thumbnail strip. Defaults to `src`. */
  thumbnail?: string
}

export interface LightboxProps {
  images: LightboxImage[]
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Controlled index of the shown image. */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Wraps from the last image to the first. Default false. */
  loop?: boolean
  /** Shows a thumbnail strip. Default true when there is more than one image. */
  thumbnails?: boolean
  ariaLabel?: string
  className?: string
}

const Arrow = ({ direction }: { direction: "left" | "right" }) => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} /></svg>
)

const controlStyles = cn("grid size-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65 disabled:pointer-events-none disabled:opacity-30", focusRingStyles)

/**
 * Full-screen image viewer. Arrow keys, swipe and the buttons move between
 * images; Escape, the close button or a click on the backdrop closes it.
 * It is a modal dialog: focus is trapped inside and restored on close, the
 * page cannot scroll, and the position ("3 of 8") is announced.
 */
export function Lightbox({
  images,
  open,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  loop = false,
  thumbnails,
  ariaLabel = "Image viewer",
  className,
}: LightboxProps) {
  const [index, setIndex] = useControllableState({ value: indexProp, defaultValue: defaultIndex, onChange: onIndexChange })
  const [shown, setShown] = useState(false)
  const [dragX, setDragX] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const hydrated = useHydrated()
  const close = useEventCallback(() => onOpenChange(false))
  const statusId = useId()
  useRestoreFocus(open)
  useFocusTrap(panelRef, { active: open && hydrated, onEscape: close })

  const count = images.length
  const safe = Math.min(Math.max(index, 0), Math.max(count - 1, 0))
  const image = images[safe]
  const hasPrev = loop ? count > 1 : safe > 0
  const hasNext = loop ? count > 1 : safe < count - 1
  const go = (delta: number) => {
    if (!count) return
    const next = loop ? (safe + delta + count) % count : Math.min(Math.max(safe + delta, 0), count - 1)
    if (next !== safe) setIndex(next)
  }

  useEffect(() => {
    if (!open) { setShown(false); return }
    const frame = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(frame)
  }, [open])

  // Preload neighbours so moving feels instant.
  useEffect(() => {
    if (!open) return
    for (const offset of [-1, 1]) {
      const neighbour = images[(safe + offset + count) % count]
      if (neighbour) { const preload = new window.Image(); preload.src = neighbour.src }
    }
  }, [open, safe, images, count])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); go(-1) }
      else if (event.key === "ArrowRight") { event.preventDefault(); go(1) }
      else if (event.key === "Home") { event.preventDefault(); setIndex(0) }
      else if (event.key === "End") { event.preventDefault(); setIndex(count - 1) }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  })

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" || count < 2) return
    const startX = event.clientX
    const target = event.currentTarget
    target.setPointerCapture?.(event.pointerId)
    const move = (e: PointerEvent) => setDragX(e.clientX - startX)
    const up = (e: PointerEvent) => {
      target.removeEventListener("pointermove", move)
      target.removeEventListener("pointerup", up)
      target.removeEventListener("pointercancel", up)
      const delta = e.clientX - startX
      setDragX(0)
      if (Math.abs(delta) > 60) go(delta < 0 ? 1 : -1)
    }
    target.addEventListener("pointermove", move)
    target.addEventListener("pointerup", up)
    target.addEventListener("pointercancel", up)
  }

  if (!open || !image) return null
  const showThumbs = thumbnails ?? count > 1

  return (
    <ThemePortal>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-describedby={statusId}
        tabIndex={-1}
        className={cn("fixed inset-0 z-(--z-modal) flex flex-col bg-black/95 text-white backdrop-blur-md outline-none transition-opacity duration-200", shown ? "opacity-100" : "opacity-0", className)}
      >
        <div className="flex h-14 shrink-0 items-center gap-3 px-4">
          <p id={statusId} aria-live="polite" className="text-sm tabular-nums text-white/75">
            {count > 1 ? `${safe + 1} of ${count}` : ""}<span className="sr-only">{count > 1 ? ": " : ""}{image.alt}</span>
          </p>
          <button type="button" onClick={close} aria-label="Close viewer" className={cn(controlStyles, "ml-auto")}>
            <CloseIcon size={18} aria-hidden="true" />
          </button>
        </div>

        <div
          className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-4 sm:px-16"
          onClick={(event) => { if (event.target === event.currentTarget) close() }}
          onPointerDown={onPointerDown}
        >
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            draggable={false}
            className="max-h-full max-w-full select-none rounded-md object-contain shadow-2xl transition-transform duration-200"
            style={{ transform: dragX ? `translateX(${dragX}px)` : undefined, transitionDuration: dragX ? "0ms" : undefined }}
          />
          {count > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} disabled={!hasPrev} aria-label="Previous image" className={cn(controlStyles, "absolute left-3 top-1/2 hidden -translate-y-1/2 sm:grid")}>
                <Arrow direction="left" />
              </button>
              <button type="button" onClick={() => go(1)} disabled={!hasNext} aria-label="Next image" className={cn(controlStyles, "absolute right-3 top-1/2 hidden -translate-y-1/2 sm:grid")}>
                <Arrow direction="right" />
              </button>
            </>
          )}
        </div>

        <div className="shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          {image.caption && <p className="mx-auto mb-3 max-w-2xl text-center text-sm text-white/85">{image.caption}</p>}
          {count > 1 && (
            <div className="mb-3 flex items-center justify-center gap-3 sm:hidden">
              <button type="button" onClick={() => go(-1)} disabled={!hasPrev} aria-label="Previous image" className={controlStyles}><Arrow direction="left" /></button>
              <button type="button" onClick={() => go(1)} disabled={!hasNext} aria-label="Next image" className={controlStyles}><Arrow direction="right" /></button>
            </div>
          )}
          {showThumbs && (
            <ul className="mx-auto flex max-w-full justify-start gap-2 overflow-x-auto pb-1 sm:justify-center" aria-label="Thumbnails">
              {images.map((item, i) => (
                <li key={`${item.src}-${i}`} className="shrink-0">
                  <button
                    type="button"
                    aria-label={`Show image ${i + 1}: ${item.alt}`}
                    aria-current={i === safe ? "true" : undefined}
                    onClick={() => setIndex(i)}
                    className={cn("block size-14 overflow-hidden rounded-md opacity-55 ring-2 ring-transparent transition hover:opacity-90", i === safe && "opacity-100 ring-white", focusRingStyles)}
                  >
                    <img src={item.thumbnail ?? item.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ThemePortal>
  )
}

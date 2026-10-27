"use client"

import { cn } from "@/lib/cn"
import { mergeRefs } from "@/lib/merge-refs"
import { type CSSProperties, type ImgHTMLAttributes, type ReactNode, forwardRef, useEffect, useRef, useState } from "react"

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "placeholder"> {
  src: string
  /** Required: describe the image, or pass "" for a decorative one. */
  alt: string
  /** Reserves space before load, e.g. `16 / 9` or `"4 / 3"`. */
  aspectRatio?: number | string
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  /** `blur` shows `blurDataURL` blurred until load; `skeleton` shows a shimmer; `none` shows nothing. */
  placeholder?: "blur" | "skeleton" | "none"
  /** Tiny inline image (data URL) used by the blur placeholder. */
  blurDataURL?: string
  /** Tried once if `src` fails. */
  fallbackSrc?: string
  /** Rendered when both `src` and `fallbackSrc` fail. Defaults to an icon with the alt text. */
  fallback?: ReactNode
  /** Default "lazy"; use "eager" for above-the-fold images. */
  loading?: "lazy" | "eager"
  rounded?: boolean
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
}

type Status = "loading" | "loaded" | "error"

/**
 * Image with reserved space, a blur or skeleton placeholder, a fade-in on
 * load, and graceful fallback. Lazy-loads and decodes asynchronously by
 * default; picks up images that finished loading before hydration.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image({
  src,
  alt,
  aspectRatio,
  fit = "cover",
  placeholder = "skeleton",
  blurDataURL,
  fallbackSrc,
  fallback,
  loading = "lazy",
  rounded = true,
  className,
  wrapperClassName,
  wrapperStyle,
  onLoad,
  onError,
  width,
  height,
  ...props
}, ref) {
  const [current, setCurrent] = useState(src)
  const [status, setStatus] = useState<Status>("loading")
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => { setCurrent(src); setStatus("loading") }, [src])

  // An image cached or loaded before hydration fires no React onLoad.
  useEffect(() => {
    const img = imgRef.current
    if (!img?.complete || !img.currentSrc) return
    if (img.naturalWidth > 0) setStatus("loaded")
    else if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc)
    else setStatus("error")
  }, [current, fallbackSrc])

  const failed = status === "error"
  const ratio = typeof aspectRatio === "number" ? String(aspectRatio) : aspectRatio

  return (
    <div
      data-status={status}
      className={cn("relative overflow-hidden bg-surface-muted", rounded && "rounded-[var(--radius-lg)]", !ratio && !height && "min-h-12", wrapperClassName)}
      style={{ aspectRatio: ratio, width, height, ...wrapperStyle }}
    >
      {status === "loading" && placeholder === "blur" && blurDataURL && (
        <img src={blurDataURL} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl" />
      )}
      {status === "loading" && placeholder === "skeleton" && (
        <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-foreground/6" />
      )}
      {failed ? (
        fallback ?? (
          <div role="img" aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className="absolute inset-0 grid place-items-center gap-1 p-3 text-center text-xs text-muted-foreground">
            <span className="grid justify-items-center gap-1.5">
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /><path d="M3 3l18 18" /></svg>
              {alt && <span className="line-clamp-2">{alt}</span>}
            </span>
          </div>
        )
      ) : (
        <img
          ref={mergeRefs(imgRef, ref)}
          src={current}
          alt={alt}
          loading={loading}
          decoding="async"
          width={width}
          height={height}
          onLoad={(event) => { setStatus("loaded"); onLoad?.(event) }}
          onError={(event) => {
            if (fallbackSrc && current !== fallbackSrc) { setCurrent(fallbackSrc); setStatus("loading") }
            else setStatus("error")
            onError?.(event)
          }}
          className={cn(
            "relative block h-full w-full transition-opacity duration-300",
            status === "loaded" ? "opacity-100" : "opacity-0",
            { cover: "object-cover", contain: "object-contain", fill: "object-fill", none: "object-none", "scale-down": "object-scale-down" }[fit],
            className,
          )}
          {...props}
        />
      )}
    </div>
  )
})
Image.displayName = "Image"

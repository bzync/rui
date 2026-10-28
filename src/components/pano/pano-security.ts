import type { PanoScene } from "./types"

/**
 * Validates and sanitizes image URLs to prevent XSS / script injection via `javascript:`,
 * SVG script payloads, or malformed data URIs.
 *
 * Allows:
 * - Relative paths (`/path`, `./path`, `../path`)
 * - Safe web protocols (`http:`, `https:`, `blob:`)
 * - Safe raster / vector image data URIs (`data:image/(png|jpeg|jpg|gif|webp|avif|svg+xml)`)
 */
export function safeImageSrc(url?: string | null): string {
  if (!url) return ""
  const trimmed = url.trim()
  if (!trimmed) return ""

  // Deny dangerous executable schemes immediately
  if (/^(?:javascript|vbscript):/i.test(trimmed)) return ""

  // Allow relative URLs
  if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return trimmed
  }

  try {
    const parsed = new URL(trimmed, "https://placeholder.invalid")
    if (parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "blob:") {
      return trimmed
    }
    if (parsed.protocol === "data:" && /^data:image\/(?:png|jpe?g|gif|webp|avif|svg\+xml);/i.test(trimmed)) {
      return trimmed
    }
  } catch {
    return ""
  }

  return ""
}

/**
 * Validates external web and communication URLs for link / action hotspots.
 * Blocks `javascript:`, `vbscript:`, `data:`, etc.
 */
export function safeExternalUrl(url?: string | null): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed || /^(?:javascript|vbscript|data):/i.test(trimmed)) return null

  try {
    const parsed = new URL(trimmed, "https://placeholder.invalid")
    if (parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "mailto:" || parsed.protocol === "tel:") {
      return trimmed
    }
  } catch {
    return null
  }

  return null
}

/**
 * Generates trusted embed URLs for YouTube and Vimeo videos with strict domain validation.
 * Uses exact host comparison and explicit subdomain prefixes to prevent domain spoofing.
 */
export function videoEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.protocol !== "https:" && u.protocol !== "http:") return null
    const host = u.hostname.toLowerCase()

    if (host === "youtu.be" || host.endsWith(".youtu.be")) {
      const id = u.pathname.slice(1).split("/")[0]
      return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
    }

    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const id = u.searchParams.get("v") || u.pathname.match(/\/(?:embed|shorts)\/([\w-]+)/)?.[1]
      return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
    }

    if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
      const id = u.pathname.match(/\/(\d+)/)?.[1]
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${encodeURIComponent(id)}` : null
    }
  } catch {
    /* invalid URL */
  }
  return null
}

/**
 * Sanitizes all scenes and their embedded hotspot URLs from untrusted sources (e.g. JSON import).
 */
export function sanitizePanoScenes(scenes: PanoScene[]): PanoScene[] {
  return scenes.map((s) => ({
    ...s,
    image: safeImageSrc(s.image),
    preview: s.preview ? safeImageSrc(s.preview) : undefined,
    hotspots: (s.hotspots ?? []).map((h) => ({
      ...h,
      url: h.url ? safeExternalUrl(h.url) ?? undefined : undefined,
      media: h.media
        ? {
            ...h.media,
            src: h.media.src ? safeImageSrc(h.media.src) : undefined,
            url: h.media.url ? (videoEmbed(h.media.url) ? h.media.url : undefined) : undefined,
          }
        : undefined,
    })),
  }))
}

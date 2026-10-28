import type { PanoScene } from "./types"

/**
 * Validates and sanitizes image URLs to prevent XSS / script injection via `javascript:`,
 * SVG script payloads, or malformed data URIs.
 *
 * Allows:
 * - Relative paths (`/path`, `./path`, `../path`)
 * - Safe web protocols (`http:`, `https:`, `blob:`)
 * - Safe raster image data URIs (`data:image/(png|jpeg|jpg|gif|webp|avif);base64,...`)
 * - Safe demo SVG data URIs (without `<script>` or inline event handlers)
 */
export function safeImageSrc(url?: string | null): string {
  if (!url) return ""
  const trimmed = url.trim()
  if (!trimmed) return ""

  // Allowlist guard: strictly match safe schemes or relative paths
  const isSafeScheme =
    /^(?:https?:\/\/|blob:|\/|\.\/|\.\.\/)/i.test(trimmed) ||
    /^data:image\/(?:png|jpe?g|webp|avif|gif);base64,/i.test(trimmed) ||
    /^data:image\/svg\+xml(?:;[a-z0-9_=-]+)*,/i.test(trimmed)

  if (!isSafeScheme) return ""

  try {
    const parsed = new URL(trimmed, "https://placeholder.invalid")
    const proto = parsed.protocol

    if (proto === "http:" || proto === "https:" || proto === "blob:") {
      return encodeURI(trimmed)
    }

    if (proto === "data:" && /^data:image\/(?:png|jpe?g|webp|avif|gif);base64,/i.test(trimmed)) {
      return encodeURI(trimmed)
    }

    if (proto === "data:" && /^data:image\/svg\+xml/i.test(trimmed)) {
      // Disallow executable script tags or inline event handlers in SVG data URIs
      const lower = trimmed.toLowerCase()
      if (
        lower.includes("<script") ||
        lower.includes("javascript:") ||
        lower.includes("onload") ||
        lower.includes("onerror") ||
        lower.includes("onclick") ||
        lower.includes("onmouseover") ||
        lower.includes("onfocus") ||
        lower.includes("onblur")
      ) {
        return ""
      }
      return encodeURI(trimmed)
    }

    if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
      return encodeURI(trimmed)
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
  if (!trimmed) return null

  // Allowlist guard: only http, https, mailto, and tel are permitted
  if (!/^(?:https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return null
  }

  try {
    const parsed = new URL(trimmed, "https://placeholder.invalid")
    const proto = parsed.protocol
    if (proto === "http:" || proto === "https:" || proto === "mailto:" || proto === "tel:") {
      return encodeURI(trimmed)
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

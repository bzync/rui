const FULL_WIDTH = 4096
const FULL_QUALITY = 0.85
const PREVIEW_WIDTH = 512
const PREVIEW_QUALITY = 0.7
const MIN_WIDTH = 1024

export interface PreparedPanorama {
  image: Blob
  preview: Blob
  thumb: string
  width: number
  height: number
}

/**
 * Checks that a file is a 360° equirectangular photo (2:1 aspect ratio) and scales it
 * into a 4096×2048 full JPEG, a 512×256 preview JPEG, and a thumbnail data URL.
 */
export async function preparePanorama(file: File): Promise<PreparedPanorama> {
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
    throw new Error(`“${file.name}” isn’t a JPG, PNG, or WebP photo.`)
  }
  if (file.size > 80 * 1024 * 1024) {
    throw new Error(`“${file.name}” is over 80 MB. Export a smaller copy from your 360° camera app.`)
  }

  const bmp = await decode(file)
  try {
    const { width: w, height: h } = bmp
    const ratio = w / h
    if (Math.abs(ratio - 2) > 0.05) {
      throw new Error(
        `“${file.name}” is ${w}×${h}, which isn’t a 360° panorama (those are twice as wide as tall, like 4096×2048).`,
      )
    }
    if (w < MIN_WIDTH) {
      throw new Error(`“${file.name}” is only ${w}px wide. Use a photo at least ${MIN_WIDTH}×${MIN_WIDTH / 2} so it doesn’t look blurry.`)
    }

    const fullW = Math.min(FULL_WIDTH, w - (w % 2))
    const fullH = Math.round(fullW / 2)
    const image = await renderToJpeg(bmp, fullW, fullH, FULL_QUALITY)
    const preview = await renderToJpeg(bmp, PREVIEW_WIDTH, PREVIEW_WIDTH / 2, PREVIEW_QUALITY)
    const thumb = await blobToDataUrl(preview)
    return { image, preview, thumb, width: fullW, height: fullH }
  } finally {
    bmp.close()
  }
}

/** Resizes a hotspot popup photo so it loads quickly over mobile data. */
export async function prepareMediaImage(file: File): Promise<Blob> {
  return resizeMax(file, 1600, 0.85, "photo")
}

/** Turns "IMG_20260412_Lobby_View.jpg" into "Lobby View". */
export function nameFromFile(name: string): string {
  const stem = name
    .replace(/\.[^.]+$/, "")
    .replace(/^(IMG|PANO|DSC|GS|R\d+|360)[_-]?\d*[_-]?/i, "")
    .replace(/[_-]+/g, " ")
    .trim()
  return (stem || "Scene").slice(0, 60)
}

/**
 * Generates a self-contained 2:1 equirectangular 360° SVG data URL with a spherical grid,
 * compass directions (N, E, S, W), sky/floor gradient, and architectural accents.
 */
export function createEquirectangularDemoUrl(opts: {
  title?: string
  skyTop?: string
  skyHorizon?: string
  floorBottom?: string
  accent?: string
} = {}): string {
  const {
    title = "Grand Lobby",
    skyTop = "#0f172a",
    skyHorizon = "#1e3a5f",
    floorBottom = "#090d16",
    accent = "#38bdf8",
  } = opts

  const meridians = Array.from({ length: 12 }, (_, i) => {
    const x = (i * 1200) / 12
    return `<line x1="${x}" y1="0" x2="${x}" y2="600" stroke="${accent}" stroke-opacity="0.18" stroke-width="1.5"/>`
  }).join("")

  const parallels = [100, 200, 300, 400, 500]
    .map(
      (y) =>
        `<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="${accent}" stroke-opacity="${y === 300 ? "0.45" : "0.16"}" stroke-width="${y === 300 ? "2.5" : "1.5"}"/>`,
    )
    .join("")

  const compass = [
    { x: 600, label: "N", sub: title },
    { x: 900, label: "E", sub: "East Wing" },
    { x: 1160, label: "S", sub: "South Entrance" },
    { x: 300, label: "W", sub: "West Terrace" },
  ]
    .map(
      (c) => `
      <g transform="translate(${c.x}, 270)">
        <rect x="-85" y="-44" width="170" height="72" rx="14" fill="#090d16" fill-opacity="0.68" stroke="${accent}" stroke-opacity="0.45" stroke-width="1.5"/>
        <text x="0" y="-12" text-anchor="middle" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="22" font-weight="700">${c.label}</text>
        <text x="0" y="14" text-anchor="middle" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13" font-weight="500">${c.sub}</text>
      </g>`,
    )
    .join("")

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${skyTop}"/>
        <stop offset="49%" stop-color="${skyHorizon}"/>
        <stop offset="51%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="${floorBottom}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="600" fill="url(#bg)"/>
    <circle cx="440" cy="145" r="46" fill="${accent}" fill-opacity="0.22"/>
    <circle cx="440" cy="145" r="24" fill="#f8fafc" fill-opacity="0.75"/>
    ${meridians}
    ${parallels}
    ${compass}
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

async function resizeMax(file: File, maxSide: number, quality: number, kind: string): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
    throw new Error(`Choose a JPG, PNG, or WebP ${kind}.`)
  }
  const bmp = await decode(file)
  try {
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
    const w = Math.max(1, Math.round(bmp.width * scale))
    const h = Math.max(1, Math.round(bmp.height * scale))
    return await renderToJpeg(bmp, w, h, quality)
  } finally {
    bmp.close()
  }
}

async function decode(file: Blob): Promise<ImageBitmap> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file)
    } catch {
      /* fall through to HTMLImageElement */
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error("Could not read this image."))
      el.src = url
    })
    const c = document.createElement("canvas")
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    c.getContext("2d")!.drawImage(img, 0, 0)
    return await createImageBitmap(c)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function renderToJpeg(bmp: ImageBitmap, w: number, h: number, quality: number): Promise<Blob> {
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  const ctx = c.getContext("2d")!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(bmp, 0, 0, w, h)
  return new Promise((resolve, reject) => {
    c.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode JPEG."))), "image/jpeg", quality)
  })
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error("Could not read preview."))
    r.readAsDataURL(blob)
  })
}

export interface SignatureCropRect {
  /** X coordinate ratio (0 to 1). */
  x: number
  /** Y coordinate ratio (0 to 1). */
  y: number
  /** Width ratio (0 to 1). */
  width: number
  /** Height ratio (0 to 1). */
  height: number
}

export interface ProcessSignatureOptions {
  /** Whether to make light/paper background transparent. Defaults to true. */
  removeBackground?: boolean
  /** Threshold luminance above which pixels become transparent (0 to 255). Defaults to 210. */
  threshold?: number
  /** Smoothing gradient range between ink and transparent background. Defaults to 35. */
  smoothness?: number
  /** Optional ink color override (e.g. "#0f172a", "#1d4ed8"). If null/undefined, preserves original ink color. */
  inkColor?: string | null
  /** Boost contrast of ink pixels for faint ballpoint or pencil scans. Defaults to true. */
  boostContrast?: boolean
  /** Invert colors (useful for light signatures on dark backgrounds). Defaults to false. */
  invert?: boolean
  /** Normalized crop rectangle (0 to 1). Defaults to full image. */
  crop?: SignatureCropRect
  /** Rotation angle in degrees (0, 90, 180, 270). Defaults to 0. */
  rotation?: number
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim()
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    return [isNaN(r) ? 15 : r, isNaN(g) ? 23 : g, isNaN(b) ? 42 : b]
  }
  const num = parseInt(clean, 16)
  if (isNaN(num)) return [15, 23, 42]
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff]
}

/**
 * Automatically detects the bounding box of non-background signature ink
 * and returns a normalized crop rectangle with comfortable padding.
 */
export function autoDetectSignatureBounds(
  imageData: ImageData,
  threshold = 220,
  paddingRatio = 0.06,
): SignatureCropRect {
  const { width, height, data } = imageData
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  let hasInk = false

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const a = data[idx + 3]
      if (a < 20) continue

      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      const lum = 0.299 * r + 0.587 * g + 0.114 * b

      // If pixel is sufficiently darker than paper background
      if (lum < threshold) {
        hasInk = true
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  if (!hasInk || maxX <= minX || maxY <= minY) {
    return { x: 0, y: 0, width: 1, height: 1 }
  }

  const padX = Math.round(width * paddingRatio)
  const padY = Math.round(height * paddingRatio)

  const finalMinX = Math.max(0, minX - padX)
  const finalMinY = Math.max(0, minY - padY)
  const finalMaxX = Math.min(width, maxX + padX)
  const finalMaxY = Math.min(height, maxY + padY)

  return {
    x: finalMinX / width,
    y: finalMinY / height,
    width: Math.max(0.05, (finalMaxX - finalMinX) / width),
    height: Math.max(0.05, (finalMaxY - finalMinY) / height),
  }
}

/**
 * Applies background removal, anti-aliased edge smoothing, ink enhancement, and tinting
 * directly onto pixel data.
 */
export function processSignatureImageData(
  imageData: ImageData,
  options: ProcessSignatureOptions = {},
): ImageData {
  const {
    removeBackground = true,
    threshold = 210,
    smoothness = 35,
    inkColor,
    boostContrast = true,
    invert = false,
  } = options

  if (!removeBackground && !inkColor && !boostContrast && !invert) {
    return imageData
  }

  const data = imageData.data
  const len = data.length
  const tHigh = Math.min(255, Math.max(0, threshold))
  const tLow = Math.max(0, tHigh - Math.max(1, smoothness))
  const [tintR, tintG, tintB] = inkColor ? hexToRgb(inkColor) : [0, 0, 0]

  for (let i = 0; i < len; i += 4) {
    const origA = data[i + 3]
    if (origA === 0) continue

    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]

    if (invert) {
      r = 255 - r
      g = 255 - g
      b = 255 - b
    }

    const lum = 0.299 * r + 0.587 * g + 0.114 * b

    if (removeBackground) {
      if (lum >= tHigh) {
        // Pure background -> transparent
        data[i + 3] = 0
        continue
      }

      let alphaFactor = 1
      if (lum > tLow) {
        // Smooth anti-aliased transition
        alphaFactor = (tHigh - lum) / (tHigh - tLow)
      }

      data[i + 3] = Math.round(origA * alphaFactor)
    }

    if (inkColor) {
      data[i] = tintR
      data[i + 1] = tintG
      data[i + 2] = tintB
    } else if (boostContrast) {
      // Darken and enhance ink contrast
      const factor = 1.35
      data[i] = Math.max(0, Math.min(255, Math.round((r - 128) * factor + 128)))
      data[i + 1] = Math.max(0, Math.min(255, Math.round((g - 128) * factor + 128)))
      data[i + 2] = Math.max(0, Math.min(255, Math.round((b - 128) * factor + 128)))
    } else if (invert) {
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
    }
  }

  return imageData
}

/**
 * Loads an image src/dataUrl, applies rotation, cropping, and background removal,
 * and returns the processed image as a high-quality PNG Data URL.
 */
export async function processSignatureImage(
  imageSrc: string,
  options: ProcessSignatureOptions = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (
      typeof window === "undefined" ||
      typeof document === "undefined" ||
      !HTMLCanvasElement.prototype.getContext ||
      !document.createElement("canvas").getContext("2d")
    ) {
      resolve(imageSrc)
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        const crop = options.crop ?? { x: 0, y: 0, width: 1, height: 1 }
        const rotation = (options.rotation ?? 0) % 360

        // Source dimensions
        const srcW = img.naturalWidth || img.width
        const srcH = img.naturalHeight || img.height

        const cropX = Math.max(0, Math.min(srcW, Math.round(crop.x * srcW)))
        const cropY = Math.max(0, Math.min(srcH, Math.round(crop.y * srcH)))
        const cropW = Math.max(1, Math.min(srcW - cropX, Math.round(crop.width * srcW)))
        const cropH = Math.max(1, Math.min(srcH - cropY, Math.round(crop.height * srcH)))

        // Canvas setup
        const canvas = document.createElement("canvas")
        const isRotated90 = rotation === 90 || rotation === 270

        canvas.width = isRotated90 ? cropH : cropW
        canvas.height = isRotated90 ? cropW : cropH

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(imageSrc)
          return
        }

        ctx.save()

        // Handle rotation around center
        if (rotation !== 0) {
          ctx.translate(canvas.width / 2, canvas.height / 2)
          ctx.rotate((rotation * Math.PI) / 180)
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropW,
            cropH,
            -cropW / 2,
            -cropH / 2,
            cropW,
            cropH,
          )
        } else {
          ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)
        }
        ctx.restore()

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        processSignatureImageData(imgData, options)
        ctx.putImageData(imgData, 0, 0)

        const result = canvas.toDataURL("image/png")
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }

    img.onerror = () => {
      reject(new Error("Failed to load signature image for processing"))
    }

    img.src = imageSrc
  })
}

/**
 * Generates an authentic sample scanned paper signature as a same-origin PNG Data URL.
 * Ideal for demos, automated testing, and onboarding previews.
 */
export function createSampleSignature(preset: "parchment" | "notebook" | "digital" = "parchment"): string {
  if (typeof document === "undefined" || !document.createElement) {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }

  const canvas = document.createElement("canvas")
  canvas.width = 460
  canvas.height = 200
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }

  if (preset === "digital") {
    // 100% Transparent digital signature with smooth calligraphic pen stroke
    ctx.clearRect(0, 0, 460, 200)
    ctx.strokeStyle = "#1d4ed8"
    ctx.lineWidth = 3.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(50, 125)
    ctx.bezierCurveTo(95, 35, 125, 65, 160, 135)
    ctx.bezierCurveTo(185, 75, 215, 80, 260, 115)
    ctx.bezierCurveTo(295, 45, 335, 35, 395, 120)
    ctx.stroke()

    // Smooth underline
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(70, 150)
    ctx.quadraticCurveTo(230, 165, 390, 135)
    ctx.stroke()
  } else if (preset === "parchment") {
    // Warm vintage paper with subtle gradient
    const grad = ctx.createLinearGradient(0, 0, 460, 200)
    grad.addColorStop(0, "#f8f3e8")
    grad.addColorStop(0.5, "#f3ecdc")
    grad.addColorStop(1, "#ede3cb")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 460, 200)

    // Calligraphic signature in dark charcoal ink
    ctx.strokeStyle = "#1e293b"
    ctx.lineWidth = 3.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(40, 130)
    ctx.bezierCurveTo(90, 30, 130, 70, 170, 120)
    ctx.bezierCurveTo(190, 80, 230, 60, 270, 110)
    ctx.bezierCurveTo(290, 40, 340, 30, 380, 95)
    ctx.stroke()

    // Flourish underline
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(70, 145)
    ctx.quadraticCurveTo(240, 165, 410, 125)
    ctx.stroke()
  } else {
    // Ruled notebook sheet with blue ballpoint pen
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, 460, 200)

    // Ruled line
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, 145)
    ctx.lineTo(460, 145)
    ctx.stroke()

    // Blue ballpoint ink
    ctx.strokeStyle = "#1d4ed8"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(50, 125)
    ctx.bezierCurveTo(95, 35, 125, 65, 160, 135)
    ctx.bezierCurveTo(185, 75, 215, 80, 260, 115)
    ctx.bezierCurveTo(295, 45, 335, 35, 395, 120)
    ctx.stroke()
  }

  try {
    return canvas.toDataURL("image/png")
  } catch {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }
}

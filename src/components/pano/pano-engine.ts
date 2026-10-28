import type { PanoView } from "./types"

export type View = PanoView

const DEG = Math.PI / 180
const RAD = 180 / Math.PI
const MIN_FOV = 30
const MAX_FOV = 100
const MAX_PITCH = 85

/** Inertial glide after a flick: short enough to feel crisp, long enough to feel smooth. */
const GLIDE = 330

const VERT2 = `#version 300 es
out vec2 vNdc;
void main() {
    vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
    vNdc = p * 2.0 - 1.0;
    gl_Position = vec4(vNdc, 0.0, 1.0);
}`

const FRAG2 = `#version 300 es
precision highp float;
in vec2 vNdc;
out vec4 outColor;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uMix;
uniform mat3 uRot;
uniform vec2 uTan;
const float PI = 3.141592653589793;
void main() {
    vec3 d = normalize(uRot * vec3(vNdc * uTan, -1.0));
    float u = atan(d.x, -d.z) / (2.0 * PI) + 0.5;
    float v = 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI;
    vec2 uv = vec2(u, v);
    vec2 dx = dFdx(uv);
    vec2 dy = dFdy(uv);
    dx.x -= round(dx.x);
    dy.x -= round(dy.x);
    vec4 a = textureGrad(uTexA, uv, dx, dy);
    outColor = uMix > 0.0 ? mix(a, textureGrad(uTexB, uv, dx, dy), uMix) : a;
}`

const VERT1 = `
attribute vec2 aPos;
varying vec2 vNdc;
void main() {
    vNdc = aPos;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG1 = `
precision highp float;
varying vec2 vNdc;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uMix;
uniform mat3 uRot;
uniform vec2 uTan;
const float PI = 3.141592653589793;
void main() {
    vec3 d = normalize(uRot * vec3(vNdc * uTan, -1.0));
    vec2 uv = vec2(atan(d.x, -d.z) / (2.0 * PI) + 0.5, 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI);
    vec4 a = texture2D(uTexA, uv);
    gl_FragColor = uMix > 0.0 ? mix(a, texture2D(uTexB, uv), uMix) : a;
}`

interface Uniforms {
  texA: WebGLUniformLocation | null
  texB: WebGLUniformLocation | null
  mix: WebGLUniformLocation | null
  rot: WebGLUniformLocation | null
  tan: WebGLUniformLocation | null
}

interface Tween {
  t0: number
  dur: number
  from: PanoView
  to: PanoView
  done?: () => void
}

const wrap = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
const shortest = (from: number, to: number) => from + wrap(to - from)
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

const imageCache = new Map<string, Promise<HTMLImageElement>>()

function loadImage(url: string): Promise<HTMLImageElement> {
  const hit = imageCache.get(url)
  if (hit) return hit
  const p = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.decoding = "async"
    img.onload = () => resolve(img)
    img.onerror = () => {
      imageCache.delete(url)
      reject(new Error(`Could not load ${url}`))
    }
    img.src = url
  }).then(async (img) => {
    try {
      await img.decode()
    } catch {
      /* decode() may reject on some browsers after onload; the bitmap is still usable */
    }
    return img
  })
  imageCache.set(url, p)
  if (imageCache.size > 24) {
    const firstKey = imageCache.keys().next().value
    if (firstKey !== undefined) imageCache.delete(firstKey)
  }
  return p
}

function fitForGpu(img: HTMLImageElement, max: number): TexImageSource {
  if (img.width <= max) return img
  const w = max
  const h = Math.max(1, Math.round((img.height * max) / img.width))
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  c.getContext("2d")!.drawImage(img, 0, 0, w, h)
  return c
}

/**
 * Demand-driven WebGL2 / WebGL1 360° equirectangular panorama engine.
 * Only renders frames when camera orientation, cross-fade, inertia, or size changes.
 */
export class PanoEngine {
  readonly canvas: HTMLCanvasElement
  private box: HTMLElement
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null
  private webgl2 = false
  private prog: WebGLProgram | null = null
  private u: Uniforms = { texA: null, texB: null, mix: null, rot: null, tan: null }
  private vbo: WebGLBuffer | null = null
  private texA: WebGLTexture | null = null
  private texB: WebGLTexture | null = null
  private hasA = false
  private hasB = false
  private aniso: EXT_texture_filter_anisotropic | null = null
  private maxAniso = 1
  private maxTexture = 4096

  private yaw = 0
  private pitch = 0
  private fov = 75
  private vy = 0
  private vp = 0
  private glideEnd = 0
  private autoSpeed = 0
  private autoResumeAt = 0
  private fadeStart = 0
  private fadeDur = 0
  private tween: Tween | null = null
  private keys = new Set<string>()
  private gyroClean: (() => void) | null = null
  private loadSeq = 0

  private raf = 0
  private lastT = 0
  private destroyed = false
  private ro: ResizeObserver | null = null
  private unbindInput: (() => void) | null = null
  private onUpdate?: (v: PanoView) => void

  constructor(box: HTMLElement, opts: { interactive?: boolean; onUpdate?: (v: PanoView) => void } = {}) {
    this.box = box
    this.onUpdate = opts.onUpdate
    this.canvas = document.createElement("canvas")
    this.canvas.className = "block size-full select-none"
    this.canvas.style.touchAction = opts.interactive === false ? "auto" : "none"
    box.prepend(this.canvas)

    const ctxOpts: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    }
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null
    try {
      gl =
        (this.canvas.getContext("webgl2", ctxOpts) as WebGL2RenderingContext | null) ??
        (this.canvas.getContext("webgl", ctxOpts) as WebGLRenderingContext | null)
    } catch {
      gl = null
    }

    if (gl) {
      this.gl = gl
      this.webgl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext
      this.maxTexture = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096, 8192)
      this.aniso =
        gl.getExtension("EXT_texture_filter_anisotropic") ||
        gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
      if (this.aniso) {
        this.maxAniso = Math.min(8, gl.getParameter(this.aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1)
      }
      this.setupPipeline()
    }

    if (typeof ResizeObserver !== "undefined") {
      this.ro = new ResizeObserver(() => {
        this.resize()
        this.wake()
      })
      this.ro.observe(box)
    }
    this.resize()

    if (opts.interactive !== false) {
      this.unbindInput = this.bindInput()
    }
  }

  private setupPipeline() {
    const gl = this.gl!
    const vs = compile(gl, gl.VERTEX_SHADER, this.webgl2 ? VERT2 : VERT1)
    const fs = compile(gl, gl.FRAGMENT_SHADER, this.webgl2 ? FRAG2 : FRAG1)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    gl.useProgram(prog)
    this.prog = prog

    if (!this.webgl2) {
      this.vbo = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, "aPos")
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    } else {
      const vao = (gl as WebGL2RenderingContext).createVertexArray()
      ;(gl as WebGL2RenderingContext).bindVertexArray(vao)
    }

    this.u = {
      texA: gl.getUniformLocation(prog, "uTexA"),
      texB: gl.getUniformLocation(prog, "uTexB"),
      mix: gl.getUniformLocation(prog, "uMix"),
      rot: gl.getUniformLocation(prog, "uRot"),
      tan: gl.getUniformLocation(prog, "uTan"),
    }
    gl.uniform1i(this.u.texA, 0)
    gl.uniform1i(this.u.texB, 1)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)
  }

  /** Shows a panorama: the small preview at once, then the full photo when it arrives. */
  async show(
    image: string,
    preview?: string | null,
    opts: { fadeMs?: number; onFirst?: () => void } = {},
  ): Promise<void> {
    const seq = ++this.loadSeq
    const fade = opts.fadeMs ?? 260
    let shown = false
    const markShown = () => {
      if (!shown) {
        shown = true
        opts.onFirst?.()
      }
    }

    if (!this.gl) {
      markShown()
      this.onUpdate?.(this.getView())
      return
    }

    const fullPromise = loadImage(image)

    if (preview && preview !== image) {
      try {
        const pImg = await loadImage(preview)
        if (seq !== this.loadSeq || this.destroyed) return
        this.swapIn(pImg, this.hasA ? fade : 0, false)
        markShown()
      } catch {
        /* preview is optional; wait for the full image */
      }
    }

    try {
      const img = await fullPromise
      if (seq !== this.loadSeq || this.destroyed) return
      this.swapIn(img, shown ? 180 : this.hasA ? fade : 0, true)
      markShown()
    } catch {
      markShown()
    }
  }

  private swapIn(img: HTMLImageElement, fadeMs: number, mipmaps: boolean) {
    const gl = this.gl
    if (!gl) return
    const tex = this.uploadTexture(img, mipmaps)

    if (!this.hasA || fadeMs <= 0) {
      if (this.texA) gl.deleteTexture(this.texA)
      if (this.texB) gl.deleteTexture(this.texB)
      this.texA = tex
      this.texB = null
      this.hasA = true
      this.hasB = false
      this.fadeDur = 0
      this.wake()
      return
    }

    if (this.texB) {
      if (this.texA) gl.deleteTexture(this.texA)
      this.texA = this.texB
    }
    this.texB = tex
    this.hasB = true
    this.fadeStart = performance.now()
    this.fadeDur = fadeMs
    this.wake()
  }

  private uploadTexture(img: HTMLImageElement, mipmaps: boolean): WebGLTexture {
    const gl = this.gl!
    const src = fitForGpu(img, this.maxTexture)
    const tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    if (this.webgl2 && mipmaps) {
      gl.generateMipmap(gl.TEXTURE_2D)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      if (this.aniso && this.maxAniso > 1) {
        gl.texParameterf(gl.TEXTURE_2D, this.aniso.TEXTURE_MAX_ANISOTROPY_EXT, this.maxAniso)
      }
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
    return tex
  }

  getView(): PanoView {
    return { yaw: this.yaw, pitch: this.pitch, fov: this.fov }
  }

  setView(v: Partial<PanoView>, animateMs = 0, done?: () => void) {
    const to: PanoView = {
      yaw: v.yaw !== undefined ? wrap(v.yaw) : this.yaw,
      pitch: clamp(v.pitch ?? this.pitch, -MAX_PITCH, MAX_PITCH),
      fov: clamp(v.fov ?? this.fov, MIN_FOV, MAX_FOV),
    }
    this.vy = 0
    this.vp = 0
    if (animateMs > 0) {
      this.tween = {
        t0: performance.now(),
        dur: animateMs,
        from: this.getView(),
        to: { ...to, yaw: shortest(this.yaw, to.yaw) },
        done,
      }
    } else {
      this.tween = null
      this.yaw = to.yaw
      this.pitch = to.pitch
      this.fov = to.fov
      this.onUpdate?.(this.getView())
      done?.()
    }
    this.wake()
  }

  zoomBy(factor: number) {
    this.pauseAuto()
    this.setView({ fov: this.fov * factor }, 180)
  }

  setAutoRotate(degPerSec: number) {
    this.autoSpeed = degPerSec
    this.wake()
  }

  pauseAuto(ms = 4000) {
    this.autoResumeAt = performance.now() + ms
  }

  /** Where a (yaw, pitch) point lands in the box, in CSS pixels; null if behind the viewer. */
  project(yaw: number, pitch: number): { x: number; y: number } | null {
    const w = this.box.clientWidth || this.box.getBoundingClientRect().width || 800
    const h = this.box.clientHeight || this.box.getBoundingClientRect().height || 450
    if (w <= 0 || h <= 0) return null

    const p = pitch * DEG
    const y = yaw * DEG
    const cp = Math.cos(p)
    const wx = cp * Math.sin(y)
    const wy = Math.sin(p)
    const wz = -cp * Math.cos(y)

    const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = this.rotMatrix()
    const x1 = m0 * wx + m1 * wy + m2 * wz
    const y2 = m3 * wx + m4 * wy + m5 * wz
    const z2 = m6 * wx + m7 * wy + m8 * wz
    if (z2 >= -0.05) return null

    const tanY = Math.tan(this.fov * 0.5 * DEG)
    const tanX = tanY * (w / h)
    const nx = x1 / -z2 / tanX
    const ny = y2 / -z2 / tanY
    if (Math.abs(nx) > 1.25 || Math.abs(ny) > 1.25) return null
    return { x: (nx * 0.5 + 0.5) * w, y: (0.5 - ny * 0.5) * h }
  }

  /** Turns a pointer position in the box into the (yaw, pitch) it points at. */
  unproject(clientX: number, clientY: number): { yaw: number; pitch: number } {
    const r = this.box.getBoundingClientRect()
    const w = r.width || this.box.clientWidth || 800
    const h = r.height || this.box.clientHeight || 450
    if (w <= 0 || h <= 0) return { yaw: this.yaw, pitch: this.pitch }
    const nx = ((clientX - r.left) / w) * 2 - 1
    const ny = 1 - ((clientY - r.top) / h) * 2
    const tanY = Math.tan(this.fov * 0.5 * DEG)
    const tanX = tanY * (w / h)

    let x = nx * tanX
    let y = ny * tanY
    let z = -1
    const len = Math.hypot(x, y, z)
    x /= len
    y /= len
    z /= len

    const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = this.rotMatrix()
    const wx = m0 * x + m3 * y + m6 * z
    const wy = m1 * x + m4 * y + m7 * z
    const wz = m2 * x + m5 * y + m8 * z
    return {
      yaw: Math.round(Math.atan2(wx, -wz) * RAD * 10) / 10,
      pitch: Math.round(clamp(Math.asin(clamp(wy, -1, 1)) * RAD, -MAX_PITCH, MAX_PITCH) * 10) / 10,
    }
  }

  /** Turns phone/tablet gyroscope steering on or off. Returns whether the device supports it. */
  async setGyroscope(on: boolean): Promise<boolean> {
    this.gyroClean?.()
    this.gyroClean = null
    if (!on || typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return false

    const DOE = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">
    }
    if (typeof DOE.requestPermission === "function") {
      try {
        if ((await DOE.requestPermission()) !== "granted") return false
      } catch {
        return false
      }
    }

    let baseYaw: number | null = null
    const startYaw = this.yaw
    const handler = (e: DeviceOrientationEvent) => {
      if (e.alpha === null || e.beta === null || e.gamma === null) return
      const orient = (screen.orientation?.angle ?? 0) * DEG
      const a = e.alpha * DEG
      const b = e.beta * DEG
      const g = e.gamma * DEG

      const cX = Math.cos(b / 2)
      const cY = Math.cos(g / 2)
      const cZ = Math.cos(a / 2)
      const sX = Math.sin(b / 2)
      const sY = Math.sin(g / 2)
      const sZ = Math.sin(a / 2)
      const qw = cX * cY * cZ - sX * sY * sZ
      const qx = sX * cY * cZ - cX * sY * sZ
      const qy = cX * sY * cZ + sX * cY * sZ
      const qz = cX * cY * sZ + sX * sY * cZ

      const rHalf = -Math.SQRT1_2
      const aw = qw * rHalf - qx * rHalf
      const ax = qw * rHalf + qx * rHalf
      const ay = qy * rHalf + qz * rHalf
      const az = qz * rHalf - qy * rHalf

      const sHalf = Math.sin(-orient / 2)
      const cHalf = Math.cos(-orient / 2)
      const fw = aw * cHalf - az * sHalf
      const fx = ax * cHalf + ay * sHalf
      const fy = ay * cHalf - ax * sHalf
      const fz = az * cHalf + aw * sHalf

      const vx = 2 * (fx * fz + fw * fy)
      const vy = 2 * (fy * fz - fw * fx)
      const vz = 1 - 2 * (fx * fx + fy * fy)
      const rawYaw = -Math.atan2(vx, -vz) * RAD
      const pitch = clamp(Math.asin(clamp(-vy, -1, 1)) * RAD, -MAX_PITCH, MAX_PITCH)

      if (baseYaw === null) baseYaw = rawYaw
      this.yaw = wrap(startYaw + (rawYaw - baseYaw))
      this.pitch = pitch
      this.pauseAuto()
      this.wake()
    }

    window.addEventListener("deviceorientation", handler, true)
    this.gyroClean = () => window.removeEventListener("deviceorientation", handler, true)
    return true
  }

  private resize() {
    const r = this.box.getBoundingClientRect()
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2)
    const w = Math.max(1, Math.round((r.width || 800) * dpr))
    const h = Math.max(1, Math.round((r.height || 450) * dpr))
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
      this.gl?.viewport(0, 0, w, h)
    }
  }

  private wake() {
    if (this.destroyed || this.raf) return
    this.lastT = performance.now()
    if (!this.gl) {
      this.onUpdate?.(this.getView())
      return
    }
    this.raf = requestAnimationFrame(this.frame)
  }

  private frame = (now: number) => {
    this.raf = 0
    if (this.destroyed) return
    const dt = Math.min(0.064, (now - this.lastT) / 1000)
    this.lastT = now
    let more = false

    if (this.tween) {
      const k = Math.min(1, (now - this.tween.t0) / this.tween.dur)
      const e = ease(k)
      this.yaw = wrap(this.tween.from.yaw + (this.tween.to.yaw - this.tween.from.yaw) * e)
      this.pitch = this.tween.from.pitch + (this.tween.to.pitch - this.tween.from.pitch) * e
      this.fov = this.tween.from.fov + (this.tween.to.fov - this.tween.from.fov) * e
      if (k >= 1) {
        const done = this.tween.done
        this.tween = null
        done?.()
      } else {
        more = true
      }
    } else if (now < this.glideEnd) {
      const k = (this.glideEnd - now) / GLIDE
      const w = k * k
      this.yaw = wrap(this.yaw + this.vy * w * dt)
      this.pitch = clamp(this.pitch + this.vp * w * dt, -MAX_PITCH, MAX_PITCH)
      more = true
    } else {
      this.vy = 0
      this.vp = 0
      if (this.keys.size) {
        const step = 55 * (this.fov / 75) * dt
        if (this.keys.has("ArrowLeft")) this.yaw = wrap(this.yaw - step)
        if (this.keys.has("ArrowRight")) this.yaw = wrap(this.yaw + step)
        if (this.keys.has("ArrowUp")) this.pitch = clamp(this.pitch + step * 0.8, -MAX_PITCH, MAX_PITCH)
        if (this.keys.has("ArrowDown")) this.pitch = clamp(this.pitch - step * 0.8, -MAX_PITCH, MAX_PITCH)
        more = true
      } else if (this.autoSpeed && now >= this.autoResumeAt) {
        this.yaw = wrap(this.yaw + this.autoSpeed * dt)
        more = true
      }
    }

    let mix = 0
    if (this.hasB && this.fadeDur > 0) {
      mix = Math.min(1, (now - this.fadeStart) / this.fadeDur)
      if (mix >= 1) {
        if (this.texA) this.gl?.deleteTexture(this.texA)
        this.texA = this.texB
        this.texB = null
        this.hasB = false
        this.fadeDur = 0
        mix = 0
      } else {
        more = true
      }
    }

    this.draw(mix)
    this.onUpdate?.(this.getView())
    if (more) this.raf = requestAnimationFrame(this.frame)
  }

  private rotMatrix(): [number, number, number, number, number, number, number, number, number] {
    const cy = Math.cos(this.yaw * DEG)
    const sy = Math.sin(this.yaw * DEG)
    const cx = Math.cos(this.pitch * DEG)
    const sx = Math.sin(this.pitch * DEG)
    return [cy, 0, sy, -sy * sx, cx, cy * sx, -sy * cx, -sx, cy * cx]
  }

  private draw(mix: number) {
    const gl = this.gl
    if (!gl || !this.hasA || !this.texA) return

    const aspect = this.canvas.width / Math.max(1, this.canvas.height)
    const tanY = Math.tan(this.fov * 0.5 * DEG)
    gl.uniform2f(this.u.tan, tanY * aspect, tanY)
    gl.uniformMatrix3fv(this.u.rot, false, this.rotMatrix())
    gl.uniform1f(this.u.mix, mix)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texA)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.texB ?? this.texA)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  private bindInput(): () => void {
    const el = this.box
    const pointers = new Map<number, { x: number; y: number }>()
    let prevX = 0
    let prevY = 0
    let prevT = 0
    let pinchDist = 0
    let pinchFov = this.fov

    const degPerPx = () => this.fov / Math.max(240, el.clientHeight || 450)

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return
      if ((e.target as HTMLElement | null)?.closest("[data-pano-ui]")) return
      el.setPointerCapture?.(e.pointerId)
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      this.tween = null
      this.vy = 0
      this.vp = 0
      this.glideEnd = 0
      this.pauseAuto()

      if (pointers.size === 1) {
        prevX = e.clientX
        prevY = e.clientY
        prevT = performance.now()
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y)
        pinchFov = this.fov
      }
    }

    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      this.pauseAuto()

      if (pointers.size === 1) {
        const now = performance.now()
        const dt = Math.max(0.004, (now - prevT) / 1000)
        const k = degPerPx()
        const dyaw = -(e.clientX - prevX) * k
        const dpitch = (e.clientY - prevY) * k
        this.yaw = wrap(this.yaw + dyaw)
        this.pitch = clamp(this.pitch + dpitch, -MAX_PITCH, MAX_PITCH)
        this.vy = this.vy * 0.35 + (dyaw / dt) * 0.65
        this.vp = this.vp * 0.35 + (dpitch / dt) * 0.65
        prevX = e.clientX
        prevY = e.clientY
        prevT = now
        this.wake()
      } else if (pointers.size === 2 && pinchDist > 10) {
        const [a, b] = [...pointers.values()]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        this.fov = clamp(pinchFov * (pinchDist / Math.max(10, dist)), MIN_FOV, MAX_FOV)
        this.wake()
      }
    }

    const onUp = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return
      pointers.delete(e.pointerId)
      if (pointers.size === 1) {
        const [p] = [...pointers.values()]
        prevX = p.x
        prevY = p.y
        prevT = performance.now()
        this.vy = 0
        this.vp = 0
      } else if (pointers.size === 0) {
        const stale = performance.now() - prevT > 90
        if (!stale && Math.hypot(this.vy, this.vp) > 12) {
          this.vy = clamp(this.vy, -360, 360)
          this.vp = clamp(this.vp, -240, 240)
          this.glideEnd = performance.now() + GLIDE
          this.wake()
        } else {
          this.vy = 0
          this.vp = 0
        }
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      this.tween = null
      this.pauseAuto()
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      this.fov = clamp(this.fov + delta * 0.04, MIN_FOV, MAX_FOV)
      this.wake()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault()
        this.tween = null
        this.pauseAuto()
        this.keys.add(e.key)
        this.wake()
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault()
        this.zoomBy(1 / 1.2)
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault()
        this.zoomBy(1.2)
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.key)
    }

    const onBlur = () => this.keys.clear()

    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerup", onUp)
    el.addEventListener("pointercancel", onUp)
    el.addEventListener("wheel", onWheel, { passive: false })
    el.addEventListener("keydown", onKeyDown)
    el.addEventListener("keyup", onKeyUp)
    el.addEventListener("blur", onBlur)
    return () => {
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerup", onUp)
      el.removeEventListener("pointercancel", onUp)
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("keydown", onKeyDown)
      el.removeEventListener("keyup", onKeyUp)
      el.removeEventListener("blur", onBlur)
    }
  }

  destroy() {
    this.destroyed = true
    if (this.raf) cancelAnimationFrame(this.raf)
    this.ro?.disconnect()
    this.unbindInput?.()
    this.gyroClean?.()
    if (this.gl) {
      if (this.texA) this.gl.deleteTexture(this.texA)
      if (this.texB) this.gl.deleteTexture(this.texB)
      if (this.vbo) this.gl.deleteBuffer(this.vbo)
      if (this.prog) this.gl.deleteProgram(this.prog)
    }
    this.canvas.remove()
  }
}

/** Warms up image URLs in the background so scene transitions are instant. */
export function prefetchPanorama(urls: (string | null | undefined)[]) {
  for (const u of urls) {
    if (u) loadImage(u).catch(() => {})
  }
}

export const prefetch = prefetchPanorama

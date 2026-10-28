"use client"

import { cn } from "@/lib/cn"
import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
} from "react"
import { ConfirmDialog } from "../confirm-dialog"
import { Modal } from "../modal"
import { getHotspotIcon, PANO_HOTSPOT_ICONS, PanoIcons } from "./hotspot-icons"
import { nameFromFile, prepareMediaImage, preparePanorama, type PreparedPanorama } from "./pano-image"
import { canSpeak, speakText } from "./pano-speech"
import { PanoTourDialog } from "./pano-tour-dialog"
import { PanoViewer, type PanoHandle } from "./pano-viewer"
import type {
  PanoActionDefinition,
  PanoHotspot,
  PanoHotspotAction,
  PanoHotspotLabelDisplay,
  PanoHotspotTone,
  PanoHotspotType,
  PanoPlaceItem,
  PanoScene,
  PanoUploadingItem,
  PanoView,
} from "./types"

export type PanoEditorMode = "look" | PanoHotspotType

export const PANO_HOTSPOT_KINDS: Record<PanoHotspotType, { label: string; hint: string }> = {
  scene: { label: "Walk", hint: "Click on the photo where guests step to another scene." },
  info: { label: "Note", hint: "Click on the photo to pin a short note." },
  media: { label: "Media", hint: "Click on the photo to attach a close-up photo or video." },
  link: { label: "Link", hint: "Click on the photo to add a link to a page or website." },
  action: { label: "Button", hint: "Click on the photo to place a call-to-action button." },
}

export const DEFAULT_PANO_ACTIONS: Record<string, PanoActionDefinition> = {
  book: { label: "Book now", hint: "Opens booking with this place chosen." },
  call: { label: "Call us", hint: "Starts a phone call." },
  directions: { label: "Get directions", hint: "Opens maps directions." },
  message: { label: "Message us", hint: "Opens your messaging channel." },
}

const inputCls =
  "h-9 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 disabled:opacity-50"

const btnBase =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-md)] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0"

function btnCls(variant: "primary" | "secondary" | "danger" = "primary", size: "sm" | "md" = "md", extra?: string) {
  return cn(
    btnBase,
    size === "sm" ? "h-8 px-3 text-xs" : "h-9 px-3.5 text-sm",
    variant === "primary" && "bg-accent-600 text-white hover:bg-accent-700",
    variant === "secondary" && "border border-border bg-surface text-foreground hover:bg-foreground/6",
    variant === "danger" && "border border-danger/30 bg-danger/10 text-danger-strong hover:bg-danger/15",
    extra,
  )
}

function plural(n: number, word: string, many = `${word}s`) {
  return `${n} ${n === 1 ? word : many}`
}

function newSpotId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10)
}

/** What a hotspot still needs before guests will see it, or null if it's ready. */
export function getHotspotMissingRequirement(h: PanoHotspot): string | null {
  if (h.type === "scene" && h.target === undefined) return "Choose which scene it goes to"
  if (h.type === "info" && !h.label?.trim()) return "Write the note"
  if (h.type === "link" && !h.url?.trim()) return "Paste the link address"
  if (h.type === "media") {
    if (h.media?.kind === "video" && !h.media.url?.trim()) return "Paste the video link"
    if (h.media?.kind !== "video" && !h.media?.src?.trim()) return "Upload the photo"
  }
  return null
}

export interface PanoTourEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Tour title (or current place name). */
  title?: string
  /** Controlled scenes list. */
  scenes?: PanoScene[]
  /** Uncontrolled initial scenes list. */
  defaultScenes?: PanoScene[]
  /** Called whenever scenes, views, or hotspots change. */
  onScenesChange?: (scenes: PanoScene[]) => void
  /** Optional places list to display a searchable multi-place sidebar catalog. */
  places?: PanoPlaceItem[]
  /** Currently selected place id when `places` is provided. */
  selectedPlaceId?: string
  /** Called when the user selects a place in the sidebar. */
  onSelectPlace?: (placeId: string) => void
  /** Optional callback to copy the current tour to other places. */
  onCopyTour?: (targetPlaceIds: string[], mode: "replace" | "append") => Promise<void> | void
  /** Custom async uploader when 360° photos are added. Falls back to client-side blob URLs when omitted. */
  onUploadScene?: (
    file: File,
    prepared: PreparedPanorama | null,
    onProgress: (fraction: number) => void,
  ) => Promise<PanoScene>
  /** Custom async uploader when a media hotspot photo is chosen. Falls back to a data/blob URL when omitted. */
  onUploadMedia?: (file: File, preparedBlob: Blob, onProgress: (fraction: number) => void) => Promise<string>
  /** Whether to strictly enforce 2:1 equirectangular validation on uploaded files. Defaults to `false` in client-only mode and `true` when `strictEquirectangular` is set. */
  strictEquirectangular?: boolean
  /** Custom action definitions for `action` hotspots. */
  actions?: Record<string, PanoActionDefinition>
  /** Currently featured scene id (e.g. for hero backdrop). */
  featuredSceneId?: string | number | null
  /** Called when the user toggles the featured scene checkbox. */
  onFeaturedSceneChange?: (sceneId: string | number | null) => void
  /** Whether the current place is enabled / eligible to be featured. */
  canFeature?: boolean
  /** Saving indicator for external autosave. */
  saving?: boolean
  /** Save error message for external autosave. */
  saveError?: string | null
  /** Retry callback when `saveError` is set. */
  onRetrySave?: () => void
  /** Shows a JSON export/import button in the studio header so developers/admins can copy or load tour JSON. Defaults to `true`. */
  allowJsonExport?: boolean
  /** Whether the places sidebar starts open on wide screens. Defaults to `true`. */
  defaultSidebarOpen?: boolean
}

export const PanoTourEditor = forwardRef<HTMLDivElement, PanoTourEditorProps>(
  (
    {
      title = "360° Tour",
      scenes: controlledScenes,
      defaultScenes = [],
      onScenesChange,
      places,
      selectedPlaceId,
      onSelectPlace,
      onCopyTour,
      onUploadScene,
      onUploadMedia,
      strictEquirectangular = false,
      actions = DEFAULT_PANO_ACTIONS,
      featuredSceneId,
      onFeaturedSceneChange,
      canFeature = true,
      saving = false,
      saveError = null,
      onRetrySave,
      allowJsonExport = true,
      defaultSidebarOpen = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalScenes, setInternalScenes] = useState<PanoScene[]>(defaultScenes)
    const scenes = controlledScenes ?? internalScenes

    const updateScenes = (updater: PanoScene[] | ((prev: PanoScene[]) => PanoScene[])) => {
      const next = typeof updater === "function" ? updater(scenes) : updater
      if (controlledScenes === undefined) setInternalScenes(next)
      onScenesChange?.(next)
    }

    const [selectedId, setSelectedId] = useState<string | number | null>(() => scenes[0]?.id ?? null)
    const [spot, setSpot] = useState<string | null>(null)
    const [mode, setMode] = useState<PanoEditorMode>("look")
    const [arrivalFor, setArrivalFor] = useState<{ spotId: string; targetId: string | number } | null>(null)
    const [liveView, setLiveView] = useState<PanoView | null>(null)
    const [uploads, setUploads] = useState<PanoUploadingItem[]>([])
    const [dragOver, setDragOver] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [copyOpen, setCopyOpen] = useState(false)
    const [jsonOpen, setJsonOpen] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen)
    const [mobilePlacesOpen, setMobilePlacesOpen] = useState(false)
    const [deletingScene, setDeletingScene] = useState<PanoScene | null>(null)
    const [confirmClearTour, setConfirmClearTour] = useState(false)
    const [notice, setNotice] = useState<{ kind: "ok" | "bad"; text: string } | null>(null)

    const fileInput = useRef<HTMLInputElement>(null)
    const pano = useRef<PanoHandle>(null)

    useEffect(() => {
      if (scenes.length > 0 && !scenes.some((s) => s.id === selectedId)) {
        setSelectedId(scenes[0].id)
      } else if (scenes.length === 0) {
        setSelectedId(null)
      }
    }, [scenes, selectedId])

    const scene = useMemo(() => scenes.find((s) => s.id === selectedId) ?? scenes[0] ?? null, [scenes, selectedId])
    const arrivalScene = useMemo(
      () => (arrivalFor ? (scenes.find((s) => s.id === arrivalFor.targetId) ?? null) : null),
      [scenes, arrivalFor],
    )
    const arrivalSpot = useMemo(
      () => (arrivalFor && scene ? (scene.hotspots.find((h) => h.id === arrivalFor.spotId) ?? null) : null),
      [scene, arrivalFor],
    )
    const names = useMemo(() => Object.fromEntries(scenes.map((s) => [s.id, s.name])), [scenes])
    const others = useMemo(() => (scene ? scenes.filter((s) => s.id !== scene.id) : []), [scenes, scene])

    const flash = (kind: "ok" | "bad", text: string) => {
      setNotice({ kind, text })
    }

    useEffect(() => {
      if (!notice || notice.kind !== "ok") return
      const t = window.setTimeout(() => setNotice(null), 4000)
      return () => window.clearTimeout(t)
    }, [notice])

    useEffect(() => {
      setLiveView(null)
      setArrivalFor(null)
    }, [scene?.id])

    const patchScene = (id: string | number, change: Partial<PanoScene>) => {
      updateScenes((prev) => prev.map((s) => (s.id === id ? { ...s, ...change } : s)))
    }

    const patchHotspot = (spotId: string, change: Partial<PanoHotspot>) => {
      if (!scene) return
      patchScene(scene.id, {
        hotspots: scene.hotspots.map((h) => (h.id === spotId ? { ...h, ...change } : h)),
      })
    }

    const removeHotspot = (spotId: string) => {
      if (!scene) return
      patchScene(scene.id, {
        hotspots: scene.hotspots.filter((h) => h.id !== spotId),
      })
      if (spot === spotId) setSpot(null)
    }

    // Keyboard shortcuts: Escape cancels placement/arrival mode; Delete/Backspace deletes selected hotspot
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        const tag = (e.target as HTMLElement | null)?.tagName
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement | null)?.isContentEditable) {
          return
        }
        if (e.key === "Escape") {
          if (arrivalFor) setArrivalFor(null)
          else if (mode !== "look") setMode("look")
          else if (spot) setSpot(null)
        } else if ((e.key === "Delete" || e.key === "Backspace") && spot && scene && !arrivalFor) {
          e.preventDefault()
          removeHotspot(spot)
        }
      }
      window.addEventListener("keydown", onKey)
      return () => window.removeEventListener("keydown", onKey)
    }, [mode, spot, scene, arrivalFor])

    const setUpload = (key: string, patch: Partial<PanoUploadingItem>) =>
      setUploads((u) => u.map((x) => (x.key === key ? { ...x, ...patch } : x)))

    const handleFiles = async (files: FileList | File[]) => {
      const list = Array.from(files)
      if (!list.length) return
      setNotice(null)

      const items: PanoUploadingItem[] = list.map((f, i) => ({
        key: `${Date.now()}-${i}-${f.name}`,
        name: nameFromFile(f.name),
        stage: "waiting",
        progress: 0,
      }))
      setUploads((u) => [...u, ...items])

      let firstNewId: string | number | null = null
      const addedScenes: PanoScene[] = []

      for (let i = 0; i < list.length; i++) {
        const file = list[i]
        const item = items[i]
        setUpload(item.key, { stage: "preparing" })
        try {
          let prepared: PreparedPanorama | null = null
          try {
            prepared = await preparePanorama(file)
          } catch (prepErr) {
            if (strictEquirectangular) throw prepErr
          }
          if (prepared) {
            setUpload(item.key, { thumb: prepared.thumb, stage: "uploading", progress: 0.25 })
          } else {
            setUpload(item.key, { stage: "uploading", progress: 0.25 })
          }

          let created: PanoScene
          if (onUploadScene) {
            created = await onUploadScene(file, prepared, (p) => setUpload(item.key, { progress: p }))
          } else {
            const url = prepared ? URL.createObjectURL(prepared.image) : URL.createObjectURL(file)
            const previewUrl = prepared ? prepared.thumb : url
            created = {
              id: `scene-${Date.now()}-${i}`,
              name: item.name,
              description: "",
              image: url,
              preview: previewUrl,
              yaw: 0,
              pitch: 0,
              fov: 75,
              hotspots: [],
            }
          }
          addedScenes.push(created)
          if (firstNewId === null) firstNewId = created.id
          setUploads((u) => u.filter((x) => x.key !== item.key))
        } catch (err) {
          setUpload(item.key, {
            error: err instanceof Error ? err.message : `Could not add “${file.name}”.`,
          })
        }
      }

      if (addedScenes.length > 0) {
        updateScenes((prev) => [...prev, ...addedScenes])
        if (firstNewId !== null) {
          setSelectedId(firstNewId)
          setSpot(null)
        }
      }
    }

    const onFileDrop = (e: DragEvent) => {
      if (!e.dataTransfer.types.includes("Files")) return
      e.preventDefault()
      setDragOver(false)
      void handleFiles(e.dataTransfer.files)
    }

    const setInitialView = () => {
      if (!scene || !pano.current) return
      const v = pano.current.view()
      const next = {
        yaw: Math.round(v.yaw * 10) / 10,
        pitch: Math.round(v.pitch * 10) / 10,
        fov: Math.round(v.fov),
      }
      patchScene(scene.id, next)
      setLiveView(next)
      flash("ok", `Guests will face this way when they enter “${scene.name}”.`)
    }

    const saveArrivalView = () => {
      if (!arrivalFor || !pano.current) return
      const v = pano.current.view()
      patchHotspot(arrivalFor.spotId, {
        arrival: {
          yaw: Math.round(v.yaw * 10) / 10,
          pitch: Math.round(v.pitch * 10) / 10,
          fov: Math.round(v.fov),
        },
      })
      setArrivalFor(null)
      flash("ok", "Arrival view set.")
    }

    const placeHotspot = (yaw: number, pitch: number) => {
      if (!scene || mode === "look") return
      const id = newSpotId()
      const base: PanoHotspot = { id, type: mode, yaw, pitch }
      if (mode === "scene") {
        const target = others[0]
        if (!target) {
          flash("bad", "Add a second scene first so there’s somewhere to walk to.")
          setMode("look")
          return
        }
        base.target = target.id
      } else if (mode === "info") {
        base.label = ""
      } else if (mode === "media") {
        base.media = { kind: "image" }
      } else if (mode === "link") {
        base.url = ""
        base.label = ""
      } else if (mode === "action") {
        const firstAction = Object.keys(actions)[0] ?? "book"
        base.action = firstAction
        base.label = actions[firstAction]?.label ?? "Action"
      }
      patchScene(scene.id, { hotspots: [...scene.hotspots, base] })
      setSpot(id)
      setMode("look")
      setTimeout(() => document.getElementById(`pano-spot-${id}`)?.focus(), 0)
    }

    const moveHotspot = (spotId: string, yaw: number, pitch: number) => {
      patchHotspot(spotId, { yaw, pitch })
    }

    const reorder = (ids: (string | number)[]) => {
      const byId = new Map(scenes.map((s) => [s.id, s]))
      const next = ids.map((id) => byId.get(id)).filter((s): s is PanoScene => Boolean(s))
      updateScenes(next)
    }

    const moveScene = (from: number, to: number) => {
      if (to < 0 || to >= scenes.length) return
      const ids = scenes.map((s) => s.id)
      const [item] = ids.splice(from, 1)
      ids.splice(to, 0, item)
      reorder(ids)
    }

    const confirmRemoveScene = (target: PanoScene) => {
      const remain = scenes
        .filter((x) => x.id !== target.id)
        .map((x) => ({
          ...x,
          hotspots: x.hotspots.filter((h) => !(h.type === "scene" && h.target === target.id)),
        }))
      updateScenes(remain)
      if (selectedId === target.id) {
        setSelectedId(remain[0]?.id ?? null)
        setSpot(null)
      }
      if (featuredSceneId === target.id) {
        onFeaturedSceneChange?.(null)
      }
      setDeletingScene(null)
    }

    const clearTour = () => {
      updateScenes([])
      setSelectedId(null)
      setSpot(null)
      onFeaturedSceneChange?.(null)
      setConfirmClearTour(false)
      flash("ok", `Deleted the tour of ${title}.`)
    }

    const viewMoved =
      scene &&
      liveView &&
      (Math.abs(liveView.yaw - scene.yaw) > 2 ||
        Math.abs(liveView.pitch - scene.pitch) > 2 ||
        Math.abs(liveView.fov - scene.fov) > 2)

    const currentPlace = places?.find((p) => p.id === selectedPlaceId)

    const editorContent = (
      <div
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault()
            setDragOver(true)
          }
        }}
        onDragLeave={(e) => {
          if (e.currentTarget === e.target) setDragOver(false)
        }}
        onDrop={onFileDrop}
        className="relative min-w-0 space-y-4"
      >
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files)
            e.target.value = ""
          }}
        />

        {dragOver && (
          <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center rounded-xl border-2 border-dashed border-accent-500 bg-surface/90 backdrop-blur-xs">
            <div className="text-center">
              <PanoIcons.Upload className="mx-auto size-8 text-accent-strong" />
              <p className="mt-2 font-semibold text-foreground">Drop 360° photos to add scenes</p>
            </div>
          </div>
        )}

        {/* Compact horizontal place selector when sidebar is collapsed or on < @3xl containers */}
        {places && places.length > 0 && (
          <div className={cn("flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border bg-surface p-2 [scrollbar-width:none]", sidebarOpen && "@3xl:hidden")}>
            <span className="px-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Place:
            </span>
            {places.map((p) => {
              const active = p.id === (selectedPlaceId ?? places[0]?.id)
              const count = p.scenesCount ?? 0
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectPlace?.(p.id)}
                  className={cn(
                    "inline-flex h-7 flex-none cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-accent-600 text-white shadow-xs"
                      : "bg-foreground/5 text-foreground hover:bg-foreground/10",
                  )}
                >
                  <span>{p.name}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] tabular-nums",
                      active ? "bg-white/20 text-white" : "bg-foreground/8 text-muted-foreground",
                    )}
                  >
                    {count || "0"}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {places && places.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setSidebarOpen((s) => !s)}
                  title={sidebarOpen ? "Hide places sidebar" : "Show places sidebar"}
                  aria-label={sidebarOpen ? "Hide places sidebar" : "Show places sidebar"}
                  className={cn(btnCls("secondary", "sm", "hidden px-2 @3xl:inline-flex"))}
                >
                  <PanoIcons.PanelLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobilePlacesOpen(true)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/6 @3xl:hidden"
                  aria-label="Choose place"
                >
                  <PanoIcons.Building className="size-3.5 text-muted-foreground" />
                  <span className="max-w-32 truncate sm:max-w-44">{currentPlace?.name ?? "Places"}</span>
                  <PanoIcons.ChevronDown className="size-3 text-muted-foreground" />
                </button>
              </>
            )}
            <div>
              <h2 className="text-lg font-semibold text-foreground">{currentPlace?.name ?? title}</h2>
              <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <span>{scenes.length ? plural(scenes.length, "scene") : "No scenes yet"}</span>
                {scene && <span>· {plural(scene.hotspots.length, "hotspot")} in active scene</span>}
                {currentPlace && currentPlace.enabled === false && (
                  <span>· Off on the site (switch it on to show the tour)</span>
                )}
                <PanoSaveState saving={saving} error={saveError} onRetry={onRetrySave} />
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => fileInput.current?.click()} className={btnCls("secondary", "sm")}>
              <PanoIcons.ImagePlus /> Add 360° photos
            </button>
            {scenes.length > 0 && (
              <>
                {places && places.length > 1 && onCopyTour && (
                  <button type="button" onClick={() => setCopyOpen(true)} className={btnCls("secondary", "sm")}>
                    <PanoIcons.Copy /> Copy to…
                  </button>
                )}
                {allowJsonExport && (
                  <button
                    type="button"
                    onClick={() => setJsonOpen(true)}
                    title="Export or import tour JSON configuration"
                    className={btnCls("secondary", "sm")}
                  >
                    <PanoIcons.Code /> JSON
                  </button>
                )}
                <button type="button" onClick={() => setPreviewOpen(true)} className={btnCls("primary", "sm")}>
                  <PanoIcons.Eye /> Preview tour
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearTour(true)}
                  className={btnCls("secondary", "sm", "text-danger-strong")}
                >
                  <PanoIcons.Trash2 /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {notice && (
          <div
            role={notice.kind === "bad" ? "alert" : "status"}
            className={cn(
              "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-medium",
              notice.kind === "bad"
                ? "border-danger/30 bg-danger/10 text-danger-strong"
                : "border-success/30 bg-success/10 text-success-strong",
            )}
          >
            <span>{notice.text}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss notice"
              className="rounded p-0.5 hover:bg-foreground/10"
            >
              <PanoIcons.X className="size-3.5" />
            </button>
          </div>
        )}

        {scenes.length === 0 && uploads.length === 0 ? (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface px-6 py-16 text-center transition-colors hover:border-accent-500 hover:bg-foreground/4"
          >
            <span className="grid size-12 place-items-center rounded-full bg-foreground/6 text-foreground">
              <PanoIcons.Upload className="size-5" />
            </span>
            <span className="text-base font-semibold text-foreground">
              Drop 360° photos here, or click to choose
            </span>
            <span className="max-w-md text-xs text-muted-foreground">
              Equirectangular JPG, PNG, or WebP (twice as wide as tall, like 4096×2048) from any 360° camera or phone panorama app. You can pick several at once.
            </span>
          </button>
        ) : (
          <div className="space-y-4">
            {/* Viewport */}
            {scene && (
              <div className="overflow-hidden rounded-xl border border-border bg-surface">
                {arrivalScene && arrivalSpot ? (
                  <PanoViewer
                    handle={pano}
                    scene={{ ...arrivalScene, hotspots: [] }}
                    arrival={arrivalSpot.arrival ?? null}
                    names={names}
                    className="aspect-[16/10] w-full sm:aspect-[16/9]"
                  >
                    <div className="absolute inset-x-3 top-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/75 px-3 py-2 text-xs text-white backdrop-blur-sm">
                      <span>
                        Turn <b>{arrivalScene.name}</b> to the way guests should face when they walk in.
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setArrivalFor(null)}
                          className="cursor-pointer rounded-full bg-white/15 px-3 py-1 font-medium hover:bg-white/25"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveArrivalView}
                          className="cursor-pointer rounded-full bg-white px-3 py-1 font-semibold text-black hover:bg-white/90"
                        >
                          Face this way on arrival
                        </button>
                      </div>
                    </div>
                  </PanoViewer>
                ) : (
                  <PanoViewer
                    handle={pano}
                    scene={scene}
                    names={names}
                    onView={setLiveView}
                    editor={{
                      picking: mode === "look" ? null : mode,
                      selected: spot,
                      onPick: placeHotspot,
                      onMove: moveHotspot,
                      onSelect: (id) => setSpot(id),
                    }}
                    className="aspect-[16/10] w-full sm:aspect-[16/9]"
                  >
                    <div className="pointer-events-none absolute inset-x-2.5 top-2.5 z-10 flex flex-wrap items-start justify-between gap-1.5 sm:inset-x-3 sm:top-3">
                      <div className="pointer-events-auto max-w-full">
                        <PanoToolbar mode={mode} setMode={setMode} canLink={others.length > 0} />
                      </div>

                      <div className="pointer-events-auto ml-auto flex gap-1.5">
                        {viewMoved && (
                          <button
                            type="button"
                            onClick={() =>
                              pano.current?.lookAt({ yaw: scene.yaw, pitch: scene.pitch, fov: scene.fov })
                            }
                            title="Turn back to this scene’s current start view"
                            className="h-8 cursor-pointer rounded-full bg-black/60 px-2.5 sm:px-3 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/80"
                          >
                            <span className="hidden sm:inline">Back to start</span>
                            <span className="sm:hidden">Reset</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={setInitialView}
                          title="Save the direction you’re looking as the starting view of this scene"
                          className="inline-flex h-8 cursor-pointer items-center gap-1 sm:gap-1.5 rounded-full bg-black/60 px-2.5 sm:px-3 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/80"
                        >
                          <PanoIcons.Eye className="size-3.5" />
                          <span>Start here</span>
                        </button>
                      </div>
                    </div>

                    {mode !== "look" && (
                      <div className="absolute inset-x-2.5 bottom-2.5 z-10 flex justify-center sm:inset-x-3 sm:bottom-3">
                        <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-black/85 px-3 py-1.5 text-center text-xs text-white shadow-lg backdrop-blur-sm sm:rounded-full sm:px-3.5">
                          <span className="hidden sm:inline">{PANO_HOTSPOT_KINDS[mode].hint}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const v = pano.current?.view() ?? { yaw: scene.yaw, pitch: scene.pitch }
                              placeHotspot(Math.round(v.yaw * 10) / 10, Math.round(v.pitch * 10) / 10)
                            }}
                            className="cursor-pointer rounded-full bg-accent-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-accent-500"
                          >
                            + Place at center
                          </button>
                          <button
                            type="button"
                            onClick={() => setMode("look")}
                            className="cursor-pointer rounded-full bg-white/15 px-2 py-1 text-xs text-white/85 hover:bg-white/25"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {mode === "look" && spot && (() => {
                      const activeSpot = scene.hotspots.find((h) => h.id === spot)
                      if (!activeSpot) return null
                      return (
                        <div className="absolute inset-x-3 bottom-3 flex justify-center">
                          <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm">
                            <span className="px-1 font-semibold">
                              Selected: {activeSpot.label || PANO_HOTSPOT_KINDS[activeSpot.type].label}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                pano.current?.lookAt({ yaw: activeSpot.yaw, pitch: activeSpot.pitch }, 280)
                              }
                              className="cursor-pointer rounded-full bg-white/15 px-2.5 py-0.5 font-medium hover:bg-white/25"
                            >
                              Center on pin
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const v = pano.current?.view()
                                if (v) {
                                  moveHotspot(
                                    activeSpot.id,
                                    Math.round(v.yaw * 10) / 10,
                                    Math.round(v.pitch * 10) / 10,
                                  )
                                  flash("ok", "Moved hotspot to current camera center.")
                                }
                              }}
                              className="cursor-pointer rounded-full bg-white/15 px-2.5 py-0.5 font-medium hover:bg-white/25"
                            >
                              Move pin here
                            </button>
                            <button
                              type="button"
                              onClick={() => removeHotspot(activeSpot.id)}
                              className="cursor-pointer rounded-full bg-danger/80 px-2.5 py-0.5 font-medium text-white hover:bg-danger"
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setSpot(null)}
                              className="cursor-pointer rounded-full bg-white text-black px-2.5 py-0.5 font-semibold hover:bg-white/90"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )
                    })()}
                  </PanoViewer>
                )}
              </div>
            )}

            {/* Filmstrip */}
            <PanoSceneStrip
              scenes={scenes}
              selected={scene?.id ?? null}
              uploads={uploads}
              onChoose={(id) => {
                setSelectedId(id)
                setSpot(null)
              }}
              onReorder={reorder}
              onAdd={() => fileInput.current?.click()}
              onDismiss={(key) => setUploads((u) => u.filter((x) => x.key !== key))}
            />

            {/* Scene & hotspot inspector */}
            {scene && (
              <PanoScenePanel
                scene={scene}
                index={scenes.findIndex((s) => s.id === scene.id)}
                count={scenes.length}
                others={others}
                spot={spot}
                actions={actions}
                onSpot={(id) => {
                  setSpot(id)
                  const h = scene.hotspots.find((x) => x.id === id)
                  if (h) pano.current?.lookAt({ yaw: h.yaw, pitch: h.pitch })
                }}
                onRename={(name) => patchScene(scene.id, { name })}
                onDescribe={(description) => patchScene(scene.id, { description })}
                onMove={(to) => moveScene(scenes.findIndex((s) => s.id === scene.id), to)}
                onDelete={() => setDeletingScene(scene)}
                onPatchSpot={patchHotspot}
                onRemoveSpot={removeHotspot}
                onArrival={(spotId, targetId) => setArrivalFor({ spotId, targetId })}
                onUploadMedia={onUploadMedia}
                featured={featuredSceneId !== undefined ? featuredSceneId === scene.id : Boolean(scene.featured)}
                canFeature={canFeature}
                onFeature={(on) => {
                  if (onFeaturedSceneChange) {
                    onFeaturedSceneChange(on ? scene.id : null)
                  } else {
                    updateScenes((prev) =>
                      prev.map((s) => ({ ...s, featured: on ? s.id === scene.id : false })),
                    )
                  }
                  flash("ok", on ? `“${scene.name}” set as featured 360° scene.` : "Featured scene turned off.")
                }}
              />
            )}
          </div>
        )}

        {previewOpen && (
          <PanoTourDialog
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            title={currentPlace?.name ?? title}
            scenes={scenes}
            startScene={scene?.id}
          />
        )}

        {copyOpen && places && currentPlace && onCopyTour && (
          <PanoCopyDialog
            from={currentPlace}
            places={places}
            count={scenes.length}
            onClose={() => setCopyOpen(false)}
            onSubmit={async (to, copyMode) => {
              await onCopyTour(to, copyMode)
              setCopyOpen(false)
              flash("ok", `Copied ${plural(scenes.length, "scene")} to ${plural(to.length, "place")}.`)
            }}
          />
        )}

        {mobilePlacesOpen && places && (
          <Modal
            open
            onClose={() => setMobilePlacesOpen(false)}
            title="Choose a place"
            description="Select a place to edit its 360° virtual tour."
          >
            <PanoPlaceList
              places={places}
              selected={selectedPlaceId ?? places[0]?.id ?? ""}
              onSelect={(id) => {
                onSelectPlace?.(id)
                setMobilePlacesOpen(false)
              }}
            />
          </Modal>
        )}

        {deletingScene &&
          (() => {
            const links = scenes.filter((x) => x.hotspots.some((h) => h.target === deletingScene.id)).length
            return (
              <ConfirmDialog
                open={Boolean(deletingScene)}
                onClose={() => setDeletingScene(null)}
                title={`Delete “${deletingScene.name}”?`}
                description={
                  links
                    ? `Links to it from ${plural(links, "other scene")} will be removed too.`
                    : "This cannot be undone."
                }
                confirmLabel="Delete scene"
                destructive
                onConfirm={() => confirmRemoveScene(deletingScene)}
              />
            )
          })()}

        {jsonOpen && (
          <PanoJsonDialog
            scenes={scenes}
            onClose={() => setJsonOpen(false)}
            onImport={(imported) => {
              updateScenes(imported)
              setJsonOpen(false)
              flash("ok", `Loaded ${plural(imported.length, "scene")} from JSON.`)
            }}
          />
        )}

        <ConfirmDialog
          open={confirmClearTour}
          onClose={() => setConfirmClearTour(false)}
          title={`Delete the whole tour of ${currentPlace?.name ?? title}?`}
          description={`This will delete all ${plural(scenes.length, "scene")}.`}
          confirmLabel="Delete tour"
          destructive
          onConfirm={clearTour}
        />
      </div>
    )

    if (!places) {
      return (
        <div ref={ref} className={cn("@container w-full", className)} {...props}>
          {editorContent}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "@container grid min-w-0 grid-cols-1 items-start gap-5",
          sidebarOpen && "@3xl:grid-cols-[15.5rem_minmax(0,1fr)]",
          className,
        )}
        {...props}
      >
        {sidebarOpen && (
          <div className="hidden @3xl:block">
            <PanoPlaceList
              places={places}
              selected={selectedPlaceId ?? places[0]?.id ?? ""}
              onSelect={(id) => onSelectPlace?.(id)}
            />
          </div>
        )}
        {editorContent}
      </div>
    )
  },
)

PanoTourEditor.displayName = "PanoTourEditor"
export const TourEditor = PanoTourEditor

/* ---------------- Subcomponents ---------------- */

function PanoSaveState({
  saving,
  error,
  onRetry,
}: {
  saving: boolean
  error: string | null
  onRetry?: () => void
}) {
  if (error) {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-danger-strong">
        · <PanoIcons.AlertTriangle className="size-3.5" /> {error}{" "}
        {onRetry && (
          <button type="button" onClick={onRetry} className="cursor-pointer underline">
            Retry
          </button>
        )}
      </span>
    )
  }
  if (saving) {
    return (
      <span className="inline-flex items-center gap-1">
        · <PanoIcons.Loader className="size-3.5 animate-spin" /> Saving
      </span>
    )
  }
  return null
}

export function PanoToolbar({
  mode,
  setMode,
  canLink,
}: {
  mode: PanoEditorMode
  setMode: (m: PanoEditorMode) => void
  canLink: boolean
}) {
  const icons: Record<PanoEditorMode, React.ReactNode> = {
    look: <PanoIcons.Hand className="size-4" />,
    scene: <PanoIcons.Footprints className="size-4" />,
    info: <PanoIcons.Info className="size-4" />,
    media: <PanoIcons.Image className="size-4" />,
    link: <PanoIcons.Link2 className="size-4" />,
    action: <PanoIcons.MousePointerClick className="size-4" />,
  }
  return (
    <div
      className="flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-black/60 p-0.5 backdrop-blur-sm [scrollbar-width:none]"
      role="toolbar"
      aria-label="Add hotspots"
    >
      {(["look", ...Object.keys(PANO_HOTSPOT_KINDS)] as PanoEditorMode[]).map((m) => {
        const disabled = m === "scene" && !canLink
        const label = m === "look" ? "Look" : PANO_HOTSPOT_KINDS[m].label
        return (
          <button
            key={m}
            type="button"
            onClick={() => setMode(mode === m && m !== "look" ? "look" : m)}
            disabled={disabled}
            title={
              disabled
                ? "Add another scene first"
                : m === "look"
                  ? "Look around and move hotspots"
                  : PANO_HOTSPOT_KINDS[m].hint
            }
            aria-pressed={mode === m}
            aria-label={label}
            className={cn(
              "flex h-8 flex-none cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              mode === m ? "bg-white text-black" : "text-white hover:bg-white/15",
            )}
          >
            {icons[m]}
            <span className="hidden md:inline">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function PanoSceneStrip({
  scenes,
  selected,
  uploads,
  onChoose,
  onReorder,
  onAdd,
  onDismiss,
}: {
  scenes: PanoScene[]
  selected: string | number | null
  uploads: PanoUploadingItem[]
  onChoose: (id: string | number) => void
  onReorder: (ids: (string | number)[]) => void
  onAdd: () => void
  onDismiss: (key: string) => void
}) {
  const [dragging, setDragging] = useState<string | number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const stripRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (!stripRef.current) return
    const activeBtn = stripRef.current.querySelector<HTMLButtonElement>('[aria-current="true"]')
    activeBtn?.scrollIntoView?.({ behavior: "smooth", inline: "nearest", block: "nearest" })
  }, [selected])

  const drop = (targetIndex: number) => {
    if (dragging === null) return
    const ids = scenes.map((s) => s.id).filter((id) => id !== dragging)
    const from = scenes.findIndex((s) => s.id === dragging)
    ids.splice(targetIndex > from ? targetIndex - 1 : targetIndex, 0, dragging)
    if (ids.join() !== scenes.map((s) => s.id).join()) onReorder(ids)
    setDragging(null)
    setOver(null)
  }

  const tile = "relative h-20 w-32 flex-none overflow-hidden rounded-lg sm:h-[5.5rem] sm:w-36"

  return (
    <div>
      <ol
        ref={stripRef}
        className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none]"
        aria-label="Scenes (drag to reorder; the first is where guests start)"
      >
        {scenes.map((s, i) => (
          <li
            key={s.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "move"
              e.dataTransfer.setData("text/x-scene", String(s.id))
              setDragging(s.id)
            }}
            onDragEnd={() => {
              setDragging(null)
              setOver(null)
            }}
            onDragOver={(e) => {
              if (dragging === null) return
              e.preventDefault()
              const r = e.currentTarget.getBoundingClientRect()
              setOver(e.clientX < r.left + r.width / 2 ? i : i + 1)
            }}
            onDrop={(e) => {
              if (dragging === null) return
              e.preventDefault()
              e.stopPropagation()
              drop(over ?? i)
            }}
            className={cn("relative flex-none", dragging === s.id && "opacity-40")}
          >
            {over === i && dragging !== null && (
              <span className=" absolute top-0 -left-1.5 z-10 h-full w-1 rounded-full bg-accent-600" />
            )}
            {over === i + 1 && i === scenes.length - 1 && dragging !== null && (
              <span className="absolute top-0 -right-1.5 z-10 h-full w-1 rounded-full bg-accent-600" />
            )}
            <button
              type="button"
              onClick={() => onChoose(s.id)}
              aria-current={s.id === selected ? "true" : undefined}
              className={cn(
                tile,
                "group block cursor-pointer ring-2 ring-offset-2 ring-offset-bg",
                s.id === selected ? "ring-accent-600" : "ring-transparent hover:ring-border",
              )}
            >
              <img
                src={s.preview ?? s.image}
                alt=""
                className="size-full object-cover"
                loading="lazy"
                draggable={false}
              />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-2 pt-4 pb-1 text-left text-xs font-medium text-white">
                {s.name}
              </span>
              {i === 0 && (
                <span className="absolute top-1 left-1 rounded bg-white/95 px-1.5 py-0.5 text-[0.65rem] font-semibold text-black">
                  Start
                </span>
              )}
              {s.hotspots.length > 0 && (
                <span className="absolute top-1 right-1 rounded bg-black/65 px-1.5 py-0.5 text-[0.65rem] font-medium text-white">
                  {s.hotspots.length}
                </span>
              )}
            </button>
          </li>
        ))}

        {uploads.map((u) => (
          <li key={u.key} className={cn(tile, "border border-border bg-surface")}>
            {u.thumb && <img src={u.thumb} alt="" className="absolute inset-0 size-full object-cover opacity-60" />}
            <div className="relative flex h-full flex-col justify-end p-2 text-xs">
              {u.error ? (
                <>
                  <button
                    type="button"
                    onClick={() => onDismiss(u.key)}
                    className="absolute top-1 right-1 grid size-5 cursor-pointer place-items-center rounded-full bg-surface text-foreground"
                    aria-label="Dismiss"
                  >
                    <PanoIcons.X className="size-3" />
                  </button>
                  <p
                    className="line-clamp-3 rounded bg-surface/90 px-1 font-medium text-danger-strong"
                    title={u.error}
                  >
                    {u.error}
                  </p>
                </>
              ) : (
                <>
                  <p className="truncate rounded bg-surface/85 px-1 font-medium text-foreground">
                    {u.stage === "waiting"
                      ? "Waiting…"
                      : u.stage === "preparing"
                        ? "Preparing…"
                        : `Uploading ${Math.round(u.progress * 100)}%`}
                  </p>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface/70">
                    <div
                      className="h-full bg-accent-600 transition-[width]"
                      style={{
                        width: `${u.stage === "uploading" ? Math.max(4, u.progress * 100) : u.stage === "preparing" ? 8 : 0}%`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </li>
        ))}

        <li className="flex-none">
          <button
            type="button"
            onClick={onAdd}
            className={cn(
              tile,
              "grid cursor-pointer place-items-center border-2 border-dashed border-border text-muted-foreground transition-colors hover:bg-foreground/4 hover:text-foreground",
            )}
          >
            <span className="flex flex-col items-center gap-1 text-xs font-medium">
              <PanoIcons.ImagePlus className="size-5" /> Add photos
            </span>
          </button>
        </li>
      </ol>
      {scenes.length > 1 && (
        <p className="mt-1 text-xs text-muted-foreground">Drag to reorder. Guests start at the first scene.</p>
      )}
    </div>
  )
}

export function PanoScenePanel({
  scene,
  index,
  count,
  others,
  spot,
  actions,
  onSpot,
  onRename,
  onDescribe,
  onMove,
  onDelete,
  onPatchSpot,
  onRemoveSpot,
  onArrival,
  onUploadMedia,
  featured,
  canFeature,
  onFeature,
}: {
  scene: PanoScene
  index: number
  count: number
  others: PanoScene[]
  spot: string | null
  actions: Record<string, PanoActionDefinition>
  onSpot: (id: string) => void
  onRename: (name: string) => void
  onDescribe: (text: string) => void
  onMove: (to: number) => void
  onDelete: () => void
  onPatchSpot: (id: string, change: Partial<PanoHotspot>) => void
  onRemoveSpot: (id: string) => void
  onArrival: (spotId: string, targetId: string | number) => void
  onUploadMedia?: (file: File, preparedBlob: Blob, onProgress: (fraction: number) => void) => Promise<string>
  featured: boolean
  canFeature: boolean
  onFeature: (on: boolean) => void
}) {
  const selectedRow = useRef<HTMLLIElement>(null)
  useEffect(() => {
    selectedRow.current?.scrollIntoView?.({ block: "nearest" })
  }, [spot])

  const small = btnCls("secondary", "sm", "px-2.5")

  return (
    <aside className="grid min-w-0 grid-cols-1 content-start gap-x-6 gap-y-5 rounded-xl border border-border bg-surface p-4 md:grid-cols-2">
      <div className="min-w-0 space-y-2.5">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">Scene name</span>
          <input
            className={inputCls}
            value={scene.name}
            maxLength={60}
            onChange={(e) => onRename(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            className={small}
            disabled={index === 0}
            onClick={() => onMove(index - 1)}
            aria-label="Move earlier"
          >
            <PanoIcons.ArrowLeft />
          </button>
          <button
            type="button"
            className={small}
            disabled={index === count - 1}
            onClick={() => onMove(index + 1)}
            aria-label="Move later"
          >
            <PanoIcons.ArrowRight />
          </button>
          {index === 0 ? (
            <span className="inline-flex h-8 items-center gap-1 px-1 text-xs text-muted-foreground">
              <PanoIcons.Flag className="size-3.5" /> Guests start here
            </span>
          ) : (
            <button type="button" className={small} onClick={() => onMove(0)}>
              <PanoIcons.Flag /> Start here
            </button>
          )}
          <button
            type="button"
            className={cn(small, "ml-auto text-danger-strong")}
            onClick={onDelete}
            aria-label="Delete scene"
          >
            <PanoIcons.Trash2 />
          </button>
        </div>

        <label className={cn("flex cursor-pointer items-start gap-2 pt-1 text-sm", !canFeature && "opacity-60")}>
          <input
            type="checkbox"
            className="mt-0.5 accent-accent-600"
            checked={featured}
            disabled={!canFeature && !featured}
            onChange={(e) => onFeature(e.target.checked)}
          />
          <span>
            <span className="font-medium text-foreground">Show behind the hero section</span>
            <span className="block text-xs text-muted-foreground">
              {canFeature
                ? "Turns slowly behind the headline, with a button to look around. One scene at a time."
                : "Enable this place first."}
            </span>
          </span>
        </label>
      </div>

      <PanoNarrationField key={scene.id} text={scene.description ?? ""} onChange={onDescribe} />

      <div className="min-w-0 space-y-2 md:col-span-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-foreground">Hotspots</h3>
          <span className="text-xs text-muted-foreground">{scene.hotspots.length || ""}</span>
        </div>
        {!scene.hotspots.length && (
          <p className="text-sm text-muted-foreground">
            Pick a kind above the photo, then click where it goes: <b>Walk</b> to another scene, a <b>Note</b>, a photo or video (<b>Media</b>), a web <b>Link</b>, or a <b>Button</b> such as Book now.
          </p>
        )}
        <ul className="grid min-w-0 grid-cols-1 items-start gap-2 md:grid-cols-2">
          {scene.hotspots.map((h) => {
            const on = spot === h.id
            const target = others.find((s) => s.id === h.target)
            const Icon = getHotspotIcon(h)
            const todo = getHotspotMissingRequirement(h)
            const spotTitle =
              h.type === "scene"
                ? `To ${target?.name ?? "…"}`
                : h.type === "action"
                  ? h.label || actions[h.action ?? "book"]?.label || "Action"
                  : h.type === "media"
                    ? h.media?.caption || (h.media?.kind === "video" ? "Video" : "Photo")
                    : h.type === "link"
                      ? h.label || h.url || "New link"
                      : h.label || "New note"

            return (
              <li
                key={h.id}
                ref={on ? selectedRow : undefined}
                className={cn(
                  "min-w-0 rounded-lg border p-2.5 transition-colors",
                  on ? "border-accent-500 bg-accent-600/8 md:col-span-2" : "border-border",
                )}
                onFocus={() => !on && onSpot(h.id)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="grid size-7 flex-none place-items-center rounded-full bg-foreground/6 text-foreground"
                    title={PANO_HOTSPOT_KINDS[h.type].label}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">{spotTitle}</span>
                    {(todo || h.enabled === false) && (
                      <span
                        className={cn(
                          "block text-xs",
                          todo ? "text-warning-strong" : "text-muted-foreground",
                        )}
                      >
                        {h.enabled === false ? "Hidden from guests" : `Draft: ${todo?.toLowerCase()}`}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSpot(h.id)}
                    className="grid size-7 cursor-pointer place-items-center rounded text-muted-foreground hover:bg-foreground/6 hover:text-foreground"
                    aria-label="Show on the photo"
                    title="Show on the photo"
                  >
                    <PanoIcons.Crosshair className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveSpot(h.id)}
                    className="grid size-7 cursor-pointer place-items-center rounded text-muted-foreground hover:bg-danger/10 hover:text-danger-strong"
                    aria-label="Remove hotspot"
                    title="Remove (Delete key)"
                  >
                    <PanoIcons.X className="size-4" />
                  </button>
                </div>

                {on && (
                  <PanoHotspotEditor
                    h={h}
                    others={others}
                    actions={actions}
                    onUploadMedia={onUploadMedia}
                    onChange={(change) => onPatchSpot(h.id, change)}
                    onArrival={(to) => onArrival(h.id, to)}
                  />
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}

function PanoNarrationField({ text, onChange }: { text: string; onChange: (text: string) => void }) {
  const id = useId()
  const [playing, setPlaying] = useState(false)
  const stop = useRef<(() => void) | null>(null)
  useEffect(() => () => stop.current?.(), [])

  const listen = () => {
    if (playing) {
      stop.current?.()
      setPlaying(false)
      return
    }
    setPlaying(true)
    stop.current = speakText(text, { end: () => setPlaying(false) })
  }

  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          Description
        </label>
        {canSpeak() && text.trim() && (
          <button
            type="button"
            onClick={listen}
            className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-accent-strong"
          >
            {playing ? <PanoIcons.Square className="size-3.5" /> : <PanoIcons.Headphones className="size-3.5" />}
            {playing ? "Stop" : "Listen"}
          </button>
        )}
      </div>
      <textarea
        id={id}
        className={cn(inputCls, "h-28 py-2")}
        value={text}
        maxLength={1000}
        placeholder="e.g. Welcome to the suite. It features panoramic ocean views, a king bed, and a private terrace."
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="flex justify-between gap-2 text-xs text-muted-foreground">
        <span>Guests who turn on narration hear this in their browser’s voice, with captions.</span>
        {text.length > 800 && <span className="flex-none tabular-nums">{1000 - text.length}</span>}
      </p>
    </div>
  )
}

export function PanoHotspotEditor({
  h,
  others,
  actions,
  onUploadMedia,
  onChange,
  onArrival,
}: {
  h: PanoHotspot
  others: PanoScene[]
  actions: Record<string, PanoActionDefinition>
  onUploadMedia?: (file: File, preparedBlob: Blob, onProgress: (fraction: number) => void) => Promise<string>
  onChange: (change: Partial<PanoHotspot>) => void
  onArrival: (to: string | number) => void
}) {
  const [uploadNote, setUploadNote] = useState<string | null>(null)
  const target = others.find((s) => s.id === h.target)

  const label = (text: string, control: React.ReactNode, hint?: string) => (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-foreground">{text}</span>
      {control}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )

  const uploadPhoto = async (file: File | undefined) => {
    if (!file) return
    setUploadNote("Preparing…")
    try {
      let blob: Blob = file
      try {
        blob = await prepareMediaImage(file)
      } catch {
        blob = file
      }
      const src = onUploadMedia
        ? await onUploadMedia(file, blob, (p) => setUploadNote(`Uploading ${Math.round(p * 100)}%`))
        : URL.createObjectURL(blob)
      onChange({ media: { kind: "image", src, caption: h.media?.caption } })
      setUploadNote(null)
    } catch (e) {
      setUploadNote(e instanceof Error ? e.message : "Upload failed.")
    }
  }

  const video = h.media?.kind === "video" ? (h.media.url ?? "") : ""
  const videoOk =
    !video || /^https?:\/\/((www\.|m\.)?(youtube\.com|youtu\.be)|(www\.|player\.)?vimeo\.com)\//i.test(video)

  return (
    <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
      {h.type === "scene" && (
        <>
          {label(
            "Goes to",
            <select
              className={inputCls}
              value={h.target ?? ""}
              onChange={(e) => {
                const raw = e.target.value
                const match = others.find((s) => String(s.id) === raw)
                onChange({ target: match ? match.id : raw, arrival: undefined })
              }}
            >
              {h.target === undefined && <option value="">Choose a scene…</option>}
              {others.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>,
          )}
          {label(
            "Label",
            <input
              id={`pano-spot-${h.id}`}
              className={inputCls}
              value={h.label ?? ""}
              placeholder={target?.name ?? "Scene name"}
              maxLength={60}
              onChange={(e) => onChange({ label: e.target.value || undefined })}
            />,
          )}
          <div className="space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-foreground">When guests arrive</span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">
                {h.arrival ? "They face the way you set." : `They face ${target?.name ?? "the scene"}’s start view.`}
              </span>
              <button
                type="button"
                disabled={h.target === undefined}
                onClick={() => h.target !== undefined && onArrival(h.target)}
                className={btnCls("secondary", "sm")}
              >
                <PanoIcons.Eye /> {h.arrival ? "Change arrival view" : "Set arrival view"}
              </button>
              {h.arrival && (
                <button
                  type="button"
                  onClick={() => onChange({ arrival: undefined })}
                  className="cursor-pointer text-xs font-semibold text-accent-strong"
                >
                  Use start view
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {h.type === "info" && (
        <>
          {label(
            "Note title",
            <input
              id={`pano-spot-${h.id}`}
              className={inputCls}
              value={h.label ?? ""}
              maxLength={120}
              placeholder="e.g. Heated Infinity Pool"
              onChange={(e) => onChange({ label: e.target.value })}
            />,
          )}
          {label(
            "Details (optional)",
            <input
              className={inputCls}
              value={h.description ?? ""}
              maxLength={300}
              placeholder="e.g. Open 6 AM – 10 PM · 4ft to 5.5ft depth"
              onChange={(e) => onChange({ description: e.target.value || undefined })}
            />,
          )}
        </>
      )}

      {h.type === "media" && (
        <>
          <div className="space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-foreground">Shows</span>
            <div className="flex gap-4 text-sm">
              {(["image", "video"] as const).map((k) => (
                <label key={k} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    className="accent-accent-600"
                    checked={(h.media?.kind ?? "image") === k}
                    onChange={() => onChange({ media: { kind: k, caption: h.media?.caption } })}
                  />
                  {k === "image" ? "A photo" : "A video (YouTube or Vimeo)"}
                </label>
              ))}
            </div>
          </div>
          {h.media?.kind === "video" ? (
            label(
              "Video link",
              <input
                className={inputCls}
                value={video}
                placeholder="https://www.youtube.com/watch?v=…"
                aria-invalid={!videoOk}
                onChange={(e) =>
                  onChange({ media: { kind: "video", url: e.target.value.trim(), caption: h.media?.caption } })
                }
              />,
              videoOk ? "Paste the link from YouTube or Vimeo." : "This doesn’t look like a YouTube or Vimeo link.",
            )
          ) : (
            <div className="space-y-1">
              <span className="text-xs font-medium text-foreground">Photo</span>
              <div className="flex items-center gap-2">
                {h.media?.kind === "image" && h.media.src && (
                  <img src={h.media.src} alt="" className="h-12 w-16 rounded object-cover" />
                )}
                <label className={btnCls("secondary", "sm", "cursor-pointer")}>
                  <PanoIcons.Upload /> {h.media?.kind === "image" && h.media.src ? "Replace" : "Upload"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      void uploadPhoto(e.target.files?.[0])
                      e.target.value = ""
                    }}
                  />
                </label>
              </div>
              {uploadNote && <span className="block text-xs text-muted-foreground">{uploadNote}</span>}
            </div>
          )}
          {label(
            "Caption",
            <input
              className={inputCls}
              value={h.media?.caption ?? ""}
              maxLength={200}
              placeholder="Optional"
              onChange={(e) => h.media && onChange({ media: { ...h.media, caption: e.target.value || undefined } })}
            />,
          )}
        </>
      )}

      {h.type === "link" && (
        <>
          {label(
            "Address",
            <input
              id={`pano-spot-${h.id}`}
              className={inputCls}
              value={h.url ?? ""}
              maxLength={500}
              placeholder="https://… or /activities"
              onChange={(e) => onChange({ url: e.target.value.trim() || undefined })}
            />,
            "External sites open in a new tab; relative paths navigate in place.",
          )}
          {label(
            "Button text",
            <input
              className={inputCls}
              value={h.label ?? ""}
              maxLength={60}
              placeholder="Open link"
              onChange={(e) => onChange({ label: e.target.value || undefined })}
            />,
          )}
        </>
      )}

      {h.type === "action" && (
        <>
          {label(
            "Does",
            <select
              className={inputCls}
              value={h.action ?? Object.keys(actions)[0] ?? "book"}
              onChange={(e) => onChange({ action: e.target.value as PanoHotspotAction })}
            >
              {Object.entries(actions).map(([k, a]) => (
                <option key={k} value={k}>
                  {a.label}
                </option>
              ))}
            </select>,
            actions[h.action ?? "book"]?.hint,
          )}
          {label(
            "Button text",
            <input
              className={inputCls}
              value={h.label ?? ""}
              maxLength={60}
              placeholder={actions[h.action ?? "book"]?.label ?? "Book now"}
              onChange={(e) => onChange({ label: e.target.value || undefined })}
            />,
          )}
        </>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-3 border-t border-border pt-3 sm:col-span-2 sm:grid-cols-3">
        {label(
          "Badge pill (optional)",
          <input
            className={inputCls}
            value={h.badge ?? ""}
            maxLength={24}
            placeholder="e.g. ₱4,500 or New"
            onChange={(e) => onChange({ badge: e.target.value || undefined })}
          />,
        )}
        {label(
          "Pin style",
          <select
            className={inputCls}
            value={h.tone ?? ""}
            onChange={(e) => onChange({ tone: (e.target.value || undefined) as PanoHotspotTone | undefined })}
          >
            <option value="">Auto (by type)</option>
            <option value="default">Light pill</option>
            <option value="accent">Accent</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
            <option value="glass">Frosted glass</option>
            <option value="dark">Dark circle</option>
          </select>,
        )}
        {label(
          "Label display",
          <select
            className={inputCls}
            value={h.showLabel ?? ""}
            onChange={(e) =>
              onChange({ showLabel: (e.target.value || undefined) as PanoHotspotLabelDisplay | undefined })
            }
          >
            <option value="">Auto</option>
            <option value="always">Always show pill</option>
            <option value="hover">Show on hover</option>
            <option value="never">Icon only</option>
          </select>,
        )}
      </div>

      <div className="space-y-2 border-t border-border pt-3 sm:col-span-2">
        <span className="text-xs font-medium text-foreground">Icon</span>
        <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Icon">
          {Object.entries(PANO_HOTSPOT_ICONS).map(([key, { icon: I, label: name }]) => {
            const chosen = (h.icon ?? "") === key
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={chosen}
                title={name}
                aria-label={name}
                onClick={() => onChange({ icon: chosen ? undefined : key })}
                className={cn(
                  "grid size-8 cursor-pointer place-items-center rounded-md border transition-colors",
                  chosen
                    ? "border-accent-500 bg-accent-600/12 text-accent-strong"
                    : "border-border text-foreground hover:bg-foreground/6",
                )}
              >
                <I className="size-4" />
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="accent-accent-600"
              checked={Boolean(h.pulse)}
              onChange={(e) => onChange({ pulse: e.target.checked || undefined })}
            />
            Pulse to draw the eye
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="accent-accent-600"
              checked={h.enabled !== false}
              onChange={(e) => onChange({ enabled: e.target.checked ? undefined : false })}
            />
            Shown to guests
          </label>
        </div>
        <p className="text-xs text-muted-foreground">Drag it on the photo to move it.</p>
      </div>
    </div>
  )
}

export function PanoPlaceList({
  places,
  selected,
  onSelect,
}: {
  places: PanoPlaceItem[]
  selected: string
  onSelect: (id: string) => void
}) {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => (q ? places.filter((p) => p.name.toLowerCase().includes(q)) : places), [places, q])
  const categories = useMemo(
    () => Array.from(new Set(filtered.map((p) => p.category ?? "Places"))),
    [filtered],
  )
  const withTour = useMemo(() => places.filter((p) => (p.scenesCount ?? 0) > 0).length, [places])

  return (
    <aside className="rounded-xl border border-border bg-surface p-3 lg:sticky lg:top-16">
      <div className="mb-2 flex items-baseline justify-between px-1">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Places</span>
        <span className="text-xs text-muted-foreground">
          {withTour} of {places.length} with a tour
        </span>
      </div>

      {places.length > 5 && (
        <div className="relative mb-2">
          <PanoIcons.Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a place…"
            aria-label="Find a place"
            className={cn(inputCls, "h-8 pl-8 text-xs")}
          />
        </div>
      )}

      <div className="max-h-[45vh] space-y-3 overflow-y-auto lg:max-h-[calc(100dvh-12rem)]">
        {categories.map((cat) => {
          const rows = filtered.filter((p) => (p.category ?? "Places") === cat)
          if (!rows.length) return null
          return (
            <div key={cat}>
              {categories.length > 1 && (
                <p className="px-2 py-1 text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                  {cat}
                </p>
              )}
              <ul className="space-y-0.5">
                {rows.map((p) => {
                  const active = p.id === selected
                  const count = p.scenesCount ?? 0
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(p.id)}
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                          active
                            ? "bg-accent-600/12 font-semibold text-accent-strong"
                            : "text-foreground hover:bg-foreground/6",
                        )}
                      >
                        <span className={cn("truncate", p.enabled === false && "text-muted-foreground")}>
                          {p.name}
                        </span>
                        <span
                          className={cn(
                            "flex-none rounded-full px-1.5 py-0.5 text-[0.7rem] tabular-nums",
                            count > 0 ? "bg-foreground/6 text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {count || "—"}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">No places match “{query}”.</p>
        )}
      </div>
    </aside>
  )
}

function PanoCopyDialog({
  from,
  places,
  count,
  onClose,
  onSubmit,
}: {
  from: PanoPlaceItem
  places: PanoPlaceItem[]
  count: number
  onClose: () => void
  onSubmit: (targetIds: string[], mode: "replace" | "append") => Promise<void>
}) {
  const targets = places.filter((p) => p.id !== from.id)
  const [chosen, setChosen] = useState<Set<string>>(new Set())
  const [mode, setMode] = useState<"replace" | "append">("replace")
  const [busy, setBusy] = useState(false)

  const toggle = (ids: string[], on: boolean) =>
    setChosen((c) => {
      const next = new Set(c)
      ids.forEach((id) => (on ? next.add(id) : next.delete(id)))
      return next
    })

  const handleCopy = async () => {
    setBusy(true)
    try {
      await onSubmit([...chosen], mode)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Copy ${from.name}’s tour`}
      description={`Copies all ${plural(count, "scene")} with their start views and hotspots.`}
    >
      <div className="space-y-4">
        <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
          {targets.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-foreground/6"
            >
              <input
                type="checkbox"
                className="size-4 accent-accent-600"
                checked={chosen.has(p.id)}
                onChange={(e) => toggle([p.id], e.target.checked)}
              />
              <span className="min-w-0 flex-1 truncate">{p.name}</span>
              <span className="text-xs text-muted-foreground">
                {p.scenesCount ? plural(p.scenesCount, "scene") : "No tour"}
              </span>
            </label>
          ))}
        </div>

        <fieldset className="space-y-1.5 border-t border-border pt-3">
          <legend className="text-xs font-medium text-foreground">If a place already has a tour</legend>
          {(
            [
              ["replace", "Replace it with this tour"],
              ["append", "Keep it and add these scenes after"],
            ] as const
          ).map(([m, label]) => (
            <label key={m} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="pano-copy-mode"
                className="accent-accent-600"
                checked={mode === m}
                onChange={() => setMode(m)}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className={btnCls("secondary")} onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            className={btnCls("primary")}
            onClick={handleCopy}
            disabled={busy || chosen.size === 0}
          >
            {busy ? <PanoIcons.Loader className="animate-spin" /> : <PanoIcons.Copy />}
            {chosen.size ? `Copy to ${plural(chosen.size, "place")}` : "Choose places"}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function PanoJsonDialog({
  scenes,
  onClose,
  onImport,
}: {
  scenes: PanoScene[]
  onClose: () => void
  onImport: (scenes: PanoScene[]) => void
}) {
  const [raw, setRaw] = useState(() => JSON.stringify(scenes, null, 2))
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copyJson = async () => {
    try {
      await navigator.clipboard?.writeText(raw)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore clipboard error */
    }
  }

  const applyJson = () => {
    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array of PanoScene objects.")
      onImport(parsed as PanoScene[])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON.")
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Tour JSON Configuration"
      description="Copy this PanoScene[] array into your codebase or edit and apply changes directly."
    >
      <div className="space-y-3">
        <textarea
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value)
            setError(null)
          }}
          spellCheck={false}
          className={cn(inputCls, "h-64 font-mono text-xs leading-relaxed py-2")}
        />
        {error && <p className="text-xs font-medium text-danger-strong">{error}</p>}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button type="button" onClick={copyJson} className={btnCls("secondary", "sm")}>
            {copied ? <PanoIcons.Check /> : <PanoIcons.Copy />}
            {copied ? "Copied JSON" : "Copy JSON"}
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className={btnCls("secondary", "sm")}>
              Close
            </button>
            <button type="button" onClick={applyJson} className={btnCls("primary", "sm")}>
              Apply JSON
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

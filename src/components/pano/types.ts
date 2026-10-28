export interface PanoView {
  yaw: number
  pitch: number
  fov: number
}

export type TourView = PanoView

export type PanoHotspotType = "scene" | "info" | "media" | "link" | "action"
export type HotspotType = PanoHotspotType

export type PanoHotspotAction = "book" | "call" | "directions" | "message" | (string & {})
export type HotspotAction = PanoHotspotAction

export type PanoHotspotTone = "default" | "accent" | "success" | "warning" | "danger" | "glass" | "dark"
export type PanoHotspotSize = "sm" | "md" | "lg"
export type PanoHotspotLabelDisplay = "always" | "hover" | "never"

export interface PanoHotspotMedia {
  kind: "image" | "video"
  src?: string
  url?: string
  caption?: string
}

export type HotspotMedia = PanoHotspotMedia

export interface PanoHotspot {
  id: string
  type: PanoHotspotType
  yaw: number
  pitch: number
  label?: string
  /** Optional secondary body text shown when an `info` hotspot is opened or hovered. */
  description?: string
  /** Optional short badge pill shown inside the hotspot (e.g. price `"₱4,500"` or `"New"`). */
  badge?: string
  icon?: string
  /** Visual color/surface tone for the hotspot pin. */
  tone?: PanoHotspotTone
  /** Pin size (`"sm" | "md" | "lg"`). Defaults to `"md"`. */
  size?: PanoHotspotSize
  /** Controls whether the text label is shown `"always"` (pill), on `"hover"`, or `"never"` (icon only). */
  showLabel?: PanoHotspotLabelDisplay
  pulse?: boolean
  enabled?: boolean
  /** Scene id for `scene` hotspots. */
  target?: string | number
  /** Camera view to apply in the target scene on arrival. */
  arrival?: Partial<PanoView>
  /** Media payload for `media` hotspots. */
  media?: PanoHotspotMedia
  /** URL or path for `link` hotspots. */
  url?: string
  /** Action key for `action` hotspots. */
  action?: PanoHotspotAction
}

export type TourHotspot = PanoHotspot

export interface PanoScene {
  id: string | number
  name: string
  description?: string | null
  image: string
  preview?: string | null
  yaw: number
  pitch: number
  fov: number
  hotspots: PanoHotspot[]
  featured?: boolean
}

export type TourScene = PanoScene

export interface PanoActionDefinition {
  label: string
  hint?: string
  icon?: string
}

export interface PanoPlaceItem {
  id: string
  name: string
  category?: string
  enabled?: boolean
  scenesCount?: number
}

export interface PanoHandle {
  view: () => PanoView
  lookAt: (v: Partial<PanoView>, animateMs?: number, done?: () => void) => void
  zoom: (factor: number) => void
  gyroscope: (on: boolean) => Promise<boolean>
}

export interface PanoEditorState {
  picking: PanoHotspotType | null
  selected: string | null
  onPick: (yaw: number, pitch: number) => void
  onMove: (id: string, yaw: number, pitch: number) => void
  onSelect: (id: string) => void
}

export interface PanoUploadingItem {
  key: string
  name: string
  thumb?: string
  stage: "waiting" | "preparing" | "uploading"
  progress: number
  error?: string
}

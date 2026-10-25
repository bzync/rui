/** Shared status color anatomy. Every component with a success / warning /
 * danger / info notion reads from these maps, so a `palette.colors` override
 * (which sets --color-success etc.) retints all of them at once.
 *
 * The classes use the semantic status tokens only, never raw palette shades,
 * and never a light/dark class pair: the tint (`/10`) reads well on both
 * grounds, and `--color-*-strong` is itself mode-aware. A single class per
 * property also means a consumer's own Tailwind layer cannot re-assert one
 * half of a light/dark pair over the other.
 *
 * Keep these as complete static strings so Tailwind's scanner sees every
 * utility. */
export type StatusTone = "success" | "warning" | "danger" | "info"

/** The tone vocabulary every tone-bearing component accepts (Badge, Tag,
 * Callout, Alert, Text, StatusDot; Button's `danger` variant), so one status →
 * tone map can feed all of them. */
export type Tone = "default" | StatusTone | "muted"

/** Superseded tone names, still accepted: `error` and `destructive` mean
 * `danger`. */
export type DeprecatedTone = "error" | "destructive"

/** Maps a deprecated tone name to its current one; other names pass through. */
export function resolveTone<T extends string>(tone: T): Exclude<T, DeprecatedTone> | (T extends DeprecatedTone ? "danger" : never) {
  return (tone === "error" || tone === "destructive" ? "danger" : tone) as never
}

/** Tinted chip: badge, tag, status pill. */
export const statusSoftStyles: Record<StatusTone, string> = {
  success: "bg-success/10 text-success-strong border-success/25",
  warning: "bg-warning/10 text-warning-strong border-warning/25",
  danger: "bg-danger/10 text-danger-strong border-danger/25",
  info: "bg-info/10 text-info-strong border-info/25",
}

/** Tinted panel with a border: alert, callout, toast. */
export const statusSurfaceStyles: Record<StatusTone, string> = {
  success: "bg-success/8 border-success/25",
  warning: "bg-warning/8 border-warning/30",
  danger: "bg-danger/8 border-danger/25",
  info: "bg-info/8 border-info/25",
}

/** Solid fill: dots, progress fill, accent bars. */
export const statusSolidStyles: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
}

/** Faint solid track behind a solid fill. */
export const statusTrackStyles: Record<StatusTone, string> = {
  success: "bg-success/15",
  warning: "bg-warning/15",
  danger: "bg-danger/15",
  info: "bg-info/15",
}

/** Readable text / icon color. */
export const statusTextStyles: Record<StatusTone, string> = {
  success: "text-success-strong",
  warning: "text-warning-strong",
  danger: "text-danger-strong",
  info: "text-info-strong",
}

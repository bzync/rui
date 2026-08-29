import { cn } from "@/lib/cn"
import { HTMLAttributes } from "react"

type Size = "xs" | "sm" | "md" | "lg" | "xl"
type Status = "online" | "offline" | "away" | "busy"

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  name?: string
  /** Accessible name for the image; defaults to name or empty for decorative */
  alt?: string
  size?: Size
  status?: Status
  /** Defaults to lazy to avoid CLS/LCP penalties */
  loading?: "eager" | "lazy"
  decoding?: "async" | "auto" | "sync"
  referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"]
}

const sizes: Record<Size, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
  xl: "w-14 h-14 text-lg",
}

const dotSizes: Record<Size, string> = {
  xs: "w-1.5 h-1.5 border",
  sm: "w-2 h-2 border",
  md: "w-2.5 h-2.5 border-2",
  lg: "w-3 h-3 border-2",
  xl: "w-3.5 h-3.5 border-2",
}

const statusColors: Record<Status, string> = {
  online: "bg-emerald-400",
  offline: "bg-slate-500",
  away: "bg-amber-400",
  busy: "bg-red-400",
}

const palette = [
  "bg-accent-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-cyan-600",
  "bg-pink-600",
  "bg-teal-600",
]

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

function colorFor(name: string) {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return palette[hash % palette.length]
}

export function Avatar({
  src,
  name,
  alt,
  size = "md",
  status,
  loading = "lazy",
  decoding = "async",
  referrerPolicy = "no-referrer",
  className,
  ...props
}: AvatarProps) {
  const bg = name ? colorFor(name) : "bg-slate-600"
  const label = name ? initials(name) : "?"

  return (
    <div className={cn("relative inline-flex shrink-0 rounded-full", className)} {...props}>
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-semibold text-white",
          sizes[size],
          !src && bg,
        )}
      >
        {src ? (
          // src is caller-supplied and can point to any external host (user
          // avatars, Gravatar, etc.) — this app has no images.remotePatterns
          // configured, so next/image would reject most of them.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? name ?? ""} loading={loading} decoding={decoding} referrerPolicy={referrerPolicy} className="w-full h-full object-cover" />
        ) : (
          <span>{label}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-white dark:border-navy-900",
            dotSizes[size],
            statusColors[status],
          )}
        />
      )}
    </div>
  )
}

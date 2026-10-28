"use client"

import { cn } from "@/lib/cn"
import { resolveTone, statusTextStyles, type Tone } from "@/lib/status-styles"
import {
  type ComponentType,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
  type SVGAttributes,
  forwardRef,
} from "react"

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | (number & {})

export type IconTone = Tone | "accent"

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "size"> {
  /**
   * Name of a built-in icon (case-insensitive, kebab-case, snake_case, or PascalCase).
   * E.g. "check", "chevron-down", "search", "alert-triangle", "copy".
   */
  name?: IconName
  /**
   * Icon size preset ("xs" = 14px, "sm" = 16px, "md" = 20px, "lg" = 24px, "xl" = 32px)
   * or a numeric pixel value. Defaults to "md".
   */
  size?: IconSize
  /**
   * Semantic tone color matching design system text tokens.
   */
  tone?: IconTone
  /**
   * Accessible description. When supplied, sets role="img" and aria-label.
   * When omitted, defaults to aria-hidden="true".
   */
  label?: string
  /**
   * Applies continuous CSS rotation animation (e.g. for loaders or refreshing).
   */
  spin?: boolean
  /**
   * Stroke width in SVG user units. Defaults to 2.
   */
  strokeWidth?: number | string
  /**
   * Custom SVG path elements when not using a built-in name.
   */
  children?: ReactNode
}

const sizeStyles: Record<"xs" | "sm" | "md" | "lg" | "xl", string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
}

const toneStyles: Record<Tone | "accent", string> = {
  default: "text-current",
  muted: "text-muted-foreground",
  accent: "text-accent-strong",
  success: statusTextStyles.success,
  warning: statusTextStyles.warning,
  danger: statusTextStyles.danger,
  info: statusTextStyles.info,
}

/* -------------------------------------------------------------------------
 * Raw SVG Path Definitions (24x24 viewBox, stroke-based)
 * ------------------------------------------------------------------------- */
const iconPaths: Record<string, ReactNode> = {
  // Navigation & Direction
  arrowup: <><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></>,
  arrowdown: <><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></>,
  arrowleft: <><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>,
  arrowright: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  chevronup: <path d="m18 15-6-6-6 6" />,
  chevrondown: <path d="m6 9 6 6 6-6" />,
  chevronleft: <path d="m15 18-6-6 6-6" />,
  chevronright: <path d="m9 18 6-6-6-6" />,
  chevronsupdown: <><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></>,
  chevronsleftright: <><path d="m9 7-5 5 5 5" /><path d="m15 7 5 5-5 5" /></>,
  externallink: <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
  menu: <><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></>,

  // Common Actions
  check: <path d="M20 6 9 17l-5-5" />,
  checkcheck: <><path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" /></>,
  x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  plus: <><path d="M5 12h14" /><path d="M12 5v14" /></>,
  minus: <path d="M5 12h14" />,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  copy: <><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>,
  refresh: <><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></>,
  rotatecw: <><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></>,
  trash: <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></>,
  edit: <><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></>,
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  sliders: <><line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="1" x2="7" y1="14" y2="14" /><line x1="9" x2="15" y1="8" y2="8" /><line x1="17" x2="23" y1="16" y2="16" /></>,
  settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>,
  morehorizontal: <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>,
  morevertical: <><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,

  // Feedback & Status
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
  alertcircle: <><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></>,
  alerttriangle: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></>,
  checkcircle: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
  xcircle: <><circle cx="12" cy="12" r="10" /><line x1="15" x2="9" y1="9" y2="15" /><line x1="9" x2="15" y1="9" y2="15" /></>,
  helpcircle: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" x2="12.01" y1="17" y2="17" /></>,
  loader: <path d="M21 12a9 9 0 1 1-6.219-8.56" />,

  // UI & Controls
  eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  eyeoff: <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>,
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  monitor: <><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></>,
  calendar: <><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  heart: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,

  // Communication & Identity
  user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  mail: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
  mappin: <><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>,

  // Content & Files
  file: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></>,
  filetext: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></>,
  folder: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />,
  folderopen: <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />,
  image: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>,

  // Security & Developer
  lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  unlock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></>,
  shield: <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />,
  terminal: <><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></>,
  code: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  sparkles: <><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></>,
}

// Aliases mapping common alternative names to canonical keys
const aliases: Record<string, string> = {
  close: "x",
  cross: "x",
  add: "plus",
  remove: "minus",
  warning: "alerttriangle",
  error: "xcircle",
  success: "checkcircle",
  danger: "alerttriangle",
  spinner: "loader",
  gear: "settings",
  external: "externallink",
  delete: "trash",
}

function resolveIconKey(rawName?: string): string | null {
  if (!rawName) return null
  const cleaned = rawName.toLowerCase().replace(/[-_\s]/g, "")
  if (iconPaths[cleaned]) return cleaned
  if (aliases[cleaned] && iconPaths[aliases[cleaned]]) return aliases[cleaned]
  return null
}

export type IconName =
  | "arrow-up" | "arrow-down" | "arrow-left" | "arrow-right"
  | "chevron-up" | "chevron-down" | "chevron-left" | "chevron-right"
  | "chevrons-up-down" | "chevrons-left-right"
  | "external-link" | "menu"
  | "check" | "check-check" | "x" | "close" | "plus" | "minus"
  | "search" | "copy" | "refresh" | "rotate-cw" | "trash" | "edit"
  | "download" | "upload" | "filter" | "sliders" | "settings"
  | "more-horizontal" | "more-vertical" | "share" | "send"
  | "info" | "alert-circle" | "alert-triangle" | "warning"
  | "check-circle" | "x-circle" | "help-circle" | "loader" | "spinner"
  | "eye" | "eye-off" | "sun" | "moon" | "monitor"
  | "calendar" | "clock" | "bell" | "star" | "heart"
  | "user" | "users" | "mail" | "phone" | "map-pin" | "globe"
  | "file" | "file-text" | "folder" | "folder-open" | "image"
  | "lock" | "unlock" | "shield" | "terminal" | "code" | "zap" | "sparkles"
  | (string & {})

/* -------------------------------------------------------------------------
 * Main Icon Component
 * ------------------------------------------------------------------------- */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  {
    name,
    size = "md",
    tone,
    label,
    spin = false,
    strokeWidth = 2,
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const isPresetSize = typeof size === "string" && size in sizeStyles
  const sizeClass = isPresetSize ? sizeStyles[size as keyof typeof sizeStyles] : undefined
  const customDimensions = typeof size === "number" ? { width: size, height: size } : undefined

  const resolvedTone = tone ? resolveTone(tone) : undefined
  const toneClass = resolvedTone ? toneStyles[resolvedTone] : undefined

  const key = resolveIconKey(name)
  const renderedContent = children ?? (key ? iconPaths[key] : null)

  const isAccessible = Boolean(label)

  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-icon={key}
      role={isAccessible ? "img" : undefined}
      aria-label={label}
      aria-hidden={isAccessible ? undefined : "true"}
      style={{ ...customDimensions, ...style }}
      className={cn(
        "shrink-0 transition-colors",
        sizeClass,
        toneClass,
        (spin || key === "loader") && "animate-spin",
        className,
      )}
      {...props}
    >
      {renderedContent}
    </svg>
  )
})
Icon.displayName = "Icon"

/* -------------------------------------------------------------------------
 * createIcon Helper & Dedicated Icon Components (Icons.*)
 * ------------------------------------------------------------------------- */
export type SingleIconComponent = ForwardRefExoticComponent<
  Omit<IconProps, "name"> & RefAttributes<SVGSVGElement>
>

export function createIcon(name: string, paths: ReactNode): SingleIconComponent {
  const Comp = forwardRef<SVGSVGElement, Omit<IconProps, "name">>(function CreatedIcon(props, ref) {
    return <Icon ref={ref} name={name} {...props}>{paths}</Icon>
  })
  Comp.displayName = `Icons.${name}`
  return Comp
}

export const Icons = {
  // Navigation & Direction
  ArrowUp: createIcon("ArrowUp", iconPaths.arrowup),
  ArrowDown: createIcon("ArrowDown", iconPaths.arrowdown),
  ArrowLeft: createIcon("ArrowLeft", iconPaths.arrowleft),
  ArrowRight: createIcon("ArrowRight", iconPaths.arrowright),
  ChevronUp: createIcon("ChevronUp", iconPaths.chevronup),
  ChevronDown: createIcon("ChevronDown", iconPaths.chevrondown),
  ChevronLeft: createIcon("ChevronLeft", iconPaths.chevronleft),
  ChevronRight: createIcon("ChevronRight", iconPaths.chevronright),
  ChevronsUpDown: createIcon("ChevronsUpDown", iconPaths.chevronsupdown),
  ChevronsLeftRight: createIcon("ChevronsLeftRight", iconPaths.chevronsleftright),
  ExternalLink: createIcon("ExternalLink", iconPaths.externallink),
  Menu: createIcon("Menu", iconPaths.menu),

  // Common Actions
  Check: createIcon("Check", iconPaths.check),
  CheckCheck: createIcon("CheckCheck", iconPaths.checkcheck),
  X: createIcon("X", iconPaths.x),
  Plus: createIcon("Plus", iconPaths.plus),
  Minus: createIcon("Minus", iconPaths.minus),
  Search: createIcon("Search", iconPaths.search),
  Copy: createIcon("Copy", iconPaths.copy),
  Refresh: createIcon("Refresh", iconPaths.refresh),
  RotateCw: createIcon("RotateCw", iconPaths.rotatecw),
  Trash: createIcon("Trash", iconPaths.trash),
  Edit: createIcon("Edit", iconPaths.edit),
  Download: createIcon("Download", iconPaths.download),
  Upload: createIcon("Upload", iconPaths.upload),
  Filter: createIcon("Filter", iconPaths.filter),
  Sliders: createIcon("Sliders", iconPaths.sliders),
  Settings: createIcon("Settings", iconPaths.settings),
  MoreHorizontal: createIcon("MoreHorizontal", iconPaths.morehorizontal),
  MoreVertical: createIcon("MoreVertical", iconPaths.morevertical),
  Share: createIcon("Share", iconPaths.share),
  Send: createIcon("Send", iconPaths.send),

  // Feedback & Status
  Info: createIcon("Info", iconPaths.info),
  AlertCircle: createIcon("AlertCircle", iconPaths.alertcircle),
  AlertTriangle: createIcon("AlertTriangle", iconPaths.alerttriangle),
  CheckCircle: createIcon("CheckCircle", iconPaths.checkcircle),
  XCircle: createIcon("XCircle", iconPaths.xcircle),
  HelpCircle: createIcon("HelpCircle", iconPaths.helpcircle),
  Loader: createIcon("Loader", iconPaths.loader),

  // UI & Controls
  Eye: createIcon("Eye", iconPaths.eye),
  EyeOff: createIcon("EyeOff", iconPaths.eyeoff),
  Sun: createIcon("Sun", iconPaths.sun),
  Moon: createIcon("Moon", iconPaths.moon),
  Monitor: createIcon("Monitor", iconPaths.monitor),
  Calendar: createIcon("Calendar", iconPaths.calendar),
  Clock: createIcon("Clock", iconPaths.clock),
  Bell: createIcon("Bell", iconPaths.bell),
  Star: createIcon("Star", iconPaths.star),
  Heart: createIcon("Heart", iconPaths.heart),

  // Communication & Identity
  User: createIcon("User", iconPaths.user),
  Users: createIcon("Users", iconPaths.users),
  Mail: createIcon("Mail", iconPaths.mail),
  Phone: createIcon("Phone", iconPaths.phone),
  MapPin: createIcon("MapPin", iconPaths.mappin),
  Globe: createIcon("Globe", iconPaths.globe),

  // Content & Files
  File: createIcon("File", iconPaths.file),
  FileText: createIcon("FileText", iconPaths.filetext),
  Folder: createIcon("Folder", iconPaths.folder),
  FolderOpen: createIcon("FolderOpen", iconPaths.folderopen),
  Image: createIcon("Image", iconPaths.image),

  // Security & Developer
  Lock: createIcon("Lock", iconPaths.lock),
  Unlock: createIcon("Unlock", iconPaths.unlock),
  Shield: createIcon("Shield", iconPaths.shield),
  Terminal: createIcon("Terminal", iconPaths.terminal),
  Code: createIcon("Code", iconPaths.code),
  Zap: createIcon("Zap", iconPaths.zap),
  Sparkles: createIcon("Sparkles", iconPaths.sparkles),
}

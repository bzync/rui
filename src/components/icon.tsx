"use client"

import { cn } from "@/lib/cn"
import { resolveTone, statusTextStyles, type Tone } from "@/lib/status-styles"
import {
  type CSSProperties,
  type ReactNode,
  forwardRef,
} from "react"
import { iconNodes, iconCatalog, iconAliases, resolveIconKey } from "./icon/data"
import type {
  IconCategory,
  IconItem,
  IconName,
  IconNode,
  IconProps,
  IconSize,
  IconTone,
  SingleIconComponent,
} from "./icon/types"

export type {
  IconCategory,
  IconItem,
  IconName,
  IconNode,
  IconProps,
  IconSize,
  IconTone,
  SingleIconComponent,
}

export { iconCatalog, iconAliases }

export const iconCategories: readonly IconCategory[] = [
  "Tech Stack",
  "Developer",
  "Social",
  "Navigation",
  "Actions",
  "Feedback",
  "Media",
  "Files",
  "Communication",
  "Devices",
  "Commerce",
  "Time",
  "Weather",
  "Charts",
  "Shapes",
  "Editor",
  "Health",
  "Travel",
  "Nature",
  "Food",
] as const

const sizeStyles: Record<"xs" | "sm" | "md" | "lg" | "xl" | "2xl", string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
  "2xl": "size-10",
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

function renderIconNodes(nodes: IconNode) {
  return nodes.map(([tag, attrs], idx) => {
    switch (tag) {
      case "path":
        return <path key={idx} {...(attrs as any)} />
      case "circle":
        return <circle key={idx} {...(attrs as any)} />
      case "rect":
        return <rect key={idx} {...(attrs as any)} />
      case "line":
        return <line key={idx} {...(attrs as any)} />
      case "polyline":
        return <polyline key={idx} {...(attrs as any)} />
      case "polygon":
        return <polygon key={idx} {...(attrs as any)} />
      case "ellipse":
        return <ellipse key={idx} {...(attrs as any)} />
      default:
        return null
    }
  })
}

/* -------------------------------------------------------------------------
 * Main Icon Component (Fully Customizable, Self-Contained)
 * ------------------------------------------------------------------------- */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  {
    name,
    size = "md",
    tone,
    color,
    fill = "none",
    strokeWidth = 2,
    strokeLinecap = "round",
    strokeLinejoin = "round",
    spin = false,
    rotate,
    flip,
    pulse = false,
    label,
    title,
    description,
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const isPresetSize = typeof size === "string" && size in sizeStyles
  const sizeClass = isPresetSize ? sizeStyles[size as keyof typeof sizeStyles] : undefined
  const customDimensions: CSSProperties | undefined =
    typeof size === "number"
      ? { width: size, height: size }
      : typeof size === "string" && !isPresetSize
      ? { width: size, height: size }
      : undefined

  const resolvedTone = tone ? resolveTone(tone) : undefined
  const toneClass = resolvedTone ? toneStyles[resolvedTone] : undefined

  const transforms: string[] = []
  if (rotate) transforms.push(`rotate(${rotate}deg)`)
  if (flip === "horizontal") transforms.push("scaleX(-1)")
  else if (flip === "vertical") transforms.push("scaleY(-1)")
  else if (flip === "both") transforms.push("scale(-1, -1)")

  const transformStyle: CSSProperties | undefined =
    transforms.length > 0 ? { transform: transforms.join(" ") } : undefined

  const colorStyle: CSSProperties | undefined = color ? { color } : undefined

  const key = resolveIconKey(name)
  const renderedContent = children ?? (key && iconNodes[key] ? renderIconNodes(iconNodes[key]) : null)

  const isAccessible = Boolean(label)

  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      data-icon={key ?? undefined}
      role={isAccessible ? "img" : undefined}
      aria-label={label}
      aria-hidden={isAccessible ? undefined : "true"}
      style={{ ...customDimensions, ...colorStyle, ...transformStyle, ...style }}
      className={cn(
        "shrink-0 transition-colors",
        sizeClass,
        toneClass,
        (spin || key === "loader" || key === "loader2") && "animate-spin",
        pulse && "animate-pulse",
        className,
      )}
      {...props}
    >
      {title && <title>{title}</title>}
      {description && <desc>{description}</desc>}
      {renderedContent}
    </svg>
  )
})
Icon.displayName = "Icon"

/* -------------------------------------------------------------------------
 * createIcon Helper & Dedicated Icon Components (Icons.*)
 * ------------------------------------------------------------------------- */
export function createIcon(name: string, content?: ReactNode): SingleIconComponent {
  const Comp = forwardRef<SVGSVGElement, Omit<IconProps, "name">>(function CreatedIcon(props, ref) {
    return (
      <Icon ref={ref} name={name as any} {...props}>
        {content}
      </Icon>
    )
  })
  Comp.displayName = `Icons.${name}`
  return Comp
}

// Map of pre-instantiated icon components for fast access and tree-shaking
const knownIcons: Record<string, SingleIconComponent> = {}

for (const item of iconCatalog) {
  knownIcons[item.pascal] = createIcon(item.pascal)
  if (item.name !== item.pascal) {
    knownIcons[item.name] = knownIcons[item.pascal]
  }
}

// Cache for on-demand resolved icons
const iconCache = new Map<string, SingleIconComponent>()

export const Icons: Record<string, SingleIconComponent> = new Proxy(knownIcons, {
  get(target, prop: string) {
    if (typeof prop !== "string") return Reflect.get(target, prop)
    if (prop in target) return target[prop]

    if (iconCache.has(prop)) {
      return iconCache.get(prop)!
    }

    const resolved = resolveIconKey(prop)
    if (resolved) {
      const comp = createIcon(prop)
      iconCache.set(prop, comp)
      return comp
    }

    return Reflect.get(target, prop)
  },
  has(target, prop: string) {
    if (typeof prop !== "string") return Reflect.has(target, prop)
    return prop in target || iconCache.has(prop) || resolveIconKey(prop) !== null
  },
})

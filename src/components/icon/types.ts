import type { SVGAttributes, ReactNode, ForwardRefExoticComponent, RefAttributes } from "react"
import type { Tone } from "@/lib/status-styles"

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | (number & {}) | (string & {})

export type IconTone = Tone | "accent"

export type IconCategory =
  | "Tech Stack"
  | "Developer"
  | "Social"
  | "Navigation"
  | "Actions"
  | "Feedback"
  | "Media"
  | "Files"
  | "Communication"
  | "Devices"
  | "Commerce"
  | "Time"
  | "Weather"
  | "Charts"
  | "Shapes"
  | "Editor"
  | "Health"
  | "Travel"
  | "Nature"
  | "Food"

export interface IconItem {
  name: string
  pascal: string
  category: IconCategory
  key: string
  tags?: string[]
  aliases?: readonly string[]
}

export type IconNode = [tag: string, attrs: Record<string, string | number>][]

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "size"> {
  /**
   * Name of a built-in icon (case-insensitive, kebab-case, snake_case, camelCase, or PascalCase).
   * Supports over 1,900 icons across 20 domains.
   */
  name?: IconName
  /**
   * Icon size preset ("xs" = 14px, "sm" = 16px, "md" = 20px, "lg" = 24px, "xl" = 32px, "2xl" = 40px),
   * numeric pixel value (e.g. 28), or CSS dimension string (e.g. "2rem"). Defaults to "md".
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
   * Tooltip rendered as native SVG <title> element for hover information.
   */
  title?: string
  /**
   * SVG <desc> description for accessible screen readers.
   */
  description?: string
  /**
   * Custom direct CSS color override.
   */
  color?: string
  /**
   * Direct SVG fill color. Defaults to "none".
   */
  fill?: string
  /**
   * Stroke width in SVG user units. Defaults to 2.
   */
  strokeWidth?: number | string
  /**
   * SVG stroke linecap ("round" | "square" | "butt"). Defaults to "round".
   */
  strokeLinecap?: "round" | "inherit" | "butt" | "square"
  /**
   * SVG stroke linejoin ("round" | "bevel" | "miter" | "inherit"). Defaults to "round".
   */
  strokeLinejoin?: "round" | "inherit" | "miter" | "bevel"
  /**
   * Applies continuous CSS rotation animation (e.g. for loaders or spinners).
   */
  spin?: boolean
  /**
   * Rotation in degrees (e.g. 90, 180, 270).
   */
  rotate?: number
  /**
   * Directional mirror flip ("horizontal" | "vertical" | "both").
   */
  flip?: "horizontal" | "vertical" | "both"
  /**
   * Applies gentle CSS pulse animation.
   */
  pulse?: boolean
  /**
   * Custom SVG elements when authoring bespoke glyphs with createIcon or inline children.
   */
  children?: ReactNode
}

export type SingleIconComponent = ForwardRefExoticComponent<Omit<IconProps, "name"> & RefAttributes<SVGSVGElement>>

export type IconName =
  | string

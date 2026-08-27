import { cn } from "@/lib/cn"
import { HTMLAttributes, ReactNode } from "react"

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Prevent the shell itself from scrolling and let AppShellMain own overflow. */
  fixed?: boolean
}

/** Root frame for application layouts. Compose it with Sidebar and AppShellBody. */
export function AppShell({ fixed = false, className, children, ...props }: AppShellProps) {
  return (
    <div
      className={cn(
        "portal-shell flex min-h-dvh w-full bg-bg text-foreground",
        fixed && "h-dvh min-h-0 overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** Vertical region beside a sidebar. Usually contains a topbar, main, and footer. */
export function AppShellBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex min-w-0 flex-1 flex-col", className)} {...props}>
      {children}
    </div>
  )
}

export interface AppShellMainProps extends HTMLAttributes<HTMLElement> {
  scrollable?: boolean
}

export function AppShellMain({ scrollable = false, className, children, ...props }: AppShellMainProps) {
  return (
    <main className={cn("min-w-0 flex-1", scrollable && "overflow-y-auto", className)} {...props}>
      {children}
    </main>
  )
}

export interface LayoutBarProps extends HTMLAttributes<HTMLElement> {
  sticky?: boolean
}

/** General-purpose application header; Topbar can be used inside it for navigation controls. */
export function AppShellHeader({ sticky = false, className, children, ...props }: LayoutBarProps) {
  return (
    <header
      className={cn("z-30 shrink-0", sticky && "sticky top-0", className)}
      {...props}
    >
      {children}
    </header>
  )
}

/** Page or application footer with safe-area padding. */
export function Footer({ sticky = false, className, children, ...props }: LayoutBarProps) {
  return (
    <footer
      className={cn(
        "shrink-0 border-t border-border bg-bg/95 px-4 py-4 text-sm text-muted-foreground",
        sticky && "sticky bottom-0 z-30",
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  )
}

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full"

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
  gutter?: boolean
}

const containerSizes: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-screen-2xl",
  full: "max-w-none",
}

/** Centers content and provides consistent responsive page gutters. */
export function Container({ size = "lg", gutter = true, className, children, ...props }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full", containerSizes[size], gutter && "px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  )
}

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode
  /** Heading level for SEO hierarchy; defaults to h1 (one per page) */
  as?: "h1" | "h2" | "h3" | "div"
  description?: ReactNode
  eyebrow?: ReactNode
  breadcrumbs?: ReactNode
  actions?: ReactNode
}

/** Standard page heading with optional breadcrumbs, supporting copy, and actions. */
export function PageHeader({ title, description, eyebrow, breadcrumbs, actions, as: Tag = "h1", className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)} {...props}>
      <div className="min-w-0">
        {breadcrumbs && <div className="mb-3">{breadcrumbs}</div>}
        {eyebrow && <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">{eyebrow}</div>}
        <Tag className="text-2xl font-semibold tracking-[-0.02em] text-foreground">{title}</Tag>
        {description && <div className="mt-1.5 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
}

const gaps = { none: "gap-0", xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8" }

/** Vertical spacing primitive for page sections and forms. */
export function Stack({ gap = "md", className, children, ...props }: StackProps) {
  return <div className={cn("flex flex-col", gaps[gap], className)} {...props}>{children}</div>
}

export interface InlineProps extends StackProps {
  wrap?: boolean
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between"
}

const alignments = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" }
const justifications = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" }

/** Horizontal spacing primitive for toolbars, actions, and metadata. */
export function Inline({ gap = "md", wrap = true, align = "center", justify = "start", className, children, ...props }: InlineProps) {
  return (
    <div className={cn("flex", gaps[gap], wrap && "flex-wrap", alignments[align], justifications[justify], className)} {...props}>
      {children}
    </div>
  )
}

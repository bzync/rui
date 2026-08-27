import { cn } from "@/lib/cn"
import { HTMLAttributes } from "react"

export type CardVariant = "default" | "elevated" | "bordered" | "glass" | "flush"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  /** Override variant styling end-to-end */
  variantClassName?: string
  unstyled?: boolean
}

export const cardVariants: Record<CardVariant, string> = {
  default: "rounded-[var(--radius-xl)] border border-border bg-surface shadow-xs",
  elevated: "rounded-[var(--radius-xl)] border border-border bg-surface-raised shadow-floating",
  bordered: "rounded-[var(--radius-xl)] border border-border bg-transparent",
  glass: "portal-panel rounded-[var(--radius-xl)] border",
  flush: "rounded-[var(--radius-lg)] bg-surface",
}

export function Card({
  variant = "default",
  variantClassName,
  unstyled = false,
  className,
  children,
  ...props
}: CardProps) {
  if (unstyled) return <div className={cn(className, variantClassName)} {...props}>{children}</div>
  return (
    <div
      data-variant={variant}
      className={cn(
        cardVariants[variant],
        variantClassName,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-4 py-3 sm:px-5 sm:py-3.5",
        "border-b border-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  as: Tag = "h3",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p" }) {
  return (
    <Tag
      className={cn(
        "text-sm font-semibold leading-5 text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-1 text-sm leading-5 text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-4 py-3.5 sm:px-5 sm:py-4", className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-4 py-3 sm:px-5 sm:py-3",
        "border-t border-border",
        "flex flex-wrap items-center gap-2 sm:gap-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

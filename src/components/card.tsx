import { cn } from "@/lib/cn"
import { HTMLAttributes, forwardRef, type Ref } from "react"

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

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({
  variant = "default",
  variantClassName,
  unstyled = false,
  className,
  children,
  ...props
}, ref) {
  if (unstyled) return <div className={cn(className, variantClassName)} {...props}>{children}</div>
  return (
    <div ref={ref}
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
})
Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardHeader({
  className,
  children,
  ...props
}, ref) {
  return (
    <div ref={ref}
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
})
CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<HTMLElement, HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p" }>(function CardTitle({
  as: Tag = "h3",
  className,
  children,
  ...props
}, ref) {
  return (
    <Tag
      ref={ref as Ref<HTMLHeadingElement>}
      className={cn(
        "text-sm font-semibold leading-5 text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
})
CardTitle.displayName = "CardTitle"

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function CardDescription({
  className,
  children,
  ...props
}, ref) {
  return (
    <p ref={ref}
      className={cn("mt-1 text-sm leading-5 text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  )
})
CardDescription.displayName = "CardDescription"

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardBody({
  className,
  children,
  ...props
}, ref) {
  return (
    <div ref={ref} className={cn("px-4 py-3.5 sm:px-5 sm:py-4", className)} {...props}>
      {children}
    </div>
  )
})
CardBody.displayName = "CardBody"

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardFooter({
  className,
  children,
  ...props
}, ref) {
  return (
    <div ref={ref}
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
})
CardFooter.displayName = "CardFooter"

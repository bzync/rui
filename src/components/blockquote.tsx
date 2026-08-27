import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { BlockquoteHTMLAttributes, ReactNode, forwardRef } from "react"

export type BlockquoteVariant = "default" | "accent" | "subtle"
export type BlockquoteSize = "sm" | "md" | "lg"

const variantStyles: Record<BlockquoteVariant, string> = {
  default: "border-l-border-strong bg-transparent",
  accent: "border-l-accent-500 bg-accent-50/60 dark:bg-accent-900/15",
  subtle: "border-l-border bg-surface-muted",
}

const sizeStyles: Record<BlockquoteSize, string> = {
  sm: "px-4 py-3 text-sm leading-6",
  md: "px-5 py-4 text-base leading-7",
  lg: "px-6 py-5 text-lg leading-8",
}

export interface BlockquoteProps extends BlockquoteHTMLAttributes<HTMLQuoteElement> {
  variant?: BlockquoteVariant
  size?: BlockquoteSize
  source?: ReactNode
  sourceHref?: string
}

export const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteProps>(({
  variant = "default",
  size = "md",
  source,
  sourceHref,
  className,
  children,
  ...props
}, ref) => {
  return (
    <blockquote
      ref={ref}
      className={cn(
        "min-w-0 break-words rounded-r-[var(--radius-lg)] border-l-4 text-foreground",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      <div>{children}</div>
      {source && (
        <footer className="mt-2 text-xs font-medium text-muted-foreground">
          <span aria-hidden="true">— </span>
          {sourceHref ? <a href={sourceHref} className={cn("rounded-sm underline decoration-border-strong underline-offset-4 hover:text-foreground", focusRingStyles)}>{source}</a> : source}
        </footer>
      )}
    </blockquote>
  )
})
Blockquote.displayName = "Blockquote"

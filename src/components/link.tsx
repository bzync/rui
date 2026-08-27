import { cn } from "@/lib/cn"
import { AnchorHTMLAttributes, ReactNode } from "react"

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean
  icon?: ReactNode
  variant?: "default" | "muted" | "underline"
  /** Override rel when external; defaults to "noopener noreferrer" */
  externalRel?: string
}

const variants = {
  default:   "text-accent-400 hover:text-accent-300",
  muted:     "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200",
  underline: "text-slate-700 dark:text-slate-200 underline underline-offset-2 decoration-black/25 dark:decoration-white/25 hover:decoration-black/50 dark:hover:decoration-white/50",
}

export function Link({
  children,
  className,
  external,
  icon,
  variant = "default",
  externalRel,
  ...props
}: LinkProps) {
  return (
    <a
      target={external ? "_blank" : undefined}
      rel={external ? (externalRel ?? "noopener noreferrer") : undefined}
      referrerPolicy={external ? "strict-origin-when-cross-origin" : undefined}
      className={cn(
        "inline-flex items-center gap-1 transition-colors cursor-pointer",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {external && !icon && (
        <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      )}
    </a>
  )
}

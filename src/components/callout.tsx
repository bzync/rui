import { cn } from "@/lib/cn"
import { HTMLAttributes, ReactNode } from "react"

type CalloutVariant = "info" | "success" | "warning" | "error" | "default"

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant
  icon?: ReactNode
  title?: string
}

const styles: Record<CalloutVariant, { wrap: string; icon: string; defaultIcon: ReactNode }> = {
  default: {
    wrap: "bg-muted border-border",
    icon: "text-muted-foreground",
    defaultIcon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
      </svg>
    ),
  },
  info: {
    wrap: "bg-sky-500/[0.08] border-sky-500/20",
    icon: "text-sky-600 dark:text-sky-400",
    defaultIcon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
      </svg>
    ),
  },
  success: {
    wrap: "bg-emerald-500/[0.08] border-emerald-500/20",
    icon: "text-emerald-600 dark:text-emerald-400",
    defaultIcon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
      </svg>
    ),
  },
  warning: {
    wrap: "bg-amber-500/[0.08] border-amber-500/20",
    icon: "text-amber-600 dark:text-amber-400",
    defaultIcon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" /><path d="M12 17h.01" />
      </svg>
    ),
  },
  error: {
    wrap: "bg-red-500/[0.08] border-red-500/20",
    icon: "text-red-600 dark:text-red-400",
    defaultIcon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
      </svg>
    ),
  },
}

export function Callout({ variant = "info", icon, title, className, children, ...props }: CalloutProps) {
  const { wrap, icon: iconCls, defaultIcon } = styles[variant]

  return (
    <div
      className={cn("flex gap-3 rounded-[var(--radius-lg)] border px-4 py-3.5", wrap, className)}
      role="note"
      {...props}
    >
      <span className={cn("shrink-0 mt-0.5", iconCls)}>{icon ?? defaultIcon}</span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold text-foreground mb-0.5 leading-snug">{title}</p>
        )}
        <div className="text-sm leading-relaxed text-foreground/80">{children}</div>
      </div>
    </div>
  )
}

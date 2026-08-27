import { cn } from "@/lib/cn"
import { HTMLAttributes } from "react"

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  keys: string | string[]
  size?: "sm" | "md"
}

export function Kbd({ keys, size = "sm", className, ...props }: KbdProps) {
  const parts = Array.isArray(keys) ? keys : [keys]
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} {...props}>
      {parts.map((k, i) => (
        <kbd
          key={i}
          className={cn(
            "inline-flex items-center justify-center font-mono font-medium rounded border",
            "bg-black/6 dark:bg-white/6 border-black/15 dark:border-white/15",
            "text-slate-600 dark:text-slate-400",
            size === "sm" ? "px-1.5 py-0.5 text-[10px] min-w-[18px] h-[18px]" : "px-2 py-1 text-xs min-w-[22px] h-[22px]",
          )}
        >
          {k}
        </kbd>
      ))}
    </span>
  )
}

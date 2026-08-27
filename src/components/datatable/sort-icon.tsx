import { cn } from "@/lib/cn"
import { SortDir } from "./types"

export function SortIcon({ dir }: { dir: SortDir }) {
  return (
    <span className="inline-flex flex-col ml-1.5 gap-[2px] shrink-0">
      <svg aria-hidden="true" width="8" height="5" viewBox="0 0 8 5" className={cn(dir === "asc" ? "text-accent-600" : "text-muted-foreground/60")}>
        <path d="M4 0L8 5H0L4 0Z" fill="currentColor" />
      </svg>
      <svg aria-hidden="true" width="8" height="5" viewBox="0 0 8 5" className={cn(dir === "desc" ? "text-accent-600" : "text-muted-foreground/60")}>
        <path d="M4 5L0 0H8L4 5Z" fill="currentColor" />
      </svg>
    </span>
  )
}

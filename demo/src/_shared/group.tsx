import { type ReactNode } from "react"

export function Group({ label, children, col }: { label: string; children: ReactNode; col?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] whitespace-nowrap">
          {label}
        </span>
        <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
      </div>
      <div
        className={[
          "rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.04] p-4 sm:p-5 shadow-xs dark:shadow-none",
          col ? "flex flex-col gap-4 sm:gap-5" : "flex flex-wrap items-center gap-3",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  )
}

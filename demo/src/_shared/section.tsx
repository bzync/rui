"use client"

import { type ReactNode } from "react"

export function Section({
  id,
  title,
  description,
  importPath,
  meta,
  children,
}: {
  id: string
  title: string
  description?: string
  importPath?: string
  meta?: string[]
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 py-6 sm:py-10 border-b border-black/10 dark:border-white/10 last:border-none"
    >
      <div className="mb-8 pl-3 border-l-2 border-blue-500/30 dark:border-blue-400/30">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-2xl">{description}</p>
        )}
        {(importPath || meta) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {importPath && (
              <code className="text-[12px] font-mono bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-white/15 rounded-lg px-3 py-1.5 text-slate-600 dark:text-slate-300 select-all shadow-xs">
                {importPath}
              </code>
            )}
            {meta?.map((m) => (
              <span key={m} className="text-[11px] font-medium bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-400/20 rounded-full px-2.5 py-0.5 text-blue-600 dark:text-blue-400">
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

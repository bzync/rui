"use client"

import { cn } from "@/lib/cn"
import { useEffect, useRef } from "react"

export type TerminalLineType = "command" | "output" | "error" | "success" | "info" | "muted"
export interface TerminalLine { type?: TerminalLineType; text: string; prompt?: string }

const BLOCK_COLORS: Record<TerminalLineType, string> = {
  command: "text-gray-900 dark:text-slate-100",
  output:  "text-slate-700 dark:text-slate-300",
  error:   "text-red-600 dark:text-red-400",
  success: "text-emerald-700 dark:text-emerald-400",
  info:    "text-sky-600 dark:text-sky-400",
  muted:   "text-slate-400 dark:text-slate-500",
}

export interface TerminalBlockProps { lines: TerminalLine[]; title?: string; prompt?: string; className?: string }

export function TerminalBlock({ lines, title = "Terminal", prompt = "$", className }: TerminalBlockProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])
  return (
    <div className={cn("rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#0e1117]", className)}>
      <div className="flex items-center px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/3 dark:bg-white/[0.03]">
        <span className="flex-1 text-center text-xs text-slate-500 font-medium">{title}</span>
      </div>
      <div ref={scrollRef} className="p-4 font-mono text-sm leading-6 overflow-y-auto max-h-80">
        {lines.map((line, i) => {
          const t = line.type ?? "output"
          return (
            <div key={i} className="whitespace-pre-wrap break-all">
              {t === "command" && <span className="text-emerald-600 dark:text-emerald-500 mr-2 select-none">{line.prompt ?? prompt}</span>}
              <span className={BLOCK_COLORS[t]}>{line.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

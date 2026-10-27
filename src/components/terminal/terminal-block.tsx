"use client"

import { cn } from "@/lib/cn"
import { useEffect, useRef, forwardRef } from "react"

export type TerminalLineType = "command" | "output" | "error" | "success" | "info" | "muted"
export interface TerminalLine { type?: TerminalLineType; text: string; prompt?: string }

const BLOCK_COLORS: Record<TerminalLineType, string> = {
  command: "text-foreground",
  output:  "text-foreground/80",
  error:   "text-danger-strong",
  success: "text-success-strong",
  info:    "text-info-strong",
  muted:   "text-muted-foreground/70",
}

export interface TerminalBlockProps { lines: TerminalLine[]; title?: string; prompt?: string; className?: string }

export const TerminalBlock = forwardRef<HTMLDivElement, TerminalBlockProps>(function TerminalBlock({ lines, title = "Terminal", prompt = "$", className }, ref) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])
  return (
    <div ref={ref} className={cn("rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-sunken", className)}>
      <div className="flex items-center px-4 py-2.5 border-b border-foreground/[0.07] bg-foreground/3">
        <span className="flex-1 text-center text-xs text-muted-foreground font-medium">{title}</span>
      </div>
      <div ref={scrollRef} className="p-4 font-mono text-sm leading-6 overflow-y-auto max-h-80">
        {lines.map((line, i) => {
          const t = line.type ?? "output"
          return (
            <div key={i} className="whitespace-pre-wrap break-all">
              {t === "command" && <span className="text-success-strong mr-2 select-none">{line.prompt ?? prompt}</span>}
              <span className={BLOCK_COLORS[t]}>{line.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
TerminalBlock.displayName = "TerminalBlock"

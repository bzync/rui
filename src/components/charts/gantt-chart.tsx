"use client"

import { cn } from "@/lib/cn"
import { useEffect, useState } from "react"
import { type TooltipState, ChartTooltip } from "./shared"

export interface GanttTask {
  id: string
  label: string
  start: number
  end: number
  color?: string
}

export interface GanttChartProps {
  tasks: GanttTask[]
  total?: number
  xLabels?: string[]
  rowHeight?: number
  className?: string
}

const GANTT_COLORS = ["var(--color-accent-500)", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4"]

export function GanttChart({
  tasks,
  total: totalProp,
  xLabels,
  rowHeight = 42,
  className,
}: GanttChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const total = totalProp ?? Math.max(...tasks.map((t) => t.end), 1)
  const totalHeight = tasks.length * rowHeight + 28

  return (
    <div className={cn("relative w-full select-none overflow-x-auto", className)}>
      <div style={{ height: totalHeight, minWidth: 360 }} className="relative">
        <div className="absolute inset-0 flex pointer-events-none" style={{ bottom: 28 }}>
          {Array.from({ length: total + 1 }).map((_, i) => (
            <div key={i} className="h-full border-l border-black/6 dark:border-white/6 flex-shrink-0"
              style={{ width: `${100 / total}%` }} />
          ))}
        </div>

        {tasks.map((task, i) => {
          const c = task.color ?? GANTT_COLORS[i % GANTT_COLORS.length]
          const left = (task.start / total) * 100
          const width = ((task.end - task.start) / total) * 100
          const isHov = hovered === task.id
          return (
            <div key={task.id} className="absolute left-0 right-0 flex items-center"
              style={{ top: i * rowHeight, height: rowHeight }}>
              <div
                className="absolute rounded-md flex items-center px-2.5 cursor-pointer"
                style={{
                  left: `${left}%`,
                  width: ready ? `${width}%` : 0,
                  top: "18%", height: "64%",
                  backgroundColor: c,
                  opacity: hovered && !isHov ? 0.35 : 0.85,
                  outline: isHov ? `1.5px solid ${c}` : "none",
                  outlineOffset: 2,
                  transition: ready
                    ? "width 0.45s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.12s"
                    : "none",
                }}
                onMouseEnter={() => setHovered(task.id)}
                onMouseMove={(e) =>
                  setTooltip({
                    x: e.clientX, y: e.clientY,
                    content: (
                      <span>
                        <span className="font-semibold text-gray-900 dark:text-white mr-2">{task.label}</span>
                        <span className="text-slate-500 dark:text-slate-400">{task.start}–{task.end}</span>
                      </span>
                    ),
                  })
                }
                onMouseLeave={() => { setHovered(null); setTooltip(null) }}
              >
                <span className="text-xs font-medium text-gray-900 dark:text-white/90 truncate leading-none select-none">
                  {task.label}
                </span>
              </div>
            </div>
          )
        })}

        <div className="absolute bottom-0 left-0 right-0 flex border-t border-black/[0.07] dark:border-white/[0.07]" style={{ height: 28 }}>
          {(xLabels ?? Array.from({ length: total }, (_, i) => String(i + 1))).map((lbl, i) => (
            <div key={i} className="flex-1 flex items-center justify-center text-xs text-slate-600 dark:text-slate-400 truncate">
              {lbl}
            </div>
          ))}
        </div>
      </div>

      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}


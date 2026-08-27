"use client"

import { cn } from "@/lib/cn"
import { AnimatePresence, motion } from "framer-motion"
import { ReactNode, useState } from "react"

export interface TreeNode {
  id: string
  label: string
  icon?: ReactNode
  children?: TreeNode[]
  disabled?: boolean
}

export interface TreeProps {
  nodes: TreeNode[]
  selected?: string
  onSelect?: (id: string) => void
  defaultExpanded?: string[]
  className?: string
}

export function Tree({ nodes, selected, onSelect, defaultExpanded = [], className }: TreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded))

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={cn("select-none", className)}>
      <TreeNodes nodes={nodes} expanded={expanded} selected={selected} onToggle={toggle} onSelect={onSelect} depth={0} />
    </div>
  )
}

function TreeNodes({
  nodes,
  expanded,
  selected,
  onToggle,
  onSelect,
  depth,
}: {
  nodes: TreeNode[]
  expanded: Set<string>
  selected?: string
  onToggle: (id: string) => void
  onSelect?: (id: string) => void
  depth: number
}) {
  return (
    <ul>
      {nodes.map((node) => {
        const isExpanded = expanded.has(node.id)
        const isSelected = selected === node.id
        const hasChildren = !!node.children?.length

        return (
          <li key={node.id}>
            <div
              style={{ paddingLeft: depth * 16 + 4 }}
              onClick={() => {
                if (node.disabled) return
                if (hasChildren) onToggle(node.id)
                onSelect?.(node.id)
              }}
              className={cn(
                "flex items-center gap-1.5 h-8 pr-2 rounded-lg cursor-pointer transition-colors group",
                isSelected
                  ? "bg-accent-500/10 text-accent-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-black/6 dark:hover:bg-white/6",
                node.disabled && "opacity-40 cursor-not-allowed",
              )}
            >
              {hasChildren ? (
                <motion.span
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="shrink-0 w-4 flex items-center justify-center text-slate-500"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </motion.span>
              ) : (
                <span className="w-4 shrink-0" />
              )}
              {node.icon && (
                <span className={cn("shrink-0 w-4 h-4 flex items-center justify-center", isSelected ? "text-accent-400" : "text-slate-500")}>
                  {node.icon}
                </span>
              )}
              <span className="flex-1 min-w-0 text-sm truncate">{node.label}</span>
            </div>
            <AnimatePresence initial={false}>
              {hasChildren && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <TreeNodes
                    nodes={node.children!}
                    expanded={expanded}
                    selected={selected}
                    onToggle={onToggle}
                    onSelect={onSelect}
                    depth={depth + 1}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}

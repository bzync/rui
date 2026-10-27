"use client"

import { cn } from "@/lib/cn"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { useControllableState } from "@/hooks/use-controllable-state"
import { ReactNode } from "react"

export interface TreeNode {
  id: string
  label: string
  icon?: ReactNode
  children?: TreeNode[]
  disabled?: boolean
}

export interface TreeProps {
  nodes: TreeNode[]
  /** Controlled selected node ID. */
  selected?: string
  /** Initially selected node ID when uncontrolled. */
  defaultSelected?: string
  onSelect?: (id: string) => void
  /** Controlled expanded node IDs. */
  expanded?: string[]
  /** Initially expanded node IDs when uncontrolled. */
  defaultExpanded?: string[]
  /** Called with the next expanded node IDs. */
  onExpandedChange?: (expanded: string[]) => void
  className?: string
}

const NO_IDS: string[] = []

export function Tree({
  nodes,
  selected: controlledSelected,
  defaultSelected,
  onSelect,
  expanded: controlledExpanded,
  defaultExpanded = NO_IDS,
  onExpandedChange,
  className,
}: TreeProps) {
  const [selected, setSelected] = useControllableState<string | undefined>({ value: controlledSelected, defaultValue: defaultSelected, onChange: (id) => id && onSelect?.(id) })
  const [expandedIds, setExpandedIds] = useControllableState({ value: controlledExpanded, defaultValue: defaultExpanded, onChange: onExpandedChange })
  const expanded = new Set(expandedIds)

  function toggle(id: string) {
    setExpandedIds(expanded.has(id) ? expandedIds.filter((expandedId) => expandedId !== id) : [...expandedIds, id])
  }

  return (
    <div className={cn("select-none", className)}>
      <TreeNodes nodes={nodes} expanded={expanded} selected={selected} onToggle={toggle} onSelect={setSelected} depth={0} />
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
                  : "text-foreground/80 hover:bg-foreground/6",
                node.disabled && "opacity-40 cursor-not-allowed",
              )}
            >
              {hasChildren ? (
                <motion.span
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="shrink-0 w-4 flex items-center justify-center text-muted-foreground"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </motion.span>
              ) : (
                <span className="w-4 shrink-0" />
              )}
              {node.icon && (
                <span className={cn("shrink-0 w-4 h-4 flex items-center justify-center", isSelected ? "text-accent-400" : "text-muted-foreground")}>
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

"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { useControllableState } from "@/hooks/use-controllable-state"
import { HTMLAttributes, ReactNode, Ref, forwardRef } from "react"

export interface TreeNode {
  id: string
  label: string
  icon?: ReactNode
  children?: TreeNode[]
  disabled?: boolean
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, "onSelect"> {
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
  /** Disables every node. */
  disabled?: boolean
  className?: string
  /** Styles each node row. */
  nodeClassName?: string
}

const NO_IDS: string[] = []

export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree({
  nodes,
  selected: controlledSelected,
  defaultSelected,
  onSelect,
  expanded: controlledExpanded,
  defaultExpanded = NO_IDS,
  onExpandedChange,
  disabled = false,
  className,
  nodeClassName,
  ...props
}, ref) {
  const markDisabled = (list: TreeNode[]): TreeNode[] => list.map((node) => ({ ...node, disabled: true, children: node.children && markDisabled(node.children) }))
  const treeNodes = disabled ? markDisabled(nodes) : nodes
  const [selected, setSelected] = useControllableState<string | undefined>({ value: controlledSelected, defaultValue: defaultSelected, onChange: (id) => id && onSelect?.(id) })
  const [expandedIds, setExpandedIds] = useControllableState({ value: controlledExpanded, defaultValue: defaultExpanded, onChange: onExpandedChange })
  const expanded = new Set(expandedIds)

  function toggle(id: string) {
    setExpandedIds(expanded.has(id) ? expandedIds.filter((expandedId) => expandedId !== id) : [...expandedIds, id])
  }

  // Roving tabindex: one tab stop — the selected node when it is visible
  // (not inside a collapsed parent), else the first enabled node.
  const visible: string[] = []
  const walk = (list: TreeNode[]) => list.forEach((node) => {
    if (!node.disabled) visible.push(node.id)
    if (node.children && expanded.has(node.id)) walk(node.children)
  })
  walk(treeNodes)
  const tabStop = selected && visible.includes(selected) ? selected : visible[0]

  return (
    <TreeNodes
      treeRef={ref}
      nodes={treeNodes}
      expanded={expanded}
      selected={selected}
      tabStop={tabStop}
      onToggle={toggle}
      onSelect={setSelected}
      nodeClassName={nodeClassName}
      depth={0}
      className={cn("select-none", className)}
      treeProps={props}
    />
  )
})
Tree.displayName = "Tree"

/** Moves focus between the visible tree items (WAI-ARIA tree pattern). */
function focusSibling(from: HTMLElement, key: "next" | "prev" | "first" | "last") {
  const items = Array.from(from.closest('[role="tree"]')?.querySelectorAll<HTMLElement>('[role="treeitem"]:not([aria-disabled="true"])') ?? [])
  const index = items.indexOf(from)
  const target = key === "first" ? items[0] : key === "last" ? items[items.length - 1] : items[index + (key === "next" ? 1 : -1)]
  target?.focus()
}

function TreeNodes({
  treeRef,
  nodes,
  expanded,
  selected,
  tabStop,
  nodeClassName,
  onToggle,
  onSelect,
  depth,
  className,
  treeProps,
}: {
  treeRef?: Ref<HTMLUListElement>
  nodes: TreeNode[]
  expanded: Set<string>
  selected?: string
  tabStop?: string
  nodeClassName?: string
  onToggle: (id: string) => void
  onSelect?: (id: string) => void
  depth: number
  className?: string
  treeProps?: HTMLAttributes<HTMLUListElement>
}) {
  return (
    <ul
      ref={depth === 0 ? treeRef : undefined}
      role={depth === 0 ? "tree" : "group"}
      aria-label={depth === 0 ? (treeProps?.["aria-label"] ?? (treeProps?.["aria-labelledby"] ? undefined : "Tree")) : undefined}
      className={depth === 0 ? className : undefined}
      {...(depth === 0 ? treeProps : undefined)}
    >
      {nodes.map((node) => {
        const isExpanded = expanded.has(node.id)
        const isSelected = selected === node.id
        const hasChildren = !!node.children?.length
        const activate = () => {
          if (node.disabled) return
          if (hasChildren) onToggle(node.id)
          onSelect?.(node.id)
        }

        return (
          <li key={node.id} role="none">
            <div
              role="treeitem"
              aria-level={depth + 1}
              aria-selected={isSelected}
              aria-expanded={hasChildren ? isExpanded : undefined}
              aria-disabled={node.disabled || undefined}
              tabIndex={node.id === tabStop ? 0 : -1}
              style={{ paddingLeft: depth * 16 + 4 }}
              onClick={activate}
              onKeyDown={(event) => {
                const keys: Record<string, () => void> = {
                  Enter: activate,
                  " ": activate,
                  ArrowDown: () => focusSibling(event.currentTarget, "next"),
                  ArrowUp: () => focusSibling(event.currentTarget, "prev"),
                  Home: () => focusSibling(event.currentTarget, "first"),
                  End: () => focusSibling(event.currentTarget, "last"),
                  ArrowRight: () => {
                    if (hasChildren && !isExpanded) onToggle(node.id)
                    else if (hasChildren) focusSibling(event.currentTarget, "next")
                  },
                  ArrowLeft: () => {
                    if (hasChildren && isExpanded) {
                      onToggle(node.id)
                    } else {
                      const parentItem = (
                        event.currentTarget.parentElement?.closest('[role="treeitem"]') ??
                        event.currentTarget.closest('[role="group"]')?.closest("li")?.querySelector('[role="treeitem"]')
                      ) as HTMLElement | null
                      parentItem?.focus()
                    }
                  },
                }
                const action = keys[event.key]
                if (!action) return
                event.preventDefault()
                action()
              }}
              className={cn(
                "flex items-center gap-1.5 h-8 pr-2 rounded-lg cursor-pointer transition-colors group",
                focusRingStyles,
                isSelected
                  ? "bg-accent-500/10 text-accent-strong"
                  : "text-foreground/80 hover:bg-foreground/6",
                node.disabled && "opacity-40 cursor-not-allowed",
                nodeClassName,
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
                <span className={cn("shrink-0 w-4 h-4 flex items-center justify-center", isSelected ? "text-accent-strong" : "text-muted-foreground")}>
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
                    tabStop={tabStop}
                    nodeClassName={nodeClassName}
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

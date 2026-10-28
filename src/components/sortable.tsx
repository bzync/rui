"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { mergeRefs } from "@/lib/merge-refs"
import { useEventCallback } from "@/hooks/use-event-callback"
import {
  type ForwardedRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

/* ------------------------------------------------------------------ */
/* Shared drag engine                                                  */
/* ------------------------------------------------------------------ */

export interface SortableItem { id: string }

interface Group<T> { id: string; items: T[] }

interface Drag { id: string; mode: "pointer" | "keyboard"; snapshot: unknown }

type Messages = {
  pickedUp: (item: string, position: number, total: number, group: string) => string
  moved: (item: string, position: number, total: number, group: string) => string
  dropped: (item: string, position: number, total: number, group: string) => string
  cancelled: (item: string) => string
}

const defaultMessages: Messages = {
  pickedUp: (item, position, total, group) => `Picked up ${item}. Position ${position} of ${total}${group ? ` in ${group}` : ""}. Use the arrow keys to move, Space to drop, Escape to cancel.`,
  moved: (item, position, total, group) => `${item} moved to position ${position} of ${total}${group ? ` in ${group}` : ""}.`,
  dropped: (item, position, total, group) => `${item} dropped at position ${position} of ${total}${group ? ` in ${group}` : ""}.`,
  cancelled: (item) => `Reorder cancelled. ${item} returned to its original position.`,
}

function locate<T extends SortableItem>(groups: Group<T>[], id: string) {
  for (let g = 0; g < groups.length; g++) {
    const index = groups[g].items.findIndex((item) => item.id === id)
    if (index >= 0) return { g, index }
  }
  return null
}

function moveItem<T extends SortableItem>(groups: Group<T>[], id: string, toGroup: number, toIndex: number): Group<T>[] {
  const from = locate(groups, id)
  if (!from) return groups
  const item = groups[from.g].items[from.index]
  const next = groups.map((group) => ({ ...group, items: group.items.filter((entry) => entry.id !== id) }))
  const target = Math.max(0, Math.min(toIndex, next[toGroup].items.length))
  next[toGroup].items.splice(target, 0, item)
  return next
}

const sameOrder = <T extends SortableItem>(a: Group<T>[], b: Group<T>[]) =>
  a.length === b.length && a.every((group, g) => group.items.length === b[g].items.length && group.items.every((item, i) => item.id === b[g].items[i].id))

/**
 * Pointer + keyboard reordering across one or more groups. Pointer drags
 * reorder live as the pointer crosses an item's midpoint; the keyboard flow
 * follows the "pick up, move, drop" pattern with live announcements.
 */
function useSortableGroups<T extends SortableItem>({
  groups,
  onCommit,
  orientation,
  getLabel,
  groupLabel,
  messages,
}: {
  groups: Group<T>[]
  onCommit: (groups: Group<T>[], moved: { id: string; from: { g: number; index: number }; to: { g: number; index: number } }) => void
  orientation: "vertical" | "horizontal"
  getLabel: (item: T) => string
  groupLabel: (g: number) => string
  messages: Messages
}) {
  const [drag, setDrag] = useState<Drag | null>(null)
  const [preview, setPreview] = useState<Group<T>[] | null>(null)
  const [announcement, setAnnouncement] = useState("")
  const handles = useRef(new Map<string, HTMLElement>())
  const rootRef = useRef<HTMLElement | null>(null)
  const view = preview ?? groups
  const viewRef = useRef(view)
  viewRef.current = view

  const describe = (state: Group<T>[], id: string) => {
    const at = locate(state, id)!
    return [at.index + 1, state[at.g].items.length, groupLabel(at.g)] as const
  }
  const labelOf = (id: string) => {
    const at = locate(viewRef.current, id)
    return at ? getLabel(viewRef.current[at.g].items[at.index]) : id
  }

  const finish = useEventCallback((commit: boolean) => {
    if (!drag) return
    const original = drag.snapshot as Group<T>[]
    const final = viewRef.current
    setDrag(null)
    setPreview(null)
    if (commit && !sameOrder(original, final)) {
      const from = locate(original, drag.id)!
      const to = locate(final, drag.id)!
      onCommit(final, { id: drag.id, from, to })
    }
    if (drag.mode === "keyboard") {
      setAnnouncement(commit ? messages.dropped(labelOf(drag.id), ...describe(final, drag.id)) : messages.cancelled(labelOf(drag.id)))
    }
  })

  // Moving a focused node in the DOM blurs it; keep focus on the moved handle.
  useEffect(() => {
    if (drag?.mode === "keyboard") handles.current.get(drag.id)?.focus()
  }, [view, drag])

  const startPointer = (event: ReactPointerEvent<HTMLElement>, id: string) => {
    if (event.button !== 0 || drag) return
    event.preventDefault()
    const startX = event.clientX
    const startY = event.clientY
    let started = false
    const snapshot = groups

    const onMove = (move: PointerEvent) => {
      if (!started) {
        if (Math.hypot(move.clientX - startX, move.clientY - startY) < 4) return
        started = true
        setDrag({ id, mode: "pointer", snapshot })
        setPreview(snapshot)
        document.body.style.cursor = "grabbing"
      }
      const under = document.elementFromPoint(move.clientX, move.clientY)
      const root = rootRef.current
      if (!under || !root?.contains(under)) return
      const current = viewRef.current
      const itemEl = under.closest<HTMLElement>("[data-sortable-id]")
      const groupEl = under.closest<HTMLElement>("[data-sortable-group]")
      if (itemEl && itemEl.dataset.sortableId !== id) {
        const target = locate(current, itemEl.dataset.sortableId!)
        if (!target) return
        const rect = itemEl.getBoundingClientRect()
        const after = orientation === "vertical" ? move.clientY > rect.top + rect.height / 2 : move.clientX > rect.left + rect.width / 2
        const from = locate(current, id)!
        let index = target.index + (after ? 1 : 0)
        if (from.g === target.g && from.index < index) index -= 1
        if (from.g === target.g && from.index === index) return
        setPreview(moveItem(current, id, target.g, index))
      } else if (!itemEl && groupEl) {
        const g = Number(groupEl.dataset.sortableGroup)
        const from = locate(current, id)!
        if (from.g !== g) setPreview(moveItem(current, id, g, current[g].items.length))
      }
    }
    const onUp = () => {
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerup", onUp)
      document.removeEventListener("pointercancel", onCancel)
      document.body.style.cursor = ""
      if (started) finish(true)
    }
    const onCancel = () => { onUp(); finish(false) }
    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerup", onUp)
    document.addEventListener("pointercancel", onCancel)
  }

  const onHandleKeyDown = (event: ReactKeyboardEvent<HTMLElement>, id: string) => {
    const active = drag?.id === id && drag.mode === "keyboard"
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      if (active) finish(true)
      else if (!drag) {
        setDrag({ id, mode: "keyboard", snapshot: groups })
        setPreview(groups)
        setAnnouncement(messages.pickedUp(labelOf(id), ...describe(groups, id)))
      }
      return
    }
    if (!active) return
    if (event.key === "Escape") { event.preventDefault(); finish(false); return }
    if (event.key === "Tab") { finish(true); return }
    const current = viewRef.current
    const at = locate(current, id)!
    const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft"
    const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight"
    const crossPrev = orientation === "vertical" ? "ArrowLeft" : "ArrowUp"
    const crossNext = orientation === "vertical" ? "ArrowRight" : "ArrowDown"
    let next: Group<T>[] | null = null
    if (event.key === prevKey && at.index > 0) next = moveItem(current, id, at.g, at.index - 1)
    else if (event.key === nextKey && at.index < current[at.g].items.length - 1) next = moveItem(current, id, at.g, at.index + 1)
    else if (event.key === "Home") next = moveItem(current, id, at.g, 0)
    else if (event.key === "End") next = moveItem(current, id, at.g, current[at.g].items.length)
    else if (event.key === crossPrev && at.g > 0) next = moveItem(current, id, at.g - 1, at.index)
    else if (event.key === crossNext && at.g < current.length - 1) next = moveItem(current, id, at.g + 1, at.index)
    else if (![prevKey, nextKey, crossPrev, crossNext].includes(event.key)) return
    event.preventDefault()
    if (next && !sameOrder(next, current)) {
      setPreview(next)
      setAnnouncement(messages.moved(labelOf(id), ...describe(next, id)))
    }
  }

  return { view, drag, announcement, handles, rootRef, startPointer, onHandleKeyDown }
}

const Grip = () => (
  <svg aria-hidden="true" width="12" height="16" viewBox="0 0 12 16" fill="currentColor"><circle cx="3.5" cy="3" r="1.3" /><circle cx="8.5" cy="3" r="1.3" /><circle cx="3.5" cy="8" r="1.3" /><circle cx="8.5" cy="8" r="1.3" /><circle cx="3.5" cy="13" r="1.3" /><circle cx="8.5" cy="13" r="1.3" /></svg>
)

interface HandleProps {
  id: string
  label: string
  instructionsId: string
  engine: ReturnType<typeof useSortableGroups<SortableItem>>
  className?: string
}

function DragHandle({ id, label, instructionsId, engine, className }: HandleProps) {
  const grabbed = engine.drag?.id === id
  return (
    <button
      type="button"
      ref={(node) => { if (node) engine.handles.current.set(id, node); else engine.handles.current.delete(id) }}
      aria-label={`Reorder ${label}`}
      aria-describedby={instructionsId}
      aria-pressed={grabbed && engine.drag?.mode === "keyboard"}
      aria-roledescription="sortable handle"
      onPointerDown={(event) => engine.startPointer(event, id)}
      onKeyDown={(event) => engine.onHandleKeyDown(event, id)}
      className={cn("grid h-8 w-6 shrink-0 cursor-grab touch-none place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground active:cursor-grabbing", focusRingStyles, className)}
    >
      <Grip />
    </button>
  )
}

const INSTRUCTIONS = "Press Space or Enter to pick up. While holding, use the arrow keys to move, Space or Enter to drop, and Escape to cancel."

/* ------------------------------------------------------------------ */
/* SortableList                                                        */
/* ------------------------------------------------------------------ */

export interface SortableListProps<T extends SortableItem> {
  items: T[]
  onReorder: (items: T[], move: { id: string; from: number; to: number }) => void
  renderItem: (item: T, state: { dragging: boolean }) => ReactNode
  /** Text used in handle labels and announcements. Default: the item id. */
  getLabel?: (item: T) => string
  orientation?: "vertical" | "horizontal"
  /** Lets the whole item start a pointer drag, not just the grip. */
  dragFromItem?: boolean
  ariaLabel?: string
  className?: string
  itemClassName?: string
  handleClassName?: string
  instructions?: string
  messages?: Partial<Messages>
}

/**
 * Reorderable list. Drag the grip (or the whole item with `dragFromItem`);
 * from the keyboard, focus a grip, press Space to pick the item up, move it
 * with the arrow keys and press Space again to drop (Escape cancels). Every
 * step is announced to screen readers.
 */
function SortableListInner<T extends SortableItem>(
  {
    items,
    onReorder,
    renderItem,
    getLabel = (item) => item.id,
    orientation = "vertical",
    dragFromItem = false,
    ariaLabel = "Sortable list",
    className,
    itemClassName,
    handleClassName,
    instructions = INSTRUCTIONS,
    messages,
  }: SortableListProps<T>,
  ref: ForwardedRef<HTMLUListElement>,
) {
  const instructionsId = useId()
  const engine = useSortableGroups<T>({
    groups: [{ id: "list", items }],
    onCommit: (groups, move) => onReorder(groups[0].items, { id: move.id, from: move.from.index, to: move.to.index }),
    orientation,
    getLabel,
    groupLabel: () => "",
    messages: { ...defaultMessages, ...messages },
  })
  const list = engine.view[0].items

  return (
    <div className={cn("w-full", className)}>
      <ul
        ref={mergeRefs((node: HTMLUListElement | null) => { engine.rootRef.current = node }, ref)}
        aria-label={ariaLabel}
        data-sortable-group="0"
        className={cn("flex gap-2", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap")}
      >
        {list.map((item) => {
          const dragging = engine.drag?.id === item.id
          return (
            <li
              key={item.id}
              data-sortable-id={item.id}
              data-dragging={dragging || undefined}
              onPointerDown={dragFromItem ? (event) => { if (!(event.target as HTMLElement).closest("button, a, input, textarea, select")) engine.startPointer(event, item.id) } : undefined}
              className={cn(
                "flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface p-2 text-sm text-foreground transition-shadow",
                dragFromItem && "cursor-grab touch-none select-none",
                dragging && "z-10 border-accent-500/60 shadow-floating ring-2 ring-accent-500/30",
                itemClassName,
              )}
            >
              <DragHandle id={item.id} label={getLabel(item)} instructionsId={instructionsId} engine={engine as never} className={handleClassName} />
              <div className="min-w-0 flex-1">{renderItem(item, { dragging })}</div>
            </li>
          )
        })}
      </ul>
      <p id={instructionsId} hidden>{instructions}</p>
      <p className="sr-only" aria-live="assertive">{engine.announcement}</p>
    </div>
  )
}

export const SortableList = forwardRef(SortableListInner) as (<T extends SortableItem>(
  props: SortableListProps<T> & { ref?: Ref<HTMLUListElement> },
) => ReactElement | null) & { displayName?: string }
SortableList.displayName = "SortableList"

/* ------------------------------------------------------------------ */
/* Kanban                                                              */
/* ------------------------------------------------------------------ */

export interface KanbanColumn<T extends SortableItem> {
  id: string
  title: string
  items: T[]
  /** Optional work-in-progress limit, shown next to the count. */
  limit?: number
}

export interface KanbanProps<T extends SortableItem> {
  columns: KanbanColumn<T>[]
  onChange: (columns: KanbanColumn<T>[], move: { id: string; fromColumn: string; toColumn: string; fromIndex: number; toIndex: number }) => void
  renderCard: (item: T, state: { dragging: boolean; column: KanbanColumn<T> }) => ReactNode
  getLabel?: (item: T) => string
  /** Content under each column's cards, e.g. an "Add card" button. */
  renderColumnFooter?: (column: KanbanColumn<T>) => ReactNode
  /** Shown in empty columns. Default "Drop cards here". */
  emptyLabel?: ReactNode
  ariaLabel?: string
  className?: string
  columnClassName?: string
  cardClassName?: string
  instructions?: string
  messages?: Partial<Messages>
}

/**
 * Kanban board. Drag a card's grip within or between columns; from the
 * keyboard pick it up with Space, use Up/Down to reorder and Left/Right to
 * move between columns, then Space to drop. Columns scroll horizontally on
 * small screens.
 */
function KanbanInner<T extends SortableItem>(
  {
    columns,
    onChange,
    renderCard,
    getLabel = (item) => item.id,
    renderColumnFooter,
    emptyLabel = "Drop cards here",
    ariaLabel = "Board",
    className,
    columnClassName,
    cardClassName,
    instructions = INSTRUCTIONS.replace("use the arrow keys to move", "use Up and Down to reorder, Left and Right to change column"),
    messages,
  }: KanbanProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const instructionsId = useId()
  const engine = useSortableGroups<T>({
    groups: columns.map((column) => ({ id: column.id, items: column.items })),
    onCommit: (groups, move) => onChange(
      columns.map((column, g) => ({ ...column, items: groups[g].items })),
      { id: move.id, fromColumn: columns[move.from.g].id, toColumn: columns[move.to.g].id, fromIndex: move.from.index, toIndex: move.to.index },
    ),
    orientation: "vertical",
    getLabel,
    groupLabel: (g) => columns[g]?.title ?? "",
    messages: { ...defaultMessages, ...messages },
  })

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div
        ref={(node) => { engine.rootRef.current = node }}
        role="group"
        aria-label={ariaLabel}
        className="flex w-full snap-x gap-3 overflow-x-auto pb-2"
      >
        {columns.map((column, g) => {
          const items = engine.view[g].items
          const over = column.limit !== undefined && items.length > column.limit
          return (
            <section
              key={column.id}
              aria-labelledby={`${instructionsId}-col-${column.id}`}
              className={cn("flex w-72 min-w-[16rem] shrink-0 snap-start flex-col rounded-[var(--radius-lg)] border border-border bg-surface-muted/60", columnClassName)}
            >
              <header className="flex items-center gap-2 px-3 pb-2 pt-3">
                <h3 id={`${instructionsId}-col-${column.id}`} className="text-sm font-semibold text-foreground">{column.title}</h3>
                <span className={cn("rounded-full px-1.5 text-xs tabular-nums", over ? "bg-danger/10 text-danger-strong" : "bg-foreground/6 text-muted-foreground")}>
                  {items.length}{column.limit !== undefined ? ` / ${column.limit}` : ""}
                  {over && <span className="sr-only"> (over limit)</span>}
                </span>
              </header>
              <ul data-sortable-group={g} aria-label={`${column.title} cards`} className="flex min-h-24 flex-1 flex-col gap-2 px-2 pb-2">
                {items.map((item) => {
                  const dragging = engine.drag?.id === item.id
                  return (
                    <li
                      key={item.id}
                      data-sortable-id={item.id}
                      data-dragging={dragging || undefined}
                      className={cn(
                        "flex gap-1.5 rounded-[var(--radius-md)] border border-border bg-surface p-2 text-sm shadow-sm transition-shadow",
                        dragging && "border-accent-500/60 shadow-floating ring-2 ring-accent-500/30",
                        cardClassName,
                      )}
                    >
                      <DragHandle id={item.id} label={getLabel(item)} instructionsId={instructionsId} engine={engine as never} className="h-7 w-5" />
                      <div className="min-w-0 flex-1">{renderCard(item, { dragging, column })}</div>
                    </li>
                  )
                })}
                {!items.length && (
                  <li aria-hidden="true" className="grid flex-1 place-items-center rounded-[var(--radius-md)] border border-dashed border-border-strong p-4 text-xs text-muted-foreground">{emptyLabel}</li>
                )}
              </ul>
              {renderColumnFooter && <div className="px-2 pb-2">{renderColumnFooter(column)}</div>}
            </section>
          )
        })}
      </div>
      <p id={instructionsId} hidden>{instructions}</p>
      <p className="sr-only" aria-live="assertive">{engine.announcement}</p>
    </div>
  )
}

export const Kanban = forwardRef(KanbanInner) as (<T extends SortableItem>(
  props: KanbanProps<T> & { ref?: Ref<HTMLDivElement> },
) => ReactElement | null) & { displayName?: string }
Kanban.displayName = "Kanban"

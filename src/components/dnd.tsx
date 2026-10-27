"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import {
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface DragEndEvent {
  activeId: string
  overId: string | null
  sourceDroppableId: string | null
  targetDroppableId: string | null
  data?: unknown
}

export interface DragStartEvent {
  activeId: string
  sourceDroppableId: string | null
  data?: unknown
}

export interface DndContextValue {
  activeId: string | null
  activeData: unknown
  activeSourceDroppableId: string | null
  overId: string | null
  overDroppableId: string | null
  registerDroppable: (id: string, element: HTMLElement, data?: unknown) => void
  unregisterDroppable: (id: string) => void
  registerDraggable: (id: string, droppableId: string | null, element: HTMLElement, data?: unknown) => void
  unregisterDraggable: (id: string) => void
  startDrag: (id: string, mode: "pointer" | "keyboard", event?: ReactPointerEvent | ReactKeyboardEvent) => void
  cancelDrag: () => void
  endDrag: () => void
  isDragging: (id: string) => boolean
  isOverDroppable: (id: string) => boolean
}

const DndContextInternal = createContext<DndContextValue | null>(null)

export function useDnd(): DndContextValue {
  const ctx = useContext(DndContextInternal)
  if (!ctx) {
    throw new Error("useDnd, Droppable, and Draggable must be used within a <DndContext>")
  }
  return ctx
}

/* ------------------------------------------------------------------ */
/* DndContext Component                                               */
/* ------------------------------------------------------------------ */

export interface DndContextProps {
  children: ReactNode
  onDragStart?: (event: DragStartEvent) => void
  onDragEnd?: (event: DragEndEvent) => void
  onDragCancel?: (activeId: string) => void
  /** Accessible announcements for screen readers */
  messages?: {
    pickedUp?: (id: string, droppableId?: string | null) => string
    moved?: (id: string, overDroppableId?: string | null) => string
    dropped?: (id: string, targetDroppableId?: string | null) => string
    cancelled?: (id: string) => string
  }
}

export function DndContext({
  children,
  onDragStart,
  onDragEnd,
  onDragCancel,
  messages,
}: DndContextProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeMode, setActiveMode] = useState<"pointer" | "keyboard" | null>(null)
  const [overDroppableId, setOverDroppableId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const droppablesRef = useRef<Map<string, { element: HTMLElement; data?: unknown }>>(new Map())
  const draggablesRef = useRef<Map<string, { droppableId: string | null; element: HTMLElement; data?: unknown }>>(new Map())

  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId
  const overDroppableIdRef = useRef(overDroppableId)
  overDroppableIdRef.current = overDroppableId
  const overIdRef = useRef(overId)
  overIdRef.current = overId

  const activeData = activeId ? draggablesRef.current.get(activeId)?.data : undefined
  const activeSourceDroppableId = activeId ? (draggablesRef.current.get(activeId)?.droppableId ?? null) : null

  const defaultMessages = useMemo(() => ({
    pickedUp: (id: string, dropId?: string | null) =>
      `Picked up item ${id}${dropId ? ` from container ${dropId}` : ""}. Use arrow keys to move, Space or Enter to drop, Escape to cancel.`,
    moved: (id: string, dropId?: string | null) =>
      `Moved item ${id}${dropId ? ` over container ${dropId}` : ""}.`,
    dropped: (id: string, dropId?: string | null) =>
      `Dropped item ${id}${dropId ? ` into container ${dropId}` : ""}.`,
    cancelled: (id: string) => `Cancelled drag. Item ${id} returned to its original position.`,
  }), [])

  const msg = { ...defaultMessages, ...messages }

  const registerDroppable = useCallback((id: string, element: HTMLElement, data?: unknown) => {
    droppablesRef.current.set(id, { element, data })
  }, [])

  const unregisterDroppable = useCallback((id: string) => {
    droppablesRef.current.delete(id)
  }, [])

  const registerDraggable = useCallback((id: string, droppableId: string | null, element: HTMLElement, data?: unknown) => {
    draggablesRef.current.set(id, { droppableId, element, data })
  }, [])

  const unregisterDraggable = useCallback((id: string) => {
    draggablesRef.current.delete(id)
  }, [])

  const startDrag = useCallback((id: string, mode: "pointer" | "keyboard", event?: ReactPointerEvent | ReactKeyboardEvent) => {
    const draggable = draggablesRef.current.get(id)
    if (!draggable) return

    setActiveId(id)
    setActiveMode(mode)
    setOverDroppableId(draggable.droppableId)
    setOverId(id)
    activeIdRef.current = id
    overDroppableIdRef.current = draggable.droppableId
    overIdRef.current = id

    onDragStart?.({
      activeId: id,
      sourceDroppableId: draggable.droppableId,
      data: draggable.data,
    })

    setAnnouncement(msg.pickedUp(id, draggable.droppableId))

    if (mode === "pointer" && event && "pointerId" in event) {
      const handlePointerMove = (e: PointerEvent) => {
        const clientX = e.clientX
        const clientY = e.clientY

        // Find which droppable container we are over
        let foundDroppableId: string | null = null
        for (const [dropId, { element }] of droppablesRef.current.entries()) {
          const rect = element.getBoundingClientRect()
          if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
            foundDroppableId = dropId
            break
          }
        }

        // Find which draggable we are directly hovering
        let foundDraggableId: string | null = null
        for (const [dragId, { element }] of draggablesRef.current.entries()) {
          if (dragId === activeIdRef.current) continue
          const rect = element.getBoundingClientRect()
          if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
            foundDraggableId = dragId
            break
          }
        }

        if (foundDroppableId !== overDroppableIdRef.current || foundDraggableId !== overIdRef.current) {
          setOverDroppableId(foundDroppableId)
          setOverId(foundDraggableId)
          if (foundDroppableId && foundDroppableId !== overDroppableIdRef.current) {
            setAnnouncement(msg.moved(id, foundDroppableId))
          }
        }
      }

      const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)
        window.removeEventListener("pointercancel", handlePointerCancel)

        const currentActiveId = activeIdRef.current
        const targetDroppable = overDroppableIdRef.current
        const targetOverId = overIdRef.current
        const itemData = currentActiveId ? draggablesRef.current.get(currentActiveId)?.data : undefined
        const sourceDrop = currentActiveId ? draggablesRef.current.get(currentActiveId)?.droppableId ?? null : null

        setActiveId(null)
        setActiveMode(null)
        setOverDroppableId(null)
        setOverId(null)

        if (currentActiveId) {
          setAnnouncement(msg.dropped(currentActiveId, targetDroppable))
          onDragEnd?.({
            activeId: currentActiveId,
            overId: targetOverId,
            sourceDroppableId: sourceDrop,
            targetDroppableId: targetDroppable,
            data: itemData,
          })
        }
      }

      const handlePointerCancel = () => {
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)
        window.removeEventListener("pointercancel", handlePointerCancel)

        const currentActiveId = activeIdRef.current
        setActiveId(null)
        setActiveMode(null)
        setOverDroppableId(null)
        setOverId(null)

        if (currentActiveId) {
          setAnnouncement(msg.cancelled(currentActiveId))
          onDragCancel?.(currentActiveId)
        }
      }

      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
      window.addEventListener("pointercancel", handlePointerCancel)
    }
  }, [msg, onDragCancel, onDragEnd, onDragStart])

  const cancelDrag = useCallback(() => {
    if (!activeId) return
    const id = activeId
    setActiveId(null)
    setActiveMode(null)
    setOverDroppableId(null)
    setOverId(null)
    setAnnouncement(msg.cancelled(id))
    onDragCancel?.(id)
  }, [activeId, msg, onDragCancel])

  const endDrag = useCallback(() => {
    const currentActiveId = activeIdRef.current
    if (!currentActiveId) return
    const id = currentActiveId
    const targetDroppable = overDroppableIdRef.current
    const targetOverId = overIdRef.current
    const itemData = currentActiveId ? draggablesRef.current.get(currentActiveId)?.data : undefined
    const sourceDrop = currentActiveId ? draggablesRef.current.get(currentActiveId)?.droppableId ?? null : null

    setActiveId(null)
    setActiveMode(null)
    setOverDroppableId(null)
    setOverId(null)
    setAnnouncement(msg.dropped(id, targetDroppable))

    onDragEnd?.({
      activeId: id,
      overId: targetOverId,
      sourceDroppableId: sourceDrop,
      targetDroppableId: targetDroppable,
      data: itemData,
    })
  }, [msg, onDragEnd])

  // Global keyboard listener during active keyboard drag
  useEffect(() => {
    if (!activeId || activeMode !== "keyboard") return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        cancelDrag()
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        endDrag()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault()
        // Cycle droppable containers
        const droppableKeys = Array.from(droppablesRef.current.keys())
        if (droppableKeys.length > 1) {
          const currentIndex = droppableKeys.indexOf(overDroppableIdRef.current ?? "")
          const nextIndex = e.key === "ArrowRight"
            ? (currentIndex + 1) % droppableKeys.length
            : (currentIndex - 1 + droppableKeys.length) % droppableKeys.length
          const nextDroppableId = droppableKeys[nextIndex]
          setOverDroppableId(nextDroppableId)
          overDroppableIdRef.current = nextDroppableId
          setAnnouncement(msg.moved(activeId, nextDroppableId))
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeId, activeMode, cancelDrag, endDrag, msg])

  const isDragging = useCallback((id: string) => activeId === id, [activeId])
  const isOverDroppable = useCallback((id: string) => overDroppableId === id, [overDroppableId])

  const value = useMemo<DndContextValue>(() => ({
    activeId,
    activeData,
    activeSourceDroppableId,
    overId,
    overDroppableId,
    registerDroppable,
    unregisterDroppable,
    registerDraggable,
    unregisterDraggable,
    startDrag,
    cancelDrag,
    endDrag,
    isDragging,
    isOverDroppable,
  }), [
    activeId,
    activeData,
    activeSourceDroppableId,
    overId,
    overDroppableId,
    registerDroppable,
    unregisterDroppable,
    registerDraggable,
    unregisterDraggable,
    startDrag,
    cancelDrag,
    endDrag,
    isDragging,
    isOverDroppable,
  ])

  return (
    <DndContextInternal.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="assertive" role="status">
        {announcement}
      </p>
    </DndContextInternal.Provider>
  )
}

/* ------------------------------------------------------------------ */
/* Droppable Component                                                */
/* ------------------------------------------------------------------ */

export interface DroppableRenderProps {
  isOver: boolean
  activeId: string | null
  setNodeRef: (node: HTMLElement | null) => void
}

export interface DroppableProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  id: string
  data?: unknown
  disabled?: boolean
  children: ReactNode | ((props: DroppableRenderProps) => ReactNode)
}

const DroppableContext = createContext<string | null>(null)

export const Droppable = forwardRef<HTMLDivElement, DroppableProps>(function Droppable(
  { id, data, disabled = false, children, className, ...props },
  ref,
) {
  const dnd = useDnd()
  const localRef = useRef<HTMLDivElement | null>(null)
  const isOver = !disabled && dnd.isOverDroppable(id)

  const setNodeRef = useCallback((node: HTMLElement | null) => {
    localRef.current = node as HTMLDivElement | null
    if (typeof ref === "function") ref(node as HTMLDivElement | null)
    else if (ref) (ref as { current: HTMLDivElement | null }).current = node as HTMLDivElement | null
  }, [ref])

  useEffect(() => {
    if (localRef.current && !disabled) {
      dnd.registerDroppable(id, localRef.current, data)
    }
    return () => {
      dnd.unregisterDroppable(id)
    }
  }, [data, disabled, dnd, id])

  const renderProps: DroppableRenderProps = {
    isOver,
    activeId: dnd.activeId,
    setNodeRef,
  }

  if (typeof children === "function") {
    return (
      <DroppableContext.Provider value={id}>
        {children(renderProps)}
      </DroppableContext.Provider>
    )
  }

  return (
    <DroppableContext.Provider value={id}>
      <div
        ref={setNodeRef}
        data-droppable-id={id}
        data-over={isOver || undefined}
        className={cn("transition-colors", isOver && "ring-2 ring-accent/30 bg-accent/4", className)}
        {...props}
      >
        {children}
      </div>
    </DroppableContext.Provider>
  )
})
Droppable.displayName = "Droppable"

/* ------------------------------------------------------------------ */
/* Draggable Component                                                */
/* ------------------------------------------------------------------ */

export interface DraggableRenderProps {
  isDragging: boolean
  setNodeRef: (node: HTMLElement | null) => void
  attributes: {
    role: string
    tabIndex: number
    "aria-roledescription": string
    "aria-grabbed": boolean
  }
  listeners: {
    onPointerDown: (e: ReactPointerEvent) => void
    onKeyDown: (e: ReactKeyboardEvent) => void
  }
}

export interface DraggableProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  id: string
  droppableId?: string
  data?: unknown
  disabled?: boolean
  /** When true, pointer down on the container starts drag; when false, use <DragHandle> */
  dragFromItem?: boolean
  children: ReactNode | ((props: DraggableRenderProps) => ReactNode)
}

export const Draggable = forwardRef<HTMLDivElement, DraggableProps>(function Draggable(
  { id, droppableId: explicitDroppableId, data, disabled = false, dragFromItem = true, children, className, ...props },
  ref,
) {
  const dnd = useDnd()
  const contextDroppableId = useContext(DroppableContext)
  const droppableId = explicitDroppableId ?? contextDroppableId
  const localRef = useRef<HTMLDivElement | null>(null)
  const isDragging = dnd.isDragging(id)

  const setNodeRef = useCallback((node: HTMLElement | null) => {
    localRef.current = node as HTMLDivElement | null
    if (typeof ref === "function") ref(node as HTMLDivElement | null)
    else if (ref) (ref as { current: HTMLDivElement | null }).current = node as HTMLDivElement | null
  }, [ref])

  useEffect(() => {
    if (localRef.current && !disabled) {
      dnd.registerDraggable(id, droppableId, localRef.current, data)
    }
    return () => {
      dnd.unregisterDraggable(id)
    }
  }, [data, disabled, dnd, droppableId, id])

  const handlePointerDown = (e: ReactPointerEvent) => {
    if (disabled || e.button !== 0) return
    const target = e.target as HTMLElement | null
    if (target?.closest("button, a, input, textarea, select")) return
    dnd.startDrag(id, "pointer", e)
  }

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (disabled) return
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      if (!isDragging) {
        dnd.startDrag(id, "keyboard", e)
      }
    }
  }

  const attributes = {
    role: "button",
    tabIndex: disabled ? -1 : 0,
    "aria-roledescription": "draggable item",
    "aria-grabbed": isDragging,
  }

  const listeners = {
    onPointerDown: handlePointerDown,
    onKeyDown: handleKeyDown,
  }

  const renderProps: DraggableRenderProps = {
    isDragging,
    setNodeRef,
    attributes,
    listeners,
  }

  if (typeof children === "function") {
    return <>{children(renderProps)}</>
  }

  return (
    <div
      ref={setNodeRef}
      data-draggable-id={id}
      data-dragging={isDragging || undefined}
      {...(dragFromItem ? attributes : {})}
      {...(dragFromItem ? listeners : {})}
      className={cn(
        "transition-all touch-none select-none",
        dragFromItem && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 scale-[1.02] shadow-lg ring-2 ring-accent z-20",
        focusRingStyles,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Draggable.displayName = "Draggable"

/* ------------------------------------------------------------------ */
/* DragHandle Component                                               */
/* ------------------------------------------------------------------ */

export interface DragHandleProps extends HTMLAttributes<HTMLButtonElement> {
  draggableId?: string
  label?: string
}

export const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(function DragHandle(
  { draggableId, label = "Reorder", className, ...props },
  ref,
) {
  const dnd = useDnd()
  const id = draggableId ?? ""
  const isDragging = dnd.isDragging(id)

  const handlePointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    dnd.startDrag(id, "pointer", e)
  }

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) {
        dnd.startDrag(id, "keyboard", e)
      }
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-roledescription="drag handle"
      aria-pressed={isDragging}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex h-7 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground active:cursor-grabbing",
        focusRingStyles,
        className,
      )}
      {...props}
    >
      <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
        <circle cx="3.5" cy="3" r="1.3" />
        <circle cx="8.5" cy="3" r="1.3" />
        <circle cx="3.5" cy="8" r="1.3" />
        <circle cx="8.5" cy="8" r="1.3" />
        <circle cx="3.5" cy="13" r="1.3" />
        <circle cx="8.5" cy="13" r="1.3" />
      </svg>
    </button>
  )
})
DragHandle.displayName = "DragHandle"

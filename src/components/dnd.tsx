"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { ThemePortal } from "./theme-provider"
import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
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

export interface DndTransform {
  x: number
  y: number
}

export interface DndCoordinates {
  x: number
  y: number
}

export interface DndContextValue {
  activeId: string | null
  activeData: unknown
  activeSourceDroppableId: string | null
  overId: string | null
  overDroppableId: string | null
  transform: DndTransform | null
  pointerPosition: DndCoordinates | null
  grabOffset: DndCoordinates | null
  hasDragOverlay: boolean
  setHasDragOverlay: (hasOverlay: boolean) => void
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

export const useDndContext = useDnd

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
  const [transform, setTransform] = useState<DndTransform | null>(null)
  const [pointerPosition, setPointerPosition] = useState<DndCoordinates | null>(null)
  const [grabOffset, setGrabOffset] = useState<DndCoordinates | null>(null)
  const [hasDragOverlay, setHasDragOverlay] = useState(false)

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
      const initialX = event.clientX
      const initialY = event.clientY
      const rect = draggable.element.getBoundingClientRect()
      const offsetX = initialX - rect.left
      const offsetY = initialY - rect.top

      setGrabOffset({ x: offsetX, y: offsetY })
      setPointerPosition({ x: initialX, y: initialY })
      setTransform({ x: 0, y: 0 })

      const handlePointerMove = (e: PointerEvent) => {
        const clientX = e.clientX
        const clientY = e.clientY

        setPointerPosition({ x: clientX, y: clientY })
        setTransform({ x: clientX - initialX, y: clientY - initialY })

        // Find which droppable container we are over
        let foundDroppableId: string | null = null
        for (const [dropId, { element }] of droppablesRef.current.entries()) {
          const dropRect = element.getBoundingClientRect()
          if (clientX >= dropRect.left && clientX <= dropRect.right && clientY >= dropRect.top && clientY <= dropRect.bottom) {
            foundDroppableId = dropId
            break
          }
        }

        // Find which draggable we are directly hovering
        let foundDraggableId: string | null = null
        for (const [dragId, { element }] of draggablesRef.current.entries()) {
          if (dragId === activeIdRef.current) continue
          const dragRect = element.getBoundingClientRect()
          if (clientX >= dragRect.left && clientX <= dragRect.right && clientY >= dragRect.top && clientY <= dragRect.bottom) {
            foundDraggableId = dragId
            break
          }
        }

        if (foundDroppableId !== overDroppableIdRef.current || foundDraggableId !== overIdRef.current) {
          if (foundDroppableId && foundDroppableId !== overDroppableIdRef.current) {
            setAnnouncement(msg.moved(id, foundDroppableId))
          }
          setOverDroppableId(foundDroppableId)
          setOverId(foundDraggableId)
          overDroppableIdRef.current = foundDroppableId
          overIdRef.current = foundDraggableId
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
        setTransform(null)
        setPointerPosition(null)
        setGrabOffset(null)

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
        setTransform(null)
        setPointerPosition(null)
        setGrabOffset(null)

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
    setTransform(null)
    setPointerPosition(null)
    setGrabOffset(null)
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
    setTransform(null)
    setPointerPosition(null)
    setGrabOffset(null)
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
    transform,
    pointerPosition,
    grabOffset,
    hasDragOverlay,
    setHasDragOverlay,
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
    transform,
    pointerPosition,
    grabOffset,
    hasDragOverlay,
    setHasDragOverlay,
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
/* Droppable Component & Hook                                         */
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

export function useDroppable({
  id,
  data,
  disabled = false,
}: {
  id: string
  data?: unknown
  disabled?: boolean
}) {
  const dnd = useDnd()
  const localRef = useRef<HTMLElement | null>(null)
  const isOver = !disabled && dnd.isOverDroppable(id)

  const setNodeRef = useCallback((node: HTMLElement | null) => {
    localRef.current = node
  }, [])

  useEffect(() => {
    if (localRef.current && !disabled) {
      dnd.registerDroppable(id, localRef.current, data)
    }
    return () => {
      dnd.unregisterDroppable(id)
    }
  }, [data, disabled, dnd, id])

  return {
    isOver,
    activeId: dnd.activeId,
    setNodeRef,
  }
}

export const Droppable = forwardRef<HTMLDivElement, DroppableProps>(function Droppable(
  { id, data, disabled = false, children, className, ...props },
  ref,
) {
  const { isOver, activeId, setNodeRef } = useDroppable({ id, data, disabled })

  const handleRef = useCallback((node: HTMLElement | null) => {
    setNodeRef(node)
    if (typeof ref === "function") ref(node as HTMLDivElement | null)
    else if (ref) (ref as { current: HTMLDivElement | null }).current = node as HTMLDivElement | null
  }, [ref, setNodeRef])

  const renderProps: DroppableRenderProps = {
    isOver,
    activeId,
    setNodeRef: handleRef,
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
        ref={handleRef}
        data-droppable-id={id}
        data-over={isOver || undefined}
        className={cn(
          "transition-colors duration-150",
          isOver && "ring-2 ring-accent border-accent/50 bg-accent/8",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </DroppableContext.Provider>
  )
})
Droppable.displayName = "Droppable"

/* ------------------------------------------------------------------ */
/* Draggable Component & Hook                                         */
/* ------------------------------------------------------------------ */

export interface DraggableRenderProps {
  isDragging: boolean
  transform: DndTransform | null
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

export function useDraggable({
  id,
  droppableId: explicitDroppableId,
  data,
  disabled = false,
}: {
  id: string
  droppableId?: string | null
  data?: unknown
  disabled?: boolean
}) {
  const dnd = useDnd()
  const contextDroppableId = useContext(DroppableContext)
  const droppableId = explicitDroppableId ?? contextDroppableId
  const localRef = useRef<HTMLElement | null>(null)
  const isDragging = dnd.isDragging(id)

  const setNodeRef = useCallback((node: HTMLElement | null) => {
    localRef.current = node
  }, [])

  useEffect(() => {
    if (localRef.current && !disabled) {
      dnd.registerDraggable(id, droppableId ?? null, localRef.current, data)
    }
    return () => {
      dnd.unregisterDraggable(id)
    }
  }, [data, disabled, dnd, droppableId, id])

  const handlePointerDown = useCallback((e: ReactPointerEvent) => {
    if (disabled || e.button !== 0) return
    const target = e.target as HTMLElement | null
    if (target?.closest("button, a, input, textarea, select")) return
    dnd.startDrag(id, "pointer", e)
  }, [disabled, dnd, id])

  const handleKeyDown = useCallback((e: ReactKeyboardEvent) => {
    if (disabled) return
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      if (!isDragging) {
        dnd.startDrag(id, "keyboard", e)
      }
    }
  }, [disabled, dnd, id, isDragging])

  return {
    isDragging,
    transform: isDragging ? dnd.transform : null,
    setNodeRef,
    attributes: {
      role: "button",
      tabIndex: disabled ? -1 : 0,
      "aria-roledescription": "draggable item",
      "aria-grabbed": isDragging,
    },
    listeners: {
      onPointerDown: handlePointerDown,
      onKeyDown: handleKeyDown,
    },
  }
}

export const Draggable = forwardRef<HTMLDivElement, DraggableProps>(function Draggable(
  {
    id,
    droppableId,
    data,
    disabled = false,
    dragFromItem = true,
    children,
    className,
    style,
    ...props
  },
  ref,
) {
  const dnd = useDnd()
  const { isDragging, transform, setNodeRef, attributes, listeners } = useDraggable({
    id,
    droppableId,
    data,
    disabled,
  })

  const handleRef = useCallback((node: HTMLElement | null) => {
    setNodeRef(node)
    if (typeof ref === "function") ref(node as HTMLDivElement | null)
    else if (ref) (ref as { current: HTMLDivElement | null }).current = node as HTMLDivElement | null
  }, [ref, setNodeRef])

  const renderProps: DraggableRenderProps = {
    isDragging,
    transform,
    setNodeRef: handleRef,
    attributes,
    listeners,
  }

  if (typeof children === "function") {
    return <>{children(renderProps)}</>
  }

  // When there's a DragOverlay mounted, the source Draggable displays as a placeholder ghost.
  // When there's no DragOverlay mounted, the Draggable itself directly translates with 60fps hardware acceleration!
  const isFloatingTranslate = isDragging && !dnd.hasDragOverlay && transform !== null

  const dynamicStyles: CSSProperties = {
    ...style,
    transform: isFloatingTranslate
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(1.5deg)`
      : style?.transform,
    zIndex: isDragging ? "var(--z-modal)" : style?.zIndex,
    pointerEvents: isDragging ? "none" : style?.pointerEvents,
  }

  return (
    <div
      ref={handleRef}
      data-draggable-id={id}
      data-dragging={isDragging || undefined}
      {...(dragFromItem ? attributes : {})}
      {...(dragFromItem ? listeners : {})}
      style={dynamicStyles}
      className={cn(
        "touch-none select-none transition-shadow",
        dragFromItem && "cursor-grab active:cursor-grabbing",
        // Direct floating drag styling (no DragOverlay)
        isFloatingTranslate && "shadow-floating ring-2 ring-accent scale-[1.02] opacity-95",
        // Ghost placeholder styling when DragOverlay is used
        isDragging && dnd.hasDragOverlay && "opacity-35 border-2 border-dashed border-accent/40 bg-accent/5 rounded-[var(--radius-md)]",
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
/* DragOverlay Component                                              */
/* ------------------------------------------------------------------ */

export interface DragOverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode | ((props: { activeId: string; data?: unknown }) => ReactNode)
}

export function DragOverlay({ children, className, style, ...props }: DragOverlayProps) {
  const dnd = useDnd()
  const { setHasDragOverlay, activeId, activeData, pointerPosition, grabOffset } = dnd

  useEffect(() => {
    setHasDragOverlay(true)
    return () => {
      setHasDragOverlay(false)
    }
  }, [setHasDragOverlay])

  if (!activeId || !pointerPosition) {
    return null
  }

  const left = pointerPosition.x - (grabOffset?.x ?? 0)
  const top = pointerPosition.y - (grabOffset?.y ?? 0)

  return (
    <ThemePortal>
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          transform: `translate3d(${left}px, ${top}px, 0) rotate(1.5deg) scale(1.02)`,
          pointerEvents: "none",
          zIndex: "var(--z-modal)",
          ...style,
        }}
        className={cn(
          "shadow-floating transition-transform duration-75 select-none ring-2 ring-accent rounded-[var(--radius-md)]",
          className,
        )}
        {...props}
      >
        {typeof children === "function" ? children({ activeId, data: activeData }) : children}
      </div>
    </ThemePortal>
  )
}

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
      } else {
        dnd.endDrag()
      }
    } else if (e.key === "Escape" && isDragging) {
      e.preventDefault()
      e.stopPropagation()
      dnd.cancelDrag()
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
        "inline-flex h-7 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-foreground/8 hover:text-foreground active:cursor-grabbing",
        focusRingStyles,
        className,
      )}
      {...props}
    >
      <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true" className="shrink-0">
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

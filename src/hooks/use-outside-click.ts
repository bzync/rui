"use client"
import { useEffect } from "react"
import { useEventCallback } from "@/hooks/use-event-callback"

/**
 * useOutsideClick — shared outside-interaction handler for overlays.
 * Listens for mousedown outside the container and calls onOutside.
 * Also optionally listens for Escape.
 */
export function useOutsideClick(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  onOutside: () => void,
  opts: { escape?: boolean } = {},
) {
  const onOutsideStable = useEventCallback(onOutside)
  useEffect(() => {
    if (!active) return
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) onOutsideStable()
    }
    function onKeyDown(e: KeyboardEvent) {
      if (opts.escape !== false && e.key === "Escape") {
        e.preventDefault()
        onOutsideStable()
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    if (opts.escape !== false) document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [active, containerRef, onOutsideStable, opts.escape])
}

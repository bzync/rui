"use client"
import { useCallback, useRef, useLayoutEffect } from "react"

/**
 * Stable callback that always calls the latest fn without re-subscribing effects.
 * Prevents stale closures while keeping effect deps stable.
 */
export function useEventCallback<T extends (...args: never[]) => unknown>(fn: T): T {
  const ref = useRef(fn)
  useLayoutEffect(() => { ref.current = fn })
  return useCallback(((...args: never[]) => ref.current(...args)) as T, [])
}

"use client"
import { useCallback, useEffect, useRef } from "react"

/**
 * Returns a stable callback that reports whether the component is currently mounted.
 * Safe to call in async continuations to avoid state updates on unmounted components.
 */
export function useIsMounted(): () => boolean {
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  return useCallback(() => mounted.current, [])
}

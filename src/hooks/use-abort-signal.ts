"use client"
import { useEffect, useRef } from "react"

/**
 * Provides an AbortSignal that aborts on unmount or when deps change.
 * Use for fetch / async work that must not update after unmount.
 */
export function useAbortSignal(deps: React.DependencyList = []): AbortSignal {
  const ctrlRef = useRef<AbortController | null>(null)
  if (ctrlRef.current === null) ctrlRef.current = new AbortController()
  useEffect(() => {
    const ctrl = new AbortController()
    ctrlRef.current = ctrl
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ctrlRef.current.signal
}

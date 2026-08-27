"use client"
import { useEffect, useRef } from "react"

/**
 * Wraps an effect so async work is cancelled on unmount / re-run.
 * Usage: useSafeEffect(({ signal, isMounted }) => { fetch(url, { signal }).then(...) })
 */
export function useSafeEffect(
  effect: (ctx: { signal: AbortSignal; isMounted: () => boolean }) => void | (() => void),
  deps: React.DependencyList
) {
  const ctrlRef = useRef<AbortController | null>(null)
  useEffect(() => {
    const ctrl = new AbortController()
    ctrlRef.current = ctrl
    let mounted = true
    const isMounted = () => mounted
    const cleanup = effect({ signal: ctrl.signal, isMounted })
    return () => {
      mounted = false
      ctrl.abort()
      if (typeof cleanup === "function") cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

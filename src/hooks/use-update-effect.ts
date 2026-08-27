"use client"
import { useEffect, useRef } from "react"

/**
 * Like useEffect but skips the initial mount — runs only on updates.
 * Cleanup still runs on unmount.
 */
export function useUpdateEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  const isMounted = useRef(false)
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return }
    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

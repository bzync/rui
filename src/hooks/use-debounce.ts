"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { useEventCallback } from "./use-event-callback"

/** Returns `value` once it has stopped changing for `delayMs`. */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

export interface DebouncedCallback<A extends unknown[]> {
  (...args: A): void
  /** Drops the pending call. */
  cancel: () => void
  /** Runs the pending call now. */
  flush: () => void
  pending: () => boolean
}

/**
 * Stable debounced version of `callback` (always calls the latest one).
 * Pending calls are cancelled on unmount.
 */
export function useDebouncedCallback<A extends unknown[]>(callback: (...args: A) => void, delayMs = 300): DebouncedCallback<A> {
  const latest = useEventCallback(callback)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const args = useRef<A | null>(null)

  const debounced = useMemo(() => {
    const run = () => {
      timer.current = null
      if (args.current) latest(...args.current)
      args.current = null
    }
    const fn = ((...next: A) => {
      args.current = next
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(run, delayMs)
    }) as DebouncedCallback<A>
    fn.cancel = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; args.current = null }
    fn.flush = () => { if (timer.current) { clearTimeout(timer.current); run() } }
    fn.pending = () => timer.current !== null
    return fn
  }, [delayMs, latest])

  useEffect(() => debounced.cancel, [debounced])
  return debounced
}

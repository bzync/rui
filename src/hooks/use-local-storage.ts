"use client"
import { useCallback, useMemo, useSyncExternalStore } from "react"

export interface UseLocalStorageOptions<T> {
  serialize?: (value: T) => string
  deserialize?: (raw: string) => T
}

const SAME_TAB_EVENT = "rui:local-storage"

function read(key: string): string | null {
  try { return window.localStorage.getItem(key) } catch { return null }
}

/**
 * State persisted in localStorage and kept in sync across components and
 * tabs. Server rendering and hydration use `initialValue`; the stored value
 * applies right after, so markup never mismatches. Storage failures (private
 * mode, quota) degrade to in-memory behaviour without throwing.
 */
export function useLocalStorage<T>(key: string, initialValue: T, { serialize = JSON.stringify, deserialize = JSON.parse }: UseLocalStorageOptions<T> = {}) {
  const subscribe = useCallback((onChange: () => void) => {
    const onStorage = (event: StorageEvent) => { if (event.key === null || event.key === key) onChange() }
    const onLocal = (event: Event) => { if ((event as CustomEvent<string>).detail === key) onChange() }
    window.addEventListener("storage", onStorage)
    window.addEventListener(SAME_TAB_EVENT, onLocal)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(SAME_TAB_EVENT, onLocal)
    }
  }, [key])

  // The raw string is the snapshot: stable between renders, so no extra re-renders.
  const raw = useSyncExternalStore(subscribe, () => read(key), () => null)

  const value = useMemo<T>(() => {
    if (raw === null) return initialValue
    try { return deserialize(raw) } catch { return initialValue }
    // initialValue is only a fallback; changing it must not re-parse.
  }, [raw])

  const setValue = useCallback((next: T | ((previous: T) => T)) => {
    const current = (() => { const stored = read(key); if (stored === null) return initialValue; try { return deserialize(stored) } catch { return initialValue } })()
    const resolved = typeof next === "function" ? (next as (previous: T) => T)(current) : next
    try { window.localStorage.setItem(key, serialize(resolved)) } catch { /* storage unavailable */ }
    window.dispatchEvent(new CustomEvent(SAME_TAB_EVENT, { detail: key }))
  }, [key])

  const remove = useCallback(() => {
    try { window.localStorage.removeItem(key) } catch { /* storage unavailable */ }
    window.dispatchEvent(new CustomEvent(SAME_TAB_EVENT, { detail: key }))
  }, [key])

  return [value, setValue, remove] as const
}

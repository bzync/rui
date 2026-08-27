"use client"
import { useCallback, useState } from "react"

export function useControllableState<T>({
  value, defaultValue, onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: (v: T) => void
}): [T, (v: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue)
  const isControlled = value !== undefined
  const current = (isControlled ? value : internal) as T
  const set = useCallback((next: T) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }, [isControlled, onChange])
  return [current, set]
}

"use client"
import { useSyncExternalStore } from "react"

/** Tailwind's default min-width breakpoints, in px. */
export const defaultBreakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 } as const

const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange)
  return () => window.removeEventListener("resize", onChange)
}

export interface UseBreakpoint<K extends string> {
  /** Largest breakpoint whose min-width is met, or "base" below the smallest. Always "base" during server rendering and hydration. */
  breakpoint: K | "base"
  /** Viewport width in px (0 on the server). */
  width: number
  /** True at or above `key`. */
  up: (key: K) => boolean
  /** True below `key`. */
  down: (key: K) => boolean
  /** False until the viewport has been measured on the client. */
  ready: boolean
}

/**
 * Current responsive breakpoint. Server rendering and hydration see width 0
 * ("base"), then the real width is applied, so markup never mismatches.
 */
export function useBreakpoint<K extends string = keyof typeof defaultBreakpoints>(
  breakpoints: Record<K, number> = defaultBreakpoints as unknown as Record<K, number>,
): UseBreakpoint<K> {
  const width = useSyncExternalStore(subscribe, () => window.innerWidth, () => 0)
  const sorted = (Object.entries(breakpoints) as [K, number][]).sort((a, b) => a[1] - b[1])
  const breakpoint = sorted.filter(([, min]) => width >= min).pop()?.[0] ?? "base"
  return {
    breakpoint,
    width,
    up: (key) => width >= breakpoints[key],
    down: (key) => width < breakpoints[key],
    ready: width > 0,
  }
}

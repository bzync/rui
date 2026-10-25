"use client"
import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/**
 * False during server rendering and while React hydrates server HTML, true
 * afterwards. Unlike a mount effect it is true on the very first render of a
 * purely client-side tree, so overlays opened before mount are not delayed.
 * Use it to keep client-only output (portals) out of the hydration pass, where
 * the server rendered nothing and a mismatch would regenerate the subtree.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}

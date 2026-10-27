import type { Ref, RefCallback } from "react"

/** Combines refs so a component can keep an internal ref and forward the consumer's. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value)
      else if (ref) (ref as { current: T | null }).current = value
    }
  }
}

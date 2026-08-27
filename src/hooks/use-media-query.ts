"use client"
import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return false
    return window.matchMedia(query).matches
  })
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    // Safari < 14 uses addListener
    if (mql.addEventListener) mql.addEventListener("change", onChange)
    else (mql as unknown as { addListener: (cb: () => void) => void }).addListener(onChange)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange)
      else (mql as unknown as { removeListener: (cb: () => void) => void }).removeListener(onChange)
    }
  }, [query])
  return matches
}

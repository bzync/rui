"use client"
import { useCallback, useEffect, useRef, useState } from "react"

export interface UseClipboardOptions {
  /** How long `copied` stays true, in ms. Default 2000. */
  timeout?: number
}

export interface UseClipboard {
  copy: (text: string) => Promise<boolean>
  copied: boolean
  error: Error | null
  reset: () => void
}

/** Copies text with the async Clipboard API, falling back to a hidden textarea where it is unavailable. */
export function useClipboard({ timeout = 2000 }: UseClipboardOptions = {}): UseClipboard {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setCopied(false)
    setError(null)
  }, [])

  const copy = useCallback(async (text: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const area = document.createElement("textarea")
        area.value = text
        area.setAttribute("readonly", "")
        area.style.position = "fixed"
        area.style.opacity = "0"
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand("copy")
        area.remove()
        if (!ok) throw new Error("Copy command was rejected")
      }
      setError(null)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), timeout)
      return true
    } catch (cause) {
      setCopied(false)
      setError(cause instanceof Error ? cause : new Error(String(cause)))
      return false
    }
  }, [timeout])

  return { copy, copied, error, reset }
}

"use client"

import { useCallback, useEffect, useRef } from "react"
import { trapFocus } from "@/utils/focus"
import { useEventCallback } from "@/hooks/use-event-callback"

/**
 * useFocusTrap — focus-trapping for overlays.
 * Standardizes Escape + Tab handling, initial focus, and scroll locking
 * across Modal / Drawer / Dialog.
 */
export interface UseFocusTrapOptions {
  /** Whether the trap is active (e.g. open) */
  active: boolean
  /** Called on Escape */
  onEscape?: () => void
  /** Disable scroll lock on body */
  disableScrollLock?: boolean
  /** If false, Escape does not close */
  closeOnEscape?: boolean
  /** Selector for the element to focus initially (e.g. "[data-autofocus]") */
  autoFocusSelector?: string
}

export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseFocusTrapOptions,
) {
  const {
    active,
    onEscape,
    disableScrollLock = false,
    closeOnEscape = true,
    autoFocusSelector = "[data-autofocus]",
  } = options

  const onEscapeStable = useEventCallback(() => onEscape?.())

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current

    // Scroll lock — reference-counted via previous overflow
    const previousOverflow = disableScrollLock ? null : document.body.style.overflow
    if (!disableScrollLock) document.body.style.overflow = "hidden"

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && closeOnEscape) {
        e.preventDefault()
        onEscapeStable()
        return
      }
      trapFocus(container!, e)
    }

    document.addEventListener("keydown", onKey)

    // Focus first focusable or container itself — retry via rAF + timeout
    // so Playwright's toBeFocused (which polls) sees focus even if
    // framer-motion hasn't painted the panel yet.
    function focusInitial() {
      // A retry must never steal focus after the user has already moved to a
      // different control inside the overlay.
      if (container.contains(document.activeElement)) return true
      // Prefer explicit autofocus, then modal-content scoped, then generic
      const auto = container.querySelector<HTMLElement>(autoFocusSelector)
      if (auto) { auto.focus(); return true }
      const firstFocusable =
        container.querySelector<HTMLElement>(
          "[data-modal-content] a[href],[data-modal-content] button:not([disabled]),[data-modal-content] input:not([disabled]),[data-modal-content] select:not([disabled]),[data-modal-content] textarea:not([disabled]),[data-modal-content] [tabindex]:not([tabindex=\"-1\"])",
        ) ??
        container.querySelector<HTMLElement>(
          "a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex=\"-1\"])",
        )
      const target = firstFocusable ?? container
      // Only focus if not already focused — avoids stealing focus during typing
      if (document.activeElement !== target) target?.focus()
      return document.activeElement === target
    }
    // Try sync, then async retries
    if (!focusInitial()) {
      const raf = requestAnimationFrame(() => {
        if (!focusInitial()) {
          // Fallback timer for when rAF fires before paint (headless)
          setTimeout(focusInitial, 16)
        }
      })
      // Also schedule a timeout as backup — will be cleared if rAF succeeded
      const timer = window.setTimeout(focusInitial, 50)
      return () => {
        cancelAnimationFrame(raf)
        window.clearTimeout(timer)
        document.removeEventListener("keydown", onKey)
        if (!disableScrollLock && previousOverflow !== null) {
          document.body.style.overflow = previousOverflow
        }
      }
    }
    // Fast path succeeded — still need timeout retry for late-mounted children
    const timer2 = window.setTimeout(focusInitial, 50)
    return () => {
      window.clearTimeout(timer2)
      document.removeEventListener("keydown", onKey)
      if (!disableScrollLock && previousOverflow !== null) {
        document.body.style.overflow = previousOverflow
      }
    }
  }, [active, autoFocusSelector, closeOnEscape, containerRef, disableScrollLock, onEscapeStable])
}

/**
 * useScrollLock — isolated scroll lock for overlays that don't need full trap.
 */
export function useScrollLock(active: boolean) {
  const prevRef = useRef<string | null>(null)
  useEffect(() => {
    if (!active) return
    prevRef.current = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prevRef.current ?? ""
    }
  }, [active])
}

/**
 * useRestoreFocus — remembers the previously focused element and restores
 * it after the overlay closes (with framer-motion exit delay awareness).
 */
export function useRestoreFocus(active: boolean, delayMs = 240) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const wasActiveRef = useRef(false)
  const restoreTimerRef = useRef<number | null>(null)

  if (active && !wasActiveRef.current && typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
    previouslyFocusedRef.current = document.activeElement
  }
  wasActiveRef.current = active

  const restoreNow = useCallback(() => {
    if (restoreTimerRef.current !== null) {
      window.clearTimeout(restoreTimerRef.current)
      restoreTimerRef.current = null
    }
    const element = previouslyFocusedRef.current
    previouslyFocusedRef.current = null
    if (element?.isConnected) element.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (active || !previouslyFocusedRef.current) return
    restoreTimerRef.current = window.setTimeout(restoreNow, delayMs)
    return () => {
      if (restoreTimerRef.current !== null) {
        window.clearTimeout(restoreTimerRef.current)
        restoreTimerRef.current = null
      }
    }
  }, [active, delayMs, restoreNow])

  return { previouslyFocusedRef, restoreNow }
}

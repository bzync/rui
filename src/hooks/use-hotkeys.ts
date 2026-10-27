"use client"
import { type RefObject, useEffect } from "react"
import { useEventCallback } from "./use-event-callback"

export interface UseHotkeysOptions {
  enabled?: boolean
  /** Also fire while focus is in an input, textarea, select or contenteditable. Default false. */
  enableOnFormTags?: boolean
  /** Default true. */
  preventDefault?: boolean
  /** Listen on this element instead of the document. */
  target?: RefObject<HTMLElement | null>
  event?: "keydown" | "keyup"
}

interface Combo { mod: boolean; ctrl: boolean; meta: boolean; alt: boolean; shift: boolean; key: string }

const ALIASES: Record<string, string> = { esc: "escape", return: "enter", space: " ", up: "arrowup", down: "arrowdown", left: "arrowleft", right: "arrowright", plus: "+", comma: "," }

/** Parses "mod+k", "shift+?", "ctrl+alt+delete", "escape". `mod` is ⌘ on Apple platforms and Ctrl elsewhere. */
export function parseHotkey(hotkey: string): Combo {
  const parts = hotkey.toLowerCase().split("+").map((part) => part.trim())
  // "mod++" → last part is empty, the key is "+".
  const key = parts[parts.length - 1] === "" ? "+" : parts[parts.length - 1]
  return { mod: parts.includes("mod"), ctrl: parts.includes("ctrl"), meta: parts.includes("meta") || parts.includes("cmd"), alt: parts.includes("alt") || parts.includes("option"), shift: parts.includes("shift"), key: ALIASES[key] ?? key }
}

const isApple = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

export function matchesHotkey(event: KeyboardEvent, combo: Combo): boolean {
  const apple = isApple()
  const wantCtrl = combo.ctrl || (combo.mod && !apple)
  const wantMeta = combo.meta || (combo.mod && apple)
  if (event.ctrlKey !== wantCtrl || event.metaKey !== wantMeta || event.altKey !== combo.alt) return false
  const key = event.key.toLowerCase()
  // Shifted symbols ("?") already encode Shift in the key, so only enforce Shift for letters and named keys.
  const symbol = key.length === 1 && !/[a-z0-9]/.test(key)
  if (!symbol && event.shiftKey !== combo.shift) return false
  return key === combo.key || event.code.toLowerCase() === `key${combo.key}` || event.code.toLowerCase() === `digit${combo.key}`
}

const isFormTarget = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))

/**
 * Runs `handler` when any of `hotkeys` is pressed. Ignores presses while the
 * user is typing in a form field unless `enableOnFormTags` is set.
 */
export function useHotkeys(hotkeys: string | string[], handler: (event: KeyboardEvent) => void, { enabled = true, enableOnFormTags = false, preventDefault = true, target, event = "keydown" }: UseHotkeysOptions = {}) {
  const callback = useEventCallback(handler)
  const signature = (Array.isArray(hotkeys) ? hotkeys : [hotkeys]).join("|")

  useEffect(() => {
    if (!enabled) return
    const combos = signature.split("|").map(parseHotkey)
    const element: HTMLElement | Document = target?.current ?? document
    const listener = (raw: Event) => {
      const keyEvent = raw as KeyboardEvent
      if (keyEvent.repeat && event === "keyup") return
      if (!enableOnFormTags && isFormTarget(keyEvent.target)) return
      if (!combos.some((combo) => matchesHotkey(keyEvent, combo))) return
      if (preventDefault) keyEvent.preventDefault()
      callback(keyEvent)
    }
    element.addEventListener(event, listener)
    return () => element.removeEventListener(event, listener)
  }, [signature, enabled, enableOnFormTags, preventDefault, target, event, callback])
}

import { FOCUSABLE_SELECTOR } from "@/constants"

export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(el => !el.hidden && el.getAttribute("aria-hidden") !== "true")
}

export function trapFocus(container: HTMLElement, event: KeyboardEvent) {
  if (event.key !== "Tab") return
  const focusable = getFocusable(container)
  if (focusable.length === 0) { event.preventDefault(); container.focus(); return }
  const first = focusable[0], last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}

export const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",")

export const KEY = {
  Escape: "Escape",
  Enter: "Enter",
  Space: " ",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
  Tab: "Tab",
} as const

export const DURATIONS = {
  instant: 0,
  fast: 120,
  normal: 200,
  slow: 320,
} as const

/** The library's stacking scale, lowest to highest. Each value resolves to a
 * `--z-*` token defined in `@bzync/rui/styles.css`, so overriding the token on
 * `:root` moves every component that uses that layer. Use these for your own
 * overlays so they slot into the same order (`style={{ zIndex: Z_INDEX.modal }}`). */
export const Z_INDEX = {
  sticky: "var(--z-sticky)",
  modal: "var(--z-modal)",
  popover: "var(--z-popover)",
  toast: "var(--z-toast)",
  tooltip: "var(--z-tooltip)",
} as const

/** Shared visual anatomy for high-frequency controls. Keep these as static
 * Tailwind strings so the library stylesheet can discover every utility. */
export const fieldRootStyles = "flex w-full flex-col gap-1.5"

export const fieldLabelStyles =
  "text-xs font-semibold leading-5 text-foreground"

export const fieldDescriptionStyles =
  "text-xs leading-5 text-muted-foreground"

export const fieldErrorStyles =
  "text-xs leading-5 text-destructive"

/** Text inputs / selects / textareas: the ring hugs the border (no offset gap)
 * and the border itself turns cobalt — that colored edge is this system's
 * "inset line", the field-shaped counterpart to the focus halo on buttons. */
export const controlBaseStyles = [
  "border border-border bg-surface text-foreground shadow-xs",
  "transition-[border-color,box-shadow,background-color] duration-150",
  "hover:border-border-strong",
  "focus-within:border-accent-500 focus-within:outline-none focus-within:ring-[3px] focus-within:ring-focus-ring/25",
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-surface-muted has-[:disabled]:opacity-60",
  "has-[:read-only]:bg-surface-muted",
].join(" ")

export const controlInvalidStyles =
  "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/25"

/** The library's signature focus treatment. Routes through the `.focus-ring`
 * utility in globals.css (1px inset hairline + 3px cobalt halo with a 2px gap),
 * so every button, tab, menu item, link, and toggle that opts in shares one
 * byte-identical focus state. Requires the element to sit inside a
 * `ThemeProvider` (`.rui-theme`) scope — always true for library consumers. */
export const focusRingStyles = "focus-ring"

/** For controls whose focusable element is a sibling (checkbox/radio/switch
 * inputs visually hidden behind a styled proxy). Mirrors the halo geometry with
 * peer-* utilities since the box-shadow utility can't reach across elements. */
export const peerFocusRingStyles =
  "peer-focus-visible:ring-[3px] peer-focus-visible:ring-focus-ring/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg"

export const iconButtonStyles = [
  "inline-flex size-8 shrink-0 items-center justify-center rounded-md",
  "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
  "disabled:pointer-events-none disabled:opacity-40",
  focusRingStyles,
].join(" ")

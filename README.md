# rui

Composable React UI components with scoped, customizable light and dark themes.

```tsx
import { Button, ThemeProvider, ThemeToggle } from "@bzync/rui"
import "@bzync/rui/styles.css"

const violet = {
  50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd",
  400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9",
  800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065",
} as const

export function App() {
  return (
    <ThemeProvider
      applyToRoot
      palette={{ accent: violet }}
      lightPalette={{ tokens: { "--color-bg": "#fafafa", "--color-surface": "#fff" } }}
      darkPalette={{ tokens: { "--color-bg": "#09090b", "--color-surface": "#18181b" } }}
    >
      <ThemeToggle />
      <Button>Custom primary</Button>
    </ThemeProvider>
  )
}
```

Every component accepts `className` (and native element props where applicable), so one-off
changes compose with the defaults. `ThemeProvider` supports controlled or uncontrolled themes,
system preference, persistent selection, scoped themes, custom accent/neutral scales, and any
CSS variable through `tokens`. `ThemeToggle` accepts custom icons, labels, and classes.

## Installation

```sh
npm install @bzync/rui framer-motion
```

Import the core stylesheet once near the application root:

```tsx
import "@bzync/rui/styles.css"
```

rui does not download or bundle webfonts. It uses system fallbacks by default, keeping the
core stylesheet small and avoiding unexpected network requests. Applications can load any font
and override `--font-sans`, `--font-display`, and `--font-mono` on `.rui-theme`.

## Accessibility and motion

Interactive components expose native semantics and keyboard behavior. Modal dialogs label their
content, trap keyboard focus, close with Escape, restore the previously focused element, and
preserve the page's prior scroll-lock state. rui also disables nonessential animation within its
theme scope when the user requests reduced motion.

## Component imports

Use subpath imports when an application only needs a small part of the library:

```tsx
import { Button } from "@bzync/rui/button"
```

The root export remains available for convenience. React 18.2 and React 19 are supported.

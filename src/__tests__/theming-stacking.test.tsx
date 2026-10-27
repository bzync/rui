/// <reference types="node" />
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"
import { describe, expect, it } from "vitest"
import {
  Alert, Avatar, Badge, Callout, Checkbox, DateTimePicker, Drawer, DropdownMenu, Modal, Popover, Progressbar, Select, Stat, StatusDot, Tag, ThemePortal,
  ThemeProvider, Timeline, TimePicker, Tooltip, Z_INDEX,
} from "@/index"

const SRC = join(__dirname, "..")
const COMPONENTS = join(SRC, "components")

/** Raw Tailwind palette utilities for the status hues and neutral text that
 * semantic tokens replace. */
const RAW_STATUS = /(?:^|[\s"'`:])(?:bg|text|border|ring|fill|stroke)-(?:emerald|amber|red|sky|green|rose)-\d{2,3}/
const RAW_NEUTRAL_TEXT = /(?:^|[\s"'`:])text-(?:slate|gray)-\d{2,3}/

// Intentional raw palettes: code syntax highlighting and the categorical
// calendar-event and avatar-initials colors.
const ALLOWED = new Set(["code.tsx", "calendar/types.ts", "avatar.tsx"])

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? sourceFiles(path) : /\.tsx?$/.test(entry.name) ? [path] : []
  })
}

function allClasses(root: HTMLElement): string[] {
  return [root, ...root.querySelectorAll("*")].flatMap((el) => Array.from(el.classList))
}

describe("semantic color tokens", () => {
  it("keeps raw status and neutral palette classes out of component source", () => {
    const offenders: string[] = []
    for (const file of sourceFiles(COMPONENTS)) {
      const rel = relative(COMPONENTS, file).split("\\").join("/")
      if (ALLOWED.has(rel) || ALLOWED.has(rel.split("/")[0])) continue
      readFileSync(file, "utf8").split("\n").forEach((line: string, i: number) => {
        if (RAW_STATUS.test(line) || RAW_NEUTRAL_TEXT.test(line)) offenders.push(`${rel}:${i + 1}: ${line.trim()}`)
      })
    }
    expect(offenders).toEqual([])
  })

  it("uses one mode-aware class per property instead of light/dark class pairs", () => {
    // A `x dark:y` pair lets a consumer's later Tailwind layer re-assert the
    // light half over the dark half (bug #5). Only the code syntax palette,
    // which is intentionally per-mode, may use dark: classes.
    const offenders: string[] = []
    for (const file of sourceFiles(COMPONENTS)) {
      const rel = relative(COMPONENTS, file).split("\\").join("/")
      readFileSync(file, "utf8").split("\n").forEach((line: string, i: number) => {
        if (!/(?:^|[\s"'`])dark:/.test(line)) return
        if (rel === "code.tsx" && /^\s*(keyword|string|comment|number|operator|builtin|plain):/.test(line)) return
        offenders.push(`${rel}:${i + 1}: ${line.trim()}`)
      })
    }
    expect(offenders).toEqual([])
  })

  it("keeps source files plain text so tooling does not treat them as binary", () => {
    const binary = sourceFiles(SRC).filter((file) => readFileSync(file).includes(0))
    expect(binary).toEqual([])
  })

  it("renders status variants from the status tokens without light/dark class pairs", () => {
    const { container } = render(
      <>
        <Badge variant="success" dot>ok</Badge>
        <Badge variant="warning">pending</Badge>
        <Badge variant="error">failed</Badge>
        <Badge variant="info">note</Badge>
        <StatusDot status="online" label="Online" />
        <StatusDot status="busy" />
        <Tag variant="warning" onRemove={() => {}}>tag</Tag>
        <Alert variant="error" title="Alert">Body</Alert>
        <Callout variant="success">Callout</Callout>
        <Progressbar variant="info" value={40} showValue />
        <Timeline events={[{ id: "1", title: "Done", variant: "success" }]} />
        <Stat label="Revenue" value="1" trend="up" trendValue="+2%" />
        <Checkbox label="Accept" error="Required" />
        <Avatar name="Ada" status="away" />
      </>,
    )
    const classes = allClasses(container)
    expect(classes.filter((c) => RAW_STATUS.test(` ${c}`))).toEqual([])
    expect(classes.filter((c) => /^dark:(bg|text|border)-(success|warning|danger|info)/.test(c))).toEqual([])

    expect(screen.getByText("pending")).toHaveClass("bg-warning/10", "text-warning-strong", "border-warning/25")
    expect(screen.getByText("failed")).toHaveClass("bg-danger/10", "text-danger-strong")
    expect(screen.getByText("tag").parentElement).toHaveClass("bg-warning/10")
    expect(screen.getByRole("alert")).toHaveClass("bg-danger/8", "border-danger/25")
    expect(screen.getByText("+2%")).toHaveClass("text-success-strong")
  })

  it("exposes class hooks on colored parts that are not the root element", () => {
    const { container } = render(
      <>
        <Alert title="T" iconClassName="alert-icon" titleClassName="alert-title" bodyClassName="alert-body" accentClassName="alert-accent">B</Alert>
        <Callout title="CT" iconClassName="callout-icon" titleClassName="callout-title" bodyClassName="callout-body">CB</Callout>
        <Progressbar value={50} label="L" showValue trackClassName="pb-track" fillClassName="pb-fill" labelClassName="pb-label" valueClassName="pb-value" />
        <Timeline events={[{ id: "1", title: "E", variant: "success", markerClassName: "tl-marker" }]} />
        <Avatar name="Ada" status="online" statusClassName="av-status" />
        <Stat label="S" value="1" trend="down" trendValue="-1" trendClassName="stat-trend" />
      </>,
    )
    for (const cls of ["alert-icon", "alert-title", "alert-body", "alert-accent", "callout-icon", "callout-title", "callout-body", "pb-track", "pb-fill", "pb-label", "pb-value", "tl-marker", "av-status", "stat-trend"]) {
      expect(container.querySelector(`.${cls}`), cls).not.toBeNull()
    }
    expect(container.querySelector(".tl-marker")).toHaveClass("bg-success")
  })

  it("lets StatusDot override its dot and label per call", () => {
    const { container } = render(
      <StatusDot status="online" label="Up" variants={{ online: "bg-custom-online" }} dotClassName="ring-1" labelClassName="font-bold" pulse />,
    )
    const dots = container.querySelectorAll(".bg-custom-online")
    expect(dots).toHaveLength(2)
    dots.forEach((dot) => expect(dot).toHaveClass("ring-1"))
    expect(container.querySelector(".bg-success")).toBeNull()
    expect(screen.getByText("Up")).toHaveClass("font-bold", "text-muted-foreground")
  })

  it("defines the status, tooltip and stacking tokens in the stylesheet", () => {
    const css = readFileSync(join(SRC, "styles/globals.css"), "utf8")
    for (const tone of ["success", "warning", "danger", "info"]) {
      expect(css).toMatch(new RegExp(`--color-${tone}-strong: color-mix\\(in oklab, var\\(--color-${tone}\\) 78%, black\\)`))
      expect(css).toMatch(new RegExp(`--color-${tone}-strong: color-mix\\(in oklab, var\\(--color-${tone}\\) 62%, white\\)`))
    }
    for (const token of ["--color-tooltip:", "--color-tooltip-foreground:", "--color-tooltip-border:"]) {
      expect(css.split(token).length - 1).toBeGreaterThanOrEqual(3)
    }
  })
})

describe("stacking order", () => {
  const scale = () => {
    const css = readFileSync(join(SRC, "styles/globals.css"), "utf8")
    return Object.fromEntries([...css.matchAll(/--z-([a-z]+):\s*(\d+);/g)].map(([, name, value]) => [name, Number(value)]))
  }

  it("orders the layers sticky < modal < popover < toast < tooltip", () => {
    const z = scale()
    expect(Object.keys(Z_INDEX).sort()).toEqual(Object.keys(z).sort())
    expect(z.sticky).toBeLessThan(z.modal)
    expect(z.modal).toBeLessThan(z.popover)
    expect(z.popover).toBeLessThan(z.toast)
    expect(z.toast).toBeLessThan(z.tooltip)
    for (const [name, value] of Object.entries(Z_INDEX)) expect(value).toBe(`var(--z-${name})`)
  })

  it("puts modals and drawers on the modal layer and their floating panels above", async () => {
    const user = userEvent.setup()
    render(
      <>
        <Modal open onClose={() => {}} title="Dialog"><Select label="Region" options={[{ value: "a", label: "A" }]} /></Modal>
        <Drawer open onClose={() => {}} title="Panel">Drawer body</Drawer>
      </>,
    )
    expect(screen.getByRole("dialog", { name: "Dialog" }).closest(".z-\\(--z-modal\\)")).not.toBeNull()
    const drawer = screen.getByRole("dialog", { name: "Panel" })
    expect(drawer).toHaveClass("z-(--z-modal)")
    expect(drawer.previousElementSibling).toHaveClass("z-(--z-modal)")

    await user.click(screen.getByRole("combobox", { name: "Region" }))
    expect(screen.getByRole("listbox")).toHaveClass("z-(--z-popover)")
  })
})

describe("theme scope", () => {
  it("re-derives primary and focus-ring from an accent override unless set explicitly", () => {
    const { container, rerender } = render(<ThemeProvider storageKey={false} palette={{ accent: { 500: "#00ff00", 600: "#ff0000" } }}>x</ThemeProvider>)
    const token = (name: string) => getComputedStyle(container.querySelector("[data-rui-scope]")!).getPropertyValue(name)
    expect(token("--color-primary")).toBe("var(--color-accent-600)")
    expect(token("--color-focus-ring")).toBe("var(--color-accent-500)")

    rerender(<ThemeProvider storageKey={false} palette={{ accent: { 600: "#ff0000" }, colors: { primary: "#123456" } }}>x</ThemeProvider>)
    expect(token("--color-primary")).toBe("#123456")

    rerender(<ThemeProvider storageKey={false} palette={{ accent: { 600: "#ff0000" } }} deriveAccentTokens={false}>x</ThemeProvider>)
    expect(token("--color-primary")).toBe("")

    rerender(<ThemeProvider storageKey={false}>x</ThemeProvider>)
    expect(token("--color-primary")).toBe("")
    expect(container.querySelector("style")).toBeNull()
  })

  it("lets app CSS aimed at the scope beat the accent-derived primary", () => {
    const appCss = document.createElement("style")
    appCss.textContent = ".rui-theme { --color-primary: #345dee; }"
    document.head.append(appCss)
    try {
      const { container } = render(<ThemeProvider storageKey={false} palette={{ accent: { 600: "#2563eb" } }}>x</ThemeProvider>)
      expect(getComputedStyle(container.querySelector("[data-rui-scope]")!).getPropertyValue("--color-primary")).toBe("#345dee")
    } finally {
      appCss.remove()
    }
  })

  it("emits palette tokens for every mode in a stylesheet, not inline", () => {
    const { container } = render(
      <ThemeProvider storageKey={false} defaultTheme="light" lightPalette={{ tokens: { "--color-bg": "#fff" } }} darkPalette={{ tokens: { "--color-bg": "#000" } }}>x</ThemeProvider>,
    )
    const scope = container.querySelector<HTMLElement>("[data-rui-scope]")!
    expect(scope.style.getPropertyValue("--color-bg")).toBe("")
    expect(getComputedStyle(scope).getPropertyValue("--color-bg")).toBe("#fff")
    // A pre-paint script marking <html> dark selects the dark set before hydration resolves the theme.
    scope.dataset.themePreference = "system"
    document.documentElement.classList.add("dark")
    try {
      expect(getComputedStyle(scope).getPropertyValue("--color-bg")).toBe("#000")
    } finally {
      document.documentElement.classList.remove("dark")
    }
  })

  it("drops palette values that would escape the generated rule", () => {
    const { container } = render(<ThemeProvider storageKey={false} palette={{ tokens: { "--ok": "1", "--bad": "x}</style><script>", "--also-bad": "}body{" } }}>x</ThemeProvider>)
    const css = container.querySelector("style")!.textContent ?? ""
    expect(css).toContain("--ok:1;")
    expect(css).not.toContain("--bad")
    expect(css).not.toContain("--also-bad")
  })

  it("keeps portaled overlays inside the theme scope", () => {
    render(
      <ThemeProvider storageKey={false} theme="dark" palette={{ colors: { success: "#7c3aed" } }} style={{ ["--app-token" as string]: "1", padding: 4 }}>
        <Drawer open onClose={() => {}} title="Panel">Drawer body</Drawer>
        <ThemePortal><span>custom overlay</span></ThemePortal>
      </ThemeProvider>,
    )
    for (const node of [screen.getByRole("dialog", { name: "Panel" }), screen.getByText("custom overlay")]) {
      const scope = node.closest("[data-rui-portal]") as HTMLElement
      expect(scope).not.toBeNull()
      expect(scope.parentElement).toBe(document.body)
      expect(scope).toHaveClass("rui-theme", "dark")
      expect(scope).toHaveAttribute("data-theme", "dark")
      expect(scope.style.display).toBe("contents")
      expect(getComputedStyle(scope).getPropertyValue("--color-success")).toBe("#7c3aed")
      expect(scope.style.getPropertyValue("--app-token")).toBe("1")
      expect(scope.style.padding).toBe("")
    }
  })

  it("is a plain portal outside a ThemeProvider", () => {
    render(<ThemePortal><span>bare</span></ThemePortal>)
    expect(screen.getByText("bare").parentElement).toBe(document.body)
  })

  it("keeps TimePicker and DateTimePicker inside the theme scope with semantic tokens", async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider storageKey={false} theme="dark" palette={{ accent: { 600: "#8b5cf6" }, colors: { primary: "#8b5cf6" } }}>
        <TimePicker label="Event time" defaultValue="14:30" />
        <DateTimePicker label="Appointment" defaultValue={new Date(2026, 9, 28, 10, 0)} />
      </ThemeProvider>,
    )

    // Open TimePicker
    await user.click(screen.getByRole("button", { name: "Event time" }))
    const timeDialog = await screen.findByRole("dialog", { name: "Choose event time" })
    const timePortal = timeDialog.closest("[data-rui-portal]") as HTMLElement
    expect(timePortal).not.toBeNull()
    expect(timePortal).toHaveClass("dark")
    expect(timeDialog).toHaveClass("bg-surface-raised")
    // Active option in TimePicker has primary token
    const selectedHour = within(timeDialog).getByRole("option", { name: "02" })
    expect(selectedHour).toHaveClass("bg-primary", "text-primary-foreground")
    await user.keyboard("{Escape}")

    // Open DateTimePicker
    await user.click(screen.getByRole("button", { name: "Appointment" }))
    const dateDialog = await screen.findByRole("dialog", { name: "Choose date and time" })
    const datePortal = dateDialog.closest("[data-rui-portal]") as HTMLElement
    expect(datePortal).not.toBeNull()
    expect(datePortal).toHaveClass("dark")
    expect(dateDialog).toHaveClass("bg-surface-raised")
    // Selected day in DateTimePicker has primary token
    const selectedDay = within(dateDialog).getByRole("button", { name: /October 28, 2026/i })
    expect(selectedDay).toHaveClass("bg-primary", "text-primary-foreground")
  })
})

describe("floating panel sizing", () => {
  it("sizes popovers and dropdown menus to their content with a viewport-safe cap", async () => {
    const user = userEvent.setup()
    render(
      <>
        <Popover trigger={<button>Open popover</button>} ariaLabel="Details">content</Popover>
        <DropdownMenu trigger={<button>Actions</button>} items={[{ label: "Restart every virtual machine" }]} />
      </>,
    )
    await user.click(screen.getByRole("button", { name: "Open popover" }))
    expect(await screen.findByRole("dialog", { name: "Details" })).toHaveClass("w-max", "min-w-[180px]", "max-w-[min(24rem,calc(100vw-2rem))]")
    await user.click(screen.getByRole("button", { name: "Actions" }))
    expect(await screen.findByRole("menu")).toHaveClass("w-max", "max-w-[min(20rem,calc(100vw-2rem))]")
  })
})

describe("Tooltip sizing", () => {
  it("sizes to its content up to the default cap", async () => {
    const user = userEvent.setup()
    render(<Tooltip content="A fairly long tooltip that should grow to its content width"><button>Help</button></Tooltip>)
    await user.tab()
    const tooltip = await screen.findByRole("tooltip")
    expect(tooltip).toHaveClass("w-max", "max-w-[min(20rem,calc(100vw-2rem))]", "z-(--z-tooltip)", "bg-tooltip", "text-tooltip-foreground")
    expect(tooltip.getAttribute("style") ?? "").not.toContain("max-width")
  })

  it("accepts a custom max width, including none", async () => {
    const user = userEvent.setup()
    render(
      <>
        <Tooltip content="wide" maxWidth={480}><button>Wide</button></Tooltip>
        <Tooltip content="unbounded" maxWidth="none"><button>Unbounded</button></Tooltip>
      </>,
    )
    await user.tab()
    const wide = await screen.findByRole("tooltip")
    expect(wide.style.maxWidth).toMatch(/^min\(480px,/)
    await user.tab()
    const unbounded = await screen.findByText("unbounded")
    expect(unbounded.style.maxWidth).not.toBe("")
    expect(unbounded.style.maxWidth).not.toContain("min(")
  })
})

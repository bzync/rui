import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { BottomBar, BrandLink, Navbar, Sidebar, ThemeProvider, ThemeToggle, Topbar, TopbarTitle } from "@/index"

describe("themes", () => {
  it("toggles a scoped theme and exposes the active preference", async () => {
    const user = userEvent.setup()
    render(<ThemeProvider defaultTheme="light" storageKey={false}><ThemeToggle /><span>Content</span></ThemeProvider>)
    const scope = screen.getByText("Content").parentElement
    expect(scope).toHaveAttribute("data-theme", "light")
    await user.click(screen.getByRole("button", { name: "Use dark theme" }))
    expect(scope).toHaveAttribute("data-theme", "dark")
    expect(scope).toHaveClass("dark")
    expect(screen.getByRole("button", { name: "Use light theme" })).toHaveAttribute("aria-pressed", "true")
  })

  it("applies custom accent, neutral, and mode-specific tokens", () => {
    render(
      <ThemeProvider
        defaultTheme="dark"
        storageKey={false}
        palette={{ accent: { 600: "#7c3aed" }, neutral: { 900: "#18181b" } }}
        darkPalette={{ tokens: { "--color-bg": "#09090b", "--custom-density": 2 } }}
      >
        Custom theme
      </ThemeProvider>,
    )
    const scope = screen.getByText("Custom theme")
    expect(scope.style.getPropertyValue("--color-blue-600")).toBe("#7c3aed")
    expect(scope.style.getPropertyValue("--color-slate-900")).toBe("#18181b")
    expect(scope.style.getPropertyValue("--color-gray-900")).toBe("#18181b")
    expect(scope.style.getPropertyValue("--color-bg")).toBe("#09090b")
    expect(scope.style.getPropertyValue("--custom-density")).toBe("2")
  })

  it("maps typed semantic colors to component-facing tokens", () => {
    render(<ThemeProvider storageKey={false} defaultTheme="light" palette={{ colors: { text: "#111827", surfaceRaised: "#ffffff", borderStrong: "#94a3b8", mutedForeground: "#475569", primary: "#0f766e", danger: "#b91c1c" } }}>Semantic theme</ThemeProvider>)
    const scope = screen.getByText("Semantic theme")
    expect(scope.style.getPropertyValue("--color-foreground")).toBe("#111827")
    expect(scope.style.getPropertyValue("--color-surface-raised")).toBe("#ffffff")
    expect(scope.style.getPropertyValue("--color-border-strong")).toBe("#94a3b8")
    expect(scope.style.getPropertyValue("--color-muted-foreground")).toBe("#475569")
    expect(scope.style.getPropertyValue("--color-primary")).toBe("#0f766e")
    expect(scope.style.getPropertyValue("--color-destructive")).toBe("#b91c1c")
  })

  it("applies and restores the complete theme scope on the document root", () => {
    const { unmount } = render(<ThemeProvider applyToRoot storageKey={false} defaultTheme="dark">Root theme</ThemeProvider>)
    expect(document.documentElement).toHaveClass("rui-theme", "dark")
    expect(document.documentElement).toHaveAttribute("data-theme", "dark")
    unmount()
    expect(document.documentElement).not.toHaveClass("rui-theme", "dark")
    expect(document.documentElement).not.toHaveAttribute("data-theme")
  })
})

describe("navigation", () => {
  it("reports selection and exposes the current page", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Navbar activeId="home" onSelect={onSelect} items={[{ id: "home", label: "Home", href: "/" }, { id: "team", label: "Team", href: "/team" }]} />)
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page")
    await user.click(screen.getByRole("link", { name: "Team" }))
    expect(onSelect).toHaveBeenCalledWith("team")
  })

  it("renders every navigation shell from the shared item contract", () => {
    const items = [{ id: "home", label: "Home", href: "/" }]
    render(<><Topbar><TopbarTitle>Workspace</TopbarTitle></Topbar><BrandLink href="/">bzync</BrandLink><Sidebar items={items} /><BottomBar items={items} /></>)
    expect(screen.getByRole("heading", { name: "Workspace" })).toBeInTheDocument()
    expect(screen.getAllByRole("navigation")).toHaveLength(2)
    expect(screen.getByRole("link", { name: "bzync" })).toBeInTheDocument()
  })
})

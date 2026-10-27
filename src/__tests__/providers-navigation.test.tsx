import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  BottomBar, BrandLink, Navbar, NavigationMenu, ResponsiveDialog, ResponsiveDialogContent,
  ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogTrigger, ResponsiveDialogClose,
  Sidebar, ThemeProvider, ThemeSwitcher, ThemeToggle, Topbar, TopbarTitle,
} from "@/index"

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
    expect(getComputedStyle(scope).getPropertyValue("--color-blue-600")).toBe("#7c3aed")
    expect(getComputedStyle(scope).getPropertyValue("--color-slate-900")).toBe("#18181b")
    expect(getComputedStyle(scope).getPropertyValue("--color-gray-900")).toBe("#18181b")
    expect(getComputedStyle(scope).getPropertyValue("--color-bg")).toBe("#09090b")
    expect(getComputedStyle(scope).getPropertyValue("--custom-density")).toBe("2")
  })

  it("maps typed semantic colors to component-facing tokens", () => {
    render(<ThemeProvider storageKey={false} defaultTheme="light" palette={{ colors: { text: "#111827", surfaceRaised: "#ffffff", borderStrong: "#94a3b8", mutedForeground: "#475569", primary: "#0f766e", danger: "#b91c1c" } }}>Semantic theme</ThemeProvider>)
    const scope = screen.getByText("Semantic theme")
    expect(getComputedStyle(scope).getPropertyValue("--color-foreground")).toBe("#111827")
    expect(getComputedStyle(scope).getPropertyValue("--color-surface-raised")).toBe("#ffffff")
    expect(getComputedStyle(scope).getPropertyValue("--color-border-strong")).toBe("#94a3b8")
    expect(getComputedStyle(scope).getPropertyValue("--color-muted-foreground")).toBe("#475569")
    expect(getComputedStyle(scope).getPropertyValue("--color-primary")).toBe("#0f766e")
    expect(getComputedStyle(scope).getPropertyValue("--color-destructive")).toBe("#b91c1c")
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

describe("BottomBar", () => {
  it("renders native-style tabs with announced badges and an optional fixed position", async () => {
    const user = userEvent.setup(); const onSelect = vi.fn()
    const { container } = render(<BottomBar fixed activeId="home" onSelect={onSelect} items={[
      { id: "home", label: "Home", icon: <svg /> },
      { id: "inbox", label: "Inbox", icon: <svg />, badge: 3 },
    ]} />)
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page")
    // The count is part of the accessible name, not just a red dot.
    await user.click(screen.getByRole("button", { name: "Inbox, 3" }))
    expect(onSelect).toHaveBeenCalledWith("inbox")
    expect(container.querySelector("nav")).toHaveClass("fixed", "bottom-0", "pb-safe-bottom")
  })
})

describe("BottomBar layout options", () => {
  const items = [
    { id: "home", label: "Home", icon: <svg /> },
    { id: "search", label: "Search", icon: <svg /> },
    { id: "inbox", label: "Inbox", icon: <svg /> },
    { id: "me", label: "Me", icon: <svg /> },
  ]

  it("floats, inserts a center action in the middle and keeps hidden labels as names", () => {
    const { container } = render(<BottomBar variant="floating" labels="hidden" indicator="line" activeId="home" items={items} centerAction={<button>New</button>} />)
    const nav = container.querySelector("nav")!
    expect(nav).toHaveClass("rounded-full", "shadow-floating")
    expect(nav.style.gridTemplateColumns).toBe("repeat(5, minmax(0, 1fr))")
    // Center slot sits between the 2nd and 3rd tab.
    const order = [...nav.children].map((child) => child.textContent)
    expect(order).toEqual(["Home", "Search", "New", "Inbox", "Me"])
    // Icon-only, but every tab still has its label as the accessible name.
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument()
    expect(screen.getByText("Search")).toHaveClass("sr-only")
  })

  it("shows only the active label in labels=\"active\" mode", () => {
    render(<BottomBar labels="active" activeId="inbox" items={items} />)
    expect(screen.getByText("Inbox")).not.toHaveClass("sr-only")
    expect(screen.getByText("Home")).toHaveClass("sr-only")
  })
})

describe("Sidebar rail", () => {
  const railItems = [{ id: "home", label: "Home", icon: <svg /> }, { id: "inbox", label: "Inbox", icon: <svg />, badge: 3 }]

  it("collapses to an icon rail that keeps labels as accessible names, and persists", async () => {
    const user = userEvent.setup()
    window.localStorage.removeItem("test-rail")
    const onCollapsedChange = vi.fn()
    const { container, unmount } = render(<Sidebar collapsible storageKey="test-rail" items={railItems} activeId="home" onCollapsedChange={onCollapsedChange} />)
    const toggle = screen.getByRole("button", { name: "Collapse sidebar" })
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    await user.click(toggle)
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(container.querySelector("aside")).toHaveAttribute("data-collapsed", "true")
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute("aria-expanded", "false")
    unmount()
    const again = render(<Sidebar collapsible storageKey="test-rail" items={railItems} />)
    await waitFor(() => expect(again.container.querySelector("aside")).toHaveAttribute("data-collapsed", "true"))
    window.localStorage.removeItem("test-rail")
  })

  it("supports nested menu items with collapsible disclosure", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const nestedItems = [
      { id: "dashboard", label: "Dashboard", href: "/dashboard" },
      {
        id: "settings",
        label: "Settings",
        children: [
          { id: "general", label: "General", href: "/settings/general" },
          { id: "security", label: "Security", href: "/settings/security" },
        ],
      },
    ]

    render(<Sidebar items={nestedItems} onSelect={onSelect} />)

    const parentBtn = screen.getByRole("button", { name: /Settings/ })
    expect(parentBtn).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByRole("link", { name: "General" })).not.toBeInTheDocument()

    // Click to expand nested items
    await user.click(parentBtn)
    expect(parentBtn).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("link", { name: "General" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Security" })).toBeInTheDocument()

    // Click child item
    await user.click(screen.getByRole("link", { name: "General" }))
    expect(onSelect).toHaveBeenCalledWith("general")
  })
})

describe("NavigationMenu", () => {
  const menu = [
    { label: "Products", links: [{ label: "Analytics", href: "#/a", description: "Dashboards" }, { label: "Billing", href: "#/b" }] },
    { label: "Docs", href: "#/docs" },
    { label: "Company", content: <a href="#/about">About us</a> },
  ]

  it("toggles panels with disclosure semantics and keyboard support", async () => {
    const user = userEvent.setup()
    render(<NavigationMenu items={menu} />)
    const products = screen.getByRole("button", { name: "Products" })
    expect(products).toHaveAttribute("aria-expanded", "false")
    await user.click(products)
    expect(products).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("link", { name: /Analytics/ })).toBeVisible()
    await user.keyboard("{Escape}")
    expect(products).toHaveAttribute("aria-expanded", "false")
    expect(products).toHaveFocus()
    await user.keyboard("{ArrowDown}")
    await waitFor(() => expect(screen.getByRole("link", { name: /Analytics/ })).toHaveFocus())
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("link", { name: "Billing" })).toHaveFocus()
    products.focus()
    await user.keyboard("{ArrowLeft}")
    // Moving while a panel is open opens the neighbour's panel.
    expect(screen.getByRole("button", { name: "Company" })).toHaveFocus()
    expect(screen.getByRole("button", { name: "Company" })).toHaveAttribute("aria-expanded", "true")
    await user.keyboard("{ArrowLeft}")
    expect(screen.getByRole("link", { name: "Docs" })).toHaveFocus()
    expect(products).toHaveAttribute("aria-expanded", "false")
  })
})

describe("ThemeSwitcher", () => {
  it("renders segmented variant and switches themes inside ThemeProvider", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <ThemeSwitcher onChange={onChange} />
        <span>Content</span>
      </ThemeProvider>,
    )

    const scope = screen.getByText("Content").parentElement
    expect(scope).toHaveAttribute("data-theme", "light")

    const lightBtn = screen.getByRole("radio", { name: "Light" })
    const darkBtn = screen.getByRole("radio", { name: "Dark" })
    const systemBtn = screen.getByRole("radio", { name: "System" })

    expect(lightBtn).toHaveAttribute("aria-checked", "true")
    expect(darkBtn).toHaveAttribute("aria-checked", "false")

    await user.click(darkBtn)
    expect(onChange).toHaveBeenCalledWith("dark")
    expect(scope).toHaveAttribute("data-theme", "dark")
    expect(darkBtn).toHaveAttribute("aria-checked", "true")

    await user.click(systemBtn)
    expect(onChange).toHaveBeenCalledWith("system")
    expect(scope).toHaveAttribute("data-theme-preference", "system")
    expect(systemBtn).toHaveAttribute("aria-checked", "true")
  })

  it("supports controlled value and onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ThemeSwitcher value="dark" onChange={onChange} />)

    const darkBtn = screen.getByRole("radio", { name: "Dark" })
    expect(darkBtn).toHaveAttribute("aria-checked", "true")

    const lightBtn = screen.getByRole("radio", { name: "Light" })
    await user.click(lightBtn)
    expect(onChange).toHaveBeenCalledWith("light")
  })

  it("respects includeSystem={false}", () => {
    render(<ThemeSwitcher includeSystem={false} />)
    expect(screen.getByRole("radio", { name: "Light" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "Dark" })).toBeInTheDocument()
    expect(screen.queryByRole("radio", { name: "System" })).not.toBeInTheDocument()
  })

  it("renders switch variant and toggles between light and dark", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <ThemeSwitcher variant="switch" onChange={onChange} />
      </ThemeProvider>,
    )

    const switchBtn = screen.getByRole("switch")
    expect(switchBtn).toHaveAttribute("aria-checked", "false")

    await user.click(switchBtn)
    expect(onChange).toHaveBeenCalledWith("dark")
    expect(switchBtn).toHaveAttribute("aria-checked", "true")

    await user.click(switchBtn)
    expect(onChange).toHaveBeenCalledWith("light")
    expect(switchBtn).toHaveAttribute("aria-checked", "false")
  })

  it("renders dropdown variant, opens menu, selects option, and closes on Escape", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <ThemeSwitcher variant="dropdown" onChange={onChange} />
      </ThemeProvider>,
    )

    const trigger = screen.getByRole("button", { name: /Color theme: Light/i })
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")

    const darkOption = await screen.findByRole("menuitemradio", { name: /Dark/i })
    expect(darkOption).toBeInTheDocument()

    // Test Escape closes dropdown and restores focus
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menuitemradio", { name: /Dark/i })).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()

    // Open again and select Dark
    await user.click(trigger)
    const darkOption2 = await screen.findByRole("menuitemradio", { name: /Dark/i })
    await user.click(darkOption2)
    expect(onChange).toHaveBeenCalledWith("dark")
    await waitFor(() => expect(screen.queryByRole("menuitemradio", { name: /Dark/i })).not.toBeInTheDocument())
  })

  it("renders radio card variant and supports keyboard selection", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <ThemeSwitcher variant="radio" onChange={onChange} />
      </ThemeProvider>,
    )

    const lightCard = screen.getByRole("radio", { name: /Light Light appearance for bright environments/i })
    const darkCard = screen.getByRole("radio", { name: /Dark Dark appearance for low-light environments/i })
    expect(lightCard).toHaveAttribute("aria-checked", "true")
    expect(darkCard).toHaveAttribute("aria-checked", "false")

    darkCard.focus()
    await user.keyboard(" ")
    expect(onChange).toHaveBeenCalledWith("dark")
    expect(darkCard).toHaveAttribute("aria-checked", "true")
  })

  it("renders icon-button variant and cycles through themes on click", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <ThemeSwitcher variant="icon-button" onChange={onChange} />
      </ThemeProvider>,
    )

    const btn = screen.getByRole("button", { name: /Color theme: Light/i })
    await user.click(btn)
    expect(onChange).toHaveBeenCalledWith("dark")

    await user.click(btn)
    expect(onChange).toHaveBeenCalledWith("system")

    await user.click(btn)
    expect(onChange).toHaveBeenCalledWith("light")
  })
})

describe("ResponsiveDialog", () => {
  it("opens dialog on trigger click and closes on close button", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <ResponsiveDialog onOpenChange={onOpenChange}>
        <ResponsiveDialogTrigger>Open Dialog</ResponsiveDialogTrigger>
        <ResponsiveDialogContent title="Dialog Title" description="Dialog Description">
          <p>Dialog body text</p>
          <ResponsiveDialogClose>Cancel</ResponsiveDialogClose>
        </ResponsiveDialogContent>
      </ResponsiveDialog>,
    )

    const trigger = screen.getByRole("button", { name: "Open Dialog" })
    await user.click(trigger)

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.getByText("Dialog Title")).toBeInTheDocument()
    expect(screen.getByText("Dialog body text")).toBeInTheDocument()

    const closeBtn = screen.getByRole("button", { name: "Cancel" })
    await user.click(closeBtn)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

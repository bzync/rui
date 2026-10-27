import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { CommandPalette, CommandProvider, ConfirmDialog, CopyButton, DatePicker, Drawer, DropdownMenu, InfoButton, Modal, Popover, PopoverContent, Select, SnackbarProvider, ThemeProvider, TimePicker, Tooltip, useSnackbar } from "@/index"

describe("overlay and feedback components", () => {
  it("renders every anchored overlay outside a clipping table container, inside the theme scope", async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider defaultTheme="dark" storageKey={false}>
        <div data-testid="clip" style={{ overflow: "hidden", transform: "translateZ(0)" }}>
          <table><tbody><tr>
            <td><Popover trigger={<button>Filters</button>}><PopoverContent>Popover body</PopoverContent></Popover></td>
            <td><DropdownMenu trigger={<button>Row actions</button>} items={[{ label: "Archive" }]} /></td>
            <td><Tooltip content="Tooltip body"><button>Help</button></Tooltip></td>
            <td><DatePicker label="Due date" /></td>
            <td><TimePicker label="Start time" /></td>
          </tr></tbody></table>
        </div>
      </ThemeProvider>,
    )
    const clip = screen.getByTestId("clip")
    const escapes = (element: HTMLElement) => {
      expect(clip).not.toContainElement(element)
      // Still inside a themed scope, so dark mode and palette overrides apply.
      expect(element.closest(".rui-theme")).toHaveClass("dark")
      expect(element.style.position).toBe("fixed")
    }

    await user.click(screen.getByRole("button", { name: "Filters" }))
    escapes(await screen.findByRole("dialog", { name: "Popover" }))
    await user.keyboard("{Escape}")

    await user.click(screen.getByRole("button", { name: "Row actions" }))
    escapes(await screen.findByRole("menu"))
    await user.keyboard("{Escape}")

    await user.hover(screen.getByRole("button", { name: "Help" }))
    escapes(await screen.findByRole("tooltip"))
    await user.unhover(screen.getByRole("button", { name: "Help" }))

    await user.click(screen.getByRole("button", { name: "Due date" }))
    const datePanel = await screen.findByRole("dialog", { name: "Choose due date" })
    expect(clip).not.toContainElement(datePanel)
    expect(datePanel.closest(".rui-theme")).toHaveClass("dark")
    await user.keyboard("{Escape}")

    await user.click(screen.getByRole("button", { name: "Start time" }))
    const timePanel = await screen.findByRole("dialog", { name: "Choose start time" })
    expect(clip).not.toContainElement(timePanel)
    // Moving focus between columns inside the portalled panel keeps it open.
    await user.tab()
    expect(screen.getByRole("dialog", { name: "Choose start time" })).toBeInTheDocument()
  })

  it("keeps a portalled popover's form interactive and closes on outside click", async () => {
    const user = userEvent.setup()
    render(<><Popover trigger={<button>Invite</button>}><PopoverContent><input aria-label="Email" /></PopoverContent></Popover><p>Outside</p></>)
    await user.click(screen.getByRole("button", { name: "Invite" }))
    const email = await screen.findByRole("textbox", { name: "Email" })
    await vi.waitFor(() => expect(email).toHaveFocus())
    await user.type(email, "ops@acme.dev")
    expect(email).toHaveValue("ops@acme.dev")
    await user.click(screen.getByText("Outside"))
    await vi.waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })

  it("opens dropdown menus and calls actions", async () => {
    const user = userEvent.setup(); const action = vi.fn()
    render(<DropdownMenu trigger={<button>Actions</button>} items={[{ label: "Deploy", onClick: action }]} />)
    await user.click(screen.getByRole("button", { name: "Actions" })); await user.click(await screen.findByText("Deploy")); expect(action).toHaveBeenCalledOnce()
  })

  it("navigates dropdown menus with the keyboard and restores trigger focus", async () => {
    const user = userEvent.setup()
    render(<DropdownMenu trigger={<button>Actions</button>} items={[{ label: "Deploy" }, { label: "Delete", destructive: true }]} />)
    await user.click(screen.getByRole("button", { name: "Actions" }))
    await vi.waitFor(() => expect(screen.getByRole("menuitem", { name: "Deploy" })).toHaveFocus())
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus()
    await user.keyboard("{Escape}")
    await vi.waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument())
    expect(screen.getByRole("button", { name: "Actions" })).toHaveFocus()
  })

  it("renders open modal and drawer portals", () => {
    render(<><Modal open onClose={() => {}} title="Dialog" className="custom-modal" headerClassName="custom-modal-header" contentClassName="custom-modal-content">Body</Modal><Drawer open onClose={() => {}} title="Panel" className="custom-drawer" headerClassName="custom-drawer-header" contentClassName="custom-drawer-content">Drawer body</Drawer></>)
    expect(screen.getByText("Dialog")).toBeInTheDocument(); expect(screen.getByText("Drawer body")).toBeInTheDocument()
    expect(screen.getByRole("dialog", { name: "Dialog" })).toHaveClass("custom-modal")
    expect(screen.getByText("Dialog").closest(".custom-modal-header")).toBeInTheDocument()
    expect(screen.getByText("Body")).toHaveClass("custom-modal-content")
    expect(screen.getByRole("dialog", { name: "Panel" })).toHaveClass("custom-drawer")
    expect(screen.getByText("Drawer body")).toHaveClass("custom-drawer-content")
  })

  it("labels modals, traps focus, closes on Escape, and restores focus", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { rerender } = render(
      <>
        <button>Before dialog</button>
        <Modal open={false} onClose={onClose} title="Settings" description="Account preferences">
          <button>Save</button>
          <button>Cancel</button>
        </Modal>
      </>,
    )
    const trigger = screen.getByRole("button", { name: "Before dialog" })
    trigger.focus()
    rerender(
      <>
        <button>Before dialog</button>
        <Modal open onClose={onClose} title="Settings" description="Account preferences">
          <button>Save</button>
          <button>Cancel</button>
        </Modal>
      </>,
    )

    const dialog = await screen.findByRole("dialog", { name: "Settings" })
    expect(dialog).toHaveAccessibleDescription("Account preferences")
    await vi.waitFor(() => expect(screen.getByRole("button", { name: "Save" })).toHaveFocus())
    screen.getByRole("button", { name: "Cancel" }).focus()
    await user.tab()
    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus()
    await user.keyboard("{Escape}")
    expect(onClose).toHaveBeenCalledOnce()

    rerender(
      <>
        <button>Before dialog</button>
        <Modal open={false} onClose={onClose} title="Settings">Content</Modal>
      </>,
    )
    await vi.waitFor(() => expect(screen.getByRole("button", { name: "Before dialog" })).toHaveFocus())
  })

  it("shows labelled tooltips after keyboard focus", async () => {
    const user = userEvent.setup()
    render(<Tooltip content="Helpful" delayMs={0}><button>Help</button></Tooltip>)
    await user.tab()
    const tooltip = await screen.findByRole("tooltip")
    expect(tooltip).toHaveTextContent("Helpful")
    expect(screen.getByRole("button", { name: "Help" })).toHaveAttribute("aria-describedby", tooltip.id)
  })

  it("opens command palette and selects a command", async () => {
    const user = userEvent.setup(); const selected = vi.fn()
    render(<CommandProvider><CommandPalette items={[{ id: "deploy", label: "Deploy", onSelect: selected }]} /></CommandProvider>)
    await user.keyboard("{Meta>}k{/Meta}")
    const input = await screen.findByRole("combobox", { name: "Command palette" }); await user.type(input, "Deploy"); await user.keyboard("{Enter}")
    expect(selected).toHaveBeenCalledOnce()
  })

  it("composes command-palette surface classes", async () => {
    const user = userEvent.setup()
    render(<CommandProvider><CommandPalette className="custom-command" overlayClassName="custom-command-overlay" searchClassName="custom-command-search" inputClassName="custom-command-input" listClassName="custom-command-list" itemClassName="custom-command-item" items={[{ id: "deploy", label: "Deploy", onSelect: () => {} }]} /></CommandProvider>)
    await user.keyboard("{Meta>}k{/Meta}")
    expect(await screen.findByRole("dialog", { name: "Command palette" })).toHaveClass("custom-command")
    expect(screen.getByRole("combobox", { name: "Command palette" })).toHaveClass("custom-command-input")
    expect(screen.getByRole("listbox", { name: "Commands" })).toHaveClass("custom-command-list")
    expect(screen.getByRole("option", { name: "Deploy" })).toHaveClass("custom-command-item")
    expect(document.querySelector(".custom-command-overlay")).toBeInTheDocument()
  })

  it("copies values and exposes info-button labels", async () => {
    const user = userEvent.setup(); const info = vi.fn()
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined)
    render(<><CopyButton value="token" label="Copy token" /><InfoButton label="More information" onClick={info} /></>)
    await user.click(screen.getByRole("button", { name: "Copy token" })); expect(writeText).toHaveBeenCalledWith("token")
    await user.click(screen.getByRole("button", { name: "More information" })); expect(info).toHaveBeenCalledOnce()
  })

  it("shows snackbar messages through its provider", async () => {
    const user = userEvent.setup()
    function Trigger() { const { show } = useSnackbar(); return <button onClick={() => show({ message: "Saved", duration: 0 })}>Notify</button> }
    render(<SnackbarProvider><Trigger /></SnackbarProvider>)
    await user.click(screen.getByRole("button", { name: "Notify" })); expect(await screen.findByText("Saved")).toBeInTheDocument()
  })

  it("composes snackbar provider and per-toast classes", async () => {
    const user = userEvent.setup()
    function Trigger() { const { show } = useSnackbar(); return <button onClick={() => show({ message: "Styled", duration: 0, className: "custom-toast-item" })}>Notify styled</button> }
    render(<SnackbarProvider className="custom-snackbar-region" toastClassName="custom-toast"><Trigger /></SnackbarProvider>)
    await user.click(screen.getByRole("button", { name: "Notify styled" }))
    expect(await screen.findByRole("region", { name: "Notifications" })).toHaveClass("custom-snackbar-region")
    expect(screen.getByText("Styled").closest("[class*='custom-toast']")).toHaveClass("custom-toast", "custom-toast-item")
  })
})

describe("portalled dialogs", () => {
  it("renders Modal and ConfirmDialog outside a clipping ancestor, with an inline opt-out", () => {
    render(
      <div data-testid="table-cell" style={{ overflow: "hidden", transform: "translateZ(0)" }}>
        <Modal open onClose={() => {}} title="Edit invoice">Body</Modal>
        <ConfirmDialog open onClose={() => {}} onConfirm={() => {}} title="Delete payment?" destructive />
        <Modal open onClose={() => {}} title="Inline" portalled={false}>Inline body</Modal>
      </div>,
    )
    const cell = screen.getByTestId("table-cell")
    for (const name of ["Edit invoice", "Delete payment?"]) {
      const dialog = screen.getByRole("dialog", { name })
      expect(cell).not.toContainElement(dialog)
      expect(document.body).toContainElement(dialog)
    }
    expect(cell).toContainElement(screen.getByRole("dialog", { name: "Inline" }))
  })

  it("carries the theme scope into a portalled Modal", () => {
    render(<ThemeProvider storageKey={false} theme="dark"><Modal open onClose={() => {}} title="Scoped">Body</Modal></ThemeProvider>)
    const scope = screen.getByRole("dialog", { name: "Scoped" }).closest("[data-rui-portal]")
    expect(scope).toHaveClass("rui-theme", "dark")
    expect(scope?.parentElement).toBe(document.body)
  })

  it("hydrates server HTML containing closed and open overlays without a mismatch", async () => {
    const tree = (
      <ThemeProvider storageKey={false} defaultTheme="light" palette={{ accent: { 600: "#7c3aed" } }}>
        <p>Page</p>
        <Drawer open={false} onClose={() => {}} title="Nav">Links</Drawer>
        <Select label="Region" options={[{ value: "sg", label: "Singapore" }]} />
        <Modal open onClose={() => {}} title="Welcome">Hello</Modal>
      </ThemeProvider>
    )
    const host = document.createElement("div")
    host.innerHTML = renderToString(tree)
    document.body.append(host)
    expect(host.querySelector("[role=dialog]")).toBeNull()

    const recoverable = vi.fn()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    let root: ReturnType<typeof hydrateRoot> | undefined
    await act(async () => { root = hydrateRoot(host, tree, { onRecoverableError: recoverable }) })
    expect(recoverable).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    expect(await screen.findByRole("dialog", { name: "Welcome" })).toBeInTheDocument()
    act(() => root?.unmount())
    host.remove()
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { CommandPalette, CommandProvider, CopyButton, Drawer, DropdownMenu, InfoButton, Modal, SnackbarProvider, Tooltip, useSnackbar } from "@/index"

describe("overlay and feedback components", () => {
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

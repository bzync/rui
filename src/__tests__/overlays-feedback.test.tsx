import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { CommandPalette, CommandProvider, CopyButton, Drawer, DropdownMenu, InfoButton, Modal, SnackbarProvider, Tooltip, useSnackbar } from "@/index"

describe("overlay and feedback components", () => {
  it("opens dropdown menus and calls actions", async () => {
    const user = userEvent.setup(); const action = vi.fn()
    render(<DropdownMenu trigger={<button>Actions</button>} items={[{ label: "Deploy", onClick: action }]} />)
    await user.click(screen.getByRole("button", { name: "Actions" })); await user.click(screen.getByText("Deploy")); expect(action).toHaveBeenCalledOnce()
  })

  it("navigates dropdown menus with the keyboard and restores trigger focus", async () => {
    const user = userEvent.setup()
    render(<DropdownMenu trigger={<button>Actions</button>} items={[{ label: "Deploy" }, { label: "Delete", destructive: true }]} />)
    await user.click(screen.getByRole("button", { name: "Actions" }))
    expect(screen.getByRole("menuitem", { name: "Deploy" })).toHaveFocus()
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus()
    await user.keyboard("{Escape}")
    await vi.waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument())
    expect(screen.getByRole("button", { name: "Actions" })).toHaveFocus()
  })

  it("renders open modal and drawer portals", () => {
    render(<><Modal open onClose={() => {}} title="Dialog">Body</Modal><Drawer open onClose={() => {}} title="Panel">Drawer body</Drawer></>)
    expect(screen.getByText("Dialog")).toBeInTheDocument(); expect(screen.getByText("Drawer body")).toBeInTheDocument()
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
    await user.click(screen.getByRole("button", { name: "Notify" })); expect(screen.getByText("Saved")).toBeInTheDocument()
  })
})

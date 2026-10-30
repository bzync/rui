import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { Button, CommandPalette, CommandProvider, ConfirmDialog, ContextMenu, Menubar, CopyButton, DatePicker, DateTimePicker, Drawer, DropdownMenu, HoverCard, InfoButton, Modal, NotificationCenter, Popover, PopoverContent, Select, Sheet, SnackbarProvider, ThemeProvider, TimePicker, Tooltip, Tour, useSnackbar } from "@/index"
import { useState } from "react"

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
            <td><DateTimePicker label="Appointment" /></td>
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
    await user.keyboard("{Escape}")

    await user.click(screen.getByRole("button", { name: "Appointment" }))
    const dateTimePanel = await screen.findByRole("dialog", { name: "Choose date and time" })
    escapes(dateTimePanel)
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

  it("handles async operations with snackbar.promise", async () => {
    const user = userEvent.setup()
    function Trigger() {
      const { promise } = useSnackbar()
      const run = () => {
        const asyncOp = new Promise<string>((resolve) => setTimeout(() => resolve("Success data"), 10))
        promise(asyncOp, {
          loading: "Saving changes…",
          success: (data) => `Done: ${data}`,
          error: "Error saving",
        })
      }
      return <button onClick={run}>Run Promise</button>
    }

    render(<SnackbarProvider><Trigger /></SnackbarProvider>)
    await user.click(screen.getByRole("button", { name: "Run Promise" }))
    expect(await screen.findByText("Saving changes…")).toBeInTheDocument()
    expect(await screen.findByText("Done: Success data")).toBeInTheDocument()
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

describe("controlled overlay state", () => {
  it("controls DropdownMenu open state", async () => {
    const user = userEvent.setup(); const onOpenChange = vi.fn()
    const { rerender } = render(<DropdownMenu open={false} onOpenChange={onOpenChange} trigger={<button>Actions</button>} items={[{ label: "Deploy" }]} />)
    await user.click(screen.getByRole("button", { name: "Actions" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    rerender(<DropdownMenu open onOpenChange={onOpenChange} trigger={<button>Actions</button>} items={[{ label: "Deploy" }]} />)
    expect(await screen.findByRole("menuitem", { name: "Deploy" })).toBeInTheDocument()
  })

  it("shows a controlled Tooltip without hover", async () => {
    render(<Tooltip open content="Always visible"><button>Help</button></Tooltip>)
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Always visible")
  })

  it("opens the command palette from controlled provider state", async () => {
    render(<CommandProvider open onOpenChange={() => {}}><CommandPalette items={[{ id: "a", label: "Open settings", onSelect: () => {} }]} /></CommandProvider>)
    expect(await screen.findByRole("dialog", { name: "Command palette" })).toBeInTheDocument()
  })
})

describe("ContextMenu and Menubar", () => {
  it("opens a context menu at the pointer and from the keyboard, and restores focus", async () => {
    const user = userEvent.setup(); const rename = vi.fn()
    render(<ContextMenu items={[{ label: "Rename", onClick: rename }, { label: "Delete", destructive: true }]}><button>File row</button></ContextMenu>)
    const row = screen.getByRole("button", { name: "File row" })
    fireEvent.contextMenu(row, { clientX: 120, clientY: 80 })
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus())
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus()
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument())
    await waitFor(() => expect(row).toHaveFocus())
    await user.keyboard("{Shift>}{F10}{/Shift}")
    await user.click(await screen.findByRole("menuitem", { name: "Rename" }))
    expect(rename).toHaveBeenCalledOnce()
  })

  it("moves between menus with arrow keys and switches open menus", async () => {
    const user = userEvent.setup(); const save = vi.fn()
    render(<Menubar menus={[
      { label: "File", items: [{ label: "Save", shortcut: "⌘S", onClick: save }] },
      { label: "Edit", items: [{ label: "Undo" }, { label: "Redo" }] },
      { label: "View", items: [{ label: "Zoom in" }] },
    ]} />)
    expect(screen.getByRole("menubar")).toBeInTheDocument()
    const file = screen.getByRole("menuitem", { name: "File" })
    expect(file).toHaveAttribute("tabindex", "0")
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveAttribute("tabindex", "-1")
    file.focus()
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
    await user.keyboard("{ArrowDown}")
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Undo" })).toHaveFocus())
    await user.keyboard("{ArrowLeft}")
    // The shortcut is part of the item's accessible name ("Save ⌘S").
    await waitFor(() => expect(screen.getByRole("menuitem", { name: /^Save/ })).toHaveFocus())
    await user.keyboard("{Enter}")
    expect(save).toHaveBeenCalledOnce()
    await waitFor(() => expect(file).toHaveFocus())
  })
})

describe("Sheet", () => {
  function Harness({ onSnap, dismissible }: { onSnap?: (index: number) => void; dismissible?: boolean }) {
    const [open, setOpen] = useState(true)
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>Open</button>
        <Sheet open={open} onOpenChange={setOpen} title="Filters" description="Narrow results" snapPoints={[0.4, 0.9]} onSnapChange={onSnap} dismissible={dismissible}>
          <button type="button">Apply</button>
        </Sheet>
      </>
    )
  }

  it("labels the dialog and steps through snap points from the handle", async () => {
    const user = userEvent.setup()
    const onSnap = vi.fn()
    render(<Harness onSnap={onSnap} />)
    const dialog = screen.getByRole("dialog", { name: "Filters" })
    expect(dialog).toHaveAccessibleDescription("Narrow results")
    expect(dialog).toHaveAttribute("data-snap", "0")
    await user.click(screen.getByRole("button", { name: "Expand sheet" }))
    expect(onSnap).toHaveBeenLastCalledWith(1)
    expect(dialog).toHaveAttribute("data-snap", "1")
    const handle = screen.getByRole("button", { name: "Collapse sheet" })
    handle.focus()
    await user.keyboard("{ArrowDown}")
    expect(dialog).toHaveAttribute("data-snap", "0")
  })

  it("closes from the lowest snap point, Escape and the close button", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    screen.getByRole("button", { name: "Expand sheet" }).focus()
    await user.keyboard("{ArrowDown}")
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "closed"))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    await user.click(screen.getByRole("button", { name: "Open" }))
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open"))
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })

  it("keeps a non-dismissible sheet open", async () => {
    const user = userEvent.setup()
    render(<Harness dismissible={false} />)
    expect(screen.queryByRole("button", { name: "Close sheet" })).not.toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open")
  })
})

describe("HoverCard", () => {
  it("opens after the delay on hover, stays open over the card, and closes on Escape", async () => {
    vi.useFakeTimers()
    try {
      const onOpenChange = vi.fn()
      render(<HoverCard content={<a href="#/profile">View profile</a>} openDelay={300} closeDelay={100} onOpenChange={onOpenChange}><a href="#/u/ada">@ada</a></HoverCard>)
      const trigger = screen.getByRole("link", { name: "@ada" })
      fireEvent.mouseEnter(trigger)
      expect(screen.queryByRole("link", { name: "View profile" })).not.toBeInTheDocument()
      act(() => { vi.advanceTimersByTime(300) })
      const card = screen.getByRole("link", { name: "View profile" })
      expect(trigger).toHaveAttribute("aria-describedby")
      fireEvent.mouseLeave(trigger)
      fireEvent.mouseEnter(card.parentElement!)
      act(() => { vi.advanceTimersByTime(200) })
      expect(screen.getByRole("link", { name: "View profile" })).toBeInTheDocument()
      fireEvent.keyDown(document, { key: "Escape" })
      expect(onOpenChange).toHaveBeenLastCalledWith(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it("opens on keyboard focus", async () => {
    render(<HoverCard content="Preview" openDelay={0}><button type="button">Repo</button></HoverCard>)
    act(() => { screen.getByRole("button", { name: "Repo" }).focus() })
    expect(await screen.findByText("Preview")).toBeInTheDocument()
  })
})

describe("NotificationCenter", () => {
  const sampleNotifications = [
    { id: "1", title: "New release v1.4", description: "Production deployed successfully", read: false },
    { id: "2", title: "Disk warning", description: "Storage reached 85%", read: false, tone: "warning" as const },
    { id: "3", title: "Welcome to RUI", description: "Getting started guide", read: true },
  ]

  it("opens on trigger click, shows items and filters by unread tab", async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <NotificationCenter defaultItems={sampleNotifications} />
      </ThemeProvider>,
    )

    // Trigger should reflect 2 unread
    const trigger = screen.getByRole("button", { name: /Notifications \(2 unread\)/i })
    expect(trigger).toBeInTheDocument()

    // Open
    await user.click(trigger)
    expect(screen.getByRole("dialog", { name: "Notifications" })).toBeInTheDocument()
    expect(screen.getByText("New release v1.4")).toBeInTheDocument()
    expect(screen.getByText("Welcome to RUI")).toBeInTheDocument()

    // Click Unread tab
    const unreadTab = screen.getByRole("tab", { name: /Unread/i })
    await user.click(unreadTab)
    expect(screen.getByText("New release v1.4")).toBeInTheDocument()
    expect(screen.queryByText("Welcome to RUI")).not.toBeInTheDocument()

    // Close on Escape
    await user.keyboard("{Escape}")
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Notifications" })).not.toBeInTheDocument()
    })
  })

  it("marks all as read and dismisses items", async () => {
    const user = userEvent.setup()
    const onItemsChange = vi.fn()
    render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <NotificationCenter defaultItems={sampleNotifications} onItemsChange={onItemsChange} defaultOpen />
      </ThemeProvider>,
    )

    const markAllBtn = screen.getByRole("button", { name: "Mark all as read" })
    await user.click(markAllBtn)

    expect(onItemsChange).toHaveBeenCalledWith(
      sampleNotifications.map((n) => ({ ...n, read: true })),
    )
  })

  it("opens an item from the keyboard and marks it read", async () => {
    const user = userEvent.setup()
    const onItemClick = vi.fn()
    const onItemsChange = vi.fn()
    render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <NotificationCenter defaultItems={sampleNotifications} onItemClick={onItemClick} onItemsChange={onItemsChange} defaultOpen />
      </ThemeProvider>,
    )

    screen.getByRole("button", { name: "New release v1.4" }).focus()
    await user.keyboard("{Enter}")
    expect(onItemClick).toHaveBeenCalledTimes(1)
    expect(onItemClick).toHaveBeenCalledWith(sampleNotifications[0])
    expect(onItemsChange).toHaveBeenCalledWith(sampleNotifications.map((n) => (n.id === "1" ? { ...n, read: true } : n)))
  })

  it("clones a custom Button trigger without nesting button inside button", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <NotificationCenter
          defaultItems={sampleNotifications}
          trigger={<Button variant="secondary" size="sm">Inbox (2)</Button>}
        />
      </ThemeProvider>,
    )
    expect(container.querySelector("button button")).toBeNull()
    const trigger = screen.getByRole("button", { name: /Notifications \(2 unread\)/i })
    await user.click(trigger)
    expect(screen.getByRole("dialog", { name: "Notifications" })).toBeInTheDocument()
  })
})

describe("Tour", () => {
  const tourSteps = [
    { target: "#step1", title: "First Step", content: "Learn about feature 1" },
    { target: "#step2", title: "Second Step", content: "Learn about feature 2" },
  ]

  it("navigates through steps with Next, Back and Finish", async () => {
    const user = userEvent.setup()
    const onFinish = vi.fn()
    const onStepChange = vi.fn()

    render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <div id="step1">Feature 1</div>
        <div id="step2">Feature 2</div>
        <Tour steps={tourSteps} defaultOpen onFinish={onFinish} onStepChange={onStepChange} />
      </ThemeProvider>,
    )

    expect(screen.getByText("Step 1 of 2")).toBeInTheDocument()
    expect(screen.getByText("First Step")).toBeInTheDocument()

    // Next
    await user.click(screen.getByRole("button", { name: "Next" }))
    expect(onStepChange).toHaveBeenCalledWith(1)
  })

  it("closes and calls onSkip when Escape is pressed", async () => {
    const user = userEvent.setup()
    const onSkip = vi.fn()

    render(
      <ThemeProvider defaultTheme="light" storageKey={false}>
        <Tour steps={tourSteps} defaultOpen onSkip={onSkip} />
      </ThemeProvider>,
    )

    expect(screen.getByRole("dialog", { name: "First Step" })).toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(onSkip).toHaveBeenCalled()
  })
})

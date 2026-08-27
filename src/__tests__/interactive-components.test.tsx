import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  Accordion, Alert, BillingIntervalToggle, Button, ButtonGroup, Collapsible, ConfirmDialog,
  IconButton, NumberInput, Pagination, Popover, PopoverContent, Tabs, TabsContent,
  TabsList, TabsTrigger, Tag, Toggle, ToggleGroup, ToggleGroupItem, Tree,
} from "@/index"

describe("interactive component contracts", () => {
  it("handles button loading and icon-button accessibility", () => {
    render(<><Button loading>Save</Button><IconButton label="Menu">☰</IconButton></>)
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument()
  })

  it("opens accordion and collapsible content", async () => {
    const user = userEvent.setup()
    render(<><Accordion items={[{ id: "a", trigger: "Question", content: "Answer" }]} /><Collapsible trigger="Advanced">Settings</Collapsible></>)
    await user.click(screen.getByRole("button", { name: "Question" }))
    expect(screen.getByText("Answer")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Advanced" }))
    expect(screen.getByText("Settings")).toBeInTheDocument()
  })

  it("dismisses alerts and removes tags", async () => {
    const user = userEvent.setup()
    const dismiss = vi.fn(); const remove = vi.fn()
    render(<><Alert title="Warning" dismissable onDismiss={dismiss}>Careful</Alert><Tag onRemove={remove}>Backend</Tag></>)
    await user.click(screen.getByRole("button", { name: /dismiss/i }))
    await user.click(screen.getByRole("button", { name: /remove backend/i }))
    expect(dismiss).toHaveBeenCalledOnce(); expect(remove).toHaveBeenCalledOnce()
  })

  it("changes billing interval, number, and pagination", async () => {
    const user = userEvent.setup()
    const billing = vi.fn(); const number = vi.fn(); const page = vi.fn()
    render(<><BillingIntervalToggle value="monthly" onChange={billing} /><NumberInput label="Count" defaultValue={1} onChange={number} /><Pagination page={2} totalPages={4} onPageChange={page} /></>)
    await user.click(screen.getByRole("button", { name: /Annually/ }))
    expect(billing).toHaveBeenCalledWith("yearly")
    await user.click(screen.getByRole("button", { name: /increase/i }))
    expect(number).toHaveBeenCalledWith(2)
    await user.click(screen.getByRole("button", { name: "Page 3" }))
    expect(page).toHaveBeenCalledWith(3)
  })

  it("switches tabs and selects tree nodes", async () => {
    const user = userEvent.setup(); const selected = vi.fn()
    render(<><Tabs defaultValue="one"><TabsList><TabsTrigger value="one">One</TabsTrigger><TabsTrigger value="two">Two</TabsTrigger></TabsList><TabsContent value="one">First</TabsContent><TabsContent value="two">Second</TabsContent></Tabs><Tree nodes={[{ id: "root", label: "Root", children: [{ id: "child", label: "Child" }] }]} defaultExpanded={["root"]} onSelect={selected} /></>)
    await user.click(screen.getByRole("tab", { name: "Two" })); expect(screen.getByText("Second")).toBeInTheDocument()
    await user.click(screen.getByText("Child")); expect(selected).toHaveBeenCalledWith("child")
  })

  it("supports controlled and uncontrolled toggle buttons", async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(<><Toggle defaultPressed onPressedChange={onPressedChange}>Bold</Toggle><Toggle pressed={false}>Italic</Toggle></>)

    const bold = screen.getByRole("button", { name: "Bold" })
    expect(bold).toHaveAttribute("aria-pressed", "true")
    await user.click(bold)
    expect(bold).toHaveAttribute("aria-pressed", "false")
    expect(onPressedChange).toHaveBeenCalledWith(false)

    const italic = screen.getByRole("button", { name: "Italic" })
    await user.click(italic)
    expect(italic).toHaveAttribute("aria-pressed", "false")
  })

  it("groups related buttons without changing their native behavior", async () => {
    const user = userEvent.setup()
    const save = vi.fn()
    render(<ButtonGroup aria-label="Document actions" orientation="vertical"><Button variant="secondary" onClick={save}>Save</Button><Button variant="secondary">Share</Button></ButtonGroup>)

    expect(screen.getByRole("group", { name: "Document actions" })).toHaveAttribute("data-orientation", "vertical")
    await user.click(screen.getByRole("button", { name: "Save" }))
    expect(save).toHaveBeenCalledOnce()
  })

  it("selects toggle group values and provides arrow-key focus movement", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="multiple" defaultValue={["bold"]} onValueChange={onValueChange} aria-label="Formatting">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="strike" disabled>Strike</ToggleGroupItem>
      </ToggleGroup>,
    )

    const bold = screen.getByRole("button", { name: "Bold" })
    const italic = screen.getByRole("button", { name: "Italic" })
    expect(bold).toHaveAttribute("aria-pressed", "true")
    await user.click(italic)
    expect(italic).toHaveAttribute("aria-pressed", "true")
    expect(onValueChange).toHaveBeenCalledWith(["bold", "italic"])

    bold.focus()
    await user.keyboard("{ArrowRight}")
    expect(italic).toHaveFocus()
    await user.keyboard("{ArrowRight}")
    expect(bold).toHaveFocus()
  })

  it("moves through tabs with arrow, Home, and End keys", async () => {
    const user = userEvent.setup()
    render(<Tabs defaultValue="one"><TabsList><TabsTrigger value="one">One</TabsTrigger><TabsTrigger value="two">Two</TabsTrigger><TabsTrigger value="three">Three</TabsTrigger></TabsList><TabsContent value="one">First</TabsContent><TabsContent value="two">Second</TabsContent><TabsContent value="three">Third</TabsContent></Tabs>)
    screen.getByRole("tab", { name: "One" }).focus()
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus()
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true")
    await user.keyboard("{End}")
    expect(screen.getByText("Third")).toBeInTheDocument()
    await user.keyboard("{Home}")
    expect(screen.getByText("First")).toBeInTheDocument()
  })

  it("opens popovers and confirms dialogs", async () => {
    const user = userEvent.setup(); const confirm = vi.fn()
    render(<><Popover trigger={<button>Open help</button>}><PopoverContent>Helpful text</PopoverContent></Popover><ConfirmDialog open onClose={() => {}} onConfirm={confirm} title="Continue?" /></>)
    await user.click(screen.getByRole("button", { name: "Open help" })); expect(screen.getByText("Helpful text")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Confirm" })); expect(confirm).toHaveBeenCalledOnce()
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  Accordion, Alert, BillingIntervalToggle, Breadcrumb, Stepper, Button, ButtonGroup, Collapsible, ConfirmDialog,
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

  it("exposes billing interval selection and composes native root props", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(
      <BillingIntervalToggle
        ref={ref}
        value="yearly"
        onChange={() => {}}
        aria-label="Plan billing interval"
        data-testid="billing-toggle"
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Annually", badge: "Save 20%" },
        ]}
      />,
    )

    expect(screen.getByRole("group", { name: "Plan billing interval" })).toBe(ref.current)
    expect(screen.getByTestId("billing-toggle")).toHaveClass("bg-surface-muted")
    expect(screen.getByRole("button", { name: "Monthly" })).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByRole("button", { name: /Annually/ })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("Save 20%")).toHaveClass("text-success")
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

  it("lays tab icons out inline by default, with right and top positions", () => {
    const icon = <svg data-testid="icon" />
    render(<Tabs defaultValue="left"><TabsList>
      <TabsTrigger value="left" icon={icon}>Left</TabsTrigger>
      <TabsTrigger value="right" icon={icon} iconPosition="right">Right</TabsTrigger>
      <TabsTrigger value="top" icon={icon} iconPosition="top">Top</TabsTrigger>
    </TabsList></Tabs>)
    const left = screen.getByRole("tab", { name: "Left" })
    const right = screen.getByRole("tab", { name: "Right" })
    const top = screen.getByRole("tab", { name: "Top" })
    // Flex row keeps the (block-level) svg beside the label instead of above it.
    expect(left).toHaveClass("inline-flex", "items-center")
    expect(left).not.toHaveClass("flex-col")
    expect(left.lastElementChild).toHaveTextContent("Left")
    expect(right.lastElementChild).toContainElement(screen.getAllByTestId("icon")[1])
    expect(top).toHaveClass("flex-col")
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

  it("composes popover and confirmation-dialog surface classes", async () => {
    const user = userEvent.setup()
    render(<><Popover wrapperClassName="custom-popover-wrapper" className="custom-popover" trigger={<button>Open styled help</button>}>Help</Popover><ConfirmDialog open onClose={() => {}} onConfirm={() => {}} title="Styled dialog" className="custom-confirm" actionsClassName="custom-confirm-actions" cancelButtonClassName="custom-cancel" confirmButtonClassName="custom-confirm-button" /></>)
    await user.click(screen.getByRole("button", { name: "Open styled help" }))
    expect(screen.getByRole("dialog", { name: "Popover" })).toHaveClass("custom-popover")
    expect(screen.getByRole("button", { name: "Open styled help" }).parentElement).toHaveClass("custom-popover-wrapper")
    expect(screen.getByRole("dialog", { name: "Styled dialog" })).toHaveClass("custom-confirm")
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass("custom-cancel")
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveClass("custom-confirm-button")
  })
})

describe("controlled and uncontrolled state", () => {
  it("controls accordion panels with value/onValueChange", async () => {
    const user = userEvent.setup(); const onValueChange = vi.fn()
    const items = [{ id: "a", trigger: "Alpha", content: "Alpha body" }, { id: "b", trigger: "Beta", content: "Beta body" }]
    const { rerender } = render(<Accordion items={items} value={["a"]} onValueChange={onValueChange} />)
    expect(screen.getByText("Alpha body")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Beta" }))
    expect(onValueChange).toHaveBeenCalledWith(["b"])
    // Controlled: nothing changes until the parent passes the new value.
    expect(screen.queryByText("Beta body")).not.toBeInTheDocument()
    rerender(<Accordion items={items} value={["b"]} onValueChange={onValueChange} />)
    expect(screen.getByText("Beta body")).toBeInTheDocument()
  })

  it("lets controlled Tabs omit defaultValue", async () => {
    const user = userEvent.setup(); const onValueChange = vi.fn()
    render(<Tabs value="two" onValueChange={onValueChange}><TabsList><TabsTrigger value="one">One</TabsTrigger><TabsTrigger value="two">Two</TabsTrigger></TabsList><TabsContent value="one">First</TabsContent><TabsContent value="two">Second</TabsContent></Tabs>)
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true")
    await user.click(screen.getByRole("tab", { name: "One" }))
    expect(onValueChange).toHaveBeenCalledWith("one")
  })

  it("runs Pagination uncontrolled from defaultPage", async () => {
    const user = userEvent.setup(); const onPageChange = vi.fn()
    render(<Pagination totalPages={5} defaultPage={2} onPageChange={onPageChange} />)
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page")
    await user.click(screen.getByRole("button", { name: "Next page" }))
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page")
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it("supports uncontrolled Tree selection and controlled expansion", async () => {
    const user = userEvent.setup(); const onExpandedChange = vi.fn()
    const nodes = [{ id: "src", label: "src", children: [{ id: "app", label: "app.ts" }] }, { id: "readme", label: "README.md" }]
    render(<Tree nodes={nodes} defaultSelected="readme" expanded={[]} onExpandedChange={onExpandedChange} />)
    expect(screen.queryByText("app.ts")).not.toBeInTheDocument()
    await user.click(screen.getByText("src"))
    expect(onExpandedChange).toHaveBeenCalledWith(["src"])
    expect(screen.queryByText("app.ts")).not.toBeInTheDocument()
  })

  it("opens a Popover from defaultOpen", () => {
    render(<Popover defaultOpen trigger={<button>Filters</button>}><PopoverContent>Filter body</PopoverContent></Popover>)
    expect(screen.getByRole("button", { name: "Filters" })).toHaveAttribute("aria-expanded", "true")
  })
})

describe("tree keyboard support", () => {
  it("exposes tree semantics with one tab stop and arrow-key navigation", async () => {
    const user = userEvent.setup(); const onSelect = vi.fn()
    const nodes = [
      { id: "src", label: "src", children: [{ id: "app", label: "app.ts" }] },
      { id: "locked", label: "locked", disabled: true },
      { id: "readme", label: "README.md" },
    ]
    render(<Tree nodes={nodes} onSelect={onSelect} />)
    expect(screen.getByRole("tree")).toBeInTheDocument()
    const src = screen.getByRole("treeitem", { name: "src" })
    expect(src).toHaveAttribute("tabindex", "0")
    expect(screen.getByRole("treeitem", { name: "README.md" })).toHaveAttribute("tabindex", "-1")

    await user.tab()
    expect(src).toHaveFocus()
    await user.keyboard("{ArrowRight}")
    expect(src).toHaveAttribute("aria-expanded", "true")
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("treeitem", { name: "app.ts" })).toHaveFocus()
    // Disabled nodes are skipped.
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("treeitem", { name: "README.md" })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(onSelect).toHaveBeenCalledWith("readme")
    expect(screen.getByRole("treeitem", { name: "README.md" })).toHaveAttribute("aria-selected", "true")
    await user.keyboard("{Home}")
    expect(src).toHaveFocus()
    await user.keyboard("{ArrowLeft}")
    expect(src).toHaveAttribute("aria-expanded", "false")
  })
})

describe("disabled states and part classNames", () => {
  it("navigates back through a clickable Stepper and respects disabled", async () => {
    const user = userEvent.setup(); const onStepClick = vi.fn()
    const steps = [{ label: "Account" }, { label: "Billing" }, { label: "Review" }]
    const { rerender } = render(<Stepper steps={steps} current={2} onStepClick={onStepClick} labelClassName="custom-label" />)
    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")[2]).toHaveAttribute("aria-current", "step")
    expect(screen.getByText("Account")).toHaveClass("custom-label")
    await user.click(screen.getByRole("button", { name: /Account, completed/ }))
    expect(onStepClick).toHaveBeenCalledWith(0)
    // The current and upcoming steps are not buttons; disabled removes them all.
    expect(screen.queryByRole("button", { name: /Review/ })).not.toBeInTheDocument()
    rerender(<Stepper steps={steps} current={2} onStepClick={onStepClick} disabled />)
    expect(screen.queryAllByRole("button")).toHaveLength(0)
  })

  it("collapses a long Breadcrumb and styles its parts", () => {
    render(<Breadcrumb maxItems={3} linkClassName="crumb-link" currentClassName="crumb-current" items={[{ label: "Home", href: "/" }, { label: "Org", href: "/o" }, { label: "Team", href: "/t" }, { label: "Projects", href: "/p" }, { label: "Atlas" }]} />)
    expect(screen.getByText("Home")).toHaveClass("crumb-link")
    expect(screen.getByLabelText("2 hidden levels")).toHaveTextContent("…")
    expect(screen.queryByText("Org")).not.toBeInTheDocument()
    expect(screen.getByText("Projects")).toBeInTheDocument()
    expect(screen.getByText("Atlas")).toHaveClass("crumb-current")
  })

  it("disables Pagination, Accordion and Tree as a whole", async () => {
    const user = userEvent.setup(); const onPageChange = vi.fn()
    render(<>
      <Pagination totalPages={4} disabled onPageChange={onPageChange} itemClassName="page-item" />
      <Accordion disabled triggerClassName="acc-trigger" items={[{ id: "a", trigger: "Alpha", content: "Body" }]} />
      <Tree disabled nodeClassName="tree-node" nodes={[{ id: "a", label: "alpha" }]} />
    </>)
    expect(screen.getByRole("button", { name: "Page 2" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveClass("page-item")
    expect(screen.getByRole("button", { name: "Alpha" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveClass("acc-trigger")
    expect(screen.getByRole("treeitem", { name: "alpha" })).toHaveAttribute("aria-disabled", "true")
    expect(screen.getByRole("treeitem", { name: "alpha" })).toHaveClass("tree-node")
  })
})

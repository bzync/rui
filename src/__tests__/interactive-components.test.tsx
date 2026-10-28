import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  Accordion, Alert, BillingIntervalToggle, Breadcrumb, Stepper, Button, ButtonGroup,
  Collapsible, CollapsibleTrigger, CollapsibleContent, ColorPicker, ConfirmDialog,
  DateTimePreset, DateTimePicker, DndContext, Droppable, Draggable, DragHandle, DragOverlay,
  useDraggable, useDroppable,
  IconButton, InlineEdit, Kanban, NumberInput, Pagination, Popover, PopoverContent,
  RangeSlider, SortableList, Tabs, TabsContent, TabsList, TabsTrigger, Tag, Toggle,
  ToggleGroup, ToggleGroupItem, Tree,
  PanoEngine, PanoViewer, PanoTourButton, PanoTourDialog, PanoTourEditor, createEquirectangularDemoUrl, nameFromFile,
  safeImageSrc, safeExternalUrl, videoEmbed, sanitizePanoScenes,
  type PanoScene,
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
    expect(screen.getByText("Save 20%")).toHaveClass("text-success-strong")
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

describe("SortableList and Kanban", () => {
  it("reorders list items using the keyboard and announces progress", async () => {
    const user = userEvent.setup()
    const onReorder = vi.fn()
    const items = [
      { id: "1", title: "Item 1" },
      { id: "2", title: "Item 2" },
      { id: "3", title: "Item 3" },
    ]

    render(
      <SortableList
        items={items}
        onReorder={onReorder}
        getLabel={(item) => item.title}
        renderItem={(item) => <span>{item.title}</span>}
      />,
    )

    const handle = screen.getByRole("button", { name: "Reorder Item 1" })
    expect(handle).toBeInTheDocument()

    handle.focus()
    // Press Space to pick up
    await user.keyboard(" ")
    expect(screen.getByText(/Picked up Item 1/)).toBeInTheDocument()

    // Press ArrowDown to move down
    await user.keyboard("{ArrowDown}")
    expect(screen.getByText(/Item 1 moved to position 2 of 3/)).toBeInTheDocument()

    // Press Space to drop
    await user.keyboard(" ")
    expect(onReorder).toHaveBeenCalledWith(
      [
        { id: "2", title: "Item 2" },
        { id: "1", title: "Item 1" },
        { id: "3", title: "Item 3" },
      ],
      { id: "1", from: 0, to: 1 },
    )
  })

  it("cancels list reordering on Escape without committing", async () => {
    const user = userEvent.setup()
    const onReorder = vi.fn()
    const items = [
      { id: "1", title: "Item 1" },
      { id: "2", title: "Item 2" },
    ]

    render(
      <SortableList
        items={items}
        onReorder={onReorder}
        getLabel={(item) => item.title}
        renderItem={(item) => <span>{item.title}</span>}
      />,
    )

    const handle = screen.getByRole("button", { name: "Reorder Item 1" })
    handle.focus()
    await user.keyboard(" ")
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{Escape}")

    expect(onReorder).not.toHaveBeenCalled()
    expect(screen.getByText(/Reorder cancelled/)).toBeInTheDocument()
  })

  it("moves Kanban cards between columns using keyboard", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const columns = [
      { id: "todo", title: "To Do", items: [{ id: "t1", title: "Task 1" }] },
      { id: "done", title: "Done", items: [{ id: "t2", title: "Task 2" }] },
    ]

    render(
      <Kanban
        columns={columns}
        onChange={onChange}
        getLabel={(item) => item.title}
        renderCard={(item) => <span>{item.title}</span>}
      />,
    )

    expect(screen.getByText("To Do")).toBeInTheDocument()
    expect(screen.getByText("Done")).toBeInTheDocument()

    const handle = screen.getByRole("button", { name: "Reorder Task 1" })
    handle.focus()
    await user.keyboard(" ")
    // Move to next column
    await user.keyboard("{ArrowRight}")
    // Drop
    await user.keyboard(" ")

    expect(onChange).toHaveBeenCalledWith(
      [
        { id: "todo", title: "To Do", items: [] },
        { id: "done", title: "Done", items: [{ id: "t1", title: "Task 1" }, { id: "t2", title: "Task 2" }] },
      ],
      { id: "t1", fromColumn: "todo", toColumn: "done", fromIndex: 0, toIndex: 0 },
    )
  })

  it("handles DndContext with Draggable and Droppable", async () => {
    const user = userEvent.setup()
    const onDragEnd = vi.fn()

    render(
      <DndContext onDragEnd={onDragEnd}>
        <Droppable id="col-a">
          <Draggable id="card-1">Card One</Draggable>
        </Droppable>
        <Droppable id="col-b">
          <span>Drop here</span>
        </Droppable>
      </DndContext>,
    )

    const draggable = screen.getByRole("button", { name: "Card One" })
    expect(draggable).toBeInTheDocument()

    draggable.focus()
    // Pick up with Space
    await user.keyboard(" ")
    // Move to next droppable container
    await user.keyboard("{ArrowRight}")
    // Drop
    await user.keyboard(" ")

    expect(onDragEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        activeId: "card-1",
        targetDroppableId: "col-b",
      }),
    )
  })

  it("toggles compound Collapsible with CollapsibleTrigger and CollapsibleContent", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
        <CollapsibleContent>Secret Details</CollapsibleContent>
      </Collapsible>,
    )

    const trigger = screen.getByRole("button", { name: "Toggle Details" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Secret Details")).not.toBeInTheDocument()

    await user.click(trigger)
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Secret Details")).toBeInTheDocument()
  })

  it("manages dual-thumb RangeSlider with keyboard", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <RangeSlider
        min={0}
        max={100}
        step={5}
        defaultValue={[20, 80]}
        onChange={onChange}
      />,
    )

    const minThumb = screen.getByRole("slider", { name: "Minimum value" })
    const maxThumb = screen.getByRole("slider", { name: "Maximum value" })

    expect(minThumb).toHaveAttribute("aria-valuenow", "20")
    expect(maxThumb).toHaveAttribute("aria-valuenow", "80")

    minThumb.focus()
    await user.keyboard("{ArrowRight}")
    expect(onChange).toHaveBeenCalledWith([25, 80])

    maxThumb.focus()
    await user.keyboard("{ArrowLeft}")
    expect(onChange).toHaveBeenCalledWith([25, 75])
  })

  it("edits text in-place with InlineEdit", async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(<InlineEdit defaultValue="Project Title" onSave={onSave} />)

    const display = screen.getByRole("button", { name: "Editable text" })
    expect(display).toHaveTextContent("Project Title")

    await user.click(display)
    const input = screen.getByRole("textbox")
    expect(input).toHaveValue("Project Title")

    await user.clear(input)
    await user.type(input, "New Title")
    await user.keyboard("{Enter}")

    expect(onSave).toHaveBeenCalledWith("New Title")
  })

  it("renders DateTimePicker and opens picker dialog", async () => {
    const user = userEvent.setup()
    const date = new Date(2026, 9, 27, 14, 30)

    render(<DateTimePicker value={date} />)

    const trigger = screen.getByRole("button", { name: /Oct 27, 2026/ })
    expect(trigger).toBeInTheDocument()

    await user.click(trigger)
    expect(screen.getByRole("dialog", { name: "Choose date and time" })).toBeInTheDocument()
    expect(screen.getByText("October 2026")).toBeInTheDocument()
  })

  it("renders ColorPicker and updates color", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<ColorPicker value="#ef4444" onChange={onChange} />)

    const trigger = screen.getByRole("button", { name: /#ef4444/i })
    expect(trigger).toBeInTheDocument()

    await user.click(trigger)
    expect(screen.getByRole("dialog", { name: "Color picker" })).toBeInTheDocument()

    const bluePreset = screen.getByRole("button", { name: "Select color #3b82f6" })
    await user.click(bluePreset)
    expect(onChange).toHaveBeenCalledWith("#3b82f6")
  })

  it("updates DateTimePicker using time columns and Done button", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const date = new Date(2026, 9, 27, 10, 0)

    render(<DateTimePicker defaultValue={date} onChange={onChange} />)

    const trigger = screen.getByRole("button", { name: /Oct 27, 2026/ })
    await user.click(trigger)

    expect(screen.getByRole("dialog", { name: "Choose date and time" })).toBeInTheDocument()

    // Select hour 11
    const hour11 = screen.getByRole("option", { name: "11" })
    await user.click(hour11)

    // Select minute 15
    const min15 = screen.getByRole("option", { name: "15" })
    await user.click(min15)

    // Click Done
    const doneBtn = screen.getByRole("button", { name: "Done" })
    await user.click(doneBtn)

    expect(onChange).toHaveBeenCalled()
    const resultDate = onChange.mock.calls[0][0] as Date
    expect(resultDate.getHours()).toBe(11)
    expect(resultDate.getMinutes()).toBe(15)
  })

  it("supports DndContext with DragOverlay and DragHandle", async () => {
    const user = userEvent.setup()
    const onDragEnd = vi.fn()

    render(
      <DndContext onDragEnd={onDragEnd}>
        <Droppable id="source-col">
          <Draggable id="task-1" dragFromItem={false}>
            <span>Task 1</span>
            <DragHandle draggableId="task-1" label="Reorder task 1" />
          </Draggable>
        </Droppable>
        <Droppable id="target-col">
          <span>Target zone</span>
        </Droppable>
        <DragOverlay>
          {({ activeId }) => <div>Dragging: {activeId}</div>}
        </DragOverlay>
      </DndContext>,
    )

    const handle = screen.getByRole("button", { name: "Reorder task 1" })
    expect(handle).toBeInTheDocument()

    handle.focus()
    // Pick up with Enter
    await user.keyboard("{Enter}")
    // Move to next container
    await user.keyboard("{ArrowRight}")
    // Drop with Enter
    await user.keyboard("{Enter}")

    expect(onDragEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        activeId: "task-1",
        targetDroppableId: "target-col",
      }),
    )
  })

  it("navigates ColorPicker canvas with arrow keys", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<ColorPicker value="#808080" onChange={onChange} />)

    const trigger = screen.getByRole("button", { name: /#808080/i })
    await user.click(trigger)

    const canvas = screen.getByRole("slider", { name: /saturation and brightness/i })
    expect(canvas).toBeInTheDocument()

    canvas.focus()
    await user.keyboard("{ArrowRight}")
    expect(onChange).toHaveBeenCalled()
  })
})

describe("PanoTour 360° viewer, dialog, and editor", () => {
  const sampleScenes: PanoScene[] = [
    {
      id: "lobby",
      name: "Grand Lobby",
      description: "Welcome to the Grand Lobby.",
      image: createEquirectangularDemoUrl({ title: "Grand Lobby" }),
      yaw: 0,
      pitch: 0,
      fov: 75,
      hotspots: [
        { id: "h1", type: "scene", yaw: 15, pitch: 0, target: "terrace", label: "Ocean Terrace" },
        { id: "h2", type: "info", yaw: -15, pitch: 5, label: "24/7 Concierge Desk" },
        { id: "h3", type: "action", yaw: 0, pitch: -10, action: "book", label: "Book Suite" },
      ],
    },
    {
      id: "terrace",
      name: "Ocean Terrace",
      description: "Panoramic view of the ocean.",
      image: createEquirectangularDemoUrl({ title: "Ocean Terrace" }),
      yaw: 0,
      pitch: 0,
      fov: 75,
      hotspots: [
        { id: "h4", type: "scene", yaw: 0, pitch: 0, target: "lobby", label: "Back to Lobby" },
      ],
    },
  ]

  it("renders PanoViewer with hotspots, inline notes, and hotspot callbacks", async () => {
    const user = userEvent.setup()
    const onHotspot = vi.fn()

    render(
      <PanoViewer
        scene={sampleScenes[0]}
        names={{ lobby: "Grand Lobby", terrace: "Ocean Terrace" }}
        onHotspot={onHotspot}
      />,
    )

    const app = screen.getByRole("application", { name: /Grand Lobby/i })
    expect(app).toHaveAttribute("aria-roledescription", "360 degree panorama")

    const infoBtn = screen.getByRole("button", { name: "24/7 Concierge Desk" })
    expect(infoBtn).toHaveAttribute("aria-expanded", "false")
    await user.click(infoBtn)
    expect(infoBtn).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("status")).toHaveTextContent("24/7 Concierge Desk")

    const walkBtn = screen.getByRole("button", { name: "Ocean Terrace" })
    await user.click(walkBtn)
    expect(onHotspot).toHaveBeenCalledWith(expect.objectContaining({ id: "h1", type: "scene" }))
  })

  it("opens PanoTourDialog from PanoTourButton, navigates scenes, and closes on Escape", async () => {
    const user = userEvent.setup()

    render(<PanoTourButton title="Resort Tour" scenes={sampleScenes} />)

    const trigger = screen.getByRole("button", { name: /360° tour of Resort Tour/i })
    await user.click(trigger)

    expect(screen.getByRole("dialog", { name: /Resort Tour — 360° tour/i })).toBeInTheDocument()
    expect(screen.getByText("1 of 2")).toBeInTheDocument()

    // Switch scene via filmstrip
    const nav = screen.getByRole("navigation", { name: "Scenes" })
    const terraceBtn = nav.querySelectorAll("button")[1]
    await user.click(terraceBtn)
    expect(screen.getByText("2 of 2")).toBeInTheDocument()

    // Dismiss via Escape
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog", { name: /Resort Tour — 360° tour/i })).not.toBeInTheDocument()
  })

  it("edits scenes and hotspots in PanoTourEditor and formats filenames via nameFromFile", async () => {
    const user = userEvent.setup()
    const onScenesChange = vi.fn()

    expect(nameFromFile("IMG_20260412_Pool_Deck.jpg")).toBe("Pool Deck")

    render(
      <PanoTourEditor
        title="Resort Studio"
        defaultScenes={sampleScenes}
        onScenesChange={onScenesChange}
      />,
    )

    // Rename scene
    const nameInput = screen.getByLabelText("Scene name")
    await user.clear(nameInput)
    await user.type(nameInput, "Main Lobby")
    expect(onScenesChange).toHaveBeenCalled()

    // Select a hotspot in the inspector to expand PanoHotspotEditor
    const showButtons = screen.getAllByRole("button", { name: "Show on the photo" })
    await user.click(showButtons[0])
    expect(screen.getByRole("radiogroup", { name: "Icon" })).toBeInTheDocument()
  })

  it("keeps hotspots anchored to their 3D spherical coordinates across camera yaw and pitch rotations", () => {
    const box = document.createElement("div")
    Object.defineProperty(box, "clientWidth", { value: 800 })
    Object.defineProperty(box, "clientHeight", { value: 450 })
    box.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 800, height: 450, right: 800, bottom: 450, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect

    const engine = new PanoEngine(box, { interactive: false })

    for (const cam of [
      { yaw: 0, pitch: 0, fov: 75 },
      { yaw: 42, pitch: -18, fov: 70 },
      { yaw: -115, pitch: 24, fov: 60 },
      { yaw: 165, pitch: -8, fov: 80 },
    ]) {
      engine.setView(cam)

      // Looking directly at the camera's own (yaw, pitch) always projects to the exact screen center (400, 225)
      const center = engine.project(cam.yaw, cam.pitch)
      expect(center).not.toBeNull()
      expect(center!.x).toBeCloseTo(400, 3)
      expect(center!.y).toBeCloseTo(225, 3)

      // Clicking any pixel (px, py) via unproject() and projecting that (yaw, pitch) back lands on (px, py)
      const picked = engine.unproject(540, 170)
      const reprojected = engine.project(picked.yaw, picked.pitch)
      expect(reprojected).not.toBeNull()
      expect(reprojected!.x).toBeCloseTo(540, 0)
      expect(reprojected!.y).toBeCloseTo(170, 0)
    }

    engine.destroy()
  })

  it("sanitizes URLs and embeds to prevent script injection and domain spoofing", () => {
    // safeImageSrc
    expect(safeImageSrc("https://example.com/photo.jpg")).toBe("https://example.com/photo.jpg")
    expect(safeImageSrc("/img/grounds.jpg")).toBe("/img/grounds.jpg")
    expect(safeImageSrc("./thumb.png")).toBe("./thumb.png")
    expect(safeImageSrc("data:image/png;base64,iVBORw0KGgo=")).toBe("data:image/png;base64,iVBORw0KGgo=")
    expect(safeImageSrc("javascript:alert(1)")).toBe("")
    expect(safeImageSrc("vbscript:msgbox(1)")).toBe("")
    expect(safeImageSrc("data:text/html,<script>alert(1)</script>")).toBe("")

    // safeExternalUrl
    expect(safeExternalUrl("https://example.com/page")).toBe("https://example.com/page")
    expect(safeExternalUrl("mailto:info@example.com")).toBe("mailto:info@example.com")
    expect(safeExternalUrl("tel:+1234567890")).toBe("tel:+1234567890")
    expect(safeExternalUrl("javascript:alert(1)")).toBeNull()
    expect(safeExternalUrl("data:text/html;base64,...")).toBeNull()

    // videoEmbed
    expect(videoEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")
    expect(videoEmbed("https://youtu.be/dQw4w9WgXcQ")).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")
    expect(videoEmbed("https://vimeo.com/123456789")).toBe("https://player.vimeo.com/video/123456789")
    // Rejects spoofed domains (alerts #5, #6)
    expect(videoEmbed("https://evil-youtube.com/watch?v=123")).toBeNull()
    expect(videoEmbed("https://notyoutube.com/watch?v=123")).toBeNull()
    expect(videoEmbed("https://evilvimeo.com/123")).toBeNull()
    expect(videoEmbed("javascript:alert(1)")).toBeNull()

    // safeImageSrc rejects dangerous schemes, script-bearing SVGs, and non-image data URIs
    expect(safeImageSrc("javascript:alert(1)")).toBe("")
    expect(safeImageSrc("vbscript:msgbox(1)")).toBe("")
    expect(safeImageSrc("data:text/html,<script>alert(1)</script>")).toBe("")
    expect(safeImageSrc("data:image/svg+xml;utf8,<svg><script>alert(1)</script></svg>")).toBe("")
    expect(safeImageSrc("data:image/svg+xml;utf8,<svg onload=alert(1)>")).toBe("")
    expect(safeImageSrc("https://example.com/p.jpg")).toBe("https://example.com/p.jpg")
    expect(safeImageSrc("/photos/sky.jpg")).toBe("/photos/sky.jpg")
    expect(safeImageSrc("./photos/sky.jpg")).toBe("./photos/sky.jpg")
    expect(safeImageSrc("blob:http://localhost/uuid")).toBe("blob:http://localhost/uuid")
    expect(safeImageSrc(createEquirectangularDemoUrl())).toContain("data:image/svg+xml")

    // safeExternalUrl only permits web and comms schemes
    expect(safeExternalUrl("javascript:alert(1)")).toBeNull()
    expect(safeExternalUrl("data:text/html,test")).toBeNull()
    expect(safeExternalUrl("https://example.com")).toBe("https://example.com")
    expect(safeExternalUrl("mailto:support@bzync.com")).toBe("mailto:support@bzync.com")
    expect(safeExternalUrl("tel:+1234567890")).toBe("tel:+1234567890")

    // sanitizePanoScenes
    const sanitized = sanitizePanoScenes([
      {
        id: "x",
        name: "Test",
        image: "javascript:alert(1)",
        preview: "https://example.com/p.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "h1", type: "link", yaw: 0, pitch: 0, url: "javascript:alert(1)" },
          { id: "h2", type: "link", yaw: 0, pitch: 0, url: "https://example.com" },
        ],
      },
    ])
    expect(sanitized[0].image).toBe("")
    expect(sanitized[0].preview).toBe("https://example.com/p.jpg")
    expect(sanitized[0].hotspots[0].url).toBeUndefined()
    expect(sanitized[0].hotspots[1].url).toBe("https://example.com")
  })
})


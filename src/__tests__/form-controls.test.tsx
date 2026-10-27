import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import * as R from "@/index"
import { Checkbox, DatePicker, Input, Radio, RadioGroup, Rating, Switch, Textarea, TimePicker } from "@/index"

describe("form controls", () => {
  it("toggles an uncontrolled checkbox and emits the native change", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Accept terms" onChange={onChange} />)

    await user.click(screen.getByRole("checkbox", { name: "Accept terms" }))
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeChecked()
    expect(onChange).toHaveBeenCalledOnce()
  })

  it("supports controlled switch state and onCheckedChange", async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    function Example() {
      const [checked, setChecked] = useState(false)
      return <Switch label="Auto deploy" checked={checked} onCheckedChange={(next) => { changed(next); setChecked(next) }} />
    }
    render(<Example />)

    await user.click(screen.getByRole("checkbox", { name: "Auto deploy" }))
    expect(screen.getByRole("checkbox", { name: "Auto deploy" })).toBeChecked()
    expect(changed).toHaveBeenCalledWith(true)
  })

  it("updates a controlled radio group", async () => {
    const user = userEvent.setup()
    function Example() {
      const [value, setValue] = useState("small")
      return (
        <RadioGroup label="Size" value={value} onChange={setValue}>
          <Radio value="small" label="Small" />
          <Radio value="large" label="Large" />
        </RadioGroup>
      )
    }
    render(<Example />)

    await user.click(screen.getByRole("radio", { name: "Large" }))
    expect(screen.getByRole("radio", { name: "Large" })).toBeChecked()
    expect(screen.getByRole("radio", { name: "Small" })).not.toBeChecked()
  })

  it("associates required field labels and validation messages", () => {
    render(<><Input label="Email" required error="Enter a valid email address" /><Textarea label="Notes" hint="Visible to administrators" /></>)
    const input = screen.getByRole("textbox", { name: /Email/ })
    expect(input).toBeRequired()
    expect(input).toHaveAccessibleDescription("Enter a valid email address")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveAccessibleDescription("Visible to administrators")
  })

  it("exposes an indeterminate checkbox to native and assistive APIs", () => {
    render(<Checkbox label="Select all rows" indeterminate />)
    const checkbox = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
    expect(checkbox).toHaveAttribute("aria-checked", "mixed")
  })

  it("selects a rating with native radio semantics", async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    function Example() {
      const [value, setValue] = useState(2)
      return <Rating label="Service rating" value={value} onValueChange={(next) => { changed(next); setValue(next) }} showValue />
    }
    render(<Example />)

    const group = screen.getByRole("radiogroup", { name: "Service rating" })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "2 stars" })).toBeChecked()
    await user.click(screen.getByRole("radio", { name: "4 stars" }))
    expect(screen.getByRole("radio", { name: "4 stars" })).toBeChecked()
    expect(screen.getByText("4/5")).toBeInTheDocument()
    expect(changed).toHaveBeenCalledWith(4)
  })

  it("prevents changes to a read-only rating", async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<Rating label="Readonly rating" defaultValue={3} readOnly onValueChange={changed} />)

    await user.click(screen.getByRole("radio", { name: "5 stars" }))
    expect(screen.getByRole("radio", { name: "3 stars" })).toBeChecked()
    expect(screen.getByRole("radiogroup", { name: "Readonly rating" })).toHaveAttribute("aria-readonly", "true")
    expect(changed).not.toHaveBeenCalled()
  })

  it("selects custom time values and associates field errors", async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    function Example() {
      const [value, setValue] = useState("09:30")
      return <TimePicker label="Start time" name="startTime" value={value} onValueChange={(next) => { changed(next); setValue(next) }} minuteStep={15} error="Choose a business hour" required />
    }
    render(<Example />)

    const trigger = screen.getByRole("button", { name: /Start time/ })
    expect(trigger).toHaveAccessibleDescription("Choose a business hour")
    expect(trigger).toHaveAttribute("aria-invalid", "true")
    await user.click(trigger)
    const dialog = screen.getByRole("dialog", { name: "Choose start time" })
    await user.click(within(within(dialog).getByRole("listbox", { name: "Hour" })).getByRole("option", { name: "11" }))
    await user.click(within(within(dialog).getByRole("listbox", { name: "Minute" })).getByRole("option", { name: "45" }))
    await user.click(within(dialog).getByRole("button", { name: "Apply" }))
    expect(trigger).toHaveTextContent("11:45 AM")
    expect(changed).toHaveBeenCalledWith("11:45")
    expect(document.querySelector('input[name="startTime"]')).toHaveValue("11:45")
    expect(trigger).toHaveFocus()
  })

  it("navigates calendar days by keyboard, commits a date, and restores trigger focus", async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    function Example() {
      const [value, setValue] = useState<Date | null>(new Date(2026, 8, 18))
      return <DatePicker label="Deployment date" value={value} onChange={(next) => { changed(next); setValue(next) }} />
    }
    render(<Example />)

    const trigger = screen.getByRole("button", { name: "Deployment date" })
    await user.click(trigger)
    const dialog = screen.getByRole("dialog", { name: "Choose deployment date" })
    const selectedDay = dialog.querySelector<HTMLButtonElement>('[data-date="2026-09-18"]')
    expect(selectedDay).not.toBeNull()
    await waitFor(() => expect(selectedDay).toHaveFocus())
    await user.keyboard("{ArrowRight}{Enter}")

    expect((changed.mock.calls[changed.mock.calls.length - 1]?.[0] as Date).getDate()).toBe(19)
    expect(trigger).toHaveTextContent("Sep 19, 2026")
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it("clears a selected date without opening the calendar", async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<DatePicker label="Deployment date" value={new Date(2026, 8, 18)} onChange={changed} />)

    await user.click(screen.getByRole("button", { name: "Clear deployment date" }))
    expect(changed).toHaveBeenCalledWith(null)
    expect(screen.queryByRole("dialog", { name: "Choose deployment date" })).not.toBeInTheDocument()
  })

  it("dismisses the custom time picker with Escape and restores focus", async () => {
    const user = userEvent.setup()
    render(<TimePicker label="End time" defaultValue="17:00" format="24" />)
    const trigger = screen.getByRole("button", { name: "End time" })
    await user.click(trigger)
    expect(screen.getByRole("dialog", { name: "Choose end time" })).toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog", { name: "Choose end time" })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it("enforces time boundaries and creates unique column labels per picker", async () => {
    const user = userEvent.setup()
    render(<>
      <TimePicker label="Window start" defaultValue="08:30:45" minuteStep={15} min="09:00" max="17:00" align="end" />
      <TimePicker label="Window end" defaultValue="17:00" format="24" />
    </>)

    const startTrigger = screen.getByRole("button", { name: "Window start" })
    await user.click(startTrigger)
    const startDialog = screen.getByRole("dialog", { name: "Choose window start" })
    const startHour = within(startDialog).getByRole("listbox", { name: "Hour" })
    const startLabelId = startHour.getAttribute("aria-labelledby")
    expect(startLabelId).toBeTruthy()
    expect(startDialog).toHaveAttribute("data-align", "end")
    expect(within(startDialog).getByRole("status")).toHaveTextContent("at or after 9:00 AM")
    expect(within(startDialog).getByRole("button", { name: "Apply" })).toBeDisabled()

    await user.keyboard("{Escape}")
    await user.click(screen.getByRole("button", { name: "Window end" }))
    const endDialog = screen.getByRole("dialog", { name: "Choose window end" })
    const endLabelId = within(endDialog).getByRole("listbox", { name: "Hour" }).getAttribute("aria-labelledby")
    expect(endLabelId).toBeTruthy()
    expect(endLabelId).not.toBe(startLabelId)
  })
})

describe("uncontrolled form defaults", () => {
  it("runs RadioGroup uncontrolled from defaultValue", async () => {
    const user = userEvent.setup(); const onChange = vi.fn()
    render(<RadioGroup label="Plan" defaultValue="pro" onChange={onChange}><Radio value="hobby" label="Hobby" /><Radio value="pro" label="Pro" /></RadioGroup>)
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked()
    await user.click(screen.getByRole("radio", { name: "Hobby" }))
    expect(screen.getByRole("radio", { name: "Hobby" })).toBeChecked()
    expect(onChange).toHaveBeenCalledWith("hobby")
  })

  it("shows a DatePicker defaultValue", () => {
    render(<DatePicker label="Due" defaultValue={new Date(2026, 8, 18)} />)
    expect(screen.getByRole("button", { name: "Due" })).toHaveTextContent("Sep 18, 2026")
  })
})

describe("consistent control sizes", () => {
  it("matches Input and Button heights for sm and lg field triggers", () => {
    render(<>
      <R.Button size="sm">Small button</R.Button>
      <R.Input size="sm" aria-label="Small input" wrapperClassName="small-input" />
      <R.Select size="sm" label="Small select" options={[{ value: "a", label: "A" }]} />
      <R.Select size="lg" label="Large select" options={[{ value: "a", label: "A" }]} />
      <R.Autocomplete size="sm" label="Small autocomplete" options={[{ value: "a", label: "A" }]} />
      <R.DatePicker size="lg" label="Large date" />
    </>)
    expect(screen.getByRole("button", { name: "Small button" })).toHaveClass("h-8")
    expect(screen.getByRole("textbox", { name: "Small input" }).parentElement).toHaveClass("h-8")
    expect(screen.getByRole("combobox", { name: "Small select" })).toHaveClass("h-8")
    expect(screen.getByRole("combobox", { name: "Large select" })).toHaveClass("h-10")
    expect(screen.getByRole("combobox", { name: "Small autocomplete" }).parentElement).toHaveClass("h-8")
    expect(screen.getByRole("combobox", { name: "Small autocomplete" })).toHaveClass("text-xs")
    expect(screen.getByRole("button", { name: "Large date" }).parentElement).toHaveClass("h-10")
  })

  it("scales slider, radio, tabs, pagination and accordion", () => {
    render(<>
      <R.Slider size="lg" label="Volume" />
      <R.RadioGroup size="lg" label="Plan" defaultValue="a"><R.Radio value="a" label="Alpha" /></R.RadioGroup>
      <R.Tabs size="sm" defaultValue="one"><R.TabsList><R.TabsTrigger value="one">One</R.TabsTrigger></R.TabsList></R.Tabs>
      <R.Pagination size="lg" totalPages={3} />
      <R.Accordion size="sm" items={[{ id: "q", trigger: "Question", content: "Answer" }]} />
    </>)
    expect(screen.getByRole("slider", { name: "Volume" }).parentElement).toHaveClass("h-6")
    expect(screen.getByRole("radio", { name: "Alpha" }).parentElement).toHaveClass("size-5")
    expect(screen.getByRole("tab", { name: "One" })).toHaveClass("text-xs")
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveClass("h-10")
    expect(screen.getByRole("button", { name: "Question" })).toHaveClass("py-2.5")
  })
})

describe("DateRangePicker", () => {
  const fmt = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

  it("selects a range with two clicks, swapping when the end is earlier", async () => {
    const user = userEvent.setup(); const onChange = vi.fn()
    render(<R.DateRangePicker label="Period" defaultValue={{ from: new Date(2026, 8, 10), to: null }} onChange={onChange} presets={false} numberOfMonths={1} />)
    await user.click(screen.getByRole("button", { name: "Period" }))
    const dialog = await screen.findByRole("dialog", { name: "Choose period" })
    await user.click(within(dialog).getByRole("button", { name: /September 20, 2026/ }))
    expect(within(dialog).getByRole("status")).toHaveTextContent("Select an end date")
    await user.click(within(dialog).getByRole("button", { name: /September 12, 2026/ }))
    const range = onChange.mock.lastCall![0]
    expect([fmt(range.from), fmt(range.to)]).toEqual(["2026-9-12", "2026-9-20"])
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Period" })).toHaveTextContent(/Sep 12 – Sep 20, 2026/)
  })

  it("applies presets and clears", async () => {
    const user = userEvent.setup(); const onChange = vi.fn()
    render(<R.DateRangePicker label="Period" onChange={onChange} />)
    await user.click(screen.getByRole("button", { name: "Period" }))
    await user.click(await screen.findByRole("button", { name: "Last 7 days" }))
    const { from, to } = onChange.mock.lastCall![0]
    expect(Math.round((to.getTime() - from.getTime()) / 86_400_000)).toBe(6)
    await user.click(screen.getByRole("button", { name: "Clear period" }))
    expect(onChange).toHaveBeenLastCalledWith({ from: null, to: null })
  })

  it("navigates days with the keyboard and respects bounds", async () => {
    const user = userEvent.setup()
    render(<R.DateRangePicker label="Period" presets={false} numberOfMonths={1} defaultValue={{ from: new Date(2026, 8, 15), to: new Date(2026, 8, 15) }} minDate={new Date(2026, 8, 14)} />)
    await user.click(screen.getByRole("button", { name: "Period" }))
    const dialog = await screen.findByRole("dialog")
    await waitFor(() => expect(within(dialog).getByRole("button", { name: /September 15, 2026/ })).toHaveFocus())
    await user.keyboard("{ArrowRight}")
    expect(within(dialog).getByRole("button", { name: /September 16, 2026/ })).toHaveFocus()
    expect(within(dialog).getByRole("button", { name: /September 13, 2026/ })).toBeDisabled()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})

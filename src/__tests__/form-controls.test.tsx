import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
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

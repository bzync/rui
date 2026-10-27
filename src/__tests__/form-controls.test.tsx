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

describe("Form and useForm", () => {
  type Values = { email: string; plan: string; terms: boolean }
  // A minimal Zod-compatible schema (rui never imports a schema library).
  const schema: R.FormSchema<Values> = {
    safeParse(values) {
      const issues: { path: string[]; message: string }[] = []
      if (!/^\S+@\S+\.\S+$/.test(values.email)) issues.push({ path: ["email"], message: "Enter a valid email." })
      if (!values.plan) issues.push({ path: ["plan"], message: "Choose a plan." })
      if (!values.terms) issues.push({ path: ["terms"], message: "Accept the terms." })
      return issues.length ? { success: false, error: { issues } } : { success: true }
    },
  }

  function Signup({ onSubmit }: { onSubmit: (values: Values) => void }) {
    const form = R.useForm<Values>({ defaultValues: { email: "", plan: "", terms: false }, schema })
    return (
      <R.Form form={form} onSubmit={onSubmit} errorSummary>
        <R.Input label="Email" {...form.register("email")} />
        <R.Select label="Plan" options={[{ value: "pro", label: "Pro" }]} {...form.control("plan")} />
        <R.Checkbox label="I accept the terms" {...form.register("terms", { type: "checkbox" })} />
        <span data-testid="dirty">{String(form.isDirty)}</span>
        <button type="submit">Create account</button>
        <button type="button" onClick={() => form.reset()}>Reset</button>
      </R.Form>
    )
  }

  it("validates with a schema, summarizes errors and focuses the first invalid field", async () => {
    const user = userEvent.setup(); const onSubmit = vi.fn()
    render(<Signup onSubmit={onSubmit} />)
    await user.click(screen.getByRole("button", { name: "Create account" }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(await screen.findByRole("alert", { name: undefined })).toHaveTextContent("Please fix 3 fields")
    const email = screen.getByRole("textbox", { name: "Email" })
    expect(email).toHaveAttribute("aria-invalid", "true")
    // Once beside the field, once in the summary.
    expect(screen.getAllByText("Enter a valid email.")).toHaveLength(2)
    await waitFor(() => expect(email).toHaveFocus())

    // After a failed submit, fields revalidate as you type.
    await user.type(email, "ops@acme.dev")
    await waitFor(() => expect(screen.queryByText("Enter a valid email.")).not.toBeInTheDocument())
    expect(screen.getByTestId("dirty")).toHaveTextContent("true")

    await user.click(screen.getByRole("combobox", { name: "Plan" }))
    await user.click(await screen.findByRole("option", { name: "Pro" }))
    await user.click(screen.getByRole("checkbox", { name: "I accept the terms" }))
    await user.click(screen.getByRole("button", { name: "Create account" }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ email: "ops@acme.dev", plan: "pro", terms: true }))
  })

  it("resets to defaults and supports custom validate in onBlur mode", async () => {
    const user = userEvent.setup()
    function Rename() {
      const form = R.useForm({ defaultValues: { name: "api" }, mode: "onBlur", validate: (v) => ({ name: v.name.length < 3 ? "At least 3 characters." : undefined }) })
      return (
        <R.Form form={form} onSubmit={() => {}}>
          <R.Input label="Name" {...form.register("name")} />
          <button type="button" onClick={() => form.reset()}>Reset</button>
        </R.Form>
      )
    }
    render(<Rename />)
    const name = screen.getByRole("textbox", { name: "Name" })
    await user.clear(name)
    await user.type(name, "a")
    expect(screen.queryByText("At least 3 characters.")).not.toBeInTheDocument()
    await user.tab()
    expect(await screen.findByText("At least 3 characters.")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Reset" }))
    expect(name).toHaveValue("api")
    expect(screen.queryByText("At least 3 characters.")).not.toBeInTheDocument()
  })
})

describe("control surface", () => {
  it("only treats real read-only text fields as read-only", () => {
    // jsdom cannot evaluate :has(), so assert the class contract that the browser evaluates.
    render(<><R.Input label="Readonly" readOnly defaultValue="x" /><R.Select label="Pick" options={[{ value: "a", label: "A" }]} /></>)
    const select = screen.getByRole("combobox", { name: "Pick" })
    expect(select.className).not.toMatch(/has-\[:read-only\]/)
    expect(select.className).toContain("has-[input:read-only:not([type=hidden])]:bg-surface-muted")
  })
})

describe("PasswordInput", () => {
  it("toggles visibility and reports strength and requirements", async () => {
    const user = userEvent.setup()
    render(<R.PasswordInput label="Password" hint="Use a passphrase" showStrength requirements={[{ label: "At least 8 characters", test: (p) => p.length >= 8 }]} />)
    const input = screen.getByLabelText("Password")
    expect(input).toHaveAttribute("type", "password")
    expect(input).toHaveAttribute("autocomplete", "new-password")
    expect(input.getAttribute("aria-describedby")).toMatch(/-message .*-feedback/)
    const toggle = screen.getByRole("button", { name: "Show password" })
    await user.click(toggle)
    expect(input).toHaveAttribute("type", "text")
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true")
    await user.type(input, "abc")
    expect(screen.getByText("Too weak")).toBeInTheDocument()
    expect(screen.getByText("At least 8 characters").parentElement).toHaveTextContent("(not met)")
    await user.type(input, "DEF123!?xyz")
    expect(screen.getByText("Strong")).toBeInTheDocument()
    expect(screen.getByText("At least 8 characters").parentElement).toHaveTextContent("(met)")
  })

  it("scores passwords from 0 to 4", () => {
    expect(R.scorePassword("abc")).toBe(0)
    expect(R.scorePassword("abcdefgh1")).toBe(1)
    expect(R.scorePassword("Abcdefgh1!")).toBe(3)
    expect(R.scorePassword("Abcdefghijk1!")).toBe(4)
  })
})

describe("SearchInput", () => {
  it("debounces onSearch, clears with the button and Escape, and focuses on its shortcut", async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<><R.SearchInput aria-label="Search docs" onSearch={onSearch} debounceMs={50} shortcut="/" /><button type="button">Elsewhere</button></>)
    const input = screen.getByRole("searchbox", { name: "Search docs" })
    await user.type(input, "mod")
    expect(onSearch).not.toHaveBeenCalled()
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith("mod"))
    expect(onSearch).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole("button", { name: "Clear search" }))
    expect(input).toHaveValue("")
    expect(onSearch).toHaveBeenLastCalledWith("")
    await user.type(input, "x{Escape}")
    expect(input).toHaveValue("")
    await user.click(screen.getByRole("button", { name: "Elsewhere" }))
    await user.keyboard("/")
    expect(input).toHaveFocus()
  })
})

describe("masked inputs", () => {
  it("formats a mask as you type and reports the raw value", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<R.MaskedInput label="Card" mask="9999 9999 9999 9999" onValueChange={onValueChange} />)
    const input = screen.getByLabelText("Card")
    expect(input).toHaveAttribute("inputmode", "numeric")
    await user.type(input, "4242a424242424242")
    expect(input).toHaveValue("4242 4242 4242 4242")
    expect(onValueChange).toHaveBeenLastCalledWith("4242424242424242", "4242 4242 4242 4242", true)
    expect(R.applyMask("aa-999", "ab12")).toEqual({ raw: "ab12", formatted: "ab-12", complete: false })
  })

  it("groups currency while typing and pads on blur", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<R.CurrencyInput label="Amount" locale="en-US" currency="USD" max={5000} onValueChange={onValueChange} />)
    const input = screen.getByLabelText("Amount")
    await user.type(input, "1234.5")
    expect(input).toHaveValue("1,234.5")
    expect(onValueChange).toHaveBeenLastCalledWith(1234.5)
    await user.tab()
    expect(input).toHaveValue("1,234.50")
    await user.clear(input)
    await user.type(input, "99999")
    await user.tab()
    expect(input).toHaveValue("5,000.00")
    expect(onValueChange).toHaveBeenLastCalledWith(5000)
  })

  it("formats phone numbers per country and emits E.164", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<R.PhoneInput label="Phone" onValueChange={onValueChange} />)
    const input = screen.getByLabelText("Phone")
    await user.type(input, "5551234567")
    expect(input).toHaveValue("(555) 123-4567")
    expect(onValueChange).toHaveBeenLastCalledWith("5551234567", "+15551234567", true)
    await user.selectOptions(screen.getByRole("combobox", { name: "Country code" }), "PH")
    expect(input).toHaveValue("555 123 4567")
    expect(onValueChange).toHaveBeenLastCalledWith("5551234567", "+635551234567", true)
  })
})

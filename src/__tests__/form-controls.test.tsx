import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { Checkbox, Input, Radio, RadioGroup, Switch, Textarea } from "@/index"

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
})

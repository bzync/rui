import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Autocomplete, Select } from "@/index"

const options = [
  { value: "us", label: "United States" },
  { value: "ph", label: "Philippines" },
]

describe("Select", () => {
  it("opens its portaled list and selects a value", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select label="Country" options={options} onChange={onChange} />)

    await user.click(screen.getByRole("combobox", { name: "Country" }))
    expect(screen.getByRole("listbox")).toBeInTheDocument()
    await user.click(screen.getByRole("option", { name: "Philippines" }))

    expect(onChange).toHaveBeenCalledWith("ph")
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveTextContent("Philippines")
  })

  it("adds and removes values in multi-select mode", async () => {
    const user = userEvent.setup()
    render(<Select multiple label="Countries" options={options} />)
    const trigger = screen.getByRole("combobox", { name: "Countries" })
    await user.click(trigger); await user.click(screen.getByRole("option", { name: "Philippines" }))
    expect(trigger).toHaveTextContent("Philippines")
    await user.click(screen.getByRole("button", { name: "Remove Philippines" }))
    expect(trigger).not.toHaveTextContent("Philippines")
  })

  it("supports keyboard selection", async () => {
    const user = userEvent.setup()
    render(<Select label="Country" options={options} />)
    const trigger = screen.getByRole("combobox", { name: "Country" })
    trigger.focus()
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}")
    expect(trigger).toHaveTextContent("Philippines")
  })
})

describe("Autocomplete", () => {
  it("filters and selects an option", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Autocomplete label="Country search" options={options} onSelect={onSelect} />)
    const input = screen.getByRole("combobox", { name: "Country search" })

    await user.type(input, "Phil")
    expect(screen.queryByRole("option", { name: "United States" })).not.toBeInTheDocument()
    await user.click(screen.getByRole("option", { name: "Philippines" }))

    expect(input).toHaveValue("Philippines")
    expect(onSelect).toHaveBeenCalledWith(options[1])
  })
})

import { act, render, screen } from "@testing-library/react"
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

  it("composes root, trigger, label, list, and option classes", async () => {
    const user = userEvent.setup()
    render(<Select label="Styled country" options={options} wrapperClassName="custom-select" triggerClassName="custom-select-trigger" labelClassName="custom-select-label" listClassName="custom-select-list" optionClassName="custom-select-option" />)
    const trigger = screen.getByRole("combobox", { name: "Styled country" })
    await user.click(trigger)
    expect(trigger).toHaveClass("custom-select-trigger")
    expect(trigger.parentElement).toHaveClass("custom-select")
    expect(screen.getByText("Styled country")).toHaveClass("custom-select-label")
    expect(screen.getByRole("listbox")).toHaveClass("custom-select-list")
    expect(screen.getAllByRole("option")[0]).toHaveClass("custom-select-option")
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

  it("composes root, trigger, input, list, and option classes", async () => {
    const user = userEvent.setup()
    render(<Autocomplete label="Styled search" options={options} wrapperClassName="custom-autocomplete" triggerClassName="custom-autocomplete-trigger" inputClassName="custom-autocomplete-input" labelClassName="custom-autocomplete-label" listClassName="custom-autocomplete-list" optionClassName="custom-autocomplete-option" />)
    const input = screen.getByRole("combobox", { name: "Styled search" })
    await user.click(input)
    expect(input).toHaveClass("custom-autocomplete-input")
    expect(input.parentElement).toHaveClass("custom-autocomplete-trigger")
    expect(screen.getByText("Styled search")).toHaveClass("custom-autocomplete-label")
    expect(await screen.findByRole("listbox")).toHaveClass("custom-autocomplete-list")
    expect(screen.getAllByRole("option")[0]).toHaveClass("custom-autocomplete-option")
  })
})

describe("Select form participation", () => {
  it("submits single and multiple selections under their name", async () => {
    const user = userEvent.setup()
    render(
      <>
        <form data-testid="form">
          <Select label="Region" name="region" options={options} defaultValue="ph" />
          <Select label="Markets" name="markets" multiple options={options} defaultValue={["us", "ph"]} />
          <Select label="Locked" name="locked" options={options} defaultValue="us" disabled />
        </form>
        <Select label="Outside" name="outside" form="detached" options={options} defaultValue="us" />
        <form id="detached" data-testid="detached" />
      </>,
    )
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement)
    expect(data.get("region")).toBe("ph")
    expect(data.getAll("markets")).toEqual(["us", "ph"])
    expect(data.has("locked")).toBe(false)
    expect(new FormData(screen.getByTestId("detached") as HTMLFormElement).get("outside")).toBe("us")

    await user.click(screen.getByRole("combobox", { name: "Region" }))
    await user.click(screen.getByRole("option", { name: "United States" }))
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("region")).toBe("us")
  })

  it("blocks an empty required submit through native validation", async () => {
    const user = userEvent.setup()
    render(<form data-testid="form"><Select label="Plan" name="plan" required options={options} /><Select label="Tags" multiple required options={options} /></form>)
    const form = screen.getByTestId("form") as HTMLFormElement
    expect(form.checkValidity()).toBe(false)
    await user.click(screen.getByRole("combobox", { name: /Plan/ }))
    await user.click(screen.getByRole("option", { name: "Philippines" }))
    await vi.waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument())
    await user.click(screen.getByRole("combobox", { name: /Tags/ }))
    await user.click(screen.getByRole("option", { name: "United States" }))
    expect(form.checkValidity()).toBe(true)
  })

  it("returns an uncontrolled selection to its default on form reset", async () => {
    const user = userEvent.setup()
    render(<form data-testid="form"><Select label="Region" name="region" options={options} defaultValue="ph" /></form>)
    await user.click(screen.getByRole("combobox", { name: "Region" }))
    await user.click(screen.getByRole("option", { name: "United States" }))
    expect(screen.getByRole("combobox", { name: "Region" })).toHaveTextContent("United States")
    act(() => (screen.getByTestId("form") as HTMLFormElement).reset())
    await vi.waitFor(() => expect(screen.getByRole("combobox", { name: "Region" })).toHaveTextContent("Philippines"))
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("region")).toBe("ph")
  })
})

describe("Autocomplete form participation", () => {
  it("submits the selected value, not the typed text, and drops it when the text is edited", async () => {
    const user = userEvent.setup()
    render(<form data-testid="form"><Autocomplete label="Country" name="country" options={options} /></form>)
    const form = screen.getByTestId("form") as HTMLFormElement
    const input = screen.getByRole("combobox", { name: "Country" })

    await user.type(input, "Phil")
    expect(new FormData(form).has("country")).toBe(false)
    await user.click(screen.getByRole("option", { name: "Philippines" }))
    expect(new FormData(form).getAll("country")).toEqual(["ph"])

    await user.type(input, "x")
    expect(new FormData(form).has("country")).toBe(false)
  })

  it("submits one entry per value in multiple mode and honours controlled values", () => {
    render(
      <form data-testid="form">
        <Autocomplete multiple label="Markets" name="markets" options={options} value={["us", "ph"]} />
        <Autocomplete label="Home" name="home" options={options} value="us" />
      </form>,
    )
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement)
    expect(data.getAll("markets")).toEqual(["us", "ph"])
    expect(data.getAll("home")).toEqual(["us"])
  })

  it("requires a selection rather than any text, and clears on form reset", async () => {
    const user = userEvent.setup()
    render(<form data-testid="form"><Autocomplete label="Country" name="country" required options={options} /></form>)
    const form = screen.getByTestId("form") as HTMLFormElement
    const input = screen.getByRole("combobox", { name: /Country/ })
    expect(input).toHaveAttribute("aria-required", "true")
    expect(input).not.toHaveAttribute("name")

    await user.type(input, "Unlisted")
    expect(form.checkValidity()).toBe(false)
    await user.clear(input)
    await user.type(input, "Uni")
    await user.click(screen.getByRole("option", { name: "United States" }))
    expect(form.checkValidity()).toBe(true)

    act(() => form.reset())
    await vi.waitFor(() => expect(input).toHaveValue(""))
    expect(form.checkValidity()).toBe(false)
  })
})

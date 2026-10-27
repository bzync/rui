import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Autocomplete, Select, TagInput } from "@/index"

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

describe("autocomplete selection state", () => {
  const runtimes = [{ value: "node", label: "Node.js" }, { value: "go", label: "Go" }, { value: "rust", label: "Rust" }]

  it("shows a controlled single value's label in the input and follows changes", () => {
    const { rerender } = render(<Autocomplete label="Runtime" options={runtimes} value="go" />)
    expect(screen.getByRole("combobox", { name: "Runtime" })).toHaveValue("Go")
    rerender(<Autocomplete label="Runtime" options={runtimes} value="rust" />)
    expect(screen.getByRole("combobox", { name: "Runtime" })).toHaveValue("Rust")
  })

  it("starts from defaultValue in single and multiple modes", () => {
    render(<><Autocomplete label="Single" options={runtimes} defaultValue="node" /><Autocomplete multiple label="Many" options={runtimes} defaultValue={["go", "rust"]} /></>)
    expect(screen.getByRole("combobox", { name: "Single" })).toHaveValue("Node.js")
    expect(screen.getByText("Go")).toBeInTheDocument()
    expect(screen.getByText("Rust")).toBeInTheDocument()
  })
})

describe("Combobox: creatable and async", () => {
  it("creates an option from typed text with the keyboard", async () => {
    const user = userEvent.setup(); const onSelect = vi.fn()
    render(<Autocomplete<string> multiple creatable label="Labels" options={[{ value: "bug", label: "bug" }]} onSelect={onSelect} />)
    const input = screen.getByRole("combobox", { name: "Labels" })
    await user.type(input, "urgent")
    expect(await screen.findByRole("option", { name: "Create “urgent”" })).toBeInTheDocument()
    await user.keyboard("{ArrowDown}{Enter}")
    expect(onSelect).toHaveBeenLastCalledWith({ value: "urgent", label: "urgent" }, [{ value: "urgent", label: "urgent" }])
    // The chip (plus the created option in the still-open list).
    expect(screen.getAllByText("urgent").length).toBeGreaterThan(0)
    // No create row for an existing label.
    await user.type(input, "bug")
    expect(screen.queryByRole("option", { name: /Create/ })).not.toBeInTheDocument()
  })

  it("loads options asynchronously with debounce and aborts stale requests", async () => {
    const user = userEvent.setup()
    const calls: { query: string; signal: AbortSignal }[] = []
    const loadOptions = vi.fn((query: string, signal: AbortSignal) => {
      calls.push({ query, signal })
      return Promise.resolve([{ value: `${query}-1`, label: `Result for ${query}` }])
    })
    render(<Autocomplete label="Users" loadOptions={loadOptions} debounceMs={50} />)
    await user.click(screen.getByRole("combobox", { name: "Users" }))
    await user.keyboard("ma")
    expect(await screen.findByRole("option", { name: "Result for ma" })).toBeInTheDocument()
    // Only the settled query hit the "server"; earlier ones were debounced or aborted.
    expect(calls[calls.length - 1].query).toBe("ma")
    expect(calls.slice(0, -1).every((call) => call.signal.aborted)).toBe(true)
  })
})

describe("TagInput", () => {
  it("adds tags with Enter, comma and paste, validates, dedupes and removes", async () => {
    const user = userEvent.setup(); const onChange = vi.fn()
    render(<TagInput label="Invite" onChange={onChange} validate={(tag) => (/^\S+@\S+$/.test(tag) ? undefined : `“${tag}” is not an email.`)} />)
    const input = screen.getByRole("textbox", { name: "Invite" })
    await user.type(input, "a@x.io{Enter}b@x.io,")
    expect(onChange).toHaveBeenLastCalledWith(["a@x.io", "b@x.io"])
    await user.type(input, "nope{Enter}")
    expect(screen.getByText("“nope” is not an email.")).toBeInTheDocument()
    expect(input).toHaveValue("nope")
    await user.clear(input)
    await user.click(input)
    await user.paste("c@x.io; a@x.io\nd@x.io")
    expect(onChange).toHaveBeenLastCalledWith(["a@x.io", "b@x.io", "c@x.io", "d@x.io"])
    await user.click(screen.getByRole("button", { name: "Remove b@x.io" }))
    expect(onChange).toHaveBeenLastCalledWith(["a@x.io", "c@x.io", "d@x.io"])
    await user.click(input)
    await user.keyboard("{Backspace}")
    expect(onChange).toHaveBeenLastCalledWith(["a@x.io", "c@x.io"])
  })

  it("enforces maxTags and submits with a native form", () => {
    const { container } = render(<form><TagInput label="Labels" name="labels" defaultValue={["a", "b"]} maxTags={2} /></form>)
    expect(screen.getByRole("textbox", { name: "Labels" })).toBeDisabled()
    expect([...container.querySelectorAll('input[name="labels"]')].map((i) => (i as HTMLInputElement).value)).toEqual(["a", "b"])
  })
})

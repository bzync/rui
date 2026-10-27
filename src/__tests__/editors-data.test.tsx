import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Calendar, CodeBlock, CodeEditor, DataTable, DatePicker, FileUpload, InlineCode, OtpInput, RichTextEditor, Slider, TerminalBlock, TerminalEmulator } from "@/index"

describe("data, editor, and advanced field components", () => {
  it("renders and filters a data table", async () => {
    const user = userEvent.setup()
    render(<DataTable searchable pageSizeOptions={false} data={[{ id: 1, name: "Atlas" }, { id: 2, name: "Beacon" }]} columns={[{ key: "name", header: "Name", searchable: true, cell: (row) => row.name }]} />)
    expect(screen.getByRole("table")).toBeInTheDocument()
    await user.type(screen.getByRole("searchbox"), "Atlas")
    expect(screen.getByText("Atlas")).toBeInTheDocument(); expect(screen.queryByText("Beacon")).not.toBeInTheDocument()
  })

  it("composes data-table surface classes through its public props", () => {
    render(<DataTable className="custom-data-table" toolbarClassName="custom-data-toolbar" tableClassName="custom-data-surface" searchable pageSizeOptions={false} data={[{ id: 1, name: "Atlas" }]} columns={[{ key: "name", header: "Name", cell: (row) => row.name }]} />)
    expect(screen.getByRole("table").closest(".custom-data-surface")).toBeInTheDocument()
    expect(screen.getByRole("searchbox").closest(".custom-data-toolbar")).toBeInTheDocument()
    expect(document.querySelector(".custom-data-table")).toBeInTheDocument()
  })

  it("sorts from a semantic header button and activates clickable rows by keyboard", async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<DataTable ariaLabel="Projects" getRowLabel={(row) => `${row.name} project`} pageSizeOptions={false} onRowClick={onRowClick} data={[{ id: 1, name: "Zulu" }, { id: 2, name: "Atlas" }]} columns={[{ key: "name", header: "Name", sortable: true, cell: (row) => row.name }]} />)
    const sort = screen.getByRole("button", { name: "Name" })
    await user.click(sort)
    expect(sort.closest("th")).toHaveAttribute("aria-sort", "ascending")
    const atlas = screen.getByRole("row", { name: "Atlas project" })
    atlas.focus()
    await user.keyboard("{Enter}")
    expect(onRowClick).toHaveBeenCalledWith({ id: 2, name: "Atlas" })
  })

  it("renders calendar and date picker controls", async () => {
    const user = userEvent.setup(); const onChange = vi.fn()
    render(<><Calendar value={new Date(2026, 7, 21)} defaultViewDate={new Date(2026, 7, 21)} onChange={onChange} /><DatePicker label="Release date" /></>)
    expect(screen.getByText(/August 2026/)).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Release date" }))
    expect(screen.getAllByText(/August 2026/).length).toBeGreaterThan(0)
  })

  it("accepts OTP, slider, and uploaded files", async () => {
    const user = userEvent.setup(); const otp = vi.fn(); const files = vi.fn()
    render(<><OtpInput length={4} onChange={otp} label="Code" /><Slider label="Volume" defaultValue={20} /><FileUpload label="Artifact" onFilesChange={files} /></>)
    const digits = screen.getAllByRole("textbox")
    await user.type(digits[0], "1"); expect(otp).toHaveBeenCalled()
    fireEvent.change(screen.getByRole("slider", { name: "Volume" }), { target: { value: "40" } })
    const file = new File(["data"], "build.zip", { type: "application/zip" })
    await user.upload(screen.getByLabelText("Artifact"), file); expect(files).toHaveBeenCalled()
  })

  it("renders code display and edits code", async () => {
    const user = userEvent.setup(); const changed = vi.fn()
    render(<><CodeBlock code="const ready = true" filename="app.ts" showLineNumbers /><InlineCode>npm test</InlineCode><CodeEditor value="let x = 1" onChange={changed} /></>)
    expect(screen.getByText("app.ts")).toBeInTheDocument(); expect(screen.getByText("npm test")).toBeInTheDocument()
    await user.type(screen.getByRole("textbox"), ";"); expect(changed).toHaveBeenCalled()
  })

  it("highlights JSX, TypeScript and multi-line tokens with mode-aware code tokens", () => {
    const code = [
      "const open = useState<boolean>(false)",
      "/* spans",
      "   lines */",
      "<Button variant=\"primary\" onClick={() => setOpen(a < b)}>Save for later</Button>",
    ].join("\n")
    const { container } = render(<CodeBlock code={code} language="tsx" />)
    const tokenClass = (text: string) => Array.from(container.querySelectorAll("td span")).find((span) => span.textContent === text)?.className

    expect(tokenClass("const")).toBe("text-code-keyword")
    expect(tokenClass("useState")).toBe("text-code-function")
    expect(tokenClass("boolean")).toBe("text-code-number")
    expect(tokenClass("Button")).toBe("text-code-type")
    expect(tokenClass("variant")).toBe("text-code-attr")
    expect(tokenClass("\"primary\"")).toBe("text-code-string")
    expect(tokenClass("setOpen")).toBe("text-code-function")
    // JSX text children stay plain even when they contain keywords ("for").
    expect(tokenClass("Save for later")).toBe("text-code-plain")
    // A block comment keeps its comment colour on every line it spans.
    expect(tokenClass("/* spans")).toContain("text-code-comment")
    expect(tokenClass("   lines */")).toContain("text-code-comment")
    // No light/dark class pairs: one token class per role.
    expect(container.innerHTML).not.toMatch(/dark:/)
  })

  it("falls back when clipboard permission is unavailable", async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockRejectedValue(new Error("permission denied"))
    const execCommand = vi.fn(() => true)
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
    Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand })

    render(<CodeBlock code="const ready = true" />)
    await user.click(screen.getByRole("button", { name: "Copy code" }))

    expect(writeText).toHaveBeenCalledWith("const ready = true")
    expect(execCommand).toHaveBeenCalledWith("copy")
    expect(screen.getByRole("button", { name: "Copied code" })).toHaveTextContent("Copied")
  })

  it("renders rich text and terminal components", () => {
    render(<><RichTextEditor value="<p>Hello</p>" /><TerminalBlock title="Build" lines={[{ type: "success", text: "Done" }]} /><TerminalEmulator title="Shell" /></>)
    expect(screen.getByText("Done")).toBeInTheDocument(); expect(screen.getByText("Build")).toBeInTheDocument(); expect(screen.getByText("Shell")).toBeInTheDocument()
  })

  it("sanitizes untrusted rich text: strips handlers, obfuscated schemes, and dangerous tags", () => {
    const { container } = render(
      <RichTextEditor
        sanitize
        value={`<p onclick="steal()">hi</p><a href="jAvA\tscript:alert(1)">x</a><img src=" javascript:alert(1)"><a href="https://ok.example">ok</a><script>evil()</script><iframe src="//e"></iframe>`}
      />,
    )
    const editable = container.querySelector('[contenteditable]') as HTMLElement
    const html = editable.innerHTML
    expect(html).not.toMatch(/onclick/i)
    expect(html).not.toMatch(/javascript:/i)
    expect(html).not.toMatch(/<script|<iframe/i)
    expect(html).toMatch(/https:\/\/ok\.example/)
  })
})

describe("editor and code defaults", () => {
  it("seeds uncontrolled OtpInput and RichTextEditor from defaultValue", () => {
    const { container } = render(<><OtpInput label="Code" length={4} defaultValue="12" /><RichTextEditor defaultValue="<p>Seeded</p>" /></>)
    const digits = screen.getAllByRole("textbox").filter((input) => input.getAttribute("inputmode") === "numeric")
    expect(digits[0]).toHaveValue("1"); expect(digits[1]).toHaveValue("2")
    expect(container.querySelector("[contenteditable]")).toHaveTextContent("Seeded")
  })
})

describe("DataTable part classNames", () => {
  it("applies header, conditional row and per-column cell classes", () => {
    render(<DataTable
      headerClassName="head"
      rowClassName={(row: { id: number; overdue: boolean }) => (row.overdue ? "row-overdue" : undefined)}
      cellClassName="cell"
      pageSizeOptions={false}
      data={[{ id: 1, overdue: true }, { id: 2, overdue: false }]}
      columns={[{ key: "id", header: "ID", headerClassName: "id-head", className: "id-cell", cell: (row) => `#${row.id}` }]}
    />)
    expect(screen.getByRole("columnheader", { name: "ID" })).toHaveClass("id-head")
    expect(screen.getByRole("columnheader", { name: "ID" }).closest("thead")).toHaveClass("head")
    expect(screen.getByText("#1").closest("tr")).toHaveClass("row-overdue")
    expect(screen.getByText("#2").closest("tr")).not.toHaveClass("row-overdue")
    expect(screen.getByText("#1")).toHaveClass("cell", "id-cell")
  })
})

describe("DataTable power features", () => {
  type Row = { id: number; name: string; amount: number; locked?: boolean }
  const rows: Row[] = [
    { id: 1, name: "Atlas", amount: 900 },
    { id: 2, name: "Beacon", amount: 80 },
    { id: 3, name: "Comet", amount: 1500, locked: true },
  ]
  const columns = [
    { key: "name", header: "Name", sortable: true, cell: (r: Row) => r.name },
    { key: "amount", header: "Amount", sortable: true, sortValue: (r: Row) => r.amount, cell: (r: Row) => `$${r.amount}` },
  ]

  it("selects rows, selects all (skipping unselectable rows) and runs bulk actions", async () => {
    const user = userEvent.setup(); const onSelectionChange = vi.fn(); const archive = vi.fn()
    render(<DataTable ariaLabel="Projects" columns={columns} data={rows} selectable pageSizeOptions={false}
      isRowSelectable={(r) => !r.locked} getRowLabel={(r) => r.name} onSelectionChange={onSelectionChange}
      bulkActions={(selected, clear) => <button onClick={() => { archive(selected.map((r) => r.name)); clear() }}>Archive</button>} />)
    await user.click(screen.getByRole("checkbox", { name: "Select Atlas" }))
    expect(onSelectionChange).toHaveBeenLastCalledWith([1], [rows[0]])
    const all = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement
    expect(all.indeterminate).toBe(true)
    expect(screen.getByRole("checkbox", { name: "Select Comet" })).toBeDisabled()
    await user.click(all)
    expect(onSelectionChange).toHaveBeenLastCalledWith([1, 2], [rows[0], rows[1]])
    expect(screen.getByRole("region", { name: "Bulk actions" })).toHaveTextContent("2 selected")
    await user.click(screen.getByRole("button", { name: "Archive" }))
    expect(archive).toHaveBeenCalledWith(["Atlas", "Beacon"])
    expect(screen.queryByRole("region", { name: "Bulk actions" })).not.toBeInTheDocument()
  })

  it("supports single selection", async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={rows} selectable="single" pageSizeOptions={false} getRowLabel={(r) => r.name} />)
    expect(screen.queryByRole("checkbox", { name: "Select all rows" })).not.toBeInTheDocument()
    await user.click(screen.getByRole("checkbox", { name: "Select Atlas" }))
    await user.click(screen.getByRole("checkbox", { name: "Select Beacon" }))
    expect(screen.getByRole("checkbox", { name: "Select Atlas" })).not.toBeChecked()
    expect(screen.getByRole("checkbox", { name: "Select Beacon" })).toBeChecked()
  })

  it("sorts numerically with sortValue and hides columns from the column menu", async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={rows} columnToggle pageSizeOptions={false} />)
    await user.click(screen.getByRole("button", { name: "Amount" }))
    const amounts = () => screen.getAllByRole("row").slice(1).map((row) => row.lastElementChild?.textContent)
    expect(amounts()).toEqual(["$80", "$900", "$1500"])
    await user.click(screen.getByRole("button", { name: "Columns" }))
    await user.click(await screen.findByRole("checkbox", { name: "Amount" }))
    expect(screen.queryByRole("columnheader", { name: "Amount" })).not.toBeInTheDocument()
  })

  it("resizes columns with the keyboard", async () => {
    const user = userEvent.setup(); const onColumnResize = vi.fn()
    render(<DataTable columns={columns} data={rows} resizableColumns onColumnResize={onColumnResize} pageSizeOptions={false} />)
    const handle = screen.getByRole("separator", { name: "Resize Name column" })
    handle.focus()
    await user.keyboard("{ArrowRight}")
    expect(onColumnResize).toHaveBeenCalled()
    expect(handle).toHaveAttribute("aria-valuenow")
  })

  it("pins columns with sticky positioning", () => {
    render(<DataTable columns={[{ ...columns[0], pinned: "left" as const }, { ...columns[1], pinned: "right" as const }]} data={rows} pageSizeOptions={false} />)
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveStyle({ position: "sticky", left: "0px" })
    expect(screen.getByRole("columnheader", { name: "Amount" })).toHaveStyle({ position: "sticky", right: "0px" })
  })

  it("reports state changes without processing data in manual (server-side) mode", async () => {
    const user = userEvent.setup(); const onSortChange = vi.fn(); const onPageChange = vi.fn(); const onQueryChange = vi.fn()
    render(<DataTable manual searchable columns={columns} data={rows} rowCount={42} pageSizeOptions={[3]} onSortChange={onSortChange} onPageChange={onPageChange} onQueryChange={onQueryChange} />)
    expect(screen.getByText("1–3 of 42")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Amount" }))
    expect(onSortChange).toHaveBeenCalledWith({ key: "amount", dir: "asc" })
    // Data order is untouched — the server sorts.
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Atlas")
    await user.type(screen.getByRole("searchbox"), "x")
    expect(onQueryChange).toHaveBeenLastCalledWith("x")
    expect(screen.getAllByRole("row")).toHaveLength(4)
    await user.click(screen.getByRole("button", { name: "Next page" }))
    expect(onPageChange).toHaveBeenLastCalledWith(2)
  })

  it("virtualizes large data sets", () => {
    const many = Array.from({ length: 10_000 }, (_, i) => ({ id: i, name: `Row ${i}`, amount: i }))
    render(<DataTable ariaLabel="Big" columns={columns} data={many} virtualized={{ height: 300, rowHeight: 40 }} />)
    const table = screen.getByRole("table", { name: "Big" })
    expect(table).toHaveAttribute("aria-rowcount", "10001")
    // Header row + visible window (300/40 = 8, plus overscan 6) — far fewer than 10,000.
    const rendered = screen.getAllByRole("row").filter((row) => !row.hasAttribute("aria-hidden"))
    expect(rendered.length).toBeLessThan(30)
    expect(screen.getByText("Row 0")).toBeInTheDocument()
    expect(screen.queryByText("Row 5000")).not.toBeInTheDocument()
  })
})

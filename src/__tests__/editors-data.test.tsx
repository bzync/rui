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
    render(<><Calendar value={new Date(2026, 7, 21)} onChange={onChange} /><DatePicker label="Release date" /></>)
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
})

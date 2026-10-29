import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createRef, type ReactElement, type RefObject } from "react"
import * as R from "@/index"
import { describe, expect, it, vi } from "vitest"
import {
  AspectRatio, AuthBackdrop, DevMode, resolveBreakpoint, Avatar, AvatarGroup, AvatarGroupOverflow, Badge, Blockquote, Breadcrumb, Callout, Card, CardBody, CardDescription, CardFooter,
  CardHeader, CardTitle, EmptyState, ErrorState, FormField, Input, Kbd, Label,
  Currency, DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm, Divider, Heading, InlineCode, Link, List, ListItem, Progressbar, Prose, ScrollArea, Separator, Skeleton, SkeletonAvatar, SkeletonCard,
  Alert, Button, SkeletonList, SkeletonRegion, SkeletonStat, Tag,
  SkeletonTable, SkeletonText, SkeletonTopbar, Spinner, Stat, StatusDot, Stepper,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea, Timeline,
  AppShell, AppShellBody, AppShellHeader, AppShellMain, Container, Footer, Inline, PageHeader, Stack, Text,
} from "@/index"

describe("display and layout components", () => {
  it("renders identity and status primitives", () => {
    const backdropRef = { current: null as HTMLDivElement | null }
    render(<><AuthBackdrop ref={backdropRef} className="custom-backdrop" data-testid="auth-backdrop" /><Avatar name="Ada Lovelace" /><Badge dot>Live</Badge><StatusDot status="online" label="Online" /><Spinner /></>)
    expect(screen.getByTestId("auth-backdrop")).toBe(backdropRef.current)
    expect(screen.getByTestId("auth-backdrop")).toHaveClass("custom-backdrop")
    expect(screen.getByText("AL")).toBeInTheDocument()
    expect(screen.getByText("Live")).toBeInTheDocument()
    expect(screen.getByText("Online")).toBeInTheDocument()
  })

  it("renders cards, callouts, stats, and state messaging", () => {
    render(<>
      <Card><CardHeader><CardTitle>Usage</CardTitle><CardDescription>Current month</CardDescription></CardHeader><CardBody>42 GB</CardBody><CardFooter>Updated</CardFooter></Card>
      <Callout title="Notice">Maintenance tonight</Callout>
      <Stat label="Requests" value="12k" trend="up" trendValue="8%" />
      <EmptyState title="No projects" description="Create one" />
      <ErrorState title="Failed" error="Network unavailable" />
    </>)
    for (const text of ["Usage", "42 GB", "Notice", "Requests", "No projects", "Failed"]) expect(screen.getByText(text)).toBeInTheDocument()
  })

  it("renders labeled form primitives with accessible names", () => {
    render(<>
      <Input label="Email" error="Required" />
      <Textarea label="Message" hint="Be concise" />
      <FormField label="Project" htmlFor="project" required><input id="project" /></FormField>
      <Label htmlFor="token" required hint="Secret">Token</Label><input id="token" />
    </>)
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAccessibleDescription("Required")
    expect(screen.getByRole("textbox", { name: "Message" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: /Project/ })).toBeInTheDocument()
  })

  it("renders navigation, list, and timeline semantics", () => {
    render(<>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Settings" }]} />
      <List><ListItem href="/projects" description="Three active">Projects</ListItem></List>
      <Timeline events={[{ id: "1", title: "Deployed", timestamp: "Now" }]} />
      <Link href="https://example.com" external>Docs</Link>
      <Kbd keys={["⌘", "K"]} />
    </>)
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Projects/ })).toBeInTheDocument()
    expect(screen.getByText("Deployed")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Docs/ })).toHaveAttribute("target", "_blank")
  })

  it("renders progress, step, table, separators, and skeleton variants", () => {
    render(<>
      <Progressbar value={60} label="Upload" showValue />
      <Stepper current={1} steps={[{ label: "Draft" }, { label: "Review" }]} />
      <Separator label="Details" />
      <Table><TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>API</TableCell></TableRow></TableBody></Table>
      <div data-testid="skeletons"><Skeleton /><SkeletonText lines={2} /><SkeletonAvatar /><SkeletonCard /><SkeletonTopbar /><SkeletonTable rows={2} cols={2} /></div>
    </>)
    expect(screen.getByText("60%")).toBeInTheDocument()
    expect(screen.getByText("Review")).toBeInTheDocument()
    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByTestId("skeletons").querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(5)
  })

  it("composes an accessible application shell and page layout", () => {
    render(
      <AppShell fixed data-testid="shell">
        <AppShellBody>
          <AppShellHeader sticky>Global header</AppShellHeader>
          <AppShellMain scrollable>
            <Container size="sm">
              <PageHeader title="Projects" description="Manage deployments" actions={<button>New project</button>} />
              <Stack><div>First</div><Inline><span>Second</span><span>Third</span></Inline></Stack>
            </Container>
          </AppShellMain>
          <Footer>Copyright</Footer>
        </AppShellBody>
      </AppShell>,
    )
    expect(screen.getByTestId("shell")).toHaveClass("h-dvh")
    expect(screen.getByRole("banner")).toHaveTextContent("Global header")
    expect(screen.getByRole("main")).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Copyright")
  })

  it("constrains aspect-ratio content and exposes keyboard-scrollable regions", () => {
    render(<>
      <AspectRatio ratio={4 / 3} className="rounded-lg" data-testid="ratio"><span>Preview</span></AspectRatio>
      <ScrollArea className="max-h-20" aria-label="Activity log"><div>Build completed</div></ScrollArea>
      <ScrollArea orientation="horizontal" keyboardNavigable={false} data-testid="horizontal-scroll"><div>Wide content</div></ScrollArea>
    </>)

    expect(screen.getByTestId("ratio")).toHaveStyle({ aspectRatio: 4 / 3 })
    expect(screen.getByTestId("ratio")).toHaveClass("rounded-lg")
    expect(screen.getByLabelText("Activity log")).toHaveAttribute("tabindex", "0")
    expect(screen.getByTestId("horizontal-scroll")).not.toHaveAttribute("tabindex")
    expect(screen.getByTestId("horizontal-scroll")).toHaveClass("overflow-x-auto")
  })

  it("composes avatar groups and semantic description lists", () => {
    render(<>
      <AvatarGroup aria-label="Project members" spacing="tight">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
        <AvatarGroupOverflow count={3} />
      </AvatarGroup>
      <DescriptionList columns={2} aria-label="Service details">
        <DescriptionItem><DescriptionTerm>Region</DescriptionTerm><DescriptionDetails>US East</DescriptionDetails></DescriptionItem>
        <DescriptionItem orientation="inline"><DescriptionTerm>Status</DescriptionTerm><DescriptionDetails>Healthy</DescriptionDetails></DescriptionItem>
      </DescriptionList>
    </>)

    expect(screen.getByRole("group", { name: "Project members" })).toHaveClass("-space-x-3")
    expect(screen.getByLabelText("3 more people")).toHaveTextContent("+3")
    expect(screen.getAllByRole("term").map((term) => term.textContent)).toContain("Region")
    expect(screen.getAllByRole("definition").map((definition) => definition.textContent)).toContain("US East")
  })

  it("renders a semantic blockquote with linked attribution", () => {
    render(<Blockquote cite="https://example.com/research" source="Research report" sourceHref="/report" variant="accent">Reliable systems make failure visible.</Blockquote>)

    const quote = screen.getByText("Reliable systems make failure visible.").closest("blockquote")
    expect(quote).toHaveAttribute("cite", "https://example.com/research")
    expect(quote).toHaveClass("border-l-accent-500")
    expect(screen.getByRole("link", { name: "Research report" })).toHaveAttribute("href", "/report")
  })

  it("formats localized currency with semantic and accessible compact values", () => {
    render(<>
      <Currency value={1234.5} currency="USD" data-testid="usd" />
      <Currency value={-920} currency="USD" accounting data-testid="negative" />
      <Currency value={1840000} currency="USD" options={{ notation: "compact", maximumFractionDigits: 1 }} data-testid="compact" />
      <Currency value={Number.NaN} fallback="Unavailable" data-testid="invalid" />
    </>)

    expect(screen.getByTestId("usd")).toHaveTextContent("$1,234.50")
    expect(screen.getByTestId("negative")).toHaveTextContent("($920.00)")
    expect(screen.getByTestId("negative")).toHaveClass("text-danger-strong")
    expect(screen.getByTestId("compact").getAttribute("aria-label")).toContain("1,840,000")
    expect(screen.getByTestId("invalid")).toHaveTextContent("Unavailable")
    expect(screen.getByTestId("invalid")).toHaveAttribute("data-invalid", "true")
  })

  it("renders semantic responsive typography primitives", () => {
    render(<>
      <Heading as="h1" size="lg" data-testid="heading">Operations</Heading>
      <Text as="span" variant="caption" wrap="nowrap" className="text-sm">Updated recently</Text>
      <Prose as="article" aria-label="Runbook"><h2>Recovery</h2><p>Restore service safely.</p></Prose>
      <InlineCode data-language="shell">npm run build</InlineCode>
    </>)

    expect(screen.getByRole("heading", { level: 1, name: "Operations" })).toHaveClass("text-2xl", "sm:text-3xl")
    expect(screen.getByText("Updated recently")).toHaveClass("truncate", "text-sm")
    expect(screen.getByRole("article", { name: "Runbook" })).toHaveClass("max-w-3xl")
    expect(screen.getByText("npm run build").tagName).toBe("CODE")
    expect(screen.getByText("npm run build")).toHaveAttribute("data-language", "shell")
  })

  it("formats semantic date, time, number, percent, and currency text", () => {
    render(<>
      <Text variant="date" value="2026-08-27" data-testid="date" />
      <Text variant="time" value="13:05" hour12 data-testid="time-12" />
      <Text variant="time" value="13:05" hour12={false} data-testid="time-24" />
      <Text variant="number" value={12480} data-testid="number" />
      <Text variant="percent" value={0.962} numberOptions={{ maximumFractionDigits: 1 }} data-testid="percent" />
      <Text variant="currency" value={-920} currency="USD" accounting data-testid="text-currency" />
      <Text variant="success" data-testid="success">Operational</Text>
      <Text variant="warning" data-testid="warning">Capacity warning</Text>
      <Text variant="danger" data-testid="danger">Deployment failed</Text>
      <Text variant="info" data-testid="info">Maintenance scheduled</Text>
      <Text variant="time" value="not-a-time" fallback="Unknown" data-testid="time-invalid" />
    </>)

    expect(screen.getByTestId("date")).toHaveTextContent("Aug 27, 2026")
    expect(screen.getByTestId("date")).toHaveAttribute("datetime", "2026-08-27")
    expect(screen.getByTestId("time-12")).toHaveTextContent("1:05 PM")
    expect(screen.getByTestId("time-12").tagName).toBe("TIME")
    expect(screen.getByTestId("time-12")).toHaveAttribute("datetime", "13:05")
    expect(screen.getByTestId("time-24")).toHaveTextContent("13:05")
    expect(screen.getByTestId("number")).toHaveTextContent("12,480")
    expect(screen.getByTestId("percent")).toHaveTextContent("96.2%")
    expect(screen.getByTestId("text-currency")).toHaveTextContent("($920.00)")
    expect(screen.getByTestId("text-currency")).toHaveClass("text-danger-strong")
    expect(screen.getByTestId("success")).toHaveClass("text-success-strong")
    expect(screen.getByTestId("warning")).toHaveClass("text-warning-strong")
    expect(screen.getByTestId("danger")).toHaveClass("text-danger-strong")
    expect(screen.getByTestId("info")).toHaveClass("text-info-strong")
    expect(screen.getByTestId("time-invalid")).toHaveTextContent("Unknown")
    expect(screen.getByTestId("time-invalid")).toHaveAttribute("data-invalid", "true")
  })

  it("renders semantic divider rules with labeled and decorative variants", () => {
    render(<>
      <Divider decorative={false} aria-label="Section divider" data-testid="divider-h" />
      <Divider label="OR" decorative={false} aria-label="Content divider" />
      <Divider orientation="vertical" decorative={false} aria-label="Vertical divider" data-testid="divider-v" />
      <Divider decorative data-testid="decorative" />
      <Divider variant="dashed" data-testid="dashed" />
      <Divider variant="dotted" data-testid="dotted" />
      <Divider spacing="lg" data-testid="spacing-lg" />
    </>)

    const horizontal = screen.getByRole("separator", { name: "Section divider" })
    expect(horizontal).toHaveAttribute("aria-orientation", "horizontal")
    expect(horizontal).toHaveClass("my-4")

    expect(screen.getByRole("separator", { name: "Content divider" })).toHaveTextContent("OR")

    const vertical = screen.getByRole("separator", { name: "Vertical divider" })
    expect(vertical).toHaveAttribute("aria-orientation", "vertical")
    expect(vertical).toHaveClass("mx-4")

    expect(screen.getByTestId("decorative").getAttribute("role")).toBe("presentation")
    expect(screen.getByTestId("dashed").querySelector(".border-dashed")).toBeInTheDocument()
    expect(screen.getByTestId("dotted").querySelector(".border-dotted")).toBeInTheDocument()
    expect(screen.getByTestId("spacing-lg")).toHaveClass("my-6")
  })
})

describe("shared tone vocabulary", () => {
  it("accepts danger everywhere and keeps error/destructive as aliases", () => {
    render(<>
      <Badge variant="danger" data-testid="badge-danger">x</Badge>
      <Badge variant="error" data-testid="badge-error">x</Badge>
      <Tag variant="danger" data-testid="tag-danger">x</Tag>
      <Tag variant="muted" data-testid="tag-muted">x</Tag>
      <Callout variant="danger" data-testid="callout-danger">x</Callout>
      <Button variant="danger">Delete</Button>
      <Button variant="destructive">Remove</Button>
      <StatusDot status="success" dotClassName="dot-success" />
      <StatusDot status="danger" dotClassName="dot-danger" />
    </>)
    expect(screen.getByTestId("badge-danger").className).toBe(screen.getByTestId("badge-error").className)
    expect(screen.getByTestId("badge-danger")).toHaveClass("text-danger-strong")
    expect(screen.getByTestId("tag-danger")).toHaveClass("text-danger-strong")
    expect(screen.getByTestId("tag-muted")).toHaveClass("text-muted-foreground")
    expect(screen.getByTestId("callout-danger")).toHaveClass("bg-danger/8")
    expect(screen.getByRole("button", { name: "Delete" }).className).toBe(screen.getByRole("button", { name: "Remove" }).className.replace("Remove", "Delete"))
    expect(document.querySelector(".dot-success:not(.animate-ping)")).toHaveClass("bg-success")
    expect(document.querySelector(".dot-danger:not(.animate-ping)")).toHaveClass("bg-danger")
  })

  it("gives Alert a neutral default tone and announces danger as an alert", () => {
    render(<>
      <Alert variant="default" title="Heads up" data-testid="neutral" />
      <Alert variant="danger" title="Failed" />
      <Alert variant="error" title="Legacy failed" />
    </>)
    expect(screen.getByTestId("neutral")).toHaveAttribute("role", "status")
    expect(screen.getByTestId("neutral")).toHaveClass("bg-muted")
    expect(screen.getByText("Failed").closest("[role]")).toHaveAttribute("role", "alert")
    expect(screen.getByText("Legacy failed").closest("[role]")).toHaveAttribute("role", "alert")
  })
})

describe("skeleton loading announcements", () => {
  it("announces composite skeletons as busy status regions by default", () => {
    render(<>
      <SkeletonCard />
      <SkeletonTable label="Loading invoices" />
      <SkeletonList />
      <SkeletonStat />
    </>)
    const regions = screen.getAllByRole("status")
    expect(regions).toHaveLength(4)
    for (const region of regions) expect(region).toHaveAttribute("aria-busy", "true")
    expect(screen.getByText("Loading invoices")).toHaveClass("sr-only")
  })

  it("wraps a layout in one SkeletonRegion with silent children", () => {
    render(<SkeletonRegion label="Loading dashboard"><SkeletonCard label={false} /><SkeletonText /></SkeletonRegion>)
    expect(screen.getAllByRole("status")).toHaveLength(1)
    expect(screen.getByRole("status")).toHaveTextContent("Loading dashboard")
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true")
  })
})

describe("DevMode viewport inspector", () => {
  function resizeTo(width: number, height = 800) {
    act(() => {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: width })
      Object.defineProperty(window, "innerHeight", { configurable: true, value: height })
      window.dispatchEvent(new Event("resize"))
    })
  }

  it("resolves breakpoints, including custom scales", () => {
    expect(resolveBreakpoint(320)).toBe("base")
    expect(resolveBreakpoint(640)).toBe("sm")
    expect(resolveBreakpoint(1300)).toBe("xl")
    expect(resolveBreakpoint(900, { tablet: 600, desktop: 1200 })).toBe("tablet")
    expect(resolveBreakpoint(320, { phone: 0, tablet: 600 })).toBe("phone")
  })

  it("omits the synthetic base segment when the scale starts at 0", () => {
    render(<DevMode floating={false} hotkey={false} storageKey={false} breakpoints={{ phone: 0, tablet: 600 }} />)
    const scale = screen.getByRole("list", { name: "Breakpoints" })
    expect(within(scale).queryByText("base")).not.toBeInTheDocument()
    expect(within(scale).getAllByRole("listitem")).toHaveLength(2)
  })

  it("shows live size and the active breakpoint, and follows resizes", async () => {
    resizeTo(1024, 768)
    render(<DevMode floating={false} hotkey={false} storageKey={false} />)
    expect(screen.getByRole("region", { name: "Viewport inspector" })).toBeInTheDocument()
    expect(screen.getByTestId("devmode-size")).toHaveTextContent("1024 × 768")
    expect(within(screen.getByRole("list", { name: "Breakpoints" })).getByText("lg")).toHaveAttribute("aria-current", "true")
    resizeTo(700, 900)
    await waitFor(() => expect(screen.getByTestId("devmode-size")).toHaveTextContent("700 × 900"))
    expect(within(screen.getByRole("list", { name: "Breakpoints" })).getByText("sm")).toHaveAttribute("aria-current", "true")
    expect(screen.getByText("portrait")).toBeInTheDocument()
  })

  it("collapses, toggles layout outlines and hides with the hotkey", async () => {
    resizeTo(1280)
    const user = userEvent.setup()
    render(<DevMode floating={false} storageKey={false} />)
    await user.click(screen.getByRole("button", { name: "Outline layout boxes" }))
    expect(document.documentElement).toHaveAttribute("data-rui-devmode-outline")
    await user.click(screen.getByRole("button", { name: "Outline layout boxes" }))
    expect(document.documentElement).not.toHaveAttribute("data-rui-devmode-outline")

    await user.click(screen.getByRole("button", { name: "Collapse viewport inspector" }))
    await user.click(screen.getByRole("button", { name: /Expand viewport inspector \(xl, 1280px\)/ }))
    expect(screen.getByTestId("devmode-size")).toBeInTheDocument()

    await user.keyboard("{Control>}{Shift>}d{/Shift}{/Control}")
    expect(screen.queryByRole("region", { name: "Viewport inspector" })).not.toBeInTheDocument()
  })

  it("renders nothing when disabled and floats in a portal by default", () => {
    const { container, unmount } = render(<DevMode enabled={false} />)
    expect(container).toBeEmptyDOMElement()
    unmount()
    const { container: floatingContainer } = render(<div data-testid="host"><DevMode storageKey={false} /></div>)
    const panel = screen.getByRole("region", { name: "Viewport inspector" })
    expect(floatingContainer).not.toContainElement(panel)
    expect(panel).toHaveClass("fixed")
  })

  it("persists settings across reloads and ignores corrupt storage", async () => {
    resizeTo(1024)
    window.localStorage.clear()
    const user = userEvent.setup()
    const first = render(<DevMode floating={false} storageKey="devmode-test" />)
    await user.click(screen.getByRole("button", { name: "Inspect spacing" }))
    await user.click(screen.getByRole("button", { name: "Collapse viewport inspector" }))
    expect(JSON.parse(window.localStorage.getItem("devmode-test")!)).toMatchObject({ collapsed: true, inspect: true })
    first.unmount()

    // A fresh mount (page load) restores the collapsed pill.
    render(<DevMode floating={false} storageKey="devmode-test" />)
    expect(screen.getByRole("button", { name: /Expand viewport inspector/ })).toBeInTheDocument()
    cleanup()

    window.localStorage.setItem("devmode-test", "{not json")
    render(<DevMode floating={false} storageKey="devmode-test" />)
    expect(screen.getByTestId("devmode-size")).toBeInTheDocument()
  })

  it("draws margin, border, padding and content bands for the hovered element", async () => {
    resizeTo(1024)
    render(<><div data-testid="target" style={{ margin: "10px 20px", padding: "8px", border: "2px solid" }}>Box</div><DevMode floating={false} storageKey={false} /></>)
    const target = screen.getByTestId("target")
    target.getBoundingClientRect = () => ({ top: 100, left: 50, width: 200, height: 40, right: 250, bottom: 140, x: 50, y: 100, toJSON: () => ({}) })
    const originalElementFromPoint = document.elementFromPoint
    document.elementFromPoint = () => target
    const user = userEvent.setup()
    await user.click(screen.getByRole("button", { name: "Inspect spacing" }))
    expect(screen.getByRole("list", { name: "Box model legend" })).toHaveTextContent("marginborderpaddingcontent")
    act(() => { document.dispatchEvent(new PointerEvent("pointermove", { clientX: 60, clientY: 110 })) })
    await waitFor(() => expect(screen.getByTestId("devmode-margin")).toBeInTheDocument())
    expect(screen.getByTestId("devmode-margin").style.borderWidth).toBe("10px 20px")
    expect(screen.getByTestId("devmode-border").style.borderWidth).toBe("2px")
    expect(screen.getByTestId("devmode-padding").style.borderWidth).toBe("8px")
    expect(screen.getByTestId("devmode-content").style.width).toBe(`${200 - 4 - 16}px`)
    expect(screen.getByText(/m 10 20/)).toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(screen.queryByTestId("devmode-margin")).not.toBeInTheDocument()
    document.elementFromPoint = originalElementFromPoint
  })
})

describe("ref forwarding", () => {
  it("forwards refs to the root DOM element of every public component", () => {
    const cases: [string, (ref: RefObject<never>) => ReactElement, typeof Element][] = [
      ["Alert", (ref) => <R.Alert ref={ref} title="Hi" />, HTMLDivElement],
      ["Avatar", (ref) => <R.Avatar ref={ref} name="Maya" />, HTMLDivElement],
      ["Badge", (ref) => <R.Badge ref={ref}>New</R.Badge>, HTMLSpanElement],
      ["Breadcrumb", (ref) => <R.Breadcrumb ref={ref} items={[{ label: "Home" }]} />, HTMLElement],
      ["Callout", (ref) => <R.Callout ref={ref}>Note</R.Callout>, HTMLDivElement],
      ["Card", (ref) => <R.Card ref={ref} />, HTMLDivElement],
      ["CardTitle", (ref) => <R.CardTitle ref={ref}>Title</R.CardTitle>, HTMLHeadingElement],
      ["CodeBlock", (ref) => <R.CodeBlock ref={ref} code="x" />, HTMLDivElement],
      ["CopyButton", (ref) => <R.CopyButton ref={ref} value="x" />, HTMLButtonElement],
      ["DataTable", (ref) => <R.DataTable ref={ref} columns={[]} data={[]} />, HTMLDivElement],
      ["EmptyState", (ref) => <R.EmptyState ref={ref} title="Empty" />, HTMLDivElement],
      ["ErrorState", (ref) => <R.ErrorState ref={ref} />, HTMLDivElement],
      ["FormField", (ref) => <R.FormField ref={ref}><input /></R.FormField>, HTMLDivElement],
      ["Kbd", (ref) => <R.Kbd ref={ref} keys="K" />, HTMLSpanElement],
      ["Label", (ref) => <R.Label ref={ref}>Name</R.Label>, HTMLLabelElement],
      ["Link", (ref) => <R.Link ref={ref} href="/">Docs</R.Link>, HTMLAnchorElement],
      ["List", (ref) => <R.List ref={ref}><R.ListItem>One</R.ListItem></R.List>, HTMLUListElement],
      ["ModalBody", (ref) => <R.ModalBody ref={ref} />, HTMLDivElement],
      ["Navbar", (ref) => <R.Navbar ref={ref} items={[]} />, HTMLElement],
      ["OtpInput", (ref) => <R.OtpInput ref={ref} length={4} />, HTMLDivElement],
      ["Pagination", (ref) => <R.Pagination ref={ref} totalPages={3} />, HTMLElement],
      ["Progressbar", (ref) => <R.Progressbar ref={ref} value={40} />, HTMLDivElement],
      ["RadioGroup", (ref) => <R.RadioGroup ref={ref}><R.Radio value="a" label="A" /></R.RadioGroup>, HTMLDivElement],
      ["RichTextEditor", (ref) => <R.RichTextEditor ref={ref} />, HTMLDivElement],
      ["Skeleton", (ref) => <R.Skeleton ref={ref} />, HTMLDivElement],
      ["SkeletonAvatar", (ref) => <R.SkeletonAvatar ref={ref} />, HTMLDivElement],
      ["Spinner", (ref) => <R.Spinner ref={ref} />, SVGSVGElement],
      ["Stat", (ref) => <R.Stat ref={ref} label="Users" value={3} />, HTMLDivElement],
      ["StatusDot", (ref) => <R.StatusDot ref={ref} status="online" />, HTMLSpanElement],
      ["Stepper", (ref) => <R.Stepper ref={ref} steps={[{ label: "One" }]} current={0} />, HTMLOListElement],
      ["Table", (ref) => <R.Table ref={ref}><R.TableBody><R.TableRow><R.TableCell>x</R.TableCell></R.TableRow></R.TableBody></R.Table>, HTMLDivElement],
      ["Tabs", (ref) => <R.Tabs ref={ref} defaultValue="a"><R.TabsList><R.TabsTrigger value="a">A</R.TabsTrigger></R.TabsList></R.Tabs>, HTMLDivElement],
      ["Tag", (ref) => <R.Tag ref={ref}>tag</R.Tag>, HTMLSpanElement],
      ["Tooltip", (ref) => <R.Tooltip ref={ref} content="tip"><button>t</button></R.Tooltip>, HTMLDivElement],
      ["Popover", (ref) => <R.Popover ref={ref} trigger={<button>p</button>}>body</R.Popover>, HTMLDivElement],
      ["DropdownMenu", (ref) => <R.DropdownMenu ref={ref} trigger={<button>m</button>} items={[]} />, HTMLDivElement],
      ["Accordion", (ref) => <R.Accordion ref={ref} items={[]} />, HTMLDivElement],
      ["Collapsible", (ref) => <R.Collapsible ref={ref} trigger="More">Body</R.Collapsible>, HTMLDivElement],
      ["BarChart", (ref) => <R.BarChart ref={ref} data={[{ label: "a", value: 1 }]} />, HTMLDivElement],
      ["ThemeToggle", (ref) => <R.ThemeProvider storageKey={false}><R.ThemeToggle ref={ref} /></R.ThemeProvider>, HTMLButtonElement],
      ["Modal", (ref) => <R.Modal ref={ref} open onClose={() => {}} title="Modal">Body</R.Modal>, HTMLDivElement],
      ["Drawer", (ref) => <R.Drawer ref={ref} open onClose={() => {}} title="Drawer">Body</R.Drawer>, HTMLDivElement],
      ["Sheet", (ref) => <R.Sheet ref={ref} open onOpenChange={() => {}} title="Sheet">Body</R.Sheet>, HTMLDivElement],
      ["ConfirmDialog", (ref) => <R.ConfirmDialog ref={ref} open onClose={() => {}} onConfirm={() => {}} title="Confirm" />, HTMLDivElement],
      ["Overlay", (ref) => <R.Overlay ref={ref} open onClose={() => {}}>Body</R.Overlay>, HTMLDivElement],
      ["Lightbox", (ref) => <R.Lightbox ref={ref} open images={[{ src: "/1.jpg", alt: "One" }]} />, HTMLDivElement],
      ["Timeline", (ref) => <R.Timeline ref={ref} events={[{ id: "1", title: "Step" }]} />, HTMLOListElement],
      ["Tree", (ref) => <R.Tree ref={ref} nodes={[{ id: "1", label: "Root" }]} />, HTMLUListElement],
      ["SortableList", (ref) => <R.SortableList ref={ref} items={[{ id: "1" }]} onReorder={() => {}} renderItem={(i) => i.id} />, HTMLUListElement],
      ["Kanban", (ref) => <R.Kanban ref={ref} columns={[{ id: "todo", title: "To do", items: [{ id: "1" }] }]} onChange={() => {}} renderCard={(i) => i.id} />, HTMLDivElement],
      ["Icon", (ref) => <R.Icon ref={ref} name="check" />, SVGSVGElement],
      ["Icons.Check", (ref) => <R.Icons.Check ref={ref} />, SVGSVGElement],
      ["Signature", (ref) => <R.Signature ref={ref} />, HTMLDivElement],
      ["SignaturePad", (ref) => <R.SignaturePad ref={ref} />, HTMLDivElement],
      ["SignatureImageEditor", (ref) => <R.SignatureImageEditor ref={ref} image="data:image/png;base64,sample" />, HTMLDivElement],
    ]
    for (const [name, element, type] of cases) {
      const ref = createRef<never>()
      const { unmount } = render(element(ref as RefObject<never>))
      expect(ref.current, name).toBeInstanceOf(type)
      unmount()
    }
  })
})

describe("responsive layout guards", () => {
  it("keeps table scrollers as containing blocks and lets fields and pagination shrink", () => {
    render(<>
      <R.Table aria-label="Wide"><R.TableBody><R.TableRow><R.TableCell>Cell</R.TableCell></R.TableRow></R.TableBody></R.Table>
      <R.Input aria-label="Field" />
      <R.Pagination totalPages={20} />
    </>)
    // Absolutely positioned cell content (sr-only labels) must be clipped by the scroller.
    expect(screen.getByRole("table", { name: "Wide" }).parentElement).toHaveClass("relative", "overflow-x-auto", "min-w-0")
    expect(screen.getByRole("textbox", { name: "Field" }).closest(".flex-col")).toHaveClass("min-w-0")
    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveClass("flex-wrap")
  })

  it("renders the ScatterChart y-axis label", () => {
    render(<R.ScatterChart yLabel="Latency" xLabel="Requests" series={[{ label: "API", data: [{ x: 1, y: 2 }] }]} />)
    expect(screen.getByText("Latency")).toBeInTheDocument()
    expect(screen.getByText("Requests")).toBeInTheDocument()
  })
})

describe("Resizable", () => {
  it("resizes with the keyboard within limits, persists and resets on double-click", async () => {
    window.localStorage.clear()
    const user = userEvent.setup(); const onResize = vi.fn()
    const { unmount } = render(
      <R.Resizable defaultSizes={[30, 70]} minSizes={[20, 40]} storageKey="split-test" panelLabels={["Files", "Editor"]} onResize={onResize}>
        <R.ResizablePanel>Files</R.ResizablePanel>
        <R.ResizablePanel>Editor</R.ResizablePanel>
      </R.Resizable>,
    )
    const handle = screen.getByRole("separator", { name: "Resize Files and Editor" })
    expect(handle).toHaveAttribute("aria-valuenow", "30")
    handle.focus()
    await user.keyboard("{ArrowRight}")
    expect(onResize).toHaveBeenLastCalledWith([32, 68])
    await user.keyboard("{Shift>}{ArrowRight}{ArrowRight}{ArrowRight}{/Shift}")
    // Capped by the right panel's 40% minimum.
    expect(onResize).toHaveBeenLastCalledWith([60, 40])
    await user.keyboard("{Home}")
    expect(onResize).toHaveBeenLastCalledWith([20, 80])
    expect(JSON.parse(window.localStorage.getItem("split-test")!)).toEqual([20, 80])
    unmount()
    render(
      <R.Resizable defaultSizes={[30, 70]} storageKey="split-test" panelLabels={["Files", "Editor"]}>
        <R.ResizablePanel>Files</R.ResizablePanel>
        <R.ResizablePanel>Editor</R.ResizablePanel>
      </R.Resizable>,
    )
    const restored = screen.getByRole("separator")
    expect(restored).toHaveAttribute("aria-valuenow", "20")
    await user.dblClick(restored)
    expect(restored).toHaveAttribute("aria-valuenow", "30")
  })
})

describe("Banner", () => {
  it("announces by tone and renders title, message and action", () => {
    const { rerender } = render(<R.Banner title="Maintenance" action={<a href="#/status">Status page</a>}>Saturday 02:00 UTC</R.Banner>)
    expect(screen.getByRole("status")).toHaveTextContent("Maintenance·Saturday 02:00 UTC")
    expect(screen.getByRole("link", { name: "Status page" })).toBeInTheDocument()
    rerender(<R.Banner tone="danger" variant="solid">Payment failed</R.Banner>)
    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "danger")
  })

  it("remembers a dismissal under storageKey", async () => {
    const user = userEvent.setup()
    window.localStorage.removeItem("test-banner")
    const onDismiss = vi.fn()
    const { unmount } = render(<R.Banner dismissible storageKey="test-banner" onDismiss={onDismiss}>Trial ends soon</R.Banner>)
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(onDismiss).toHaveBeenCalled()
    expect(screen.queryByText("Trial ends soon")).not.toBeInTheDocument()
    unmount()
    render(<R.Banner dismissible storageKey="test-banner">Trial ends soon</R.Banner>)
    await waitFor(() => expect(screen.queryByText("Trial ends soon")).not.toBeInTheDocument())
    window.localStorage.removeItem("test-banner")
  })
})

describe("Image", () => {
  it("fades in on load, tries the fallback, then shows the alt text", () => {
    const { container } = render(<R.Image src="/a.jpg" fallbackSrc="/b.jpg" alt="Mountain lake" aspectRatio={16 / 9} />)
    const wrapper = container.firstElementChild as HTMLElement
    const img = screen.getByRole("img", { name: "Mountain lake" })
    expect(img).toHaveAttribute("loading", "lazy")
    expect(wrapper).toHaveAttribute("data-status", "loading")
    act(() => { img.dispatchEvent(new Event("error")) })
    expect(screen.getByRole("img", { name: "Mountain lake" })).toHaveAttribute("src", "/b.jpg")
    act(() => { screen.getByRole("img", { name: "Mountain lake" }).dispatchEvent(new Event("error")) })
    expect(wrapper).toHaveAttribute("data-status", "error")
    expect(screen.getByRole("img", { name: "Mountain lake" }).tagName).toBe("DIV")
  })

  it("marks the image loaded", () => {
    const { container } = render(<R.Image src="/a.jpg" alt="" />)
    act(() => { container.querySelector("img")!.dispatchEvent(new Event("load")) })
    expect(container.firstElementChild).toHaveAttribute("data-status", "loaded")
  })
})

describe("Lightbox", () => {
  const images = [{ src: "/1.jpg", alt: "First" }, { src: "/2.jpg", alt: "Second", caption: "Second caption" }, { src: "/3.jpg", alt: "Third" }]

  it("navigates with keys and buttons, and closes with Escape", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const onIndexChange = vi.fn()
    render(<R.Lightbox images={images} open onOpenChange={onOpenChange} onIndexChange={onIndexChange} />)
    const dialog = screen.getByRole("dialog", { name: "Image viewer" })
    expect(dialog).toHaveTextContent("1 of 3")
    expect(screen.getAllByRole("button", { name: "Previous image" })[0]).toBeDisabled()
    await user.keyboard("{ArrowRight}")
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
    expect(screen.getByText("Second caption")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Show image 3: Third" }))
    expect(dialog).toHaveTextContent("3 of 3")
    expect(screen.getAllByRole("button", { name: "Next image" })[0]).toBeDisabled()
    await user.keyboard("{Escape}")
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

describe("Icon and Icons", () => {
  it("renders by name and supports aliases and case-insensitivity", () => {
    const { container: c1 } = render(<R.Icon name="check" data-testid="icon-check" />)
    const { container: c2 } = render(<R.Icon name="Check" data-testid="icon-pascal" />)
    const { container: c3 } = render(<R.Icon name="close" data-testid="icon-alias-close" />)
    const { container: c4 } = render(<R.Icon name="spinner" data-testid="icon-alias-spinner" />)

    expect(c1.querySelector("svg")).toBeInTheDocument()
    expect(c2.querySelector("svg")).toBeInTheDocument()
    // "close" maps to "x"
    expect(c3.querySelector("svg")).toHaveAttribute("data-icon", "x")
    // "spinner" maps to "loader"
    expect(c4.querySelector("svg")).toHaveAttribute("data-icon", "loader")
  })

  it("renders through the Icons.* component dictionary", () => {
    render(
      <div>
        <R.Icons.Check data-testid="dict-check" />
        <R.Icons.Copy data-testid="dict-copy" />
        <R.Icons.Search data-testid="dict-search" />
        <R.Icons.Loader spin data-testid="dict-loader" />
      </div>,
    )

    expect(screen.getByTestId("dict-check")).toHaveAttribute("data-icon", "check")
    expect(screen.getByTestId("dict-copy")).toHaveAttribute("data-icon", "copy")
    expect(screen.getByTestId("dict-search")).toHaveAttribute("data-icon", "search")
    expect(screen.getByTestId("dict-loader")).toHaveClass("animate-spin")
  })

  it("applies size scale classes and numeric pixel styles", () => {
    const { rerender } = render(<R.Icon name="star" size="xs" data-testid="size-test" />)
    expect(screen.getByTestId("size-test")).toHaveClass("size-3.5")

    rerender(<R.Icon name="star" size="sm" data-testid="size-test" />)
    expect(screen.getByTestId("size-test")).toHaveClass("size-4")

    rerender(<R.Icon name="star" size="md" data-testid="size-test" />)
    expect(screen.getByTestId("size-test")).toHaveClass("size-5")

    rerender(<R.Icon name="star" size="lg" data-testid="size-test" />)
    expect(screen.getByTestId("size-test")).toHaveClass("size-6")

    rerender(<R.Icon name="star" size="xl" data-testid="size-test" />)
    expect(screen.getByTestId("size-test")).toHaveClass("size-8")

    rerender(<R.Icon name="star" size={42} data-testid="size-test" />)
    const svg = screen.getByTestId("size-test")
    expect(svg.style.width).toBe("42px")
    expect(svg.style.height).toBe("42px")
  })

  it("applies semantic status and accent tones", () => {
    const { rerender } = render(<R.Icon name="alert-triangle" tone="warning" data-testid="tone-test" />)
    expect(screen.getByTestId("tone-test")).toHaveClass("text-warning-strong")

    rerender(<R.Icon name="alert-triangle" tone="danger" data-testid="tone-test" />)
    expect(screen.getByTestId("tone-test")).toHaveClass("text-danger-strong")

    rerender(<R.Icon name="alert-triangle" tone="success" data-testid="tone-test" />)
    expect(screen.getByTestId("tone-test")).toHaveClass("text-success-strong")

    rerender(<R.Icon name="alert-triangle" tone="accent" data-testid="tone-test" />)
    expect(screen.getByTestId("tone-test")).toHaveClass("text-accent-strong")

    rerender(<R.Icon name="alert-triangle" tone="muted" data-testid="tone-test" />)
    expect(screen.getByTestId("tone-test")).toHaveClass("text-muted-foreground")
  })

  it("handles accessibility via label or aria-hidden by default", () => {
    const { rerender } = render(<R.Icon name="search" data-testid="a11y-test" />)
    const hiddenSvg = screen.getByTestId("a11y-test")
    expect(hiddenSvg).toHaveAttribute("aria-hidden", "true")
    expect(hiddenSvg).not.toHaveAttribute("role", "img")

    rerender(<R.Icon name="search" label="Search repository" data-testid="a11y-test" />)
    const accessibleSvg = screen.getByRole("img", { name: "Search repository" })
    expect(accessibleSvg).toBeInTheDocument()
    expect(accessibleSvg).not.toHaveAttribute("aria-hidden")
  })

  it("supports strokeWidth override and custom className", () => {
    render(<R.Icon name="circle" strokeWidth={3} className="custom-icon-class" data-testid="custom-svg" />)
    const svg = screen.getByTestId("custom-svg")
    expect(svg).toHaveAttribute("stroke-width", "3")
    expect(svg).toHaveClass("custom-icon-class")
  })

  it("renders rich icons across diverse categories in the full icon library", () => {
    const { container } = render(
      <div>
        <R.Icon name="arrow-right" data-testid="cat-nav" />
        <R.Icon name="file-text" data-testid="cat-file" />
        <R.Icon name="database" data-testid="cat-dev" />
        <R.Icon name="credit-card" data-testid="cat-commerce" />
        <R.Icon name="calendar-check" data-testid="cat-time" />
        <R.Icon name="cloud-rain" data-testid="cat-weather" />
        <R.Icon name="bar-chart-3" data-testid="cat-chart" />
        <R.Icons.ArrowRight data-testid="comp-arrow" />
        <R.Icons.Database data-testid="comp-db" />
        <R.Icons.CreditCard data-testid="comp-cc" />
      </div>,
    )

    expect(screen.getByTestId("cat-nav")).toBeInTheDocument()
    expect(screen.getByTestId("cat-file")).toBeInTheDocument()
    expect(screen.getByTestId("cat-dev")).toBeInTheDocument()
    expect(screen.getByTestId("cat-commerce")).toBeInTheDocument()
    expect(screen.getByTestId("cat-time")).toBeInTheDocument()
    expect(screen.getByTestId("cat-weather")).toBeInTheDocument()
    expect(screen.getByTestId("cat-chart")).toBeInTheDocument()
    expect(screen.getByTestId("comp-arrow")).toBeInTheDocument()
    expect(screen.getByTestId("comp-db")).toBeInTheDocument()
    expect(screen.getByTestId("comp-cc")).toBeInTheDocument()
  })

  it("renders developer and social media brand icons with proper attributes and categories", () => {
    render(
      <div>
        <R.Icons.Github data-testid="icon-github" />
        <R.Icons.Twitter data-testid="icon-twitter" />
        <R.Icons.Linkedin data-testid="icon-linkedin" />
        <R.Icons.Discord data-testid="icon-discord" />
        <R.Icons.Youtube data-testid="icon-youtube" />
        <R.Icons.Slack data-testid="icon-slack" />
        <R.Icons.GitBranch data-testid="icon-branch" />
        <R.Icons.GitCommit data-testid="icon-commit" />
        <R.Icons.GitPullRequest data-testid="icon-pr" />
        <R.Icons.Terminal data-testid="icon-terminal" />
        <R.Icons.Code data-testid="icon-code" />
        <R.Icons.Cpu data-testid="icon-cpu" />
        <R.Icons.Webhook data-testid="icon-webhook" />
      </div>,
    )

    expect(screen.getByTestId("icon-github")).toHaveAttribute("data-icon", "github")
    expect(screen.getByTestId("icon-twitter")).toHaveAttribute("data-icon", "twitter")
    expect(screen.getByTestId("icon-linkedin")).toHaveAttribute("data-icon", "linkedin")
    expect(screen.getByTestId("icon-discord")).toHaveAttribute("data-icon", "discord")
    expect(screen.getByTestId("icon-youtube")).toHaveAttribute("data-icon", "youtube")
    expect(screen.getByTestId("icon-slack")).toHaveAttribute("data-icon", "slack")
    expect(screen.getByTestId("icon-branch")).toHaveAttribute("data-icon", "gitbranch")
    expect(screen.getByTestId("icon-commit")).toHaveAttribute("data-icon", "gitcommit")
    expect(screen.getByTestId("icon-pr")).toHaveAttribute("data-icon", "gitpullrequest")
    expect(screen.getByTestId("icon-terminal")).toHaveAttribute("data-icon", "terminal")
    expect(screen.getByTestId("icon-code")).toHaveAttribute("data-icon", "code")
    expect(screen.getByTestId("icon-cpu")).toHaveAttribute("data-icon", "cpu")
    expect(screen.getByTestId("icon-webhook")).toHaveAttribute("data-icon", "webhook")

    const categories = new Set(R.iconCatalog.map((item) => item.category))
    expect(categories.has("Developer")).toBe(true)
    expect(categories.has("Social")).toBe(true)
    expect(categories.has("Tech Stack")).toBe(true)
    expect(R.iconCategories).toContain("Tech Stack")
    expect(R.iconCategories).toContain("Developer")
    expect(R.iconCategories).toContain("Social")
  })

  it("renders tech stack framework, language and cloud icons with canonical names and aliases", () => {
    render(
      <div>
        <R.Icons.React data-testid="icon-react" />
        <R.Icons.Nextjs data-testid="icon-next" />
        <R.Icons.Vue data-testid="icon-vue" />
        <R.Icons.Svelte data-testid="icon-svelte" />
        <R.Icons.Angular data-testid="icon-angular" />
        <R.Icons.Typescript data-testid="icon-ts" />
        <R.Icons.Javascript data-testid="icon-js" />
        <R.Icons.Python data-testid="icon-python" />
        <R.Icons.Rust data-testid="icon-rust" />
        <R.Icons.Docker data-testid="icon-docker" />
        <R.Icons.Kubernetes data-testid="icon-k8s" />
        <R.Icons.Postgres data-testid="icon-postgres" />
        <R.Icons.Redis data-testid="icon-redis" />
        <R.Icon name="ts" data-testid="alias-ts" />
        <R.Icon name="reactjs" data-testid="alias-reactjs" />
        <R.Icon name="k8s" data-testid="alias-k8s" />
      </div>,
    )

    expect(screen.getByTestId("icon-react")).toHaveAttribute("data-icon", "react")
    expect(screen.getByTestId("icon-next")).toHaveAttribute("data-icon", "nextjs")
    expect(screen.getByTestId("icon-vue")).toHaveAttribute("data-icon", "vue")
    expect(screen.getByTestId("icon-svelte")).toHaveAttribute("data-icon", "svelte")
    expect(screen.getByTestId("icon-angular")).toHaveAttribute("data-icon", "angular")
    expect(screen.getByTestId("icon-ts")).toHaveAttribute("data-icon", "typescript")
    expect(screen.getByTestId("icon-js")).toHaveAttribute("data-icon", "javascript")
    expect(screen.getByTestId("icon-python")).toHaveAttribute("data-icon", "python")
    expect(screen.getByTestId("icon-rust")).toHaveAttribute("data-icon", "rust")
    expect(screen.getByTestId("icon-docker")).toHaveAttribute("data-icon", "docker")
    expect(screen.getByTestId("icon-k8s")).toHaveAttribute("data-icon", "kubernetes")
    expect(screen.getByTestId("icon-postgres")).toHaveAttribute("data-icon", "postgres")
    expect(screen.getByTestId("icon-redis")).toHaveAttribute("data-icon", "redis")

    expect(screen.getByTestId("alias-ts")).toHaveAttribute("data-icon", "typescript")
    expect(screen.getByTestId("alias-reactjs")).toHaveAttribute("data-icon", "react")
    expect(screen.getByTestId("alias-k8s")).toHaveAttribute("data-icon", "kubernetes")
  })

  it("supports title tooltip and custom SVG children", () => {
    render(
      <div>
        <R.Icon name="shield-check" title="Encrypted Connection" data-testid="title-test" />
        <R.Icon size="lg" tone="accent" data-testid="custom-child-icon">
          <circle cx="12" cy="12" r="8" />
        </R.Icon>
      </div>,
    )

    const titleSvg = screen.getByTestId("title-test")
    expect(titleSvg.querySelector("title")).toHaveTextContent("Encrypted Connection")

    const customSvg = screen.getByTestId("custom-child-icon")
    expect(customSvg.querySelector("circle")).toBeInTheDocument()
  })

  it("creates custom reusable icons with createIcon", () => {
    const CustomPin = R.createIcon("CustomPin", <path d="M12 2v20" />)
    expect(CustomPin.displayName).toBe("Icons.CustomPin")

    render(<CustomPin size="sm" tone="info" data-testid="custom-pin" />)
    const pinSvg = screen.getByTestId("custom-pin")
    expect(pinSvg).toHaveClass("size-4")
    expect(pinSvg).toHaveClass("text-info-strong")
    expect(pinSvg.querySelector("path")).toBeInTheDocument()
  })

  it("provides comprehensive search icon support with multiple aliases and custom properties", () => {
    const { container } = render(
      <div>
        <R.Icon name="search" data-testid="search-canonical" />
        <R.Icon name="magnifier" data-testid="search-magnifier" />
        <R.Icon name="magnifying-glass" data-testid="search-glass" />
        <R.Icon name="find" data-testid="search-find" />
        <R.Icons.Search size="lg" strokeWidth={1.5} tone="accent" data-testid="search-component" />
      </div>,
    )

    expect(screen.getByTestId("search-canonical")).toHaveAttribute("data-icon", "search")
    expect(screen.getByTestId("search-magnifier")).toHaveAttribute("data-icon", "search")
    expect(screen.getByTestId("search-glass")).toHaveAttribute("data-icon", "search")
    expect(screen.getByTestId("search-find")).toHaveAttribute("data-icon", "search")

    const compSvg = screen.getByTestId("search-component")
    expect(compSvg).toHaveAttribute("data-icon", "search")
    expect(compSvg).toHaveAttribute("stroke-width", "1.5")
    expect(compSvg).toHaveClass("size-6")
    expect(compSvg).toHaveClass("text-accent-strong")
  })

  it("supports deep visual customization (color, fill, rotate, flip, pulse, description)", () => {
    render(
      <div>
        <R.Icon
          name="heart"
          color="#ec4899"
          fill="currentColor"
          rotate={45}
          flip="horizontal"
          pulse
          description="A pulsing customized heart"
          strokeLinecap="square"
          strokeLinejoin="bevel"
          data-testid="customized-icon"
        />
      </div>,
    )

    const svg = screen.getByTestId("customized-icon")
    expect(svg.style.color).toBe("rgb(236, 72, 153)")
    expect(svg).toHaveAttribute("fill", "currentColor")
    expect(svg.style.transform).toContain("rotate(45deg)")
    expect(svg.style.transform).toContain("scaleX(-1)")
    expect(svg).toHaveClass("animate-pulse")
    expect(svg).toHaveAttribute("stroke-linecap", "square")
    expect(svg).toHaveAttribute("stroke-linejoin", "bevel")
    expect(svg.querySelector("desc")).toHaveTextContent("A pulsing customized heart")
  })
})

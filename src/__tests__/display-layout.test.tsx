import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
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

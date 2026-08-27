import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  AspectRatio, AuthBackdrop, Avatar, AvatarGroup, AvatarGroupOverflow, Badge, Blockquote, Breadcrumb, Callout, Card, CardBody, CardDescription, CardFooter,
  CardHeader, CardTitle, EmptyState, ErrorState, FormField, Input, Kbd, Label,
  Currency, DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm, Divider, Heading, InlineCode, Link, List, ListItem, Progressbar, Prose, ScrollArea, Separator, Skeleton, SkeletonAvatar, SkeletonCard,
  SkeletonTable, SkeletonText, SkeletonTopbar, Spinner, Stat, StatusDot, Stepper,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea, Timeline,
  AppShell, AppShellBody, AppShellHeader, AppShellMain, Container, Footer, Inline, PageHeader, Stack, Text, Time,
} from "@/index"

describe("display and layout components", () => {
  it("renders identity and status primitives", () => {
    render(<><AuthBackdrop /><Avatar name="Ada Lovelace" /><Badge dot>Live</Badge><StatusDot status="online" label="Online" /><Spinner /></>)
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
    expect(screen.getByTestId("negative")).toHaveClass("text-destructive")
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

  it("formats semantic time text and handles invalid values", () => {
    render(<>
      <Time value="13:05" hour12 data-testid="time-12" />
      <Time value="13:05" hour12={false} data-testid="time-24" />
      <Time value="not-a-time" fallback="Unknown" data-testid="time-invalid" />
    </>)

    expect(screen.getByTestId("time-12")).toHaveTextContent("1:05 PM")
    expect(screen.getByTestId("time-12").tagName).toBe("TIME")
    expect(screen.getByTestId("time-12")).toHaveAttribute("datetime", "13:05")
    expect(screen.getByTestId("time-24")).toHaveTextContent("13:05")
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

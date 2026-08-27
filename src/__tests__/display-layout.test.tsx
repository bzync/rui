import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  AuthBackdrop, Avatar, Badge, Breadcrumb, Callout, Card, CardBody, CardDescription, CardFooter,
  CardHeader, CardTitle, EmptyState, ErrorState, FormField, Input, Kbd, Label,
  Link, List, ListItem, Progressbar, Separator, Skeleton, SkeletonAvatar, SkeletonCard,
  SkeletonTable, SkeletonText, SkeletonTopbar, Spinner, Stat, StatusDot, Stepper,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea, Timeline,
  AppShell, AppShellBody, AppShellHeader, AppShellMain, Container, Footer, Inline, PageHeader, Stack,
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
})

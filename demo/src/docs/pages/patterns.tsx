import { Alert, Badge, Button, Checkbox, DataTable, EmptyState, Input, Select } from "@bzync/rui"
import { Database, Plus } from "lucide-react"
import { useState } from "react"
import type { DocsPage } from "../catalog"
import { ComponentPreview, DocsSection, PageIntro } from "../primitives"
import { members, memberColumns } from "./_fixtures"

function FormsPattern() {
  const [plan, setPlan] = useState("pro")
  return <>
    <PageIntro eyebrow="Patterns" title="Forms" description="Compose labels, supporting text, validation, and actions into a predictable form flow." />
    <DocsSection id="structure" title="Structure"><p>Use one visible label per field, keep help close to its control, and place the primary action after the final field. Reserve placeholders for examples—not labels.</p></DocsSection>
    <DocsSection id="validation" title="Validation"><p>Prefer inline errors after validation. Input, Textarea, Select, Checkbox, and RadioGroup connect error content through ARIA attributes.</p></DocsSection>
    <DocsSection id="example" title="Example"><ComponentPreview align="start" code={`<form onSubmit={save}>\n  <Input label="Workspace name" required />\n  <Select label="Plan" options={plans} />\n  <Checkbox label="Enable audit exports" />\n  <Button type="submit">Save workspace</Button>\n</form>`}><form className="pattern-form" onSubmit={(event) => event.preventDefault()}><Input label="Workspace name" defaultValue="Platform engineering" required /><Select label="Plan" value={plan} onChange={setPlan} options={[{ value: "starter", label: "Starter" }, { value: "pro", label: "Pro" }]} /><Checkbox label="Enable audit exports" description="Send a daily archive to object storage." defaultChecked /><div className="demo-actions"><Button type="submit">Save workspace</Button><Button variant="secondary">Cancel</Button></div></form></ComponentPreview></DocsSection>
  </>
}

function DataPattern() {
  return <>
    <PageIntro eyebrow="Patterns" title="Data display" description="Choose semantic table primitives for static data and DataTable when users need sorting, search, and pagination." />
    <DocsSection id="table-choice" title="Choose the right table"><p>Use <code>Table</code> when the data and interactions are application-specific. Use <code>DataTable</code> for the standard searchable, sortable, paginated workflow.</p></DocsSection>
    <DocsSection id="actions" title="Actions"><p>Keep a consistent action column, give icon-only actions an accessible label, and avoid hiding the only path to a critical task inside row hover state.</p></DocsSection>
    <DocsSection id="example" title="Example"><ComponentPreview align="start" code={`<DataTable\n  ariaLabel="Team members"\n  columns={memberColumns}\n  data={members}\n  searchable\n  pageSizeOptions={false}\n/>`}><div className="w-full"><DataTable ariaLabel="Team members" columns={memberColumns} data={members} searchable searchPlaceholder="Search members…" pageSizeOptions={false} /></div></ComponentPreview></DocsSection>
  </>
}

function FeedbackPattern() {
  return <>
    <PageIntro eyebrow="Patterns" title="Feedback" description="Match the feedback surface to urgency, persistence, and whether the user must act." />
    <DocsSection id="choose" title="Choose a surface"><div className="decision-list"><div><Badge variant="info">Alert</Badge><p>Persistent page or section-level status.</p></div><div><Badge variant="success">Snackbar</Badge><p>Transient confirmation after an action.</p></div><div><Badge variant="warning">Modal</Badge><p>Blocking decision or focused task.</p></div><div><Badge variant="muted">Empty state</Badge><p>Absence of content with a useful next action.</p></div></div></DocsSection>
    <DocsSection id="severity" title="Severity"><p>Use semantic variants consistently. Error and warning alerts announce immediately; reserve those roles for information that genuinely needs attention.</p></DocsSection>
    <DocsSection id="example" title="Example"><div className="demo-stack"><Alert variant="error" title="Deployment failed">The health check did not pass. The previous release remains active.</Alert><Alert variant="info" title="Maintenance scheduled">Database maintenance starts Friday at 02:00 UTC.</Alert></div></DocsSection>
  </>
}

function EmptyStatesPattern() {
  return <>
    <PageIntro eyebrow="Patterns" title="Empty states" description="Explain why content is absent and offer the most useful available next step." />
    <DocsSection id="content" title="Content"><p>Name the missing object, explain the value of creating or connecting one, and avoid blaming the user. Keep the description short.</p></DocsSection>
    <DocsSection id="actions" title="Actions"><p>Use one primary action when the user can resolve the state. Add a secondary learning action only when it materially helps.</p></DocsSection>
    <DocsSection id="example" title="Example"><ComponentPreview code={`<EmptyState\n  icon={<Database />}\n  title="No databases yet"\n  description="Create a database to store application data."\n  action={<Button>Create database</Button>}\n/>`}><EmptyState icon={<Database />} title="No databases yet" description="Create a database to store application data." action={<Button icon={<Plus size={15} />}>Create database</Button>} /></ComponentPreview></DocsSection>
  </>
}

export function PatternPage({ page }: { page: DocsPage }) {
  if (page.slug === "patterns/forms") return <FormsPattern />
  if (page.slug === "patterns/data-display") return <DataPattern />
  if (page.slug === "patterns/feedback") return <FeedbackPattern />
  return <EmptyStatesPattern />
}

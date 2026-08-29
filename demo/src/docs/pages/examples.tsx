import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DataTable,
  Input,
  Switch,
} from "@bzync/rui"
import { Check, KeyRound, Mail, UserPlus } from "lucide-react"
import { useState } from "react"
import { RuiBrandMark } from "../../_shared/brand"
import type { DocsPage } from "../catalog"
import { DocsSection, PageIntro } from "../primitives"
import { members, memberColumns } from "./_fixtures"

function SettingsExample() {
  const [product, setProduct] = useState(true)
  const [security, setSecurity] = useState(true)
  const [summary, setSummary] = useState(false)
  return <>
    <PageIntro eyebrow="Examples" title="Settings" description="A realistic account settings composition using cards, fields, switches, and restrained feedback." />
    <DocsSection id="preview" title="Preview"><div className="app-example settings-example"><div className="example-heading"><div><h2>Notification settings</h2><p>Choose how and when the team contacts you.</p></div><Badge variant="muted">Account</Badge></div><Card><CardHeader><CardTitle>Email notifications</CardTitle><CardDescription>Sent to maya@acme.dev</CardDescription></CardHeader><CardBody className="settings-list"><Switch checked={product} onCheckedChange={setProduct} label="Product updates" description="New features and important product changes." /><Switch checked={security} onCheckedChange={setSecurity} label="Security alerts" description="New sign-ins and security recommendations." /><Switch checked={summary} onCheckedChange={setSummary} label="Weekly summary" description="Workspace activity every Monday." /></CardBody><CardFooter className="justify-between"><span className="save-status"><Check size={14} />Preferences saved locally</span><Button size="sm">Save changes</Button></CardFooter></Card><Card variant="bordered"><CardBody className="danger-row"><div><strong>Delete account</strong><p>Permanently remove your personal account and sessions.</p></div><Button variant="destructive" size="sm">Delete account</Button></CardBody></Card></div></DocsSection>
    <DocsSection id="implementation" title="Implementation"><p>The page uses controlled switches so application state remains the source of truth. The destructive action is separated from routine preferences and would normally open a ConfirmDialog.</p></DocsSection>
  </>
}

function AuthenticationExample() {
  return <>
    <PageIntro eyebrow="Examples" title="Authentication" description="A focused sign-in screen with visible labels, password recovery, and a single primary action." />
    <DocsSection id="preview" title="Preview"><div className="auth-canvas"><Card className="auth-card"><CardHeader><div className="auth-brand"><RuiBrandMark size={38} /><span>@bzync/rui</span></div><CardTitle as="h2" className="mt-4 text-base">Sign in to your account</CardTitle><CardDescription>Use your work email to continue.</CardDescription></CardHeader><CardBody><form className="pattern-form" onSubmit={(event) => event.preventDefault()}><Input label="Email" type="email" autoComplete="email" placeholder="you@company.com" prefix={<Mail size={14} />} required /><div><div className="field-inline"><label htmlFor="docs-password">Password</label><a href="#recover">Forgot password?</a></div><Input id="docs-password" type="password" autoComplete="current-password" prefix={<KeyRound size={14} />} required /></div><Button className="w-full" type="submit">Sign in</Button></form></CardBody></Card></div></DocsSection>
    <DocsSection id="implementation" title="Implementation"><p>The form uses native email and password inputs, browser autocomplete tokens, visible labels, and a submit button. Authentication errors should appear next to the affected field or as a concise form-level alert.</p></DocsSection>
  </>
}

function TeamExample() {
  return <>
    <PageIntro eyebrow="Examples" title="Team management" description="A searchable team table with explicit status and accessible row actions." />
    <DocsSection id="preview" title="Preview"><div className="app-example"><div className="example-heading"><div><h2>Team members</h2><p>Manage access to the Acme workspace.</p></div><Button icon={<UserPlus size={15} />}>Invite member</Button></div><DataTable ariaLabel="Team members" columns={memberColumns} data={members} searchable searchPlaceholder="Search by name, email, or role…" pageSizeOptions={false} /></div></DocsSection>
    <DocsSection id="implementation" title="Implementation"><p>Searchable columns are declared in the column definitions. Status combines text and color, and the action button includes an accessible name even though only an icon is visible.</p></DocsSection>
  </>
}

export function ExamplePage({ page }: { page: DocsPage }) {
  if (page.slug === "examples/authentication") return <AuthenticationExample />
  if (page.slug === "examples/team-management") return <TeamExample />
  return <SettingsExample />
}

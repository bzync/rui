"use client"

import {
  AreaChart,
  Avatar,
  AvatarGroup,
  AvatarGroupOverflow,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  ColorPicker,
  ConfirmDialog,
  DataTable,
  Divider,
  DndContext,
  type DragEndEvent,
  DonutChart,
  Draggable,
  Droppable,
  Input,
  Modal,
  PasswordInput,
  Select,
  Stat,
  StatusDot,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  Textarea,
  Timeline,
  Icons,
} from "@bzync/rui"

const {
  Bell,
  Check,
  CheckCircle2,
  Download,
  Mail,
  Palette,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  User,
  UserPlus,
} = Icons
import { useState } from "react"
import { RuiBrandMark } from "../../_shared/brand"
import type { DocsPage } from "../catalog"
import { DocsSection, PageIntro } from "../primitives"
import {
  initialKanbanTasks,
  type KanbanTask,
  type Member,
  memberColumns,
  members as initialMembers,
  revenueData,
  trafficChannels,
} from "./_fixtures"

/* ------------------------------------------------------------------ */
/* 1. Settings Example                                                */
/* ------------------------------------------------------------------ */

function SettingsExample() {
  const [activeTab, setActiveTab] = useState("profile")
  const [savedFeedback, setSavedFeedback] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [accentColor, setAccentColor] = useState("#3b82f6")

  // Notification states
  const [productUpdates, setProductUpdates] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [mentionAlerts, setMentionAlerts] = useState(true)
  const [pipelineAlerts, setPipelineAlerts] = useState(false)

  const handleSave = () => {
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 2400)
  }

  return (
    <>
      <PageIntro
        eyebrow="Examples"
        title="Settings"
        description="A comprehensive application settings layout with profiles, theme customization, notification preferences, and safe confirmation dialogs."
      />

      <DocsSection id="preview" title="Preview">
        <div className="app-example settings-example">
          {/* Header Profile Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
            <div className="flex items-center gap-3.5">
              <Avatar name="Maya Chen" size="lg" className="ring-2 ring-accent/30" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-foreground">Maya Chen</h2>
                  <Badge variant="info" size="sm">Workspace Admin</Badge>
                  <StatusDot status="online" label="Online" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">maya@acme.dev • Enterprise Tier</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.open("https://github.com/bzync/rui", "_blank")}>
                Documentation
              </Button>
              <Button size="sm" onClick={handleSave}>
                {savedFeedback ? (
                  <>
                    <Check size={14} className="text-success-strong" /> Saved
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full justify-start overflow-x-auto">
              <TabsTrigger value="profile" className="gap-2">
                <User size={14} /> Profile & Account
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette size={14} /> Appearance & Theme
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell size={14} /> Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield size={14} /> Security & Danger
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your public identity and profile credentials across Acme.</CardDescription>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" defaultValue="Maya Chen" />
                    <Input label="Username" defaultValue="mayachen" prefix="@" />
                    <Input
                      label="Work Email"
                      defaultValue="maya@acme.dev"
                      suffix={<Badge variant="success" size="sm">Verified</Badge>}
                    />
                    <Select
                      label="Timezone"
                      defaultValue="utc-8"
                      options={[
                        { value: "utc-8", label: "Pacific Time (US & Canada) — UTC-8" },
                        { value: "utc-5", label: "Eastern Time (US & Canada) — UTC-5" },
                        { value: "utc-0", label: "UTC (Coordinated Universal Time)" },
                        { value: "utc+1", label: "Central European Time — UTC+1" },
                        { value: "utc+8", label: "Singapore / Hong Kong — UTC+8" },
                      ]}
                    />
                  </div>
                  <Textarea
                    label="Bio"
                    defaultValue="Staff Infrastructure Engineer at Acme Corp. Working on distributed container clusters and developer platforms."
                    rows={3}
                  />
                </CardBody>
                <CardFooter className="justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    {savedFeedback && <CheckCircle2 size={14} className="text-success-strong" />}
                    {savedFeedback ? "All changes committed to database." : "Last updated 3 days ago"}
                  </span>
                  <Button size="sm" onClick={handleSave}>
                    Save profile
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance & Color System</CardTitle>
                  <CardDescription>Configure interface modes and custom brand accent token overrides.</CardDescription>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div>
                    <span className="text-xs font-semibold text-foreground block mb-2">Color Mode</span>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-[var(--radius-md)] border-2 border-accent bg-surface p-3 cursor-pointer text-center">
                        <span className="text-xs font-semibold text-foreground block">System Default</span>
                        <span className="text-[11px] text-muted-foreground">Auto dark/light</span>
                      </div>
                      <div className="rounded-[var(--radius-md)] border border-border bg-surface p-3 cursor-pointer text-center hover:border-border-strong">
                        <span className="text-xs font-semibold text-foreground block">Light Theme</span>
                        <span className="text-[11px] text-muted-foreground">Clean daylight</span>
                      </div>
                      <div className="rounded-[var(--radius-md)] border border-border bg-surface p-3 cursor-pointer text-center hover:border-border-strong">
                        <span className="text-xs font-semibold text-foreground block">Dark Theme</span>
                        <span className="text-[11px] text-muted-foreground">High contrast</span>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                    <div>
                      <ColorPicker
                        label="Brand Accent Color"
                        value={accentColor}
                        onChange={setAccentColor}
                        swatches={["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"]}
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-foreground block">Density & Layout</span>
                      <p className="text-xs text-muted-foreground">
                        Adjust component sizing scale and UI element padding density.
                      </p>
                      <ButtonGroup>
                        <Button variant="outline" size="sm">Compact</Button>
                        <Button variant="secondary" size="sm">Default</Button>
                        <Button variant="outline" size="sm">Spacious</Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Deliveries</CardTitle>
                  <CardDescription>Determine what transactional digests and alerts are dispatched.</CardDescription>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Switch
                    checked={productUpdates}
                    onCheckedChange={setProductUpdates}
                    label="Product & feature updates"
                    description="Weekly dispatch detailing new APIs, UI components, and platform enhancements."
                  />
                  <Divider />
                  <Switch
                    checked={securityAlerts}
                    onCheckedChange={setSecurityAlerts}
                    label="Security & access alerts"
                    description="Instant alerts regarding credential changes, new sessions, or anomalous access."
                  />
                  <Divider />
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                    label="Weekly workspace summary"
                    description="Digest of team activities, deployment statistics, and pull request reviews."
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Push & Slack Alerts</CardTitle>
                  <CardDescription>Real-time notifications sent directly to devices or connected chat channels.</CardDescription>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Switch
                    checked={mentionAlerts}
                    onCheckedChange={setMentionAlerts}
                    label="Team mentions (@maya)"
                    description="Immediate notification when colleagues tag you in issues or code reviews."
                  />
                  <Divider />
                  <Switch
                    checked={pipelineAlerts}
                    onCheckedChange={setPipelineAlerts}
                    label="Production deployment status"
                    description="Broadcast alert when production deployments succeed or fail."
                  />
                </CardBody>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                  <CardDescription>Add an extra layer of authentication to safeguard your credentials.</CardDescription>
                </CardHeader>
                <CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success-strong shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <strong className="text-sm text-foreground block">Authenticator App Enabled</strong>
                      <span className="text-xs text-muted-foreground">Codes generated via Google Authenticator or 1Password</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage 2FA</Button>
                </CardBody>
              </Card>

              {/* Danger Zone */}
              <Card variant="bordered" className="border-danger/30 bg-danger/2">
                <CardHeader>
                  <CardTitle className="text-danger-strong">Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions regarding your personal data.</CardDescription>
                </CardHeader>
                <CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <strong className="text-sm text-foreground block">Delete Account & Revoke Access</strong>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Permanently delete your profile, personal tokens, and remove membership from Acme.
                    </p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => setConfirmDeleteOpen(true)}>
                    Delete account
                  </Button>
                </CardBody>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Interactive Confirm Dialog */}
          <ConfirmDialog
            open={confirmDeleteOpen}
            onClose={() => setConfirmDeleteOpen(false)}
            title="Are you absolutely sure?"
            destructive
            confirmLabel="Permanently Delete"
            cancelLabel="Cancel"
            description="This action cannot be undone. This will permanently delete your user account and revoke all generated API credentials."
            onConfirm={() => {
              setConfirmDeleteOpen(false)
            }}
          />
        </div>
      </DocsSection>

      <DocsSection id="implementation" title="Implementation">
        <p>
          This example composes <code>Tabs</code>, <code>Card</code>, <code>Input</code>, <code>Select</code>, <code>Textarea</code>, <code>ColorPicker</code>, <code>Switch</code>, and <code>ConfirmDialog</code> into an accessible multi-view settings dashboard. State updates are preserved seamlessly and dangerous actions are guarded by accessible confirmation dialogs.
        </p>
      </DocsSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Authentication Example                                          */
/* ------------------------------------------------------------------ */

function AuthenticationExample() {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [isLoading, setIsLoading] = useState(false)
  const [authSuccess, setAuthSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setAuthSuccess(true)
    }, 1200)
  }

  return (
    <>
      <PageIntro
        eyebrow="Examples"
        title="Authentication"
        description="Production-ready sign-in and registration screen with social providers, password visibility toggle, remember-me options, and validation feedback."
      />

      <DocsSection id="preview" title="Preview">
        <div className="auth-canvas">
          <Card className="auth-card shadow-floating">
            <CardHeader className="text-center pb-2">
              <div className="auth-brand justify-center">
                <RuiBrandMark size={38} />
                <span>@bzync/rui</span>
              </div>
              <CardTitle as="h2" className="mt-4 text-lg">
                {authMode === "signin" ? "Welcome back" : "Create an account"}
              </CardTitle>
              <CardDescription>
                {authMode === "signin"
                  ? "Enter your work email to access your workspace"
                  : "Start your 14-day free trial with unlimited seats"}
              </CardDescription>
            </CardHeader>

            <CardBody className="space-y-4 pt-2">
              {/* Tab Selector */}
              <div className="flex rounded-[var(--radius-sm)] border border-border p-0.5 bg-surface-muted">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin")
                    setAuthSuccess(false)
                  }}
                  className={`flex-1 py-1 text-xs font-semibold rounded-[var(--radius-xs)] transition-colors cursor-pointer ${
                    authMode === "signin"
                      ? "bg-surface text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup")
                    setAuthSuccess(false)
                  }}
                  className={`flex-1 py-1 text-xs font-semibold rounded-[var(--radius-xs)] transition-colors cursor-pointer ${
                    authMode === "signup"
                      ? "bg-surface text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  }
                  className="w-full justify-center gap-2"
                >
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  }
                  className="w-full justify-center gap-2"
                >
                  Google
                </Button>
              </div>

              <Divider label="Or continue with email" />

              {authSuccess && (
                <div className="rounded-[var(--radius-md)] border border-success/30 bg-success/8 p-3 text-xs text-success-strong flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Authentication successful! Redirecting to workspace…</span>
                </div>
              )}

              <form className="space-y-3.5" onSubmit={handleSubmit}>
                {authMode === "signup" && (
                  <Input label="Full Name" placeholder="Alex Morgan" required />
                )}

                <Input
                  label="Work Email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  prefix={<Mail size={14} className="text-muted-foreground" />}
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-foreground">Password</label>
                    {authMode === "signin" && (
                      <a href="#/examples/authentication" className="text-xs text-accent hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <PasswordInput
                    placeholder="••••••••••••"
                    autoComplete={authMode === "signin" ? "current-password" : "new-password"}
                    required
                  />
                </div>

                {authMode === "signin" ? (
                  <div className="pt-1">
                    <Checkbox label="Remember this browser for 30 days" defaultChecked />
                  </div>
                ) : (
                  <div className="pt-1">
                    <Checkbox label="I agree to the Terms of Service & Privacy Policy" required />
                  </div>
                )}

                <Button className="w-full" type="submit" loading={isLoading}>
                  {authMode === "signin" ? "Sign in to workspace" : "Create my account"}
                </Button>
              </form>
            </CardBody>

            <CardFooter className="justify-center border-t border-border pt-3">
              <span className="text-[11px] text-muted-foreground text-center">
                Protected by enterprise encryption & SOC2 Type II compliance.
              </span>
            </CardFooter>
          </Card>
        </div>
      </DocsSection>

      <DocsSection id="implementation" title="Implementation">
        <p>
          The authentication flow demonstrates tabbed state switching, social login integration, <code>PasswordInput</code> with interactive reveal toggles, accessible validation attributes, and realistic form submission loading states.
        </p>
      </DocsSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Team Management Example                                         */
/* ------------------------------------------------------------------ */

function TeamExample() {
  const [teamList, setTeamList] = useState<Member[]>(initialMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState<Member["role"]>("Developer")

  const filteredMembers = teamList.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || m.role.toLowerCase() === roleFilter.toLowerCase()
    return matchesSearch && matchesRole
  })

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail) return
    const newMember: Member = {
      id: Date.now(),
      name: newEmail.split("@")[0].replace(".", " "),
      email: newEmail,
      role: newRole,
      status: "Invited",
      department: "Engineering",
      lastActive: "Just now",
    }
    setTeamList((prev) => [newMember, ...prev])
    setNewEmail("")
    setInviteModalOpen(false)
  }

  return (
    <>
      <PageIntro
        eyebrow="Examples"
        title="Team management"
        description="A complete workspace member administration interface with KPI metrics, role filters, search, invitation modal, and row action menus."
      />

      <DocsSection id="preview" title="Preview">
        <div className="app-example space-y-6">
          {/* Top Heading */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Workspace Members</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage role access permissions, seat allocations, and pending team invitations.
              </p>
            </div>
            <Button icon={<UserPlus size={15} />} onClick={() => setInviteModalOpen(true)}>
              Invite member
            </Button>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Total Members" value={String(teamList.length)} trend="up" trendValue="+2 this month" />
            <Stat label="Active Now" value="6" action={<StatusDot status="online" label="Online" />} />
            <Stat
              label="Pending Invites"
              value={String(teamList.filter((m) => m.status === "Invited").length)}
              trendValue="Awaiting accept"
            />
            <Stat label="Seat Usage" value={`${teamList.length} / 25`} trendValue="72% capacity" />
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Input
                placeholder="Search member, email, or department…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search size={14} className="text-muted-foreground" />}
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["all", "Owner", "Admin", "Developer", "Designer", "Viewer"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer capitalize shrink-0 ${
                    roleFilter === r
                      ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                      : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r === "all" ? "All roles" : r}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table */}
          <DataTable
            ariaLabel="Team members"
            columns={memberColumns}
            data={filteredMembers}
            pageSizeOptions={false}
          />

          {/* Invite Modal */}
          <Modal
            open={inviteModalOpen}
            onClose={() => setInviteModalOpen(false)}
            title="Invite a new team member"
            description="Send an invitation link with assigned role credentials to join your Acme workspace."
          >
            <form onSubmit={handleInvite} className="space-y-4 pt-2">
              <Input
                label="Email Address"
                type="email"
                placeholder="colleague@acme.dev"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />

              <Select
                label="Role Permission"
                value={newRole}
                onChange={(val) => setNewRole(val as Member["role"])}
                options={[
                  { value: "Developer", label: "Developer — Can commit code, create builds, and view configs" },
                  { value: "Admin", label: "Admin — Full workspace settings and team management" },
                  { value: "Designer", label: "Designer — Can inspect components and edit design assets" },
                  { value: "Viewer", label: "Viewer — Read-only access to repositories and deployments" },
                ]}
              />

              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-foreground block">Additional Scopes</span>
                <Checkbox label="Allow production cluster deployments" defaultChecked />
                <Checkbox label="Grant access to billing and invoice receipts" />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" type="button" onClick={() => setInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send invitation</Button>
              </div>
            </form>
          </Modal>
        </div>
      </DocsSection>

      <DocsSection id="implementation" title="Implementation">
        <p>
          The team management screen combines <code>Stat</code> summary cards, a searchable and sortable <code>DataTable</code>, live role filtering pills, and an accessible <code>Modal</code> dialog for inviting new colleagues.
        </p>
      </DocsSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Executive Dashboard Example (NEW)                               */
/* ------------------------------------------------------------------ */

function DashboardExample() {
  const [selectedRange, setSelectedRange] = useState("30d")

  return (
    <>
      <PageIntro
        eyebrow="Examples"
        title="Executive dashboard"
        description="An operational analytics dashboard combining real-time KPI metrics, responsive charts, date filtering, and activity feed."
      />

      <DocsSection id="preview" title="Preview">
        <div className="app-example space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Performance Telemetry</h2>
                <Badge variant="success" size="sm" dot>Live telemetry</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Multi-cluster operational telemetry across US-East, EU-Central, and AP-South.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ButtonGroup>
                <Button
                  size="sm"
                  variant={selectedRange === "7d" ? "secondary" : "outline"}
                  onClick={() => setSelectedRange("7d")}
                >
                  7D
                </Button>
                <Button
                  size="sm"
                  variant={selectedRange === "30d" ? "secondary" : "outline"}
                  onClick={() => setSelectedRange("30d")}
                >
                  30D
                </Button>
                <Button
                  size="sm"
                  variant={selectedRange === "12m" ? "secondary" : "outline"}
                  onClick={() => setSelectedRange("12m")}
                >
                  12M
                </Button>
              </ButtonGroup>
              <Button size="sm" variant="outline" icon={<Download size={14} />}>
                Export CSV
              </Button>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat
              label="Annual Run Rate (ARR)"
              value="$148,250"
              trend="up"
              trendValue="+14.2% YoY"
            />
            <Stat
              label="Monthly Active Users"
              value="38,420"
              trend="up"
              trendValue="+8.1% MoM"
            />
            <Stat
              label="System Uptime (90d)"
              value="99.98%"
              action={<StatusDot status="online" label="Online" />}
            />
            <Stat
              label="Average P99 Latency"
              value="38 ms"
              trend="down"
              trendValue="-6 ms vs target"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Revenue & API Volume Growth</CardTitle>
                    <CardDescription>Monthly recurring revenue paired with customer query volume.</CardDescription>
                  </div>
                  <Badge variant="info">USD ($)</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <AreaChart
                  labels={revenueData.map((d) => d.month)}
                  series={[
                    { label: "ARR ($)", data: revenueData.map((d) => d.revenue), color: "var(--color-accent-strong)" },
                  ]}
                  ariaLabel="Monthly revenue chart"
                  height={240}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Channels</CardTitle>
                <CardDescription>Customer acquisition split by attribution.</CardDescription>
              </CardHeader>
              <CardBody className="flex items-center justify-center pt-2">
                <DonutChart
                  data={trafficChannels}
                  className="h-56"
                />
              </CardBody>
            </Card>
          </div>

          {/* Recent Operations Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Cluster Operations</CardTitle>
              <CardDescription>Real-time audit log of automated system deployments and infrastructure changes.</CardDescription>
            </CardHeader>
            <CardBody>
              <Timeline
                events={[
                  {
                    id: "ev-1",
                    title: "Release v2.4.0 deployed to us-east-1 production",
                    timestamp: "14 minutes ago",
                    variant: "success",
                    description: "Zero-downtime rolling update across 24 edge nodes completed successfully.",
                  },
                  {
                    id: "ev-2",
                    title: "PostgreSQL read-replica provisioned in eu-central-1",
                    timestamp: "2 hours ago",
                    variant: "info",
                    description: "Auto-scaled cluster replica added to accommodate high EU query traffic.",
                  },
                  {
                    id: "ev-3",
                    title: "Security SSL wildcard certificate auto-renewed",
                    timestamp: "Yesterday at 11:24 PM",
                    variant: "default",
                    description: "Cloudflare edge certificate renewed for *.acme.dev domain.",
                  },
                ]}
              />
            </CardBody>
          </Card>
        </div>
      </DocsSection>

      <DocsSection id="implementation" title="Implementation">
        <p>
          The dashboard brings together <code>Stat</code> cards, an interactive <code>AreaChart</code>, <code>DonutChart</code>, <code>Timeline</code> event stream, and flexible <code>ButtonGroup</code> timeframe filters.
        </p>
      </DocsSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Kanban Board Example (NEW)                                      */
/* ------------------------------------------------------------------ */

function KanbanExample() {
  const [tasks, setTasks] = useState<KanbanTask[]>(initialKanbanTasks)
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newTag, setNewTag] = useState("Feature")

  const handleDragEnd = (event: DragEndEvent) => {
    const { activeId, targetDroppableId } = event
    if (!targetDroppableId) return

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === activeId) {
          return { ...t, column: targetDroppableId as KanbanTask["column"] }
        }
        return t
      }),
    )
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return
    const task: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTitle,
      code: `FEAT-${Math.floor(100 + Math.random() * 900)}`,
      priority: "normal",
      assignee: "Maya Chen",
      column: "todo",
      tag: newTag,
    }
    setTasks((prev) => [task, ...prev])
    setNewTitle("")
    setNewTaskOpen(false)
  }

  const columns: { id: KanbanTask["column"]; label: string; badgeVariant: "default" | "info" | "warning" | "success" }[] = [
    { id: "todo", label: "To Do", badgeVariant: "default" },
    { id: "in-progress", label: "In Progress", badgeVariant: "info" },
    { id: "review", label: "In Review", badgeVariant: "warning" },
    { id: "done", label: "Completed", badgeVariant: "success" },
  ]

  return (
    <>
      <PageIntro
        eyebrow="Examples"
        title="Kanban board"
        description="A full drag-and-drop project workflow built with @bzync/rui's DndContext, Droppable, Draggable, and DragHandle."
      />

      <DocsSection id="preview" title="Preview">
        <div className="app-example space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Sprint 42 — Core Platform</h2>
                <Badge variant="info">Active Sprint</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Drag cards across columns to reassign statuses. Keyboard accessible via Space and Arrow keys.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <AvatarGroup spacing="tight">
                <Avatar name="Maya Chen" size="sm" />
                <Avatar name="Jordan Kim" size="sm" />
                <Avatar name="Elena Rostova" size="sm" />
                <AvatarGroupOverflow count={2} size="sm" />
              </AvatarGroup>
              <Button size="sm" icon={<Plus size={14} />} onClick={() => setNewTaskOpen(true)}>
                Add task
              </Button>
            </div>
          </div>

          {/* Drag and Drop Kanban Board */}
          <DndContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {columns.map((col) => {
                const colTasks = tasks.filter((t) => t.column === col.id)
                return (
                  <div key={col.id} className="flex flex-col">
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                      <span className="text-xs font-semibold text-foreground">{col.label}</span>
                      <Badge variant={col.badgeVariant} size="sm">
                        {colTasks.length}
                      </Badge>
                    </div>

                    {/* Droppable Region */}
                    <Droppable
                      id={col.id}
                      className="flex-1 rounded-[var(--radius-lg)] border border-border bg-surface-muted/40 p-2.5 min-h-[320px] flex flex-col gap-2.5 transition-colors"
                    >
                      {colTasks.map((t) => (
                        <Draggable
                          key={t.id}
                          id={t.id}
                          className="rounded-[var(--radius-md)] border border-border bg-surface p-3 shadow-xs space-y-2 select-none"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono font-semibold text-accent-strong">
                              {t.code}
                            </span>
                            <Badge
                              variant={
                                t.priority === "urgent"
                                  ? "danger"
                                  : t.priority === "high"
                                    ? "warning"
                                    : t.priority === "low"
                                      ? "muted"
                                      : "info"
                              }
                              size="sm"
                            >
                              {t.priority}
                            </Badge>
                          </div>

                          <p className="text-xs font-medium text-foreground leading-snug">{t.title}</p>

                          <div className="flex items-center justify-between pt-1 border-t border-border/60">
                            <Tag size="sm">{t.tag}</Tag>
                            <Avatar name={t.assignee} size="sm" />
                          </div>
                        </Draggable>
                      ))}

                      {colTasks.length === 0 && (
                        <div className="h-full flex items-center justify-center p-6 text-center border-2 border-dashed border-border rounded-[var(--radius-md)]">
                          <span className="text-xs text-muted-foreground">Drop tasks here</span>
                        </div>
                      )}
                    </Droppable>
                  </div>
                )
              })}
            </div>
          </DndContext>

          {/* Quick Task Modal */}
          <Modal
            open={newTaskOpen}
            onClose={() => setNewTaskOpen(false)}
            title="Create a new task"
            description="Add a task card to the sprint backlog."
          >
            <form onSubmit={handleAddTask} className="space-y-4 pt-2">
              <Input
                label="Task Title"
                placeholder="e.g. Implement webhook retry policies"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />

              <Select
                label="Category Tag"
                value={newTag}
                onChange={(val) => setNewTag(val)}
                options={[
                  { value: "Feature", label: "Feature Development" },
                  { value: "Bugfix", label: "Bugfix & Reliability" },
                  { value: "Infrastructure", label: "Cloud Infrastructure" },
                  { value: "Design System", label: "Design System & UX" },
                ]}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button variant="outline" type="button" onClick={() => setNewTaskOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create task</Button>
              </div>
            </form>
          </Modal>
        </div>
      </DocsSection>

      <DocsSection id="implementation" title="Implementation">
        <p>
          The Kanban board illustrates `@bzync/rui`'s <code>DndContext</code>, <code>Droppable</code>, and <code>Draggable</code> components managing multi-column state transfers with 60fps hardware-accelerated translations and accessible keyboard reordering.
        </p>
      </DocsSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Router                                                             */
/* ------------------------------------------------------------------ */

export function ExamplePage({ page }: { page: DocsPage }) {
  if (page.slug === "examples/authentication") return <AuthenticationExample />
  if (page.slug === "examples/team-management") return <TeamExample />
  if (page.slug === "examples/dashboard") return <DashboardExample />
  if (page.slug === "examples/kanban") return <KanbanExample />
  return <SettingsExample />
}

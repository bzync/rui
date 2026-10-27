import { Avatar, Badge, Button, type ColumnDef } from "@bzync/rui"
import { MoreHorizontal } from "lucide-react"

export type Member = {
  id: number
  name: string
  email: string
  role: "Owner" | "Admin" | "Developer" | "Designer" | "Viewer"
  status: "Active" | "Invited" | "Suspended"
  department: string
  lastActive: string
}

export const members: Member[] = [
  { id: 1, name: "Maya Chen", email: "maya@acme.dev", role: "Owner", status: "Active", department: "Engineering", lastActive: "Just now" },
  { id: 2, name: "Jordan Kim", email: "jordan@acme.dev", role: "Developer", status: "Active", department: "Engineering", lastActive: "12m ago" },
  { id: 3, name: "Elena Rostova", email: "elena@acme.dev", role: "Admin", status: "Active", department: "Infrastructure", lastActive: "1h ago" },
  { id: 4, name: "Sam Rivera", email: "sam@acme.dev", role: "Designer", status: "Active", department: "Product Design", lastActive: "3h ago" },
  { id: 5, name: "Tariq Mansoor", email: "tariq@acme.dev", role: "Developer", status: "Active", department: "Security", lastActive: "Yesterday" },
  { id: 6, name: "Chloe Dupont", email: "chloe@acme.dev", role: "Viewer", status: "Invited", department: "Product Marketing", lastActive: "Awaiting accept" },
  { id: 7, name: "Lucas Vance", email: "lucas@acme.dev", role: "Developer", status: "Active", department: "Platform Core", lastActive: "2d ago" },
  { id: 8, name: "Aria Thorne", email: "aria@acme.dev", role: "Designer", status: "Active", department: "Design Systems", lastActive: "3d ago" },
]

export const memberColumns: ColumnDef<Member>[] = [
  {
    key: "name",
    header: "Member",
    searchable: true,
    sortable: true,
    cell: (row) => (
      <div className="member-cell">
        <Avatar name={row.name} size="sm" />
        <span>
          <strong>{row.name}</strong>
          <small>{row.email}</small>
        </span>
      </div>
    ),
  },
  {
    key: "department",
    header: "Department",
    searchable: true,
    sortable: true,
    cell: (row) => <span className="text-xs text-muted-foreground">{row.department}</span>,
  },
  {
    key: "role",
    header: "Role",
    searchable: true,
    sortable: true,
    cell: (row) => (
      <span className="inline-flex items-center text-xs font-medium text-foreground">
        {row.role}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    searchable: true,
    cell: (row) => (
      <Badge
        variant={row.status === "Active" ? "success" : row.status === "Invited" ? "warning" : "muted"}
        dot
      >
        {row.status}
      </Badge>
    ),
  },
  {
    key: "lastActive",
    header: "Last Active",
    cell: (row) => <span className="text-xs text-muted-foreground tabular-nums">{row.lastActive}</span>,
  },
  {
    key: "actions",
    header: <span className="sr-only">Actions</span>,
    align: "right",
    cell: () => (
      <Button variant="ghost" size="icon" aria-label="Member actions">
        <MoreHorizontal size={15} />
      </Button>
    ),
  },
]

export type RevenueMetric = { month: string; revenue: number; apiRequests: number }
export const revenueData: RevenueMetric[] = [
  { month: "Jan", revenue: 42000, apiRequests: 1200000 },
  { month: "Feb", revenue: 49000, apiRequests: 1450000 },
  { month: "Mar", revenue: 58000, apiRequests: 1720000 },
  { month: "Apr", revenue: 64000, apiRequests: 2100000 },
  { month: "May", revenue: 78000, apiRequests: 2600000 },
  { month: "Jun", revenue: 89000, apiRequests: 3200000 },
  { month: "Jul", revenue: 95000, apiRequests: 3800000 },
  { month: "Aug", revenue: 108000, apiRequests: 4300000 },
  { month: "Sep", revenue: 121000, apiRequests: 4900000 },
  { month: "Oct", revenue: 134000, apiRequests: 5400000 },
  { month: "Nov", revenue: 142000, apiRequests: 5800000 },
  { month: "Dec", revenue: 148250, apiRequests: 6250000 },
]

export const trafficChannels = [
  { label: "Direct", value: 45 },
  { label: "Organic Search", value: 30 },
  { label: "Referral", value: 15 },
  { label: "Social", value: 10 },
]

export type KanbanTask = {
  id: string
  title: string
  code: string
  priority: "urgent" | "high" | "normal" | "low"
  assignee: string
  column: "todo" | "in-progress" | "review" | "done"
  tag: string
}

export const initialKanbanTasks: KanbanTask[] = [
  { id: "task-1", title: "Migrate auth service to passkeys & WebAuthn", code: "SEC-412", priority: "urgent", assignee: "Maya Chen", column: "in-progress", tag: "Security" },
  { id: "task-2", title: "Add multi-region read replicas for PostgreSQL", code: "INFRA-209", priority: "high", assignee: "Elena Rostova", column: "in-progress", tag: "Database" },
  { id: "task-3", title: "Refactor ThemeProvider to use CSS variables", code: "UI-104", priority: "normal", assignee: "Jordan Kim", column: "in-progress", tag: "Design System" },
  { id: "task-4", title: "Implement real-time WebSocket notifications", code: "FEAT-582", priority: "high", assignee: "Lucas Vance", column: "todo", tag: "Realtime" },
  { id: "task-5", title: "Audit WCAG 2.2 AA contrast compliance", code: "A11Y-88", priority: "normal", assignee: "Aria Thorne", column: "todo", tag: "Accessibility" },
  { id: "task-6", title: "Optimize bundle size with tree-shaking entries", code: "PERF-330", priority: "low", assignee: "Jordan Kim", column: "todo", tag: "Performance" },
  { id: "task-7", title: "Framer-motion drag and drop interactions", code: "UI-112", priority: "urgent", assignee: "Maya Chen", column: "review", tag: "Interaction" },
  { id: "task-8", title: "Add Playwright visual regression snapshots", code: "TEST-94", priority: "normal", assignee: "Tariq Mansoor", column: "review", tag: "Testing" },
  { id: "task-9", title: "Deploy API gateway v3.0 to staging cluster", code: "REL-501", priority: "high", assignee: "Elena Rostova", column: "done", tag: "Deployment" },
  { id: "task-10", title: "Automate invoice PDF generation with webhooks", code: "BILL-140", priority: "normal", assignee: "Sam Rivera", column: "done", tag: "Billing" },
]

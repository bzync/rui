import { Avatar, Badge, Button, type ColumnDef } from "@bzync/rui"
import { MoreHorizontal } from "lucide-react"

export type Member = { id: number; name: string; email: string; role: string; status: string }

export const members: Member[] = [
  { id: 1, name: "Maya Chen", email: "maya@acme.dev", role: "Owner", status: "Active" },
  { id: 2, name: "Jordan Kim", email: "jordan@acme.dev", role: "Developer", status: "Active" },
  { id: 3, name: "Sam Rivera", email: "sam@acme.dev", role: "Viewer", status: "Invited" },
]

export const memberColumns: ColumnDef<Member>[] = [
  { key: "name", header: "Member", searchable: true, sortable: true, cell: row => <div className="member-cell"><Avatar name={row.name} size="sm" /><span><strong>{row.name}</strong><small>{row.email}</small></span></div> },
  { key: "role", header: "Role", searchable: true, sortable: true, cell: row => row.role },
  { key: "status", header: "Status", searchable: true, cell: row => <Badge variant={row.status === "Active" ? "success" : "muted"} dot>{row.status}</Badge> },
  { key: "actions", header: <span className="sr-only">Actions</span>, align: "right", cell: () => <Button variant="ghost" size="icon" aria-label="Member actions"><MoreHorizontal size={15} /></Button> },
]

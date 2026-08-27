"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DataTable,
  type ColumnDef,
  useSnackbar,
} from "@bzync/rui";
import { Section } from "../_shared/section";
import { Group } from "../_shared/group";

export function DataSection() {
  const [dtLoading, setDtLoading] = useState(false);
  const { show } = useSnackbar();
  const viewProject = (name: string) => show({ message: `Opening ${name}`, variant: "info" });

  return (
    <>
      <Section
        id="table"
        title="Table"
        description="Data table with hover rows, header, and scrollable overflow wrapper."
        importPath='import { Table, TableHeader, TableBody, TableRow, TableCell } from "@bzync/rui"'
        meta={["composable", "hover rows"]}
      >
        <Group label="Deployments" col>
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead />
              </tr>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "api-gateway",
                  status: "success",
                  region: "us-east-1",
                  branch: "main",
                  updated: "2m ago",
                },
                {
                  name: "web-frontend",
                  status: "warning",
                  region: "eu-west-1",
                  branch: "feat/auth",
                  updated: "11m ago",
                },
                {
                  name: "worker-jobs",
                  status: "muted",
                  region: "ap-south-1",
                  branch: "main",
                  updated: "1h ago",
                },
                {
                  name: "db-proxy",
                  status: "error",
                  region: "us-east-1",
                  branch: "fix/conn",
                  updated: "3h ago",
                },
                {
                  name: "scheduler",
                  status: "success",
                  region: "us-west-2",
                  branch: "main",
                  updated: "6h ago",
                },
              ].map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {row.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.status as "success" | "warning" | "muted" | "error"
                      }
                      dot
                    >
                      {row.status === "success"
                        ? "Running"
                        : row.status === "warning"
                          ? "Building"
                          : row.status === "error"
                            ? "Failed"
                            : "Stopped"}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.region}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs bg-black/6 dark:bg-white/6 border border-black/[0.07] dark:border-white/[0.07] rounded px-1.5 py-0.5 text-slate-600 dark:text-slate-400">
                      {row.branch}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {row.updated}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-500"
                      onClick={() => viewProject(row.name)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Group>
      </Section>
      <Section
        id="datatable"
        title="DataTable"
        description="Full-featured data table with sorting, search, pagination, per-page selector, skeleton loading, and empty state."
        importPath='import { DataTable } from "@bzync/rui"'
        meta={["sortable", "searchable", "pagination", "per-page", "skeleton"]}
      >
        <Group label="Controls">
          <Button
            size="sm"
            variant="secondary"
            loading={dtLoading}
            onClick={() => {
              setDtLoading(true);
              setTimeout(() => setDtLoading(false), 1800);
            }}
          >
            Simulate loading
          </Button>
        </Group>
        <Group label="With search + pagination" col>
          <DataTable
            loading={dtLoading}
            searchable
            searchPlaceholder="Search projects…"
            pageSizeOptions={[5, 10, 25]}
            defaultPageSize={5}
            columns={
              [
                {
                  key: "name",
                  header: "Project",
                  sortable: true,
                  searchable: true,
                  cell: (r) => (
                    <span className="font-medium text-gray-900 dark:text-white">
                      {r.name}
                    </span>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  sortable: true,
                  cell: (r) => (
                    <Badge
                      variant={
                        r.status as "success" | "warning" | "error" | "muted"
                      }
                      dot
                    >
                      {r.status === "success"
                        ? "Running"
                        : r.status === "warning"
                          ? "Building"
                          : r.status === "error"
                            ? "Failed"
                            : "Stopped"}
                    </Badge>
                  ),
                },
                {
                  key: "region",
                  header: "Region",
                  sortable: true,
                  searchable: true,
                  cell: (r) => r.region,
                },
                {
                  key: "requests",
                  header: "Requests",
                  sortable: true,
                  align: "right",
                  cell: (r) => (
                    <span className="tabular-nums">{r.requests}</span>
                  ),
                },
                {
                  key: "updated",
                  header: "Updated",
                  sortable: false,
                  cell: (r) => (
                    <span className="text-slate-500">{r.updated}</span>
                  ),
                },
                {
                  key: "actions",
                  header: "",
                  cell: (r) => (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-500"
                      onClick={() => viewProject(r.name)}
                    >
                      View
                    </Button>
                  ),
                },
              ] satisfies ColumnDef<{
                id: number;
                name: string;
                status: string;
                region: string;
                requests: string;
                updated: string;
              }>[]
            }
            data={[
              {
                id: 1,
                name: "api-gateway",
                status: "success",
                region: "us-east-1",
                requests: "1.2M",
                updated: "2m ago",
              },
              {
                id: 2,
                name: "web-frontend",
                status: "warning",
                region: "eu-west-1",
                requests: "840K",
                updated: "11m ago",
              },
              {
                id: 3,
                name: "worker-jobs",
                status: "muted",
                region: "ap-south-1",
                requests: "0",
                updated: "1h ago",
              },
              {
                id: 4,
                name: "db-proxy",
                status: "error",
                region: "us-east-1",
                requests: "22K",
                updated: "3h ago",
              },
              {
                id: 5,
                name: "scheduler",
                status: "success",
                region: "us-west-2",
                requests: "310K",
                updated: "6h ago",
              },
              {
                id: 6,
                name: "auth-service",
                status: "success",
                region: "eu-west-1",
                requests: "980K",
                updated: "8m ago",
              },
              {
                id: 7,
                name: "cdn-proxy",
                status: "success",
                region: "us-east-1",
                requests: "4.1M",
                updated: "1m ago",
              },
              {
                id: 8,
                name: "mail-worker",
                status: "muted",
                region: "us-west-2",
                requests: "12K",
                updated: "2h ago",
              },
              {
                id: 9,
                name: "image-resizer",
                status: "warning",
                region: "ap-south-1",
                requests: "230K",
                updated: "25m ago",
              },
              {
                id: 10,
                name: "export-jobs",
                status: "error",
                region: "eu-central-1",
                requests: "8K",
                updated: "5h ago",
              },
              {
                id: 11,
                name: "cron-runner",
                status: "success",
                region: "us-east-1",
                requests: "45K",
                updated: "3m ago",
              },
              {
                id: 12,
                name: "webhook-relay",
                status: "success",
                region: "eu-west-1",
                requests: "190K",
                updated: "7m ago",
              },
            ]}
            emptyMessage="No deployments found"
          />
        </Group>
      </Section>
    </>
  );
}

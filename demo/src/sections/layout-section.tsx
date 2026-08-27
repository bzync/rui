"use client"

import { useState } from "react"
import { Accordion } from "@bzync/rui"
import { Badge } from "@bzync/rui"
import { Button } from "@bzync/rui"
import { Card, CardBody } from "@bzync/rui"
import { Input } from "@bzync/rui"
import { List, ListItem } from "@bzync/rui"
import { Select } from "@bzync/rui"
import { Separator } from "@bzync/rui"
import { Switch } from "@bzync/rui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bzync/rui"
import { Timeline } from "@bzync/rui"
import { Tree } from "@bzync/rui"
import { Section } from "../_shared/section"
import { Group } from "../_shared/group"
import { IconBarChart, IconBell, IconBox, IconHome, IconSettings, IconUsers } from "../_shared/icons"

export function LayoutSection() {
  const [selectedTreeNode, setSelectedTreeNode] = useState<string | undefined>("src")

  return (
    <>
            <Section
              id="separator"
              title="Separator"
              description="Horizontal and vertical dividers, with optional label."
              importPath='import { Separator } from "@bzync/rui"'
              meta={["horizontal", "vertical", "labeled"]}
            >
              <Group label="Horizontal" col>
                <div className="w-full space-y-4">
                  <p className="text-sm text-slate-400">Above the separator</p>
                  <Separator />
                  <p className="text-sm text-slate-400">Below the separator</p>
                </div>
              </Group>
              <Group label="With label" col>
                <div className="w-full space-y-4">
                  <p className="text-sm text-slate-400">Section A</p>
                  <Separator label="OR" />
                  <p className="text-sm text-slate-400">Section B</p>
                </div>
              </Group>
              <Group label="Vertical">
                <div className="flex items-center gap-4 h-10">
                  <span className="text-sm text-slate-400">Logs</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm text-slate-400">Metrics</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm text-slate-400">Settings</span>
                </div>
              </Group>
            </Section>
            <Section
              id="tabs"
              title="Tabs"
              description="Segmented navigation with spring indicator and animated content. Supports horizontal and vertical orientations."
              importPath='import { Tabs, TabsList, TabsTrigger, TabsContent } from "@bzync/rui"'
              meta={["spring animation", "animated content", "horizontal & vertical"]}
            >
              <Group label="Horizontal (default)" col>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="deployments">Deployments</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <Card><CardBody><p className="text-sm text-slate-400">Overview shows a summary of your project — active deployments, recent activity, and resource usage.</p></CardBody></Card>
                  </TabsContent>
                  <TabsContent value="deployments">
                    <Card><CardBody><p className="text-sm text-slate-400">Deployments lists all recent pushes, build logs, and rollback targets.</p></CardBody></Card>
                  </TabsContent>
                  <TabsContent value="settings">
                    <Card>
                      <CardBody className="space-y-4">
                        <Input label="Project name" defaultValue="api-gateway" />
                        <Select label="Region" options={[{ value: "us-east-1", label: "US East (N. Virginia)" }]} defaultValue="us-east-1" />
                        <div className="flex justify-end"><Button size="sm">Save changes</Button></div>
                      </CardBody>
                    </Card>
                  </TabsContent>
                </Tabs>
              </Group>
              <Group label='Vertical (orientation="vertical")' col>
                <Tabs defaultValue="general" orientation="vertical">
                  <TabsList>
                    <TabsTrigger value="general" icon={<IconSettings />}>General</TabsTrigger>
                    <TabsTrigger value="team" icon={<IconUsers />}>Team</TabsTrigger>
                    <TabsTrigger value="api" icon={<IconBox />}>API</TabsTrigger>
                    <TabsTrigger value="alerts" icon={<IconBell />}>Alerts</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general">
                    <Card>
                      <CardBody className="space-y-4">
                        <Input label="Project name" defaultValue="api-gateway" />
                        <Select label="Region" options={[{ value: "us-east-1", label: "US East (N. Virginia)" }]} defaultValue="us-east-1" />
                        <div className="flex justify-end"><Button size="sm">Save changes</Button></div>
                      </CardBody>
                    </Card>
                  </TabsContent>
                  <TabsContent value="team">
                    <Card><CardBody><p className="text-sm text-slate-400">Manage team members and access roles for this project.</p></CardBody></Card>
                  </TabsContent>
                  <TabsContent value="api">
                    <Card><CardBody><p className="text-sm text-slate-400">API keys and webhook endpoints for this project.</p></CardBody></Card>
                  </TabsContent>
                  <TabsContent value="alerts">
                    <Card><CardBody><p className="text-sm text-slate-400">Configure alert channels and notification thresholds.</p></CardBody></Card>
                  </TabsContent>
                </Tabs>
              </Group>
            </Section>
            <Section
              id="accordion"
              title="Accordion"
              description="Collapsible sections with animated height transition. Supports single and multiple open at once, plus a standalone Collapsible."
              importPath='import { Accordion, Collapsible } from "@bzync/rui"'
              meta={["animated height", "single/multiple", "Collapsible primitive"]}
            >
              <Group label="Single open" col>
                <div className="w-full max-w-lg">
                  <Accordion
                    items={[
                      { id: "what", trigger: <span className="text-sm font-medium">What is bzync cloud?</span>, content: "Bzync Cloud is a fully managed platform for deploying and scaling containerized applications. Connect your repo, configure your build, and we handle the rest." },
                      { id: "pricing", trigger: <span className="text-sm font-medium">How does pricing work?</span>, content: "Every plan includes a free trial — no credit card required. Paid plans start at $9/mo and scale with your compute needs." },
                      { id: "regions", trigger: <span className="text-sm font-medium">Which regions are available?</span>, content: "US East (N. Virginia), EU West (Ireland), and Asia Pacific (Mumbai). Additional regions are coming soon." },
                      { id: "support", trigger: <span className="text-sm font-medium">What support channels exist?</span>, content: "All plans include email support. Launch and above plans include priority support via Slack. Enterprise plans include a dedicated SRE." },
                    ]}
                  />
                </div>
              </Group>
              <Group label="Multiple open" col>
                <div className="w-full max-w-lg">
                  <Accordion
                    multiple
                    defaultOpen={["env", "build"]}
                    items={[
                      { id: "env",   trigger: <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Environment variables</span>, content: <div className="space-y-2"><Input placeholder="KEY" /><Input placeholder="VALUE" /></div> },
                      { id: "build", trigger: <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Build settings</span>, content: <div className="space-y-2"><Input label="Build command" defaultValue="npm run build" /><Input label="Output directory" defaultValue="dist" /></div> },
                      { id: "adv",   trigger: <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Advanced</span>, content: <div className="space-y-2"><Switch label="Zero-downtime deployment" defaultChecked /><Switch label="Auto-rollback on health failure" defaultChecked /></div> },
                    ]}
                  />
                </div>
              </Group>
            </Section>
            <Section
              id="list"
              title="List"
              description="Divided list with icon, trailing slot, and description. ListItems can be anchors or click targets."
              importPath='import { List, ListItem } from "@bzync/rui"'
              meta={["divided", "icon slot", "trailing slot", "active state"]}
            >
              <Group label="Nav list" col>
                <div className="w-full max-w-sm">
                  <List>
                    <ListItem icon={<IconHome />} trailing={<Badge variant="muted" size="sm">Active</Badge>} active href="#">Dashboard</ListItem>
                    <ListItem icon={<IconBox />} trailing={<Badge variant="default" size="sm">3</Badge>} href="#">Projects</ListItem>
                    <ListItem icon={<IconBarChart />} href="#">Analytics</ListItem>
                    <ListItem icon={<IconUsers />} description="3 members" href="#">Team</ListItem>
                    <ListItem icon={<IconSettings />} href="#">Settings</ListItem>
                  </List>
                </div>
              </Group>
              <Group label="Deploy log list" col>
                <div className="w-full max-w-lg">
                  <List>
                    {[
                      { name: "Deploy #1044", desc: "main · triggered by push · 2m ago", status: "success" },
                      { name: "Deploy #1043", desc: "feat/auth · triggered manually · 18m ago", status: "warning" },
                      { name: "Deploy #1042", desc: "fix/db-conn · triggered by push · 3h ago", status: "error" },
                    ].map((d) => (
                      <ListItem
                        key={d.name}
                        description={d.desc}
                        trailing={<Badge variant={d.status as "success" | "warning" | "error"} dot size="sm">{d.status === "success" ? "Live" : d.status === "warning" ? "Building" : "Failed"}</Badge>}
                        href="#"
                      >
                        {d.name}
                      </ListItem>
                    ))}
                  </List>
                </div>
              </Group>
            </Section>
            <Section
              id="timeline"
              title="Timeline"
              description="Vertical event log with variant dot/icon, timestamp, and description."
              importPath='import { Timeline } from "@bzync/rui"'
              meta={["5 variants", "icon support", "timestamp"]}
            >
              <Group label="Deploy history" col>
                <div className="w-full max-w-md">
                  <Timeline
                    events={[
                      { id: "1", title: "Deployed to production", description: "api-gateway v2.4.1 went live on us-east-1", timestamp: "2m ago", variant: "success" },
                      { id: "2", title: "Build completed", description: "Docker image pushed to registry (1.2 GB)", timestamp: "4m ago", variant: "info" },
                      { id: "3", title: "Build started", description: "npm ci && npm run build", timestamp: "6m ago" },
                      { id: "4", title: "Deploy triggered", description: "Push to main by alice@bzync.cloud", timestamp: "7m ago" },
                      { id: "5", title: "Previous deploy failed", description: "Health check timeout after 60s", timestamp: "3h ago", variant: "error" },
                    ]}
                  />
                </div>
              </Group>
            </Section>
            <Section
              id="tree"
              title="Tree"
              description="Expandable tree view with animated collapse, icon support, selection, and default-expanded nodes."
              importPath='import { Tree } from "@bzync/rui"'
              meta={["animated collapse", "selection", "icon support", "default-expanded"]}
            >
              <Group label="File tree" col>
                <div className="w-full max-w-xs rounded-xl border border-black/[0.07] dark:border-white/[0.07] p-2">
                  <Tree
                    selected={selectedTreeNode}
                    onSelect={setSelectedTreeNode}
                    defaultExpanded={["src", "components"]}
                    nodes={[
                      {
                        id: "src", label: "src",
                        icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
                        children: [
                          {
                            id: "components", label: "components",
                            icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
                            children: [
                              { id: "button", label: "button.tsx" },
                              { id: "input",  label: "input.tsx"  },
                              { id: "modal",  label: "modal.tsx"  },
                            ],
                          },
                          { id: "app.tsx",   label: "app.tsx"   },
                          { id: "layout.tsx",label: "layout.tsx" },
                        ],
                      },
                      { id: "public", label: "public", children: [{ id: "favicon", label: "favicon.ico" }] },
                      { id: "package.json", label: "package.json" },
                    ]}
                  />
                </div>
              </Group>
            </Section>
    </>
  )
}

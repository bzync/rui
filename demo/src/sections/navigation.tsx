import { useState } from "react"
import { Activity, Box, Home, Menu, Settings } from "lucide-react"
import {
  Badge,
  BottomBar,
  BrandLink,
  Breadcrumb,
  Button,
  Drawer,
  IconButton,
  Navbar,
  Pagination,
  Sidebar,
  Stepper,
  Topbar,
  TopbarTitle,
  type NavigationItem,
} from "@bzync/rui"
import { Section } from "../_shared/section"
import { Group } from "../_shared/group"

const items: NavigationItem[] = [
  { id: "overview", label: "Overview", href: "#overview", icon: <Home size={16} /> },
  { id: "projects", label: "Projects", href: "#projects", icon: <Box size={16} /> },
  { id: "activity", label: "Activity", href: "#activity", icon: <Activity size={16} />, badge: <Badge size="sm">3</Badge> },
  { id: "settings", label: "Settings", href: "#settings", icon: <Settings size={16} /> },
]

function Brand() {
  return (
    <BrandLink href="#navbar" mark={<span className="grid size-7 place-items-center rounded-md bg-slate-950 text-xs text-white dark:bg-white dark:text-slate-950">B</span>}>
      bzync
    </BrandLink>
  )
}

export function NavigationSection() {
  const [active, setActive] = useState("overview")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [page, setPage] = useState(2)

  return (
    <>
      <Section id="navbar" title="Navbar" description="A composable horizontal navigation shell for products and marketing pages." importPath='import { Navbar, BrandLink } from "@bzync/rui"' meta={["semantic nav", "controlled selection", "responsive"]}>
        <Group label="Product navigation" col>
          <Navbar items={items.slice(0, 3)} activeId={active} onSelect={setActive} className="w-full rounded-xl">
            <Brand />
          </Navbar>
        </Group>
      </Section>

      <Section id="topbar" title="Topbar" description="A quiet application header with slots for breadcrumbs, titles, and actions." importPath='import { Topbar, TopbarTitle, IconButton } from "@bzync/rui"' meta={["composable slots", "accessible icon actions"]}>
        <Group label="Workspace header" col>
          <Topbar className="w-full rounded-xl border">
            <IconButton label="Open menu"><Menu size={18} aria-hidden="true" /></IconButton>
            <TopbarTitle>Production / API gateway</TopbarTitle>
            <Badge variant="success">Healthy</Badge>
            <Button size="sm">Deploy</Button>
          </Topbar>
        </Group>
      </Section>

      <Section id="sidebar" title="Sidebar" description="Vertical application navigation with reusable header and footer slots." importPath='import { Sidebar } from "@bzync/rui"' meta={["header + footer slots", "badges", "aria-current"]}>
        <Group label="Application rail" col>
          <Sidebar
            items={items}
            activeId={active}
            onSelect={setActive}
            header={<Brand />}
            footer={<p className="text-xs text-slate-500">Acme workspace · Pro</p>}
            className="min-h-80 rounded-xl"
          />
        </Group>
      </Section>

      <Section id="bottombar" title="BottomBar" description="Thumb-friendly navigation for compact screens, including safe-area padding." importPath='import { BottomBar } from "@bzync/rui"' meta={["mobile first", "safe area", "controlled selection"]}>
        <Group label="Mobile navigation" col>
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08]">
            <div className="grid h-40 place-items-center bg-white text-sm text-slate-400 dark:bg-navy-950">Page content</div>
            <BottomBar items={items} activeId={active} onSelect={setActive} className="border-x-0 border-b-0" />
          </div>
        </Group>
      </Section>

      <Section id="drawer" title="Drawer" description="Off-canvas content for focused tasks on any viewport." importPath='import { Drawer } from "@bzync/rui"'>
        <Group label="Interactive example">
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Deployment details">
            <div className="p-5 text-sm text-slate-600 dark:text-slate-300">Review the release metadata before promoting this build.</div>
          </Drawer>
        </Group>
      </Section>

      <Section id="breadcrumb" title="Breadcrumb" description="Compact hierarchy for orienting users within nested resources." importPath='import { Breadcrumb } from "@bzync/rui"'>
        <Group label="Resource path"><Breadcrumb items={[{ label: "Projects", href: "#" }, { label: "Atlas", href: "#" }, { label: "Deployments" }]} /></Group>
      </Section>

      <Section id="pagination" title="Pagination" description="Controlled page navigation with compact overflow handling." importPath='import { Pagination } from "@bzync/rui"'>
        <Group label="Results pages"><Pagination page={page} totalPages={12} onPageChange={setPage} /></Group>
      </Section>

      <Section id="stepper" title="Stepper" description="Communicate progress through a defined multi-step workflow." importPath='import { Stepper } from "@bzync/rui"'>
        <Group label="Deployment flow" col><Stepper current={1} steps={[{ label: "Configure" }, { label: "Review" }, { label: "Deploy" }]} /></Group>
      </Section>
    </>
  )
}

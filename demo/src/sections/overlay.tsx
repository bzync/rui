"use client"

import { Button } from "@bzync/rui"
import { useCommand } from "@bzync/rui"
import { Checkbox } from "@bzync/rui"
import { DropdownMenu } from "@bzync/rui"
import { Kbd } from "@bzync/rui"
import { Popover, PopoverContent } from "@bzync/rui"
import { useSnackbar } from "@bzync/rui"
import { Section } from "../_shared/section"
import { Group } from "../_shared/group"
import { IconBarChart, IconBox, IconDeploy, IconSettings, IconTrash } from "../_shared/icons"

// ─── Command demo (needs hook, must live inside CommandProvider) ──────────────

function CommandDemo() {
  const { setOpen } = useCommand()
  return (
    <Group label="Trigger palette">
      <Button size="sm" onClick={() => setOpen(true)}>Open command palette</Button>
      <Kbd keys={["⌘", "K"]} />
      <span className="text-xs text-slate-500">or press ⌘K anywhere</span>
    </Group>
  )
}

export function OverlaySection() {
  const { show } = useSnackbar()
  const notify = (message: string) => () => show({ message, variant: "success" })
  return (
    <>
            <Section
              id="popover"
              title="Popover"
              description="Anchored floating panel with 4 sides, 3 alignment options, and click-outside dismissal."
              importPath='import { Popover, PopoverContent } from "@bzync/rui"'
              meta={["4 sides", "3 alignments", "click-outside"]}
            >
              <Group label="Sides">
                <Popover side="bottom" trigger={<Button size="sm" variant="secondary">Bottom</Button>}>
                  <PopoverContent><p className="text-sm text-slate-600 dark:text-slate-300">Opens below</p></PopoverContent>
                </Popover>
                <Popover side="top" trigger={<Button size="sm" variant="secondary">Top</Button>}>
                  <PopoverContent><p className="text-sm text-slate-600 dark:text-slate-300">Opens above</p></PopoverContent>
                </Popover>
                <Popover side="right" trigger={<Button size="sm" variant="secondary">Right</Button>}>
                  <PopoverContent><p className="text-sm text-slate-600 dark:text-slate-300">Opens right</p></PopoverContent>
                </Popover>
                <Popover side="left" trigger={<Button size="sm" variant="secondary">Left</Button>}>
                  <PopoverContent><p className="text-sm text-slate-600 dark:text-slate-300">Opens left</p></PopoverContent>
                </Popover>
              </Group>
              <Group label="Rich content">
                <Popover trigger={<Button size="sm">Filter options</Button>}>
                  <PopoverContent className="w-56">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Filter by status</p>
                    <div className="space-y-2">
                      <Checkbox label="Running" defaultChecked />
                      <Checkbox label="Building" />
                      <Checkbox label="Failed" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-black/[0.07] dark:border-white/[0.07] flex justify-end">
                      <Button size="sm" onClick={notify("Status filters applied")}>Apply</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </Group>
            </Section>
            <Section
              id="dropdownmenu"
              title="DropdownMenu"
              description="Context menu and dropdown with groups, icons, shortcuts, and destructive items."
              importPath='import { DropdownMenu } from "@bzync/rui"'
              meta={["groups", "icons", "shortcuts", "destructive"]}
            >
              <Group label="Project actions">
                <DropdownMenu
                  trigger={<Button size="sm" variant="secondary">Actions</Button>}
                  items={[
                    {
                      group: "Project",
                      items: [
                        { label: "View logs",    icon: <IconBarChart />, shortcut: "L", onClick: notify("Opening project logs") },
                        { label: "Deploy now",   icon: <IconDeploy />,   shortcut: "D", onClick: notify("Deployment queued") },
                        { label: "Settings",     icon: <IconSettings />, shortcut: "S", onClick: notify("Opening project settings") },
                      ],
                    },
                    {
                      group: "Danger",
                      items: [
                        { label: "Delete project", icon: <IconTrash />, destructive: true, onClick: () => show({ message: "Delete project selected", variant: "warning" }) },
                      ],
                    },
                  ]}
                />
                <DropdownMenu
                  align="end"
                  trigger={
                    <Button size="sm" variant="ghost">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                      </svg>
                    </Button>
                  }
                  items={[
                    { label: "Edit",      icon: <IconSettings />, onClick: notify("Edit selected") },
                    { label: "Duplicate", icon: <IconBox />,   disabled: true },
                    { label: "Delete",    icon: <IconTrash />, destructive: true, onClick: () => show({ message: "Delete selected", variant: "warning" }) },
                  ]}
                />
              </Group>
            </Section>
            <Section
              id="command"
              title="Command"
              description="⌘K command palette with fuzzy search, keyboard navigation, grouped items, and shortcut hints."
              importPath='import { CommandProvider, CommandPalette, useCommand } from "@bzync/rui"'
              meta={["⌘K shortcut", "fuzzy search", "groups", "keyboard nav"]}
            >
              <CommandDemo />
            </Section>
    </>
  )
}

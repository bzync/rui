import { Button } from "@bzync/rui"
import { CopyButton } from "@bzync/rui"
import { useSnackbar } from "@bzync/rui"
import { Section } from "../_shared/section"
import { Group } from "../_shared/group"
import { IconPlus, IconArrow, IconTrash } from "../_shared/icons"

export function ActionsSection() {
  const { show } = useSnackbar()
  const act = (label: string) => () => show({ message: `${label} action triggered`, variant: label === "Delete" || label === "Destructive" ? "warning" : "success" })
  return (
    <>
            <Section
              id="button"
              title="Button"
              description="Interactive control with 5 variants, 3 sizes, loading state, and icon support."
              importPath='import { Button } from "@bzync/rui"'
              meta={["5 variants", "3 sizes", "loading state"]}
            >
              <Group label="Variants">
                <Button onClick={act("Primary")}>Primary</Button>
                <Button variant="secondary" onClick={act("Secondary")}>Secondary</Button>
                <Button variant="ghost" onClick={act("Ghost")}>Ghost</Button>
                <Button variant="outline" onClick={act("Outline")}>Outline</Button>
                <Button variant="destructive" onClick={act("Destructive")}>Destructive</Button>
              </Group>
              <Group label="Sizes">
                <Button size="sm" onClick={act("Small")}>Small</Button>
                <Button size="md" onClick={act("Medium")}>Medium</Button>
                <Button size="lg" onClick={act("Large")}>Large</Button>
              </Group>
              <Group label="States">
                <Button loading>Deploying…</Button>
                <Button disabled>Disabled</Button>
                <Button icon={<IconPlus />} onClick={act("New Project")}>New Project</Button>
                <Button icon={<IconArrow />} iconPosition="right" variant="secondary" onClick={act("Continue")}>Continue</Button>
                <Button icon={<IconTrash />} variant="destructive" onClick={act("Delete")}>Delete</Button>
              </Group>
            </Section>
            <Section
              id="copybutton"
              title="CopyButton"
              description="One-click clipboard copy with animated check feedback and configurable timeout."
              importPath='import { CopyButton } from "@bzync/rui"'
              meta={["animated feedback", "configurable timeout"]}
            >
              <Group label="Sizes">
                <CopyButton value="sk_live_abc123" size="sm" />
                <CopyButton value="sk_live_abc123" size="md" />
              </Group>
              <Group label="With label">
                <CopyButton value="sk_live_abc123" label="Copy key" />
                <CopyButton value="npm install @bzync/sdk" label="Copy install command" size="md" />
              </Group>
              <Group label="Inline with code" col>
                <div className="flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/4 dark:bg-white/4 px-3 py-2 min-w-0">
                  <code className="flex-1 min-w-0 truncate text-xs font-mono text-slate-600 dark:text-slate-300 select-all">sk_live_a1b2c3d4e5f6g7h8</code>
                  <CopyButton value="sk_live_a1b2c3d4e5f6g7h8" />
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/4 dark:bg-white/4 px-3 py-2 min-w-0">
                  <code className="flex-1 min-w-0 truncate text-xs font-mono text-slate-600 dark:text-slate-300 select-all">DATABASE_URL=postgres://user:pass@db:5432/app</code>
                  <CopyButton value="DATABASE_URL=postgres://user:pass@db:5432/app" />
                </div>
              </Group>
            </Section>
    </>
  )
}

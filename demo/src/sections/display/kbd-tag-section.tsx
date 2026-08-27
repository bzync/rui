import { Kbd, Tag } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"
import { IconBarChart, IconBox, IconDeploy } from "../../_shared/icons"

export function KbdSection() {
  return (
    <Section
      id="kbd"
      title="Kbd"
      description="Keyboard shortcut display for single keys and multi-key chords."
      importPath='import { Kbd } from "@bzync/rui"'
      meta={["single key", "chord", "sm · md"]}
    >
      <Group label="Common shortcuts">
        <Kbd keys={["⌘", "K"]} />
        <Kbd keys={["⌘", "S"]} />
        <Kbd keys={["⌃", "C"]} />
        <Kbd keys="ESC" />
        <Kbd keys="⏎" />
        <Kbd keys="Tab" />
        <Kbd keys={["⌘", "⇧", "P"]} />
      </Group>
      <Group label="Sizes">
        <Kbd keys={["⌘", "K"]} size="sm" />
        <Kbd keys={["⌘", "K"]} size="md" />
      </Group>
      <Group label="In context" col>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Press <Kbd keys={["⌘", "K"]} /> to open the command palette, or <Kbd keys="ESC" /> to close it.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Use <Kbd keys={["⌘", "S"]} /> to save, <Kbd keys={["⌘", "Z"]} /> to undo.
        </p>
      </Group>
    </Section>
  )
}

export function TagSection() {
  return (
    <Section
      id="tag"
      title="Tag"
      description="Dismissible chip/tag with 5 variants, icon support, and a remove button."
      importPath='import { Tag } from "@bzync/rui"'
      meta={["5 variants", "icon slot", "dismissible", "sm · md"]}
    >
      <Group label="Variants">
        <Tag>Default</Tag>
        <Tag variant="success">Running</Tag>
        <Tag variant="warning">Building</Tag>
        <Tag variant="error">Failed</Tag>
        <Tag variant="info">Preview</Tag>
      </Group>
      <Group label="Dismissible">
        <Tag onRemove={() => {}}>Node.js 20</Tag>
        <Tag variant="success" onRemove={() => {}}>us-east-1</Tag>
        <Tag variant="info" onRemove={() => {}}>feat/auth</Tag>
        <Tag variant="warning" onRemove={() => {}}>beta</Tag>
      </Group>
      <Group label="With icons">
        <Tag icon={<IconBox />}>Docker</Tag>
        <Tag variant="success" icon={<IconDeploy />}>Deployed</Tag>
        <Tag variant="info" icon={<IconBarChart />} onRemove={() => {}}>Metrics</Tag>
      </Group>
      <Group label="Sizes">
        <Tag size="sm">Small</Tag>
        <Tag size="md">Medium</Tag>
      </Group>
    </Section>
  )
}

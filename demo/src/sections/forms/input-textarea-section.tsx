import { Input } from "@bzync/rui"
import { Textarea } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function InputTextareaSection() {
  return (
    <>
      <Section
        id="input"
        title="Input"
        description="Text input with label, hint, error state, and prefix/suffix slots."
        importPath='import { Input } from "@bzync/rui"'
        meta={["label", "hint", "error", "prefix · suffix"]}
      >
        <Group label="States" col>
          <Input placeholder="Default input" />
          <Input label="Project name" placeholder="my-api" />
          <Input
            label="Domain"
            placeholder="example.com"
            prefix={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            }
            hint="Custom domain for your deployment"
          />
          <Input label="API endpoint" placeholder="https://" suffix=".bzync.cloud" />
          <Input label="Email" placeholder="you@example.com" error="This email is already in use" defaultValue="bad@" />
          <Input label="Disabled" placeholder="Can't edit" disabled defaultValue="read-only value" />
        </Group>
      </Section>
      <Section
        id="textarea"
        title="Textarea"
        description="Multi-line text input with label, hint, and error support."
        importPath='import { Textarea } from "@bzync/rui"'
        meta={["label", "hint", "error"]}
      >
        <Group label="States" col>
          <Textarea placeholder="Write a description…" />
          <Textarea label="Startup command" placeholder="e.g. node dist/server.js" hint="Command run inside the container on boot" />
          <Textarea label="Environment variables" placeholder="KEY=value" error="Invalid format on line 3" defaultValue={"PORT=8080\nNODE_ENV=production\nBAD LINE"} />
        </Group>
      </Section>
    </>
  )
}

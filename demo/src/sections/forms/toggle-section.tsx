import { Checkbox } from "@bzync/rui"
import { Switch } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function ToggleSection({
  sw1, setSw1, sw2, setSw2, sw3, setSw3, sw4, setSw4,
}: {
  sw1: boolean; setSw1: (v: boolean) => void
  sw2: boolean; setSw2: (v: boolean) => void
  sw3: boolean; setSw3: (v: boolean) => void
  sw4: boolean; setSw4: (v: boolean) => void
}) {
  return (
    <>
      <Section
        id="checkbox"
        title="Checkbox"
        description="Animated checkbox with spring checkmark, indeterminate state, label, description, and error."
        importPath='import { Checkbox } from "@bzync/rui"'
        meta={["3 sizes", "indeterminate", "spring animation"]}
      >
        <Group label="Sizes">
          <Checkbox size="sm" label="Small" defaultChecked />
          <Checkbox size="md" label="Medium" defaultChecked />
          <Checkbox size="lg" label="Large" defaultChecked />
        </Group>
        <Group label="States" col>
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled unchecked" disabled />
          <Checkbox label="Disabled checked" disabled defaultChecked />
          <Checkbox label="With error" error="You must accept the terms" />
        </Group>
        <Group label="With descriptions" col>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <Checkbox
              label="Auto-deploy on push"
              description="Trigger deployments whenever you push to the main branch."
              defaultChecked
            />
            <Checkbox
              label="Enable preview deployments"
              description="Create isolated preview URLs for every pull request."
            />
            <Checkbox
              label="Email notifications"
              description="Get notified when deployments complete or fail."
              defaultChecked
            />
          </div>
        </Group>
      </Section>
      <Section
        id="switch"
        title="Switch"
        description="Animated toggle with spring thumb motion, label, and description slots."
        importPath='import { Switch } from "@bzync/rui"'
        meta={["sm · md", "spring animation"]}
      >
        <Group label="Sizes">
          <div className="flex flex-col gap-4">
            <Switch size="sm" label="Small switch" checked={sw1} onChange={(e) => setSw1(e.target.checked)} />
            <Switch size="md" label="Medium switch" checked={sw2} onChange={(e) => setSw2(e.target.checked)} />
          </div>
        </Group>
        <Group label="With descriptions">
          <div className="flex flex-col gap-5 w-full max-w-sm">
            <Switch label="Auto-deploy" description="Trigger a deployment whenever you push to the main branch." checked={sw2} onChange={(e) => setSw2(e.target.checked)} />
            <Switch label="Preview deployments" description="Create isolated preview URLs for every pull request." checked={sw3} onChange={(e) => setSw3(e.target.checked)} />
            <Switch label="Health checks" description="Automatically roll back if the new version fails health probes." checked={sw4} onChange={(e) => setSw4(e.target.checked)} />
            <Switch label="Notifications disabled" description="This setting cannot be changed from this panel." disabled />
          </div>
        </Group>
      </Section>
    </>
  )
}

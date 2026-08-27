import { Input } from "@bzync/rui"
import { Label } from "@bzync/rui"
import { Select } from "@bzync/rui"
import { FormField } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function LabelFieldsSection() {
  return (
    <>
      <Section
        id="label"
        title="Label"
        description="Semantic label with optional required marker and hint text."
        importPath='import { Label } from "@bzync/rui"'
        meta={["required marker", "hint"]}
      >
        <Group label="Variants">
          <Label>Project name</Label>
          <Label required>Email address</Label>
          <Label hint="optional">Description</Label>
          <Label required hint="max 64 chars">API key name</Label>
        </Group>
      </Section>
      <Section
        id="formfield"
        title="FormField"
        description="Wrapper composing label, input, hint, and error into a single form field unit."
        importPath='import { FormField } from "@bzync/rui"'
        meta={["label", "error", "hint", "required"]}
      >
        <Group label="Examples" col>
          <div className="w-full max-w-sm space-y-4">
            <FormField label="Project name" htmlFor="pname" required>
              <Input id="pname" placeholder="my-api" />
            </FormField>
            <FormField label="Region" htmlFor="region" hint="Closest to your users">
              <Select id="region" placeholder="Choose region" options={[{ value: "us-east-1", label: "US East (N. Virginia)" }, { value: "eu-west-1", label: "EU West (Ireland)" }]} />
            </FormField>
            <FormField label="Branch" htmlFor="branch" error="Branch not found in repository">
              <Input id="branch" defaultValue="feature/does-not-exist" error="Branch not found in repository" />
            </FormField>
          </div>
        </Group>
      </Section>
    </>
  )
}

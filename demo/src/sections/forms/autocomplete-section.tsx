import { Autocomplete } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function AutocompleteSection({
  acValue, acInput, setAcInput, onAcSelect,
  acMultiCount, setAcMultiCount, acTagsCount, setAcTagsCount,
}: {
  acValue: string | null
  acInput: string
  setAcInput: (v: string) => void
  onAcSelect: (opt: { value: string; label: string }) => void
  acMultiCount: number
  setAcMultiCount: (n: number) => void
  acTagsCount: number
  setAcTagsCount: (n: number) => void
}) {
  return (
    <Section
      id="autocomplete"
      title="Autocomplete"
      description="Keyboard-navigable combobox with live filtering, match highlighting, async loading, and multi-select with chip tags. Backspace removes the last chip."
      importPath='import { Autocomplete } from "@bzync/rui"'
      meta={["keyboard nav", "match highlight", "async loading", "multi-select"]}
    >
      <Group label="Region picker" col>
        <Autocomplete
          label="Region"
          placeholder="Search regions…"
          value={acValue}
          inputValue={acInput}
          onInputChange={setAcInput}
          onSelect={onAcSelect}
          hint="Choose the closest region to your users"
          options={[
            { value: "us-east-1", label: "US East (N. Virginia)", description: "us-east-1 · 4ms avg" },
            { value: "us-west-2", label: "US West (Oregon)", description: "us-west-2 · 12ms avg" },
            { value: "eu-west-1", label: "EU West (Ireland)", description: "eu-west-1 · 89ms avg" },
            { value: "eu-central-1", label: "EU Central (Frankfurt)", description: "eu-central-1 · 95ms avg" },
            { value: "ap-south-1", label: "Asia Pacific (Mumbai)", description: "ap-south-1 · 210ms avg" },
            { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)", description: "ap-northeast-1 · 180ms avg" },
            { value: "sa-east-1", label: "South America (São Paulo)", description: "sa-east-1 · 240ms avg" },
          ]}
        />
      </Group>
      <Group label="States" col>
        <Autocomplete placeholder="Loading options…" loading options={[]} />
        <Autocomplete placeholder="Search for something rare…" options={[{ value: "x", label: "Xanadu" }]} emptyMessage="No matching regions" />
        <Autocomplete label="Disabled" placeholder="Cannot interact" disabled options={[]} />
        <Autocomplete label="With error" placeholder="Pick a runtime" error="A runtime is required" options={[{ value: "node20", label: "Node.js 20" }, { value: "python311", label: "Python 3.11" }]} />
      </Group>
      <Group label="Multiple selection" col>
        <Autocomplete
          multiple
          label="Regions"
          placeholder="Search and pick regions…"
          hint={acMultiCount > 0 ? `${acMultiCount} region${acMultiCount > 1 ? "s" : ""} selected · Backspace removes last` : "Select one or more regions"}
          onSelect={(_, all) => setAcMultiCount(all.length)}
          onDeselect={(_, all) => setAcMultiCount(all.length)}
          options={[
            { value: "us-east-1",      label: "US East (N. Virginia)",   description: "us-east-1 · 4ms avg" },
            { value: "us-west-2",      label: "US West (Oregon)",         description: "us-west-2 · 12ms avg" },
            { value: "eu-west-1",      label: "EU West (Ireland)",        description: "eu-west-1 · 89ms avg" },
            { value: "eu-central-1",   label: "EU Central (Frankfurt)",   description: "eu-central-1 · 95ms avg" },
            { value: "ap-south-1",     label: "Asia Pacific (Mumbai)",    description: "ap-south-1 · 210ms avg" },
            { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)",     description: "ap-northeast-1 · 180ms avg" },
            { value: "sa-east-1",      label: "South America (São Paulo)",description: "sa-east-1 · 240ms avg" },
          ]}
        />
        <Autocomplete
          multiple
          label="Tech stack"
          placeholder="Search runtimes, frameworks…"
          hint={`${acTagsCount} selected · pick all that apply · Backspace removes last`}
          onSelect={(_, all) => setAcTagsCount(all.length)}
          onDeselect={(_, all) => setAcTagsCount(all.length)}
          options={[
            { value: "node20",    label: "Node.js 20"  },
            { value: "bun",       label: "Bun 1.x"     },
            { value: "python311", label: "Python 3.11" },
            { value: "python312", label: "Python 3.12" },
            { value: "go122",     label: "Go 1.22"     },
            { value: "rust",      label: "Rust"        },
            { value: "docker",    label: "Docker"      },
            { value: "postgres",  label: "PostgreSQL"  },
            { value: "redis",     label: "Redis"       },
            { value: "react",     label: "React"       },
            { value: "nextjs",    label: "Next.js"     },
          ]}
        />
      </Group>
    </Section>
  )
}

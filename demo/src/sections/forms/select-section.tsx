import { Select } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function SelectSection({
  selectMulti, setSelectMulti, selectMultiStatus, setSelectMultiStatus,
}: {
  selectMulti: string[]
  setSelectMulti: (v: string[]) => void
  selectMultiStatus: string[]
  setSelectMultiStatus: (v: string[]) => void
}) {
  return (
    <Section
      id="select"
      title="Select"
      description="Fully custom dropdown with keyboard navigation, icons, color indicators, descriptions, option groups, clearable, and multi-select with chip tags."
      importPath='import { Select } from "@bzync/rui"'
      meta={["keyboard nav", "icons", "descriptions", "groups", "clearable", "multi-select"]}
    >
      <Group label="Basic" col>
        <Select
          label="Region"
          placeholder="Choose a region"
          options={[
            { value: "us-east-1", label: "US East (N. Virginia)", description: "us-east-1 · lowest latency" },
            { value: "eu-west-1", label: "EU West (Ireland)", description: "eu-west-1" },
            { value: "ap-south-1", label: "Asia Pacific (Mumbai)", description: "ap-south-1" },
            { value: "us-west-2", label: "US West (Oregon)", description: "us-west-2" },
          ]}
        />
        <Select
          label="Instance size"
          defaultValue="sm"
          hint="Affects monthly cost"
          options={[
            { value: "xs", label: "XS · 512 MB RAM" },
            { value: "sm", label: "SM · 1 GB RAM" },
            { value: "md", label: "MD · 2 GB RAM" },
            { value: "lg", label: "LG · 4 GB RAM" },
          ]}
        />
        <Select
          label="Runtime"
          placeholder="Select runtime"
          error="A runtime is required to continue"
          options={[
            { value: "node20", label: "Node.js 20" },
            { value: "python311", label: "Python 3.11" },
            { value: "go122", label: "Go 1.22" },
          ]}
        />
      </Group>
      <Group label="With icons + status colors" col>
        <Select
          label="Deployment status"
          placeholder="Filter by status"
          clearable
          options={[
            { value: "running",  label: "Running",  color: "success", description: "Service is live" },
            { value: "building", label: "Building", color: "warning", description: "Build in progress" },
            { value: "failed",   label: "Failed",   color: "error",   description: "Last deploy failed" },
            { value: "stopped",  label: "Stopped",  color: "default", description: "Service is offline" },
          ]}
        />
        <Select
          label="Environment"
          placeholder="Select environment"
          options={[
            { value: "prod",    label: "Production",  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, description: "Live traffic" },
            { value: "staging", label: "Staging",     icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>, description: "Pre-release testing" },
            { value: "dev",     label: "Development", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>, description: "Local development" },
          ]}
        />
      </Group>
      <Group label="With option groups" col>
        <Select
          label="Runtime"
          placeholder="Select a runtime"
          options={[
            {
              group: "JavaScript / TypeScript",
              options: [
                { value: "node20", label: "Node.js 20", description: "LTS · recommended" },
                { value: "bun",    label: "Bun 1.x",    description: "Fast runtime" },
                { value: "deno",   label: "Deno 2.x",   description: "Secure by default" },
              ],
            },
            {
              group: "Python",
              options: [
                { value: "py311", label: "Python 3.11" },
                { value: "py312", label: "Python 3.12" },
              ],
            },
            {
              group: "Other",
              options: [
                { value: "go122",  label: "Go 1.22" },
                { value: "ruby33", label: "Ruby 3.3", disabled: true, description: "Coming soon" },
              ],
            },
          ]}
        />
      </Group>
      <Group label="Multiple selection" col>
        <Select
          multiple
          label="Regions"
          placeholder="Choose regions…"
          value={selectMulti}
          onChange={setSelectMulti}
          hint={selectMulti.length > 0 ? `${selectMulti.length} region${selectMulti.length > 1 ? "s" : ""} selected` : "Select one or more deployment regions"}
          options={[
            { value: "us-east-1",    label: "US East (N. Virginia)", description: "us-east-1" },
            { value: "us-west-2",    label: "US West (Oregon)",       description: "us-west-2" },
            { value: "eu-west-1",    label: "EU West (Ireland)",      description: "eu-west-1" },
            { value: "eu-central-1", label: "EU Central (Frankfurt)", description: "eu-central-1" },
            { value: "ap-south-1",   label: "Asia Pacific (Mumbai)",  description: "ap-south-1" },
            { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)", description: "ap-northeast-1" },
          ]}
        />
        <Select
          multiple
          clearable
          label="Filter by status"
          placeholder="All statuses"
          value={selectMultiStatus}
          onChange={setSelectMultiStatus}
          options={[
            { value: "running",  label: "Running",  color: "success" },
            { value: "building", label: "Building", color: "warning" },
            { value: "failed",   label: "Failed",   color: "error"   },
            { value: "stopped",  label: "Stopped",  color: "default" },
          ]}
        />
        <Select
          multiple
          label="Assign labels"
          placeholder="Add labels…"
          options={[
            {
              group: "Priority",
              options: [
                { value: "p0", label: "P0 — Critical" },
                { value: "p1", label: "P1 — High" },
                { value: "p2", label: "P2 — Medium" },
              ],
            },
            {
              group: "Type",
              options: [
                { value: "bug",     label: "Bug" },
                { value: "feature", label: "Feature" },
                { value: "chore",   label: "Chore" },
              ],
            },
          ]}
        />
      </Group>
    </Section>
  )
}

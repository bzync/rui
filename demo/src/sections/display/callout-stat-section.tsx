import { Callout, Stat } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"
import { IconBarChart, IconDeploy, IconLayers } from "../../_shared/icons"

export function CalloutSection() {
  return (
    <Section
      id="callout"
      title="Callout"
      description="Inline contextual note with 5 semantic variants, optional title, and custom icon."
      importPath='import { Callout } from "@bzync/rui"'
      meta={["5 variants", "title slot", "custom icon"]}
    >
      <Group label="Variants" col>
        <Callout variant="info" title="Info">Your project is on a free trial. Add a payment method to enable custom domains.</Callout>
        <Callout variant="success" title="Deployed">api-gateway v2.4.1 deployed successfully with zero downtime.</Callout>
        <Callout variant="warning" title="Approaching limit">You&apos;ve used 92% of your monthly build minutes. Consider upgrading.</Callout>
        <Callout variant="error" title="Build failed">Docker image exceeds the 4 GB limit. Optimize your Dockerfile and try again.</Callout>
        <Callout variant="default">This feature is in beta. Behaviour may change before general availability.</Callout>
      </Group>
    </Section>
  )
}

export function StatSection() {
  return (
    <Section
      id="stat"
      title="Stat"
      description="Metric card with value, unit, trend indicator (up/down/neutral), and icon slot."
      importPath='import { Stat } from "@bzync/rui"'
      meta={["trend indicator", "icon slot", "unit"]}
    >
      <Group label="Platform metrics" col>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
          <Stat label="Requests" value="1.2M" trend="up" trendValue="+14%" description="vs last month" icon={<IconBarChart />} />
          <Stat label="Latency" value="38" unit="ms" trend="down" trendValue="−4ms" description="p99" icon={<IconLayers />} />
          <Stat label="Uptime" value="99.98" unit="%" trend="neutral" trendValue="no change" />
          <Stat label="Active deploys" value="12" trend="up" trendValue="+3" description="today" icon={<IconDeploy />} />
        </div>
      </Group>
    </Section>
  )
}

import { FunnelChart, RadarChart, WaterfallChart } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function RadarChartSection() {
  return (
    <Section
      id="radarchart"
      title="RadarChart"
      description="Spider / radar chart for comparing multi-dimensional metrics across series."
      importPath='import { RadarChart } from "@bzync/rui"'
      meta={["multi-series", "hover tooltip", "grid rings"]}
    >
      <Group label="Service health comparison">
        <RadarChart
          axes={["Uptime", "Throughput", "Latency", "Error rate", "Saturation", "Availability"]}
          series={[
            { label: "API",    color: "#3b82f6", data: [92, 78, 85, 95, 70, 88] },
            { label: "Worker", color: "#10b981", data: [88, 65, 72, 90, 60, 82] },
          ]}
        />
      </Group>
    </Section>
  )
}

export function FunnelChartSection() {
  return (
    <Section
      id="funnelchart"
      title="FunnelChart"
      description="Funnel chart for conversion / drop-off visualisation with tooltips and drop-off percentage."
      importPath='import { FunnelChart } from "@bzync/rui"'
      meta={["hover tooltip", "drop-off %", "custom colors"]}
    >
      <Group label="Deployment pipeline" col>
        <FunnelChart
          height={200}
          formatValue={(v) => `${v}`}
          data={[
            { label: "Triggered",  value: 1200 },
            { label: "Built",      value: 1140 },
            { label: "Pushed",     value: 1080 },
            { label: "Deployed",   value: 1020 },
            { label: "Healthy",    value: 960 },
          ]}
        />
      </Group>
    </Section>
  )
}

export function WaterfallChartSection() {
  return (
    <Section
      id="waterfallchart"
      title="WaterfallChart"
      description="Waterfall / bridge chart showing cumulative effect of sequential positive and negative values."
      importPath='import { WaterfallChart } from "@bzync/rui"'
      meta={["animated", "hover tooltip", "total bar"]}
    >
      <Group label="Monthly cost breakdown" col>
        <WaterfallChart
          height={200}
          formatValue={(v) => `$${Math.abs(v)}`}
          data={[
            { label: "Base",     value: 200 },
            { label: "Compute",  value: 120 },
            { label: "Storage",  value: 45 },
            { label: "Transfer", value: 30 },
            { label: "Discount", value: -60 },
            { label: "Credits",  value: -25 },
            { label: "Total",    value: 0, total: true },
          ]}
        />
      </Group>
    </Section>
  )
}

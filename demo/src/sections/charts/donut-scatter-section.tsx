import { DonutChart, ScatterChart } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function DonutChartSection() {
  return (
    <Section
      id="donutchart"
      title="DonutChart"
      description="Animated donut / pie chart with hover highlights, tooltip, and legend."
      importPath='import { DonutChart } from "@bzync/rui"'
      meta={["animated", "hover highlight", "legend", "center slot"]}
    >
      <Group label="Traffic by region">
        <DonutChart
          data={[
            { label: "US East",    value: 42 },
            { label: "EU West",    value: 28 },
            { label: "AP South",   value: 18 },
            { label: "US West",    value: 8 },
            { label: "SA East",    value: 4 },
          ]}
          centerLabel={
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900 dark:text-white">100%</p>
              <p className="text-[10px] text-slate-500">traffic</p>
            </div>
          }
        />
      </Group>
      <Group label="Build status breakdown">
        <DonutChart
          size={140}
          thickness={22}
          data={[
            { label: "Success", value: 78, color: "#10b981" },
            { label: "Failed",  value: 14, color: "#f43f5e" },
            { label: "Pending", value: 8,  color: "#f59e0b" },
          ]}
          centerLabel={
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900 dark:text-white">78%</p>
              <p className="text-[10px] text-slate-500">success</p>
            </div>
          }
        />
      </Group>
    </Section>
  )
}

export function ScatterChartSection() {
  return (
    <Section
      id="scatterchart"
      title="ScatterChart"
      description="Scatter plot with multi-series support, hover tooltips, and variable dot sizing."
      importPath='import { ScatterChart } from "@bzync/rui"'
      meta={["multi-series", "variable dot size", "hover tooltip"]}
    >
      <Group label="Latency vs throughput" col>
        <ScatterChart
          height={220}
          formatX={(v) => `${v}ms`}
          formatY={(v) => `${v}rps`}
          xLabel="Latency (ms)"
          series={[
            {
              label: "API",
              color: "#3b82f6",
              data: [
                { x: 12, y: 420, label: "GET /users" },
                { x: 28, y: 280, label: "POST /auth" },
                { x: 8,  y: 640, label: "GET /health" },
                { x: 45, y: 110, label: "POST /deploy" },
                { x: 19, y: 350, label: "GET /projects" },
                { x: 62, y: 80,  label: "DELETE /job", r: 1.5 },
              ],
            },
            {
              label: "Worker",
              color: "#10b981",
              data: [
                { x: 90, y: 60,  label: "build:docker", r: 1.8 },
                { x: 55, y: 140, label: "push:registry" },
                { x: 38, y: 210, label: "run:container" },
                { x: 110, y: 30, label: "build:npm", r: 2 },
              ],
            },
          ]}
        />
      </Group>
    </Section>
  )
}

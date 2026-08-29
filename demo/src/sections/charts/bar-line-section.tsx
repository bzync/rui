import { BarChart, LineChart, MultiLineChart } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function BarChartSection() {
  return (
    <Section
      id="barchart"
      title="BarChart"
      description="Animated vertical bar chart with hover tooltips, gridlines, and per-bar color support."
      importPath='import { BarChart } from "@bzync/rui"'
      meta={["animated", "hover tooltip", "custom colors"]}
    >
      <Group label="Requests by service" col>
        <BarChart
          height={200}
          formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
          data={[
            { label: "api-gw",   value: 1200, color: "var(--chart-1)" },
            { label: "auth",     value: 980,  color: "var(--chart-1)" },
            { label: "cdn",      value: 4100, color: "var(--chart-2)" },
            { label: "worker",   value: 310,  color: "var(--chart-1)" },
            { label: "mdb",      value: 220,  color: "var(--chart-1)" },
            { label: "mail",     value: 12,   color: "var(--chart-3)" },
            { label: "sched",    value: 45,   color: "var(--chart-1)" },
          ]}
        />
      </Group>
      <Group label="Deploys per day (with per-bar colors)" col>
        <BarChart
          height={160}
          showValues
          data={[
            { label: "Mon", value: 4 },
            { label: "Tue", value: 7 },
            { label: "Wed", value: 3, color: "var(--chart-3)" },
            { label: "Thu", value: 9 },
            { label: "Fri", value: 12 },
            { label: "Sat", value: 2, color: "var(--chart-4)" },
            { label: "Sun", value: 1, color: "var(--chart-4)" },
          ]}
        />
      </Group>
      <Group label="Requests by service (horizontal)" col>
        <BarChart
          orientation="horizontal"
          showValues
          formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
          data={[
            { label: "api-gw",  value: 1200, color: "var(--chart-1)" },
            { label: "auth",    value: 980,  color: "var(--chart-1)" },
            { label: "cdn",     value: 4100, color: "var(--chart-2)" },
            { label: "worker",  value: 310,  color: "var(--chart-1)" },
            { label: "mdb",     value: 220,  color: "var(--chart-1)" },
            { label: "mail",    value: 12,   color: "var(--chart-3)" },
          ]}
        />
      </Group>
    </Section>
  )
}

export function LineChartSection() {
  return (
    <Section
      id="linechart"
      title="LineChart"
      description="Animated line / area chart with smooth curves, hover dots, and multi-series support."
      importPath='import { LineChart, MultiLineChart } from "@bzync/rui"'
      meta={["animated", "smooth curves", "area fill", "multi-series"]}
    >
      <Group label="Request volume (30 days)" col>
        <LineChart
          height={200}
          color="var(--chart-1)"
          formatValue={(v) => `${(v / 1000).toFixed(1)}K`}
          data={[
            { label: "Jun 1",  value: 820 },
            { label: "Jun 5",  value: 940 },
            { label: "Jun 10", value: 1100 },
            { label: "Jun 15", value: 980 },
            { label: "Jun 20", value: 1340 },
            { label: "Jun 25", value: 1180 },
            { label: "Jun 30", value: 1520 },
          ]}
        />
      </Group>
      <Group label="Multi-series: CPU + Memory" col>
        <MultiLineChart
          height={200}
          labels={["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h"]}
          formatValue={(v) => `${v}%`}
          series={[
            { label: "CPU",    color: "var(--chart-1)", data: [28, 42, 38, 55, 61, 48, 52, 44] },
            { label: "Memory", color: "var(--chart-2)", data: [55, 58, 62, 65, 63, 68, 70, 66] },
          ]}
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-xs text-slate-500">CPU</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-xs text-slate-500">Memory</span></div>
        </div>
      </Group>
    </Section>
  )
}

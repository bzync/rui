import { GanttChart, HeatmapChart } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function GanttChartSection() {
  return (
    <Section
      id="ganttchart"
      title="GanttChart"
      description="Horizontal timeline bar chart for scheduling and project planning."
      importPath='import { GanttChart } from "@bzync/rui"'
      meta={["animated", "hover tooltip", "CSS transitions"]}
    >
      <Group label="Sprint timeline" col>
        <GanttChart
          xLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          tasks={[
            { id: "t1", label: "API design",      start: 0, end: 2, color: "var(--chart-1)" },
            { id: "t2", label: "DB schema",       start: 0, end: 3, color: "var(--chart-2)" },
            { id: "t3", label: "Frontend scaff.", start: 1, end: 4, color: "var(--chart-5)" },
            { id: "t4", label: "Auth service",    start: 2, end: 5, color: "var(--chart-3)" },
            { id: "t5", label: "Integration",     start: 4, end: 6, color: "var(--chart-4)" },
            { id: "t6", label: "Deploy",          start: 6, end: 7, color: "#06b6d4" },
          ]}
        />
      </Group>
    </Section>
  )
}

export function HeatmapChartSection() {
  return (
    <Section
      id="heatmapchart"
      title="HeatmapChart"
      description="2-D grid heatmap with per-cell color intensity, row/column labels, and tooltips."
      importPath='import { HeatmapChart } from "@bzync/rui"'
      meta={["hover tooltip", "row/col labels", "custom color"]}
    >
      <Group label="Requests by hour × day">
        <HeatmapChart
          color="var(--chart-1)"
          rowLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          colLabels={["0h", "3h", "6h", "9h", "12h", "15h", "18h", "21h"]}
          data={[
            [12, 8,  4,  22, 48, 55, 40, 18],
            [10, 6,  3,  28, 52, 60, 44, 20],
            [14, 9,  5,  30, 50, 58, 42, 22],
            [11, 7,  4,  25, 46, 53, 38, 16],
            [13, 8,  3,  27, 51, 62, 47, 21],
            [5,  3,  2,  10, 18, 22, 15, 8],
            [4,  2,  1,  8,  14, 18, 12, 6],
          ]}
        />
      </Group>
    </Section>
  )
}

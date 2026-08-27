import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { BarChart, DonutChart, FunnelChart, GanttChart, HeatmapChart, LineChart, MultiLineChart, RadarChart, ScatterChart, WaterfallChart } from "@/index"

const data = [{ label: "Jan", value: 10 }, { label: "Feb", value: 20 }]

describe("chart components", () => {
  it.each([
    ["bar", <BarChart data={data} showValues />], ["line", <LineChart data={data} />],
    ["donut", <DonutChart data={data} centerLabel="Total" />], ["funnel", <FunnelChart data={data} />],
    ["gantt", <GanttChart tasks={[{ id: "1", label: "Build", start: 0, end: 5 }]} />],
    ["heatmap", <HeatmapChart data={[[1, 2]]} rowLabels={["Mon"]} colLabels={["AM", "PM"]} />],
    ["multi-line", <MultiLineChart labels={["Jan", "Feb"]} series={[{ label: "API", data: [1, 2] }]} />],
    ["radar", <RadarChart axes={["Speed", "Cost", "Scale"]} series={[{ label: "API", data: [1, 2, 3] }]} />],
    ["scatter", <ScatterChart series={[{ label: "API", data: [{ x: 1, y: 2, label: "Point" }] }]} />],
    ["waterfall", <WaterfallChart data={[{ label: "Start", value: 10 }, { label: "Cost", value: -2 }]} />],
  ])("renders the %s chart", (_name, chart) => {
    const { container } = render(<div data-testid="chart">{chart}</div>)
    expect(screen.getByTestId("chart")).toBeInTheDocument()
    expect(container.querySelector("svg, [role], div > div")).toBeTruthy()
  })

  it("renders heatmap cells with the default theme color token", () => {
    const { container } = render(<HeatmapChart data={[[1, 2]]} />)
    const cells = container.querySelectorAll<HTMLElement>("[data-heatmap-cell]")

    expect(cells).toHaveLength(2)
    expect(cells[0].style.backgroundColor).toBe("var(--color-accent-500)")
    expect(cells[0].style.opacity).toBe("0.08")
    expect(cells[1].style.opacity).toBe("0.96")
  })
})

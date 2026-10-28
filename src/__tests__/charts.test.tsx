import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as R from "@/index"
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
    expect(cells[0].style.backgroundColor).toBe("var(--chart-1)")
    expect(cells[0].style.opacity).toBe("0.08")
    expect(cells[1].style.opacity).toBe("0.96")
  })
})

describe("new charts", () => {
  const labels = ["Jan", "Feb", "Mar"]
  const series = [{ label: "Web", data: [10, 20, 30] }, { label: "Mobile", data: [5, 15, 25] }]

  it("AreaChart exposes a data table, legend and keyboard readout", async () => {
    const user = userEvent.setup()
    render(<R.AreaChart labels={labels} series={series} stacked ariaLabel="Signups by platform" />)
    const table = screen.getByRole("table", { name: "Signups by platform" })
    expect(within(table).getAllByRole("row")).toHaveLength(4)
    expect(screen.getByText("Mobile", { selector: "li" })).toBeInTheDocument()
    const plot = screen.getByRole("img", { name: /Signups by platform/ })
    await user.tab()
    expect(plot).toHaveFocus()
    expect(screen.getByText("Mar: Web 30, Mobile 25")).toBeInTheDocument()
    await user.keyboard("{Home}")
    expect(screen.getByText("Jan: Web 10, Mobile 5")).toBeInTheDocument()
  })

  it("StackedBarChart normalizes percent mode and reads columns", async () => {
    const user = userEvent.setup()
    render(<R.StackedBarChart labels={labels} series={series} mode="percent" ariaLabel="Share" />)
    expect(screen.getByText("100%")).toBeInTheDocument()
    await user.tab()
    expect(screen.getByText("Jan: Web 10, Mobile 5")).toBeInTheDocument()
    await user.keyboard("{ArrowRight}")
    expect(screen.getByText("Feb: Web 20, Mobile 15")).toBeInTheDocument()
  })

  it("Sparkline summarizes itself", () => {
    render(<R.Sparkline data={[3, 1, 4, 1, 5]} />)
    expect(screen.getByRole("img")).toHaveAccessibleName("Trend from 3 to 5; low 1, high 5.")
  })

  it("Gauge is a meter with threshold text", () => {
    render(<R.Gauge label="CPU" value={92} thresholds={[{ from: 0, tone: "success", label: "Healthy" }, { from: 80, tone: "danger", label: "Critical" }]} />)
    const meter = screen.getByRole("meter", { name: "CPU" })
    expect(meter).toHaveAttribute("aria-valuenow", "92")
    expect(meter).toHaveAttribute("aria-valuetext", "92 (Critical)")
    expect(R.niceTicks(0, 87)).toEqual([0, 25, 50, 75, 100])
  })

  it("spreads native root attributes, labels SVGs, and triggers tooltips on keyboard focus", async () => {
    const user = userEvent.setup()
    render(<BarChart id="revenue-chart" data-testid="rev-bar" ariaLabel="Monthly revenue" data={data} />)
    const root = screen.getByTestId("rev-bar")
    expect(root).toHaveAttribute("id", "revenue-chart")
    expect(screen.getByRole("img", { name: "Monthly revenue" })).toBeInTheDocument()

    await user.tab()
    expect(screen.getAllByText("Jan")).toHaveLength(2)
    expect(screen.getByText("10")).toBeInTheDocument()
  })
})

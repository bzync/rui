import { BarChartSection, LineChartSection } from "./charts/bar-line-section"
import { DonutChartSection, ScatterChartSection } from "./charts/donut-scatter-section"
import { GanttChartSection, HeatmapChartSection } from "./charts/gantt-heatmap-section"
import { RadarChartSection, FunnelChartSection, WaterfallChartSection } from "./charts/radar-funnel-waterfall-section"

export function ChartsSection() {
  return (
    <>
      <BarChartSection />
      <LineChartSection />
      <DonutChartSection />
      <ScatterChartSection />
      <GanttChartSection />
      <HeatmapChartSection />
      <RadarChartSection />
      <FunnelChartSection />
      <WaterfallChartSection />
    </>
  )
}

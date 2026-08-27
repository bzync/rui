import { useState } from "react"
import { Button } from "@bzync/rui"
import { Progressbar } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function ProgressbarSection() {
  const [progressValue, setProgressValue] = useState(65)

  return (
    <Section
      id="progressbar"
      title="Progressbar"
      description="Animated progress indicator with 5 variants, 4 sizes, indeterminate mode, step mode, and value label."
      importPath='import { Progressbar } from "@bzync/rui"'
      meta={["5 variants", "4 sizes", "indeterminate", "steps"]}
    >
      <Group label="Variants" col>
        <Progressbar value={72} variant="default" label="Default" showValue />
        <Progressbar value={85} variant="success" label="Success" showValue />
        <Progressbar value={48} variant="warning" label="Warning" showValue />
        <Progressbar value={23} variant="error"   label="Error"   showValue />
        <Progressbar value={60} variant="info"    label="Info"    showValue />
      </Group>
      <Group label="Sizes" col>
        <Progressbar value={progressValue} size="xs" label="XS" showValue />
        <Progressbar value={progressValue} size="sm" label="SM" showValue />
        <Progressbar value={progressValue} size="md" label="MD" showValue />
        <Progressbar value={progressValue} size="lg" label="LG" showValue />
        <div className="flex items-center gap-3">
          <Button size="sm" variant="secondary" onClick={() => setProgressValue((v) => Math.max(0, v - 10))}>−10</Button>
          <span className="text-xs text-slate-500 tabular-nums w-8 text-center">{progressValue}%</span>
          <Button size="sm" variant="secondary" onClick={() => setProgressValue((v) => Math.min(100, v + 10))}>+10</Button>
        </div>
      </Group>
      <Group label="Indeterminate">
        <div className="w-full max-w-sm">
          <Progressbar indeterminate label="Uploading…" />
        </div>
      </Group>
      <Group label="Steps" col>
        <Progressbar value={33} steps={3} label="Step 1 of 3" showValue />
        <Progressbar value={60} steps={5} variant="success" label="3 of 5 tasks complete" showValue />
        <Progressbar value={100} steps={4} variant="info" label="All steps complete" showValue />
      </Group>
    </Section>
  )
}

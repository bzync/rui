import { Button } from "@bzync/rui"
import {
  Skeleton,
  SkeletonCard,
  SkeletonRegion,
  SkeletonTable,
  SkeletonText,
} from "@bzync/rui"
import { Spinner } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function SpinnerSection() {
  return (
    <Section
      id="spinner"
      title="Spinner"
      description="Animated loading indicator in four sizes."
      importPath='import { Spinner } from "@bzync/rui"'
      meta={["4 sizes"]}
    >
      <Group label="Sizes">
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </Group>
      <Group label="In context">
        <Button loading>Loading</Button>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Spinner size="sm" /> Fetching deployments…
        </div>
      </Group>
    </Section>
  )
}

export function SkeletonSection() {
  return (
    <Section
      id="skeleton"
      title="Skeleton"
      description="Loading placeholders — base block, text lines, avatar, card, and table presets. Composite presets announce a busy status to screen readers; wrap a whole layout in SkeletonRegion and pass label={false} to the presets inside."
      importPath='import { Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonRegion } from "@bzync/rui"'
      meta={["5 presets", "status region"]}
    >
      <Group label="Base shapes">
        <Skeleton width={120} height={16} />
        <Skeleton width={80} height={80} rounded="lg" />
        <Skeleton width={40} height={40} rounded="full" />
        <Skeleton width={200} height={12} rounded="sm" />
      </Group>
      <Group label="Text" col>
        <div className="w-full max-w-sm"><SkeletonText lines={4} /></div>
      </Group>
      <Group label="Cards" col>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <SkeletonCard lines={3} hasAvatar hasFooter />
          <SkeletonCard lines={2} />
        </div>
      </Group>
      <Group label="Table" col>
        <SkeletonTable rows={4} cols={5} className="w-full" label="Loading deployments" />
      </Group>
      <Group label="One region for a layout" col>
        <SkeletonRegion label="Loading project" className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <SkeletonCard lines={2} label={false} />
          <SkeletonCard lines={2} label={false} />
        </SkeletonRegion>
      </Group>
    </Section>
  )
}

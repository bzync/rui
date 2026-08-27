import { Badge, Button, Link, Tooltip } from "@bzync/rui";
import { Section } from "../../_shared/section";
import { Group } from "../../_shared/group";

export function TooltipSection() {
  return (
    <Section
      id="tooltip"
      title="Tooltip"
      description="Hover tooltip with animated fade, four positions, and any content."
      importPath='import { Tooltip } from "@bzync/rui"'
      meta={["4 positions", "rich content"]}
    >
      <Group label="Positions">
        <Tooltip content="Tooltip on top" position="top">
          <Button variant="secondary" size="sm">
            Top
          </Button>
        </Tooltip>
        <Tooltip content="Tooltip on bottom" position="bottom">
          <Button variant="secondary" size="sm">
            Bottom
          </Button>
        </Tooltip>
        <Tooltip content="Tooltip on left" position="left">
          <Button variant="secondary" size="sm">
            Left
          </Button>
        </Tooltip>
        <Tooltip content="Tooltip on right" position="right">
          <Button variant="secondary" size="sm">
            Right
          </Button>
        </Tooltip>
      </Group>
      <Group label="With rich content">
        <Tooltip
          content={
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">●</span> us-east-1 · 12ms
            </span>
          }
        >
          <Badge variant="success" dot className="cursor-default">
            Running
          </Badge>
        </Tooltip>
        <Tooltip content="Click to copy token">
          <Button variant="ghost" size="sm">
            <span className="font-mono text-xs">sk_live_••••••••</span>
          </Button>
        </Tooltip>
      </Group>
    </Section>
  );
}

export function LinkSection() {
  return (
    <Section
      id="link"
      title="Link"
      description="Anchor element with default, muted, and underline variants. External links show an arrow icon automatically."
      importPath='import { Link } from "@bzync/rui"'
      meta={["3 variants", "external icon", "inline"]}
    >
      <Group label="Variants">
        <Link href="#">Default link</Link>
        <Link href="#" variant="muted">
          Muted link
        </Link>
        <Link href="#" variant="underline">
          Underline link
        </Link>
        <Link href="https://bzync.cloud" external>
          External link
        </Link>
      </Group>
      <Group label="Inline usage" col>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Deploy your app in seconds. Read the{" "}
          <Link href="#">getting started guide</Link> or check the{" "}
          <Link href="#" variant="muted">
            API reference
          </Link>
          .
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Need help? Visit our{" "}
          <Link href="https://bzync.cloud" external variant="underline">
            documentation site
          </Link>
          .
        </p>
      </Group>
    </Section>
  );
}

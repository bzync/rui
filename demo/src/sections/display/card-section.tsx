import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bzync/rui";
import { Section } from "../../_shared/section";
import { Group } from "../../_shared/group";
import { IconDeploy } from "../../_shared/icons";

export function CardSection() {
  return (
    <Section
      id="card"
      title="Card"
      description="Surface container with three variants and composable header / body / footer."
      importPath='import { Card, CardHeader, CardBody, CardFooter } from "@bzync/rui"'
      meta={["3 variants"]}
    >
      <Group label="Variants" col>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Default card</CardTitle>
              <CardDescription>Standard surface on navy-800</CardDescription>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-slate-400">
                Used for most content panels, settings sections, and dashboards.
              </p>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="secondary">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
            </CardFooter>
          </Card>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated card</CardTitle>
              <CardDescription>Higher surface with shadow</CardDescription>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-slate-400">
                Use for modals, popovers, or content that should visually float
                above the page.
              </p>
            </CardBody>
            <CardFooter>
              <Button size="sm">Learn more</Button>
            </CardFooter>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Bordered card</CardTitle>
              <CardDescription>Transparent with border</CardDescription>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-slate-400">
                Lightweight card for lists, pricing tiers, or subtle grouping.
              </p>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="outline">
                View details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Group>
      <Group label="Project card example">
        <Card className="w-full max-w-sm">
          <CardBody>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  api-gateway
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  us-east-1 · Node.js 20
                </p>
              </div>
              <Badge variant="success" dot>
                Running
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Requests", value: "1.2M" },
                { label: "Latency", value: "38ms" },
                { label: "Errors", value: "0.01%" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg bg-black/4 dark:bg-white/4 border border-black/8 dark:border-white/6 p-2.5"
                >
                  <p className="text-[11px] text-slate-500">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
          <CardFooter>
            <Button size="sm" variant="ghost" className="text-slate-500">
              Logs
            </Button>
            <Button size="sm" variant="ghost" className="text-slate-500">
              Settings
            </Button>
            <Button size="sm" icon={<IconDeploy />} className="ml-auto">
              Deploy
            </Button>
          </CardFooter>
        </Card>
      </Group>
    </Section>
  );
}

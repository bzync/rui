import { StatusDot } from "@bzync/rui";
import { Section } from "../../_shared/section";
import { Group } from "../../_shared/group";

export function StatusDotSection() {
  return (
    <Section
      id="statusdot"
      title="StatusDot"
      description="Color-coded status indicator with pulse animation for live and pending states."
      importPath='import { StatusDot } from "@bzync/rui"'
      meta={["6 statuses", "pulse animation", "label slot", "3 sizes"]}
    >
      <Group label="All statuses">
        <StatusDot status="online" label="Online" pulse />
        <StatusDot status="offline" label="Offline" />
        <StatusDot status="idle" label="Idle" />
        <StatusDot status="busy" label="Busy" />
        <StatusDot status="error" label="Error" />
        <StatusDot status="pending" label="Pending" pulse />
      </Group>
      <Group label="Sizes">
        <StatusDot status="online" size="sm" pulse />
        <StatusDot status="online" size="md" pulse />
        <StatusDot status="online" size="lg" pulse />
      </Group>
      <Group label="In context" col>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {[
            { name: "api-gateway", status: "online" as const },
            { name: "web-frontend", status: "pending" as const },
            { name: "worker-jobs", status: "offline" as const },
            { name: "db-proxy", status: "error" as const },
          ].map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between px-3 py-2 rounded-lg border border-black/[0.07] dark:border-white/[0.07] bg-black/2 dark:bg-white/2"
            >
              <span className="text-sm text-slate-700 dark:text-slate-200">
                {s.name}
              </span>
              <StatusDot
                status={s.status}
                pulse={s.status === "online" || s.status === "pending"}
              />
            </div>
          ))}
        </div>
      </Group>
    </Section>
  );
}

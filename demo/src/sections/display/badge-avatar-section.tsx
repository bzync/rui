import { Badge, Avatar, Tooltip } from "@bzync/rui";
import { Section } from "../../_shared/section";
import { Group } from "../../_shared/group";

export function BadgeSection() {
  return (
    <Section
      id="badge"
      title="Badge"
      description="Status labels with 6 semantic variants, 3 sizes, and optional dot indicator."
      importPath='import { Badge } from "@bzync/rui"'
      meta={["6 variants", "3 sizes", "dot indicator"]}
    >
      <Group label="Variants">
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="muted">Muted</Badge>
      </Group>
      <Group label="Sizes">
        <Badge variant="success" size="sm" dot>
          SM
        </Badge>
        <Badge variant="success" size="md" dot>
          MD
        </Badge>
        <Badge variant="success" size="lg" dot>
          LG
        </Badge>
      </Group>
      <Group label="With dot indicator">
        <Badge variant="success" dot>
          Running
        </Badge>
        <Badge variant="warning" dot>
          Pending
        </Badge>
        <Badge variant="error" dot>
          Failed
        </Badge>
        <Badge variant="muted" dot>
          Stopped
        </Badge>
      </Group>
    </Section>
  );
}

export function AvatarSection() {
  return (
    <Section
      id="avatar"
      title="Avatar"
      description="User avatar with fallback initials, deterministic color, and status dot."
      importPath='import { Avatar } from "@bzync/rui"'
      meta={["5 sizes", "4 statuses", "deterministic color"]}
    >
      <Group label="Sizes">
        <Avatar name="John Doe" size="xs" />
        <Avatar name="John Doe" size="sm" />
        <Avatar name="John Doe" size="md" />
        <Avatar name="John Doe" size="lg" />
        <Avatar name="John Doe" size="xl" />
      </Group>
      <Group label="With status">
        <Avatar name="Alice Chen" size="md" status="online" />
        <Avatar name="Bob Smith" size="md" status="away" />
        <Avatar name="Carol Lee" size="md" status="busy" />
        <Avatar name="Dave Kim" size="md" status="offline" />
      </Group>
      <Group label="Color variety">
        {[
          "Alice Chen",
          "Bob Smith",
          "Carol Lee",
          "Dave Kim",
          "Eve Torres",
          "Frank Wu",
          "Grace Park",
          "Hana Ito",
        ].map((name) => (
          <Tooltip key={name} content={name}>
            <Avatar name={name} size="md" />
          </Tooltip>
        ))}
      </Group>
      <Group label="Avatar stack">
        <div className="flex -space-x-2">
          {[
            "Alice Chen",
            "Bob Smith",
            "Carol Lee",
            "Dave Kim",
            "Eve Torres",
          ].map((name) => (
            <Avatar
              key={name}
              name={name}
              size="sm"
              className="ring-2 ring-white dark:ring-navy-950"
            />
          ))}
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/8 ring-2 ring-white dark:ring-navy-950 flex items-center justify-center text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            +8
          </div>
        </div>
      </Group>
    </Section>
  );
}

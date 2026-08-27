import { useState } from "react"
import { Button } from "@bzync/rui"
import { ConfirmDialog } from "@bzync/rui"
import { EmptyState } from "@bzync/rui"
import { ErrorState } from "@bzync/rui"
import { useSnackbar } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"
import { IconPlus, IconTrash } from "../../_shared/icons"

export function ConfirmDialogSection() {
  const [confirmDestructiveOpen, setConfirmDestructiveOpen] = useState(false)

  return (
    <Section
      id="confirmdialog"
      title="ConfirmDialog"
      description="Pre-built confirmation modal with cancel/confirm actions, loading state, and destructive variant."
      importPath='import { ConfirmDialog } from "@bzync/rui"'
      meta={["loading state", "destructive variant", "ESC to close"]}
    >
      <Group label="Demo">
        <Button variant="destructive" icon={<IconTrash />} onClick={() => setConfirmDestructiveOpen(true)}>
          Delete environment
        </Button>
        <ConfirmDialog
          open={confirmDestructiveOpen}
          onClose={() => setConfirmDestructiveOpen(false)}
          onConfirm={() => setConfirmDestructiveOpen(false)}
          title="Delete production environment?"
          description="This will permanently remove all containers, volumes, and environment variables. This action cannot be undone."
          confirmLabel="Delete forever"
          destructive
        />
      </Group>
    </Section>
  )
}

export function EmptyStateSection() {
  const { show } = useSnackbar()
  return (
    <Section
      id="emptystate"
      title="EmptyState"
      description="Zero-data placeholder with icon, title, description, and optional action. Three sizes."
      importPath='import { EmptyState } from "@bzync/rui"'
      meta={["sm · md · lg", "custom icon", "action slot"]}
    >
      <Group label="Sizes">
        <EmptyState size="sm" title="No logs yet" description="Logs will appear once a deployment starts." />
        <EmptyState size="md"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>}
          title="No projects yet"
          description="Create your first project to start deploying."
          action={<Button size="sm" icon={<IconPlus />} onClick={() => show({ message: "New project flow started", variant: "success" })}>New project</Button>}
        />
      </Group>
    </Section>
  )
}

export function ErrorStateSection() {
  const { show } = useSnackbar()
  const retry = () => show({ message: "Retrying request…", variant: "info" })
  return (
    <Section
      id="errorstate"
      title="ErrorState"
      description="Error display with title, description, raw error message, and retry button."
      importPath='import { ErrorState } from "@bzync/rui"'
      meta={["retry action", "raw error display"]}
    >
      <Group label="Examples" col>
        <div className="w-full max-w-md grid gap-4">
          <div className="rounded-xl border border-black/[0.07] dark:border-white/[0.07] overflow-hidden">
            <ErrorState onRetry={retry} />
          </div>
          <div className="rounded-xl border border-black/[0.07] dark:border-white/[0.07] overflow-hidden">
            <ErrorState
              title="Failed to fetch deployments"
              description="Could not reach the API. Check your network and try again."
              error={new Error("connect ECONNREFUSED 127.0.0.1:8082")}
              onRetry={retry}
            />
          </div>
        </div>
      </Group>
    </Section>
  )
}

import { useState } from "react"
import { Alert } from "@bzync/rui"
import { Button } from "@bzync/rui"
import { useSnackbar } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

// ─── Snackbar demo (needs hook, so must live inside SnackbarProvider) ─────────

function SnackbarDemo() {
  const { show, dismissAll } = useSnackbar()
  return (
    <Group label="Trigger toasts">
      <Button size="sm" onClick={() => show({ message: "Deployment queued and will start shortly.", variant: "info" })}>
        Info
      </Button>
      <Button size="sm" onClick={() => show({ message: "api-gateway v2.4.1 deployed successfully.", variant: "success" })}>
        Success
      </Button>
      <Button size="sm" onClick={() => show({ message: "Approaching 92% of monthly compute quota.", variant: "warning" })}>
        Warning
      </Button>
      <Button size="sm" onClick={() => show({ message: "Build failed — Docker image exceeds 4 GB limit.", variant: "error" })}>
        Error
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          show({
            message: "3 files deleted from project.",
            variant: "default",
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        With action
      </Button>
      <Button
        size="sm"
        onClick={() =>
          show({ message: "This toast stays until dismissed.", variant: "info", duration: 0 })
        }
      >
        Persistent
      </Button>
      <Button size="sm" variant="ghost" className="text-slate-500" onClick={dismissAll}>
        Dismiss all
      </Button>
    </Group>
  )
}

export function AlertSection() {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  return (
    <Section
      id="alert"
      title="Alert"
      description="Contextual feedback messages with 4 semantic variants, dismissable support, and slide-in animation."
      importPath='import { Alert } from "@bzync/rui"'
      meta={["4 variants", "dismissable", "custom icon"]}
    >
      <Group label="Variants" col>
        <Alert variant="info" title="Info">Your new deployment is queued and will start shortly.</Alert>
        <Alert variant="success" title="Deployed successfully">api-gateway v2.4.1 is live on us-east-1. Zero downtime rollout completed.</Alert>
        <Alert variant="warning" title="Approaching limit">You have used 92% of your monthly compute quota. Upgrade to avoid throttling.</Alert>
        <Alert variant="error" title="Deployment failed">Build failed at step 3 — Docker image exceeds the 4 GB size limit.</Alert>
      </Group>
      <Group label="Dismissable" col>
        {!dismissedAlerts.has("info") && (
          <Alert variant="info" title="Dismissable alert" dismissable onDismiss={() => setDismissedAlerts((s) => new Set([...s, "info"]))}>
            Click the × to dismiss this alert.
          </Alert>
        )}
        {dismissedAlerts.has("info") && (
          <div className="flex items-center gap-3">
            <p className="text-xs text-slate-600">Alert dismissed.</p>
            <Button variant="ghost" onClick={() => setDismissedAlerts((s) => { const n = new Set(s); n.delete("info"); return n })} className="h-auto w-auto p-0 text-xs text-blue-500 hover:text-blue-400 font-normal">Restore</Button>
          </div>
        )}
      </Group>
    </Section>
  )
}

export function SnackbarSection() {
  return (
    <Section
      id="snackbar"
      title="Snackbar / Toast"
      description="Animated toast notifications with 5 variants, 6 positions, action buttons, and auto-dismiss. Wrap your app in SnackbarProvider and call useSnackbar()."
      importPath='import { SnackbarProvider, useSnackbar } from "@bzync/rui"'
      meta={["5 variants", "6 positions", "action button", "auto-dismiss"]}
    >
      <SnackbarDemo />
    </Section>
  )
}

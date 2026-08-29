"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/cn"
import { Button } from "./button"
import { Modal } from "./modal"

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  icon?: ReactNode
  className?: string
  overlayClassName?: string
  panelClassName?: string
  contentClassName?: string
  actionsClassName?: string
  cancelButtonClassName?: string
  confirmButtonClassName?: string
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  icon,
  className,
  overlayClassName,
  panelClassName,
  contentClassName,
  actionsClassName,
  cancelButtonClassName,
  confirmButtonClassName,
}: ConfirmDialogProps) {
  const defaultIcon = destructive ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title={title}
      description={typeof description === "string" ? description : undefined}
      icon={icon ?? defaultIcon}
      className={className}
      overlayClassName={overlayClassName}
      panelClassName={panelClassName}
    >
      {typeof description !== "string" && description && (
        <div className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-400", contentClassName)}>{description}</div>
      )}
      <div className={cn("flex flex-wrap justify-end gap-2.5 pt-2", actionsClassName)}>
        <Button variant="ghost" onClick={onClose} disabled={loading} className={cancelButtonClassName}>
          {cancelLabel}
        </Button>
        <Button variant={destructive ? "destructive" : "primary"} onClick={onConfirm} loading={loading} autoFocus className={confirmButtonClassName}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

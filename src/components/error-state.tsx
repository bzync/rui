import { cn } from "@/lib/cn"
import { ReactNode } from "react"
import { Button } from "./button"

export interface ErrorStateProps {
  title?: string
  description?: string
  error?: string | Error
  onRetry?: () => void
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title = "This didn't load",
  description = "The request didn't finish. Try again — if it keeps failing, the problem is on our end, not yours.",
  error,
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  const message = error instanceof Error ? error.message : error

  return (
    <div role="alert" className={cn("flex flex-col items-center justify-center text-center px-4 py-10", className)}>
      <div className="mb-3 flex size-9 items-center justify-center text-destructive">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-5 text-muted-foreground">{description}</p>
      {message && (
        <p className="mt-3 max-w-sm break-all rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 font-mono text-xs text-destructive">
          {message}
        </p>
      )}
      {(onRetry || action) && (
        <div className="mt-5 flex items-center gap-3">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
                </svg>
              }
            >
              Try again
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  )
}

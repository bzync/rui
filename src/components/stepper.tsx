import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"

export interface StepperStep {
  label: string
  description?: string
  /** Prevents navigating to this step when steps are clickable. */
  disabled?: boolean
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  steps: StepperStep[]
  current: number
  orientation?: "horizontal" | "vertical"
  /** Makes steps clickable (e.g. to revisit completed steps); receives the step index. */
  onStepClick?: (index: number) => void
  /** Which steps are clickable when `onStepClick` is set. Defaults to completed steps. */
  clickable?: "completed" | "all"
  /** Disables every step's click target. */
  disabled?: boolean
  /** Styles each step item. */
  stepClassName?: string
  /** Styles the numbered circle. */
  indicatorClassName?: string
  /** Styles the step label. */
  labelClassName?: string
  /** Styles the connector line between steps. */
  connectorClassName?: string
}

const indicatorStyles = {
  done: "bg-primary border-primary text-primary-foreground",
  active: "border-accent-500 text-accent-strong bg-accent-500/10",
  upcoming: "border-border-strong text-muted-foreground",
} as const

const checkIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m20 6-11 11-5-5" />
  </svg>
)

export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper({
  steps,
  current,
  orientation = "horizontal",
  onStepClick,
  clickable = "completed",
  disabled = false,
  className,
  stepClassName,
  indicatorClassName,
  labelClassName,
  connectorClassName,
  ...props
}, ref) {
  const vertical = orientation === "vertical"

  return (
    <ol
      ref={ref}
      aria-orientation={orientation}
      className={cn(vertical ? "flex flex-col" : "flex min-w-0 items-start overflow-x-auto", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "active" : "upcoming"
        const isLast = i === steps.length - 1
        const interactive = Boolean(onStepClick) && !disabled && !step.disabled && i !== current && (clickable === "all" || state === "done")
        const status = state === "done" ? "completed" : state === "active" ? "current" : "upcoming"

        const indicator = (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
              indicatorStyles[state],
              indicatorClassName,
            )}
          >
            {state === "done" ? checkIcon : i + 1}
          </span>
        )
        const text = (
          <span className={cn("flex min-w-0 flex-col", vertical ? "pb-6 pt-1.5" : "mt-2 items-center px-1 text-center")}>
            <span className={cn(vertical ? "text-sm leading-none" : "text-xs", "font-medium", state === "active" ? "text-foreground" : "text-muted-foreground", labelClassName)}>
              {step.label}
              <span className="sr-only">{`, ${status}`}</span>
            </span>
            {step.description && <span className={cn("mt-1 text-muted-foreground", vertical ? "text-xs" : "text-[11px]")}>{step.description}</span>}
          </span>
        )
        const connector = !isLast && (
          <span
            aria-hidden="true"
            className={cn(
              "rounded-full transition-colors",
              vertical ? "my-1 min-h-8 w-0.5 flex-1" : "mx-2 h-0.5 flex-1",
              state === "done" ? "bg-primary" : "bg-border",
              connectorClassName,
            )}
          />
        )
        const body = vertical ? (
          <span className="flex gap-3">
            <span className="flex flex-col items-center">{indicator}{connector}</span>
            {text}
          </span>
        ) : (
          <span className="flex flex-col items-center">
            <span className="flex w-full items-center">{indicator}{connector}</span>
            {text}
          </span>
        )

        return (
          <li
            key={i}
            aria-current={state === "active" ? "step" : undefined}
            className={cn(vertical ? "" : "min-w-0 flex-1", stepClassName)}
          >
            {interactive ? (
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                className={cn("w-full rounded-[var(--radius-md)] text-left", vertical ? "" : "text-center", focusRingStyles, "[&:hover_.rounded-full]:border-accent-500")}
              >
                {body}
              </button>
            ) : body}
          </li>
        )
      })}
    </ol>
  )
})
Stepper.displayName = "Stepper"

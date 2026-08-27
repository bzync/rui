import { cn } from "@/lib/cn"

export interface StepperStep {
  label: string
  description?: string
}

export interface StepperProps {
  steps: StepperStep[]
  current: number
  orientation?: "horizontal" | "vertical"
  className?: string
}

export function Stepper({ steps, current, orientation = "horizontal", className }: StepperProps) {
  return (
    <div
      className={cn(
        orientation === "vertical"
          ? "flex flex-col gap-0"
          : "flex items-start gap-0 min-w-0 overflow-x-auto",
        className,
      )}
    >
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        const isLast = i === steps.length - 1

        return (
          <div
            key={i}
            className={cn(
              orientation === "vertical" ? "flex gap-3" : "flex flex-col items-center flex-1",
            )}
          >
            {orientation === "horizontal" ? (
              <>
                <div className="flex items-center w-full">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold border-2 transition-colors",
                      done
                        ? "bg-primary border-primary text-primary-foreground"
                        : active
                        ? "border-accent-500 text-accent-400 bg-accent-500/10"
                        : "border-black/15 dark:border-white/15 text-slate-500",
                    )}
                  >
                    {done ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m20 6-11 11-5-5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  {!isLast && (
                    <div className={cn("flex-1 h-0.5 mx-2 rounded-full transition-colors", done ? "bg-primary" : "bg-border")} />
                  )}
                </div>
                <div className="mt-2 text-center px-1">
                  <p className={cn("text-xs font-medium", active ? "text-gray-900 dark:text-white" : "text-slate-500")}>{step.label}</p>
                  {step.description && <p className="text-[10px] text-slate-500 mt-0.5">{step.description}</p>}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold border-2 transition-colors",
                      done
                        ? "bg-primary border-primary text-primary-foreground"
                        : active
                        ? "border-accent-500 text-accent-400 bg-accent-500/10"
                        : "border-black/15 dark:border-white/15 text-slate-500",
                    )}
                  >
                    {done ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m20 6-11 11-5-5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  {!isLast && (
                    <div className={cn("w-0.5 flex-1 min-h-8 my-1 rounded-full", done ? "bg-primary" : "bg-border")} />
                  )}
                </div>
                <div className="pb-6">
                  <p className={cn("text-sm font-medium leading-none mt-1.5", active ? "text-gray-900 dark:text-white" : "text-slate-500")}>{step.label}</p>
                  {step.description && <p className="text-xs text-slate-500 mt-1">{step.description}</p>}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

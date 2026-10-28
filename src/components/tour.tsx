"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { useControllableState } from "@/hooks/use-controllable-state"
import { useEventCallback } from "@/hooks/use-event-callback"
import { useFocusTrap, useRestoreFocus } from "@/hooks/use-focus-trap"
import { useHydrated } from "@/hooks/use-hydrated"
import { ThemePortal } from "./theme-provider"
import {
  type ForwardedRef,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

export type TourPlacement = "top" | "bottom" | "left" | "right" | "auto"

export interface TourStep {
  /** Target element selector, HTMLElement instance, or getter function. If null/not found, card is centered. */
  target?: string | HTMLElement | (() => HTMLElement | null) | null
  title: string
  content: ReactNode
  placement?: TourPlacement
  spotlightPadding?: number
  spotlightRadius?: number
  disableInteraction?: boolean
  action?: { label: string; onClick?: () => void }
}

export interface TourProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  steps: TourStep[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  onFinish?: () => void
  onSkip?: () => void
  mask?: boolean
  maskClosable?: boolean
  keyboard?: boolean
  nextLabel?: string
  prevLabel?: string
  finishLabel?: string
  skipLabel?: string
  showStepNumbers?: boolean
  ariaLabel?: string
  cardClassName?: string
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

function resolveTarget(target?: TourStep["target"]): HTMLElement | null {
  if (!target) return null
  if (typeof target === "string") return document.querySelector(target)
  if (typeof target === "function") return target()
  return target
}

const XIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

export const Tour = forwardRef<HTMLDivElement, TourProps>(function Tour(
  {
    steps,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    step: controlledStep,
    defaultStep = 0,
    onStepChange,
    onFinish,
    onSkip,
    mask = true,
    maskClosable = false,
    keyboard = true,
    nextLabel = "Next",
    prevLabel = "Back",
    finishLabel = "Finish",
    skipLabel = "Skip",
    showStepNumbers = true,
    ariaLabel = "Product tour",
    className,
    cardClassName,
    ...props
  },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [open, setOpen] = useControllableState<boolean>({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  const [currentStepIndex, setCurrentStepIndex] = useControllableState<number>({
    value: controlledStep,
    defaultValue: defaultStep,
    onChange: onStepChange,
  })

  const hydrated = useHydrated()
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const maskId = useId()
  const titleId = useId()
  const descId = useId()

  useRestoreFocus(open)
  useFocusTrap(cardRef, {
    active: open && hydrated,
    closeOnEscape: false,
    disableScrollLock: true,
  })

  const currentStep = steps[currentStepIndex]
  const isFirst = currentStepIndex === 0
  const isLast = currentStepIndex === steps.length - 1

  // Measure target element rect
  const updateRect = useEventCallback(() => {
    if (!open || !currentStep) {
      setTargetRect(null)
      return
    }

    const el = resolveTarget(currentStep.target)
    if (!el) {
      setTargetRect(null)
      return
    }

    const pad = currentStep.spotlightPadding ?? 8
    const r = el.getBoundingClientRect()
    setTargetRect({
      top: r.top - pad,
      left: r.left - pad,
      width: r.width + pad * 2,
      height: r.height + pad * 2,
    })
  })

  // Measure and scroll into view when step or open changes
  useEffect(() => {
    if (!open || !currentStep) return

    const el = resolveTarget(currentStep.target)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
    }

    updateRect()
    window.addEventListener("resize", updateRect)
    document.addEventListener("scroll", updateRect, true)
    return () => {
      window.removeEventListener("resize", updateRect)
      document.removeEventListener("scroll", updateRect, true)
    }
  }, [open, currentStepIndex, currentStep, updateRect])

  const handleClose = useEventCallback((skip = false) => {
    setOpen(false)
    if (skip) {
      onSkip?.()
    } else {
      onFinish?.()
    }
  })

  const handleNext = useEventCallback(() => {
    if (isLast) {
      handleClose(false)
    } else {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  })

  const handlePrev = useEventCallback(() => {
    if (!isFirst) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  })

  // Keyboard shortcuts
  useEffect(() => {
    if (!open || !keyboard) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        handleClose(true)
      } else if (e.key === "ArrowRight" && !isLast) {
        e.preventDefault()
        handleNext()
      } else if (e.key === "ArrowLeft" && !isFirst) {
        e.preventDefault()
        handlePrev()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, keyboard, isFirst, isLast, handleClose, handleNext, handlePrev])

  if (!hydrated || !open || !currentStep) return null

  const radius = currentStep.spotlightRadius ?? 8

  // Calculate card position
  let cardStyle: React.CSSProperties = {}
  if (targetRect) {
    const rawPlacement = currentStep.placement ?? "bottom"
    const gap = 12
    const measuredRect = cardRef.current?.getBoundingClientRect()
    const cardWidth = measuredRect?.width || 340
    const cardHeight = measuredRect?.height || 180
    const vw = typeof window !== "undefined" ? window.innerWidth : 1000
    const vh = typeof window !== "undefined" ? window.innerHeight : 800

    let placement: Exclude<TourPlacement, "auto"> = rawPlacement === "auto" ? "bottom" : rawPlacement
    if (rawPlacement === "auto") {
      const spaces: Array<{ side: Exclude<TourPlacement, "auto">; space: number }> = [
        { side: "bottom", space: vh - (targetRect.top + targetRect.height) },
        { side: "top", space: targetRect.top },
        { side: "right", space: vw - (targetRect.left + targetRect.width) },
        { side: "left", space: targetRect.left },
      ]
      spaces.sort((a, b) => b.space - a.space)
      placement = spaces[0].side
    }

    let top = targetRect.top + targetRect.height + gap
    let left = targetRect.left + targetRect.width / 2 - cardWidth / 2

    if (placement === "top") {
      top = targetRect.top - gap - cardHeight
    } else if (placement === "left") {
      left = targetRect.left - gap - cardWidth
      top = targetRect.top
    } else if (placement === "right") {
      left = targetRect.left + targetRect.width + gap
      top = targetRect.top
    }

    // Clamp inside viewport
    left = Math.max(16, Math.min(left, vw - cardWidth - 16))
    top = Math.max(16, Math.min(top, vh - cardHeight - 16))

    cardStyle = {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: "340px",
    }
  } else {
    // Center card
    cardStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "360px",
    }
  }

  return (
    <ThemePortal>
      <div
        ref={ref}
        role="presentation"
        className={cn("fixed inset-0 z-(--z-modal)", className)}
        {...props}
      >
        {/* Spotlight mask */}
        {mask && (
          <div
            className="fixed inset-0"
            onClick={maskClosable ? () => handleClose(true) : undefined}
          >
            {targetRect ? (
              <svg aria-hidden="true" className="h-full w-full pointer-events-none">
                <defs>
                  <mask id={maskId}>
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x={targetRect.left}
                      y={targetRect.top}
                      width={targetRect.width}
                      height={targetRect.height}
                      rx={radius}
                      ry={radius}
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="rgba(0, 0, 0, 0.55)"
                  mask={`url(#${maskId})`}
                  className="transition-all duration-300"
                />
                {/* Highlight outline ring */}
                <rect
                  x={targetRect.left}
                  y={targetRect.top}
                  width={targetRect.width}
                  height={targetRect.height}
                  rx={radius}
                  ry={radius}
                  fill="none"
                  stroke="var(--color-accent, #3b82f6)"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              </svg>
            ) : (
              <div className="h-full w-full bg-black/55 backdrop-blur-[1px]" />
            )}
          </div>
        )}

        {/* Step Dialog Card */}
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={titleId}
          aria-describedby={descId}
          style={cardStyle}
          className={cn(
            "z-(--z-popover) flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-foreground shadow-floating ring-1 ring-foreground/5 transition-all duration-200",
            cardClassName,
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2">
            {showStepNumbers && (
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-strong">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleClose(true)}
              aria-label={skipLabel}
              title={skipLabel}
              className={cn(
                "ml-auto flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground",
                focusRingStyles,
              )}
            >
              <XIcon />
            </button>
          </div>

          {/* Title & Content */}
          <h3 id={titleId} className="text-sm font-semibold text-foreground">
            {currentStep.title}
          </h3>
          <div id={descId} className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {currentStep.content}
          </div>

          {/* Optional custom step action */}
          {currentStep.action && (
            <div className="mt-3">
              <button
                type="button"
                onClick={currentStep.action.onClick}
                className={cn(
                  "inline-flex rounded border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-foreground/6",
                  focusRingStyles,
                )}
              >
                {currentStep.action.label}
              </button>
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            {/* Step dot indicators */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    i === currentStepIndex
                      ? "w-4 bg-accent"
                      : "w-1.5 bg-foreground/15",
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className={cn(
                    "rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-foreground/6",
                    focusRingStyles,
                  )}
                >
                  {prevLabel}
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className={cn(
                  "rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground shadow-xs transition-colors hover:opacity-90",
                  focusRingStyles,
                )}
              >
                {isLast ? finishLabel : nextLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ThemePortal>
  )
})

Tour.displayName = "Tour"

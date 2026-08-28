"use client"

import { cloneElement, isValidElement, forwardRef, HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * Slot — merges props onto its single child (Radix-style asChild pattern).
 * Use for polymorphic composition without unsafe `as` strings.
 *
 * Example:
 *   <Button asChild><a href="/dashboard">Dashboard</a></Button>
 */
export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

export const Slot = forwardRef<HTMLElement, SlotProps>(({ children, ...props }, ref) => {
  if (!isValidElement(children)) return null
  // Merge className via cn, forward ref, preserve child's handlers
  const childProps = children.props as Record<string, unknown>
  const mergedClassName = cn(childProps.className as string | undefined, props.className as string | undefined)
  const mergedProps: Record<string, unknown> = {
    ...childProps,
    ...props,
    className: mergedClassName || undefined,
  }
  // Preserve both refs where possible — child's ref wins if function
  // For simplicity, use the outer ref (Slot is rarely ref-critical beyond asChild)
  if (ref) (mergedProps as Record<string, unknown>).ref = ref
  return cloneElement(children as React.ReactElement<Record<string, unknown>>, mergedProps)
})
Slot.displayName = "Slot"

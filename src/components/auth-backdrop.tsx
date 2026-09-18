"use client"

import { cn } from "@/lib/cn"
import { forwardRef, type HTMLAttributes } from "react"

export interface AuthBackdropProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Flat, restrained backdrop for auth pages (login, register, forgot/reset
 * password, onboarding). Replaces the old per-page blurred-blob + dot-grid
 * treatment with a single flat tint — no gradient, no blur filters, no
 * mouse tracking, no glass.
 */
export const AuthBackdrop = forwardRef<HTMLDivElement, AuthBackdropProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 -z-10 bg-accent-500/[0.035]", className)}
      {...props}
    />
  )
})

AuthBackdrop.displayName = "AuthBackdrop"

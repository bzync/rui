"use client"

import { cn } from "@/lib/cn"
import { iconButtonStyles } from "@/lib/component-styles"
import { type ButtonHTMLAttributes, forwardRef } from "react"

export interface InfoButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  /** Describes the information that opens; used as the accessible button name. */
  label: string
}

export const InfoButton = forwardRef<HTMLButtonElement, InfoButtonProps>(({ label, className, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(iconButtonStyles, className)}
      aria-label={label}
      {...props}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
      </svg>
    </button>
  )
})

InfoButton.displayName = "InfoButton"

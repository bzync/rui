"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { Moon, Sun } from "lucide-react"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { useTheme } from "./theme-provider"

export interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  lightIcon?: ReactNode
  darkIcon?: ReactNode
  showLabel?: boolean
  lightLabel?: string
  darkLabel?: string
}

export function ThemeToggle({
  lightIcon = <Sun aria-hidden="true" />,
  darkIcon = <Moon aria-hidden="true" />,
  showLabel = false,
  lightLabel = "Use light theme",
  darkLabel = "Use dark theme",
  className,
  onClick,
  type = "button",
  ...props
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const label = isDark ? lightLabel : darkLabel

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      data-theme={resolvedTheme}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm font-medium text-foreground shadow-xs transition-colors",
        "hover:border-border-strong hover:bg-surface-muted",
        focusRingStyles,
        !showLabel && "w-9 px-0 [&_svg]:size-4",
        showLabel && "[&_svg]:size-4",
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) toggleTheme()
      }}
      {...props}
    >
      <span aria-hidden="true">{isDark ? lightIcon : darkIcon}</span>
      {showLabel && <span>{label}</span>}
    </button>
  )
}

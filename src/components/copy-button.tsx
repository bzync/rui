"use client"

import { cn } from "@/lib/cn"
import { AnimatePresence, motion } from "framer-motion"
import { ButtonHTMLAttributes, useState } from "react"

export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  value: string
  timeout?: number
  label?: string
  size?: "sm" | "md"
}

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m20 6-11 11-5-5" />
  </svg>
)

export function CopyButton({ value, timeout = 2000, label, size = "sm", className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    } catch {
      // clipboard not available
    }
  }

  const sizeClass = size === "sm"
    ? "h-6 px-2 text-xs gap-1 rounded-[var(--radius-md)]"
    : "h-8 px-3 text-sm gap-1.5 rounded-[var(--radius-lg)]"

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label ? undefined : copied ? "Copied to clipboard" : "Copy to clipboard"}
      className={cn(
        "focus-ring inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium select-none border",
        "transition-[color,background-color,border-color] duration-150",
        copied
          ? "border-success/25 bg-success/10 text-success dark:text-emerald-400"
          : "border-border bg-muted text-muted-foreground hover:bg-surface-muted hover:text-foreground",
        sizeClass,
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="check" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.1 }} className="inline-flex items-center gap-1 whitespace-nowrap">
            <CheckIcon />
            {label && "Copied"}
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.1 }} className="inline-flex items-center gap-1 whitespace-nowrap">
            <CopyIcon />
            {label && label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

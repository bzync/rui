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
    ? "h-6 px-2 text-xs gap-1 rounded-md"
    : "h-8 px-3 text-sm gap-1.5 rounded-lg"

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium transition-colors select-none",
        "border border-black/10 dark:border-white/10",
        copied
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-black/4 dark:bg-white/4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/8 dark:hover:bg-white/8",
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

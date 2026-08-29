"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles, focusRingStyles } from "@/lib/component-styles"
import { AnimatePresence, motion } from "framer-motion"
import { DragEvent, InputHTMLAttributes, forwardRef, useId, useRef, useState } from "react"

export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  hint?: string
  error?: string
  accept?: string
  maxSizeMB?: number
  onFilesChange?: (files: File[]) => void
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      label,
      hint,
      error,
      accept,
      maxSizeMB,
      onFilesChange,
      disabled,
      multiple,
      id,
      ...props
    },
    ref,
  ) => {
    const [dragging, setDragging] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [sizeError, setSizeError] = useState("")
    const inputRef = useRef<HTMLInputElement | null>(null)
    const uid = useId()
    const inputId = id ?? uid
    const messageId = `${inputId}-message`

    const maxSizeLabel = maxSizeMB && (maxSizeMB >= 1024 ? `${maxSizeMB / 1024}GB` : `${maxSizeMB}MB`)

    function processFiles(incoming: FileList | null) {
      if (!incoming) return
      const arr = Array.from(incoming)
      if (maxSizeMB) {
        const tooBig = arr.find((f) => f.size > maxSizeMB * 1024 * 1024)
        if (tooBig) {
          setSizeError(`${tooBig.name} exceeds ${maxSizeLabel}`)
          return
        }
      }
      setSizeError("")
      const next = multiple ? [...files, ...arr] : arr
      setFiles(next)
      onFilesChange?.(next)
    }

    function removeFile(idx: number) {
      const next = files.filter((_, i) => i !== idx)
      setFiles(next)
      onFilesChange?.(next)
    }

    function onDrop(e: DragEvent) {
      e.preventDefault()
      setDragging(false)
      if (disabled) return
      processFiles(e.dataTransfer.files)
    }

    const displayError = error ?? sizeError

    return (
      <div className={cn(fieldRootStyles, className)}>
        {label && (
          <label htmlFor={inputId} className={fieldLabelStyles}>{label}</label>
        )}
        <label
          htmlFor={inputId}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-dashed px-4 py-7 text-center cursor-pointer transition-colors focus-within:ring-[3px] focus-within:ring-focus-ring/25",
            dragging
              ? "border-accent-500/60 bg-accent-500/6"
              : displayError
              ? "border-red-500/40 bg-red-500/4"
              : "border-border-strong bg-surface-muted/50 hover:border-accent-500/60 hover:bg-muted",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          )}
        >
          <input
            ref={(el) => {
              inputRef.current = el
              if (typeof ref === "function") ref(el)
              else if (ref) ref.current = el
            }}
            type="file"
            id={inputId}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            aria-invalid={displayError ? true : undefined}
            aria-describedby={displayError || hint ? messageId : undefined}
            className="sr-only"
            onChange={(e) => processFiles(e.target.files)}
            {...props}
          />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop files here or <span className="text-accent-700 dark:text-accent-300">browse</span>
            </p>
            {(accept || maxSizeMB) && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {[accept && `Accepts ${accept}`, maxSizeLabel && `Max ${maxSizeLabel}`].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </label>
        <AnimatePresence initial={false}>
          {files.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-1 overflow-hidden"
            >
              {files.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface-muted px-3 py-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="min-w-0 flex-1 truncate text-xs text-foreground">{file.name}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {(file.size / 1024).toFixed(0)}KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label={`Remove ${file.name}`}
                    className={cn("shrink-0 rounded-sm text-muted-foreground hover:text-destructive transition-colors", focusRingStyles)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        {displayError && <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{displayError}</p>}
        {hint && !displayError && <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>}
      </div>
    )
  },
)

FileUpload.displayName = "FileUpload"

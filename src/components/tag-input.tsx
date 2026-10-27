"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, controlSizeStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles, type ControlSize } from "@/lib/component-styles"
import { useControllableState } from "@/hooks/use-controllable-state"
import { type ClipboardEvent, type HTMLAttributes, type KeyboardEvent, forwardRef, useId, useRef, useState } from "react"

export interface TagInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Controlled tags. */
  value?: string[]
  /** Initial tags when uncontrolled. */
  defaultValue?: string[]
  onChange?: (tags: string[]) => void
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  /** Keys that commit the typed text as a tag. Default Enter and comma. */
  separators?: string[]
  /** Return a message to reject a tag (e.g. not an email), or nothing to accept it. */
  validate?: (tag: string) => string | void | undefined
  /** Normalizes a tag before it is added (e.g. lowercase). */
  transform?: (tag: string) => string
  allowDuplicates?: boolean
  maxTags?: number
  /** Submits one `name=value` entry per tag with a native form. */
  name?: string
  size?: ControlSize
  onBlur?: () => void
}

const DEFAULT_SEPARATORS = ["Enter", ","]
const NO_TAGS: string[] = []

export const TagInput = forwardRef<HTMLDivElement, TagInputProps>(function TagInput({
  value,
  defaultValue = NO_TAGS,
  onChange,
  label,
  hint,
  error,
  placeholder = "Add…",
  disabled,
  separators = DEFAULT_SEPARATORS,
  validate,
  transform = (tag) => tag,
  allowDuplicates = false,
  maxTags,
  name,
  size = "md",
  onBlur,
  className,
  ...props
}, ref) {
  const [tags, setTags] = useControllableState({ value, defaultValue, onChange })
  const [text, setText] = useState("")
  const [rejection, setRejection] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const inputId = `${id}-input`
  const messageId = `${id}-message`
  const full = maxTags !== undefined && tags.length >= maxTags
  const message = error ?? rejection ?? undefined

  /** Adds candidates in order; returns the text that could not be added. */
  function commit(candidates: string[]): string {
    let next = tags
    const rejected: string[] = []
    let reason: string | null = null
    for (const raw of candidates) {
      const tag = transform(raw.trim())
      if (!tag) continue
      if (maxTags !== undefined && next.length >= maxTags) { rejected.push(raw); reason = `You can add up to ${maxTags}.`; continue }
      if (!allowDuplicates && next.some((existing) => existing.toLowerCase() === tag.toLowerCase())) { reason = `“${tag}” is already added.`; continue }
      const invalid = validate?.(tag)
      if (invalid) { rejected.push(raw); reason = invalid; continue }
      next = [...next, tag]
    }
    if (next !== tags) setTags(next)
    setRejection(reason)
    return rejected.join(", ")
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (separators.includes(event.key)) {
      if (!text.trim()) return
      event.preventDefault()
      setText(commit([text]))
    } else if (event.key === "Backspace" && !text && tags.length) {
      setTags(tags.slice(0, -1))
      setRejection(null)
    }
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text")
    if (!/[,;\n]/.test(pasted)) return
    event.preventDefault()
    setText(commit(pasted.split(/[,;\n]+/)))
  }

  const remove = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
    setRejection(null)
    inputRef.current?.focus()
  }

  return (
    <div ref={ref} className={cn(fieldRootStyles, className)} {...props}>
      {label && <label htmlFor={inputId} className={fieldLabelStyles}>{label}</label>}
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex w-full cursor-text flex-wrap items-center gap-1.5 rounded-[var(--radius-md)] px-2 py-1",
          controlSizeStyles[size].minHeight,
          controlBaseStyles,
          message && controlInvalidStyles,
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <ul aria-label={label ? `${label} values` : "Values"} className="contents">
          {tags.map((tag, index) => (
            <li key={`${tag}-${index}`} className="inline-flex max-w-full items-center gap-1 rounded-md border border-border bg-surface-muted py-0.5 pl-2 pr-1 text-xs font-medium text-foreground">
              <span className="truncate">{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={(event) => { event.stopPropagation(); remove(index) }}
                  className="grid size-4 shrink-0 place-items-center rounded-sm text-muted-foreground hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50"
                >
                  <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              )}
            </li>
          ))}
        </ul>
        <input
          ref={inputRef}
          id={inputId}
          value={text}
          disabled={disabled || full}
          placeholder={full ? `Limit of ${maxTags} reached` : tags.length ? "" : placeholder}
          aria-invalid={message ? true : undefined}
          aria-describedby={message || hint ? messageId : undefined}
          onChange={(event) => { setText(event.target.value); if (rejection) setRejection(null) }}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={() => { if (text.trim()) setText(commit([text])); onBlur?.() }}
          className={cn("min-w-[6rem] flex-1 bg-transparent py-0.5 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed", controlSizeStyles[size].text)}
        />
      </div>
      {name && tags.map((tag, index) => <input key={`${tag}-${index}`} type="hidden" name={name} value={tag} />)}
      {message && <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{message}</p>}
      {hint && !message && <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>}
    </div>
  )
})
TagInput.displayName = "TagInput"

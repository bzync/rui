"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles } from "@/lib/component-styles"
import { ReactNode, forwardRef, useCallback, useEffect, useId, useRef, useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  /** Controlled HTML. Changes are written into the editor. */
  value?: string
  /** Initial HTML when uncontrolled; applied once on mount. */
  defaultValue?: string
  onChange?: (html: string) => void
  onValueChange?: (html: string) => void
  label?: ReactNode
  hint?: ReactNode
  error?: string
  id?: string
  name?: string
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  className?: string
  minHeight?: number
  /** Sanitize HTML before rendering to prevent XSS when value comes from untrusted sources. Pass a custom function to override. */
  sanitize?: boolean | ((html: string) => string)
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolBtn({
  onClick,
  title,
  active,
  disabled,
  children,
}: {
  onClick: () => void
  title: string
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault()
        if (!disabled) onClick()
      }}
      className={cn(
        "h-7 w-7 flex items-center justify-center rounded-md text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        active
          ? "bg-foreground/12 text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-foreground/7",
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-border mx-0.5" />
}

// Attributes whose values are URLs and can therefore carry a dangerous scheme.
const URL_ATTRS = new Set([
  "href", "src", "xlink:href", "action", "formaction",
  "poster", "background", "cite", "data", "ping", "srcset",
])
// Schemes we allow in URL-bearing attributes. Everything else (javascript:,
// data:, vbscript:, etc.) is stripped.
const SAFE_SCHEMES = new Set(["http", "https", "mailto", "tel", "ftp", "sms"])

function hasUnsafeScheme(value: string): boolean {
  // Browsers ignore leading/embedded C0 control chars and whitespace when
  // resolving a scheme (e.g. "java\tscript:", "\u0000javascript:"), so remove
  // them all before testing rather than a single trim().
  const normalized = value.replace(/[\u0000-\u0020\u007f-\u00a0]/g, "").toLowerCase()
  const match = /^([a-z][a-z0-9+.-]*):/.exec(normalized)
  if (!match) return false // relative URL, fragment, or query — safe
  return !SAFE_SCHEMES.has(match[1])
}

function defaultSanitize(html: string): string {
  if (typeof document === "undefined") return html
  const template = document.createElement("template")
  template.innerHTML = html
  const blockTags = template.content.querySelectorAll(
    "script, style, iframe, object, embed, link, meta, base, form",
  )
  blockTags.forEach((el) => el.remove())
  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT)
  while (walker.nextNode()) {
    const el = walker.currentNode as Element
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase()
      // Event handlers (onclick, onerror, …) and any namespaced-on* variants.
      if (name.startsWith("on")) {
        el.removeAttribute(attr.name)
        continue
      }
      if (URL_ATTRS.has(name) && hasUnsafeScheme(attr.value)) {
        el.removeAttribute(attr.name)
      }
    }
  }
  return template.innerHTML
}

function sanitizeHtml(html: string, sanitize?: boolean | ((html: string) => string)): string {
  if (!sanitize) return html
  if (typeof sanitize === "function") return sanitize(html)
  return defaultSanitize(html)
}

// ─── RichTextEditor ───────────────────────────────────────────────────────────

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(function RichTextEditor({
  value,
  defaultValue = "",
  onChange,
  onValueChange,
  label,
  hint,
  error,
  id: externalId,
  name,
  disabled = false,
  readOnly = false,
  placeholder = "Start typing…",
  className,
  minHeight = 160,
  sanitize = false,
}, ref) {
  const uid = useId()
  const id = externalId ?? uid
  const hasError = Boolean(error)
  const errorId = hasError ? `${id}-error` : undefined
  const hintId = hint && !hasError ? `${id}-hint` : undefined
  const describedBy = errorId ?? hintId
  const editorRef = useRef<HTMLDivElement>(null)
  const lastHtml = useRef(value ?? defaultValue)
  const seeded = useRef(false)
  const [currentHtml, setCurrentHtml] = useState(() => sanitize ? sanitizeHtml(value ?? defaultValue, sanitize) : (value ?? defaultValue))
  const [hasContent, setHasContent] = useState(() => Boolean((value ?? defaultValue ?? "").replace(/<[^>]*>/g, "").trim()))

  useEffect(() => {
    // Uncontrolled: seed defaultValue once, then the DOM owns the content.
    if (value === undefined && seeded.current) return
    seeded.current = true
    const safe = sanitizeHtml(value ?? defaultValue, sanitize)
    if (editorRef.current && editorRef.current.innerHTML !== safe) {
      editorRef.current.innerHTML = safe
      lastHtml.current = safe
    }
    setCurrentHtml(safe)
    setHasContent(Boolean(safe.replace(/<[^>]*>/g, "").trim()))
  }, [value, defaultValue, sanitize])

  const emitChange = useCallback(() => {
    const raw = editorRef.current?.innerHTML ?? ""
    const html = sanitize ? sanitizeHtml(raw, sanitize) : raw
    setHasContent(Boolean(html.replace(/<[^>]*>/g, "").trim()))
    if (html !== lastHtml.current) {
      lastHtml.current = html
      setCurrentHtml(html)
      onChange?.(html)
      onValueChange?.(html)
    }
  }, [onChange, onValueChange, sanitize])

  function exec(cmd: string, val?: string) {
    if (disabled || readOnly) return
    try {
      // execCommand is deprecated but still the most interoperable for contentEditable without heavy deps.
      // Wrapped to allow future migration to Selection API.
      document.execCommand(cmd, false, val)
    } catch {
      // no-op: command not supported in this browser
    }
    editorRef.current?.focus()
    emitChange()
  }

  function queryActive(cmd: string) {
    try { return document.queryCommandState(cmd) } catch { return false }
  }

  const toolbarDisabled = disabled || readOnly

  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label id={`${id}-label`} className={fieldLabelStyles}>{label}</label>
      )}
      {name && (
        <input type="hidden" name={name} value={currentHtml} disabled={disabled} />
      )}
      <div
        className={cn(
          "rounded-xl overflow-hidden border bg-surface transition-[border-color,box-shadow]",
          hasError
            ? "border-danger/60 focus-within:border-danger focus-within:ring-[3px] focus-within:ring-danger/25"
            : "border-border hover:border-border-strong focus-within:border-accent-500 focus-within:ring-[3px] focus-within:ring-focus-ring/25",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-border bg-surface-muted">
          <ToolBtn title="Bold (⌘B)" disabled={toolbarDisabled} onClick={() => exec("bold")} active={queryActive("bold")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Italic (⌘I)" disabled={toolbarDisabled} onClick={() => exec("italic")} active={queryActive("italic")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Underline (⌘U)" disabled={toolbarDisabled} onClick={() => exec("underline")} active={queryActive("underline")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" y1="20" x2="20" y2="20" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Strikethrough" disabled={toolbarDisabled} onClick={() => exec("strikeThrough")} active={queryActive("strikeThrough")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" />
            </svg>
          </ToolBtn>

          <Divider />

          <ToolBtn title="Heading 1" disabled={toolbarDisabled} onClick={() => exec("formatBlock", "<h1>")}>
            <span className="text-[11px] font-bold">H1</span>
          </ToolBtn>
          <ToolBtn title="Heading 2" disabled={toolbarDisabled} onClick={() => exec("formatBlock", "<h2>")}>
            <span className="text-[11px] font-bold">H2</span>
          </ToolBtn>
          <ToolBtn title="Paragraph" disabled={toolbarDisabled} onClick={() => exec("formatBlock", "<p>")}>
            <span className="text-[11px] font-medium">P</span>
          </ToolBtn>

          <Divider />

          <ToolBtn title="Bullet list" disabled={toolbarDisabled} onClick={() => exec("insertUnorderedList")} active={queryActive("insertUnorderedList")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
              <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Ordered list" disabled={toolbarDisabled} onClick={() => exec("insertOrderedList")} active={queryActive("insertOrderedList")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
              <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Blockquote" disabled={toolbarDisabled} onClick={() => exec("formatBlock", "<blockquote>")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
          </ToolBtn>

          <Divider />

          <ToolBtn title="Undo (⌘Z)" disabled={toolbarDisabled} onClick={() => exec("undo")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Redo (⌘⇧Z)" disabled={toolbarDisabled} onClick={() => exec("redo")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Clear formatting" disabled={toolbarDisabled} onClick={() => exec("removeFormat")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7V4h16v3" /><path d="M5 20h6" /><path d="M13 4 8 20" /><line x1="3" y1="3" x2="21" y2="21" />
            </svg>
          </ToolBtn>
        </div>

        {/* Editable area */}
        <div className="relative">
          <div
            ref={editorRef}
            role="textbox"
            aria-multiline="true"
            aria-labelledby={label ? `${id}-label` : undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            aria-disabled={disabled || undefined}
            aria-readonly={readOnly || undefined}
            contentEditable={!disabled && !readOnly}
            suppressContentEditableWarning
            onInput={emitChange}
            onBlur={emitChange}
            style={{ minHeight }}
            className={cn(
              "px-4 py-3 text-sm text-foreground focus:outline-none",
              "prose prose-sm max-w-none",
              "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:text-foreground",
              "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-1.5 [&_h2]:text-foreground",
              "[&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2",
              "[&_blockquote]:border-l-2 [&_blockquote]:border-accent-400 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
            )}
          />
          {!hasContent && (
            <div
              className="pointer-events-none absolute top-3 left-4 text-sm text-muted-foreground/70 select-none"
              aria-hidden
            >
              {placeholder}
            </div>
          )}
        </div>
      </div>
      {error && <p id={errorId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
      {hint && !error && <p id={hintId} className={fieldDescriptionStyles}>{hint}</p>}
    </div>
  )
})
RichTextEditor.displayName = "RichTextEditor"

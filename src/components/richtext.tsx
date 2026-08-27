"use client"

import { cn } from "@/lib/cn"
import { useRef, useEffect, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
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
  children,
}: {
  onClick: () => void
  title: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={cn(
        "h-7 w-7 flex items-center justify-center rounded-md text-sm transition-colors",
        active
          ? "bg-black/10 dark:bg-white/15 text-gray-900 dark:text-white"
          : "text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/6 dark:hover:bg-white/8",
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-0.5" />
}

function defaultSanitize(html: string): string {
  if (typeof document === "undefined") return html
  const template = document.createElement("template")
  template.innerHTML = html
  // Remove script, style with dangerous content, event handlers, javascript: URLs
  const blockTags = template.content.querySelectorAll("script, style, iframe, object, embed, link, meta")
  blockTags.forEach((el) => el.remove())
  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT)
  const toStrip: Element[] = []
  while (walker.nextNode()) {
    const el = walker.currentNode as Element
    // strip event handlers and javascript: href/src
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase()
      const val = attr.value.trim().toLowerCase()
      if (name.startsWith("on") || val.startsWith("javascript:")) {
        el.removeAttribute(attr.name)
      }
    }
  }
  // Also sanitize template HTML string for remaining dangerous patterns via regex as fallback
  let out = template.innerHTML
  // ensure no leftover on* survived
  out = out.replace(/\son\w+\s*=\s*(['"])[^'"]*\1/gi, "")
  return out
}

function sanitizeHtml(html: string, sanitize?: boolean | ((html: string) => string)): string {
  if (!sanitize) return html
  if (typeof sanitize === "function") return sanitize(html)
  return defaultSanitize(html)
}

// ─── RichTextEditor ───────────────────────────────────────────────────────────

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing…",
  className,
  minHeight = 160,
  sanitize = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const lastHtml = useRef(value)

  useEffect(() => {
    const safe = sanitizeHtml(value, sanitize)
    if (editorRef.current && editorRef.current.innerHTML !== safe) {
      editorRef.current.innerHTML = safe
      lastHtml.current = safe
    }
  }, [value, sanitize])

  const emit = useCallback(() => {
    const raw = editorRef.current?.innerHTML ?? ""
    const html = sanitize ? sanitizeHtml(raw, sanitize) : raw
    if (html !== lastHtml.current) {
      lastHtml.current = html
      onChange?.(html)
    }
  }, [onChange, sanitize])

  function exec(cmd: string, val?: string) {
    try {
      // execCommand is deprecated but still the most interoperable for contentEditable without heavy deps.
      // Wrapped to allow future migration to Selection API.
      document.execCommand(cmd, false, val)
    } catch {
      // no-op: command not supported in this browser
    }
    editorRef.current?.focus()
    emit()
  }

  function queryActive(cmd: string) {
    try { return document.queryCommandState(cmd) } catch { return false }
  }

  return (
    <div className={cn("rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-navy-900 focus-within:ring-1 focus-within:ring-blue-500/40 focus-within:border-accent-500/30 transition-all", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/2 dark:bg-white/2">
        <ToolBtn title="Bold (⌘B)" onClick={() => exec("bold")} active={queryActive("bold")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
          </svg>
        </ToolBtn>
        <ToolBtn title="Italic (⌘I)" onClick={() => exec("italic")} active={queryActive("italic")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
          </svg>
        </ToolBtn>
        <ToolBtn title="Underline (⌘U)" onClick={() => exec("underline")} active={queryActive("underline")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" y1="20" x2="20" y2="20" />
          </svg>
        </ToolBtn>
        <ToolBtn title="Strikethrough" onClick={() => exec("strikeThrough")} active={queryActive("strikeThrough")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        </ToolBtn>

        <Divider />

        <ToolBtn title="Heading 1" onClick={() => exec("formatBlock", "<h1>")}>
          <span className="text-[11px] font-bold">H1</span>
        </ToolBtn>
        <ToolBtn title="Heading 2" onClick={() => exec("formatBlock", "<h2>")}>
          <span className="text-[11px] font-bold">H2</span>
        </ToolBtn>
        <ToolBtn title="Paragraph" onClick={() => exec("formatBlock", "<p>")}>
          <span className="text-[11px] font-medium">P</span>
        </ToolBtn>

        <Divider />

        <ToolBtn title="Bullet list" onClick={() => exec("insertUnorderedList")} active={queryActive("insertUnorderedList")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </ToolBtn>
        <ToolBtn title="Ordered list" onClick={() => exec("insertOrderedList")} active={queryActive("insertOrderedList")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </ToolBtn>
        <ToolBtn title="Blockquote" onClick={() => exec("formatBlock", "<blockquote>")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
          </svg>
        </ToolBtn>

        <Divider />

        <ToolBtn title="Undo (⌘Z)" onClick={() => exec("undo")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </ToolBtn>
        <ToolBtn title="Redo (⌘⇧Z)" onClick={() => exec("redo")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
          </svg>
        </ToolBtn>
        <ToolBtn title="Clear formatting" onClick={() => exec("removeFormat")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7V4h16v3" /><path d="M5 20h6" /><path d="M13 4 8 20" /><line x1="3" y1="3" x2="21" y2="21" />
          </svg>
        </ToolBtn>
      </div>

      {/* Editable area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          style={{ minHeight }}
          className={cn(
            "px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none",
            "prose prose-sm max-w-none",
            "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:text-gray-900 dark:[&_h1]:text-white",
            "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-1.5 [&_h2]:text-gray-900 dark:[&_h2]:text-white",
            "[&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2",
            "[&_blockquote]:border-l-2 [&_blockquote]:border-accent-400 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
          )}
        />
        {!value && (
          <div
            className="pointer-events-none absolute top-3 left-4 text-sm text-slate-400 dark:text-slate-600 select-none"
            aria-hidden
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}

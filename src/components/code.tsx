"use client"

import { cn } from "@/lib/cn"
import { HTMLAttributes, KeyboardEvent, forwardRef, useRef, useState } from "react"

// ─── Tokeniser ────────────────────────────────────────────────────────────────

type TokenType = "keyword" | "string" | "comment" | "number" | "operator" | "builtin" | "plain"

interface Token { type: TokenType; value: string }

const KEYWORDS: Record<string, string[]> = {
  js: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export", "default", "from", "async", "await", "new", "typeof", "instanceof", "true", "false", "null", "undefined", "throw", "try", "catch", "finally", "switch", "case", "break", "continue", "extends", "super", "this", "of", "in", "delete", "void"],
  python: ["def", "return", "if", "else", "elif", "for", "while", "class", "import", "from", "as", "with", "try", "except", "finally", "raise", "pass", "break", "continue", "and", "or", "not", "in", "is", "True", "False", "None", "lambda", "yield", "global", "nonlocal", "del", "print", "async", "await"],
  bash: ["if", "then", "else", "elif", "fi", "for", "do", "done", "while", "case", "esac", "in", "function", "return", "exit", "echo", "export", "source", "local", "readonly"],
  sql: ["SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DROP", "ALTER", "INDEX", "JOIN", "INNER", "LEFT", "RIGHT", "ON", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET", "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN", "NULL", "IS", "IN", "LIKE", "BETWEEN", "EXISTS"],
}

KEYWORDS.ts = KEYWORDS.js
KEYWORDS.tsx = KEYWORDS.js
KEYWORDS.jsx = KEYWORDS.js
KEYWORDS.json = []

function tokenize(code: string, lang: string): Token[] {
  const keywords = new Set(KEYWORDS[lang.toLowerCase()] ?? KEYWORDS.js)
  const tokens: Token[] = []
  let i = 0

  while (i < code.length) {
    // Single-line comment
    if ((lang === "bash" && code[i] === "#") || (code.slice(i, i + 2) === "//" && lang !== "bash")) {
      const end = code.indexOf("\n", i)
      const val = end === -1 ? code.slice(i) : code.slice(i, end)
      tokens.push({ type: "comment", value: val })
      i += val.length
      continue
    }
    // Multi-line comment /* ... */
    if (code.slice(i, i + 2) === "/*") {
      const end = code.indexOf("*/", i + 2)
      const val = end === -1 ? code.slice(i) : code.slice(i, end + 2)
      tokens.push({ type: "comment", value: val })
      i += val.length
      continue
    }
    // Python/SQL # comment
    if (code[i] === "#" && (lang === "python" || lang === "sql")) {
      const end = code.indexOf("\n", i)
      const val = end === -1 ? code.slice(i) : code.slice(i, end)
      tokens.push({ type: "comment", value: val })
      i += val.length
      continue
    }
    // String (single, double, backtick)
    if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
      const quote = code[i]
      let j = i + 1
      while (j < code.length) {
        if (code[j] === "\\" && j + 1 < code.length) { j += 2; continue }
        if (code[j] === quote) { j++; break }
        j++
      }
      tokens.push({ type: "string", value: code.slice(i, j) })
      i = j
      continue
    }
    // Number
    if (/[0-9]/.test(code[i]) || (code[i] === "." && /[0-9]/.test(code[i + 1] ?? ""))) {
      let j = i
      while (j < code.length && /[0-9._xXa-fA-F]/.test(code[j])) j++
      tokens.push({ type: "number", value: code.slice(i, j) })
      i = j
      continue
    }
    // Identifier / keyword
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++
      const word = code.slice(i, j)
      tokens.push({ type: keywords.has(word) ? "keyword" : "plain", value: word })
      i = j
      continue
    }
    // Operator
    if (/[=<>!&|+\-*/%^~?:,;.()[\]{}]/.test(code[i])) {
      tokens.push({ type: "operator", value: code[i] })
      i++
      continue
    }
    // Whitespace / other
    tokens.push({ type: "plain", value: code[i] })
    i++
  }
  return tokens
}

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword:  "text-violet-500 dark:text-violet-400",
  string:   "text-emerald-600 dark:text-emerald-400",
  comment:  "text-slate-400 dark:text-slate-500 italic",
  number:   "text-amber-600 dark:text-amber-400",
  operator: "text-slate-500 dark:text-slate-400",
  builtin:  "text-sky-500 dark:text-sky-400",
  plain:    "text-slate-800 dark:text-slate-200",
}

// ─── CodeBlock ────────────────────────────────────────────────────────────────

export interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeBlock({ code, language = "js", filename, showLineNumbers = false, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const trimmed = code.replace(/^\n/, "").replace(/\n$/, "")
  const lines = trimmed.split("\n")

  async function copy() {
    let didCopy = false
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable")
      await navigator.clipboard.writeText(trimmed)
      didCopy = true
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = trimmed
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      didCopy = document.execCommand("copy")
      textarea.remove()
    }
    if (didCopy) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className={cn("group relative rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-muted dark:bg-navy-900", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/3 dark:bg-white/3">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!filename && (
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase">{language}</span>
          )}
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied code" : "Copy code"}
            className="h-6 shrink-0 px-2 flex items-center gap-1 whitespace-nowrap rounded text-xs text-slate-500 dark:text-slate-400 hover:text-foreground hover:bg-black/6 dark:hover:bg-white/8 transition-colors"
          >
            {copied ? (
              <>
                <svg className="shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                Copied
              </>
            ) : (
              <>
                <svg className="shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm font-mono leading-6">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-black/3 dark:hover:bg-white/3">
                {showLineNumbers && (
                  <td className="select-none w-10 pr-4 pl-4 text-right text-slate-400 dark:text-slate-600 border-r border-black/6 dark:border-white/6">
                    {idx + 1}
                  </td>
                )}
                <td className="px-4 py-0 whitespace-pre">
                  {tokenize(line, language).map((tok, ti) => (
                    <span key={ti} className={TOKEN_COLORS[tok.type]}>{tok.value}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── InlineCode ───────────────────────────────────────────────────────────────

export interface InlineCodeProps extends HTMLAttributes<HTMLElement> {}

export const InlineCode = forwardRef<HTMLElement, InlineCodeProps>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn("break-words rounded-md border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground", className)}
    {...props}
  />
))
InlineCode.displayName = "InlineCode"

// ─── CodeEditor ───────────────────────────────────────────────────────────────

export interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  placeholder?: string
  minRows?: number
  maxRows?: number
  readOnly?: boolean
  className?: string
}

export function CodeEditor({
  value,
  onChange,
  language = "js",
  placeholder = "// Start typing…",
  minRows = 6,
  maxRows = 24,
  readOnly = false,
  className,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineCount = Math.min(maxRows, Math.max(minRows, value.split("\n").length))

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const ta = e.currentTarget
    const { selectionStart: ss, selectionEnd: se } = ta

    // Tab → 2 spaces
    if (e.key === "Tab") {
      e.preventDefault()
      const next = value.slice(0, ss) + "  " + value.slice(se)
      onChange?.(next)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = ss + 2
      })
    }

    // Enter → auto-indent
    if (e.key === "Enter") {
      const lineStart = value.lastIndexOf("\n", ss - 1) + 1
      const indent = value.slice(lineStart).match(/^(\s*)/)?.[1] ?? ""
      e.preventDefault()
      const next = value.slice(0, ss) + "\n" + indent + value.slice(se)
      onChange?.(next)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = ss + 1 + indent.length
      })
    }

    // Bracket/quote auto-pair
    const pairs: Record<string, string> = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'", "`": "`" }
    if (pairs[e.key] && ss === se) {
      e.preventDefault()
      const next = value.slice(0, ss) + e.key + pairs[e.key] + value.slice(se)
      onChange?.(next)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = ss + 1
      })
    }
  }

  return (
    <div className={cn("relative rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-muted dark:bg-navy-900", className)}>
      {/* Header */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/3 dark:bg-white/3">
        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase">{language}</span>
      </div>

      {/* Editor */}
      <div className="relative flex">
        {/* Line numbers */}
        <div className="select-none shrink-0 py-3 px-3 text-right text-sm font-mono leading-6 text-slate-400 dark:text-slate-600 border-r border-black/6 dark:border-white/6 bg-black/2 dark:bg-black/20" aria-hidden>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          rows={lineCount}
          className="flex-1 py-3 px-4 text-sm font-mono leading-6 bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none resize-none"
        />
      </div>
    </div>
  )
}

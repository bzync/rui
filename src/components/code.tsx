"use client"

import { cn } from "@/lib/cn"
import { HTMLAttributes, KeyboardEvent, forwardRef, useRef, useState } from "react"

// ─── Tokeniser ────────────────────────────────────────────────────────────────

type TokenType =
  | "keyword" | "string" | "comment" | "number" | "operator" | "builtin" | "plain"
  | "function" | "tag" | "attr" | "type" | "punctuation"

interface Token { type: TokenType; value: string }

const KEYWORDS: Record<string, string[]> = {
  js: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "class", "import", "export", "default", "from", "as", "async", "await", "new", "typeof", "instanceof", "true", "false", "null", "undefined", "throw", "try", "catch", "finally", "switch", "case", "break", "continue", "extends", "implements", "super", "this", "of", "in", "delete", "void", "yield", "static", "type", "interface", "enum", "keyof", "readonly", "satisfies", "declare", "namespace", "public", "private", "protected"],
  python: ["def", "return", "if", "else", "elif", "for", "while", "class", "import", "from", "as", "with", "try", "except", "finally", "raise", "pass", "break", "continue", "and", "or", "not", "in", "is", "True", "False", "None", "lambda", "yield", "global", "nonlocal", "del", "print", "async", "await"],
  bash: ["if", "then", "else", "elif", "fi", "for", "do", "done", "while", "case", "esac", "in", "function", "return", "exit", "echo", "export", "source", "local", "readonly"],
  sql: ["SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DROP", "ALTER", "INDEX", "JOIN", "INNER", "LEFT", "RIGHT", "ON", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET", "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN", "NULL", "IS", "IN", "LIKE", "BETWEEN", "EXISTS"],
}

KEYWORDS.ts = KEYWORDS.js
KEYWORDS.tsx = KEYWORDS.js
KEYWORDS.jsx = KEYWORDS.js
KEYWORDS.json = ["true", "false", "null"]

const JS_BUILTINS = new Set(["console", "window", "document", "navigator", "Math", "JSON", "Object", "Array", "String", "Number", "Boolean", "Promise", "Date", "Map", "Set", "Error", "Intl", "React", "string", "number", "boolean", "unknown", "never", "any"])
const JSX_LANGS = new Set(["js", "jsx", "ts", "tsx"])
// A `<` after one of these opens JSX; after an identifier, `)` or `]` it is a
// comparison or a generic (`useState<Date>()`).
const JSX_PRECEDERS = new Set(["", "(", ",", "=", "?", ":", "{", "[", "&&", "||", "??", "=>", "return", "default", ">", "}"])

const isIdentStart = (ch: string | undefined) => !!ch && /[A-Za-z_$]/.test(ch)
const isIdentPart = (ch: string | undefined) => !!ch && /[A-Za-z0-9_$]/.test(ch)

/**
 * Tokenises the whole snippet in one pass so multi-line strings, comments and
 * JSX keep their state across lines. JSX is tracked with a small context stack:
 * `tag` (inside `<Foo …>`), `children` (text between tags) and `expr` (a `{…}`
 * hole, which returns to whichever context opened it).
 */
function tokenize(code: string, lang: string): Token[] {
  const language = lang.toLowerCase()
  const keywords = new Set(KEYWORDS[language] ?? KEYWORDS.js)
  const jsx = JSX_LANGS.has(language)
  const lineComment = language === "bash" || language === "python" ? "#" : language === "sql" ? "--" : "//"
  const tokens: Token[] = []
  const stack: ("tag" | "children" | "expr")[] = []
  let lastSignificant = ""
  let i = 0

  const push = (type: TokenType, value: string) => {
    tokens.push({ type, value })
    if (value.trim() && type !== "comment") lastSignificant = type === "string" || type === "number" ? "value" : value
  }
  const top = () => stack[stack.length - 1]

  const readString = () => {
    const quote = code[i]
    let j = i + 1
    while (j < code.length) {
      if (code[j] === "\\" && j + 1 < code.length) { j += 2; continue }
      if (code[j] === quote) { j++; break }
      if (quote !== "`" && code[j] === "\n") break
      j++
    }
    push("string", code.slice(i, j))
    i = j
  }

  const readTagName = () => {
    let j = i
    while (j < code.length && /[A-Za-z0-9_$.:-]/.test(code[j])) j++
    const name = code.slice(i, j)
    push(/^[A-Z]|\./.test(name) ? "type" : "tag", name)
    i = j
  }

  // At `<` in a JSX position: emit an opening or closing tag head.
  const openTag = () => {
    if (code[i + 1] === "/") {
      push("punctuation", "</")
      i += 2
      readTagName()
      while (i < code.length && /\s/.test(code[i])) tokens.push({ type: "plain", value: code[i++] })
      if (code[i] === ">") { push("punctuation", ">"); i++ }
      if (top() === "children") stack.pop()
      return
    }
    push("punctuation", "<")
    i++
    if (code[i] === ">") { push("punctuation", ">"); i++; stack.push("children"); return }
    readTagName()
    stack.push("tag")
  }

  while (i < code.length) {
    const ch = code[i]
    const context = top()

    if (context === "children") {
      if (ch === "{") { push("punctuation", ch); i++; stack.push("expr"); continue }
      if (ch === "<") { openTag(); continue }
      let j = i
      while (j < code.length && code[j] !== "<" && code[j] !== "{") j++
      tokens.push({ type: "plain", value: code.slice(i, j) })
      i = j
      continue
    }

    if (context === "tag") {
      if (ch === "/" && code[i + 1] === ">") { push("punctuation", "/>"); i += 2; stack.pop(); continue }
      if (ch === ">") { push("punctuation", ">"); i++; stack.pop(); stack.push("children"); continue }
      if (ch === "{") { push("punctuation", ch); i++; stack.push("expr"); continue }
      if (ch === '"' || ch === "'") { readString(); continue }
      if (isIdentStart(ch)) {
        let j = i
        while (j < code.length && /[A-Za-z0-9_$:-]/.test(code[j])) j++
        push("attr", code.slice(i, j))
        i = j
        continue
      }
      if (/\s/.test(ch)) tokens.push({ type: "plain", value: ch })
      else push("punctuation", ch)
      i++
      continue
    }

    // JavaScript — top level, or inside a `{…}` expression hole.
    if (code.startsWith(lineComment, i)) {
      const end = code.indexOf("\n", i)
      push("comment", end === -1 ? code.slice(i) : code.slice(i, end))
      i = end === -1 ? code.length : end
      continue
    }
    if (code.startsWith("/*", i)) {
      const end = code.indexOf("*/", i + 2)
      push("comment", end === -1 ? code.slice(i) : code.slice(i, end + 2))
      i = end === -1 ? code.length : end + 2
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") { readString(); continue }
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(code[i + 1] ?? ""))) {
      let j = i
      while (j < code.length && /[0-9._xXa-fA-FnN]/.test(code[j])) j++
      push("number", code.slice(i, j))
      i = j
      continue
    }
    if (isIdentStart(ch)) {
      let j = i
      while (isIdentPart(code[j])) j++
      const word = code.slice(i, j)
      let k = j
      while (code[k] === " ") k++
      const afterDot = lastSignificant === "."
      const type: TokenType =
        keywords.has(word) && !afterDot ? "keyword"
        : code[k] === "(" || (jsx && code[k] === "<" && /^[a-z]/.test(word)) ? "function"
        : JS_BUILTINS.has(word) && !afterDot ? "builtin"
        : /^[A-Z]/.test(word) && language !== "sql" ? "type"
        : "plain"
      push(type, word)
      i = j
      continue
    }
    // Snippets often start a JSX block on its own line after a statement.
    const atLineStart = /(^|\n)[ \t]*$/.test(code.slice(Math.max(0, i - 80), i))
    if (jsx && ch === "<" && (isIdentStart(code[i + 1]) || code[i + 1] === ">") && (atLineStart || JSX_PRECEDERS.has(lastSignificant))) {
      openTag()
      continue
    }
    if (ch === "{" && context === "expr") { push("punctuation", ch); i++; stack.push("expr"); continue }
    if (ch === "}" && context === "expr") { push("punctuation", ch); i++; stack.pop(); continue }
    if (/[()[\]{},;.]/.test(ch)) { push("punctuation", ch); i++; continue }
    if (/[=<>!&|+\-*/%^~?:]/.test(ch)) {
      let j = i
      while (j < code.length && j - i < 3 && /[=<>!&|+\-*/%^~?:]/.test(code[j])) j++
      push("operator", code.slice(i, j))
      i = j
      continue
    }
    tokens.push({ type: "plain", value: ch })
    i++
  }
  return tokens
}

/** Splits a token stream into lines, breaking multi-line tokens at newlines. */
function tokenizeLines(code: string, lang: string): Token[][] {
  const lines: Token[][] = [[]]
  for (const token of tokenize(code, lang)) {
    token.value.split("\n").forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ type: token.type, value: part })
    })
  }
  return lines
}

// Mode-aware --color-code-* tokens (globals.css), one class per role.
const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: "text-code-keyword",
  string: "text-code-string",
  comment: "text-code-comment italic",
  number: "text-code-number",
  operator: "text-code-keyword",
  builtin: "text-code-number",
  plain: "text-code-plain",
  function: "text-code-function",
  tag: "text-code-tag",
  attr: "text-code-attr",
  type: "text-code-type",
  punctuation: "text-code-punctuation",
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
  const lines = tokenizeLines(trimmed, language)

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
    <div className={cn("group relative rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-sunken", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-foreground/[0.07] bg-foreground/3">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-xs font-mono text-muted-foreground">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!filename && (
            <span className="text-xs font-mono text-muted-foreground/70 uppercase">{language}</span>
          )}
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied code" : "Copy code"}
            className="h-6 shrink-0 px-2 flex items-center gap-1 whitespace-nowrap rounded text-xs text-muted-foreground hover:text-foreground hover:bg-foreground/7 transition-colors"
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
            {lines.map((tokens, idx) => (
              <tr key={idx} className="hover:bg-foreground/3">
                {showLineNumbers && (
                  <td className="select-none w-10 pr-4 pl-4 text-right text-muted-foreground/50 border-r border-foreground/6">
                    {idx + 1}
                  </td>
                )}
                <td className="px-4 py-0 whitespace-pre">
                  {tokens.length ? tokens.map((tok, ti) => (
                    <span key={ti} className={TOKEN_COLORS[tok.type]}>{tok.value}</span>
                  )) : "​"}
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
    <div className={cn("relative rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-sunken", className)}>
      {/* Header */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-foreground/[0.07] bg-foreground/3">
        <span className="text-xs font-mono text-muted-foreground/70 uppercase">{language}</span>
      </div>

      {/* Editor */}
      <div className="relative flex">
        {/* Line numbers */}
        <div className="select-none shrink-0 py-3 px-3 text-right text-sm font-mono leading-6 text-muted-foreground/50 border-r border-foreground/6 bg-foreground/2" aria-hidden>
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
          className="flex-1 py-3 px-4 text-sm font-mono leading-6 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none resize-none"
        />
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/cn"
import { useEffect, useRef, useState, KeyboardEvent } from "react"
import type { ShellState, Span } from "./types"
import { buildFS } from "./fs"
import { run, tabComplete, promptSpans } from "./shell-run"
import type { TerminalLine } from "./terminal-block"

export interface TerminalEmulatorProps {
  title?: string
  user?: string
  hostname?: string
  className?: string
  /** @deprecated use built-in shell — pass initialLines for welcome text */
  initialLines?: TerminalLine[]
}

interface RenderedLine { id: number; spans: Span[] }

export function TerminalEmulator({ title = "Terminal", user = "user", hostname = "ubuntu", className }: TerminalEmulatorProps) {
  const initState = (): ShellState => ({
    root: buildFS(),
    cwd: ["home", user],
    env: { HOME: `/home/${user}`, USER: user, SHELL: "/bin/bash", TERM: "xterm-256color", PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin", LANG: "en_US.UTF-8" },
    history: [],
    user,
    hostname,
    startTime: new Date(),
  })

  const [mounted, setMounted] = useState(false)
  const [shell, setShell] = useState<ShellState>(initState)
  const [output, setOutput] = useState<RenderedLine[]>([])
  const [input, setInput] = useState("")
  const [histIdx, setHistIdx] = useState(-1)
  const [completions, setCompletions] = useState<string[]>([])
  const [blink, setBlink] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const lineId = useRef(0)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { const id = setInterval(() => setBlink(b => !b), 530); return () => clearInterval(id) }, [])
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [output])

  function addLines(spans: Span[][]) {
    setOutput(prev => [...prev, ...spans.map(s => ({ id: lineId.current++, spans: s }))])
  }

  function submit() {
    const cmd = input.trim()
    setCompletions([])

    // Echo the prompt + command
    const promptLine = [...promptSpans(shell), { text: cmd }]
    addLines([promptLine])

    if (!cmd) { setInput(""); return }

    const { lines, next, clear } = run(shell, cmd)
    setShell(next)
    setHistIdx(-1)
    setInput("")

    if (clear) { setOutput([]); return }
    if (lines.length) addLines(lines.map(l => l.spans))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { submit(); return }

    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault()
      const promptLine = [...promptSpans(shell), { text: input }, { text: "^C", cls: "text-slate-500" }]
      addLines([promptLine])
      setInput(""); setHistIdx(-1); setCompletions([])
      return
    }

    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault(); setOutput([]); return
    }

    if (e.key === "u" && e.ctrlKey) {
      e.preventDefault(); setInput(""); return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      const next = Math.min(histIdx + 1, shell.history.length - 1)
      if (next >= 0) { setHistIdx(next); setInput(shell.history[shell.history.length - 1 - next] ?? "") }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = histIdx - 1
      if (next < 0) { setHistIdx(-1); setInput("") }
      else { setHistIdx(next); setInput(shell.history[shell.history.length - 1 - next] ?? "") }
      return
    }

    if (e.key === "Tab") {
      e.preventDefault()
      const { value, completions: c } = tabComplete(shell, input)
      setInput(value)
      setCompletions(c.length > 1 ? c : [])
      return
    }

    setCompletions([])
  }

  const ps = promptSpans(shell)

  if (!mounted) return (
    <div className={cn("rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0e1117] shadow-sm dark:shadow-xl dark:shadow-black/20 flex flex-col", className)}>
      <div className="flex items-center px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/3 dark:bg-white/[0.03] shrink-0">
        <span className="flex-1 text-center text-xs text-slate-500 font-medium">{title}</span>
      </div>
      <div className="flex-1 min-h-[200px] max-h-80" />
      <div className="px-4 py-3 border-t border-black/8 dark:border-white/6 shrink-0" />
    </div>
  )

  return (
    <div
      className={cn("rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0e1117] shadow-sm dark:shadow-xl dark:shadow-black/20 cursor-text flex flex-col", className)}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/3 dark:bg-white/[0.03] shrink-0">
        <span className="flex-1 text-center text-xs text-slate-500 font-medium">{title}</span>
      </div>

      {/* Output */}
      <div ref={outputRef} className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-6 min-h-[200px] max-h-80">
        {/* Welcome */}
        {output.length === 0 && (
          <div className="text-slate-400 dark:text-slate-500 mb-2 select-none">
            <div>Ubuntu 24.04.1 LTS — type <span className="text-sky-600 dark:text-sky-400">help</span> for available commands</div>
            <div className="h-2" />
          </div>
        )}

        {output.map(line => (
          <div key={line.id} className="whitespace-pre-wrap break-all">
            {line.spans.map((sp, i) => (
              <span key={i} className={sp.cls}>{sp.text}</span>
            ))}
          </div>
        ))}

        {/* Tab completions hint */}
        {completions.length > 0 && (
          <div className="flex flex-wrap gap-x-4 text-slate-500 dark:text-slate-500 mt-1">
            {completions.map(c => <span key={c}>{c}</span>)}
          </div>
        )}

      </div>

      {/* Input row */}
      <div className="px-4 py-3 border-t border-black/8 dark:border-white/6 flex items-center font-mono text-sm shrink-0">
        {ps.map((sp, i) => <span key={i} className={cn("whitespace-pre", sp.cls)}>{sp.text}</span>)}
        {/* Wrapper is flex-1 so clicks anywhere on the row focus the input */}
        <span className="relative flex-1 flex items-center min-w-0">
          {/* Invisible input captures all keyboard interaction */}
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full bg-transparent text-transparent focus:outline-none caret-transparent"
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
          />
          {/* Visible text + cursor sit inline so cursor follows the text */}
          <span className="whitespace-pre text-slate-800 dark:text-slate-100 pointer-events-none select-none">{input}</span>
          <span className={cn("inline-block h-[1.1em] w-[2px] bg-slate-700 dark:bg-slate-300 shrink-0", blink ? "opacity-100" : "opacity-0")} aria-hidden />
        </span>
      </div>
    </div>
  )
}

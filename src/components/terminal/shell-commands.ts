import type { CmdResult, FSEntry, OutLine, ShellState, Span } from "./types"
import { getEntry, getParent, mkdir, mkfile, pathParts, resolve } from "./fs"

// ─── Parser / env ─────────────────────────────────────────────────────────────

export function parseArgs(input: string): string[] {
  const args: string[] = []
  let cur = "", inS = false, inD = false
  for (const c of input) {
    if (c === "'" && !inD) { inS = !inS; continue }
    if (c === '"' && !inS) { inD = !inD; continue }
    if (c === " " && !inS && !inD) { if (cur) { args.push(cur); cur = "" } }
    else cur += c
  }
  if (cur) args.push(cur)
  return args
}

export function expandEnv(s: ShellState, str: string): string {
  return str.replace(/\$\{?([A-Z_][A-Z0-9_]*)\}?/gi, (_, k) => s.env[k] ?? "")
}

// ─── ls helpers ───────────────────────────────────────────────────────────────

function entryColor(e: FSEntry): string {
  if (e.type === "dir") return "font-bold text-sky-600 dark:text-sky-400"
  if (e.executable) return "font-bold text-emerald-600 dark:text-emerald-500"
  return "text-slate-700 dark:text-slate-200"
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).replace(",", "") +
    " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
}

// ─── Command implementations ──────────────────────────────────────────────────

export function err(msg: string): CmdResult { return { lines: [{ spans: [{ text: msg, cls: "text-red-500 dark:text-red-400" }] }] } }
export function out(...lines: string[]): CmdResult { return { lines: lines.map(t => ({ spans: [{ text: t }] })) } }

export function cmdLs(s: ShellState, args: string[]): CmdResult {
  let long = false, all = false, target: string | undefined
  for (const a of args) {
    if (a.startsWith("-")) { if (a.includes("l")) long = true; if (a.includes("a") || a.includes("A")) all = true }
    else target = a
  }
  const path = target ? resolve(s, target) : "/" + s.cwd.join("/")
  const entry = getEntry(s.root, path)
  if (!entry) return err(`ls: cannot access '${target}': No such file or directory`)
  if (entry.type === "file") {
    const name = path.split("/").pop()!
    return { lines: [{ spans: [{ text: name, cls: entryColor(entry) }] }] }
  }

  let items = [...entry.children.entries()].sort(([a], [b]) => a.localeCompare(b))
  if (!all) items = items.filter(([n]) => !n.startsWith("."))

  if (long) {
    const lines: OutLine[] = []
    const total = items.reduce((n, [, e]) => n + (e.type === "file" ? e.content.length : 4096), 0)
    lines.push({ spans: [{ text: `total ${Math.ceil(total / 512)}`, cls: "text-slate-500 dark:text-slate-500" }] })
    if (all) {
      for (const dot of [".", ".."]) {
        lines.push({ spans: [{ text: `drwxr-xr-x 2 user user   4096 ${fmtDate(new Date())} `, cls: "text-slate-500 dark:text-slate-500" }, { text: dot, cls: "font-bold text-sky-600 dark:text-sky-400" }] })
      }
    }
    for (const [name, ent] of items) {
      const size = ent.type === "file" ? ent.content.length : 4096
      lines.push({ spans: [
        { text: `${ent.permissions} 1 user user ${String(size).padStart(6)} ${fmtDate(ent.mtime)} `, cls: "text-slate-500 dark:text-slate-500" },
        { text: ent.type === "dir" ? name + "/" : name, cls: entryColor(ent) },
      ]})
    }
    return { lines }
  }

  // Short form — 4 columns
  const COL = 20, COLS = 4
  const rows: OutLine[] = []
  for (let i = 0; i < items.length; i += COLS) {
    const spans: Span[] = []
    for (let j = 0; j < COLS && i + j < items.length; j++) {
      const [name, ent] = items[i + j]
      const display = ent.type === "dir" ? name + "/" : name
      spans.push({ text: display, cls: entryColor(ent) })
      if (j < COLS - 1 && i + j + 1 < items.length)
        spans.push({ text: " ".repeat(Math.max(1, COL - display.length)) })
    }
    rows.push({ spans })
  }
  return { lines: rows }
}

export function cmdCd(s: ShellState, args: string[]): CmdResult {
  const path = resolve(s, args[0] ?? "~")
  const entry = getEntry(s.root, path)
  if (!entry) return err(`bash: cd: ${args[0]}: No such file or directory`)
  if (entry.type !== "dir") return err(`bash: cd: ${args[0]}: Not a directory`)
  return { lines: [], patch: { cwd: pathParts(path) } }
}

export function cmdCat(s: ShellState, args: string[]): CmdResult {
  if (!args.length) return err("cat: missing operand")
  const lines: OutLine[] = []
  for (const a of args) {
    const e = getEntry(s.root, resolve(s, a))
    if (!e) { lines.push({ spans: [{ text: `cat: ${a}: No such file or directory`, cls: "text-red-500 dark:text-red-400" }] }); continue }
    if (e.type === "dir") { lines.push({ spans: [{ text: `cat: ${a}: Is a directory`, cls: "text-red-500 dark:text-red-400" }] }); continue }
    for (const l of e.content.split("\n")) lines.push({ spans: [{ text: l }] })
  }
  return { lines }
}

export function cmdMkdir(s: ShellState, args: string[]): CmdResult {
  const lines: OutLine[] = []
  for (const a of args.filter(x => !x.startsWith("-"))) {
    const res = getParent(s.root, resolve(s, a))
    if (!res) { lines.push({ spans: [{ text: `mkdir: cannot create directory '${a}': No such file or directory`, cls: "text-red-500 dark:text-red-400" }] }); continue }
    const [parent, name] = res
    if (parent.children.has(name)) { lines.push({ spans: [{ text: `mkdir: cannot create directory '${a}': File exists`, cls: "text-red-500 dark:text-red-400" }] }); continue }
    parent.children.set(name, mkdir())
  }
  return { lines }
}

export function cmdTouch(s: ShellState, args: string[]): CmdResult {
  const lines: OutLine[] = []
  for (const a of args.filter(x => !x.startsWith("-"))) {
    const path = resolve(s, a)
    const existing = getEntry(s.root, path)
    if (existing) { existing.mtime = new Date(); continue }
    const res = getParent(s.root, path)
    if (!res) { lines.push({ spans: [{ text: `touch: cannot touch '${a}': No such file or directory`, cls: "text-red-500 dark:text-red-400" }] }); continue }
    const [parent, name] = res
    parent.children.set(name, mkfile(""))
  }
  return { lines }
}

export function cmdRm(s: ShellState, args: string[]): CmdResult {
  let rec = false
  const paths = args.filter(a => { if (a.startsWith("-")) { if (/r/i.test(a)) rec = true; return false } return true })
  const lines: OutLine[] = []
  for (const a of paths) {
    const e = getEntry(s.root, resolve(s, a))
    if (!e) { lines.push({ spans: [{ text: `rm: cannot remove '${a}': No such file or directory`, cls: "text-red-500 dark:text-red-400" }] }); continue }
    if (e.type === "dir" && !rec) { lines.push({ spans: [{ text: `rm: cannot remove '${a}': Is a directory`, cls: "text-red-500 dark:text-red-400" }] }); continue }
    const res = getParent(s.root, resolve(s, a))
    if (res) res[0].children.delete(res[1])
  }
  return { lines }
}

export function cmdCpMv(s: ShellState, args: string[], move: boolean): CmdResult {
  const cmd = move ? "mv" : "cp"
  const paths = args.filter(a => !a.startsWith("-"))
  if (paths.length < 2) return err(`${cmd}: missing destination operand`)
  const [src, dst] = [resolve(s, paths[0]), resolve(s, paths[1])]
  const srcEntry = getEntry(s.root, src)
  if (!srcEntry) return err(`${cmd}: cannot stat '${paths[0]}': No such file or directory`)
  if (srcEntry.type === "dir" && !move) return err(`cp: -r not specified; omitting directory '${paths[0]}'`)
  let target = dst
  const dstEntry = getEntry(s.root, dst)
  if (dstEntry?.type === "dir") target = dst + "/" + src.split("/").pop()
  const dstRes = getParent(s.root, target)
  if (!dstRes) return err(`${cmd}: cannot create '${paths[1]}': No such file or directory`)
  dstRes[0].children.set(dstRes[1], { ...srcEntry, mtime: new Date() })
  if (move) {
    const srcRes = getParent(s.root, src)
    if (srcRes) srcRes[0].children.delete(srcRes[1])
  }
  return { lines: [] }
}

export function cmdGrep(s: ShellState, args: string[]): CmdResult {
  const flags = args.filter(a => a.startsWith("-"))
  const rest = args.filter(a => !a.startsWith("-"))
  if (!rest.length) return err("grep: missing pattern")
  const [pattern, ...files] = rest
  const ic = flags.some(f => f.includes("i"))
  const ln = flags.some(f => f.includes("n"))
  const inv = flags.some(f => f.includes("v"))
  const lines: OutLine[] = []
  for (const f of files) {
    const e = getEntry(s.root, resolve(s, f))
    if (!e || e.type !== "file") { lines.push({ spans: [{ text: `grep: ${f}: No such file or directory`, cls: "text-red-500 dark:text-red-400" }] }); continue }
    const re = new RegExp(pattern, ic ? "gi" : "g")
    e.content.split("\n").forEach((line, i) => {
      const m = re.test(line)
      if (inv ? !m : m) {
        const prefix = files.length > 1 ? `${f}:` : ""
        lines.push({ spans: [{ text: prefix + (ln ? `${i + 1}:` : "") + line }] })
      }
    })
  }
  return { lines }
}

export function cmdFind(s: ShellState, args: string[]): CmdResult {
  const start = args[0] && !args[0].startsWith("-") ? resolve(s, args[0]) : "/" + s.cwd.join("/")
  const results: OutLine[] = []
  function walk(path: string) {
    const e = getEntry(s.root, path)
    if (!e) return
    results.push({ spans: [{ text: path }] })
    if (e.type === "dir") for (const [n] of e.children) walk(path === "/" ? "/" + n : path + "/" + n)
  }
  walk(start)
  return { lines: results }
}

export function cmdWc(s: ShellState, args: string[]): CmdResult {
  const flags = args.filter(a => a.startsWith("-"))
  const files = args.filter(a => !a.startsWith("-"))
  const l = !flags.length || flags.some(f => f.includes("l"))
  const w = !flags.length || flags.some(f => f.includes("w"))
  const c = !flags.length || flags.some(f => f.includes("c"))
  const lines: OutLine[] = []
  for (const f of files) {
    const e = getEntry(s.root, resolve(s, f))
    if (!e || e.type !== "file") { lines.push({ spans: [{ text: `wc: ${f}: No such file or directory`, cls: "text-red-500 dark:text-red-400" }] }); continue }
    const lc = e.content.split("\n").length - 1
    const wc = e.content.trim().split(/\s+/).filter(Boolean).length
    const bc = e.content.length
    const parts: string[] = []
    if (l) parts.push(String(lc).padStart(4))
    if (w) parts.push(String(wc).padStart(4))
    if (c) parts.push(String(bc).padStart(4))
    lines.push({ spans: [{ text: parts.join(" ") + " " + f }] })
  }
  return { lines }
}

export function cmdHeadTail(s: ShellState, args: string[], tail: boolean): CmdResult {
  let n = 10
  const files: string[] = []
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-n" && args[i + 1]) { n = parseInt(args[++i]); continue }
    if (/^-\d+$/.test(args[i])) { n = parseInt(args[i].slice(1)); continue }
    files.push(args[i])
  }
  const lines: OutLine[] = []
  for (const f of files) {
    const e = getEntry(s.root, resolve(s, f))
    if (!e || e.type !== "file") { lines.push({ spans: [{ text: `${tail ? "tail" : "head"}: cannot open '${f}': No such file or directory`, cls: "text-red-500 dark:text-red-400" }] }); continue }
    const all = e.content.split("\n")
    ;(tail ? all.slice(-n) : all.slice(0, n)).forEach(l => lines.push({ spans: [{ text: l }] }))
  }
  return { lines }
}

// cmdGit, cmdApt, cmdPing, cmdHelp live in ./shell-commands-sim.ts

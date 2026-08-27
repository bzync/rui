import type { CmdResult, OutLine, ShellState, Span } from "./types"
import { getEntry, resolve } from "./fs"
import {
  cmdCat, cmdCd, cmdCpMv, cmdFind, cmdGrep, cmdHeadTail,
  cmdLs, cmdMkdir, cmdRm, cmdTouch, cmdWc, err, expandEnv, out, parseArgs,
} from "./shell-commands"
import { cmdApt, cmdGit, cmdHelp, cmdPing } from "./shell-commands-sim"
import { cwdStr } from "./fs"

// ─── Main dispatcher ──────────────────────────────────────────────────────────

export function run(s: ShellState, raw: string): { lines: OutLine[]; next: ShellState; clear?: boolean } {
  const input = expandEnv(s, raw.trim())
  const args = parseArgs(input)
  const [cmd, ...rest] = args
  if (!cmd) return { lines: [], next: { ...s, history: [...s.history, raw].slice(-500) } }

  let r: CmdResult
  switch (cmd) {
    case "pwd":      r = out("/" + (s.cwd.join("/") || "")); break
    case "ls":       r = cmdLs(s, rest); break
    case "cd":       r = cmdCd(s, rest); break
    case "echo":     r = out(rest.filter(a => a !== "-n" && a !== "-e").map(a => expandEnv(s, a)).join(" ")); break
    case "cat":      r = cmdCat(s, rest); break
    case "mkdir":    r = cmdMkdir(s, rest); break
    case "touch":    r = cmdTouch(s, rest); break
    case "rm":       r = cmdRm(s, rest); break
    case "cp":       r = cmdCpMv(s, rest, false); break
    case "mv":       r = cmdCpMv(s, rest, true); break
    case "clear":    r = { lines: [], clear: true }; break
    case "history":  r = { lines: s.history.map((c, i) => ({ spans: [{ text: `  ${String(i + 1).padStart(4)}  `, cls: "text-slate-500" }, { text: c }] })) }; break
    case "grep":     r = cmdGrep(s, rest); break
    case "find":     r = cmdFind(s, rest); break
    case "wc":       r = cmdWc(s, rest); break
    case "head":     r = cmdHeadTail(s, rest, false); break
    case "tail":     r = cmdHeadTail(s, rest, true); break
    case "sort": {
      const f = rest[0]; if (!f) { r = err("sort: missing operand"); break }
      const e = getEntry(s.root, resolve(s, f))
      if (!e || e.type !== "file") { r = err(`sort: cannot read: ${f}`); break }
      r = { lines: e.content.split("\n").sort().map(l => ({ spans: [{ text: l }] })) }; break
    }
    case "whoami":   r = out(s.user); break
    case "id":       r = out(`uid=1000(${s.user}) gid=1000(${s.user}) groups=1000(${s.user}),27(sudo),4(adm)`); break
    case "uname":    r = out(rest.includes("-a") ? `Linux ${s.hostname} 6.8.0-51-generic #52-Ubuntu SMP x86_64 GNU/Linux` : "Linux"); break
    case "hostname": r = out(s.hostname); break
    case "date":     r = out(new Date().toString()); break
    case "uptime": {
      const u = Math.floor((Date.now() - s.startTime.getTime()) / 1000)
      r = out(` ${new Date().toLocaleTimeString()} up ${Math.floor(u/3600)}:${String(Math.floor((u%3600)/60)).padStart(2,"0")},  1 user,  load average: 0.08, 0.12, 0.09`)
      break
    }
    case "df":       r = { lines: [
      { spans: [{ text: "Filesystem      Size  Used Avail Use% Mounted on", cls: "text-slate-500 dark:text-slate-500" }] },
      { spans: [{ text: rest.includes("-h") ? "/dev/sda1        79G   12G   63G  16% /" : "/dev/sda1     82636288 12582912 65901568  16% /" }] },
      { spans: [{ text: rest.includes("-h") ? "tmpfs           7.8G     0  7.8G   0% /dev/shm" : "tmpfs           8133480       0 8133480   0% /dev/shm" }] },
    ]}; break
    case "free":     r = { lines: [
      { spans: [{ text: "               total        used        free      shared  buff/cache   available", cls: "text-slate-500 dark:text-slate-500" }] },
      { spans: [{ text: rest.includes("-h") ? "Mem:            15Gi       3.1Gi       8.7Gi       310Mi       3.6Gi        11Gi" : "Mem:        16266960     3211264     8921088      318464     3682496    11502208" }] },
      { spans: [{ text: rest.includes("-h") ? "Swap:          975Mi          0B       975Mi" : "Swap:         999420           0      999420" }] },
    ]}; break
    case "ps":       r = { lines: [
      { spans: [{ text: "  PID TTY          TIME CMD", cls: "text-slate-500 dark:text-slate-500" }] },
      { spans: [{ text: " 1234 pts/0    00:00:00 bash" }] },
      { spans: [{ text: " 5678 pts/0    00:00:00 ps" }] },
    ]}; break
    case "env":      r = { lines: Object.entries(s.env).map(([k, v]) => ({ spans: [{ text: k, cls: "text-sky-600 dark:text-sky-400" }, { text: "=" }, { text: v, cls: "text-emerald-600 dark:text-emerald-500" }] })) }; break
    case "export": {
      const newEnv = { ...s.env }
      for (const a of rest) { const eq = a.indexOf("="); if (eq > -1) newEnv[a.slice(0, eq)] = expandEnv(s, a.slice(eq + 1)) }
      r = { lines: [], patch: { env: newEnv } }; break
    }
    case "unset": {
      const newEnv = { ...s.env }; for (const a of rest) delete newEnv[a]
      r = { lines: [], patch: { env: newEnv } }; break
    }
    case "which": {
      const PATHS: Record<string,string> = { bash:"/bin/bash",ls:"/bin/ls",cat:"/bin/cat",echo:"/bin/echo",rm:"/bin/rm",cp:"/bin/cp",mv:"/bin/mv",mkdir:"/bin/mkdir",touch:"/usr/bin/touch",pwd:"/bin/pwd",grep:"/bin/grep",find:"/usr/bin/find",sort:"/usr/bin/sort",wc:"/usr/bin/wc",head:"/usr/bin/head",tail:"/usr/bin/tail",date:"/bin/date",hostname:"/bin/hostname",uname:"/bin/uname",whoami:"/usr/bin/whoami",id:"/usr/bin/id",env:"/usr/bin/env",which:"/usr/bin/which",python3:"/usr/bin/python3",node:"/usr/bin/node",npm:"/usr/bin/npm",git:"/usr/bin/git",curl:"/usr/bin/curl",wget:"/usr/bin/wget",apt:"/usr/bin/apt",df:"/bin/df",du:"/usr/bin/du",free:"/usr/bin/free",ps:"/bin/ps",uptime:"/usr/bin/uptime",chmod:"/bin/chmod",chown:"/bin/chown",sudo:"/usr/bin/sudo",ping:"/bin/ping" }
      r = { lines: rest.map(c => ({ spans: [{ text: PATHS[c] ?? "", cls: PATHS[c] ? undefined : "text-red-500 dark:text-red-400" }, { text: PATHS[c] ? "" : `${c} not found` }] })).filter(l => l.spans.some(s => s.text)) }; break
    }
    case "chmod":    r = { lines: [] }; break
    case "chown":    r = { lines: [] }; break
    case "sudo":     r = out(`[sudo] simulated — running as root: ${rest.join(" ")}`); break
    case "git":      r = cmdGit(s, rest); break
    case "apt":
    case "apt-get":  r = cmdApt(rest); break
    case "snap":     r = out("snap: simulated snap package manager"); break
    case "node":     r = rest.length ? err(`node: ${rest[0]}: No such file`) : out("Welcome to Node.js v20.18.0.", "Type \".help\" for more information.", "> (REPL not supported in browser — run node <file.js>)"); break
    case "python3":
    case "python":   r = rest.length ? err(`python3: can't open file '${rest[0]}'`) : out("Python 3.12.3 (main, Nov 6 2024) on linux", ">>> (REPL not supported in browser — run python3 <file.py>)"); break
    case "npm":      r = rest[0] === "install" || rest[0] === "i" ? out(`added ${rest[1] ? 1 : 0} packages in 0.5s`) : rest[0] === "run" ? out(`> ${rest[1]}`, "", `Running ${rest[1]}...`) : err(`npm: unknown command: ${rest[0] ?? "(none)"}`); break
    case "ping":     r = cmdPing(rest); break
    case "curl":     r = rest[0] ? out(`{"status":"ok","message":"Simulated response from ${rest.find(a=>!a.startsWith("-"))??""}"}`): err("curl: try 'curl --help'"); break
    case "wget":     r = out(`--${new Date().toISOString()}--  ${rest[0] ?? ""}`, "Saving to: stdout", "100% [========================================]", "done."); break
    case "man":
    case "help":     r = cmdHelp(); break
    case "less":
    case "more":     r = rest[0] ? cmdCat(s, rest) : err(`usage: ${cmd} <file>`); break
    case "vim": case "vi": case "nano": case "emacs": r = { lines: [{ spans: [{ text: `${cmd}: terminal editor not available in browser. Use cat to view files.`, cls: "text-amber-600 dark:text-amber-400" }] }] }; break
    case "top": case "htop": r = { lines: [{ spans: [{ text: "interactive monitor not supported. Try: ps aux", cls: "text-amber-600 dark:text-amber-400" }] }] }; break
    case "exit": case "logout": r = out("logout"); break
    case "alias":    r = out("alias ll='ls -la'", "alias la='ls -A'", "alias l='ls -CF'"); break
    case "type":     r = out(`${rest[0] ?? ""} is a shell builtin`); break
    case "true":     r = { lines: [] }; break
    case "false":    r = { lines: [] }; break
    case "sleep":    r = { lines: [] }; break
    case "":         r = { lines: [] }; break
    default:         r = err(`${cmd}: command not found`)
  }

  const next: ShellState = {
    ...s,
    cwd:     r.patch?.cwd     ?? s.cwd,
    env:     r.patch?.env     ?? s.env,
    history: [...s.history, raw.trim()].filter(Boolean).slice(-500),
  }
  return { lines: r.lines, next, clear: r.clear }
}

// ─── Tab completion ───────────────────────────────────────────────────────────

const ALL_CMDS = ["ls","cd","pwd","cat","mkdir","touch","rm","cp","mv","find","echo","grep","wc","head","tail","sort","whoami","id","uname","hostname","date","uptime","df","free","ps","env","export","unset","which","chmod","chown","sudo","git","apt","apt-get","node","python3","npm","ping","curl","wget","man","help","less","more","vim","nano","top","exit","alias","true","false","sleep","history","clear","type","bash","sh","snap","yarn","pip","pip3","wget","source"]

export function tabComplete(s: ShellState, input: string): { value: string; completions: string[] } {
  const args = parseArgs(input)
  const isFirstWord = args.length === 0 || (args.length === 1 && !input.endsWith(" "))

  if (isFirstWord) {
    const prefix = args[0] ?? ""
    const matches = ALL_CMDS.filter(c => c.startsWith(prefix))
    if (matches.length === 1) return { value: matches[0] + " ", completions: [] }
    if (matches.length > 1) return { value: input, completions: matches }
    return { value: input, completions: [] }
  }

  const partial = args[args.length - 1] ?? ""
  const dirPart = partial.includes("/") ? partial.slice(0, partial.lastIndexOf("/") + 1) : ""
  const basePart = partial.slice(dirPart.length)
  const searchPath = dirPart ? resolve(s, dirPart) : "/" + s.cwd.join("/")
  const dir = getEntry(s.root, searchPath)
  if (!dir || dir.type !== "dir") return { value: input, completions: [] }

  const matches = [...dir.children.keys()].filter(n => n.startsWith(basePart))
  if (matches.length === 0) return { value: input, completions: [] }
  if (matches.length === 1) {
    const matched = matches[0]
    const ent = dir.children.get(matched)!
    const suffix = ent.type === "dir" ? "/" : " "
    const newLast = dirPart + matched + suffix
    return { value: [...args.slice(0, -1), newLast].join(" "), completions: [] }
  }
  return { value: input, completions: matches }
}

// ─── Prompt spans ─────────────────────────────────────────────────────────────

export function promptSpans(s: ShellState): Span[] {
  return [
    { text: `${s.user}@${s.hostname}`, cls: "font-bold text-emerald-600 dark:text-emerald-500" },
    { text: ":", cls: "text-slate-700 dark:text-slate-200" },
    { text: cwdStr(s), cls: "font-bold text-sky-600 dark:text-sky-400" },
    { text: "$ ", cls: "text-slate-700 dark:text-slate-200" },
  ]
}

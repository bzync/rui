import type { CmdResult, OutLine, ShellState } from "./types"
import { cwdStr } from "./fs"
import { err, out } from "./shell-commands"

export function cmdGit(s: ShellState, args: string[]): CmdResult {
  const sub = args[0]
  if (!sub) return out("usage: git [--version] [--help] <command> [<args>]", "", "Common commands: init clone status add commit push pull log diff branch checkout merge")
  if (sub === "status") return out("On branch main", "Your branch is up to date with 'origin/main'.", "", "nothing to commit, working tree clean")
  if (sub === "log") return { lines: [
    { spans: [{ text: "commit a3f8c1e9d2b74f6a1c8e3d5b9f2a7c4e8d1b3f5 (HEAD -> main)", cls: "text-amber-600 dark:text-amber-400" }] },
    { spans: [{ text: "Author: User <user@example.com>" }] },
    { spans: [{ text: "Date:   Thu Jun 5 12:00:00 2026 +0000" }] },
    { spans: [{ text: "" }] },
    { spans: [{ text: "    Initial commit" }] },
  ]}
  if (sub === "init") return out(`Initialized empty Git repository in ${cwdStr(s)}/.git/`)
  if (sub === "branch") return { lines: [{ spans: [{ text: "* main", cls: "text-emerald-600 dark:text-emerald-500" }] }] }
  if (sub === "diff") return out("(no changes)")
  if (sub === "add" || sub === "checkout") return { lines: [] }
  if (sub === "commit") {
    const i = args.indexOf("-m"); const msg = i !== -1 ? args[i + 1] : "update"
    return out(`[main a3f8c1e] ${msg}`, " 1 file changed, 1 insertion(+)")
  }
  if (sub === "push" || sub === "pull") return out("Already up to date.")
  if (sub === "clone") {
    const url = args[1] ?? "<url>"; const name = url.split("/").pop()?.replace(".git", "") ?? "repo"
    return out(`Cloning into '${name}'...`, "remote: Counting objects: 100% (42/42), done.", "Receiving objects: 100% (42/42), 12.34 KiB | 1.23 MiB/s, done.")
  }
  if (sub === "--version") return out("git version 2.43.0")
  return err(`git: '${sub}' is not a git command. See 'git --help'.`)
}

export function cmdApt(args: string[]): CmdResult {
  const sub = args[0]
  if (sub === "update") return out("Get:1 http://archive.ubuntu.com/ubuntu noble InRelease [256 kB]", "Fetched 256 kB in 1s (256 kB/s)", "Reading package lists... Done", "Building dependency tree... Done", "2 packages can be upgraded.")
  if (sub === "upgrade") return out("Reading package lists... Done", "Building dependency tree... Done", "0 upgraded, 0 newly installed, 0 to remove and 2 not upgraded.")
  if (sub === "install") {
    const pkg = args[1] ?? ""; if (!pkg) return err("apt: package name required")
    return out("Reading package lists... Done", `The following NEW packages will be installed:\n  ${pkg}`, `Get:1 http://archive.ubuntu.com/ubuntu noble/universe amd64 ${pkg} 1.0.0-1 [128 kB]`, "Fetched 128 kB in 0s", `Setting up ${pkg} (1.0.0-1) ...`)
  }
  if (sub === "list") return out("Listing... Done", "bash/noble,now 5.2.21-2ubuntu4 amd64 [installed]", "curl/noble,now 8.5.0 amd64 [installed]", "git/noble,now 1:2.43.0 amd64 [installed]", "nodejs/noble,now 18.19.0 amd64 [installed]", "python3/noble,now 3.12.3 amd64 [installed]")
  return out("Usage: apt [options] command", "", "Available commands:", "  update, upgrade, install, remove, list, search, show")
}

export function cmdPing(args: string[]): CmdResult {
  const host = args.find(a => !a.startsWith("-")) ?? "google.com"
  const ci = args.indexOf("-c"); const count = ci !== -1 ? Math.min(parseInt(args[ci + 1] ?? "4"), 8) : 4
  const lines: OutLine[] = [{ spans: [{ text: `PING ${host} (142.250.185.46) 56(84) bytes of data.` }] }]
  for (let i = 0; i < count; i++) {
    const ms = (12 + Math.random() * 8).toFixed(3)
    lines.push({ spans: [{ text: `64 bytes from ${host} (142.250.185.46): icmp_seq=${i + 1} ttl=115 time=${ms} ms` }] })
  }
  lines.push({ spans: [{ text: "" }] })
  lines.push({ spans: [{ text: `--- ${host} ping statistics ---` }] })
  lines.push({ spans: [{ text: `${count} packets transmitted, ${count} received, 0% packet loss` }] })
  lines.push({ spans: [{ text: `rtt min/avg/max = 12.1/15.3/20.1 ms` }] })
  return { lines }
}

export function cmdHelp(): CmdResult {
  return { lines: [
    { spans: [{ text: "Available commands:", cls: "font-bold text-slate-700 dark:text-slate-200" }] },
    { spans: [{ text: "" }] },
    { spans: [{ text: "  File system:  ", cls: "text-sky-600 dark:text-sky-400" }, { text: "ls  cd  pwd  cat  mkdir  touch  rm  cp  mv  find" }] },
    { spans: [{ text: "  Text tools:   ", cls: "text-sky-600 dark:text-sky-400" }, { text: "echo  grep  wc  head  tail  sort" }] },
    { spans: [{ text: "  System:       ", cls: "text-sky-600 dark:text-sky-400" }, { text: "whoami  id  uname  hostname  date  uptime  df  free  ps" }] },
    { spans: [{ text: "  Environment:  ", cls: "text-sky-600 dark:text-sky-400" }, { text: "env  export  unset  which" }] },
    { spans: [{ text: "  Network:      ", cls: "text-sky-600 dark:text-sky-400" }, { text: "ping  curl  wget" }] },
    { spans: [{ text: "  Packages:     ", cls: "text-sky-600 dark:text-sky-400" }, { text: "apt  apt-get" }] },
    { spans: [{ text: "  Dev tools:    ", cls: "text-sky-600 dark:text-sky-400" }, { text: "git  node  python3  npm" }] },
    { spans: [{ text: "  Shell:        ", cls: "text-sky-600 dark:text-sky-400" }, { text: "history  clear  sudo  chmod  alias" }] },
    { spans: [{ text: "" }] },
    { spans: [{ text: "Keyboard:  ", cls: "text-slate-500 dark:text-slate-500" }, { text: "↑↓ history   Tab complete   Ctrl+C cancel   Ctrl+L clear" }] },
  ]}
}

import type { FSDir, FSEntry, FSFile, ShellState } from "./types"

// ─── Filesystem builder ───────────────────────────────────────────────────────

export function mkfile(content: string, executable = false): FSFile {
  return { type: "file", content, permissions: executable ? "-rwxr-xr-x" : "-rw-r--r--", mtime: new Date(), executable }
}
export function mkdir(children: Record<string, FSEntry> = {}): FSDir {
  return { type: "dir", children: new Map(Object.entries(children)), permissions: "drwxr-xr-x", mtime: new Date() }
}

export function buildFS(): FSDir {
  return mkdir({
    home: mkdir({
      user: mkdir({
        ".bashrc": mkfile(`# ~/.bashrc\nexport PS1='\\u@\\h:\\w\\$ '\nexport PATH="$HOME/bin:$PATH"\nalias ll='ls -la'\nalias la='ls -A'\n`),
        ".bash_history": mkfile(`ls\npwd\ncd projects\nls -la\ncat README.md\ngit status\nnpm run dev\n`),
        ".profile": mkfile(`# ~/.profile\nif [ -f "$HOME/.bashrc" ]; then\n  . "$HOME/.bashrc"\nfi\n`),
        "README.md": mkfile(`# Home Directory\n\nWelcome! Try:\n  ls -la\n  cd projects\n  cat README.md\n  help\n`),
        Desktop: mkdir({}),
        Documents: mkdir({
          "notes.txt": mkfile(`Meeting notes - 2026-06-05\n\n- Review infra setup\n- Deploy worker nodes\n- Update API docs\n`),
          "todo.txt": mkfile(`[ ] Fix login bug\n[x] Deploy v1.2\n[ ] Write tests\n`),
        }),
        projects: mkdir({
          "my-app": mkdir({
            "package.json": mkfile(`{\n  "name": "my-app",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build"\n  },\n  "dependencies": {\n    "next": "16.2.7",\n    "react": "^19.0.0"\n  }\n}\n`),
            "README.md": mkfile(`# my-app\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`),
            src: mkdir({
              "index.ts": mkfile(`export default function main() {\n  console.log("Hello, world!")\n}\n`),
              "utils.ts": mkfile(`export function greet(name: string) {\n  return \`Hello, \${name}!\`\n}\n`),
            }),
          }),
        }),
        Downloads: mkdir({}),
      }),
    }),
    etc: mkdir({
      hostname: mkfile("ubuntu\n"),
      "os-release": mkfile(`NAME="Ubuntu"\nVERSION="24.04.1 LTS (Noble Numbat)"\nID=ubuntu\nPRETTY_NAME="Ubuntu 24.04.1 LTS"\nVERSION_ID="24.04"\n`),
      passwd: mkfile(`root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User,,,:/home/user:/bin/bash\n`),
      shells: mkfile(`/bin/sh\n/bin/bash\n/usr/bin/bash\n/usr/bin/zsh\n`),
    }),
    tmp: mkdir({}),
    usr: mkdir({ bin: mkdir({}), local: mkdir({ bin: mkdir({}) }) }),
    var: mkdir({
      log: mkdir({
        syslog: mkfile(`Jun  5 12:00:01 ubuntu systemd[1]: Started Daily apt upgrade.\nJun  5 12:01:00 ubuntu CRON[1234]: (root) CMD (run-parts /etc/cron.hourly)\n`),
      }),
    }),
    proc: mkdir({}),
    dev: mkdir({}),
  })
}

// ─── Path utils ───────────────────────────────────────────────────────────────

export function pathJoin(...parts: string[]): string {
  const segs: string[] = []
  for (const part of parts)
    for (const seg of part.split("/"))
      if (seg === "..") segs.pop()
      else if (seg && seg !== ".") segs.push(seg)
  return "/" + segs.join("/")
}

export function pathParts(p: string): string[] { return p.split("/").filter(Boolean) }

export function resolve(s: ShellState, p: string): string {
  if (!p || p === "~") return `/home/${s.user}`
  if (p.startsWith("~/")) return `/home/${s.user}/${p.slice(2)}`
  if (p.startsWith("/")) return pathJoin(p)
  return pathJoin(`/${s.cwd.join("/")}`, p)
}

export function getEntry(root: FSDir, path: string): FSEntry | null {
  let cur: FSEntry = root
  for (const seg of pathParts(path)) {
    if (cur.type !== "dir") return null
    const next = cur.children.get(seg)
    if (!next) return null
    cur = next
  }
  return cur
}

export function getParent(root: FSDir, path: string): [FSDir, string] | null {
  const parts = pathParts(path)
  const name = parts.pop()!
  let cur: FSEntry = root
  for (const seg of parts) {
    if (cur.type !== "dir") return null
    const next = cur.children.get(seg)
    if (!next) return null
    cur = next
  }
  return cur.type === "dir" ? [cur, name] : null
}

export function cwdStr(s: ShellState): string {
  const full = "/" + s.cwd.join("/")
  const home = `/home/${s.user}`
  if (full === home) return "~"
  if (full.startsWith(home + "/")) return "~" + full.slice(home.length)
  return full || "/"
}

"use client"

import { useState } from "react"
import { CodeBlock, CodeEditor, InlineCode } from "@bzync/rui"
import { RichTextEditor } from "@bzync/rui"
import { TerminalBlock, TerminalEmulator } from "@bzync/rui"
import { Section } from "../_shared/section"
import { Group } from "../_shared/group"

export function EditorsSection() {
  const [richText, setRichText] = useState("")
  const [codeEditorVal, setCodeEditorVal] = useState(`function greet(name: string) {\n  return \`Hello, \${name}!\`\n}\n\nconst msg = greet("world")\nconsole.log(msg)`)

  return (
    <>
            <Section
              id="codeblock"
              title="CodeBlock"
              description="Syntax-highlighted code display with language label, line numbers, and copy button."
              importPath='import { CodeBlock, InlineCode } from "@bzync/rui"'
              meta={["syntax highlight", "copy", "line numbers"]}
            >
              <Group label="TypeScript" col>
                <CodeBlock
                  language="ts"
                  filename="api/deploy.ts"
                  showLineNumbers
                  code={`import { db } from "@/lib/db"\n\nexport async function deploy(projectId: string) {\n  const project = await db.projects.findUnique({\n    where: { id: projectId },\n  })\n  if (!project) throw new Error("Project not found")\n  return buildAndPush(project)\n}`}
                />
              </Group>
              <Group label="Bash">
                <div className="w-full">
                  <CodeBlock
                    language="bash"
                    code={`# Bootstrap the cluster\nmake prod-bootstrap\n\n# Check all nodes\nmake prod-health`}
                  />
                </div>
              </Group>
              <Group label="Inline code">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Use <InlineCode>make dev-up</InlineCode> to start all services, or <InlineCode>make dev-logs svc=api</InlineCode> to tail a single service.
                </p>
              </Group>
            </Section>
            <Section
              id="codeeditor"
              title="CodeEditor"
              description="Editable code textarea with line numbers, auto-indent, tab support, and bracket auto-pairing."
              importPath='import { CodeEditor } from "@bzync/rui"'
              meta={["line numbers", "auto-indent", "tab → spaces", "bracket pairs"]}
            >
              <Group label="TypeScript editor" col>
                <CodeEditor
                  language="ts"
                  value={codeEditorVal}
                  onChange={setCodeEditorVal}
                />
              </Group>
            </Section>
            <Section
              id="terminal"
              title="Terminal"
              description="Terminal display and interactive emulator components with colored output lines and command history."
              importPath='import { TerminalBlock, TerminalEmulator } from "@bzync/rui"'
              meta={["colored lines", "interactive", "history", "Ctrl+L clear"]}
            >
              <Group label="Display" col>
                <TerminalBlock
                  title="deploy log"
                  lines={[
                    { type: "command", text: "make prod-bootstrap" },
                    { type: "info",    text: "[1/9] Connecting to VPS 1a…" },
                    { type: "success", text: "✓ VPS 1a configured" },
                    { type: "info",    text: "[2/9] Connecting to VPS 1b…" },
                    { type: "success", text: "✓ VPS 1b configured" },
                    { type: "info",    text: "[3/9] Setting up PostgreSQL primary…" },
                    { type: "success", text: "✓ DB primary ready" },
                    { type: "error",   text: "✗ VPS 2a unreachable (timeout)" },
                    { type: "muted",   text: "Skipping VPS 2a — retrying later" },
                    { type: "output",  text: "\nDone. 8/9 nodes healthy." },
                  ]}
                />
              </Group>
              <Group label="Interactive emulator" col>
                <TerminalEmulator
                  title="user@ubuntu"
                  user="user"
                  hostname="ubuntu"
                  className="w-full"
                />
              </Group>
            </Section>
            <Section
              id="richtext"
              title="RichText"
              description="Rich text editor with formatting toolbar. Supports bold, italic, headings, lists, blockquote, undo/redo, and clear formatting."
              importPath='import { RichTextEditor } from "@bzync/rui"'
              meta={["contenteditable", "toolbar", "execCommand"]}
            >
              <Group label="Editor" col>
                <RichTextEditor
                  value={richText}
                  onChange={setRichText}
                  placeholder="Start writing your docs, notes, or description…"
                />
                {richText && (
                  <div className="rounded-xl border border-black/[0.07] dark:border-white/[0.07] p-4">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Output HTML</p>
                    <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-all">{richText}</pre>
                  </div>
                )}
              </Group>
            </Section>
    </>
  )
}

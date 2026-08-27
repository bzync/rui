"use client"

import {
  Badge,
  Button,
  Callout,
  CodeBlock,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from "@bzync/rui"
import { Check, Copy, ExternalLink } from "lucide-react"
import { type ReactNode, useEffect, useState } from "react"
import { hrefFor } from "./catalog"

export function PageIntro({
  eyebrow,
  title,
  description,
  badge,
  children,
}: {
  eyebrow?: string
  title: string
  description: string
  badge?: string
  children?: ReactNode
}) {
  return (
    <header className="docs-page-intro">
      {eyebrow && <p className="docs-eyebrow">{eyebrow}</p>}
      <div className="docs-title-row">
        <h1>{title}</h1>
        {badge && <Badge variant="muted" size="sm">{badge}</Badge>}
      </div>
      <p className="docs-lede">{description}</p>
      {children && <div className="docs-intro-actions">{children}</div>}
    </header>
  )
}

export function DocsSection({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn("docs-section", className)}>
      <h2>{title}</h2>
      {description && <p className="docs-section-description">{description}</p>}
      {children}
    </section>
  )
}

export function ComponentPreview({
  title = "Example",
  code,
  children,
  filename = "example.tsx",
  className,
  align = "center",
}: {
  title?: string
  code: string
  children: ReactNode
  filename?: string
  className?: string
  align?: "center" | "start"
}) {
  return (
    <div className={cn("component-preview", className)}>
      <Tabs defaultValue="preview">
        <div className="component-preview-header">
          <p>{title}</p>
          <TabsList aria-label={`${title} view`} className="component-preview-tabs">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="preview" className={cn("component-preview-canvas", align === "start" && "items-start") }>
          {children}
        </TabsContent>
        <TabsContent value="code" className="component-preview-code">
          <CodeBlock code={code} language="tsx" filename={filename} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export interface ApiProp {
  name: string
  type: string
  default?: string
  description: string
}

export function PropsTable({ props, caption = "Component props" }: { props: ApiProp[]; caption?: string }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-props-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td><code>{prop.name}</code></td>
              <td><code>{prop.type}</code></td>
              <td>{prop.default ? <code>{prop.default}</code> : <span aria-label="Not applicable">—</span>}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CopyCommand({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timeout)
  }, [copied])

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable")
      await navigator.clipboard.writeText(children)
      setCopied(true)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = children
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      const didCopy = document.execCommand("copy")
      textarea.remove()
      if (didCopy) setCopied(true)
    }
  }

  return (
    <div className="copy-command">
      <code>{children}</code>
      <Button variant="ghost" size="sm" onClick={copy} aria-label={copied ? "Copied command" : "Copy command"}>
        {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  )
}

export function DocsCallout({ title, children, variant = "info" }: { title: string; children: ReactNode; variant?: "info" | "success" | "warning" | "error" | "default" }) {
  return <Callout title={title} variant={variant} className="docs-callout">{children}</Callout>
}

export function PageLink({ slug, title, description }: { slug: string; title: string; description: string }) {
  return (
    <a href={hrefFor(slug)} className="docs-page-link">
      <span><strong>{title}</strong><small>{description}</small></span>
      <span aria-hidden="true">→</span>
    </a>
  )
}

export function ExternalTextLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="docs-text-link" href={href} target="_blank" rel="noreferrer">{children}<ExternalLink size={12} aria-hidden="true" /></a>
}

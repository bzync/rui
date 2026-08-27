"use client"

import {
  Badge,
  Button,
  Drawer,
  DropdownMenu,
  Modal,
  SnackbarProvider,
  ThemeProvider,
  useTheme,
  cn,
} from "@bzync/rui"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  GitBranch,
  Menu,
  Monitor,
  Moon,
  Search,
  Sun,
} from "lucide-react"
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react"
import { RuiBrandMark } from "./_shared/brand"
import { allPages, docsGroups, getPage, hrefFor, orderedPages, readHash, type DocsPage } from "./docs/catalog"

const DocsPageContent = lazy(() => import("./docs/pages").then(module => ({ default: module.DocsPageContent })))

const pageSectionMap: Record<string, string[]> = {
  "docs/introduction": ["install", "first-component", "package-architecture", "principles"],
  "docs/installation": ["package", "styles", "peer-dependencies", "imports"],
  "docs/quick-start": ["provider", "render-a-component", "next-steps"],
  "docs/configuration": ["theme-provider", "palette", "package-imports"],
  "foundations/colors": ["semantic-tokens", "accent-scale", "mode-overrides"],
  "foundations/typography": ["families", "scale", "code"],
  "foundations/spacing": ["rhythm", "application"],
  "foundations/radius": ["radius", "shadows"],
  "foundations/accessibility": ["keyboard", "focus", "semantics", "motion", "verification"],
  components: ["browse", "importing", "support"],
  "patterns/forms": ["structure", "validation", "example"],
  "patterns/data-display": ["table-choice", "actions", "example"],
  "patterns/feedback": ["choose", "severity", "example"],
  "patterns/empty-states": ["content", "actions", "example"],
  "examples/settings": ["preview", "implementation"],
  "examples/authentication": ["preview", "implementation"],
  "examples/team-management": ["preview", "implementation"],
  "resources/component-api": ["inventory", "types"],
  "resources/accessibility": ["component-contract", "consumer-checklist", "testing"],
  "resources/contributing": ["workflow", "component-contract", "verification"],
}

function getPageSections(page: DocsPage) {
  return pageSectionMap[page.slug] ?? (page.kind === "component" ? ["usage", "accessibility", "api-reference"] : ["overview"])
}

const repoUrl = "https://github.com/bzync/rtui"

function navigate(slug: string) {
  window.location.hash = `/${slug}`
}

function ThemeMenu() {
  const { theme, setTheme } = useTheme()
  const current = theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor
  return (
    <DropdownMenu
      ariaLabel="Theme preference"
      align="end"
      trigger={<Button variant="ghost" size="sm" className="docs-theme-trigger" aria-label={`Theme: ${current}`} icon={<Icon size={15} aria-hidden="true" />} iconPosition="left"><span className="header-label">{current}</span></Button>}
      items={[
        { label: "Light", icon: theme === "light" ? <Check size={14} /> : <Sun size={14} />, onClick: () => setTheme("light") },
        { label: "Dark", icon: theme === "dark" ? <Check size={14} /> : <Moon size={14} />, onClick: () => setTheme("dark") },
        { label: "System", icon: theme === "system" ? <Check size={14} /> : <Monitor size={14} />, onClick: () => setTheme("system") },
      ]}
    />
  )
}

function SidebarNavigation({ activeSlug, onNavigate }: { activeSlug: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Documentation navigation" className="docs-sidebar-nav">
      {docsGroups.map((group, groupIndex) => (
        <div className={cn("docs-nav-group", groupIndex > 1 && groupIndex < docsGroups.length - 3 && "docs-nav-component-group")} key={group.label}>
          <p>{group.label}</p>
          <ul>
            {group.pages.map((page) => (
              <li key={page.slug}>
                <a
                  href={hrefFor(page.slug)}
                  aria-current={activeSlug === page.slug ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {page.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    const ranked = allPages
      .map((page) => {
        const haystack = [page.title, page.description, page.group, ...(page.aliases ?? [])].join(" ").toLowerCase()
        const title = page.title.toLowerCase()
        const score = !term ? 1 : title === term ? 5 : title.startsWith(term) ? 4 : (page.aliases ?? []).some(alias => alias.toLowerCase() === term) ? 3 : haystack.includes(term) ? 2 : 0
        return { page, score }
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title))
      .slice(0, 12)
    return ranked
  }, [query])

  function select(page: DocsPage) {
    navigate(page.slug)
    setQuery("")
    setActiveIndex(0)
    onClose()
  }

  function close() {
    setQuery("")
    setActiveIndex(0)
    onClose()
  }

  return (
    <Modal open={open} onClose={close} ariaLabel="Search documentation" showCloseButton={false} size="lg" panelClassName="docs-search-dialog">
      <div className="docs-search-input-wrap">
        <Search size={17} aria-hidden="true" />
        <input
          ref={inputRef}
          autoFocus
          value={query}
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(0) }}
          placeholder="Search components and docs…"
          aria-label="Search components and docs"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              setActiveIndex(index => Math.min(index + 1, results.length - 1))
            } else if (event.key === "ArrowUp") {
              event.preventDefault()
              setActiveIndex(index => Math.max(index - 1, 0))
            } else if (event.key === "Enter" && results[activeIndex]) {
              select(results[activeIndex].page)
            }
          }}
        />
        <kbd>Esc</kbd>
      </div>
      <div className="docs-search-results" role="listbox" aria-label="Search results">
        {results.length ? results.map(({ page }, index) => (
          <button type="button" role="option" aria-selected={index === activeIndex} key={page.slug} onMouseEnter={() => setActiveIndex(index)} onClick={() => select(page)}>
            <span><strong>{page.title}</strong><small>{page.description}</small></span>
            <Badge variant="muted" size="sm">{page.group}</Badge>
          </button>
        )) : <div className="docs-search-empty"><Search size={20} /><p>No documentation found for “{query}”.</p></div>}
      </div>
      <div className="docs-search-footer"><span><kbd>↑</kbd><kbd>↓</kbd> browse</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
    </Modal>
  )
}

function OnThisPage({ sections, activeSection }: { sections: string[]; activeSection: string }) {
  return (
    <aside className="docs-toc" aria-label="On this page">
      <p>On this page</p>
      <ol>
        {sections.map((id) => (
          <li key={id}>
            <button
              type="button"
              className={activeSection === id ? "active" : undefined}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              {id.replace(/-/g, " ")}
            </button>
          </li>
        ))}
      </ol>
    </aside>
  )
}

function MobileOnThisPage({ sections, activeSection }: { sections: string[]; activeSection: string }) {
  return (
    <nav className="docs-mobile-toc" aria-label="Sections on this page">
      <span>Jump to</span>
      <div>
        {sections.map((id) => (
          <button
            type="button"
            key={id}
            aria-current={activeSection === id ? "location" : undefined}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            {id.replace(/-/g, " ")}
          </button>
        ))}
      </div>
    </nav>
  )
}

function Breadcrumbs({ page }: { page: DocsPage }) {
  return (
    <nav aria-label="Breadcrumb" className="docs-breadcrumbs">
      <a href={hrefFor(page.kind === "component" ? "components" : "docs/introduction")}>{page.kind === "component" ? "Components" : "Docs"}</a>
      <span aria-hidden="true">/</span>
      {page.kind === "component" && <><span>{page.group}</span><span aria-hidden="true">/</span></>}
      <span aria-current="page">{page.title}</span>
    </nav>
  )
}

function PagePager({ page }: { page: DocsPage }) {
  const index = orderedPages.findIndex((item) => item.slug === page.slug)
  const previous = index > 0 ? orderedPages[index - 1] : undefined
  const next = index >= 0 && index < orderedPages.length - 1 ? orderedPages[index + 1] : undefined
  if (!previous && !next) return null
  return (
    <nav className="docs-pager" aria-label="Previous and next pages">
      {previous ? <a href={hrefFor(previous.slug)}><small><ArrowLeft size={13} />Previous</small><strong>{previous.title}</strong></a> : <span />}
      {next ? <a href={hrefFor(next.slug)} className="next"><small>Next<ArrowRight size={13} /></small><strong>{next.title}</strong></a> : <span />}
    </nav>
  )
}

function DocsShell() {
  const [activeSlug, setActiveSlug] = useState(readHash)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const page = getPage(activeSlug)
  const sections = getPageSections(page)
  const primaryArea = page.kind === "example" ? "examples" : page.kind === "component" || page.slug === "components" ? "components" : "docs"

  useEffect(() => {
    const onHashChange = () => setActiveSlug(readHash())
    window.addEventListener("hashchange", onHashChange)
    if (!window.location.hash) window.history.replaceState(null, "", hrefFor("docs/introduction"))
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    document.title = `${page.title} – @bzync/rui`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "description"
      document.head.appendChild(meta)
    }
    meta.content = `${page.title} documentation for @bzync/rui. ${page.description}`
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [page, sections])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && (event.key.toLowerCase() === "k" || event.code === "KeyK")) {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    const elements = sections.map(id => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element))
    if (!elements.length) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]?.target.id) setActiveSection(visible[0].target.id)
    }, { rootMargin: "-80px 0px -68%", threshold: [0, 1] })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [activeSlug, sections])

  useEffect(() => {
    let frame = 0
    const updateScrollPosition = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0)
        setShowBackToTop(window.scrollY > 560)
      })
    }
    updateScrollPosition()
    window.addEventListener("scroll", updateScrollPosition, { passive: true })
    window.addEventListener("resize", updateScrollPosition)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", updateScrollPosition)
      window.removeEventListener("resize", updateScrollPosition)
    }
  }, [activeSlug])

  return (
    <SnackbarProvider>
      <div className="docs-app">
        <a className="docs-skip-link" href="#main-content">Skip to content</a>
        <header className="docs-header">
          <span className="docs-reading-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} aria-hidden="true" />
          <div className="docs-header-inner">
            <div className="docs-header-left">
              <Button variant="ghost" size="icon" className="docs-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open documentation navigation"><Menu size={18} /></Button>
              <a className="docs-brand" href={hrefFor("docs/introduction")} aria-label="@bzync/rui documentation home"><RuiBrandMark size={26} /><strong>@bzync/rui</strong></a>
              <Badge variant="muted" size="sm" className="docs-version">v0.0.3</Badge>
              <nav className="docs-primary-nav" aria-label="Primary">
                <a href={hrefFor("docs/introduction")} aria-current={primaryArea === "docs" ? "page" : undefined}>Docs</a>
                <a href={hrefFor("components")} aria-current={primaryArea === "components" ? "page" : undefined}>Components</a>
                <a href={hrefFor("examples/settings")} aria-current={primaryArea === "examples" ? "page" : undefined}>Examples</a>
              </nav>
            </div>
            <div className="docs-header-actions">
              <button type="button" className="docs-search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search documentation">
                <Search size={15} aria-hidden="true" /><span>Search documentation…</span><kbd><span className="mac-key">⌘</span><span className="ctrl-key">Ctrl</span> K</kbd>
              </button>
              <ThemeMenu />
              <a className="docs-icon-link" href={repoUrl} target="_blank" rel="noreferrer" aria-label="Open @bzync/rui repository"><GitBranch size={17} /></a>
            </div>
          </div>
        </header>

        <aside className="docs-sidebar"><SidebarNavigation activeSlug={activeSlug} /></aside>

        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} title="Documentation" width="min(21rem, 88vw)" panelClassName="docs-mobile-drawer">
          <div className="mobile-drawer-search"><Button variant="secondary" onClick={() => { setMobileOpen(false); setSearchOpen(true) }}><Search size={15} />Search documentation</Button></div>
          <SidebarNavigation activeSlug={activeSlug} onNavigate={() => setMobileOpen(false)} />
        </Drawer>

        <div className="docs-layout">
          <main className="docs-main" id="main-content">
            <Breadcrumbs page={page} />
            <MobileOnThisPage sections={sections} activeSection={sections.includes(activeSection) ? activeSection : (sections[0] ?? "")} />
            <article className="docs-article">
              <Suspense fallback={<div className="docs-page-loading" aria-label="Loading documentation"><span /><span /><span /></div>}>
                <DocsPageContent page={page} />
              </Suspense>
            </article>
            <PagePager page={page} />
            <footer className="docs-footer">
              <div className="docs-footer-meta">
                <span className="docs-footer-brand"><RuiBrandMark size={16} />Built with @bzync/rui</span>
                <span>Not accepting collaboration requests at this time.</span>
              </div>
              <div className="docs-footer-links">
                <a className="docs-support-link" href="https://buymeacoffee.com/adminjw" target="_blank" rel="noreferrer">Support development</a>
                <nav aria-label="Footer">
                  <a href={hrefFor("foundations/accessibility")}>Accessibility</a>
                  <a href={hrefFor("resources/contributing")}>Contributing</a>
                  <a href={repoUrl} target="_blank" rel="noreferrer">GitHub</a>
                </nav>
              </div>
            </footer>
          </main>
          <OnThisPage sections={sections} activeSection={sections.includes(activeSection) ? activeSection : (sections[0] ?? "")} />
        </div>

        <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
        <button
          type="button"
          className={cn("docs-back-to-top", showBackToTop && "visible")}
          aria-label="Back to top"
          tabIndex={showBackToTop ? 0 : -1}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp size={16} aria-hidden="true" />
        </button>
      </div>
    </SnackbarProvider>
  )
}

export default function App() {
  return <ThemeProvider defaultTheme="system" applyToRoot storageKey="rui-docs-theme"><DocsShell /></ThemeProvider>
}

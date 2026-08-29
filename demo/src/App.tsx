"use client"

import {
  Badge,
  Button,
  DropdownMenu,
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
import { Suspense, lazy, useEffect, useState } from "react"
import packageMetadata from "../../package.json"
import { RuiBrandMark } from "./_shared/brand"
import { docsGroups, getPage, hrefFor, orderedPages, readHash, type DocsPage } from "./docs/catalog"
import { DocsPageContent } from "./docs/pages"

// Overlays that never appear on first paint — split into their own chunks and
// mounted lazily on first use so the framer-motion-backed Modal/Drawer code
// stays out of the initial bundle and off the critical path.
const SearchDialog = lazy(() => import("./_shared/search-dialog"))
const MobileNavDrawer = lazy(() => import("./_shared/mobile-nav-drawer"))

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

const repoUrl = "https://github.com/bzync/rui"

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" })
}

function scrollToDocumentTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })
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
              onClick={() => scrollToSection(id)}
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
            onClick={() => scrollToSection(id)}
          >
            {id.replace(/-/g, " ")}
          </button>
        ))}
      </div>
    </nav>
  )
}

function Breadcrumbs({ page }: { page: DocsPage }) {
  const isComponentPage = page.kind === "component" || page.slug === "components"
  const showGroup = !isComponentPage && page.group !== "Getting Started"
  return (
    <nav aria-label="Breadcrumb" className="docs-breadcrumbs">
      <a href={hrefFor(isComponentPage ? "components" : "docs/introduction")}>{isComponentPage ? "Components" : "Docs"}</a>
      <span aria-hidden="true">/</span>
      {page.kind === "component" && <><span>{page.group}</span><span aria-hidden="true">/</span></>}
      {showGroup && <><span>{page.group}</span><span aria-hidden="true">/</span></>}
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
  // Keep the lazy overlay chunks mounted once first opened so reopening is instant.
  const [drawerEverOpened, setDrawerEverOpened] = useState(false)
  const [searchEverOpened, setSearchEverOpened] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const openMobileNav = () => { setDrawerEverOpened(true); setMobileOpen(true) }
  const openSearch = () => { setSearchEverOpened(true); setSearchOpen(true) }
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
  }, [page])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && (event.key.toLowerCase() === "k" || event.code === "KeyK")) {
        event.preventDefault()
        openSearch()
      }
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault()
        openSearch()
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
              <Button variant="ghost" size="icon" className="docs-mobile-menu" onClick={openMobileNav} aria-label="Open documentation navigation"><Menu size={18} /></Button>
              <a className="docs-brand" href={hrefFor("docs/introduction")} aria-label="@bzync/rui documentation home"><RuiBrandMark size={26} /><strong>@bzync/rui</strong></a>
              <Badge variant="muted" size="sm" className="docs-version">v{packageMetadata.version}</Badge>
              <nav className="docs-primary-nav" aria-label="Primary">
                <a href={hrefFor("docs/introduction")} aria-current={primaryArea === "docs" ? "page" : undefined}>Docs</a>
                <a href={hrefFor("components")} aria-current={primaryArea === "components" ? "page" : undefined}>Components</a>
                <a href={hrefFor("examples/settings")} aria-current={primaryArea === "examples" ? "page" : undefined}>Examples</a>
              </nav>
            </div>
            <div className="docs-header-actions">
              <button type="button" className="docs-search-trigger" onClick={openSearch} aria-label="Search documentation">
                <Search size={15} aria-hidden="true" /><span>Search documentation…</span><kbd><span className="mac-key">⌘</span><span className="ctrl-key">Ctrl</span> K</kbd>
              </button>
              <ThemeMenu />
              <a className="docs-icon-link" href={repoUrl} target="_blank" rel="noreferrer" aria-label="Open @bzync/rui repository"><GitBranch size={17} /></a>
            </div>
          </div>
        </header>

        <aside className="docs-sidebar"><SidebarNavigation activeSlug={activeSlug} /></aside>

        {drawerEverOpened && (
          <Suspense fallback={null}>
            <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
              <div className="mobile-drawer-search"><Button variant="secondary" icon={<Search size={15} aria-hidden="true" />} onClick={() => { setMobileOpen(false); openSearch() }}>Search documentation</Button></div>
              <SidebarNavigation activeSlug={activeSlug} onNavigate={() => setMobileOpen(false)} />
            </MobileNavDrawer>
          </Suspense>
        )}

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
                <span>React 18.2–19 · TypeScript · ESM + CJS</span>
                <span>Maintained by <a href="https://www.bzync.com" target="_blank" rel="noreferrer author">Rayan Reynaldo</a></span>
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

        {searchEverOpened && (
          <Suspense fallback={null}>
            <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
          </Suspense>
        )}
        <button
          type="button"
          className={cn("docs-back-to-top", showBackToTop && "visible")}
          aria-label="Back to top"
          tabIndex={showBackToTop ? 0 : -1}
          onClick={scrollToDocumentTop}
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

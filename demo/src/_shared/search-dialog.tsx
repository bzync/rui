import { Badge, Modal } from "@bzync/rui"
import { Search } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { allPages, type DocsPage } from "../docs/catalog"

function navigate(slug: string) {
  window.location.hash = `/${slug}`
}

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
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
  const activeResultId = results[activeIndex] ? `docs-search-result-${results[activeIndex].page.slug.replace(/\//g, "-")}` : undefined

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
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls="docs-search-results"
          aria-activedescendant={activeResultId}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              setActiveIndex(index => Math.min(index + 1, results.length - 1))
            } else if (event.key === "ArrowUp") {
              event.preventDefault()
              setActiveIndex(index => Math.max(index - 1, 0))
            } else if (event.key === "Enter" && results[activeIndex]) {
              select(results[activeIndex].page)
            } else if (event.key === "Home") {
              event.preventDefault()
              setActiveIndex(0)
            } else if (event.key === "End") {
              event.preventDefault()
              setActiveIndex(Math.max(results.length - 1, 0))
            }
          }}
        />
        <kbd>Esc</kbd>
      </div>
      <div id="docs-search-results" className="docs-search-results" role="listbox" aria-label="Search results">
        {results.length ? results.map(({ page }, index) => (
          <button id={`docs-search-result-${page.slug.replace(/\//g, "-")}`} type="button" role="option" aria-selected={index === activeIndex} key={page.slug} onMouseEnter={() => setActiveIndex(index)} onClick={() => select(page)}>
            <span><strong>{page.title}</strong><small>{page.description}</small></span>
            <Badge variant="muted" size="sm">{page.group}</Badge>
          </button>
        )) : <div className="docs-search-empty"><Search size={20} /><p>No documentation found for “{query}”.</p></div>}
      </div>
      <div className="docs-search-footer"><span><kbd>↑</kbd><kbd>↓</kbd> browse</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
    </Modal>
  )
}

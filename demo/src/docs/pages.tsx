"use client"

import { lazy } from "react"
import type { DocsPage } from "./catalog"

// Each documentation group is its own async chunk so a first visit (typically the
// Introduction page) only downloads that page's code, not the entire catalog of
// component demos. The <Suspense> boundary lives in App.tsx.
const GettingStartedPage = lazy(() => import("./pages/getting-started").then(m => ({ default: m.GettingStartedPage })))
const FoundationPage = lazy(() => import("./pages/foundations").then(m => ({ default: m.FoundationPage })))
const ComponentsPage = lazy(() => import("./pages/components").then(m => ({ default: m.ComponentsPage })))
const PatternPage = lazy(() => import("./pages/patterns").then(m => ({ default: m.PatternPage })))
const ExamplePage = lazy(() => import("./pages/examples").then(m => ({ default: m.ExamplePage })))
const ResourcePage = lazy(() => import("./pages/resources").then(m => ({ default: m.ResourcePage })))

export function DocsPageContent({ page }: { page: DocsPage }) {
  if (page.kind === "foundation") return <FoundationPage page={page} />
  if (page.kind === "component" || page.slug === "components") return <ComponentsPage page={page} />
  if (page.kind === "pattern") return <PatternPage page={page} />
  if (page.kind === "example") return <ExamplePage page={page} />
  if (page.kind === "resource") return <ResourcePage page={page} />
  return <GettingStartedPage page={page} />
}

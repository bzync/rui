/**
 * Production SEO primitives for @bzync/rui consumers.
 * Thin, framework-agnostic helpers that emit correct semantic HTML
 * and JSON-LD without taking over app-level <head> management.
 */
import { cn } from "@/lib/cn"

export interface SeoImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
}

/**
 * SEO-safe image that enforces alt text and mitigates CLS/LCP penalties.
 * Uses native <img> intentionally — library never assumes next/image availability.
 */
export function SeoImage({
  alt,
  loading = "lazy",
  decoding = "async",
  className,
  width,
  height,
  style,
  ...props
}: SeoImageProps) {
  if (!alt || alt.trim() === "") {
    console.warn("[rtui SeoImage] alt text is required for SEO and accessibility. Provide a descriptive alt.")
  }
  return (
    <img
      alt={alt}
      loading={loading}
      decoding={decoding}
      width={width}
      height={height}
      className={cn(width && height ? "h-auto" : undefined, className)}
      style={width && height ? { aspectRatio: `${width}/${height}`, ...style } : style}
      {...props}
    />
  )
}

export interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[]
  id?: string
}

/**
 * Emits application/ld+json. Use for Organization, Article, Product, FAQPage, etc.
 * Sanitizes via JSON.stringify — never use dangerouslySetInnerHTML with raw strings.
 */
export function StructuredData({ data, id }: StructuredDataProps) {
  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((entry, i) => (
        <script
          key={id ? `${id}-${i}` : i}
          id={id && payload.length === 1 ? id : undefined}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  )
}

export interface BreadcrumbJsonLdItem {
  name: string
  item?: string
}

export interface BreadcrumbJsonLdProps {
  items: BreadcrumbJsonLdItem[]
  id?: string
}

/**
 * Breadcrumb JSON-LD — pair with <Breadcrumb> for dual SEO signal (visible nav + structured data).
 * @example
 * <BreadcrumbJsonLd items={[{name:"Home", item:"https://example.com"}, {name:"Docs"}]} />
 */
export function BreadcrumbJsonLd({ items, id = "breadcrumb-jsonld" }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      ...(it.item ? { item: it.item } : {}),
    })),
  }
  return <StructuredData data={data} id={id} />
}

export interface ArticleJsonLdProps {
  headline: string
  description?: string
  url?: string
  image?: string
  authorName?: string
  datePublished?: string
  dateModified?: string
  id?: string
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  image,
  authorName,
  datePublished,
  dateModified,
  id = "article-jsonld",
}: ArticleJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    ...(description ? { description } : {}),
    ...(url ? { url } : {}),
    ...(image ? { image } : {}),
    ...(authorName ? { author: { "@type": "Person", name: authorName } } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  }
  return <StructuredData data={data} id={id} />
}

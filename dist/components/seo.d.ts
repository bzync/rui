export interface SeoImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}
/**
 * SEO-safe image that enforces alt text and mitigates CLS/LCP penalties.
 * Uses native <img> intentionally — library never assumes next/image availability.
 */
export declare function SeoImage({ alt, loading, decoding, className, width, height, style, ...props }: SeoImageProps): import("react").JSX.Element;
export interface StructuredDataProps {
    data: Record<string, unknown> | Record<string, unknown>[];
    id?: string;
}
/**
 * Emits application/ld+json. Use for Organization, Article, Product, FAQPage, etc.
 * Sanitizes via JSON.stringify — never use dangerouslySetInnerHTML with raw strings.
 */
export declare function StructuredData({ data, id }: StructuredDataProps): import("react").JSX.Element;
export interface BreadcrumbJsonLdItem {
    name: string;
    item?: string;
}
export interface BreadcrumbJsonLdProps {
    items: BreadcrumbJsonLdItem[];
    id?: string;
}
/**
 * Breadcrumb JSON-LD — pair with <Breadcrumb> for dual SEO signal (visible nav + structured data).
 * @example
 * <BreadcrumbJsonLd items={[{name:"Home", item:"https://example.com"}, {name:"Docs"}]} />
 */
export declare function BreadcrumbJsonLd({ items, id }: BreadcrumbJsonLdProps): import("react").JSX.Element;
export interface ArticleJsonLdProps {
    headline: string;
    description?: string;
    url?: string;
    image?: string;
    authorName?: string;
    datePublished?: string;
    dateModified?: string;
    id?: string;
}
export declare function ArticleJsonLd({ headline, description, url, image, authorName, datePublished, dateModified, id, }: ArticleJsonLdProps): import("react").JSX.Element;

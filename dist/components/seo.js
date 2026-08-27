import { t as e } from "../cn-DpgY2leY.js";
import { Fragment as t, jsx as n } from "react/jsx-runtime";
//#region src/components/seo.tsx
function r({ alt: t, loading: r = "lazy", decoding: i = "async", className: a, width: o, height: s, style: c, ...l }) {
	return (!t || t.trim() === "") && console.warn("[rtui SeoImage] alt text is required for SEO and accessibility. Provide a descriptive alt."), /* @__PURE__ */ n("img", {
		alt: t,
		loading: r,
		decoding: i,
		width: o,
		height: s,
		className: e(o && s ? "h-auto" : void 0, a),
		style: o && s ? {
			aspectRatio: `${o}/${s}`,
			...c
		} : c,
		...l
	});
}
function i({ data: e, id: r }) {
	let i = Array.isArray(e) ? e : [e];
	return /* @__PURE__ */ n(t, { children: i.map((e, t) => /* @__PURE__ */ n("script", {
		id: r && i.length === 1 ? r : void 0,
		type: "application/ld+json",
		dangerouslySetInnerHTML: { __html: JSON.stringify(e).replace(/</g, "\\u003c") }
	}, r ? `${r}-${t}` : t)) });
}
function a({ items: e, id: t = "breadcrumb-jsonld" }) {
	let r = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: e.map((e, t) => ({
			"@type": "ListItem",
			position: t + 1,
			name: e.name,
			...e.item ? { item: e.item } : {}
		}))
	};
	return /* @__PURE__ */ n(i, {
		data: r,
		id: t
	});
}
function o({ headline: e, description: t, url: r, image: a, authorName: o, datePublished: s, dateModified: c, id: l = "article-jsonld" }) {
	let u = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: e,
		...t ? { description: t } : {},
		...r ? { url: r } : {},
		...a ? { image: a } : {},
		...o ? { author: {
			"@type": "Person",
			name: o
		} } : {},
		...s ? { datePublished: s } : {},
		...c ? { dateModified: c } : {}
	};
	return /* @__PURE__ */ n(i, {
		data: u,
		id: l
	});
}
//#endregion
export { o as ArticleJsonLd, a as BreadcrumbJsonLd, r as SeoImage, i as StructuredData };

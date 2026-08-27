"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { s as t } from "../component-styles-Ce56hn9T.js";
import { jsx as n, jsxs as r } from "react/jsx-runtime";
//#region src/components/pagination.tsx
function i(e, t) {
	return Array.from({ length: t - e + 1 }, (t, n) => e + n);
}
function a(e, t, n) {
	if (t <= 7) return i(1, t);
	let r = Math.max(2, e - n), a = Math.min(t - 1, e + n), o = r > 2, s = a < t - 1;
	return !o && s ? [
		...i(1, 3 + n * 2),
		"…",
		t
	] : o && !s ? [
		1,
		"…",
		...i(t - 2 - n * 2, t)
	] : [
		1,
		"…",
		...i(r, a),
		"…",
		t
	];
}
var o = /* @__PURE__ */ n("svg", {
	width: "14",
	height: "14",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2.5",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	children: /* @__PURE__ */ n("path", { d: "m15 18-6-6 6-6" })
}), s = /* @__PURE__ */ n("svg", {
	width: "14",
	height: "14",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2.5",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	children: /* @__PURE__ */ n("path", { d: "m9 18 6-6-6-6" })
});
function c({ page: i, totalPages: c, onPageChange: l, siblingCount: u = 1, className: d }) {
	if (c <= 1) return null;
	let f = a(i, c, u);
	function p(r, a, o, s = !1) {
		return /* @__PURE__ */ n("button", {
			type: "button",
			disabled: o,
			onClick: () => !o && l(a),
			"aria-current": s ? "page" : void 0,
			"aria-label": typeof r == "number" ? `Page ${r}` : a < i ? "Previous page" : "Next page",
			className: e("flex items-center justify-center min-w-8 h-8 px-2 rounded-[var(--radius-md)] border text-sm font-medium transition-colors", t, s ? "border-accent-200 bg-accent-50 text-accent-700 dark:border-accent-500/20 dark:bg-accent-500/15 dark:text-accent-300" : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground", o && "opacity-40 cursor-not-allowed pointer-events-none"),
			children: r
		}, typeof r == "number" ? r : `${r}-${a}`);
	}
	return /* @__PURE__ */ r("nav", {
		className: e("flex items-center gap-1", d),
		"aria-label": "Pagination",
		children: [
			p(o, i - 1, i <= 1),
			f.map((e, t) => e === "…" ? /* @__PURE__ */ n("span", {
				className: "flex items-end justify-center w-8 h-8 text-slate-500 text-sm pb-1",
				children: "…"
			}, `dots-${t}`) : p(e, e, !1, e === i)),
			p(s, i + 1, i >= c)
		]
	});
}
//#endregion
export { c as Pagination };

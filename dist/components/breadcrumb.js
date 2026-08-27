import { t as e } from "../cn-DpgY2leY.js";
import { s as t } from "../component-styles-Ce56hn9T.js";
import { jsx as n, jsxs as r } from "react/jsx-runtime";
//#region src/components/breadcrumb.tsx
var i = () => /* @__PURE__ */ n("svg", {
	width: "12",
	height: "12",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className: "text-slate-400",
	children: /* @__PURE__ */ n("path", { d: "m9 18 6-6-6-6" })
});
function a({ items: a, separator: o, className: s, ...c }) {
	return /* @__PURE__ */ n("nav", {
		"aria-label": "Breadcrumb",
		className: e("flex min-w-0", s),
		...c,
		children: /* @__PURE__ */ n("ol", {
			className: "flex min-w-0 items-center gap-1.5 overflow-x-auto",
			children: a.map((s, c) => {
				let l = c === a.length - 1;
				return /* @__PURE__ */ r("li", {
					className: "flex items-center gap-1.5",
					children: [c > 0 && /* @__PURE__ */ n("span", {
						className: "flex items-center shrink-0",
						children: o ?? /* @__PURE__ */ n(i, {})
					}), s.href && !l ? /* @__PURE__ */ r("a", {
						href: s.href,
						className: e("flex items-center gap-1 rounded-sm text-sm text-muted-foreground hover:text-foreground transition-colors", t),
						children: [s.icon && /* @__PURE__ */ n("span", {
							className: "shrink-0",
							children: s.icon
						}), s.label]
					}) : /* @__PURE__ */ r("span", {
						className: e("flex items-center gap-1 text-sm", l ? "text-foreground font-medium" : "text-muted-foreground"),
						"aria-current": l ? "page" : void 0,
						children: [s.icon && /* @__PURE__ */ n("span", {
							className: "shrink-0",
							children: s.icon
						}), s.label]
					})]
				}, c);
			})
		})
	});
}
//#endregion
export { a as Breadcrumb };

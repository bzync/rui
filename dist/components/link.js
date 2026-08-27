import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/link.tsx
var r = {
	default: "text-accent-400 hover:text-accent-300",
	muted: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200",
	underline: "text-slate-700 dark:text-slate-200 underline underline-offset-2 decoration-black/25 dark:decoration-white/25 hover:decoration-black/50 dark:hover:decoration-white/50"
};
function i({ children: i, className: a, external: o, icon: s, variant: c = "default", externalRel: l, ...u }) {
	return /* @__PURE__ */ n("a", {
		target: o ? "_blank" : void 0,
		rel: o ? l ?? "noopener noreferrer" : void 0,
		referrerPolicy: o ? "strict-origin-when-cross-origin" : void 0,
		className: e("inline-flex items-center gap-1 transition-colors cursor-pointer", r[c], a),
		...u,
		children: [
			i,
			s && /* @__PURE__ */ t("span", {
				className: "shrink-0",
				"aria-hidden": "true",
				children: s
			}),
			o && !s && /* @__PURE__ */ n("svg", {
				"aria-hidden": "true",
				width: "11",
				height: "11",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ t("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
					/* @__PURE__ */ t("polyline", { points: "15 3 21 3 21 9" }),
					/* @__PURE__ */ t("line", {
						x1: "10",
						y1: "14",
						x2: "21",
						y2: "3"
					})
				]
			})
		]
	});
}
//#endregion
export { i as Link };

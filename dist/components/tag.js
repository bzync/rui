"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/tag.tsx
var r = {
	default: "bg-black/8 dark:bg-white/8 text-slate-700 dark:text-slate-200 border-black/12 dark:border-white/12",
	success: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
	warning: "bg-amber-500/12 text-amber-400 border-amber-500/20",
	error: "bg-red-500/12 text-red-400 border-red-500/20",
	info: "bg-sky-500/12 text-sky-400 border-sky-500/20"
}, i = {
	default: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200",
	success: "text-emerald-400 hover:text-emerald-300",
	warning: "text-amber-400 hover:text-amber-300",
	error: "text-red-400 hover:text-red-300",
	info: "text-sky-400 hover:text-sky-300"
}, a = {
	sm: "px-2 py-0.5 text-xs gap-1 rounded-md",
	md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg"
};
function o({ variant: o = "default", size: s = "md", onRemove: c, icon: l, disabled: u, className: d, children: f, ...p }) {
	return /* @__PURE__ */ n("span", {
		className: e("inline-flex items-center font-medium border transition-colors", r[o], a[s], u && "opacity-50", d),
		...p,
		children: [
			l && /* @__PURE__ */ t("span", {
				className: "shrink-0 w-3 h-3 flex items-center justify-center",
				children: l
			}),
			/* @__PURE__ */ t("span", {
				className: "truncate",
				children: f
			}),
			c && !u && /* @__PURE__ */ t("button", {
				type: "button",
				tabIndex: -1,
				onClick: (e) => {
					e.stopPropagation(), c();
				},
				className: e("shrink-0 ml-0.5 transition-colors cursor-pointer", i[o]),
				"aria-label": `Remove${typeof f == "string" ? ` ${f}` : ""}`,
				children: /* @__PURE__ */ t("svg", {
					width: "10",
					height: "10",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "3",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: /* @__PURE__ */ t("path", { d: "M18 6 6 18M6 6l12 12" })
				})
			})
		]
	});
}
//#endregion
export { o as Tag };

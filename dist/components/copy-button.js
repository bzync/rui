"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { AnimatePresence as t, motion as n } from "framer-motion";
import { useState as r } from "react";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/components/copy-button.tsx
var o = () => /* @__PURE__ */ a("svg", {
	width: "13",
	height: "13",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	children: [/* @__PURE__ */ i("rect", {
		width: "14",
		height: "14",
		x: "8",
		y: "8",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ i("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" })]
}), s = () => /* @__PURE__ */ i("svg", {
	width: "13",
	height: "13",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2.5",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	children: /* @__PURE__ */ i("path", { d: "m20 6-11 11-5-5" })
});
function c({ value: c, timeout: l = 2e3, label: u, size: d = "sm", className: f, ...p }) {
	let [m, h] = r(!1);
	async function g() {
		try {
			await navigator.clipboard.writeText(c), h(!0), setTimeout(() => h(!1), l);
		} catch {}
	}
	return /* @__PURE__ */ i("button", {
		type: "button",
		onClick: g,
		className: e("inline-flex items-center font-medium transition-colors select-none", "border border-black/10 dark:border-white/10", m ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-black/4 dark:bg-white/4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/8 dark:hover:bg-white/8", d === "sm" ? "h-6 px-2 text-xs gap-1 rounded-md" : "h-8 px-3 text-sm gap-1.5 rounded-lg", f),
		...p,
		children: /* @__PURE__ */ i(t, {
			mode: "wait",
			initial: !1,
			children: m ? /* @__PURE__ */ a(n.span, {
				initial: {
					scale: .8,
					opacity: 0
				},
				animate: {
					scale: 1,
					opacity: 1
				},
				exit: {
					scale: .8,
					opacity: 0
				},
				transition: { duration: .1 },
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ i(s, {}), u && "Copied"]
			}, "check") : /* @__PURE__ */ a(n.span, {
				initial: {
					scale: .8,
					opacity: 0
				},
				animate: {
					scale: 1,
					opacity: 1
				},
				exit: {
					scale: .8,
					opacity: 0
				},
				transition: { duration: .1 },
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ i(o, {}), u && u]
			}, "copy")
		})
	});
}
//#endregion
export { c as CopyButton };

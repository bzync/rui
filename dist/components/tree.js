"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { AnimatePresence as t, motion as n } from "framer-motion";
import { useState as r } from "react";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/components/tree.tsx
function o({ nodes: t, selected: n, onSelect: a, defaultExpanded: o = [], className: c }) {
	let [l, u] = r(new Set(o));
	function d(e) {
		u((t) => {
			let n = new Set(t);
			return n.has(e) ? n.delete(e) : n.add(e), n;
		});
	}
	return /* @__PURE__ */ i("div", {
		className: e("select-none", c),
		children: /* @__PURE__ */ i(s, {
			nodes: t,
			expanded: l,
			selected: n,
			onToggle: d,
			onSelect: a,
			depth: 0
		})
	});
}
function s({ nodes: r, expanded: o, selected: c, onToggle: l, onSelect: u, depth: d }) {
	return /* @__PURE__ */ i("ul", { children: r.map((r) => {
		let f = o.has(r.id), p = c === r.id, m = !!r.children?.length;
		return /* @__PURE__ */ a("li", { children: [/* @__PURE__ */ a("div", {
			style: { paddingLeft: d * 16 + 4 },
			onClick: () => {
				r.disabled || (m && l(r.id), u?.(r.id));
			},
			className: e("flex items-center gap-1.5 h-8 pr-2 rounded-lg cursor-pointer transition-colors group", p ? "bg-accent-500/10 text-accent-400" : "text-slate-600 dark:text-slate-300 hover:bg-black/6 dark:hover:bg-white/6", r.disabled && "opacity-40 cursor-not-allowed"),
			children: [
				m ? /* @__PURE__ */ i(n.span, {
					animate: { rotate: f ? 90 : 0 },
					transition: { duration: .15 },
					className: "shrink-0 w-4 flex items-center justify-center text-slate-500",
					children: /* @__PURE__ */ i("svg", {
						width: "12",
						height: "12",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: /* @__PURE__ */ i("path", { d: "m9 18 6-6-6-6" })
					})
				}) : /* @__PURE__ */ i("span", { className: "w-4 shrink-0" }),
				r.icon && /* @__PURE__ */ i("span", {
					className: e("shrink-0 w-4 h-4 flex items-center justify-center", p ? "text-accent-400" : "text-slate-500"),
					children: r.icon
				}),
				/* @__PURE__ */ i("span", {
					className: "flex-1 min-w-0 text-sm truncate",
					children: r.label
				})
			]
		}), /* @__PURE__ */ i(t, {
			initial: !1,
			children: m && f && /* @__PURE__ */ i(n.div, {
				initial: {
					height: 0,
					opacity: 0
				},
				animate: {
					height: "auto",
					opacity: 1
				},
				exit: {
					height: 0,
					opacity: 0
				},
				transition: { duration: .15 },
				className: "overflow-hidden",
				children: /* @__PURE__ */ i(s, {
					nodes: r.children,
					expanded: o,
					selected: c,
					onToggle: l,
					onSelect: u,
					depth: d + 1
				})
			})
		})] }, r.id);
	}) });
}
//#endregion
export { o as Tree };

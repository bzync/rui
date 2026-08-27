"use client";
import { t as e } from "../cn-DpgY2leY.js";
import "../component-styles-Ce56hn9T.js";
import { motion as t } from "framer-motion";
import { jsx as n, jsxs as r } from "react/jsx-runtime";
//#region src/components/alert.tsx
var i = {
	info: {
		container: "bg-sky-500/[0.07] dark:bg-sky-500/[0.09] border-sky-400/25 dark:border-sky-500/20",
		accent: "bg-sky-500",
		icon: "text-sky-600 dark:text-sky-400",
		title: "text-sky-900 dark:text-sky-100",
		body: "text-sky-800/90 dark:text-sky-200/70"
	},
	success: {
		container: "bg-emerald-500/[0.07] dark:bg-emerald-500/[0.09] border-emerald-400/25 dark:border-emerald-500/20",
		accent: "bg-emerald-500",
		icon: "text-emerald-600 dark:text-emerald-400",
		title: "text-emerald-900 dark:text-emerald-100",
		body: "text-emerald-800/90 dark:text-emerald-200/70"
	},
	warning: {
		container: "bg-amber-500/[0.07] dark:bg-amber-500/[0.09] border-amber-400/30 dark:border-amber-500/20",
		accent: "bg-amber-500",
		icon: "text-amber-600 dark:text-amber-400",
		title: "text-amber-900 dark:text-amber-100",
		body: "text-amber-800/90 dark:text-amber-200/70"
	},
	error: {
		container: "bg-red-500/[0.07] dark:bg-red-500/[0.09] border-red-400/25 dark:border-red-500/20",
		accent: "bg-red-500",
		icon: "text-red-600 dark:text-red-400",
		title: "text-red-900 dark:text-red-100",
		body: "text-red-800/90 dark:text-red-200/70"
	}
}, a = {
	info: /* @__PURE__ */ r("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ n("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}),
			/* @__PURE__ */ n("path", { d: "M12 16v-4" }),
			/* @__PURE__ */ n("path", { d: "M12 8h.01" })
		]
	}),
	success: /* @__PURE__ */ r("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ n("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ n("path", { d: "m9 11 3 3L22 4" })]
	}),
	warning: /* @__PURE__ */ r("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ n("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }),
			/* @__PURE__ */ n("path", { d: "M12 9v4" }),
			/* @__PURE__ */ n("path", { d: "M12 17h.01" })
		]
	}),
	error: /* @__PURE__ */ r("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ n("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}),
			/* @__PURE__ */ n("path", { d: "m15 9-6 6" }),
			/* @__PURE__ */ n("path", { d: "m9 9 6 6" })
		]
	})
};
function o({ variant: o = "info", title: s, icon: c, className: l, children: u, dismissable: d = !1, onDismiss: f, ...p }) {
	let m = i[o], h = c ?? a[o], g = o === "error" || o === "warning" ? "alert" : "status";
	return /* @__PURE__ */ r(t.div, {
		initial: {
			opacity: 0,
			y: -5
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .18,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		role: g,
		className: e("relative flex gap-3 rounded-[var(--radius-lg)] border overflow-hidden pl-4 pr-4 py-3.5", m.container, l),
		...p,
		children: [
			/* @__PURE__ */ n("span", {
				className: e("absolute left-0 inset-y-0 w-[3px]", m.accent),
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ n("span", {
				className: e("shrink-0 mt-0.5", m.icon),
				children: h
			}),
			/* @__PURE__ */ r("div", {
				className: "min-w-0 flex-1",
				children: [s && /* @__PURE__ */ n("p", {
					className: e("text-sm font-semibold leading-snug mb-0.5", m.title),
					children: s
				}), u && /* @__PURE__ */ n("div", {
					className: e("text-sm leading-relaxed", m.body),
					children: u
				})]
			}),
			d && /* @__PURE__ */ n("button", {
				type: "button",
				onClick: f,
				"aria-label": "Dismiss",
				className: e("shrink-0 mt-0.5 rounded-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg", m.icon),
				children: /* @__PURE__ */ r("svg", {
					width: "14",
					height: "14",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2.5",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: [/* @__PURE__ */ n("path", { d: "M18 6 6 18" }), /* @__PURE__ */ n("path", { d: "m6 6 12 12" })]
				})
			})
		]
	});
}
//#endregion
export { o as Alert };

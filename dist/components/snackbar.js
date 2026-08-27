"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { s as t } from "../component-styles-Ce56hn9T.js";
import { AnimatePresence as n, motion as r } from "framer-motion";
import { createContext as i, useCallback as a, useContext as o, useEffect as s, useRef as c, useState as l } from "react";
import { jsx as u, jsxs as d } from "react/jsx-runtime";
//#region src/components/snackbar.tsx
var f = i(null);
function p() {
	let e = o(f);
	if (!e) throw Error("useSnackbar must be inside <SnackbarProvider>");
	return e;
}
var m = {
	default: {
		bg: "border-border bg-surface-raised",
		icon: null
	},
	info: {
		bg: "bg-sky-500/[0.09] dark:bg-sky-500/[0.12] border-sky-500/25",
		icon: /* @__PURE__ */ d("svg", {
			width: "15",
			height: "15",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: "text-sky-400",
			children: [
				/* @__PURE__ */ u("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				/* @__PURE__ */ u("path", { d: "M12 16v-4" }),
				/* @__PURE__ */ u("path", { d: "M12 8h.01" })
			]
		})
	},
	success: {
		bg: "bg-emerald-500/[0.09] dark:bg-emerald-500/[0.12] border-emerald-500/25",
		icon: /* @__PURE__ */ d("svg", {
			width: "15",
			height: "15",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: "text-emerald-400",
			children: [/* @__PURE__ */ u("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ u("path", { d: "m9 11 3 3L22 4" })]
		})
	},
	warning: {
		bg: "bg-amber-500/[0.09] dark:bg-amber-500/[0.12] border-amber-500/25",
		icon: /* @__PURE__ */ d("svg", {
			width: "15",
			height: "15",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: "text-amber-400",
			children: [
				/* @__PURE__ */ u("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }),
				/* @__PURE__ */ u("path", { d: "M12 9v4" }),
				/* @__PURE__ */ u("path", { d: "M12 17h.01" })
			]
		})
	},
	error: {
		bg: "bg-red-500/[0.09] dark:bg-red-500/[0.12] border-red-500/25",
		icon: /* @__PURE__ */ d("svg", {
			width: "15",
			height: "15",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: "text-red-400",
			children: [
				/* @__PURE__ */ u("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				/* @__PURE__ */ u("path", { d: "m15 9-6 6" }),
				/* @__PURE__ */ u("path", { d: "m9 9 6 6" })
			]
		})
	}
}, h = {
	"top-left": "top-32 left-3 sm:top-4 sm:left-4",
	"top-center": "top-32 left-1/2 -translate-x-1/2 sm:top-4",
	"top-right": "top-32 right-3 sm:top-4 sm:right-4",
	"bottom-left": "bottom-3 left-3 sm:bottom-4 sm:left-4",
	"bottom-center": "bottom-3 left-1/2 -translate-x-1/2 sm:bottom-4",
	"bottom-right": "bottom-3 right-3 sm:bottom-4 sm:right-4"
}, g = {
	"top-left": { x: -14 },
	"top-center": { y: -14 },
	"top-right": { x: 14 },
	"bottom-left": { x: -14 },
	"bottom-center": { y: 14 },
	"bottom-right": { x: 14 }
};
function _({ children: i, position: o = "bottom-right", maxVisible: p = 5 }) {
	let [_, v] = l([]), y = c({});
	s(() => () => Object.values(y.current).forEach(clearTimeout), []);
	let b = a((e) => {
		clearTimeout(y.current[e]), delete y.current[e], v((t) => t.filter((t) => t.id !== e));
	}, []), x = a(() => {
		Object.values(y.current).forEach(clearTimeout), y.current = {}, v([]);
	}, []), S = a((e) => {
		let t = e.id ?? Math.random().toString(36).slice(2, 9);
		v((n) => {
			let r = e.id ? n.findIndex((e) => e.id === t) : -1;
			if (r === -1) return [{
				...e,
				id: t
			}, ...n].slice(0, p);
			let i = [...n];
			return i[r] = {
				...e,
				id: t
			}, i;
		}), clearTimeout(y.current[t]);
		let n = e.duration ?? 4e3;
		return n > 0 && (y.current[t] = setTimeout(() => b(t), n)), t;
	}, [b, p]), C = g[o];
	return /* @__PURE__ */ d(f.Provider, {
		value: {
			show: S,
			dismiss: b,
			dismissAll: x
		},
		children: [i, /* @__PURE__ */ u("div", {
			role: "region",
			"aria-label": "Notifications",
			"aria-live": "polite",
			className: e("fixed z-[100] flex flex-col gap-2 pointer-events-none", h[o]),
			children: /* @__PURE__ */ u(n, {
				mode: "popLayout",
				children: _.map((n) => {
					let { bg: i, icon: a } = m[n.variant ?? "default"];
					return /* @__PURE__ */ d(r.div, {
						layout: !0,
						initial: {
							...C,
							opacity: 0,
							scale: .95
						},
						animate: {
							x: 0,
							y: 0,
							opacity: 1,
							scale: 1
						},
						exit: {
							opacity: 0,
							scale: .92
						},
						transition: {
							type: "spring",
							stiffness: 400,
							damping: 30
						},
						className: e("pointer-events-auto flex items-start gap-3 rounded-[var(--radius-lg)] border px-4 py-3", "w-[calc(100vw-1.5rem)] max-w-sm shadow-floating sm:w-auto sm:min-w-[280px]", i),
						children: [
							a && /* @__PURE__ */ u("span", {
								className: "shrink-0 mt-0.5",
								children: a
							}),
							/* @__PURE__ */ d("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ u("div", {
									className: "text-sm leading-snug text-foreground",
									children: n.message
								}), n.action && /* @__PURE__ */ u("button", {
									type: "button",
									onClick: () => {
										n.action.onClick(), b(n.id);
									},
									className: "mt-1.5 text-xs font-semibold text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors",
									children: n.action.label
								})]
							}),
							/* @__PURE__ */ u("button", {
								type: "button",
								onClick: () => b(n.id),
								"aria-label": "Dismiss",
								className: e("mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground", t),
								children: /* @__PURE__ */ d("svg", {
									width: "14",
									height: "14",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [/* @__PURE__ */ u("path", { d: "M18 6 6 18" }), /* @__PURE__ */ u("path", { d: "m6 6 12 12" })]
								})
							})
						]
					}, n.id);
				})
			})
		})]
	});
}
//#endregion
export { _ as SnackbarProvider, p as useSnackbar };

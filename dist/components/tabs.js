"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { s as t } from "../component-styles-Ce56hn9T.js";
import { AnimatePresence as n, motion as r } from "framer-motion";
import { createContext as i, useContext as a, useId as o, useState as s } from "react";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/components/tabs.tsx
var u = i(null);
function d() {
	let e = a(u);
	if (!e) throw Error("Tabs subcomponents must be inside <Tabs>");
	return e;
}
function f({ defaultValue: t, value: n, children: r, className: i, orientation: a = "horizontal", onChange: l }) {
	let [d, f] = s(t), p = n ?? d, m = o();
	return /* @__PURE__ */ c(u.Provider, {
		value: {
			active: p,
			setActive: (e) => {
				n === void 0 && f(e), l?.(e);
			},
			orientation: a,
			tabsId: m
		},
		children: /* @__PURE__ */ c("div", {
			className: e(a === "vertical" ? "flex flex-col gap-4 sm:flex-row" : "flex flex-col", i),
			children: r
		})
	});
}
function p({ className: t, children: n, ...r }) {
	let { orientation: i } = d();
	return /* @__PURE__ */ c("div", {
		className: e("rounded-[var(--radius-md)] border border-border bg-surface-muted p-1", i === "vertical" ? "flex flex-row sm:flex-col gap-0.5 w-full sm:w-36 sm:shrink-0 overflow-x-auto" : "flex items-center gap-0.5 overflow-x-auto max-w-full scrollbar-none", t),
		role: "tablist",
		...r,
		children: n
	});
}
function m({ value: n, className: i, children: a, icon: o, onKeyDown: s, ...u }) {
	let { active: f, setActive: p, orientation: m, tabsId: h } = d(), g = f === n, _ = encodeURIComponent(n), v = `${h}-tab-${_}`, y = `${h}-panel-${_}`;
	function b(e) {
		if (s?.(e), e.defaultPrevented || !(m === "vertical" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"]).includes(e.key) && e.key !== "Home" && e.key !== "End") return;
		let t = e.currentTarget.closest("[role=\"tablist\"]"), n = Array.from(t?.querySelectorAll("[role=\"tab\"]:not(:disabled)") ?? []), r = n.indexOf(e.currentTarget);
		if (r < 0 || n.length === 0) return;
		e.preventDefault();
		let i = e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + n.length) % n.length;
		n[i]?.focus(), n[i]?.click();
	}
	return /* @__PURE__ */ l("button", {
		role: "tab",
		type: "button",
		id: v,
		"aria-controls": y,
		"aria-selected": g,
		tabIndex: g ? 0 : -1,
		onClick: () => p(n),
		onKeyDown: b,
		className: e("relative text-sm font-medium cursor-pointer transition-colors", m === "vertical" ? "flex items-center gap-2 w-full px-3 py-2 rounded-md text-left" : "px-3 py-1.5 rounded-md", t, g ? "text-foreground" : "text-muted-foreground hover:text-foreground", i),
		...u,
		children: [
			g && /* @__PURE__ */ c(r.span, {
				layoutId: `tab-bg-${h}`,
				className: "absolute inset-0 rounded-md border border-border bg-surface shadow-xs",
				transition: {
					type: "spring",
					stiffness: 450,
					damping: 32
				}
			}),
			o && /* @__PURE__ */ c("span", {
				className: "relative z-10 shrink-0 opacity-70",
				children: o
			}),
			/* @__PURE__ */ c("span", {
				className: "relative z-10",
				children: a
			})
		]
	});
}
function h({ value: t, className: i, children: a, ...o }) {
	let { active: s, orientation: l, tabsId: u } = d(), f = encodeURIComponent(t);
	return /* @__PURE__ */ c(n, {
		mode: "wait",
		children: s === t && /* @__PURE__ */ c(r.div, {
			initial: l === "vertical" ? {
				opacity: 0,
				x: 6
			} : {
				opacity: 0,
				y: 4
			},
			animate: l === "vertical" ? {
				opacity: 1,
				x: 0
			} : {
				opacity: 1,
				y: 0
			},
			exit: l === "vertical" ? {
				opacity: 0,
				x: -6
			} : {
				opacity: 0,
				y: -4
			},
			transition: { duration: .15 },
			role: "tabpanel",
			id: `${u}-panel-${f}`,
			"aria-labelledby": `${u}-tab-${f}`,
			tabIndex: 0,
			className: e(l === "vertical" ? "flex-1 min-w-0" : "mt-4", i),
			...o,
			children: a
		}, t)
	});
}
//#endregion
export { f as Tabs, h as TabsContent, p as TabsList, m as TabsTrigger };

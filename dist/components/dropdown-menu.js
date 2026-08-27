"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { AnimatePresence as t, motion as n } from "framer-motion";
import { cloneElement as r, isValidElement as i, useEffect as a, useRef as o, useState as s } from "react";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/components/dropdown-menu.tsx
function u(e) {
	return "items" in e;
}
var d = {
	bottom: "top-full mt-1.5",
	top: "bottom-full mb-1.5"
}, f = {
	start: "left-0",
	end: "right-0",
	center: "left-1/2 -translate-x-1/2"
}, p = {
	bottom: { y: -4 },
	top: { y: 4 }
};
function m({ trigger: m, items: h, side: g = "bottom", align: _ = "start", className: v, ariaLabel: y = "Actions menu" }) {
	let [b, x] = s(!1), S = o(null), C = o(null);
	a(() => {
		function e(e) {
			S.current?.contains(e.target) || x(!1);
		}
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, []), a(() => {
		b && C.current?.querySelector("[role=\"menuitem\"]:not(:disabled)")?.focus();
	}, [b]);
	function w() {
		x(!1), S.current?.querySelector("[aria-haspopup=\"menu\"]")?.focus();
	}
	function T(e) {
		let t = Array.from(C.current?.querySelectorAll("[role=\"menuitem\"]:not(:disabled)") ?? []), n = t.indexOf(document.activeElement);
		e.key === "Escape" ? (e.preventDefault(), w()) : [
			"ArrowDown",
			"ArrowUp",
			"Home",
			"End"
		].includes(e.key) && t.length > 0 && (e.preventDefault(), t[e.key === "Home" ? 0 : e.key === "End" ? t.length - 1 : (Math.max(n, 0) + (e.key === "ArrowDown" ? 1 : -1) + t.length) % t.length]?.focus());
	}
	function E(t, n) {
		return /* @__PURE__ */ l("button", {
			type: "button",
			disabled: t.disabled,
			role: "menuitem",
			onClick: () => {
				t.disabled || (t.onClick?.(), x(!1));
			},
			className: e("flex min-h-9 items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md transition-colors text-left focus-visible:outline-none focus-visible:bg-surface-muted", t.destructive ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-surface-muted", t.disabled && "opacity-40 cursor-not-allowed pointer-events-none"),
			children: [
				t.icon && /* @__PURE__ */ c("span", {
					className: e("shrink-0", t.destructive ? "text-red-400" : "text-slate-500 dark:text-slate-400"),
					children: t.icon
				}),
				/* @__PURE__ */ c("span", {
					className: "flex-1 min-w-0 truncate",
					children: t.label
				}),
				t.shortcut && /* @__PURE__ */ c("span", {
					className: "text-[10px] text-slate-500 shrink-0 font-mono",
					children: t.shortcut
				})
			]
		}, n);
	}
	let D = i(m) ? r(m, {
		"aria-haspopup": "menu",
		"aria-expanded": b,
		onClick: (e) => {
			m.props.onClick?.(e), e.defaultPrevented || x((e) => !e);
		}
	}) : /* @__PURE__ */ c("button", {
		type: "button",
		"aria-haspopup": "menu",
		"aria-expanded": b,
		onClick: () => x((e) => !e),
		children: m
	});
	return /* @__PURE__ */ l("div", {
		ref: S,
		className: "relative inline-flex",
		children: [D, /* @__PURE__ */ c(t, { children: b && /* @__PURE__ */ c(n.div, {
			ref: C,
			role: "menu",
			"aria-label": y,
			onKeyDown: T,
			initial: {
				opacity: 0,
				scaleY: .96,
				...p[g]
			},
			animate: {
				opacity: 1,
				scaleY: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				scaleY: .96,
				...p[g]
			},
			transition: { duration: .13 },
			style: { originY: g === "bottom" ? 0 : 1 },
			className: e("absolute z-50 min-w-[180px] rounded-[var(--radius-lg)] border border-border bg-surface-raised shadow-floating", "p-1", d[g], f[_], v),
			children: h.map((e, t) => u(e) ? /* @__PURE__ */ l("div", { children: [
				t > 0 && /* @__PURE__ */ c("div", {
					role: "separator",
					className: "my-1 border-t border-border"
				}),
				e.group && /* @__PURE__ */ c("p", {
					className: "px-3 pt-1.5 pb-1 text-xs font-medium text-muted-foreground",
					children: e.group
				}),
				e.items.map((e, t) => E(e, t))
			] }, t) : E(e, t))
		}) })]
	});
}
//#endregion
export { m as DropdownMenu };

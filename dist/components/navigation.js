"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { c as t, s as n } from "../component-styles-Ce56hn9T.js";
import { Fragment as r, jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/components/navigation.tsx
function o({ id: t, label: o, href: s, icon: c, badge: l, disabled: u, active: d, compact: f, onSelect: p, className: m }) {
	let h = /* @__PURE__ */ a(r, { children: [
		c && /* @__PURE__ */ i("span", {
			className: "shrink-0",
			"aria-hidden": "true",
			children: c
		}),
		/* @__PURE__ */ i("span", {
			className: e("truncate", f && "text-[11px]"),
			children: o
		}),
		l && /* @__PURE__ */ i("span", {
			className: "ml-auto shrink-0",
			children: l
		})
	] }), g = e("group relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors", n, f ? "min-h-11 flex-col px-2 py-1.5" : "h-9 px-3 text-sm", d ? "bg-accent-50 text-accent-700 dark:bg-accent-500/12 dark:text-accent-300" : "text-muted-foreground hover:bg-muted hover:text-foreground", u && "pointer-events-none opacity-40", m);
	return s ? /* @__PURE__ */ i("a", {
		href: s,
		className: g,
		"aria-current": d ? "page" : void 0,
		"aria-disabled": u || void 0,
		onClick: (e) => {
			p && (e.preventDefault(), p(t));
		},
		children: h
	}) : /* @__PURE__ */ i("button", {
		type: "button",
		className: g,
		"aria-current": d ? "page" : void 0,
		disabled: u,
		onClick: () => p?.(t),
		children: h
	});
}
function s({ items: t, activeId: n, onSelect: r, ariaLabel: s = "Primary navigation", className: c, children: l, ...u }) {
	return /* @__PURE__ */ a("nav", {
		"aria-label": s,
		className: e("flex min-h-14 items-center gap-1 border border-border bg-surface px-3", c),
		...u,
		children: [l, /* @__PURE__ */ i("div", {
			className: "ml-auto flex items-center gap-1 overflow-x-auto",
			children: t.map((e) => /* @__PURE__ */ i(o, {
				...e,
				active: n === e.id,
				onSelect: r
			}, e.id))
		})]
	});
}
function c({ className: t, children: n, ...r }) {
	return /* @__PURE__ */ i("header", {
		className: e("flex min-h-14 items-center gap-3 border-b border-border bg-bg/95 px-4 backdrop-blur-sm", t),
		...r,
		children: n
	});
}
function l({ as: t = "h2", className: n, children: r, ...a }) {
	return /* @__PURE__ */ i(t, {
		className: e("min-w-0 flex-1 truncate text-sm font-semibold text-foreground", n),
		...a,
		children: r
	});
}
function u({ items: t, activeId: n, onSelect: r, ariaLabel: s = "Sidebar navigation", header: c, footer: l, className: u, ...d }) {
	return /* @__PURE__ */ a("aside", {
		className: e("flex w-60 flex-col border border-border bg-surface", u),
		...d,
		children: [
			c && /* @__PURE__ */ i("div", {
				className: "border-b border-border p-4",
				children: c
			}),
			/* @__PURE__ */ i("nav", {
				"aria-label": s,
				className: "flex flex-1 flex-col gap-1 p-2",
				children: t.map((e) => /* @__PURE__ */ i(o, {
					...e,
					active: n === e.id,
					onSelect: r,
					className: "w-full justify-start"
				}, e.id))
			}),
			l && /* @__PURE__ */ i("div", {
				className: "border-t border-border p-3",
				children: l
			})
		]
	});
}
function d({ items: t, activeId: n, onSelect: r, ariaLabel: a = "Mobile navigation", className: s, ...c }) {
	return /* @__PURE__ */ i("nav", {
		"aria-label": a,
		className: e("grid min-h-16 border border-border bg-surface/95 px-1 pb-safe-bottom shadow-floating backdrop-blur-sm", s),
		style: { gridTemplateColumns: `repeat(${t.length}, minmax(0, 1fr))` },
		...c,
		children: t.map((e) => /* @__PURE__ */ i(o, {
			...e,
			compact: !0,
			active: n === e.id,
			onSelect: r,
			className: "rounded-none"
		}, e.id))
	});
}
function f({ label: n, className: r, children: a, type: o = "button", ...s }) {
	return /* @__PURE__ */ i("button", {
		type: o,
		"aria-label": n,
		className: e(t, "size-9", r),
		...s,
		children: a
	});
}
function p({ mark: t, className: r, children: i, ...o }) {
	return /* @__PURE__ */ a("a", {
		className: e("inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground", n, r),
		...o,
		children: [t, i]
	});
}
//#endregion
export { d as BottomBar, p as BrandLink, f as IconButton, s as Navbar, o as NavigationLink, u as Sidebar, c as Topbar, l as TopbarTitle };

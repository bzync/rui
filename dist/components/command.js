"use client";
import { t as e } from "../cn-DpgY2leY.js";
import "../component-styles-Ce56hn9T.js";
import { t } from "../focus-Dk1YWVPN.js";
import { AnimatePresence as n, motion as r } from "framer-motion";
import { createContext as i, useContext as a, useEffect as o, useId as s, useMemo as c, useRef as l, useState as u } from "react";
import { jsx as d, jsxs as f } from "react/jsx-runtime";
//#region src/components/command.tsx
var p = i(null);
function m() {
	let e = a(p);
	if (!e) throw Error("useCommand must be inside <CommandProvider>");
	return e;
}
function h({ children: e, shortcut: t = "k" }) {
	let [n, r] = u(!1);
	return o(() => {
		function e(e) {
			(e.metaKey || e.ctrlKey) && e.key === t && (e.preventDefault(), r((e) => !e));
		}
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [t]), /* @__PURE__ */ d(p.Provider, {
		value: {
			open: n,
			setOpen: r
		},
		children: e
	});
}
function g({ items: i, placeholder: a = "Search commands…", emptyText: p = "No results found.", ariaLabel: h = "Command palette" }) {
	let { open: g, setOpen: _ } = m(), [v, y] = u(""), [b, x] = u(0), S = l(null), C = l(null), w = l(null), T = s();
	o(() => {
		if (!g) return;
		let e = document.activeElement instanceof HTMLElement ? document.activeElement : null, n = document.body.style.overflow, r = window.setTimeout(() => S.current?.focus(), 0), i = (e) => {
			if (e.key === "Escape") {
				e.preventDefault(), _(!1);
				return;
			}
			if (e.key !== "Tab" || !w.current) return;
			let n = t(w.current);
			if (n.length === 0) {
				e.preventDefault(), w.current.focus();
				return;
			}
			let r = n[0], i = n[n.length - 1];
			e.shiftKey && document.activeElement === r ? (e.preventDefault(), i.focus()) : !e.shiftKey && document.activeElement === i && (e.preventDefault(), r.focus());
		};
		return y(""), x(0), document.body.style.overflow = "hidden", document.addEventListener("keydown", i), () => {
			window.clearTimeout(r), document.body.style.overflow = n, document.removeEventListener("keydown", i), e?.focus();
		};
	}, [g, _]);
	let E = c(() => {
		if (!v) return i;
		let e = v.toLowerCase();
		return i.filter((t) => t.label.toLowerCase().includes(e) || t.description?.toLowerCase().includes(e) || t.keywords?.some((t) => t.toLowerCase().includes(e)));
	}, [v, i]), D = c(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of E) {
			let n = t.group ?? "";
			e.has(n) || e.set(n, []), e.get(n).push(t);
		}
		return e;
	}, [E]), O = c(() => Array.from(D.values()).flat(), [D]);
	function k(e) {
		e.key === "ArrowDown" ? (e.preventDefault(), x((e) => Math.min(e + 1, Math.max(O.length - 1, 0)))) : e.key === "ArrowUp" ? (e.preventDefault(), x((e) => Math.max(e - 1, 0))) : e.key === "Enter" ? (e.preventDefault(), O[b]?.onSelect(), _(!1)) : e.key === "Escape" && _(!1);
	}
	o(() => {
		C.current && C.current.querySelector("[data-active=\"true\"]")?.scrollIntoView({ block: "nearest" });
	}, [b]);
	let A = 0;
	return /* @__PURE__ */ d(n, { children: g && /* @__PURE__ */ f("div", {
		className: "fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4",
		children: [/* @__PURE__ */ d(r.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: .15 },
			className: "absolute inset-0 bg-overlay",
			onClick: () => _(!1),
			"aria-hidden": "true"
		}), /* @__PURE__ */ f(r.div, {
			ref: w,
			tabIndex: -1,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": h,
			initial: {
				opacity: 0,
				scale: .96,
				y: -8
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				scale: .96,
				y: -8
			},
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 30
			},
			className: "relative w-full max-w-lg overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface-raised shadow-overlay",
			children: [/* @__PURE__ */ f("div", {
				className: "flex items-center gap-3 border-b border-border px-4",
				children: [
					/* @__PURE__ */ f("svg", {
						width: "16",
						height: "16",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						className: "text-slate-400 shrink-0",
						children: [/* @__PURE__ */ d("circle", {
							cx: "11",
							cy: "11",
							r: "8"
						}), /* @__PURE__ */ d("path", { d: "m21 21-4.35-4.35" })]
					}),
					/* @__PURE__ */ d("input", {
						ref: S,
						type: "search",
						role: "combobox",
						"aria-label": h,
						"aria-autocomplete": "list",
						"aria-expanded": "true",
						"aria-controls": T,
						"aria-activedescendant": O[b] ? `${T}-option-${b}` : void 0,
						value: v,
						onChange: (e) => {
							y(e.target.value), x(0);
						},
						onKeyDown: k,
						placeholder: a,
						className: "min-w-0 flex-1 bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
					}),
					/* @__PURE__ */ d("kbd", {
						className: "shrink-0 rounded-[var(--radius-sm)] border border-border-strong bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground",
						children: "ESC"
					})
				]
			}), /* @__PURE__ */ d("div", {
				id: T,
				ref: C,
				role: "listbox",
				"aria-label": "Commands",
				className: "max-h-80 overflow-y-auto py-1.5",
				children: E.length === 0 ? /* @__PURE__ */ d("p", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: p
				}) : Array.from(D.entries()).map(([t, n]) => /* @__PURE__ */ f("div", {
					role: "group",
					"aria-label": t || void 0,
					children: [t && /* @__PURE__ */ d("p", {
						className: "px-4 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest",
						children: t
					}), n.map((t) => {
						let n = A++, r = n === b;
						return /* @__PURE__ */ f("button", {
							id: `${T}-option-${n}`,
							type: "button",
							role: "option",
							"aria-selected": r,
							"data-active": r,
							onClick: () => {
								t.onSelect(), _(!1);
							},
							onMouseEnter: () => x(n),
							className: e("flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg", r ? "bg-surface-muted" : "hover:bg-surface-muted/70"),
							children: [
								t.icon && /* @__PURE__ */ d("span", {
									className: "shrink-0 text-slate-500 dark:text-slate-400 w-5 flex items-center justify-center",
									children: t.icon
								}),
								/* @__PURE__ */ f("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ d("p", {
										className: "truncate text-sm text-foreground",
										children: t.label
									}), t.description && /* @__PURE__ */ d("p", {
										className: "truncate text-xs text-muted-foreground",
										children: t.description
									})]
								}),
								t.shortcut && /* @__PURE__ */ d("div", {
									className: "flex items-center gap-0.5 shrink-0",
									children: t.shortcut.map((e, t) => /* @__PURE__ */ d("kbd", {
										className: "rounded-[var(--radius-sm)] border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground",
										children: e
									}, t))
								})
							]
						}, t.id);
					})]
				}, t))
			})]
		})]
	}) });
}
//#endregion
export { g as CommandPalette, h as CommandProvider, m as useCommand };

import { t as e } from "./cn-DpgY2leY.js";
import { o as t, t as n } from "./component-styles-Ce56hn9T.js";
import { o as r } from "./utils-CQ8pvCtk.js";
import { t as i } from "./use-event-callback-DGkfO_uu.js";
import { AnimatePresence as a, motion as o } from "framer-motion";
import { forwardRef as s, useCallback as c, useEffect as l, useId as u, useMemo as d, useRef as f, useState as p } from "react";
import { Fragment as m, jsx as h, jsxs as g } from "react/jsx-runtime";
import { createPortal as _ } from "react-dom";
//#region src/components/autocomplete/icons.tsx
var v = ({ size: e = 12 }) => /* @__PURE__ */ h("svg", {
	width: e,
	height: e,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2.5",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	children: /* @__PURE__ */ h("path", { d: "M18 6 6 18M6 6l12 12" })
}), y = () => /* @__PURE__ */ g("svg", {
	className: "animate-spin shrink-0 w-3.5 h-3.5 text-slate-500",
	viewBox: "0 0 24 24",
	fill: "none",
	children: [/* @__PURE__ */ h("circle", {
		className: "opacity-20",
		cx: "12",
		cy: "12",
		r: "10",
		stroke: "currentColor",
		strokeWidth: "3"
	}), /* @__PURE__ */ h("path", {
		className: "opacity-70",
		fill: "currentColor",
		d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
	})]
});
function b({ text: e, query: t }) {
	if (!t) return /* @__PURE__ */ h(m, { children: e });
	let n = e.toLowerCase().indexOf(t.toLowerCase());
	return n === -1 ? /* @__PURE__ */ h(m, { children: e }) : /* @__PURE__ */ g(m, { children: [
		e.slice(0, n),
		/* @__PURE__ */ h("mark", {
			className: "bg-blue-500/25 text-blue-700 dark:text-blue-200 rounded-sm not-italic",
			children: e.slice(n, n + t.length)
		}),
		e.slice(n + t.length)
	] });
}
//#endregion
//#region src/components/autocomplete/single-trigger.tsx
function x({ inputRef: t, inputId: r, listId: i, open: a, activeIdx: o, inputText: s, prefix: c, placeholder: l, disabled: u, error: d, loading: f, showClear: p, onInputChange: m, onFocus: _, onKeyDown: b, onClear: x, messageId: S, inputProps: C }) {
	return /* @__PURE__ */ g("div", {
		className: e("flex h-9 items-center gap-2 rounded-[var(--radius-md)] px-3", n, d && "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/20", u && "opacity-50 cursor-not-allowed"),
		children: [
			c && /* @__PURE__ */ h("span", {
				className: "text-slate-500 shrink-0 text-sm",
				children: c
			}),
			/* @__PURE__ */ h("input", {
				...C,
				ref: t,
				id: r,
				role: "combobox",
				"aria-autocomplete": "list",
				"aria-expanded": a,
				"aria-controls": i,
				"aria-activedescendant": o >= 0 ? `${i}-opt-${o}` : void 0,
				"aria-invalid": d ? !0 : void 0,
				"aria-describedby": S,
				autoComplete: "off",
				value: s,
				onChange: m,
				onFocus: _,
				onKeyDown: b,
				placeholder: l,
				disabled: u,
				className: "flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed"
			}),
			f && /* @__PURE__ */ h(y, {}),
			p && !f && /* @__PURE__ */ h("button", {
				type: "button",
				onClick: x,
				className: "shrink-0 text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors",
				children: /* @__PURE__ */ h(v, {})
			})
		]
	});
}
//#endregion
//#region src/components/autocomplete/multi-trigger.tsx
function S({ inputRef: t, inputId: r, listId: i, open: a, activeIdx: o, inputText: s, prefix: c, placeholder: l, disabled: u, error: d, loading: f, showClear: p, selected: m, onContainerClick: _, onInputChange: b, onFocus: x, onKeyDown: S, onRemove: C, onClearAll: w, messageId: T, inputProps: E }) {
	return /* @__PURE__ */ g("div", {
		onClick: _,
		className: e("flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1.5 cursor-text", n, d && "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/20", u && "opacity-50 cursor-not-allowed"),
		children: [
			c && /* @__PURE__ */ h("span", {
				className: "text-slate-500 shrink-0 text-sm",
				children: c
			}),
			m.map((e) => /* @__PURE__ */ g("span", {
				className: "inline-flex max-w-[200px] items-center gap-1 rounded-md border border-border bg-surface-muted px-2 py-0.5 text-xs font-medium text-foreground",
				children: [
					e.icon && /* @__PURE__ */ h("span", {
						className: "shrink-0 text-slate-500 dark:text-slate-400",
						children: e.icon
					}),
					/* @__PURE__ */ h("span", {
						className: "truncate",
						children: e.label
					}),
					/* @__PURE__ */ h("button", {
						type: "button",
						tabIndex: -1,
						onMouseDown: (e) => e.preventDefault(),
						onClick: (t) => {
							t.stopPropagation(), C(e);
						},
						disabled: u,
						className: "shrink-0 text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer ml-0.5",
						"aria-label": `Remove ${e.label}`,
						children: /* @__PURE__ */ h(v, { size: 10 })
					})
				]
			}, String(e.value))),
			/* @__PURE__ */ h("input", {
				...E,
				ref: t,
				id: r,
				role: "combobox",
				"aria-autocomplete": "list",
				"aria-expanded": a,
				"aria-controls": i,
				"aria-activedescendant": o >= 0 ? `${i}-opt-${o}` : void 0,
				"aria-invalid": d ? !0 : void 0,
				"aria-describedby": T,
				autoComplete: "off",
				value: s,
				onChange: b,
				onFocus: x,
				onKeyDown: S,
				placeholder: m.length === 0 ? l : void 0,
				disabled: u,
				className: "flex-1 min-w-[80px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed py-0.5"
			}),
			/* @__PURE__ */ g("span", {
				className: "ml-auto flex items-center gap-1.5 shrink-0",
				children: [
					f && /* @__PURE__ */ h(y, {}),
					p && !f && /* @__PURE__ */ h("button", {
						type: "button",
						onMouseDown: (e) => e.preventDefault(),
						onClick: (e) => {
							e.stopPropagation(), w();
						},
						className: "text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",
						"aria-label": "Clear all",
						children: /* @__PURE__ */ h(v, {})
					}),
					m.length > 0 && /* @__PURE__ */ h("span", {
						className: "text-[10px] font-medium text-slate-500 tabular-nums",
						children: m.length
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/autocomplete/dropdown.tsx
function C({ listRef: t, listId: n, open: r, pos: i, multiple: s, loading: c, filtered: l, emptyMessage: u, activeIdx: d, setActiveIdx: f, inputText: p, selectedValues: m, singleValue: v, onSelectSingle: x, onToggleMulti: S, className: C }) {
	return typeof document > "u" ? null : _(/* @__PURE__ */ h(a, { children: r && i && /* @__PURE__ */ h(o.ul, {
		ref: t,
		id: n,
		role: "listbox",
		"aria-multiselectable": s,
		initial: {
			opacity: 0,
			y: i.placement === "bottom" ? -4 : 4
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: i.placement === "bottom" ? -4 : 4
		},
		transition: { duration: .13 },
		style: {
			position: "fixed",
			top: i.top,
			left: i.left,
			width: i.width,
			maxHeight: i.maxHeight
		},
		className: e("z-[110] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface-raised py-1 shadow-floating", C),
		children: c ? /* @__PURE__ */ g("li", {
			className: "px-4 py-3 text-sm text-slate-600 flex items-center gap-2",
			children: [/* @__PURE__ */ h(y, {}), "Loading…"]
		}) : l.length === 0 ? /* @__PURE__ */ h("li", {
			className: "px-4 py-3 text-sm text-slate-600",
			children: u
		}) : l.map((t, r) => {
			let i = r === d, a = s ? m.includes(t.value) : t.value === v;
			return /* @__PURE__ */ g("li", {
				id: `${n}-opt-${r}`,
				role: "option",
				"aria-selected": a,
				onMouseDown: (e) => e.preventDefault(),
				onClick: () => s ? S(t) : x(t),
				onMouseEnter: () => f(r),
				className: e("flex min-h-9 items-center gap-3 px-3 py-2 cursor-pointer transition-colors", i && "bg-surface-muted", a && !i && "bg-accent-50 dark:bg-accent-500/10"),
				children: [
					t.icon && /* @__PURE__ */ h("span", {
						className: "shrink-0 text-slate-500 dark:text-slate-400",
						children: t.icon
					}),
					/* @__PURE__ */ g("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ h("p", {
							className: e("text-sm", a ? "text-accent-700 dark:text-accent-300 font-medium" : "text-foreground"),
							children: /* @__PURE__ */ h(b, {
								text: t.label,
								query: p
							})
						}), t.description && /* @__PURE__ */ h("p", {
							className: "text-xs text-slate-500 mt-0.5 truncate",
							children: t.description
						})]
					}),
					a && /* @__PURE__ */ h("svg", {
						"aria-hidden": "true",
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						className: "text-accent-600 shrink-0",
						children: /* @__PURE__ */ h("path", { d: "m20 6-11 11-5-5" })
					})
				]
			}, String(t.value));
		})
	}) }), document.body);
}
//#endregion
//#region src/components/autocomplete.tsx
function w(n, a) {
	let { options: o, inputValue: s, onInputChange: _, label: v, hint: y, error: b, prefix: w, clearable: T = !0, loading: E = !1, emptyMessage: ee = "No results", maxVisible: te = 8, className: ne, wrapperClassName: re, listClassName: ie, placeholder: D, disabled: O, id: ae, multiple: k, unstyled: oe = !1, ...A } = n, { value: se, onSelect: ce, onDeselect: le, ...j } = A, ue = u(), M = ae ?? ue, N = `${M}-list`, P = `${M}-message`, [de, fe] = p(""), F = s === void 0 ? de : s, pe = i((e) => _?.(e)), I = c((e) => {
		s === void 0 ? fe(e) : pe(e);
	}, [s, pe]), [me, L] = p([]), R = d(() => {
		if (!k) return [];
		let e = n;
		return e.value === void 0 ? me : o.filter((t) => e.value.includes(t.value));
	}, [
		k,
		o,
		n,
		me
	]), z = d(() => R.map((e) => e.value), [R]), [B, V] = p(!1), [H, U] = p(-1), W = f(null), G = f(null), K = f(null), [q, J] = p(""), Y = d(() => {
		let e = q.trim().toLowerCase();
		return o.filter((t) => !t.disabled && t.label.toLowerCase().includes(e)).slice(0, te);
	}, [
		o,
		q,
		te
	]), X = c((e) => {
		n.onSelect?.(e), I(e.label), V(!1), U(-1);
	}, [n, I]), he = c((e) => {
		let t = n, r = [...R, e];
		t.value === void 0 && L(r), t.onSelect?.(e, r), I(""), U(-1), G.current?.focus();
	}, [
		R,
		n,
		I
	]), Z = c((e) => {
		let t = n, r = R.filter((t) => t.value !== e.value);
		t.value === void 0 && L(r), t.onDeselect?.(e, r);
	}, [R, n]), Q = c((e) => {
		z.includes(e.value) ? Z(e) : he(e);
	}, [
		z,
		Z,
		he
	]), ge = c(() => {
		I(""), n.onSelect?.({
			value: "",
			label: ""
		}), V(!1);
	}, [n, I]), _e = c(() => {
		n.value === void 0 && L([]), I("");
	}, [n, I]), ve = c((e) => {
		if (k && e.key === "Backspace" && F === "" && R.length > 0) {
			Z(R[R.length - 1]);
			return;
		}
		if (!B) {
			(e.key === "ArrowDown" || e.key === "ArrowUp") && (V(!0), J(""));
			return;
		}
		if (e.key === "ArrowDown") e.preventDefault(), U((e) => Math.min(e + 1, Y.length - 1));
		else if (e.key === "ArrowUp") e.preventDefault(), U((e) => Math.max(e - 1, 0));
		else if (e.key === "Enter") {
			e.preventDefault();
			let t = Y[H];
			if (!t) return;
			k ? Q(t) : X(t);
		} else e.key === "Escape" && (V(!1), U(-1));
	}, [
		k,
		F,
		R,
		B,
		Y,
		H,
		Q,
		X,
		Z
	]);
	l(() => {
		H < 0 || !K.current || K.current.children[H]?.scrollIntoView({ block: "nearest" });
	}, [H]), l(() => {
		function e(e) {
			let t = e.target;
			!W.current?.contains(t) && !K.current?.contains(t) && V(!1);
		}
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, []);
	let ye = k ? void 0 : n.value, be = !!(!k && T && F.length > 0 && !O), xe = !!(k && T && (R.length > 0 || F.length > 0) && !O), Se = r(B, W), $ = c((e) => {
		I(e.target.value), J(e.target.value), V(!0), U(-1);
	}, [I]), Ce = c(() => {
		V(!0), J("");
	}, []);
	return oe ? /* @__PURE__ */ g("div", {
		ref: W,
		className: e(ne, re),
		children: [/* @__PURE__ */ h("input", {
			ref: a,
			id: M,
			value: F,
			onChange: $,
			placeholder: D,
			disabled: O
		}), B && /* @__PURE__ */ h("ul", {
			ref: K,
			id: N,
			className: ie,
			children: Y.map((e) => /* @__PURE__ */ h("li", {
				onClick: () => k ? Q(e) : X(e),
				children: e.label
			}, String(e.value)))
		})]
	}) : /* @__PURE__ */ g("div", {
		ref: W,
		className: e("relative", t, re, ne),
		children: [
			v && /* @__PURE__ */ g("label", {
				htmlFor: M,
				className: "text-sm font-medium leading-5 text-foreground",
				children: [v, A.required && /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("span", {
					"aria-hidden": "true",
					className: "ml-1 text-destructive",
					children: "*"
				}), /* @__PURE__ */ h("span", {
					className: "sr-only",
					children: " (required)"
				})] })]
			}),
			!k && /* @__PURE__ */ h(x, {
				inputRef: a,
				inputId: M,
				listId: N,
				open: B,
				activeIdx: H,
				inputText: F,
				prefix: w,
				placeholder: D,
				disabled: O,
				error: b,
				loading: E,
				showClear: be,
				onInputChange: $,
				onFocus: Ce,
				onKeyDown: ve,
				onClear: ge,
				messageId: b || y ? P : void 0,
				inputProps: j
			}),
			k && /* @__PURE__ */ h(S, {
				inputRef: (e) => {
					G.current = e, typeof a == "function" ? a(e) : a && (a.current = e);
				},
				inputId: M,
				listId: N,
				open: B,
				activeIdx: H,
				inputText: F,
				prefix: w,
				placeholder: D,
				disabled: O,
				error: b,
				loading: E,
				showClear: xe,
				selected: R,
				onContainerClick: () => {
					O || (G.current?.focus(), V(!0), J(""));
				},
				onInputChange: $,
				onFocus: Ce,
				onKeyDown: ve,
				onRemove: Z,
				onClearAll: _e,
				messageId: b || y ? P : void 0,
				inputProps: j
			}),
			/* @__PURE__ */ h(C, {
				listRef: K,
				listId: N,
				open: B,
				pos: Se,
				multiple: k,
				loading: E,
				filtered: Y,
				emptyMessage: ee,
				activeIdx: H,
				setActiveIdx: U,
				inputText: q,
				selectedValues: z,
				singleValue: ye,
				onSelectSingle: X,
				onToggleMulti: Q,
				className: ie
			}),
			b && /* @__PURE__ */ h("p", {
				id: P,
				"aria-live": "polite",
				className: "text-xs leading-5 text-destructive",
				children: b
			}),
			y && !b && /* @__PURE__ */ h("p", {
				id: P,
				className: "text-xs leading-5 text-muted-foreground",
				children: y
			})
		]
	});
}
var T = s(w);
//#endregion
export { T as t };

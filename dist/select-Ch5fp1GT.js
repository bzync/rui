import { t as e } from "./cn-DpgY2leY.js";
import { o as t, t as n } from "./component-styles-Ce56hn9T.js";
import { a as r, i, n as a, o, r as s, t as c } from "./utils-CQ8pvCtk.js";
import { t as l } from "./use-event-callback-DGkfO_uu.js";
import { AnimatePresence as u, motion as d } from "framer-motion";
import { forwardRef as f, useCallback as p, useEffect as m, useId as h, useMemo as g, useRef as _, useState as v } from "react";
import { Fragment as y, jsx as b, jsxs as x } from "react/jsx-runtime";
import { createPortal as S } from "react-dom";
//#region src/components/select/option-list.tsx
function C({ listId: t, listRef: n, open: i, pos: a, options: o, flat: s, activeIdx: c, setActiveIdx: l, isSelected: f, onSelect: p, colorDot: m, multiselectable: h = !1, className: g }) {
	return typeof document > "u" ? null : S(/* @__PURE__ */ b(u, { children: i && a && /* @__PURE__ */ b(d.ul, {
		ref: n,
		id: t,
		role: "listbox",
		"aria-multiselectable": h,
		initial: {
			opacity: 0,
			y: a.placement === "bottom" ? -4 : 4,
			scaleY: .97
		},
		animate: {
			opacity: 1,
			y: 0,
			scaleY: 1
		},
		exit: {
			opacity: 0,
			y: a.placement === "bottom" ? -4 : 4,
			scaleY: .97
		},
		transition: { duration: .13 },
		style: {
			originY: a.placement === "bottom" ? 0 : 1,
			position: "fixed",
			top: a.top,
			left: a.left,
			width: a.width,
			maxHeight: a.maxHeight
		},
		className: e("z-[110] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface-raised py-1 shadow-floating", g),
		children: o.map((e, n) => r(e) ? /* @__PURE__ */ x("li", { children: [/* @__PURE__ */ b("p", {
			className: "px-3 pt-2 pb-1 text-xs font-semibold text-slate-600 uppercase tracking-widest",
			children: e.group
		}), /* @__PURE__ */ b("ul", { children: e.options.map((e) => {
			let n = s.find((t) => t.value === e.value);
			return /* @__PURE__ */ b(w, {
				opt: e,
				listId: t,
				flatIdx: n.flatIdx,
				isActive: n.flatIdx === c,
				isSelected: f(e.value),
				onSelect: p,
				onHover: l,
				colorDot: m
			}, e.value);
		}) })] }, n) : /* @__PURE__ */ b(w, {
			opt: e,
			listId: t,
			flatIdx: s.find((t) => t.value === e.value).flatIdx,
			isActive: s.find((t) => t.value === e.value).flatIdx === c,
			isSelected: f(e.value),
			onSelect: p,
			onHover: l,
			colorDot: m
		}, e.value))
	}) }), document.body);
}
function w({ opt: t, listId: n, flatIdx: r, isActive: i, isSelected: a, onSelect: o, onHover: s, colorDot: c }) {
	return /* @__PURE__ */ x("li", {
		id: `${n}-opt-${r}`,
		role: "option",
		"aria-selected": a,
		"aria-disabled": t.disabled,
		"data-idx": r,
		onMouseDown: (e) => e.preventDefault(),
		onClick: () => !t.disabled && o(t),
		onMouseEnter: () => !t.disabled && s(r),
		className: e("flex min-h-9 items-center gap-3 px-3 py-2 cursor-pointer transition-colors select-none", i && "bg-surface-muted", a && !i && "bg-accent-50 dark:bg-accent-500/10", t.disabled && "opacity-40 cursor-not-allowed pointer-events-none"),
		children: [
			t.icon && /* @__PURE__ */ b("span", {
				className: "shrink-0 text-slate-500 dark:text-slate-400",
				children: t.icon
			}),
			t.color && t.color !== "default" && /* @__PURE__ */ b("span", { className: e("w-2 h-2 rounded-full shrink-0", c[t.color]) }),
			/* @__PURE__ */ x("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ b("p", {
					className: e("text-sm leading-snug truncate", a ? "text-accent-700 dark:text-accent-300 font-medium" : "text-foreground"),
					children: t.label
				}), t.description && /* @__PURE__ */ b("p", {
					className: "mt-0.5 truncate text-xs text-muted-foreground",
					children: t.description
				})]
			}),
			a && /* @__PURE__ */ b("svg", {
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
				children: /* @__PURE__ */ b("path", { d: "m20 6-11 11-5-5" })
			})
		]
	});
}
//#endregion
//#region src/components/select/select-single.tsx
var T = f(({ options: r, value: u, defaultValue: d, onChange: f, placeholder: S = "Select…", label: w, hint: T, error: E, disabled: D, required: O, clearable: k = !1, className: A, wrapperClassName: j, triggerClassName: M, listClassName: N, id: P, unstyled: F = !1 }, I) => {
	let L = h(), R = P ?? L, z = `${R}-list`, B = `${R}-message`, [V, H] = v(!1), [U, W] = v(d ?? ""), [G, K] = v(-1), q = _(null), J = _(null), Y = l((e) => f?.(e)), X = u === void 0 ? U : u, Z = g(() => i(r), [r]), Q = g(() => Z.find((e) => e.value === X), [Z, X]), $ = p((e) => {
		u === void 0 && W(e.value), Y(e.value), H(!1), K(-1);
	}, [u, Y]), ee = p((e) => {
		e.stopPropagation(), u === void 0 && W(""), Y("");
	}, [u, Y]), te = p((e) => {
		if (!V) {
			if ([
				"Enter",
				" ",
				"ArrowDown",
				"ArrowUp"
			].includes(e.key)) {
				e.preventDefault(), H(!0);
				let t = Z.find((e) => e.value === X && e.flatIdx >= 0)?.flatIdx ?? -1, n = Z.filter((e) => e.flatIdx >= 0);
				K(t >= 0 ? t : e.key === "ArrowUp" ? n[n.length - 1]?.flatIdx ?? -1 : n[0]?.flatIdx ?? -1);
			}
			return;
		}
		if (e.key === "ArrowDown") e.preventDefault(), K((e) => {
			let t = Z.filter((e) => e.flatIdx >= 0), n = t.findIndex((t) => t.flatIdx === e);
			return t[Math.min(n + 1, t.length - 1)]?.flatIdx ?? e;
		});
		else if (e.key === "ArrowUp") e.preventDefault(), K((e) => {
			let t = Z.filter((e) => e.flatIdx >= 0), n = t.findIndex((t) => t.flatIdx === e);
			return t[Math.max(n - 1, 0)]?.flatIdx ?? e;
		});
		else if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			let t = Z.find((e) => e.flatIdx === G);
			t && $(t);
		} else (e.key === "Escape" || e.key === "Tab") && (H(!1), K(-1));
	}, [
		V,
		Z,
		X,
		G,
		$
	]);
	m(() => {
		G < 0 || !J.current || J.current.querySelector(`[data-idx="${G}"]`)?.scrollIntoView({ block: "nearest" });
	}, [G]), m(() => {
		function e(e) {
			let t = e.target;
			q.current?.contains(t) || J.current?.contains(t) || H(!1);
		}
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, []);
	let ne = o(V, q);
	return F ? /* @__PURE__ */ x("div", {
		ref: q,
		className: e(A, j),
		children: [/* @__PURE__ */ b("button", {
			ref: I,
			id: R,
			type: "button",
			role: "combobox",
			"aria-expanded": V,
			onClick: () => H((e) => !e),
			className: M,
			children: Q?.label ?? S
		}), V && /* @__PURE__ */ b("ul", {
			ref: J,
			id: z,
			className: N,
			children: Z.map((e) => /* @__PURE__ */ b("li", {
				"data-idx": e.flatIdx,
				onClick: () => $(e),
				children: e.label
			}, e.value))
		})]
	}) : /* @__PURE__ */ x("div", {
		ref: q,
		className: e("relative", t, j, A),
		children: [
			w && /* @__PURE__ */ x("label", {
				htmlFor: R,
				className: "text-sm font-medium leading-5 text-foreground",
				children: [w, O && /* @__PURE__ */ x(y, { children: [/* @__PURE__ */ b("span", {
					"aria-hidden": "true",
					className: "ml-1 text-destructive",
					children: "*"
				}), /* @__PURE__ */ b("span", {
					className: "sr-only",
					children: " (required)"
				})] })]
			}),
			/* @__PURE__ */ x("button", {
				ref: I,
				id: R,
				type: "button",
				role: "combobox",
				"aria-haspopup": "listbox",
				"aria-expanded": V,
				"aria-controls": z,
				"aria-activedescendant": V && G >= 0 ? `${z}-opt-${G}` : void 0,
				"aria-invalid": E ? !0 : void 0,
				"aria-required": O || void 0,
				"aria-describedby": E || T ? B : void 0,
				disabled: D,
				onKeyDown: te,
				onClick: () => {
					D || (H((e) => !e), V || K(Z.find((e) => e.value === X && e.flatIdx >= 0)?.flatIdx ?? -1));
				},
				className: e("flex h-9 w-full items-center gap-2 rounded-[var(--radius-md)] px-3 text-left outline-none", n, "focus:border-accent-500 focus:ring-2 focus:ring-focus-ring/20", E && "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/20", D && "opacity-50 cursor-not-allowed", M),
				children: [
					Q?.icon && /* @__PURE__ */ b("span", {
						className: "shrink-0 text-slate-500 dark:text-slate-400",
						children: Q.icon
					}),
					Q?.color && Q.color !== "default" && /* @__PURE__ */ b("span", { className: e("w-2 h-2 rounded-full shrink-0", s[Q.color]) }),
					/* @__PURE__ */ b("span", {
						className: e("flex-1 min-w-0 text-sm truncate", Q ? "text-foreground" : "text-muted-foreground"),
						children: Q?.label ?? S
					}),
					k && X && !D && /* @__PURE__ */ b("span", {
						role: "button",
						tabIndex: -1,
						onClick: ee,
						className: "shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",
						children: /* @__PURE__ */ b(a, {})
					}),
					/* @__PURE__ */ b(c, { open: V })
				]
			}),
			/* @__PURE__ */ b(C, {
				listId: z,
				listRef: J,
				open: V,
				pos: ne,
				options: r,
				flat: Z,
				activeIdx: G,
				setActiveIdx: K,
				isSelected: (e) => e === X,
				onSelect: $,
				colorDot: s,
				className: N
			}),
			E && /* @__PURE__ */ b("p", {
				id: B,
				"aria-live": "polite",
				className: "text-xs leading-5 text-destructive",
				children: E
			}),
			T && !E && /* @__PURE__ */ b("p", {
				id: B,
				className: "text-xs leading-5 text-muted-foreground",
				children: T
			})
		]
	});
});
T.displayName = "SelectSingle";
//#endregion
//#region src/components/select/select-multi.tsx
var E = f(({ options: r, value: l, defaultValue: u, onChange: d, placeholder: f = "Select…", label: p, hint: g, error: S, disabled: w, required: T, clearable: E = !1, className: D, wrapperClassName: O, triggerClassName: k, listClassName: A, id: j, unstyled: M = !1 }, N) => {
	let P = h(), F = j ?? P, I = `${F}-list`, L = `${F}-message`, [R, z] = v(!1), [B, V] = v(u ?? []), [H, U] = v(-1), W = _(null), G = _(null), K = l === void 0 ? B : l, q = i(r), J = q.filter((e) => K.includes(e.value));
	function Y(e) {
		let t = K.includes(e.value) ? K.filter((t) => t !== e.value) : [...K, e.value];
		l === void 0 && V(t), d?.(t);
	}
	function X(e, t) {
		t.stopPropagation();
		let n = K.filter((t) => t !== e);
		l === void 0 && V(n), d?.(n);
	}
	function Z(e) {
		e.stopPropagation(), l === void 0 && V([]), d?.([]);
	}
	function Q(e) {
		if (!R) {
			[
				"Enter",
				" ",
				"ArrowDown",
				"ArrowUp"
			].includes(e.key) && (e.preventDefault(), z(!0));
			return;
		}
		if (e.key === "ArrowDown") e.preventDefault(), U((e) => {
			let t = q.filter((e) => e.flatIdx >= 0), n = t.findIndex((t) => t.flatIdx === e);
			return t[Math.min(n + 1, t.length - 1)]?.flatIdx ?? e;
		});
		else if (e.key === "ArrowUp") e.preventDefault(), U((e) => {
			let t = q.filter((e) => e.flatIdx >= 0), n = t.findIndex((t) => t.flatIdx === e);
			return t[Math.max(n - 1, 0)]?.flatIdx ?? e;
		});
		else if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			let t = q.find((e) => e.flatIdx === H);
			t && Y(t);
		} else (e.key === "Escape" || e.key === "Tab") && (z(!1), U(-1));
	}
	m(() => {
		H < 0 || !G.current || G.current.querySelector(`[data-idx="${H}"]`)?.scrollIntoView({ block: "nearest" });
	}, [H]), m(() => {
		function e(e) {
			let t = e.target;
			W.current?.contains(t) || G.current?.contains(t) || z(!1);
		}
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, []);
	let $ = o(R, W);
	return M ? /* @__PURE__ */ x("div", {
		ref: W,
		className: e(D, O),
		children: [/* @__PURE__ */ b("button", {
			ref: N,
			id: F,
			type: "button",
			role: "combobox",
			"aria-expanded": R,
			"aria-controls": I,
			onKeyDown: Q,
			onClick: () => z((e) => !e),
			className: k,
			children: J.length > 0 ? J.map((e) => e.label).join(", ") : f
		}), /* @__PURE__ */ b(C, {
			listId: I,
			listRef: G,
			open: R,
			pos: $,
			options: r,
			flat: q,
			activeIdx: H,
			setActiveIdx: U,
			isSelected: (e) => K.includes(e),
			onSelect: Y,
			multiselectable: !0,
			colorDot: s,
			className: A
		})]
	}) : /* @__PURE__ */ x("div", {
		ref: W,
		className: e("relative", t, O, D),
		children: [
			p && /* @__PURE__ */ x("label", {
				htmlFor: F,
				className: "text-sm font-medium leading-5 text-foreground",
				children: [p, T && /* @__PURE__ */ x(y, { children: [/* @__PURE__ */ b("span", {
					"aria-hidden": "true",
					className: "ml-1 text-destructive",
					children: "*"
				}), /* @__PURE__ */ b("span", {
					className: "sr-only",
					children: " (required)"
				})] })]
			}),
			/* @__PURE__ */ x("button", {
				ref: N,
				id: F,
				type: "button",
				role: "combobox",
				"aria-haspopup": "listbox",
				"aria-expanded": R,
				"aria-controls": I,
				"aria-activedescendant": R && H >= 0 ? `${I}-opt-${H}` : void 0,
				"aria-invalid": S ? !0 : void 0,
				"aria-required": T || void 0,
				"aria-describedby": S || g ? L : void 0,
				disabled: w,
				onKeyDown: Q,
				onClick: () => {
					w || z((e) => !e);
				},
				className: e("flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1.5 text-left outline-none", n, "focus:border-accent-500 focus:ring-2 focus:ring-focus-ring/20", S && "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/20", w && "opacity-50 cursor-not-allowed", k),
				children: [J.length === 0 ? /* @__PURE__ */ b("span", {
					className: "flex-1 text-sm text-slate-500 truncate",
					children: f
				}) : J.map((t) => /* @__PURE__ */ x("span", {
					className: "inline-flex max-w-[160px] items-center gap-1 rounded-md border border-border bg-surface-muted px-2 py-0.5 text-xs font-medium text-foreground",
					children: [
						t.color && t.color !== "default" && /* @__PURE__ */ b("span", { className: e("w-1.5 h-1.5 rounded-full shrink-0", s[t.color]) }),
						/* @__PURE__ */ b("span", {
							className: "truncate",
							children: t.label
						}),
						/* @__PURE__ */ b("span", {
							role: "button",
							tabIndex: -1,
							onMouseDown: (e) => e.stopPropagation(),
							onClick: (e) => X(t.value, e),
							className: "shrink-0 text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer ml-0.5",
							"aria-label": `Remove ${t.label}`,
							children: /* @__PURE__ */ b(a, {})
						})
					]
				}, t.value)), /* @__PURE__ */ x("span", {
					className: "ml-auto flex items-center gap-1.5 shrink-0 pl-1",
					children: [
						E && K.length > 0 && !w && /* @__PURE__ */ b("span", {
							role: "button",
							tabIndex: -1,
							onClick: Z,
							className: "text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",
							"aria-label": "Clear all",
							children: /* @__PURE__ */ b(a, {})
						}),
						K.length > 0 && /* @__PURE__ */ b("span", {
							className: "text-[10px] font-medium text-slate-500 tabular-nums",
							children: K.length
						}),
						/* @__PURE__ */ b(c, { open: R })
					]
				})]
			}),
			/* @__PURE__ */ b(C, {
				listId: I,
				listRef: G,
				open: R,
				pos: $,
				options: r,
				flat: q,
				activeIdx: H,
				setActiveIdx: U,
				isSelected: (e) => K.includes(e),
				onSelect: Y,
				multiselectable: !0,
				colorDot: s,
				className: A
			}),
			S && /* @__PURE__ */ b("p", {
				id: L,
				"aria-live": "polite",
				className: "text-xs leading-5 text-destructive",
				children: S
			}),
			g && !S && /* @__PURE__ */ b("p", {
				id: L,
				className: "text-xs leading-5 text-muted-foreground",
				children: g
			})
		]
	});
});
E.displayName = "SelectMulti";
//#endregion
//#region src/components/select.tsx
var D = f((e, t) => e.multiple ? /* @__PURE__ */ b(E, {
	...e,
	ref: t
}) : /* @__PURE__ */ b(T, {
	...e,
	ref: t
}));
D.displayName = "Select";
//#endregion
export { D as t };

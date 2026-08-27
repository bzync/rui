"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { o as t, t as n } from "../component-styles-Ce56hn9T.js";
import { forwardRef as r, useEffect as i, useId as a, useRef as o, useState as s } from "react";
import { Fragment as c, jsx as l, jsxs as u } from "react/jsx-runtime";
//#region src/components/number-input.tsx
var d = {
	sm: {
		wrap: "h-7 text-xs",
		btn: "w-6",
		input: "w-16"
	},
	md: {
		wrap: "h-9 text-sm",
		btn: "w-8",
		input: "w-20"
	},
	lg: {
		wrap: "h-11 text-sm",
		btn: "w-9",
		input: "w-24"
	}
}, f = r(({ className: r, label: f, hint: p, error: m, size: h = "md", min: g = -Infinity, max: _ = Infinity, step: v = 1, value: y, defaultValue: b = 0, onChange: x, disabled: S, id: C, autoComplete: w = "on", fullWidth: T = !1, formatDisplay: E, onFocus: D, onBlur: O, onKeyDown: k, required: A, ...j }, M) => {
	let N = a(), P = C ?? N, F = `${P}-message`, [I, L] = s(b), R = y ?? I, z = d[h], B = v.toString().includes(".") ? v.toString().split(".")[1].length : 0, V = (e) => B > 0 ? Math.round(e * 10 ** B) / 10 ** B : Math.round(e), H = (e) => Math.min(_, Math.max(g, e));
	function U(e) {
		let t = H(V(e));
		y === void 0 && L(t), x?.(t), G(String(t));
	}
	i(() => {
		y !== void 0 && L(y);
	}, [y]);
	let [W, G] = s(() => String(R)), K = o(!1);
	i(() => {
		K.current || G(String(R));
	}, [R]);
	function q(e) {
		G(e);
	}
	function J(e) {
		K.current = !1;
		let t = Number(W);
		U(Number.isNaN(t) ? R : t), O?.(e);
	}
	function Y(e) {
		k?.(e), !e.defaultPrevented && e.key === "Enter" && e.currentTarget.blur();
	}
	return /* @__PURE__ */ u("div", {
		className: e(t, !T && "w-auto", r),
		children: [
			f && /* @__PURE__ */ u("label", {
				htmlFor: P,
				className: "text-sm font-medium leading-5 text-foreground",
				children: [f, A && /* @__PURE__ */ u(c, { children: [/* @__PURE__ */ l("span", {
					"aria-hidden": "true",
					className: "ml-1 text-destructive",
					children: "*"
				}), /* @__PURE__ */ l("span", {
					className: "sr-only",
					children: " (required)"
				})] })]
			}),
			/* @__PURE__ */ u("div", {
				className: e("inline-flex items-center overflow-hidden rounded-[var(--radius-md)]", n, z.wrap, T && "flex w-full", m && "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/20", S && "opacity-50"),
				children: [
					/* @__PURE__ */ l("button", {
						type: "button",
						"aria-label": f ? `Decrease ${f}` : "Decrease value",
						tabIndex: -1,
						disabled: S || R <= g,
						onClick: () => U(R - v),
						className: e("flex items-center justify-center shrink-0 border-r border-border", "text-muted-foreground hover:bg-muted hover:text-foreground", "disabled:opacity-40 disabled:cursor-not-allowed transition-colors", z.btn),
						children: /* @__PURE__ */ l("svg", {
							width: "10",
							height: "10",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "3",
							strokeLinecap: "round",
							children: /* @__PURE__ */ l("path", { d: "M5 12h14" })
						})
					}),
					/* @__PURE__ */ l("input", {
						ref: M,
						type: "number",
						id: P,
						required: A,
						"aria-invalid": m ? !0 : void 0,
						"aria-describedby": m || p ? F : void 0,
						"aria-valuetext": E?.(R),
						autoComplete: w,
						min: Number.isFinite(g) ? g : void 0,
						max: Number.isFinite(_) ? _ : void 0,
						step: v,
						value: W,
						disabled: S,
						onFocus: (e) => {
							K.current = !0, D?.(e);
						},
						onChange: (e) => q(e.target.value),
						onBlur: J,
						onKeyDown: Y,
						className: e("flex-1 text-center bg-transparent text-foreground outline-none tabular-nums", "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", "disabled:cursor-not-allowed", T ? "min-w-0" : z.input),
						...j
					}),
					/* @__PURE__ */ l("button", {
						type: "button",
						"aria-label": f ? `Increase ${f}` : "Increase value",
						tabIndex: -1,
						disabled: S || R >= _,
						onClick: () => U(R + v),
						className: e("flex items-center justify-center shrink-0 border-l border-border", "text-muted-foreground hover:bg-muted hover:text-foreground", "disabled:opacity-40 disabled:cursor-not-allowed transition-colors", z.btn),
						children: /* @__PURE__ */ l("svg", {
							width: "10",
							height: "10",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "3",
							strokeLinecap: "round",
							children: /* @__PURE__ */ l("path", { d: "M12 5v14M5 12h14" })
						})
					})
				]
			}),
			m && /* @__PURE__ */ l("p", {
				id: F,
				"aria-live": "polite",
				className: "text-xs leading-5 text-destructive",
				children: m
			}),
			p && !m && /* @__PURE__ */ l("p", {
				id: F,
				className: "text-xs leading-5 text-muted-foreground",
				children: p
			})
		]
	});
});
f.displayName = "NumberInput";
//#endregion
export { f as NumberInput };

"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { o as t } from "../component-styles-Ce56hn9T.js";
import { forwardRef as n, useEffect as r, useId as i, useState as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/components/slider.tsx
var c = n(({ className: n, label: c, hint: l, error: u, showValue: d = !0, formatValue: f, min: p = 0, max: m = 100, step: h = 1, value: g, defaultValue: _, onChange: v, disabled: y, id: b, ...x }, S) => {
	let C = i(), w = b ?? C, T = `${w}-message`, [E, D] = a(Number(g ?? _ ?? p));
	r(() => {
		g !== void 0 && D(Number(g));
	}, [g]);
	let O = Number(g ?? E), k = m === p ? 0 : Math.min(100, Math.max(0, (O - p) / (m - p) * 100)), A = f ? f(O) : String(O);
	return /* @__PURE__ */ s("div", {
		className: e(t, n),
		children: [
			(c || d) && /* @__PURE__ */ s("div", {
				className: "flex items-center justify-between",
				children: [c && /* @__PURE__ */ o("label", {
					htmlFor: w,
					className: "text-sm font-medium leading-5 text-foreground",
					children: c
				}), d && /* @__PURE__ */ o("output", {
					htmlFor: w,
					className: "text-sm font-medium tabular-nums text-foreground",
					children: A
				})]
			}),
			/* @__PURE__ */ s("div", {
				className: "relative flex items-center h-5",
				children: [/* @__PURE__ */ o("div", {
					className: "absolute inset-x-0 h-1.5 rounded-full bg-muted",
					children: /* @__PURE__ */ o("div", {
						className: "absolute left-0 top-0 h-full rounded-full bg-accent-500",
						style: { width: `${k}%` }
					})
				}), /* @__PURE__ */ o("input", {
					ref: S,
					type: "range",
					id: w,
					min: p,
					max: m,
					step: h,
					value: O,
					disabled: y,
					"aria-invalid": u ? !0 : void 0,
					"aria-describedby": u || l ? T : void 0,
					"aria-valuetext": A,
					onChange: (e) => {
						let t = Number(e.target.value);
						g === void 0 && D(t), v?.(e);
					},
					className: e("relative w-full appearance-none bg-transparent cursor-pointer", "focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-focus-ring/25", "disabled:cursor-not-allowed disabled:opacity-50", "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4", "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white", "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent-500", "[&::-webkit-slider-thumb]:shadow-sm", "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full", "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent-500", "[&::-moz-range-thumb]:shadow-md"),
					...x
				})]
			}),
			u && /* @__PURE__ */ o("p", {
				id: T,
				"aria-live": "polite",
				className: "text-xs leading-5 text-destructive",
				children: u
			}),
			l && !u && /* @__PURE__ */ o("p", {
				id: T,
				className: "text-xs leading-5 text-muted-foreground",
				children: l
			})
		]
	});
});
c.displayName = "Slider";
//#endregion
export { c as Slider };

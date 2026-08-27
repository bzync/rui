"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { o as t, t as n } from "../component-styles-Ce56hn9T.js";
import { forwardRef as r, useId as i } from "react";
import { Fragment as a, jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/components/input.tsx
var c = {
	sm: {
		wrap: "h-7 px-2 gap-1.5",
		text: "text-xs"
	},
	md: {
		wrap: "h-9 px-3 gap-2",
		text: "text-sm"
	},
	lg: {
		wrap: "h-10 px-3.5 gap-2.5",
		text: "text-sm"
	}
}, l = r(({ className: r, wrapperClassName: l, wrapperStyle: u, inputClassName: d, labelClassName: f, hintClassName: p, unstyled: m = !1, label: h, hint: g, error: _, prefix: v, suffix: y, size: b = "md", id: x, autoComplete: S = "on", style: C, required: w, ...T }, E) => {
	let D = i(), O = x ?? D, k = `${O}-message`, A = c[b];
	return m ? /* @__PURE__ */ s("div", {
		className: e(t, l),
		style: u,
		children: [
			h && /* @__PURE__ */ s("label", {
				htmlFor: O,
				className: e("text-sm font-medium leading-5 text-foreground", f),
				children: [h, w && /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("span", {
					"aria-hidden": "true",
					className: "ml-1 text-destructive",
					children: "*"
				}), /* @__PURE__ */ o("span", {
					className: "sr-only",
					children: " (required)"
				})] })]
			}),
			/* @__PURE__ */ o("input", {
				ref: E,
				id: O,
				required: w,
				"aria-invalid": _ ? !0 : void 0,
				"aria-describedby": _ || g ? k : void 0,
				autoComplete: S,
				className: e(d, r),
				style: C,
				...T
			}),
			_ && /* @__PURE__ */ o("p", {
				id: k,
				"aria-live": "polite",
				className: e("text-xs leading-5 text-destructive", p),
				children: _
			}),
			g && !_ && /* @__PURE__ */ o("p", {
				id: k,
				className: e("text-xs leading-5 text-muted-foreground", p),
				children: g
			})
		]
	}) : /* @__PURE__ */ s("div", {
		className: e(t, l),
		style: u,
		children: [
			h && /* @__PURE__ */ s("label", {
				htmlFor: O,
				className: e("text-sm font-medium leading-5 text-foreground", f),
				children: [h, w && /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("span", {
					"aria-hidden": "true",
					className: "ml-1 text-destructive",
					children: "*"
				}), /* @__PURE__ */ o("span", {
					className: "sr-only",
					children: " (required)"
				})] })]
			}),
			/* @__PURE__ */ s("div", {
				className: e("flex items-center rounded-[var(--radius-md)]", A.wrap, n, _ && "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/20"),
				children: [
					v && /* @__PURE__ */ o("span", {
						className: e("text-slate-400 dark:text-slate-500 shrink-0", A.text),
						children: v
					}),
					/* @__PURE__ */ o("input", {
						ref: E,
						id: O,
						required: w,
						"aria-invalid": _ ? !0 : void 0,
						"aria-describedby": _ || g ? k : void 0,
						autoComplete: S,
						className: e("flex-1 min-w-0 bg-transparent outline-none", "text-foreground placeholder:text-muted-foreground", "disabled:cursor-not-allowed disabled:opacity-50", A.text, d, r),
						style: C,
						...T
					}),
					y && /* @__PURE__ */ o("span", {
						className: e("text-slate-400 dark:text-slate-500 shrink-0", A.text),
						children: y
					})
				]
			}),
			_ && /* @__PURE__ */ o("p", {
				id: k,
				"aria-live": "polite",
				className: e("text-xs leading-5 text-destructive", p),
				children: _
			}),
			g && !_ && /* @__PURE__ */ o("p", {
				id: k,
				className: e("text-xs leading-5 text-muted-foreground", p),
				children: g
			})
		]
	});
});
l.displayName = "Input";
//#endregion
export { l as Input };

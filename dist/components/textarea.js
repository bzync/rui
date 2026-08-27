"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { o as t, t as n } from "../component-styles-Ce56hn9T.js";
import { forwardRef as r, useId as i } from "react";
import { Fragment as a, jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/components/textarea.tsx
var c = {
	sm: "min-h-[64px] px-2 py-1.5 text-xs",
	md: "min-h-[88px] px-3 py-2.5 text-sm",
	lg: "min-h-[120px] px-4 py-3 text-sm"
}, l = r(({ className: r, wrapperClassName: l, labelClassName: u, messageClassName: d, label: f, hint: p, error: m, size: h = "md", id: g, autoComplete: _ = "on", required: v, ...y }, b) => {
	let x = i(), S = g ?? x, C = `${S}-message`;
	return /* @__PURE__ */ s("div", {
		className: e(t, l),
		children: [
			f && /* @__PURE__ */ s("label", {
				htmlFor: S,
				className: e("text-sm font-medium leading-5 text-foreground", u),
				children: [f, v && /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("span", {
					"aria-hidden": "true",
					className: "ml-1 text-destructive",
					children: "*"
				}), /* @__PURE__ */ o("span", {
					className: "sr-only",
					children: " (required)"
				})] })]
			}),
			/* @__PURE__ */ o("textarea", {
				ref: b,
				id: S,
				required: v,
				"aria-invalid": m ? !0 : void 0,
				"aria-describedby": m || p ? C : void 0,
				autoComplete: _,
				className: e("w-full rounded-[var(--radius-md)] text-foreground placeholder:text-muted-foreground outline-none resize-y", n, c[h], "focus:border-accent-500 focus:ring-2 focus:ring-focus-ring/20", m && "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/20", "disabled:cursor-not-allowed disabled:opacity-50", r),
				...y
			}),
			m && /* @__PURE__ */ o("p", {
				id: C,
				"aria-live": "polite",
				className: e("text-xs leading-5 text-destructive", d),
				children: m
			}),
			p && !m && /* @__PURE__ */ o("p", {
				id: C,
				className: e("text-xs leading-5 text-muted-foreground", d),
				children: p
			})
		]
	});
});
l.displayName = "Textarea";
//#endregion
export { l as Textarea };

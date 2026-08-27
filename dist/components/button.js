"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { s as t } from "../component-styles-Ce56hn9T.js";
import { forwardRef as n, memo as r } from "react";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/components/button.tsx
var o = {
	primary: [
		"bg-primary hover:bg-primary-hover active:bg-primary-hover",
		"text-primary-foreground font-semibold",
		"border border-transparent shadow-xs"
	].join(" "),
	secondary: [
		"bg-surface hover:bg-surface-muted active:bg-muted",
		"text-foreground font-medium",
		"border border-border hover:border-border-strong shadow-xs"
	].join(" "),
	ghost: [
		"bg-transparent",
		"hover:bg-muted active:bg-surface-muted",
		"text-muted-foreground font-medium hover:text-foreground"
	].join(" "),
	outline: [
		"bg-transparent",
		"border border-border-strong hover:border-foreground/35",
		"text-foreground font-medium hover:bg-muted"
	].join(" "),
	destructive: [
		"bg-destructive hover:bg-destructive-hover active:bg-destructive-hover",
		"text-destructive-foreground font-semibold",
		"border border-transparent shadow-xs"
	].join(" "),
	link: "h-auto bg-transparent p-0 text-accent-700 underline-offset-4 hover:underline dark:text-accent-300"
}, s = {
	sm: "h-8 px-3 text-xs rounded-[var(--radius-md)] gap-1.5",
	md: "h-9 px-4 text-sm rounded-[var(--radius-lg)] gap-2",
	lg: "h-10 px-5 text-sm rounded-[var(--radius-lg)] gap-2.5",
	icon: "size-9 rounded-[var(--radius-md)] p-0"
}, c = n(({ className: n, variant: r = "primary", size: c = "md", loading: l = !1, icon: u, iconPosition: d = "left", variantClassName: f, unstyled: p = !1, children: m, disabled: h, type: g = "button", ..._ }, v) => {
	let y = h || l;
	return p ? /* @__PURE__ */ i("button", {
		ref: v,
		type: g,
		disabled: y,
		className: e(n, f),
		..._,
		children: l ? "Loading…" : m
	}) : /* @__PURE__ */ a("button", {
		ref: v,
		type: g,
		"data-loading": l || void 0,
		className: e("inline-flex items-center justify-center cursor-pointer select-none whitespace-nowrap", "transition-[color,background-color,border-color,box-shadow,transform] duration-150 active:enabled:translate-y-px", "disabled:opacity-40 disabled:cursor-not-allowed", t, o[r], f, s[c], n),
		disabled: y,
		"aria-busy": l || void 0,
		..._,
		children: [
			l && /* @__PURE__ */ a("svg", {
				className: "animate-spin shrink-0 w-3.5 h-3.5",
				viewBox: "0 0 24 24",
				fill: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ i("circle", {
					className: "opacity-25",
					cx: "12",
					cy: "12",
					r: "10",
					stroke: "currentColor",
					strokeWidth: "4"
				}), /* @__PURE__ */ i("path", {
					className: "opacity-75",
					fill: "currentColor",
					d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
				})]
			}),
			!l && u && d === "left" && /* @__PURE__ */ i("span", {
				className: "shrink-0",
				children: u
			}),
			m && /* @__PURE__ */ i("span", { children: m }),
			!l && u && d === "right" && /* @__PURE__ */ i("span", {
				className: "shrink-0",
				children: u
			})
		]
	});
});
c.displayName = "Button";
var l = r(c);
//#endregion
export { l as Button, s as buttonSizes, o as buttonVariants };

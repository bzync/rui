import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t } from "react/jsx-runtime";
//#region src/components/card.tsx
var n = {
	default: "rounded-[var(--radius-xl)] border border-border bg-surface shadow-raised",
	elevated: "rounded-[var(--radius-xl)] border border-border bg-surface-raised shadow-floating",
	bordered: "rounded-[var(--radius-xl)] border border-border bg-transparent",
	glass: "portal-panel rounded-[var(--radius-xl)] border",
	flush: "rounded-[var(--radius-lg)] bg-surface"
};
function r({ variant: r = "default", variantClassName: i, unstyled: a = !1, className: o, children: s, ...c }) {
	return a ? /* @__PURE__ */ t("div", {
		className: e(o, i),
		...c,
		children: s
	}) : /* @__PURE__ */ t("div", {
		"data-variant": r,
		className: e(n[r], i, o),
		...c,
		children: s
	});
}
function i({ className: n, children: r, ...i }) {
	return /* @__PURE__ */ t("div", {
		className: e("px-4 py-3 sm:px-5 sm:py-4", "border-b border-border", n),
		...i,
		children: r
	});
}
function a({ as: n = "h3", className: r, children: i, ...a }) {
	return /* @__PURE__ */ t(n, {
		className: e("text-sm font-semibold leading-5 text-foreground", r),
		...a,
		children: i
	});
}
function o({ className: n, children: r, ...i }) {
	return /* @__PURE__ */ t("p", {
		className: e("mt-1 text-sm leading-5 text-muted-foreground", n),
		...i,
		children: r
	});
}
function s({ className: n, children: r, ...i }) {
	return /* @__PURE__ */ t("div", {
		className: e("px-4 py-3 sm:px-5 sm:py-4", n),
		...i,
		children: r
	});
}
function c({ className: n, children: r, ...i }) {
	return /* @__PURE__ */ t("div", {
		className: e("px-4 py-3 sm:px-5 sm:py-3", "border-t border-border", "flex flex-wrap items-center gap-2 sm:gap-3", n),
		...i,
		children: r
	});
}
//#endregion
export { r as Card, s as CardBody, o as CardDescription, c as CardFooter, i as CardHeader, a as CardTitle, n as cardVariants };

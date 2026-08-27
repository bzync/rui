import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/layout.tsx
function r({ fixed: n = !1, className: r, children: i, ...a }) {
	return /* @__PURE__ */ t("div", {
		className: e("portal-shell flex min-h-dvh w-full bg-bg text-foreground", n && "h-dvh min-h-0 overflow-hidden", r),
		...a,
		children: i
	});
}
function i({ className: n, children: r, ...i }) {
	return /* @__PURE__ */ t("div", {
		className: e("flex min-w-0 flex-1 flex-col", n),
		...i,
		children: r
	});
}
function a({ scrollable: n = !1, className: r, children: i, ...a }) {
	return /* @__PURE__ */ t("main", {
		className: e("min-w-0 flex-1", n && "overflow-y-auto", r),
		...a,
		children: i
	});
}
function o({ sticky: n = !1, className: r, children: i, ...a }) {
	return /* @__PURE__ */ t("header", {
		className: e("z-30 shrink-0", n && "sticky top-0", r),
		...a,
		children: i
	});
}
function s({ sticky: n = !1, className: r, children: i, ...a }) {
	return /* @__PURE__ */ t("footer", {
		className: e("shrink-0 border-t border-border bg-bg/95 px-4 py-4 text-sm text-muted-foreground", n && "sticky bottom-0 z-30", r),
		...a,
		children: i
	});
}
var c = {
	sm: "max-w-3xl",
	md: "max-w-5xl",
	lg: "max-w-7xl",
	xl: "max-w-screen-2xl",
	full: "max-w-none"
};
function l({ size: n = "lg", gutter: r = !0, className: i, children: a, ...o }) {
	return /* @__PURE__ */ t("div", {
		className: e("mx-auto w-full", c[n], r && "px-4 sm:px-6 lg:px-8", i),
		...o,
		children: a
	});
}
function u({ title: r, description: i, eyebrow: a, breadcrumbs: o, actions: s, as: c = "h1", className: l, ...u }) {
	return /* @__PURE__ */ n("div", {
		className: e("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", l),
		...u,
		children: [/* @__PURE__ */ n("div", {
			className: "min-w-0",
			children: [
				o && /* @__PURE__ */ t("div", {
					className: "mb-3",
					children: o
				}),
				a && /* @__PURE__ */ t("div", {
					className: "mb-1 text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400",
					children: a
				}),
				/* @__PURE__ */ t(c, {
					className: "text-2xl font-semibold tracking-[-0.02em] text-foreground",
					children: r
				}),
				i && /* @__PURE__ */ t("div", {
					className: "mt-1.5 max-w-3xl text-sm leading-6 text-muted-foreground",
					children: i
				})
			]
		}), s && /* @__PURE__ */ t("div", {
			className: "flex shrink-0 flex-wrap items-center gap-2",
			children: s
		})]
	});
}
var d = {
	none: "gap-0",
	xs: "gap-1",
	sm: "gap-2",
	md: "gap-4",
	lg: "gap-6",
	xl: "gap-8"
};
function f({ gap: n = "md", className: r, children: i, ...a }) {
	return /* @__PURE__ */ t("div", {
		className: e("flex flex-col", d[n], r),
		...a,
		children: i
	});
}
var p = {
	start: "items-start",
	center: "items-center",
	end: "items-end",
	stretch: "items-stretch"
}, m = {
	start: "justify-start",
	center: "justify-center",
	end: "justify-end",
	between: "justify-between"
};
function h({ gap: n = "md", wrap: r = !0, align: i = "center", justify: a = "start", className: o, children: s, ...c }) {
	return /* @__PURE__ */ t("div", {
		className: e("flex", d[n], r && "flex-wrap", p[i], m[a], o),
		...c,
		children: s
	});
}
//#endregion
export { r as AppShell, i as AppShellBody, o as AppShellHeader, a as AppShellMain, l as Container, s as Footer, h as Inline, u as PageHeader, f as Stack };

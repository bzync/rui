"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { createContext as t, useCallback as n, useContext as r, useEffect as i, useMemo as a, useState as o } from "react";
import { jsx as s } from "react/jsx-runtime";
//#region src/components/theme-provider.tsx
var c = t(null);
function l() {
	return typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function u(...e) {
	let t = {};
	for (let n of e) if (n) {
		for (let [e, r] of Object.entries(n.accent ?? {})) t[`--color-blue-${e}`] = r, t[`--color-accent-${e}`] = r;
		for (let [e, r] of Object.entries(n.neutral ?? {})) t[`--color-slate-${e}`] = r, t[`--color-gray-${e}`] = r;
		if (n.colors && (n.colors.bg !== void 0 && (t["--color-bg"] = n.colors.bg), n.colors.surface !== void 0 && (t["--color-surface"] = n.colors.surface), n.colors.surfaceRaised !== void 0 && (t["--color-surface-raised"] = n.colors.surfaceRaised), n.colors.surfaceMuted !== void 0 && (t["--color-surface-muted"] = n.colors.surfaceMuted), n.colors.border !== void 0 && (t["--color-border"] = n.colors.border), n.colors.borderStrong !== void 0 && (t["--color-border-strong"] = n.colors.borderStrong), n.colors.text !== void 0 && (t["--color-text"] = n.colors.text, t["--color-foreground"] = n.colors.text), n.colors.muted !== void 0 && (t["--color-muted"] = n.colors.muted), n.colors.mutedForeground !== void 0 && (t["--color-muted-foreground"] = n.colors.mutedForeground), n.colors.primary !== void 0 && (t["--color-primary"] = n.colors.primary), n.colors.primaryHover !== void 0 && (t["--color-primary-hover"] = n.colors.primaryHover), n.colors.primaryForeground !== void 0 && (t["--color-primary-foreground"] = n.colors.primaryForeground), n.colors.danger !== void 0 && (t["--color-danger"] = n.colors.danger, t["--color-destructive"] = n.colors.danger), n.colors.dangerForeground !== void 0 && (t["--color-destructive-foreground"] = n.colors.dangerForeground), n.colors.success !== void 0 && (t["--color-success"] = n.colors.success), n.colors.warning !== void 0 && (t["--color-warning"] = n.colors.warning), n.colors.info !== void 0 && (t["--color-info"] = n.colors.info), n.colors.focusRing !== void 0 && (t["--color-focus-ring"] = n.colors.focusRing)), n.radius) for (let [e, r] of Object.entries(n.radius)) t[`--radius-${e}`] = r;
		if (n.fonts && (n.fonts.sans !== void 0 && (t["--font-sans"] = n.fonts.sans, t["--rui-font-family"] = n.fonts.sans, t["--rtui-font-family"] = n.fonts.sans), n.fonts.mono !== void 0 && (t["--font-mono"] = n.fonts.mono), n.fonts.display !== void 0 && (t["--font-display"] = n.fonts.display, t["--rui-heading-family"] = n.fonts.display, t["--rtui-heading-family"] = n.fonts.display), n.fonts.heading !== void 0 && (t["--rui-heading-family"] = n.fonts.heading, t["--rtui-heading-family"] = n.fonts.heading)), n.spacing) for (let [e, r] of Object.entries(n.spacing)) t[`--spacing-${e}`] = r, t[`--padding-${e}`] = r;
		if (n.shadows) for (let [e, r] of Object.entries(n.shadows)) t[`--shadow-${e}`] = r;
		Object.assign(t, n.tokens);
	}
	return t;
}
function d({ children: t, defaultTheme: r = "system", theme: d, onThemeChange: f, storageKey: p = "rui-theme", palette: m, lightPalette: h, darkPalette: g, applyToRoot: _ = !1, className: v, style: y, ...b }) {
	let [x, S] = o(() => {
		if (d || !p || typeof window > "u") return r;
		let e = window.localStorage.getItem(p) ?? (p === "rui-theme" ? window.localStorage.getItem("rtui-theme") : null);
		return e === "light" || e === "dark" || e === "system" ? e : r;
	}), [C, w] = o(l), T = d ?? x, E = T === "system" ? C : T;
	i(() => {
		let e = window.matchMedia("(prefers-color-scheme: dark)"), t = () => w(e.matches ? "dark" : "light");
		return t(), e.addEventListener("change", t), () => e.removeEventListener("change", t);
	}, []);
	let D = n((e) => {
		d || S(e), p && window.localStorage.setItem(p, e), f?.(e);
	}, [
		d,
		f,
		p
	]), O = n(() => {
		D(E === "dark" ? "light" : "dark");
	}, [E, D]), k = a(() => ({
		theme: T,
		resolvedTheme: E,
		setTheme: D,
		toggleTheme: O
	}), [
		E,
		D,
		T,
		O
	]), A = a(() => u(m, E === "dark" ? g : h), [
		g,
		h,
		m,
		E
	]), j = {
		...A,
		...y
	};
	return i(() => {
		if (!_) return;
		let e = document.documentElement, t = e.classList.contains("dark"), n = e.classList.contains("rui-theme"), r = e.classList.contains("rtui-theme"), i = e.dataset.theme, a = e.style.colorScheme, o = Object.keys(A).map((t) => [t, e.style.getPropertyValue(t)]);
		e.classList.toggle("dark", E === "dark"), e.classList.add("rui-theme", "rtui-theme"), e.dataset.theme = E, e.style.colorScheme = E;
		for (let [t, n] of Object.entries(A)) e.style.setProperty(t, String(n));
		return () => {
			e.classList.toggle("dark", t), e.classList.toggle("rui-theme", n), e.classList.toggle("rtui-theme", r), i === void 0 ? delete e.dataset.theme : e.dataset.theme = i, e.style.colorScheme = a;
			for (let [t, n] of o) n ? e.style.setProperty(t, n) : e.style.removeProperty(t);
		};
	}, [
		_,
		A,
		E
	]), /* @__PURE__ */ s(c.Provider, {
		value: k,
		children: /* @__PURE__ */ s("div", {
			"data-theme": E,
			"data-theme-preference": T,
			className: e("rui-theme rtui-theme", E === "dark" && "dark", v),
			style: {
				colorScheme: E,
				...j
			},
			...b,
			children: t
		})
	});
}
function f() {
	let e = r(c);
	if (!e) throw Error("useTheme must be used inside a ThemeProvider");
	return e;
}
//#endregion
export { d as ThemeProvider, f as useTheme };

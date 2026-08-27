import { t as e } from "./cn-DpgY2leY.js";
import { s as t } from "./component-styles-Ce56hn9T.js";
import { t as n } from "./createLucideIcon-DDY8HuQR.js";
import { useTheme as r } from "./components/theme-provider.js";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
var o = n("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]), s = n("sun", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "4",
		key: "4exip2"
	}],
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "M12 20v2",
		key: "1lh1kg"
	}],
	["path", {
		d: "m4.93 4.93 1.41 1.41",
		key: "149t6j"
	}],
	["path", {
		d: "m17.66 17.66 1.41 1.41",
		key: "ptbguv"
	}],
	["path", {
		d: "M2 12h2",
		key: "1t8f8n"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}],
	["path", {
		d: "m6.34 17.66-1.41 1.41",
		key: "1m8zz5"
	}],
	["path", {
		d: "m19.07 4.93-1.41 1.41",
		key: "1shlcs"
	}]
]);
//#endregion
//#region src/components/theme-toggle.tsx
function c({ lightIcon: n = /* @__PURE__ */ i(s, { "aria-hidden": "true" }), darkIcon: c = /* @__PURE__ */ i(o, { "aria-hidden": "true" }), showLabel: l = !1, lightLabel: u = "Use light theme", darkLabel: d = "Use dark theme", className: f, onClick: p, type: m = "button", ...h }) {
	let { resolvedTheme: g, toggleTheme: _ } = r(), v = g === "dark", y = v ? u : d;
	return /* @__PURE__ */ a("button", {
		type: m,
		"aria-label": y,
		title: y,
		"aria-pressed": v,
		"data-theme": g,
		className: e("inline-flex h-9 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm font-medium text-foreground shadow-xs transition-colors", "hover:border-border-strong hover:bg-surface-muted", t, !l && "w-9 px-0 [&_svg]:size-4", l && "[&_svg]:size-4", f),
		onClick: (e) => {
			p?.(e), e.defaultPrevented || _();
		},
		...h,
		children: [/* @__PURE__ */ i("span", {
			"aria-hidden": "true",
			children: v ? n : c
		}), l && /* @__PURE__ */ i("span", { children: y })]
	});
}
//#endregion
export { c as t };

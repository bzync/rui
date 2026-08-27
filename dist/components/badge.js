import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/badge.tsx
var r = {
	default: "bg-accent-50 dark:bg-accent-500/[0.12] text-accent-600 dark:text-accent-400 border-accent-200/80 dark:border-accent-500/20",
	success: "bg-emerald-50 dark:bg-emerald-500/[0.12] text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20",
	warning: "bg-amber-50 dark:bg-amber-500/[0.12] text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/20",
	error: "bg-red-50 dark:bg-red-500/[0.12] text-danger dark:text-red-400 border-red-200/80 dark:border-red-500/20",
	info: "bg-sky-50 dark:bg-sky-500/[0.12] text-sky-700 dark:text-sky-400 border-sky-200/80 dark:border-sky-500/20",
	muted: "bg-black/[0.05] dark:bg-white/[0.07] text-slate-600 dark:text-slate-400 border-black/[0.08] dark:border-white/[0.09]"
}, i = {
	sm: "px-1.5 py-px text-[10.5px] gap-1 font-medium tracking-[-0.01em]",
	md: "px-2 py-0.5 text-[11.5px] gap-1.5 font-medium tracking-[-0.01em]",
	lg: "px-2.5 py-1 text-xs gap-1.5 font-medium tracking-[-0.01em]"
}, a = {
	default: "bg-accent-400",
	success: "bg-emerald-400",
	warning: "bg-amber-400",
	error: "bg-red-400",
	info: "bg-sky-400",
	muted: "bg-slate-500"
};
function o({ variant: o = "default", dot: s = !1, size: c = "md", variants: l, className: u, children: d, ...f }) {
	let p = l?.[o] ?? r[o];
	return /* @__PURE__ */ n("span", {
		className: e("inline-flex items-center rounded-full font-medium border leading-none whitespace-nowrap", p, i[c], u),
		...f,
		children: [s && /* @__PURE__ */ t("span", { className: e("w-1.5 h-1.5 rounded-full shrink-0", a[o]) }), d]
	});
}
//#endregion
export { o as Badge, r as badgeVariants };

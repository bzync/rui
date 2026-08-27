"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/billing-interval-toggle.tsx
var r = [
	{
		value: "monthly",
		label: "Monthly"
	},
	{
		value: "quarterly",
		label: "Quarterly"
	},
	{
		value: "yearly",
		label: "Annually"
	}
];
function i({ value: i, onChange: a, options: o = r, disabled: s = !1, size: c = "sm", className: l }) {
	let u = c === "lg";
	return /* @__PURE__ */ t("div", {
		className: e("inline-flex items-center rounded-lg border border-black/[0.08] dark:border-white/[0.08]", u ? "rounded-xl bg-black/[0.025] dark:bg-white/[0.025] p-0.5 gap-0.5 sm:p-1 sm:gap-1" : "bg-black/[0.02] dark:bg-white/[0.03] p-0.5", l),
		children: o.map((r) => {
			let o = i === r.value;
			return /* @__PURE__ */ n("button", {
				type: "button",
				onClick: () => !s && a(r.value),
				disabled: s,
				className: e("flex items-center justify-center rounded-md font-medium transition-[background-color,border-color,opacity,transform] duration-200", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35", u ? "flex-col gap-0.5 px-2 py-1.5 text-[11px] rounded-lg sm:flex-row sm:gap-2 sm:px-4 sm:py-2 sm:text-sm" : "px-3 py-1 text-xs", s && "opacity-50 cursor-not-allowed", o ? u ? "bg-primary text-primary-foreground shadow-xs" : "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"),
				children: [r.label, r.badge && /* @__PURE__ */ t("span", {
					className: e("rounded-full px-1 py-0.5 text-[9px] font-bold border transition-colors sm:px-1.5 sm:text-[10px]", o ? "bg-white/[0.18] text-white border-white/25" : "bg-green-500/[0.12] text-green-600 dark:text-green-400 border-green-500/20"),
					children: r.badge
				})]
			}, r.value);
		})
	});
}
//#endregion
export { i as BillingIntervalToggle };

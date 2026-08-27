import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/stat.tsx
var r = {
	up: {
		color: "text-emerald-400",
		icon: /* @__PURE__ */ t("svg", {
			width: "12",
			height: "12",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: /* @__PURE__ */ t("path", { d: "m18 15-6-6-6 6" })
		})
	},
	down: {
		color: "text-red-400",
		icon: /* @__PURE__ */ t("svg", {
			width: "12",
			height: "12",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: /* @__PURE__ */ t("path", { d: "m6 9 6 6 6-6" })
		})
	},
	neutral: {
		color: "text-slate-500",
		icon: /* @__PURE__ */ t("svg", {
			width: "12",
			height: "12",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: /* @__PURE__ */ t("path", { d: "M5 12h14" })
		})
	}
};
function i({ label: i, value: a, unit: o, valueClassName: s, trend: c, trendValue: l, icon: u, description: d, action: f, className: p, ...m }) {
	return /* @__PURE__ */ n("div", {
		className: e("flex flex-col gap-1 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-navy-900 p-4 shadow-sm shadow-black/[0.04] dark:shadow-none", p),
		...m,
		children: [
			/* @__PURE__ */ n("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ t("p", {
					className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.07em]",
					children: i
				}), /* @__PURE__ */ n("span", {
					className: "flex items-center gap-1.5 shrink-0",
					children: [f, u && /* @__PURE__ */ t("span", {
						className: "text-slate-400 dark:text-slate-500",
						children: u
					})]
				})]
			}),
			/* @__PURE__ */ n("div", {
				className: "flex items-baseline gap-1.5 mt-1.5",
				children: [/* @__PURE__ */ t("span", {
					className: e("text-[26px] font-semibold tabular-nums text-slate-900 dark:text-white leading-none tracking-tight", s),
					children: a
				}), o && /* @__PURE__ */ t("span", {
					className: "text-sm text-slate-500",
					children: o
				})]
			}),
			(c || d) && /* @__PURE__ */ n("div", {
				className: "flex items-center gap-1.5 mt-1",
				children: [c && l && /* @__PURE__ */ n("span", {
					className: e("flex items-center gap-0.5 text-xs font-medium", r[c].color),
					children: [r[c].icon, l]
				}), d && /* @__PURE__ */ t("span", {
					className: "text-xs text-slate-500",
					children: d
				})]
			})
		]
	});
}
//#endregion
export { i as Stat };

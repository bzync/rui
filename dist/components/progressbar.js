"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { motion as t } from "framer-motion";
import { jsx as n, jsxs as r } from "react/jsx-runtime";
//#region src/components/progressbar.tsx
var i = {
	default: "bg-black/6 dark:bg-white/6",
	success: "bg-emerald-500/10",
	warning: "bg-amber-500/10",
	error: "bg-red-500/10",
	info: "bg-sky-500/10"
}, a = {
	default: "bg-accent-500",
	success: "bg-emerald-500",
	warning: "bg-amber-500",
	error: "bg-red-500",
	info: "bg-sky-500"
}, o = {
	default: "text-accent-400",
	success: "text-emerald-400",
	warning: "text-amber-400",
	error: "text-red-400",
	info: "text-sky-400"
}, s = {
	xs: "h-1",
	sm: "h-1.5",
	md: "h-2",
	lg: "h-3"
};
function c({ value: c = 0, variant: l = "default", size: u = "md", label: d, showValue: f = !1, indeterminate: p = !1, steps: m, animated: h = !0, className: g, ..._ }) {
	let v = Math.min(100, Math.max(0, c)), y = d !== void 0 || f;
	if (m !== void 0 && m > 0) {
		let c = Math.round(v / 100 * m);
		return /* @__PURE__ */ r("div", {
			className: e("flex flex-col gap-1.5", g),
			..._,
			children: [y && /* @__PURE__ */ r("div", {
				className: "flex items-center justify-between gap-2",
				children: [d && /* @__PURE__ */ n("span", {
					className: "text-xs text-slate-500 dark:text-slate-400",
					children: d
				}), f && /* @__PURE__ */ r("span", {
					className: e("text-xs font-medium tabular-nums ml-auto", o[l]),
					children: [
						c,
						"/",
						m
					]
				})]
			}), /* @__PURE__ */ n("div", {
				className: "flex gap-1",
				children: Array.from({ length: m }).map((r, o) => /* @__PURE__ */ n(t.div, {
					className: e("flex-1 rounded-full", s[u], o < c ? a[l] : i[l]),
					initial: h ? { opacity: .4 } : void 0,
					animate: h ? { opacity: 1 } : void 0,
					transition: {
						delay: o * .04,
						duration: .2
					}
				}, o))
			})]
		});
	}
	return /* @__PURE__ */ r("div", {
		className: e("flex flex-col gap-1.5", g),
		..._,
		children: [y && /* @__PURE__ */ r("div", {
			className: "flex items-center justify-between gap-2",
			children: [d && /* @__PURE__ */ n("span", {
				className: "text-xs text-slate-500 dark:text-slate-400",
				children: d
			}), f && !p && /* @__PURE__ */ r("span", {
				className: e("text-xs font-medium tabular-nums ml-auto", o[l]),
				children: [v, "%"]
			})]
		}), /* @__PURE__ */ n("div", {
			role: "progressbar",
			"aria-valuenow": p ? void 0 : v,
			"aria-valuemin": 0,
			"aria-valuemax": 100,
			className: e("w-full overflow-hidden rounded-full", s[u], i[l]),
			children: p ? /* @__PURE__ */ n(t.div, {
				className: e("h-full w-1/3 rounded-full", a[l]),
				animate: { x: ["-100%", "400%"] },
				transition: {
					duration: 1.4,
					repeat: Infinity,
					ease: "easeInOut"
				}
			}) : /* @__PURE__ */ n(t.div, {
				className: e("h-full rounded-full", a[l]),
				initial: h ? { width: 0 } : { width: `${v}%` },
				animate: { width: `${v}%` },
				transition: {
					duration: .5,
					ease: [
						.25,
						.46,
						.45,
						.94
					]
				}
			})
		})]
	});
}
//#endregion
export { c as Progressbar };

import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/timeline.tsx
var r = {
	default: "bg-slate-400 border-slate-400/30",
	success: "bg-emerald-400 border-emerald-400/30",
	warning: "bg-amber-400 border-amber-400/30",
	error: "bg-red-400 border-red-400/30",
	info: "bg-sky-400 border-sky-400/30"
}, i = {
	default: "bg-slate-500/15 text-slate-400",
	success: "bg-emerald-500/15 text-emerald-400",
	warning: "bg-amber-500/15 text-amber-400",
	error: "bg-red-500/15 text-red-400",
	info: "bg-sky-500/15 text-sky-400"
};
function a({ events: a, className: o }) {
	return /* @__PURE__ */ t("div", {
		className: e("flex flex-col", o),
		children: a.map((o, s) => {
			let c = s === a.length - 1, l = o.variant ?? "default";
			return /* @__PURE__ */ n("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ n("div", {
					className: "flex flex-col items-center",
					children: [o.icon ? /* @__PURE__ */ t("div", {
						className: e("w-8 h-8 rounded-full flex items-center justify-center shrink-0", i[l]),
						children: /* @__PURE__ */ t("span", {
							className: "w-4 h-4 flex items-center justify-center",
							children: o.icon
						})
					}) : /* @__PURE__ */ t("div", { className: e("w-2.5 h-2.5 rounded-full shrink-0 border-2 mt-1.5", r[l]) }), !c && /* @__PURE__ */ t("div", { className: "flex-1 w-px bg-black/10 dark:bg-white/10 my-1" })]
				}), /* @__PURE__ */ n("div", {
					className: e("pb-5 min-w-0", c && "pb-0"),
					children: [/* @__PURE__ */ n("div", {
						className: "flex items-baseline gap-2 flex-wrap",
						children: [/* @__PURE__ */ t("p", {
							className: "text-sm font-medium text-slate-700 dark:text-slate-200",
							children: o.title
						}), o.timestamp && /* @__PURE__ */ t("span", {
							className: "text-xs text-slate-500",
							children: o.timestamp
						})]
					}), o.description && /* @__PURE__ */ t("p", {
						className: "text-sm text-slate-500 mt-0.5",
						children: o.description
					})]
				})]
			}, o.id);
		})
	});
}
//#endregion
export { a as Timeline };

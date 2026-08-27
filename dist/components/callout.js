import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/callout.tsx
var r = {
	default: {
		wrap: "bg-black/4 dark:bg-white/4 border-black/12 dark:border-white/12",
		icon: "text-slate-500",
		defaultIcon: /* @__PURE__ */ n("svg", {
			width: "15",
			height: "15",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [
				/* @__PURE__ */ t("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				/* @__PURE__ */ t("path", { d: "M12 16v-4" }),
				/* @__PURE__ */ t("path", { d: "M12 8h.01" })
			]
		})
	},
	info: {
		wrap: "bg-sky-500/8 border-sky-500/20",
		icon: "text-sky-400",
		defaultIcon: /* @__PURE__ */ n("svg", {
			width: "15",
			height: "15",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [
				/* @__PURE__ */ t("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				/* @__PURE__ */ t("path", { d: "M12 16v-4" }),
				/* @__PURE__ */ t("path", { d: "M12 8h.01" })
			]
		})
	},
	success: {
		wrap: "bg-emerald-500/8 border-emerald-500/20",
		icon: "text-emerald-400",
		defaultIcon: /* @__PURE__ */ n("svg", {
			width: "15",
			height: "15",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [/* @__PURE__ */ t("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ t("path", { d: "m9 11 3 3L22 4" })]
		})
	},
	warning: {
		wrap: "bg-amber-500/8 border-amber-500/20",
		icon: "text-amber-400",
		defaultIcon: /* @__PURE__ */ n("svg", {
			width: "15",
			height: "15",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [
				/* @__PURE__ */ t("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }),
				/* @__PURE__ */ t("path", { d: "M12 9v4" }),
				/* @__PURE__ */ t("path", { d: "M12 17h.01" })
			]
		})
	},
	error: {
		wrap: "bg-red-500/8 border-red-500/20",
		icon: "text-red-400",
		defaultIcon: /* @__PURE__ */ n("svg", {
			width: "15",
			height: "15",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [
				/* @__PURE__ */ t("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				/* @__PURE__ */ t("path", { d: "m15 9-6 6" }),
				/* @__PURE__ */ t("path", { d: "m9 9 6 6" })
			]
		})
	}
};
function i({ variant: i = "info", icon: a, title: o, className: s, children: c, ...l }) {
	let { wrap: u, icon: d, defaultIcon: f } = r[i];
	return /* @__PURE__ */ n("div", {
		className: e("flex gap-3 rounded-xl border px-4 py-3.5", u, s),
		role: "note",
		...l,
		children: [/* @__PURE__ */ t("span", {
			className: e("shrink-0 mt-0.5", d),
			children: a ?? f
		}), /* @__PURE__ */ n("div", {
			className: "flex-1 min-w-0",
			children: [o && /* @__PURE__ */ t("p", {
				className: "text-sm font-semibold text-gray-900 dark:text-white mb-0.5 leading-snug",
				children: o
			}), /* @__PURE__ */ t("div", {
				className: "text-sm leading-relaxed text-slate-600 dark:text-slate-400",
				children: c
			})]
		})]
	});
}
//#endregion
export { i as Callout };

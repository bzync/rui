import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/separator.tsx
function r({ orientation: r = "horizontal", label: i, className: a, ...o }) {
	return r === "vertical" ? /* @__PURE__ */ t("div", {
		className: e("w-px self-stretch bg-black/8 dark:bg-white/8", a),
		...o
	}) : i ? /* @__PURE__ */ n("div", {
		className: e("flex items-center gap-3", a),
		...o,
		children: [
			/* @__PURE__ */ t("div", { className: "flex-1 h-px bg-black/8 dark:bg-white/8" }),
			/* @__PURE__ */ t("span", {
				className: "text-xs text-slate-500 font-medium shrink-0",
				children: i
			}),
			/* @__PURE__ */ t("div", { className: "flex-1 h-px bg-black/8 dark:bg-white/8" })
		]
	}) : /* @__PURE__ */ t("div", {
		className: e("h-px w-full bg-black/8 dark:bg-white/8", a),
		...o
	});
}
//#endregion
export { r as Separator };

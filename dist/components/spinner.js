import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/spinner.tsx
var r = {
	xs: "w-3 h-3",
	sm: "w-4 h-4",
	md: "w-5 h-5",
	lg: "w-7 h-7"
};
function i({ size: i = "md", className: a }) {
	return /* @__PURE__ */ n("svg", {
		className: e("animate-spin text-accent-500 dark:text-accent-400", r[i], a),
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-label": "Loading",
		children: [/* @__PURE__ */ t("circle", {
			className: "opacity-20",
			cx: "12",
			cy: "12",
			r: "10",
			stroke: "currentColor",
			strokeWidth: "3"
		}), /* @__PURE__ */ t("path", {
			className: "opacity-80",
			fill: "currentColor",
			d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
		})]
	});
}
//#endregion
export { i as Spinner };

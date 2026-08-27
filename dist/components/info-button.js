"use client";
import { jsx as e, jsxs as t } from "react/jsx-runtime";
//#region src/components/info-button.tsx
function n({ onClick: n, label: r }) {
	return /* @__PURE__ */ e("button", {
		type: "button",
		onClick: n,
		className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",
		"aria-label": r,
		children: /* @__PURE__ */ t("svg", {
			width: "13",
			height: "13",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [
				/* @__PURE__ */ e("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				/* @__PURE__ */ e("path", { d: "M12 16v-4" }),
				/* @__PURE__ */ e("path", { d: "M12 8h.01" })
			]
		})
	});
}
//#endregion
export { n as InfoButton };

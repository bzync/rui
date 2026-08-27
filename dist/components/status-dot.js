import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/status-dot.tsx
var r = {
	online: "bg-emerald-400",
	offline: "bg-slate-500",
	idle: "bg-amber-400",
	busy: "bg-red-400",
	error: "bg-red-500",
	pending: "bg-sky-400"
}, i = {
	sm: "w-1.5 h-1.5",
	md: "w-2 h-2",
	lg: "w-2.5 h-2.5"
};
function a({ status: a, label: o, pulse: s = !1, size: c = "md", className: l }) {
	return /* @__PURE__ */ n("span", {
		className: e("inline-flex items-center gap-1.5", l),
		children: [/* @__PURE__ */ n("span", {
			className: "relative flex items-center justify-center",
			children: [s && (a === "online" || a === "pending") && /* @__PURE__ */ t("span", { className: e("absolute inline-flex rounded-full opacity-75 animate-ping", r[a], i[c]) }), /* @__PURE__ */ t("span", { className: e("relative inline-flex rounded-full", r[a], i[c]) })]
		}), o && /* @__PURE__ */ t("span", {
			className: "text-sm text-slate-600 dark:text-slate-300",
			children: o
		})]
	});
}
//#endregion
export { a as StatusDot };

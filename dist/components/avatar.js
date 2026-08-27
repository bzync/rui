import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/avatar.tsx
var r = {
	xs: "w-6 h-6 text-[10px]",
	sm: "w-8 h-8 text-xs",
	md: "w-9 h-9 text-sm",
	lg: "w-11 h-11 text-base",
	xl: "w-14 h-14 text-lg"
}, i = {
	xs: "w-1.5 h-1.5 border",
	sm: "w-2 h-2 border",
	md: "w-2.5 h-2.5 border-2",
	lg: "w-3 h-3 border-2",
	xl: "w-3.5 h-3.5 border-2"
}, a = {
	online: "bg-emerald-400",
	offline: "bg-slate-500",
	away: "bg-amber-400",
	busy: "bg-red-400"
}, o = [
	"bg-blue-600",
	"bg-violet-600",
	"bg-emerald-600",
	"bg-rose-600",
	"bg-amber-600",
	"bg-cyan-600",
	"bg-pink-600",
	"bg-teal-600"
];
function s(e) {
	return e.split(" ").slice(0, 2).map((e) => e[0]?.toUpperCase() ?? "").join("");
}
function c(e) {
	return o[[...e].reduce((e, t) => e + t.charCodeAt(0), 0) % o.length];
}
function l({ src: o, name: l, alt: u, size: d = "md", status: f, loading: p = "lazy", decoding: m = "async", referrerPolicy: h = "no-referrer", className: g, ..._ }) {
	let v = l ? c(l) : "bg-slate-600", y = l ? s(l) : "?";
	return /* @__PURE__ */ n("div", {
		className: e("relative inline-flex shrink-0 rounded-full", g),
		..._,
		children: [/* @__PURE__ */ t("div", {
			className: e("rounded-full overflow-hidden flex items-center justify-center font-semibold text-white", r[d], !o && v),
			children: o ? /* @__PURE__ */ t("img", {
				src: o,
				alt: u ?? l ?? "",
				loading: p,
				decoding: m,
				referrerPolicy: h,
				className: "w-full h-full object-cover"
			}) : /* @__PURE__ */ t("span", { children: y })
		}), f && /* @__PURE__ */ t("span", { className: e("absolute bottom-0 right-0 rounded-full border-white dark:border-navy-900", i[d], a[f]) })]
	});
}
//#endregion
export { l as Avatar };

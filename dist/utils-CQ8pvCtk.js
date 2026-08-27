import { t as e } from "./cn-DpgY2leY.js";
import { useEffect as t, useState as n } from "react";
import { jsx as r } from "react/jsx-runtime";
//#region src/components/select/utils.tsx
function i(e) {
	return "group" in e;
}
var a = {
	default: "bg-slate-400",
	success: "bg-emerald-400",
	warning: "bg-amber-400",
	error: "bg-red-400",
	info: "bg-sky-400"
};
function o(e) {
	let t = 0;
	return e.flatMap((e) => i(e) ? e.options.map((e) => ({
		...e,
		flatIdx: e.disabled ? -1 : t++
	})) : [{
		...e,
		flatIdx: e.disabled ? -1 : t++
	}]);
}
function s(e, r) {
	let [i, a] = n(null);
	return t(() => {
		if (!e) {
			a(null);
			return;
		}
		function t() {
			let e = r.current?.getBoundingClientRect();
			if (!e) return;
			let t = window.innerHeight - e.bottom - 6 - 8, n = e.top - 6 - 8, i = t >= Math.min(256, n) ? "bottom" : "top", o = Math.max(96, Math.min(256, i === "bottom" ? t : n)), s = i === "bottom" ? e.bottom + 6 : Math.max(8, e.top - 6 - o), c = Math.max(8, Math.min(e.left, window.innerWidth - e.width - 8));
			a({
				top: s,
				left: c,
				width: e.width,
				maxHeight: o,
				placement: i
			});
		}
		return t(), window.addEventListener("scroll", t, !0), window.addEventListener("resize", t), () => {
			window.removeEventListener("scroll", t, !0), window.removeEventListener("resize", t);
		};
	}, [e, r]), i;
}
var c = () => /* @__PURE__ */ r("svg", {
	width: "10",
	height: "10",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "3",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	children: /* @__PURE__ */ r("path", { d: "M18 6 6 18M6 6l12 12" })
}), l = ({ open: t }) => /* @__PURE__ */ r("svg", {
	className: e("shrink-0 text-slate-500 transition-transform duration-150", t && "rotate-180"),
	width: "12",
	height: "12",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2.5",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	children: /* @__PURE__ */ r("path", { d: "m6 9 6 6 6-6" })
});
//#endregion
export { i as a, o as i, c as n, s as o, a as r, l as t };

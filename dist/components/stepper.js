import { t as e } from "../cn-DpgY2leY.js";
import { Fragment as t, jsx as n, jsxs as r } from "react/jsx-runtime";
//#region src/components/stepper.tsx
function i({ steps: i, current: a, orientation: o = "horizontal", className: s }) {
	return /* @__PURE__ */ n("div", {
		className: e(o === "vertical" ? "flex flex-col gap-0" : "flex items-start gap-0 min-w-0 overflow-x-auto", s),
		children: i.map((s, c) => {
			let l = c < a, u = c === a, d = c === i.length - 1;
			return /* @__PURE__ */ n("div", {
				className: e(o === "vertical" ? "flex gap-3" : "flex flex-col items-center flex-1"),
				children: o === "horizontal" ? /* @__PURE__ */ r(t, { children: [/* @__PURE__ */ r("div", {
					className: "flex items-center w-full",
					children: [/* @__PURE__ */ n("div", {
						className: e("w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold border-2 transition-colors", l ? "bg-primary border-primary text-primary-foreground" : u ? "border-accent-500 text-accent-400 bg-accent-500/10" : "border-black/15 dark:border-white/15 text-slate-500"),
						children: l ? /* @__PURE__ */ n("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ n("path", { d: "m20 6-11 11-5-5" })
						}) : c + 1
					}), !d && /* @__PURE__ */ n("div", { className: e("flex-1 h-0.5 mx-2 rounded-full transition-colors", l ? "bg-primary" : "bg-border") })]
				}), /* @__PURE__ */ r("div", {
					className: "mt-2 text-center px-1",
					children: [/* @__PURE__ */ n("p", {
						className: e("text-xs font-medium", u ? "text-gray-900 dark:text-white" : "text-slate-500"),
						children: s.label
					}), s.description && /* @__PURE__ */ n("p", {
						className: "text-[10px] text-slate-500 mt-0.5",
						children: s.description
					})]
				})] }) : /* @__PURE__ */ r(t, { children: [/* @__PURE__ */ r("div", {
					className: "flex flex-col items-center",
					children: [/* @__PURE__ */ n("div", {
						className: e("w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold border-2 transition-colors", l ? "bg-primary border-primary text-primary-foreground" : u ? "border-accent-500 text-accent-400 bg-accent-500/10" : "border-black/15 dark:border-white/15 text-slate-500"),
						children: l ? /* @__PURE__ */ n("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ n("path", { d: "m20 6-11 11-5-5" })
						}) : c + 1
					}), !d && /* @__PURE__ */ n("div", { className: e("w-0.5 flex-1 min-h-8 my-1 rounded-full", l ? "bg-primary" : "bg-border") })]
				}), /* @__PURE__ */ r("div", {
					className: "pb-6",
					children: [/* @__PURE__ */ n("p", {
						className: e("text-sm font-medium leading-none mt-1.5", u ? "text-gray-900 dark:text-white" : "text-slate-500"),
						children: s.label
					}), s.description && /* @__PURE__ */ n("p", {
						className: "text-xs text-slate-500 mt-1",
						children: s.description
					})]
				})] })
			}, c);
		})
	});
}
//#endregion
export { i as Stepper };

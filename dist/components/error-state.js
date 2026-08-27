import { t as e } from "../cn-DpgY2leY.js";
import { Button as t } from "./button.js";
import { jsx as n, jsxs as r } from "react/jsx-runtime";
//#region src/components/error-state.tsx
function i({ title: i = "Something went wrong", description: a = "An unexpected error occurred. Please try again.", error: o, onRetry: s, action: c, className: l }) {
	let u = o instanceof Error ? o.message : o;
	return /* @__PURE__ */ r("div", {
		role: "alert",
		className: e("flex flex-col items-center justify-center text-center px-4 py-10", l),
		children: [
			/* @__PURE__ */ n("div", {
				className: "mb-3 flex size-9 items-center justify-center text-destructive",
				children: /* @__PURE__ */ r("svg", {
					"aria-hidden": "true",
					width: "22",
					height: "22",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.75",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: [
						/* @__PURE__ */ n("circle", {
							cx: "12",
							cy: "12",
							r: "10"
						}),
						/* @__PURE__ */ n("line", {
							x1: "12",
							y1: "8",
							x2: "12",
							y2: "12"
						}),
						/* @__PURE__ */ n("line", {
							x1: "12",
							y1: "16",
							x2: "12.01",
							y2: "16"
						})
					]
				})
			}),
			/* @__PURE__ */ n("p", {
				className: "text-base font-semibold text-foreground",
				children: i
			}),
			/* @__PURE__ */ n("p", {
				className: "mt-1.5 max-w-sm text-sm leading-5 text-muted-foreground",
				children: a
			}),
			u && /* @__PURE__ */ n("p", {
				className: "mt-3 max-w-sm break-all rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 font-mono text-xs text-destructive",
				children: u
			}),
			(s || c) && /* @__PURE__ */ r("div", {
				className: "mt-5 flex items-center gap-3",
				children: [s && /* @__PURE__ */ n(t, {
					variant: "outline",
					size: "sm",
					onClick: s,
					icon: /* @__PURE__ */ r("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ n("path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }), /* @__PURE__ */ n("path", { d: "M3 3v5h5" })]
					}),
					children: "Try again"
				}), c]
			})
		]
	});
}
//#endregion
export { i as ErrorState };

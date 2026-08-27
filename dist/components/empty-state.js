import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/empty-state.tsx
var r = {
	sm: {
		wrap: "py-6",
		icon: "w-5 h-5",
		title: "text-sm",
		desc: "text-xs",
		iconWrap: "w-8 h-8"
	},
	md: {
		wrap: "py-10",
		icon: "w-6 h-6",
		title: "text-base",
		desc: "text-sm",
		iconWrap: "w-9 h-9"
	},
	lg: {
		wrap: "py-12",
		icon: "w-7 h-7",
		title: "text-lg",
		desc: "text-sm",
		iconWrap: "w-10 h-10"
	}
}, i = ({ className: e }) => /* @__PURE__ */ n("svg", {
	className: e,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "1.5",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	children: [/* @__PURE__ */ t("circle", {
		cx: "11",
		cy: "11",
		r: "8"
	}), /* @__PURE__ */ t("path", { d: "m21 21-4.35-4.35" })]
});
function a({ icon: a, title: o, description: s, action: c, className: l, size: u = "md" }) {
	let d = r[u];
	return /* @__PURE__ */ n("div", {
		className: e("flex flex-col items-center justify-center text-center px-4", d.wrap, l),
		children: [
			/* @__PURE__ */ t("div", {
				className: e("mb-3 flex items-center justify-center text-muted-foreground", d.iconWrap),
				children: a ? /* @__PURE__ */ t("span", {
					className: e("inline-flex items-center justify-center text-muted-foreground", d.icon),
					children: a
				}) : /* @__PURE__ */ t(i, { className: e("text-muted-foreground", d.icon) })
			}),
			/* @__PURE__ */ t("p", {
				className: e("font-semibold text-foreground", d.title),
				children: o
			}),
			s && /* @__PURE__ */ t("p", {
				className: e("mt-1.5 max-w-sm leading-5 text-muted-foreground", d.desc),
				children: s
			}),
			c && /* @__PURE__ */ t("div", {
				className: "mt-4",
				children: c
			})
		]
	});
}
//#endregion
export { a as EmptyState };

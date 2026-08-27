"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { o as t } from "../component-styles-Ce56hn9T.js";
import { motion as n } from "framer-motion";
import { createContext as r, useContext as i, useId as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/components/radio.tsx
var c = r(null);
function l() {
	let e = i(c);
	if (!e) throw Error("Radio must be inside <RadioGroup>");
	return e;
}
function u({ name: n, value: r, onChange: i, disabled: l, label: u, hint: d, error: f, orientation: p = "vertical", className: m, children: h }) {
	let g = a(), _ = n ?? g, v = `${_}-label`, y = `${_}-message`;
	return /* @__PURE__ */ s("div", {
		className: e(t, m),
		children: [
			u && /* @__PURE__ */ o("p", {
				id: v,
				className: "text-sm font-medium leading-5 text-foreground",
				children: u
			}),
			/* @__PURE__ */ o(c.Provider, {
				value: {
					name: _,
					value: r,
					onChange: i,
					disabled: l
				},
				children: /* @__PURE__ */ o("div", {
					role: "radiogroup",
					"aria-labelledby": u ? v : void 0,
					"aria-invalid": f ? !0 : void 0,
					"aria-describedby": f || d ? y : void 0,
					className: e("flex gap-2", p === "vertical" ? "flex-col" : "flex-row flex-wrap"),
					children: h
				})
			}),
			f && /* @__PURE__ */ o("p", {
				id: y,
				"aria-live": "polite",
				className: "text-xs leading-5 text-destructive",
				children: f
			}),
			d && !f && /* @__PURE__ */ o("p", {
				id: y,
				className: "text-xs leading-5 text-muted-foreground",
				children: d
			})
		]
	});
}
function d({ value: t, label: r, description: i, disabled: c, className: u }) {
	let { name: d, value: f, onChange: p, disabled: m } = l(), h = a(), g = f === t, _ = c ?? m;
	return /* @__PURE__ */ s("label", {
		htmlFor: h,
		className: e("flex items-start gap-2.5 cursor-pointer", _ && "cursor-not-allowed opacity-50", u),
		children: [/* @__PURE__ */ s("div", {
			className: "relative mt-0.5 shrink-0 w-4 h-4",
			children: [/* @__PURE__ */ o("input", {
				type: "radio",
				id: h,
				name: d,
				value: t,
				checked: g,
				disabled: _,
				onChange: () => p(t),
				className: "peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
			}), /* @__PURE__ */ o("div", {
				className: e("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-[120ms] peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg", g ? "bg-primary border-primary" : "bg-transparent border-black/25 dark:border-white/25"),
				children: g && /* @__PURE__ */ o(n.span, {
					initial: { scale: 0 },
					animate: { scale: 1 },
					transition: {
						type: "spring",
						stiffness: 600,
						damping: 30
					},
					className: "w-1.5 h-1.5 rounded-full bg-white"
				})
			})]
		}), (r || i) && /* @__PURE__ */ s("div", {
			className: "min-w-0",
			children: [r && /* @__PURE__ */ o("p", {
				className: "text-sm font-medium text-foreground leading-snug",
				children: r
			}), i && /* @__PURE__ */ o("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: i
			})]
		})]
	});
}
//#endregion
export { d as Radio, u as RadioGroup };

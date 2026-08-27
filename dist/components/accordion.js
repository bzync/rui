"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { s as t } from "../component-styles-Ce56hn9T.js";
import { AnimatePresence as n, motion as r } from "framer-motion";
import { useId as i, useState as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/components/accordion.tsx
function c({ items: c, multiple: l = !1, defaultOpen: u = [], className: d, ...f }) {
	let [p, m] = a(new Set(u)), h = i();
	function g(e) {
		m((t) => {
			let n = new Set(t);
			return n.has(e) ? n.delete(e) : (l || n.clear(), n.add(e)), n;
		});
	}
	return /* @__PURE__ */ o("div", {
		className: e("flex flex-col divide-y divide-border", d),
		...f,
		children: c.map((i) => {
			let a = p.has(i.id), c = encodeURIComponent(i.id), l = `${h}-trigger-${c}`, u = `${h}-panel-${c}`;
			return /* @__PURE__ */ s("div", { children: [/* @__PURE__ */ s("button", {
				type: "button",
				id: l,
				"aria-expanded": a,
				"aria-controls": u,
				disabled: i.disabled,
				onClick: () => g(i.id),
				className: e("flex items-center justify-between w-full py-3.5 text-left gap-3 transition-colors", "text-foreground hover:text-foreground", t, i.disabled && "opacity-40 cursor-not-allowed"),
				children: [/* @__PURE__ */ o("span", {
					className: "flex-1 min-w-0",
					children: i.trigger
				}), /* @__PURE__ */ o(r.span, {
					animate: { rotate: a ? 180 : 0 },
					transition: { duration: .2 },
					className: "shrink-0 text-slate-500",
					children: /* @__PURE__ */ o("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: /* @__PURE__ */ o("path", { d: "m6 9 6 6 6-6" })
					})
				})]
			}), /* @__PURE__ */ o(n, {
				initial: !1,
				children: a && /* @__PURE__ */ o(r.div, {
					id: u,
					role: "region",
					"aria-labelledby": l,
					initial: {
						height: 0,
						opacity: 0
					},
					animate: {
						height: "auto",
						opacity: 1
					},
					exit: {
						height: 0,
						opacity: 0
					},
					transition: {
						duration: .2,
						ease: "easeInOut"
					},
					className: "overflow-hidden",
					children: /* @__PURE__ */ o("div", {
						className: "pb-4 text-sm leading-6 text-muted-foreground",
						children: i.content
					})
				})
			})] }, i.id);
		})
	});
}
function l({ open: e, onOpenChange: t, defaultOpen: c = !1, trigger: l, children: u, className: d }) {
	let [f, p] = a(c), m = i(), h = e ?? f;
	function g() {
		let n = !h;
		e === void 0 && p(n), t?.(n);
	}
	return /* @__PURE__ */ s("div", {
		className: d,
		children: [/* @__PURE__ */ o("button", {
			type: "button",
			onClick: g,
			"aria-expanded": h,
			"aria-controls": m,
			className: "block w-full cursor-pointer text-left",
			children: l
		}), /* @__PURE__ */ o(n, {
			initial: !1,
			children: h && /* @__PURE__ */ o(r.div, {
				id: m,
				initial: {
					height: 0,
					opacity: 0
				},
				animate: {
					height: "auto",
					opacity: 1
				},
				exit: {
					height: 0,
					opacity: 0
				},
				transition: {
					duration: .2,
					ease: "easeInOut"
				},
				className: "overflow-hidden",
				children: u
			})
		})]
	});
}
//#endregion
export { c as Accordion, l as Collapsible };

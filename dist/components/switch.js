"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { motion as t } from "framer-motion";
import { forwardRef as n, useEffect as r, useId as i, useState as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/components/switch.tsx
var c = {
	sm: {
		w: 36,
		h: 20,
		thumb: 14,
		gap: 3
	},
	md: {
		w: 44,
		h: 24,
		thumb: 18,
		gap: 3
	}
}, l = n(({ className: n, label: l, description: u, size: d = "md", checked: f, defaultChecked: p, onChange: m, onCheckedChange: h, disabled: g, id: _, ...v }, y) => {
	let [b, x] = a(f === void 0 ? p ?? !1 : f);
	r(() => {
		f !== void 0 && x(f);
	}, [f]);
	let S = i(), C = _ ?? S, w = c[d], T = b ? w.w - w.thumb - w.gap : w.gap;
	return /* @__PURE__ */ s("label", {
		htmlFor: C,
		className: e("flex items-start gap-3 cursor-pointer", g && "cursor-not-allowed opacity-50", n),
		children: [/* @__PURE__ */ s("div", {
			className: "relative mt-0.5 shrink-0",
			style: {
				width: w.w,
				height: w.h
			},
			children: [
				/* @__PURE__ */ o("input", {
					ref: y,
					type: "checkbox",
					id: C,
					className: "peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed",
					checked: b,
					disabled: g,
					onChange: (e) => {
						f === void 0 && x(e.target.checked), m?.(e), h?.(e.target.checked);
					},
					...v
				}),
				/* @__PURE__ */ o("div", { className: e("rounded-full w-full h-full border transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg", b ? "bg-primary border-primary" : "bg-muted border-border-strong") }),
				/* @__PURE__ */ o(t.span, {
					className: "absolute rounded-full bg-white shadow-md shadow-black/20",
					style: {
						width: w.thumb,
						height: w.thumb,
						top: w.gap,
						boxShadow: "0 1px 4px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(0,0,0,0.06)"
					},
					animate: { x: T },
					transition: {
						type: "spring",
						stiffness: 600,
						damping: 35
					}
				})
			]
		}), (l || u) && /* @__PURE__ */ s("div", {
			className: "min-w-0",
			children: [l && /* @__PURE__ */ o("p", {
				className: "text-sm font-medium text-foreground",
				children: l
			}), u && /* @__PURE__ */ o("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: u
			})]
		})]
	});
});
l.displayName = "Switch";
//#endregion
export { l as Switch };

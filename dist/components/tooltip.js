"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { AnimatePresence as t, motion as n } from "framer-motion";
import { cloneElement as r, isValidElement as i, useEffect as a, useId as o, useRef as s, useState as c } from "react";
import { jsx as l, jsxs as u } from "react/jsx-runtime";
//#region src/components/tooltip.tsx
var d = {
	top: {
		container: "bottom-full left-1/2 -translate-x-1/2 mb-2",
		initial: { y: 4 }
	},
	bottom: {
		container: "top-full left-1/2 -translate-x-1/2 mt-2",
		initial: { y: -4 }
	},
	left: {
		container: "right-full top-1/2 -translate-y-1/2 mr-2",
		initial: { x: 4 }
	},
	right: {
		container: "left-full top-1/2 -translate-y-1/2 ml-2",
		initial: { x: -4 }
	}
};
function f({ content: f, children: p, position: m = "top", delayMs: h = 0, className: g }) {
	let [_, v] = c(!1), y = s(null), b = o(), { container: x, initial: S } = d[m];
	function C() {
		h > 0 ? y.current = setTimeout(() => v(!0), h) : v(!0);
	}
	function w() {
		y.current && clearTimeout(y.current), v(!1);
	}
	a(() => () => {
		y.current && clearTimeout(y.current);
	}, []);
	let T = i(p) ? r(p, {
		"aria-describedby": _ ? b : void 0,
		onMouseEnter: (e) => {
			p.props.onMouseEnter?.(e), e.defaultPrevented || C();
		},
		onMouseLeave: (e) => {
			p.props.onMouseLeave?.(e), w();
		},
		onFocus: (e) => {
			p.props.onFocus?.(e), e.defaultPrevented || C();
		},
		onBlur: (e) => {
			p.props.onBlur?.(e), w();
		}
	}) : /* @__PURE__ */ l("span", {
		tabIndex: 0,
		"aria-describedby": _ ? b : void 0,
		onMouseEnter: C,
		onMouseLeave: w,
		onFocus: C,
		onBlur: w,
		children: p
	});
	return /* @__PURE__ */ u("div", {
		className: "relative inline-flex",
		children: [T, /* @__PURE__ */ l(t, { children: _ && /* @__PURE__ */ l(n.div, {
			id: b,
			role: "tooltip",
			initial: {
				opacity: 0,
				...S
			},
			animate: {
				opacity: 1,
				y: 0,
				x: 0
			},
			exit: {
				opacity: 0,
				...S
			},
			transition: { duration: .12 },
			className: e("absolute z-50 pointer-events-none", "max-w-[min(20rem,calc(100vw-2rem))] rounded-md px-2.5 py-1.5 text-xs font-medium leading-4", "border border-slate-700 bg-slate-900 text-slate-50 shadow-floating dark:border-border-strong dark:bg-surface-raised dark:text-foreground", x, g),
			children: f
		}) })]
	});
}
//#endregion
export { f as Tooltip };

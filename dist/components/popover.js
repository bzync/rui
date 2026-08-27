"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { AnimatePresence as t, motion as n } from "framer-motion";
import { cloneElement as r, isValidElement as i, useEffect as a, useId as o, useRef as s, useState as c } from "react";
import { jsx as l, jsxs as u } from "react/jsx-runtime";
//#region src/components/popover.tsx
var d = {
	top: {
		container: "bottom-full mb-2",
		initial: { y: 4 }
	},
	bottom: {
		container: "top-full mt-2",
		initial: { y: -4 }
	},
	left: {
		container: "right-full mr-2",
		initial: { x: 4 }
	},
	right: {
		container: "left-full ml-2",
		initial: { x: -4 }
	}
}, f = {
	top: {
		start: "left-0",
		center: "left-1/2 -translate-x-1/2",
		end: "right-0"
	},
	bottom: {
		start: "left-0",
		center: "left-1/2 -translate-x-1/2",
		end: "right-0"
	},
	left: {
		start: "top-0",
		center: "top-1/2 -translate-y-1/2",
		end: "bottom-0"
	},
	right: {
		start: "top-0",
		center: "top-1/2 -translate-y-1/2",
		end: "bottom-0"
	}
};
function p({ trigger: p, children: m, side: h = "bottom", align: g = "start", className: _, open: v, onOpenChange: y, ariaLabel: b = "Popover" }) {
	let [x, S] = c(!1), C = v ?? x, w = s(null), T = o();
	function E() {
		let e = !C;
		v === void 0 && S(e), y?.(e);
	}
	function D() {
		v === void 0 && S(!1), y?.(!1);
	}
	a(() => {
		function e(e) {
			w.current?.contains(e.target) || D();
		}
		function t(e) {
			e.key === "Escape" && C && (e.preventDefault(), D(), w.current?.querySelector("[aria-haspopup=\"dialog\"]")?.focus());
		}
		return document.addEventListener("mousedown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("mousedown", e), document.removeEventListener("keydown", t);
		};
	}, [T, C]);
	let { container: O, initial: k } = d[h], A = f[h][g], j = i(p) ? r(p, {
		"aria-haspopup": "dialog",
		"aria-expanded": C,
		"aria-controls": T,
		onClick: (e) => {
			p.props.onClick?.(e), e.defaultPrevented || E();
		}
	}) : /* @__PURE__ */ l("button", {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": C,
		"aria-controls": T,
		onClick: E,
		children: p
	});
	return /* @__PURE__ */ u("div", {
		ref: w,
		className: "relative inline-flex",
		children: [j, /* @__PURE__ */ l(t, { children: C && /* @__PURE__ */ l(n.div, {
			id: T,
			role: "dialog",
			"aria-label": b,
			initial: {
				opacity: 0,
				...k
			},
			animate: {
				opacity: 1,
				y: 0,
				x: 0
			},
			exit: {
				opacity: 0,
				...k
			},
			transition: { duration: .13 },
			className: e("absolute z-50 min-w-[180px] rounded-[var(--radius-lg)] border border-border bg-surface-raised shadow-floating", O, A, _),
			children: m
		}) })]
	});
}
function m({ className: t, children: n, ...r }) {
	return /* @__PURE__ */ l("div", {
		className: e("p-3", t),
		...r,
		children: n
	});
}
//#endregion
export { p as Popover, m as PopoverContent };

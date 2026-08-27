"use client";
import { t as e } from "../cn-DpgY2leY.js";
import "../component-styles-Ce56hn9T.js";
import { AnimatePresence as t, motion as n } from "framer-motion";
import { forwardRef as r, useEffect as i, useId as a, useRef as o, useState as s } from "react";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/components/checkbox.tsx
var u = {
	sm: {
		box: "w-3.5 h-3.5 rounded",
		check: 10,
		label: "text-xs",
		desc: "text-[10px]"
	},
	md: {
		box: "w-4 h-4 rounded-[4px]",
		check: 11,
		label: "text-sm",
		desc: "text-xs"
	},
	lg: {
		box: "w-5 h-5 rounded-md",
		check: 13,
		label: "text-sm",
		desc: "text-xs"
	}
}, d = r(({ className: r, label: d, description: f, size: p = "md", checked: m, defaultChecked: h, indeterminate: g = !1, onChange: _, disabled: v, error: y, id: b, ...x }, S) => {
	let [C, w] = s(m === void 0 ? h ?? !1 : m);
	i(() => {
		m !== void 0 && w(m);
	}, [m]);
	let T = a(), E = b ?? T, D = `${E}-message`, O = o(null), k = u[p], A = C || g;
	return i(() => {
		O.current && (O.current.indeterminate = g);
	}, [g]), /* @__PURE__ */ l("div", {
		className: e("flex flex-col gap-1", r),
		children: [/* @__PURE__ */ l("label", {
			htmlFor: E,
			className: e("flex items-start gap-2.5 cursor-pointer", v && "cursor-not-allowed opacity-50"),
			children: [/* @__PURE__ */ l("div", {
				className: e("relative mt-0.5 shrink-0", k.box),
				children: [/* @__PURE__ */ c("input", {
					ref: (e) => {
						O.current = e, typeof S == "function" ? S(e) : S && (S.current = e);
					},
					type: "checkbox",
					id: E,
					className: "peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed",
					"aria-invalid": y ? !0 : void 0,
					"aria-describedby": y || f ? D : void 0,
					"aria-checked": g ? "mixed" : C,
					checked: C,
					disabled: v,
					onChange: (e) => {
						m === void 0 && w(e.target.checked), _?.(e);
					},
					...x
				}), /* @__PURE__ */ c("div", {
					className: e("w-full h-full border-2 flex items-center justify-center transition-colors duration-[120ms] peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg", k.box, A ? "bg-accent-600 border-accent-600 dark:bg-accent-500 dark:border-accent-500" : y ? "bg-transparent border-red-500/50" : "bg-transparent border-black/25 dark:border-white/25"),
					children: /* @__PURE__ */ c(t, {
						mode: "wait",
						children: g ? /* @__PURE__ */ c(n.svg, {
							initial: {
								scale: 0,
								opacity: 0
							},
							animate: {
								scale: 1,
								opacity: 1
							},
							exit: {
								scale: 0,
								opacity: 0
							},
							transition: { duration: .1 },
							width: k.check,
							height: k.check,
							viewBox: "0 0 14 14",
							fill: "none",
							stroke: "white",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							children: /* @__PURE__ */ c("path", { d: "M3 7h8" })
						}, "minus") : C ? /* @__PURE__ */ c(n.svg, {
							initial: {
								scale: 0,
								opacity: 0
							},
							animate: {
								scale: 1,
								opacity: 1
							},
							exit: {
								scale: 0,
								opacity: 0
							},
							transition: {
								type: "spring",
								stiffness: 600,
								damping: 30
							},
							width: k.check,
							height: k.check,
							viewBox: "0 0 14 14",
							fill: "none",
							stroke: "white",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ c("path", { d: "M2.5 7l3 3 6-6" })
						}, "check") : null
					})
				})]
			}), (d || f) && /* @__PURE__ */ l("div", {
				className: "min-w-0",
				children: [d && /* @__PURE__ */ c("p", {
					className: e("font-medium text-foreground leading-snug", k.label),
					children: d
				}), f && /* @__PURE__ */ c("p", {
					id: y ? void 0 : D,
					className: e("mt-0.5 text-muted-foreground", k.desc),
					children: f
				})]
			})]
		}), y && /* @__PURE__ */ c("p", {
			id: D,
			"aria-live": "polite",
			className: e("text-xs leading-5 text-destructive", "ml-[26px]"),
			children: y
		})]
	});
});
d.displayName = "Checkbox";
//#endregion
export { d as Checkbox };

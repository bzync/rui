import { t as e } from "./cn-DpgY2leY.js";
import { c as t } from "./component-styles-Ce56hn9T.js";
import { t as n } from "./use-event-callback-DGkfO_uu.js";
import { t as r } from "./focus-Dk1YWVPN.js";
import { t as i } from "./createLucideIcon-DDY8HuQR.js";
import { AnimatePresence as a, motion as o } from "framer-motion";
import { useEffect as s, useId as c, useRef as l } from "react";
import { Fragment as u, jsx as d, jsxs as f } from "react/jsx-runtime";
import { createPortal as p } from "react-dom";
var m = i("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
//#endregion
//#region src/components/drawer.tsx
function h({ open: i, onClose: h, position: g = "left", title: _, children: v, width: y = 320, className: b, overlayClassName: x, panelClassName: S, unstyled: C = !1, ariaLabel: w = "Drawer", closeAriaLabel: T = "Close drawer", closeOnEscape: E = !0, closeOnOverlayClick: D = !0 }) {
	let O = n(h), k = l(null), A = l(null), j = l(i), M = c();
	i && !j.current && typeof document < "u" && document.activeElement instanceof HTMLElement && (A.current = document.activeElement), j.current = i, s(() => {
		if (i) return;
		let e = (e) => {
			e.target instanceof HTMLElement && (A.current = e.target);
		};
		return !A.current && document.activeElement instanceof HTMLElement && (A.current = document.activeElement), document.addEventListener("focusin", e), () => document.removeEventListener("focusin", e);
	}, [i]), s(() => {
		if (!i) return;
		!A.current && document.activeElement instanceof HTMLElement && (A.current = document.activeElement);
		let e = document.body.style.overflow, t = (e) => {
			if (e.key === "Escape" && E) {
				e.preventDefault(), O();
				return;
			}
			if (e.key === "Tab" && k.current) {
				let t = r(k.current);
				if (t.length === 0) {
					e.preventDefault(), k.current.focus();
					return;
				}
				let n = t[0], i = t[t.length - 1];
				e.shiftKey && document.activeElement === n ? (e.preventDefault(), i.focus()) : !e.shiftKey && document.activeElement === i && (e.preventDefault(), n.focus());
			}
		};
		document.addEventListener("keydown", t), document.body.style.overflow = "hidden";
		let n = window.setTimeout(() => {
			(k.current?.querySelector("a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex=\"-1\"])") ?? k.current)?.focus();
		}, 0);
		return () => {
			clearTimeout(n), document.removeEventListener("keydown", t), document.body.style.overflow = e;
		};
	}, [
		E,
		i,
		O
	]), s(() => {
		if (i || !A.current) return;
		let e = A.current, t = window.setTimeout(() => e.focus(), 240);
		return () => window.clearTimeout(t);
	}, [i]);
	let N = () => {
		let e = A.current;
		A.current = null, window.setTimeout(() => e?.focus(), 0);
	};
	if (typeof document > "u") return null;
	if (C && i) return p(/* @__PURE__ */ d("div", {
		ref: k,
		tabIndex: -1,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": typeof _ == "string" ? _ : w,
		className: e(b, S),
		children: v
	}), document.body);
	if (g === "bottom") return p(/* @__PURE__ */ d(a, {
		onExitComplete: N,
		children: i && /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ d(o.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: .16 },
			className: e("fixed inset-0 z-[100] bg-overlay", x),
			onClick: D ? O : void 0
		}, "drawer-backdrop"), /* @__PURE__ */ f(o.div, {
			ref: k,
			tabIndex: -1,
			initial: { y: "100%" },
			animate: { y: 0 },
			exit: { y: "100%" },
			transition: {
				duration: .22,
				ease: [
					.16,
					1,
					.3,
					1
				]
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": _ ? M : void 0,
			"aria-label": _ ? void 0 : w,
			className: e("fixed bottom-0 left-0 right-0 z-[101] flex max-h-[80dvh] flex-col rounded-t-[var(--radius-xl)] border-t border-border bg-surface-raised shadow-overlay", S, b),
			children: [
				/* @__PURE__ */ d("div", {
					className: "flex justify-center pb-1 pt-3 shrink-0",
					"aria-hidden": "true",
					children: /* @__PURE__ */ d("div", { className: "h-1 w-9 rounded-full bg-border-strong" })
				}),
				_ && /* @__PURE__ */ f("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-3 shrink-0",
					children: [/* @__PURE__ */ d("h2", {
						id: M,
						className: "text-sm font-semibold text-foreground",
						children: _
					}), /* @__PURE__ */ d("button", {
						type: "button",
						onClick: O,
						className: t,
						"aria-label": T,
						children: /* @__PURE__ */ d(m, {
							size: 14,
							"aria-hidden": "true"
						})
					})]
				}),
				/* @__PURE__ */ d("div", {
					className: "flex-1 overflow-y-auto pb-safe-bottom",
					children: v
				})
			]
		}, "drawer-panel")] })
	}), document.body);
	let P = g === "left" ? "-100%" : "100%";
	return p(/* @__PURE__ */ d(a, {
		onExitComplete: N,
		children: i && /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ d(o.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: .16 },
			className: e("fixed inset-0 z-[100] bg-overlay", x),
			onClick: D ? O : void 0
		}, "drawer-backdrop"), /* @__PURE__ */ f(o.div, {
			ref: k,
			tabIndex: -1,
			initial: { x: P },
			animate: { x: 0 },
			exit: { x: P },
			transition: {
				duration: .22,
				ease: [
					.16,
					1,
					.3,
					1
				]
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": _ ? M : void 0,
			"aria-label": _ ? void 0 : w,
			className: e("fixed top-0 bottom-0 z-[101] flex max-w-[100vw] flex-col bg-surface-raised shadow-overlay", g === "left" ? "left-0 border-r border-border" : "right-0 border-l border-border", S, b),
			style: { width: y },
			children: [_ && /* @__PURE__ */ f("div", {
				className: "flex h-14 items-center justify-between gap-3 border-b border-border px-5 shrink-0",
				children: [/* @__PURE__ */ d("h2", {
					id: M,
					className: "min-w-0 truncate text-sm font-semibold text-foreground",
					children: _
				}), /* @__PURE__ */ d("button", {
					type: "button",
					onClick: O,
					className: t,
					"aria-label": T,
					children: /* @__PURE__ */ d(m, {
						size: 14,
						"aria-hidden": "true"
					})
				})]
			}), /* @__PURE__ */ d("div", {
				className: "flex-1 overflow-y-auto",
				children: v
			})]
		}, "drawer-panel")] })
	}), document.body);
}
//#endregion
export { h as t };

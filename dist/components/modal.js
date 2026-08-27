"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { c as t } from "../component-styles-Ce56hn9T.js";
import { t as n } from "../use-event-callback-DGkfO_uu.js";
import { t as r } from "../focus-Dk1YWVPN.js";
import { AnimatePresence as i, motion as a } from "framer-motion";
import { useEffect as o, useId as s, useRef as c } from "react";
import { jsx as l, jsxs as u } from "react/jsx-runtime";
//#region src/components/modal.tsx
var d = {
	sm: "max-w-[380px]",
	md: "max-w-[480px]",
	lg: "max-w-[560px]",
	xl: "max-w-[640px]",
	"2xl": "max-w-[720px]",
	"7xl": "max-w-3xl",
	full: "max-w-[calc(100vw-2rem)]"
};
function f({ open: f, onClose: p, children: m, className: h, overlayClassName: g, panelClassName: _, size: v = "md", title: y, description: b, icon: x, showCloseButton: S = !0, closeAriaLabel: C = "Close dialog", scrollable: w = !1, unstyled: T = !1, ariaLabel: E = "Dialog", closeOnEscape: D = !0, closeOnOverlayClick: O = !0 }) {
	let k = c(null), A = c(null), j = c(f), M = s(), N = s(), P = n(p);
	return f && !j.current && typeof document < "u" && document.activeElement instanceof HTMLElement && (A.current = document.activeElement), j.current = f, o(() => {
		if (f) return;
		let e = (e) => {
			e.target instanceof HTMLElement && (A.current = e.target);
		};
		return !A.current && document.activeElement instanceof HTMLElement && (A.current = document.activeElement), document.addEventListener("focusin", e), () => document.removeEventListener("focusin", e);
	}, [f]), o(() => {
		if (!f) return;
		!A.current && document.activeElement instanceof HTMLElement && (A.current = document.activeElement);
		let e = document.body.style.overflow, t = (e) => {
			if (e.key === "Escape" && D) {
				e.preventDefault(), P();
				return;
			}
			if (e.key !== "Tab" || !k.current) return;
			let t = r(k.current);
			if (t.length === 0) {
				e.preventDefault(), k.current.focus();
				return;
			}
			let n = t[0], i = t[t.length - 1];
			e.shiftKey && document.activeElement === n ? (e.preventDefault(), i.focus()) : !e.shiftKey && document.activeElement === i && (e.preventDefault(), n.focus());
		};
		document.addEventListener("keydown", t), document.body.style.overflow = "hidden";
		let n = () => {
			(k.current?.querySelector("[data-autofocus]") ?? k.current?.querySelector("[data-modal-content] a[href],[data-modal-content] button:not([disabled]),[data-modal-content] input:not([disabled]),[data-modal-content] select:not([disabled]),[data-modal-content] textarea:not([disabled]),[data-modal-content] [tabindex]:not([tabindex=\"-1\"])") ?? k.current?.querySelector("a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex=\"-1\"])") ?? k.current)?.focus();
		};
		n();
		let i = window.setTimeout(n, 0);
		return () => {
			window.clearTimeout(i), document.removeEventListener("keydown", t), document.body.style.overflow = e;
		};
	}, [
		D,
		f,
		P
	]), o(() => {
		if (f || !A.current) return;
		let e = A.current, t = window.setTimeout(() => e.focus(), 240);
		return () => window.clearTimeout(t);
	}, [f]), T ? f ? /* @__PURE__ */ l("div", {
		ref: k,
		role: "dialog",
		"aria-modal": "true",
		className: e(h, _),
		children: m
	}) : null : /* @__PURE__ */ l(i, {
		onExitComplete: () => {
			let e = A.current;
			A.current = null, window.setTimeout(() => e?.focus(), 0);
		},
		children: f && /* @__PURE__ */ u("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
			children: [/* @__PURE__ */ l(a.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .2 },
				className: e("absolute inset-0 bg-overlay", g),
				onClick: O ? P : void 0
			}), /* @__PURE__ */ u(a.div, {
				ref: k,
				initial: {
					opacity: 0,
					scale: .98,
					y: 10
				},
				animate: {
					opacity: 1,
					scale: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					scale: .98,
					y: 10
				},
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
				"aria-labelledby": y ? M : void 0,
				"aria-describedby": b ? N : void 0,
				"aria-label": y ? void 0 : E,
				tabIndex: -1,
				className: e("relative w-full overflow-hidden flex flex-col", "rounded-[var(--radius-xl)] border border-border bg-surface-raised shadow-overlay", "max-h-[min(90dvh,720px)]", d[v], _, h),
				children: [
					y && /* @__PURE__ */ u("div", {
						className: "flex items-start justify-between gap-4 border-b border-border px-5 pb-3 pt-4 sm:px-6 shrink-0",
						children: [/* @__PURE__ */ u("div", {
							className: "flex gap-3.5 min-w-0 flex-1",
							children: [x && /* @__PURE__ */ l("div", {
								className: "mt-0.5 shrink-0 text-muted-foreground [&_svg]:size-5",
								"aria-hidden": "true",
								children: x
							}), /* @__PURE__ */ u("div", {
								className: "min-w-0 flex-1 pt-0.5",
								children: [/* @__PURE__ */ l("h2", {
									id: M,
									className: "text-base font-semibold leading-6 text-foreground",
									children: y
								}), b && /* @__PURE__ */ l("p", {
									id: N,
									className: "mt-1 text-sm leading-5 text-muted-foreground",
									children: b
								})]
							})]
						}), S && /* @__PURE__ */ l("button", {
							type: "button",
							"data-modal-close": !0,
							"aria-label": C,
							onClick: P,
							className: t,
							children: /* @__PURE__ */ l("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ l("path", { d: "M18 6 6 18M6 6l12 12" })
							})
						})]
					}),
					!y && S && /* @__PURE__ */ l("button", {
						type: "button",
						"data-modal-close": !0,
						"aria-label": C,
						onClick: P,
						className: e("absolute right-4 top-4 z-10", t),
						children: /* @__PURE__ */ l("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ l("path", { d: "M18 6 6 18M6 6l12 12" })
						})
					}),
					/* @__PURE__ */ l("div", {
						"data-modal-content": !0,
						className: e("px-5 py-4 sm:px-6 flex-1", w ? "overflow-y-auto overscroll-contain" : "overflow-y-auto"),
						children: m
					})
				]
			})]
		})
	});
}
function p({ className: t, children: n, ...r }) {
	return /* @__PURE__ */ l("div", {
		className: e("px-5 pt-4 pb-3 sm:px-6 border-b border-border shrink-0", t),
		...r,
		children: n
	});
}
function m({ as: t = "h2", className: n, children: r, ...i }) {
	return /* @__PURE__ */ l(t, {
		className: e("text-base font-semibold leading-6 text-foreground", n),
		...i,
		children: r
	});
}
function h({ className: t, children: n, ...r }) {
	return /* @__PURE__ */ l("p", {
		className: e("mt-1 text-sm leading-5 text-muted-foreground", t),
		...r,
		children: n
	});
}
function g({ className: t, scrollable: n = !1, children: r, ...i }) {
	return /* @__PURE__ */ l("div", {
		"data-modal-content": !0,
		className: e("px-5 py-4 sm:px-6", n && "overflow-y-auto flex-1 overscroll-contain", t),
		...i,
		children: r
	});
}
function _({ className: t, children: n, ...r }) {
	return /* @__PURE__ */ l("div", {
		className: e("flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 pb-4 pt-3 sm:px-6 max-sm:flex-col-reverse max-sm:items-stretch", t),
		...r,
		children: n
	});
}
//#endregion
export { f as Modal, g as ModalBody, h as ModalDescription, _ as ModalFooter, p as ModalHeader, m as ModalTitle };

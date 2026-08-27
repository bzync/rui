"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { c as t, o as n, t as r } from "../component-styles-Ce56hn9T.js";
import { AnimatePresence as i, motion as a } from "framer-motion";
import { useEffect as o, useId as s, useRef as c, useState as l } from "react";
import { jsx as u, jsxs as d } from "react/jsx-runtime";
//#region src/components/datepicker.tsx
var f = [
	"Su",
	"Mo",
	"Tu",
	"We",
	"Th",
	"Fr",
	"Sa"
], p = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function m(e) {
	return `${p[e.getMonth()].slice(0, 3)} ${e.getDate()}, ${e.getFullYear()}`;
}
function h(e, t) {
	return new Date(e, t + 1, 0).getDate();
}
function g(e, t) {
	return new Date(e, t, 1).getDay();
}
function _(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function v({ value: v, onChange: y, label: b, hint: x, error: S, placeholder: C = "Select date…", disabled: w, clearable: T = !0, minDate: E, maxDate: D, className: O }) {
	let [k, A] = l(null), j = v === void 0 ? k : v, M = /* @__PURE__ */ new Date(), [N, P] = l(!1), [F, I] = l((j ?? M).getFullYear()), [L, R] = l((j ?? M).getMonth()), z = c(null), B = s(), V = `${B}-message`;
	function H(e) {
		v === void 0 && A(e), y?.(e), P(!1);
	}
	function U(e) {
		e.stopPropagation(), v === void 0 && A(null), y?.(null);
	}
	function W() {
		L === 0 ? (R(11), I((e) => e - 1)) : R((e) => e - 1);
	}
	function G() {
		L === 11 ? (R(0), I((e) => e + 1)) : R((e) => e + 1);
	}
	o(() => {
		function e(e) {
			z.current?.contains(e.target) || P(!1);
		}
		function t(e) {
			e.key === "Escape" && P(!1);
		}
		return document.addEventListener("mousedown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("mousedown", e), document.removeEventListener("keydown", t);
		};
	}, []);
	let K = h(F, L), q = g(F, L), J = [...Array(q).fill(null), ...Array.from({ length: K }, (e, t) => t + 1)];
	return /* @__PURE__ */ d("div", {
		ref: z,
		className: e("relative", n, O),
		children: [
			b && /* @__PURE__ */ u("label", {
				htmlFor: B,
				className: "text-sm font-medium leading-5 text-foreground",
				children: b
			}),
			/* @__PURE__ */ d("button", {
				type: "button",
				id: B,
				"aria-expanded": N,
				"aria-haspopup": "dialog",
				"aria-invalid": S ? !0 : void 0,
				"aria-describedby": S || x ? V : void 0,
				disabled: w,
				onClick: () => P((e) => !e),
				className: e("flex h-9 w-full items-center gap-2 rounded-[var(--radius-md)] px-3 text-left outline-none", r, "focus:border-accent-500 focus:ring-2 focus:ring-focus-ring/20", S && "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/20", w && "opacity-50 cursor-not-allowed"),
				children: [
					/* @__PURE__ */ d("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						className: "text-slate-500 shrink-0",
						children: [
							/* @__PURE__ */ u("rect", {
								width: "18",
								height: "18",
								x: "3",
								y: "4",
								rx: "2",
								ry: "2"
							}),
							/* @__PURE__ */ u("line", {
								x1: "16",
								x2: "16",
								y1: "2",
								y2: "6"
							}),
							/* @__PURE__ */ u("line", {
								x1: "8",
								x2: "8",
								y1: "2",
								y2: "6"
							}),
							/* @__PURE__ */ u("line", {
								x1: "3",
								x2: "21",
								y1: "10",
								y2: "10"
							})
						]
					}),
					/* @__PURE__ */ u("span", {
						className: e("flex-1 text-sm truncate", j ? "text-foreground" : "text-muted-foreground"),
						children: j ? m(j) : C
					}),
					T && j && !w && /* @__PURE__ */ u("span", {
						role: "button",
						tabIndex: -1,
						onClick: U,
						className: "shrink-0 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors",
						children: /* @__PURE__ */ u("svg", {
							width: "10",
							height: "10",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "3",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ u("path", { d: "M18 6 6 18M6 6l12 12" })
						})
					})
				]
			}),
			/* @__PURE__ */ u(i, { children: N && /* @__PURE__ */ d(a.div, {
				initial: {
					opacity: 0,
					y: -4,
					scaleY: .97
				},
				animate: {
					opacity: 1,
					y: 0,
					scaleY: 1
				},
				exit: {
					opacity: 0,
					y: -4,
					scaleY: .97
				},
				transition: { duration: .13 },
				style: { originY: 0 },
				role: "dialog",
				"aria-label": "Choose date",
				className: "absolute left-0 top-full z-50 mt-1.5 w-[min(18rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] border border-border bg-surface-raised p-3 shadow-floating",
				children: [
					/* @__PURE__ */ d("div", {
						className: "flex items-center justify-between mb-3",
						children: [
							/* @__PURE__ */ u("button", {
								type: "button",
								onClick: W,
								"aria-label": "Previous month",
								className: e(t, "size-7"),
								children: /* @__PURE__ */ u("svg", {
									width: "14",
									height: "14",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ u("path", { d: "m15 18-6-6 6-6" })
								})
							}),
							/* @__PURE__ */ d("span", {
								"aria-live": "polite",
								className: "text-sm font-semibold text-foreground",
								children: [
									p[L],
									" ",
									F
								]
							}),
							/* @__PURE__ */ u("button", {
								type: "button",
								onClick: G,
								"aria-label": "Next month",
								className: e(t, "size-7"),
								children: /* @__PURE__ */ u("svg", {
									width: "14",
									height: "14",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ u("path", { d: "m9 18 6-6-6-6" })
								})
							})
						]
					}),
					/* @__PURE__ */ u("div", {
						className: "grid grid-cols-7 gap-0.5 mb-1",
						children: f.map((e) => /* @__PURE__ */ u("div", {
							"aria-hidden": "true",
							className: "text-center text-[10px] font-semibold text-muted-foreground py-1",
							children: e
						}, e))
					}),
					/* @__PURE__ */ u("div", {
						className: "grid grid-cols-7 gap-0.5",
						children: J.map((t, n) => {
							if (!t) return /* @__PURE__ */ u("div", {}, `empty-${n}`);
							let r = new Date(F, L, t), i = j ? _(r, j) : !1, a = _(r, M), o = E && r < E || D && r > D;
							return /* @__PURE__ */ u("button", {
								type: "button",
								disabled: !!o,
								onClick: () => H(r),
								"aria-label": r.toLocaleDateString(void 0, {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric"
								}),
								"aria-pressed": i,
								"aria-current": a ? "date" : void 0,
								className: e("h-8 w-full rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35", i ? "bg-primary text-primary-foreground font-medium" : a ? "border border-accent-500/40 text-accent-400 hover:bg-accent-500/10" : "text-slate-700 dark:text-slate-200 hover:bg-black/6 dark:hover:bg-white/6", o && "opacity-30 cursor-not-allowed"),
								children: t
							}, t);
						})
					})
				]
			}) }),
			S && /* @__PURE__ */ u("p", {
				id: V,
				"aria-live": "polite",
				className: "text-xs leading-5 text-destructive",
				children: S
			}),
			x && !S && /* @__PURE__ */ u("p", {
				id: V,
				className: "text-xs leading-5 text-muted-foreground",
				children: x
			})
		]
	});
}
//#endregion
export { v as DatePicker };

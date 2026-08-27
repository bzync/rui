import { t as e } from "./cn-DpgY2leY.js";
import { c as t, s as n } from "./component-styles-Ce56hn9T.js";
import { AnimatePresence as r, motion as i } from "framer-motion";
import { useEffect as a, useState as o } from "react";
import { Fragment as s, jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/components/calendar/types.ts
var u = [
	"Su",
	"Mo",
	"Tu",
	"We",
	"Th",
	"Fr",
	"Sa"
], d = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
], f = [
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
], p = {
	blue: "bg-blue-500/12 text-blue-400 border-blue-500/20",
	green: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
	red: "bg-red-500/12 text-red-400 border-red-500/20",
	yellow: "bg-amber-500/12 text-amber-400 border-amber-500/20",
	purple: "bg-violet-500/12 text-violet-400 border-violet-500/20",
	orange: "bg-orange-500/12 text-orange-400 border-orange-500/20"
};
function m(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function h(e, t) {
	let n = new Date(e);
	return n.setDate(n.getDate() + t), n;
}
function g(e) {
	let t = new Date(e);
	return t.setDate(t.getDate() - t.getDay()), t;
}
var _ = {
	enter: (e) => ({
		opacity: 0,
		x: e * 16
	}),
	center: {
		opacity: 1,
		x: 0
	},
	exit: (e) => ({
		opacity: 0,
		x: e * -16
	})
};
//#endregion
//#region src/components/calendar/month-view.tsx
function v({ viewDate: t, today: n, value: r, events: i, onSelect: a, onEventClick: o, isDateDisabled: d, onEventCreate: f, onEventDelete: h, editingId: g, onEditToggle: _, onUpdateTitle: v }) {
	let y = t.getFullYear(), b = t.getMonth(), x = new Date(y, b + 1, 0).getDate(), S = new Date(y, b, 1).getDay(), C = [...Array(S).fill(null), ...Array.from({ length: x }, (e, t) => new Date(y, b, t + 1))];
	for (; C.length % 7 != 0;) C.push(null);
	function w(e) {
		return i.filter((t) => m(t.date, e));
	}
	return /* @__PURE__ */ l(s, { children: [/* @__PURE__ */ c("div", {
		role: "row",
		className: "grid grid-cols-7 border-b border-border",
		children: u.map((e) => /* @__PURE__ */ c("div", {
			role: "columnheader",
			className: "py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
			children: e
		}, e))
	}), /* @__PURE__ */ c("div", {
		role: "grid",
		className: "grid grid-cols-7",
		style: { gridTemplateRows: `repeat(${C.length / 7}, minmax(80px, 1fr))` },
		children: C.map((t, i) => {
			let s = i % 7 == 6, u = i >= C.length - 7;
			if (!t) return /* @__PURE__ */ c("div", {
				role: "gridcell",
				className: e("border-black/6 dark:border-white/6 bg-black/[0.015] dark:bg-white/[0.015]", !s && "border-r", !u && "border-b")
			}, `e${i}`);
			let _ = w(t), v = n ? m(t, n) : !1, y = r ? m(t, r) : !1, x = t.getMonth() === b, S = d?.(t) ?? !1;
			return /* @__PURE__ */ l("div", {
				role: "gridcell",
				tabIndex: S ? void 0 : 0,
				"aria-label": t.toLocaleDateString(void 0, { dateStyle: "full" }),
				"aria-disabled": S || void 0,
				"aria-selected": y,
				onClick: () => !S && a(t),
				onKeyDown: (e) => {
					!S && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), a(t));
				},
				className: e("p-1.5 transition-colors group/cell", "border-border focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring/35", !s && "border-r", !u && "border-b", !x && "bg-black/[0.015] dark:bg-white/[0.015]", S ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-surface-muted"),
				children: [/* @__PURE__ */ l("div", {
					className: "flex items-center justify-between mb-1",
					children: [/* @__PURE__ */ c("span", {
						className: e("w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium", y ? "bg-primary text-primary-foreground" : v ? "border border-accent-500/50 text-accent-600 dark:text-accent-300" : x ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-600"),
						children: t.getDate()
					}), f && !S && /* @__PURE__ */ c("button", {
						type: "button",
						"aria-label": `Add event on ${t.toLocaleDateString()}`,
						onClick: (e) => {
							e.stopPropagation(), f(t);
						},
						className: "opacity-0 group-hover/cell:opacity-100 focus:opacity-100 w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px] hover:bg-primary-hover transition-opacity",
						children: "+"
					})]
				}), /* @__PURE__ */ l("div", {
					className: "space-y-0.5",
					children: [_.slice(0, 2).map((t) => {
						let n = g === t.id;
						return /* @__PURE__ */ l("div", {
							className: e("group/ev flex items-center gap-0.5 rounded border px-1 py-0.5", p[t.color ?? "blue"], n && "ring-1 ring-focus-ring"),
							children: [/* @__PURE__ */ l("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation(), o?.(t);
								},
								className: "min-w-0 flex-1 truncate text-left text-[10px] font-medium",
								children: [t.time && /* @__PURE__ */ c("span", {
									className: "opacity-60 mr-1",
									children: t.time
								}), t.title]
							}), h && /* @__PURE__ */ c("button", {
								type: "button",
								"aria-label": `Delete ${t.title}`,
								onClick: (e) => {
									e.stopPropagation(), h(t.id);
								},
								className: "flex size-4 shrink-0 items-center justify-center rounded text-[10px] leading-none opacity-60 hover:bg-muted hover:opacity-100",
								children: "×"
							})]
						}, t.id);
					}), _.length > 2 && /* @__PURE__ */ l("p", {
						className: "text-[10px] text-slate-500 px-1",
						children: [
							"+",
							_.length - 2,
							" more"
						]
					})]
				})]
			}, t.toISOString());
		})
	})] });
}
//#endregion
//#region src/components/calendar/week-view.tsx
function y({ viewDate: t, today: n, value: r, events: i, onSelect: a, onEventClick: o, isDateDisabled: u, onEventCreate: f, onEventDelete: _, editingId: v, onEditToggle: y, onUpdateTitle: b }) {
	let x = g(t), S = Array.from({ length: 7 }, (e, t) => h(x, t));
	function C(e) {
		return i.filter((t) => m(t.date, e));
	}
	return /* @__PURE__ */ l(s, { children: [/* @__PURE__ */ c("div", {
		role: "row",
		className: "grid grid-cols-7 border-b border-border",
		children: S.map((t) => {
			let i = n ? m(t, n) : !1, o = r ? m(t, r) : !1, s = u?.(t) ?? !1;
			return /* @__PURE__ */ l("div", {
				role: "gridcell",
				tabIndex: s ? void 0 : 0,
				"aria-selected": o,
				"aria-disabled": s || void 0,
				"aria-label": t.toLocaleDateString(void 0, { dateStyle: "full" }),
				onClick: () => !s && a(t),
				onKeyDown: (e) => {
					!s && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), a(t));
				},
				className: e("group/whead flex flex-col items-center gap-1 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring/35", s ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-surface-muted"),
				children: [
					/* @__PURE__ */ c("span", {
						className: "text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide",
						children: d[t.getDay()]
					}),
					/* @__PURE__ */ c("span", {
						className: e("w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors", o ? "bg-primary text-primary-foreground" : i ? "border border-accent-500/50 text-accent-600 dark:text-accent-300" : "text-slate-700 dark:text-slate-200"),
						children: t.getDate()
					}),
					f && !s && /* @__PURE__ */ c("button", {
						type: "button",
						"aria-label": `Add event on ${t.toLocaleDateString()}`,
						onClick: (e) => {
							e.stopPropagation(), f(t);
						},
						className: "opacity-0 group-hover/whead:opacity-100 focus:opacity-100 h-5 px-1.5 rounded-md bg-primary text-primary-foreground text-[10px] hover:bg-primary-hover",
						children: "+ Add"
					})
				]
			}, t.toISOString());
		})
	}), /* @__PURE__ */ c("div", {
		className: "grid grid-cols-7 min-h-[200px]",
		children: S.map((t, n) => {
			let r = C(t), i = n === 6, s = u?.(t) ?? !1;
			return /* @__PURE__ */ c("div", {
				role: "gridcell",
				tabIndex: s ? void 0 : 0,
				"aria-disabled": s || void 0,
				"aria-label": `${t.toLocaleDateString(void 0, { dateStyle: "full" })} events`,
				onClick: () => !s && a(t),
				onKeyDown: (e) => {
					!s && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), a(t));
				},
				className: e("space-y-1.5 p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring/35", !i && "border-r border-border", s ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-surface-muted/70"),
				children: r.map((t) => /* @__PURE__ */ l("div", {
					className: e("group/wev flex items-start gap-1 rounded-[var(--radius-md)] border px-2 py-1.5", p[t.color ?? "blue"], v === t.id && "ring-1 ring-focus-ring"),
					children: [/* @__PURE__ */ l("button", {
						type: "button",
						onClick: (e) => {
							e.stopPropagation(), o?.(t);
						},
						className: "min-w-0 flex-1 text-left",
						children: [t.time && /* @__PURE__ */ c("div", {
							className: "text-[10px] opacity-60 mb-0.5",
							children: t.time
						}), /* @__PURE__ */ c("div", {
							className: "text-xs font-medium truncate",
							children: t.title
						})]
					}), _ && /* @__PURE__ */ c("button", {
						type: "button",
						"aria-label": `Delete ${t.title}`,
						onClick: (e) => {
							e.stopPropagation(), _(t.id);
						},
						className: "flex size-5 shrink-0 items-center justify-center rounded text-xs opacity-60 hover:bg-muted hover:opacity-100",
						children: "×"
					})]
				}, t.id))
			}, t.toISOString());
		})
	})] });
}
//#endregion
//#region src/components/calendar.tsx
function b({ value: s, defaultValue: u = null, onChange: d, events: p, defaultEvents: m = [], onEventsChange: b, onEventClick: x, onEventCreate: S, onEventUpdate: C, onEventDelete: w, editable: T = !1, view: E, defaultView: ee = "month", onViewChange: te, viewDate: D, defaultViewDate: O, onViewDateChange: ne, minDate: k, maxDate: A, disabledDates: j, className: re }) {
	let [ie, ae] = o(null), [oe, se] = o(u), [ce, le] = o(ee), [ue, M] = o(O ?? null), [de, fe] = o(() => p ?? m), [pe, N] = o(1), [P, F] = o(null), [I, L] = o(""), [R, me] = o("blue"), [z, B] = o("09:00"), [V, H] = o(null);
	a(() => {
		let e = /* @__PURE__ */ new Date();
		ae(e), O === void 0 && D === void 0 && M(new Date(e.getFullYear(), e.getMonth(), 1));
	}, []), a(() => {
		D === void 0 && O !== void 0 && ue === null && M(O ? new Date(O) : null);
	}, [O]);
	let he = s === void 0 ? oe : s, U = E === void 0 ? ce : E, W = D === void 0 ? ue : D, G = p !== void 0, K = G ? p : de;
	function q(e) {
		return !!(k && e < new Date(k.getFullYear(), k.getMonth(), k.getDate()) || A && e > new Date(A.getFullYear(), A.getMonth(), A.getDate(), 23, 59, 59, 999) || j?.(e));
	}
	function ge(e) {
		E === void 0 && le(e), te?.(e);
	}
	function J(e) {
		e !== null && (D === void 0 && M(e), ne?.(e));
	}
	function _e(e) {
		q(e) || (s === void 0 && se(e), d?.(e));
	}
	function ve(e) {
		return e && (U === "month" ? new Date(e.getFullYear(), e.getMonth() - 1, 1) : h(e, -7));
	}
	function ye(e) {
		return e && (U === "month" ? new Date(e.getFullYear(), e.getMonth() + 1, 1) : h(e, 7));
	}
	function be() {
		N(-1), J(ve(W));
	}
	function xe() {
		N(1), J(ye(W));
	}
	function Se() {
		let e = /* @__PURE__ */ new Date();
		N(0), J(new Date(e.getFullYear(), e.getMonth(), 1)), _e(e);
	}
	function Y(e) {
		G || fe(e), b?.(e);
	}
	function Ce(e, t) {
		if (q(e)) return;
		let n = {
			id: typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()),
			title: t?.trim() || I.trim() || "New event",
			date: new Date(e),
			color: R,
			time: z || void 0
		};
		Y([...K, n]), S?.(n), F(null), L(""), B("09:00");
	}
	function X(e) {
		Y(K.filter((t) => t.id !== e)), w?.(e), V === e && H(null);
	}
	function Z(e) {
		Y(K.map((t) => t.id === e.id ? e : t)), C?.(e), H(null);
	}
	function we(e) {
		T && H((t) => t === e.id ? null : e.id), x?.(e);
	}
	let Q = "";
	if (W) {
		if (U === "month") Q = `${f[W.getMonth()]} ${W.getFullYear()}`;
		else {
			let e = g(W), t = h(e, 6);
			Q = e.getMonth() === t.getMonth() ? `${f[e.getMonth()].slice(0, 3)} ${e.getDate()} \u2013 ${t.getDate()}, ${e.getFullYear()}` : `${f[e.getMonth()].slice(0, 3)} ${e.getDate()} \u2013 ${f[t.getMonth()].slice(0, 3)} ${t.getDate()}, ${e.getFullYear()}`;
		}
	}
	let Te = T || !!S || !!C || !!w || !!b, Ee = {
		today: ie,
		value: he,
		events: K,
		onSelect: _e,
		onEventClick: we,
		onEventCreate: Te ? (e) => F(e) : void 0,
		onEventDelete: Te || w ? X : void 0,
		onEventUpdate: C,
		editingId: V,
		onEditToggle: (e) => H((t) => t === e ? null : e),
		onUpdateTitle: (e, t) => {
			let n = K.find((t) => t.id === e);
			n && Z({
				...n,
				title: t
			});
		},
		minDate: k,
		maxDate: A,
		disabledDates: j,
		isDateDisabled: q
	}, $ = W ? `${U}-${W.toISOString()}` : null;
	return /* @__PURE__ */ l("div", {
		className: e("flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface", re),
		children: [
			/* @__PURE__ */ l("div", {
				className: "flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-3 sm:px-4",
				children: [
					/* @__PURE__ */ l("div", {
						className: "flex items-center gap-0.5",
						children: [/* @__PURE__ */ c("button", {
							type: "button",
							onClick: be,
							"aria-label": `Previous ${U}`,
							className: e(t, "size-8"),
							children: /* @__PURE__ */ c("svg", {
								width: "13",
								height: "13",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.5",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ c("path", { d: "m15 18-6-6 6-6" })
							})
						}), /* @__PURE__ */ c("button", {
							type: "button",
							onClick: xe,
							"aria-label": `Next ${U}`,
							className: e(t, "size-8"),
							children: /* @__PURE__ */ c("svg", {
								width: "13",
								height: "13",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.5",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ c("path", { d: "m9 18 6-6-6-6" })
							})
						})]
					}),
					/* @__PURE__ */ c("span", {
						"aria-live": "polite",
						className: "min-w-[9rem] flex-1 select-none text-sm font-semibold text-foreground",
						children: Q
					}),
					/* @__PURE__ */ c("button", {
						type: "button",
						onClick: Se,
						className: e("h-8 rounded-[var(--radius-md)] border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-border-strong hover:bg-muted hover:text-foreground", n),
						children: "Today"
					}),
					/* @__PURE__ */ c("div", {
						role: "group",
						"aria-label": "Calendar view",
						className: "flex overflow-hidden rounded-[var(--radius-md)] border border-border",
						children: ["month", "week"].map((t) => /* @__PURE__ */ c("button", {
							type: "button",
							onClick: () => ge(t),
							"aria-pressed": U === t,
							className: e("h-8 px-3 text-xs capitalize transition-colors focus-visible:z-10", n, U === t ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"),
							children: t
						}, t))
					})
				]
			}),
			P && /* @__PURE__ */ l("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border bg-warning/8 px-3 py-3 sm:px-4",
				children: [
					/* @__PURE__ */ l("span", {
						className: "text-xs font-medium text-foreground",
						children: [
							"New event on ",
							P.toLocaleDateString(),
							":"
						]
					}),
					/* @__PURE__ */ c("input", {
						autoFocus: !0,
						value: I,
						onChange: (e) => L(e.target.value),
						onKeyDown: (e) => {
							e.key === "Enter" && Ce(P), e.key === "Escape" && (F(null), L(""), B("09:00"));
						},
						placeholder: "Event title",
						className: "h-7 flex-1 min-w-[140px] rounded-md border border-border bg-surface px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring/25"
					}),
					/* @__PURE__ */ c("input", {
						type: "time",
						value: z,
						onChange: (e) => B(e.target.value),
						className: "h-7 w-[110px] rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring/25"
					}),
					/* @__PURE__ */ l("select", {
						"aria-label": "Event color",
						value: R,
						onChange: (e) => me(e.target.value),
						className: "h-7 rounded-[var(--radius-md)] border border-border bg-surface px-2 text-xs text-foreground",
						children: [
							/* @__PURE__ */ c("option", {
								value: "blue",
								children: "Blue"
							}),
							/* @__PURE__ */ c("option", {
								value: "green",
								children: "Green"
							}),
							/* @__PURE__ */ c("option", {
								value: "red",
								children: "Red"
							}),
							/* @__PURE__ */ c("option", {
								value: "yellow",
								children: "Yellow"
							}),
							/* @__PURE__ */ c("option", {
								value: "purple",
								children: "Purple"
							}),
							/* @__PURE__ */ c("option", {
								value: "orange",
								children: "Orange"
							})
						]
					}),
					/* @__PURE__ */ c("button", {
						type: "button",
						onClick: () => Ce(P),
						className: "h-7 px-3 rounded-md bg-primary text-xs font-medium text-primary-foreground hover:bg-primary-hover",
						children: "Add"
					}),
					/* @__PURE__ */ c("button", {
						type: "button",
						onClick: () => {
							F(null), L(""), B("09:00");
						},
						className: "h-7 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground",
						children: "Cancel"
					})
				]
			}),
			V && (() => {
				let e = K.find((e) => e.id === V);
				return e ? /* @__PURE__ */ l("div", {
					className: "flex flex-wrap items-center gap-2 border-b border-border bg-surface-muted px-3 py-3 sm:px-4",
					children: [
						/* @__PURE__ */ c("span", {
							className: "text-xs font-medium text-foreground",
							children: "Edit event:"
						}),
						/* @__PURE__ */ c("input", {
							autoFocus: !0,
							defaultValue: e.title,
							onKeyDown: (t) => {
								if (t.key === "Enter") {
									let n = t.target.value, r = document.getElementById(`cal-edit-time-${e.id}`)?.value ?? e.time ?? "";
									n.trim() && Z({
										...e,
										title: n.trim(),
										time: r || void 0
									});
								}
								t.key === "Escape" && H(null);
							},
							id: `cal-edit-${e.id}`,
							placeholder: "Title",
							className: "h-7 flex-1 min-w-[140px] rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring/25"
						}),
						/* @__PURE__ */ c("input", {
							type: "time",
							defaultValue: e.time ?? "",
							id: `cal-edit-time-${e.id}`,
							className: "h-7 w-[110px] rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring/25"
						}),
						/* @__PURE__ */ c("button", {
							type: "button",
							onClick: () => {
								let t = document.getElementById(`cal-edit-${e.id}`), n = document.getElementById(`cal-edit-time-${e.id}`), r = t?.value ?? e.title, i = n?.value ?? "";
								r.trim() && Z({
									...e,
									title: r.trim(),
									time: i || void 0
								});
							},
							className: "h-7 px-3 rounded-md bg-primary text-xs font-medium text-primary-foreground hover:bg-primary-hover",
							children: "Save"
						}),
						/* @__PURE__ */ c("button", {
							type: "button",
							onClick: () => X(e.id),
							className: "h-7 rounded-[var(--radius-md)] bg-destructive px-2.5 text-xs font-medium text-destructive-foreground hover:bg-destructive-hover",
							children: "Delete"
						}),
						/* @__PURE__ */ c("button", {
							type: "button",
							onClick: () => H(null),
							className: "h-7 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground",
							children: "Cancel"
						})
					]
				}) : null;
			})(),
			/* @__PURE__ */ c("div", {
				className: "relative flex-1 overflow-x-auto",
				children: /* @__PURE__ */ c("div", {
					className: "min-w-[42rem]",
					children: /* @__PURE__ */ c(r, {
						mode: "popLayout",
						initial: !1,
						custom: pe,
						children: $ !== null && W !== null && /* @__PURE__ */ c(i.div, {
							custom: pe,
							variants: _,
							initial: "enter",
							animate: "center",
							exit: "exit",
							transition: {
								duration: .18,
								ease: "easeInOut"
							},
							children: c(U === "month" ? v : y, {
								viewDate: W,
								...Ee
							})
						}, $)
					})
				})
			})
		]
	});
}
//#endregion
export { b as t };

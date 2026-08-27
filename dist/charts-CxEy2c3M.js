import { t as e } from "./cn-DpgY2leY.js";
import { motion as t } from "framer-motion";
import { useEffect as n, useId as r, useState as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
import { createPortal as s } from "react-dom";
//#region src/components/charts/shared.tsx
function c(e, t) {
	let n = e <= t ? 1 : Math.ceil(e / t);
	return (t) => t % n === 0 || t === e - 1;
}
function l({ tooltip: e }) {
	return !e || typeof document > "u" ? null : s(/* @__PURE__ */ a("div", {
		className: "pointer-events-none fixed z-[9999] px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-navy-700 shadow-xl shadow-black/30 text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap",
		style: {
			left: e.x + 14,
			top: e.y - 10
		},
		children: e.content
	}), document.body);
}
//#endregion
//#region src/components/charts/bar-chart.tsx
function u({ data: t, height: s = 220, color: c = "var(--color-accent-500)", showValues: u = !1, gridLines: f = 4, orientation: p = "vertical", className: m, formatValue: h = String }) {
	let [g, _] = i(null), [v, y] = i(null), [b, x] = i(!1), S = r().replace(/:/g, ""), C = Math.max(...t.map((e) => e.value), 1);
	if (n(() => {
		let e = requestAnimationFrame(() => x(!0));
		return () => cancelAnimationFrame(e);
	}, []), p === "horizontal") return /* @__PURE__ */ a(d, {
		data: t,
		height: s,
		color: c,
		showValues: u,
		gridLines: f,
		className: m,
		formatValue: h
	});
	let w = 100 / t.length, T = w * .18, E = w - T * 2, D = (e) => e / 100 * s;
	return /* @__PURE__ */ o("div", {
		className: e("relative w-full select-none", m),
		style: { height: s },
		children: [
			/* @__PURE__ */ o("svg", {
				viewBox: "0 0 100 100",
				preserveAspectRatio: "none",
				className: "absolute inset-0 w-full h-full text-black dark:text-white",
				children: [
					/* @__PURE__ */ a("defs", { children: t.map((e, t) => {
						let n = e.color ?? c;
						return /* @__PURE__ */ o("linearGradient", {
							id: `${S}-bcg-${t}`,
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ a("stop", {
								offset: "0%",
								stopColor: n,
								stopOpacity: "1"
							}), /* @__PURE__ */ a("stop", {
								offset: "100%",
								stopColor: n,
								stopOpacity: "0.45"
							})]
						}, t);
					}) }),
					Array.from({ length: f + 1 }).map((e, t) => {
						let n = 6 + t / f * 82;
						return /* @__PURE__ */ a("line", {
							x1: "0",
							y1: n,
							x2: "100",
							y2: n,
							stroke: "currentColor",
							strokeOpacity: "0.07",
							strokeWidth: "0.35"
						}, t);
					}),
					t.map((e, t) => {
						let n = Math.max(e.value / C * 82, e.value > 0 ? .5 : 0), r = t * w + T, i = 88 - n, s = .45, c = t * .05;
						return /* @__PURE__ */ a("rect", {
							x: r,
							width: E,
							rx: "1.2",
							y: b ? i : 88,
							height: b ? n : 0,
							onMouseEnter: () => y(t),
							onMouseMove: (t) => _({
								x: t.clientX,
								y: t.clientY,
								content: /* @__PURE__ */ o("span", { children: [/* @__PURE__ */ a("span", {
									className: "text-slate-500 dark:text-slate-400 mr-2",
									children: e.label
								}), /* @__PURE__ */ a("span", {
									className: "font-semibold text-gray-900 dark:text-white",
									children: h(e.value)
								})] })
							}),
							onMouseLeave: () => {
								y(null), _(null);
							},
							className: "cursor-pointer",
							style: {
								fill: `url(#${S}-bcg-${t})`,
								fillOpacity: v !== null && v !== t ? .35 : 1,
								transition: b ? `y ${s}s ${c}s cubic-bezier(0.25,0.46,0.45,0.94), height ${s}s ${c}s cubic-bezier(0.25,0.46,0.45,0.94), fill-opacity 0.12s` : "none"
							}
						}, t);
					}),
					/* @__PURE__ */ a("line", {
						x1: "0",
						y1: 88,
						x2: "100",
						y2: 88,
						stroke: "currentColor",
						strokeOpacity: "0.1",
						strokeWidth: "0.35"
					})
				]
			}),
			/* @__PURE__ */ a("div", {
				className: "absolute bottom-0 left-0 right-0 flex",
				style: { height: 20 },
				children: t.map((e, t) => /* @__PURE__ */ a("div", {
					className: "flex-1 text-center text-xs text-slate-500 truncate px-1 leading-5",
					children: e.label
				}, t))
			}),
			u && /* @__PURE__ */ a("div", {
				className: "absolute inset-x-0 top-0 pointer-events-none",
				style: { bottom: 20 },
				children: t.map((e, n) => {
					let r = e.value / C, i = D(6 + (1 - r) * 82);
					return /* @__PURE__ */ a("div", {
						className: "absolute flex justify-center",
						style: {
							left: `${n / t.length * 100}%`,
							width: `${100 / t.length}%`,
							top: i,
							transform: "translateY(calc(-100% - 4px))"
						},
						children: /* @__PURE__ */ a("span", {
							className: "text-xs font-semibold text-slate-500 dark:text-slate-400 leading-none tabular-nums",
							children: h(e.value)
						})
					}, n);
				})
			}),
			/* @__PURE__ */ a(l, { tooltip: g })
		]
	});
}
function d({ data: t, color: r, showValues: s, className: c, formatValue: u = String }) {
	let [d, f] = i(null), [p, m] = i(null), [h, g] = i(!1), _ = Math.max(...t.map((e) => e.value), 1);
	return n(() => {
		let e = requestAnimationFrame(() => g(!0));
		return () => cancelAnimationFrame(e);
	}, []), /* @__PURE__ */ o("div", {
		className: e("w-full select-none flex flex-col gap-2.5", c),
		children: [t.map((e, t) => {
			let n = e.value / _ * 100, i = e.color ?? r ?? "var(--color-accent-500)", c = p === t;
			return /* @__PURE__ */ o("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ a("span", {
					className: "text-xs text-slate-600 dark:text-slate-300 text-right shrink-0 leading-none",
					style: { width: 64 },
					children: e.label
				}), /* @__PURE__ */ o("div", {
					className: "flex-1 h-8 relative rounded-md bg-black/5 dark:bg-white/5 overflow-hidden",
					children: [/* @__PURE__ */ a("div", {
						className: "absolute left-0 top-0 bottom-0 rounded-md cursor-pointer",
						style: {
							width: h ? `${n}%` : 0,
							background: `linear-gradient(90deg, ${i}70, ${i})`,
							opacity: p !== null && !c ? .35 : 1,
							outline: c ? `1.5px solid ${i}` : "none",
							outlineOffset: -1,
							transition: h ? `width 0.45s ${t * .05}s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.12s` : "none"
						},
						onMouseEnter: () => m(t),
						onMouseMove: (t) => f({
							x: t.clientX,
							y: t.clientY,
							content: /* @__PURE__ */ o("span", { children: [/* @__PURE__ */ a("span", {
								className: "text-slate-500 dark:text-slate-400 mr-2",
								children: e.label
							}), /* @__PURE__ */ a("span", {
								className: "font-semibold text-gray-900 dark:text-white",
								children: u(e.value)
							})] })
						}),
						onMouseLeave: () => {
							m(null), f(null);
						}
					}), s && /* @__PURE__ */ a("div", {
						className: "absolute top-0 bottom-0 flex items-center pointer-events-none",
						style: {
							left: `${n}%`,
							paddingLeft: 8
						},
						children: /* @__PURE__ */ a("span", {
							className: "text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap",
							children: u(e.value)
						})
					})]
				})]
			}, t);
		}), /* @__PURE__ */ a(l, { tooltip: d })]
	});
}
//#endregion
//#region src/components/charts/line-chart.tsx
function f({ data: n, height: s = 220, color: u = "var(--color-accent-500)", area: d = !0, dots: f = !0, gridLines: p = 4, className: m, formatValue: h = String, smooth: g = !0, showXLabels: _ = !0, maxLabels: v = 8 }) {
	let [y, b] = i(null), x = r().replace(/:/g, ""), S = Math.max(...n.map((e) => e.value), 1), C = Math.min(...n.map((e) => e.value), 0), w = S - C || 1, T = n.length, E = n.map((e, t) => ({
		x: T === 1 ? 50 : t / (T - 1) * 92 + 4,
		y: 90 - (e.value - C) / w * 80,
		d: e
	}));
	function D(e) {
		if (e.length === 0) return "";
		if (!g || e.length < 3) return e.map((e, t) => `${t === 0 ? "M" : "L"}${e.x},${e.y}`).join(" ");
		let t = `M${e[0].x},${e[0].y}`;
		for (let n = 0; n < e.length - 1; n++) {
			let r = e[n], i = e[n + 1], a = (r.x + i.x) / 2;
			t += ` C${a},${r.y} ${a},${i.y} ${i.x},${i.y}`;
		}
		return t;
	}
	let O = D(E), k = O ? `${O} L${E[E.length - 1].x},92 L${E[0].x},92 Z` : "", A = c(T, v);
	return /* @__PURE__ */ o("div", {
		className: e("relative w-full select-none", m),
		style: { height: s },
		children: [
			/* @__PURE__ */ o("svg", {
				viewBox: "0 0 100 100",
				preserveAspectRatio: "none",
				className: "absolute inset-0 w-full h-full overflow-visible text-black dark:text-white",
				children: [
					/* @__PURE__ */ a("defs", { children: /* @__PURE__ */ o("linearGradient", {
						id: `${x}-ag`,
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ a("stop", {
							offset: "0%",
							stopColor: u,
							stopOpacity: "0.25"
						}), /* @__PURE__ */ a("stop", {
							offset: "100%",
							stopColor: u,
							stopOpacity: "0.02"
						})]
					}) }),
					Array.from({ length: p + 1 }).map((e, t) => {
						let n = t / p * 84 + 4;
						return /* @__PURE__ */ a("line", {
							x1: "4",
							y1: n,
							x2: "96",
							y2: n,
							stroke: "currentColor",
							strokeOpacity: "0.07",
							strokeWidth: "0.3"
						}, t);
					}),
					d && k && /* @__PURE__ */ a("path", {
						d: k,
						fill: `url(#${x}-ag)`,
						style: { pointerEvents: "none" }
					}),
					O && /* @__PURE__ */ a(t.path, {
						d: O,
						fill: "none",
						strokeWidth: "1.2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						initial: {
							pathLength: 0,
							opacity: 0
						},
						animate: {
							pathLength: 1,
							opacity: 1
						},
						transition: {
							duration: .8,
							ease: "easeOut"
						},
						style: {
							stroke: u,
							pointerEvents: "none"
						}
					}),
					f && E.map((e, n) => /* @__PURE__ */ o("g", { children: [/* @__PURE__ */ a(t.circle, {
						cx: e.x,
						cy: e.y,
						r: "1.2",
						style: {
							fill: u,
							pointerEvents: "none"
						},
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: {
							delay: .6 + n * .03,
							duration: .2
						}
					}), /* @__PURE__ */ a("circle", {
						cx: e.x,
						cy: e.y,
						r: "5",
						fill: "transparent",
						className: "cursor-pointer",
						onMouseMove: (t) => b({
							x: t.clientX,
							y: t.clientY,
							content: /* @__PURE__ */ o("span", { children: [/* @__PURE__ */ a("span", {
								className: "text-slate-500 dark:text-slate-400 mr-2",
								children: e.d.label
							}), /* @__PURE__ */ a("span", {
								className: "font-semibold text-gray-900 dark:text-white",
								children: h(e.d.value)
							})] })
						}),
						onMouseLeave: () => b(null)
					})] }, n))
				]
			}),
			_ && /* @__PURE__ */ a("div", {
				className: "absolute bottom-0 left-0 right-0",
				style: { height: 20 },
				children: n.map((e, t) => e.label && A(t) ? /* @__PURE__ */ a("span", {
					className: "absolute text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap leading-5 select-none",
					style: {
						left: `${T === 1 ? 50 : t / (T - 1) * 92 + 4}%`,
						transform: "translateX(-50%)"
					},
					children: e.label
				}, t) : null)
			}),
			/* @__PURE__ */ a(l, { tooltip: y })
		]
	});
}
//#endregion
//#region src/components/charts/multi-line-chart.tsx
var p = [
	"var(--color-accent-500)",
	"#10b981",
	"#f59e0b",
	"#f43f5e",
	"#8b5cf6"
];
function m({ labels: n, series: s, height: u = 220, area: d = !0, dots: f = !0, gridLines: m = 4, className: h, formatValue: g = String, maxLabels: _ = 8 }) {
	let [v, y] = i(null), b = r().replace(/:/g, ""), x = s.flatMap((e) => e.data), S = Math.max(...x, 1), C = Math.min(...x, 0), w = S - C || 1, T = n.length, E = c(T, _);
	function D(e) {
		return e.map((e, t) => ({
			x: T === 1 ? 50 : t / (T - 1) * 92 + 4,
			y: 90 - (e - C) / w * 80
		}));
	}
	function O(e) {
		if (e.length < 2) return "";
		let t = `M${e[0].x},${e[0].y}`;
		for (let n = 0; n < e.length - 1; n++) {
			let r = e[n], i = e[n + 1], a = (r.x + i.x) / 2;
			t += ` C${a},${r.y} ${a},${i.y} ${i.x},${i.y}`;
		}
		return t;
	}
	return /* @__PURE__ */ o("div", {
		className: e("relative w-full select-none", h),
		style: { height: u },
		children: [
			/* @__PURE__ */ o("svg", {
				viewBox: "0 0 100 100",
				preserveAspectRatio: "none",
				className: "absolute inset-0 w-full h-full overflow-visible text-black dark:text-white",
				children: [
					/* @__PURE__ */ a("defs", { children: s.map((e, t) => {
						let n = e.color ?? p[t % p.length];
						return /* @__PURE__ */ o("linearGradient", {
							id: `${b}-mlg-${t}`,
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ a("stop", {
								offset: "0%",
								stopColor: n,
								stopOpacity: "0.2"
							}), /* @__PURE__ */ a("stop", {
								offset: "100%",
								stopColor: n,
								stopOpacity: "0.01"
							})]
						}, t);
					}) }),
					Array.from({ length: m + 1 }).map((e, t) => /* @__PURE__ */ a("line", {
						x1: "4",
						y1: t / m * 84 + 4,
						x2: "96",
						y2: t / m * 84 + 4,
						stroke: "currentColor",
						strokeOpacity: "0.07",
						strokeWidth: "0.3"
					}, t)),
					s.map((e, r) => {
						let i = e.color ?? p[r % p.length], s = D(e.data), c = O(s), l = c ? `${c} L${s[s.length - 1].x},92 L${s[0].x},92 Z` : "";
						return /* @__PURE__ */ o("g", { children: [
							d && l && /* @__PURE__ */ a("path", {
								d: l,
								fill: `url(#${b}-mlg-${r})`,
								style: { pointerEvents: "none" }
							}),
							c && /* @__PURE__ */ a(t.path, {
								d: c,
								fill: "none",
								strokeWidth: "1.2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								initial: {
									pathLength: 0,
									opacity: 0
								},
								animate: {
									pathLength: 1,
									opacity: 1
								},
								transition: {
									delay: r * .1,
									duration: .7,
									ease: "easeOut"
								},
								style: {
									stroke: i,
									pointerEvents: "none"
								}
							}),
							f && s.map((s, c) => /* @__PURE__ */ o("g", { children: [/* @__PURE__ */ a(t.circle, {
								cx: s.x,
								cy: s.y,
								r: "1.2",
								style: {
									fill: i,
									pointerEvents: "none"
								},
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								transition: { delay: .7 + r * .1 + c * .02 }
							}), /* @__PURE__ */ a("circle", {
								cx: s.x,
								cy: s.y,
								r: "5",
								fill: "transparent",
								className: "cursor-pointer",
								onMouseMove: (t) => y({
									x: t.clientX,
									y: t.clientY,
									content: /* @__PURE__ */ o("span", { children: [/* @__PURE__ */ o("span", {
										className: "text-slate-500 dark:text-slate-400 mr-2",
										children: [
											n[c],
											" · ",
											e.label
										]
									}), /* @__PURE__ */ a("span", {
										className: "font-semibold",
										style: { color: i },
										children: g(e.data[c])
									})] })
								}),
								onMouseLeave: () => y(null)
							})] }, c))
						] }, r);
					})
				]
			}),
			/* @__PURE__ */ a("div", {
				className: "absolute bottom-0 left-0 right-0",
				style: { height: 20 },
				children: n.map((e, t) => e && E(t) ? /* @__PURE__ */ a("span", {
					className: "absolute text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap leading-5 select-none",
					style: {
						left: `${T === 1 ? 50 : t / (T - 1) * 92 + 4}%`,
						transform: "translateX(-50%)"
					},
					children: e
				}, t) : null)
			}),
			/* @__PURE__ */ a(l, { tooltip: v })
		]
	});
}
//#endregion
//#region src/components/charts/donut-chart.tsx
var h = [
	"var(--color-accent-500)",
	"#10b981",
	"#f59e0b",
	"#f43f5e",
	"#8b5cf6",
	"#06b6d4"
];
function g({ data: n, size: r = 190, thickness: s = 28, centerLabel: c, className: u }) {
	let [d, f] = i(null), [p, m] = i(null), g = n.reduce((e, t) => e + t.value, 0) || 1, _ = 50 - s / 2, v = 2 * Math.PI * _, y = 0, b = n.map((e, t) => {
		let n = e.value / g, r = y;
		return y += n, {
			...e,
			frac: n,
			offset: r,
			color: e.color ?? h[t % h.length]
		};
	});
	return /* @__PURE__ */ o("div", {
		className: e("inline-flex flex-col items-center gap-5", u),
		children: [
			/* @__PURE__ */ o("div", {
				className: "relative",
				style: {
					width: r,
					height: r
				},
				children: [/* @__PURE__ */ o("svg", {
					viewBox: "0 0 100 100",
					className: "w-full h-full -rotate-90 text-black dark:text-white",
					children: [/* @__PURE__ */ a("circle", {
						cx: 50,
						cy: 50,
						r: _,
						fill: "none",
						stroke: "currentColor",
						strokeOpacity: "0.07",
						strokeWidth: s / 2
					}), b.map((e, n) => {
						let r = e.frac * v, i = v - r, c = e.offset * 360;
						return /* @__PURE__ */ a(t.circle, {
							cx: 50,
							cy: 50,
							r: _,
							fill: "none",
							stroke: e.color,
							strokeWidth: p === n ? s / 2 + 1.5 : s / 2,
							strokeDasharray: `${r} ${i}`,
							strokeDashoffset: 0,
							transform: `rotate(${c} 50 50)`,
							style: {
								strokeOpacity: p !== null && p !== n ? .35 : .9,
								transition: "stroke-opacity 0.15s, stroke-width 0.15s",
								pointerEvents: "all"
							},
							initial: { strokeDasharray: `0 ${v}` },
							animate: { strokeDasharray: `${r} ${i}` },
							transition: {
								delay: n * .08,
								duration: .5,
								ease: "easeOut"
							},
							onMouseMove: (t) => {
								m(n), f({
									x: t.clientX,
									y: t.clientY,
									content: /* @__PURE__ */ o("span", { children: [
										/* @__PURE__ */ a("span", {
											className: "text-slate-500 dark:text-slate-400 mr-2",
											children: e.label
										}),
										/* @__PURE__ */ a("span", {
											className: "font-semibold text-gray-900 dark:text-white",
											children: e.value
										}),
										/* @__PURE__ */ o("span", {
											className: "text-slate-500 ml-1.5",
											children: [
												"(",
												(e.frac * 100).toFixed(1),
												"%)"
											]
										})
									] })
								});
							},
							onMouseLeave: () => {
								m(null), f(null);
							},
							className: "cursor-pointer"
						}, n);
					})]
				}), c && /* @__PURE__ */ a("div", {
					className: "absolute inset-0 flex items-center justify-center pointer-events-none",
					children: c
				})]
			}),
			/* @__PURE__ */ a("div", {
				className: "flex flex-wrap justify-center gap-x-5 gap-y-2",
				children: b.map((e, t) => /* @__PURE__ */ o("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ a("span", {
						className: "w-2.5 h-2.5 rounded-full shrink-0",
						style: { backgroundColor: e.color }
					}), /* @__PURE__ */ a("span", {
						className: "text-sm text-slate-500",
						children: e.label
					})]
				}, t))
			}),
			/* @__PURE__ */ a(l, { tooltip: d })
		]
	});
}
//#endregion
//#region src/components/charts/scatter-chart.tsx
var _ = [
	"var(--color-accent-500)",
	"#10b981",
	"#f59e0b",
	"#f43f5e",
	"#8b5cf6"
];
function v({ series: t, height: n = 260, xLabel: r, gridLines: s = 4, className: c, formatX: u = String, formatY: d = String }) {
	let [f, p] = i(null), [m, h] = i(null), g = t.flatMap((e) => e.data.map((e) => e.x)), v = t.flatMap((e) => e.data.map((e) => e.y)), y = Math.min(...g), b = Math.max(...g), x = Math.min(...v), S = Math.max(...v), C = b - y || 1, w = S - x || 1, T = (e, t) => ({
		left: 8 + (e - y) / C * 88,
		top: 6 + (S - t) / w * 82
	});
	return /* @__PURE__ */ o("div", {
		className: e("relative w-full select-none", c),
		style: { height: n },
		children: [
			/* @__PURE__ */ o("svg", {
				viewBox: "0 0 100 100",
				preserveAspectRatio: "none",
				className: "absolute inset-0 w-full h-full text-black dark:text-white",
				children: [
					Array.from({ length: s + 1 }).map((e, t) => {
						let n = 6 + t / s * 82, r = 8 + t / s * 88;
						return /* @__PURE__ */ o("g", { children: [/* @__PURE__ */ a("line", {
							x1: 8,
							y1: n,
							x2: 96,
							y2: n,
							stroke: "currentColor",
							strokeOpacity: "0.07",
							strokeWidth: "0.35"
						}), /* @__PURE__ */ a("line", {
							x1: r,
							y1: 6,
							x2: r,
							y2: 88,
							stroke: "currentColor",
							strokeOpacity: "0.07",
							strokeWidth: "0.35"
						})] }, t);
					}),
					/* @__PURE__ */ a("line", {
						x1: 8,
						y1: 88,
						x2: 96,
						y2: 88,
						stroke: "currentColor",
						strokeOpacity: "0.12",
						strokeWidth: "0.4"
					}),
					/* @__PURE__ */ a("line", {
						x1: 8,
						y1: 6,
						x2: 8,
						y2: 88,
						stroke: "currentColor",
						strokeOpacity: "0.12",
						strokeWidth: "0.4"
					})
				]
			}),
			t.map((e, t) => {
				let n = e.color ?? _[t % _.length];
				return e.data.map((r, i) => {
					let { left: s, top: c } = T(r.x, r.y), l = (r.r ?? 1) * 10, f = `${t}-${i}`, g = m === f;
					return /* @__PURE__ */ a("div", {
						style: {
							position: "absolute",
							left: `${s}%`,
							top: `${c}%`,
							width: l,
							height: l,
							borderRadius: "50%",
							transform: "translate(-50%, -50%)",
							backgroundColor: r.color ?? n,
							opacity: m && !g ? .2 : .85,
							outline: g ? "2px solid rgba(255,255,255,0.55)" : "none",
							outlineOffset: 2,
							cursor: "pointer",
							transition: "opacity 0.12s",
							zIndex: g ? 10 : 1
						},
						onMouseEnter: () => h(f),
						onMouseMove: (t) => p({
							x: t.clientX,
							y: t.clientY,
							content: /* @__PURE__ */ o("span", { children: [(r.label || e.label) && /* @__PURE__ */ a("span", {
								className: "text-slate-500 dark:text-slate-400 mr-2",
								children: r.label ?? e.label
							}), /* @__PURE__ */ o("span", {
								className: "font-semibold text-gray-900 dark:text-white",
								children: [
									"(",
									u(r.x),
									", ",
									d(r.y),
									")"
								]
							})] })
						}),
						onMouseLeave: () => {
							h(null), p(null);
						}
					}, f);
				});
			}),
			r && /* @__PURE__ */ a("div", {
				className: "absolute bottom-0 left-0 right-0 text-center pointer-events-none",
				children: /* @__PURE__ */ a("span", {
					className: "text-xs text-slate-600 dark:text-slate-400",
					children: r
				})
			}),
			t.length > 1 && /* @__PURE__ */ a("div", {
				className: "absolute top-2 right-2 flex flex-col gap-2 pointer-events-none",
				children: t.map((e, t) => /* @__PURE__ */ o("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ a("span", {
						className: "w-2.5 h-2.5 rounded-full shrink-0",
						style: { backgroundColor: e.color ?? _[t % _.length] }
					}), /* @__PURE__ */ a("span", {
						className: "text-xs text-slate-500",
						children: e.label
					})]
				}, t))
			}),
			/* @__PURE__ */ a(l, { tooltip: f })
		]
	});
}
//#endregion
//#region src/components/charts/gantt-chart.tsx
var y = [
	"var(--color-accent-500)",
	"#10b981",
	"#f59e0b",
	"#f43f5e",
	"#8b5cf6",
	"#06b6d4"
];
function b({ tasks: t, total: r, xLabels: s, rowHeight: c = 42, className: u }) {
	let [d, f] = i(null), [p, m] = i(null), [h, g] = i(!1);
	n(() => {
		let e = requestAnimationFrame(() => g(!0));
		return () => cancelAnimationFrame(e);
	}, []);
	let _ = r ?? Math.max(...t.map((e) => e.end), 1), v = t.length * c + 28;
	return /* @__PURE__ */ o("div", {
		className: e("relative w-full select-none overflow-x-auto", u),
		children: [/* @__PURE__ */ o("div", {
			style: {
				height: v,
				minWidth: 360
			},
			className: "relative",
			children: [
				/* @__PURE__ */ a("div", {
					className: "absolute inset-0 flex pointer-events-none",
					style: { bottom: 28 },
					children: Array.from({ length: _ + 1 }).map((e, t) => /* @__PURE__ */ a("div", {
						className: "h-full border-l border-black/6 dark:border-white/6 flex-shrink-0",
						style: { width: `${100 / _}%` }
					}, t))
				}),
				t.map((e, t) => {
					let n = e.color ?? y[t % y.length], r = e.start / _ * 100, i = (e.end - e.start) / _ * 100, s = p === e.id;
					return /* @__PURE__ */ a("div", {
						className: "absolute left-0 right-0 flex items-center",
						style: {
							top: t * c,
							height: c
						},
						children: /* @__PURE__ */ a("div", {
							className: "absolute rounded-md flex items-center px-2.5 cursor-pointer",
							style: {
								left: `${r}%`,
								width: h ? `${i}%` : 0,
								top: "18%",
								height: "64%",
								backgroundColor: n,
								opacity: p && !s ? .35 : .85,
								outline: s ? `1.5px solid ${n}` : "none",
								outlineOffset: 2,
								transition: h ? "width 0.45s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.12s" : "none"
							},
							onMouseEnter: () => m(e.id),
							onMouseMove: (t) => f({
								x: t.clientX,
								y: t.clientY,
								content: /* @__PURE__ */ o("span", { children: [/* @__PURE__ */ a("span", {
									className: "font-semibold text-gray-900 dark:text-white mr-2",
									children: e.label
								}), /* @__PURE__ */ o("span", {
									className: "text-slate-500 dark:text-slate-400",
									children: [
										e.start,
										"–",
										e.end
									]
								})] })
							}),
							onMouseLeave: () => {
								m(null), f(null);
							},
							children: /* @__PURE__ */ a("span", {
								className: "text-xs font-medium text-gray-900 dark:text-white/90 truncate leading-none select-none",
								children: e.label
							})
						})
					}, e.id);
				}),
				/* @__PURE__ */ a("div", {
					className: "absolute bottom-0 left-0 right-0 flex border-t border-black/[0.07] dark:border-white/[0.07]",
					style: { height: 28 },
					children: (s ?? Array.from({ length: _ }, (e, t) => String(t + 1))).map((e, t) => /* @__PURE__ */ a("div", {
						className: "flex-1 flex items-center justify-center text-xs text-slate-600 dark:text-slate-400 truncate",
						children: e
					}, t))
				})
			]
		}), /* @__PURE__ */ a(l, { tooltip: d })]
	});
}
//#endregion
//#region src/components/charts/heatmap-chart.tsx
function x({ data: t, rowLabels: n, colLabels: r, color: s = "var(--color-accent-500)", cellSize: c = 34, className: u, formatValue: d = String }) {
	let [f, p] = i(null), m = t.flat(), h = Math.min(...m), g = Math.max(...m, 1) - h || 1, _ = (e) => .08 + (e - h) / g * .88, v = n ? 56 : 0;
	return /* @__PURE__ */ o("div", {
		className: e("select-none overflow-x-auto", u),
		children: [/* @__PURE__ */ o("div", {
			style: {
				display: "inline-flex",
				flexDirection: "column",
				gap: 3
			},
			children: [r && /* @__PURE__ */ a("div", {
				style: {
					display: "flex",
					gap: 3,
					paddingLeft: v + 3
				},
				children: r.map((e, t) => /* @__PURE__ */ a("div", {
					style: {
						width: c,
						flexShrink: 0
					},
					className: "text-center text-xs text-slate-600 dark:text-slate-400 leading-none truncate",
					children: e
				}, t))
			}), t.map((e, t) => /* @__PURE__ */ o("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 3
				},
				children: [n && /* @__PURE__ */ a("div", {
					style: {
						width: v,
						flexShrink: 0
					},
					className: "text-xs text-slate-600 dark:text-slate-400 text-right pr-2 leading-none truncate",
					children: n[t]
				}), e.map((e, i) => /* @__PURE__ */ a("div", {
					"data-heatmap-cell": "",
					style: {
						width: c,
						height: c,
						flexShrink: 0,
						backgroundColor: s,
						opacity: _(e),
						borderRadius: 5,
						cursor: "pointer",
						transition: "background-color 0.12s, opacity 0.12s"
					},
					onMouseMove: (s) => p({
						x: s.clientX,
						y: s.clientY,
						content: /* @__PURE__ */ o("span", { children: [
							n?.[t] && /* @__PURE__ */ a("span", {
								className: "text-slate-500 dark:text-slate-400 mr-1.5",
								children: n[t]
							}),
							r?.[i] && /* @__PURE__ */ a("span", {
								className: "text-slate-500 dark:text-slate-400 mr-2",
								children: r[i]
							}),
							/* @__PURE__ */ a("span", {
								className: "font-semibold text-gray-900 dark:text-white",
								children: d(e)
							})
						] })
					}),
					onMouseLeave: () => p(null)
				}, i))]
			}, t))]
		}), /* @__PURE__ */ a(l, { tooltip: f })]
	});
}
//#endregion
//#region src/components/charts/radar-chart.tsx
var S = [
	"var(--color-accent-500)",
	"#10b981",
	"#f59e0b",
	"#f43f5e",
	"#8b5cf6"
];
function C({ axes: t, series: n, size: r = 240, gridLines: s = 4, className: c }) {
	let [u, d] = i(null), f = t.length, p = (e) => Math.PI * 2 * e / f - Math.PI / 2, m = (e, t) => ({
		x: 50 + e * Math.cos(p(t)),
		y: 50 + e * Math.sin(p(t))
	}), h = Math.max(...n.flatMap((e) => e.data), 1), g = (e) => e.map((e, t) => {
		let { x: n, y: r } = m(e / h * 38, t);
		return `${t === 0 ? "M" : "L"}${n},${r}`;
	}).join(" ") + "Z";
	return /* @__PURE__ */ o("div", {
		className: e("inline-flex flex-col items-center gap-4", c),
		children: [
			/* @__PURE__ */ o("svg", {
				viewBox: "0 0 100 100",
				style: {
					width: r,
					height: r
				},
				className: "text-black dark:text-white",
				children: [
					Array.from({ length: s }).map((e, t) => {
						let n = 38 * ((t + 1) / s), r = Array.from({ length: f }, (e, t) => m(n, t)).map((e, t) => `${t === 0 ? "M" : "L"}${e.x},${e.y}`).join(" ") + "Z";
						return /* @__PURE__ */ a("path", {
							d: r,
							fill: "none",
							stroke: "currentColor",
							strokeOpacity: "0.08",
							strokeWidth: "0.4"
						}, t);
					}),
					t.map((e, t) => {
						let { x: n, y: r } = m(38, t);
						return /* @__PURE__ */ a("line", {
							x1: 50,
							y1: 50,
							x2: n,
							y2: r,
							stroke: "currentColor",
							strokeOpacity: "0.1",
							strokeWidth: "0.4"
						}, t);
					}),
					n.map((e, n) => {
						let r = e.color ?? S[n % S.length];
						return /* @__PURE__ */ o("g", { children: [/* @__PURE__ */ a("path", {
							d: g(e.data),
							fill: r,
							fillOpacity: "0.12",
							style: {
								stroke: r,
								strokeWidth: 1.2,
								strokeOpacity: .85,
								strokeLinejoin: "round"
							}
						}), e.data.map((e, n) => {
							let { x: i, y: s } = m(e / h * 38, n);
							return /* @__PURE__ */ a("circle", {
								cx: i,
								cy: s,
								r: "1.5",
								style: {
									fill: r,
									fillOpacity: .9,
									cursor: "pointer"
								},
								onMouseMove: (i) => d({
									x: i.clientX,
									y: i.clientY,
									content: /* @__PURE__ */ o("span", { children: [/* @__PURE__ */ a("span", {
										className: "text-slate-500 dark:text-slate-400 mr-2",
										children: t[n]
									}), /* @__PURE__ */ a("span", {
										className: "font-semibold",
										style: { color: r },
										children: e
									})] })
								}),
								onMouseLeave: () => d(null)
							}, n);
						})] }, n);
					}),
					t.map((e, t) => {
						let { x: n, y: r } = m(46, t);
						return /* @__PURE__ */ a("text", {
							x: n,
							y: r,
							textAnchor: n < 48 ? "end" : n > 52 ? "start" : "middle",
							dominantBaseline: "middle",
							fontSize: "5.5",
							fill: "currentColor",
							className: "text-slate-600 dark:text-slate-400",
							children: e
						}, t);
					})
				]
			}),
			n.length > 1 && /* @__PURE__ */ a("div", {
				className: "flex items-center gap-5",
				children: n.map((e, t) => /* @__PURE__ */ o("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ a("span", {
						className: "w-2.5 h-2.5 rounded-full shrink-0",
						style: { backgroundColor: e.color ?? S[t % S.length] }
					}), /* @__PURE__ */ a("span", {
						className: "text-sm text-slate-600 dark:text-slate-300",
						children: e.label
					})]
				}, t))
			}),
			/* @__PURE__ */ a(l, { tooltip: u })
		]
	});
}
//#endregion
//#region src/components/charts/funnel-chart.tsx
var w = [
	"var(--color-accent-500)",
	"#6366f1",
	"#8b5cf6",
	"#a855f7",
	"#c084fc"
];
function T({ data: t, className: r, formatValue: s = String }) {
	let [c, u] = i(null), [d, f] = i(null), [p, m] = i(!1);
	n(() => {
		let e = requestAnimationFrame(() => m(!0));
		return () => cancelAnimationFrame(e);
	}, []);
	let h = Math.max(...t.map((e) => e.value), 1);
	return /* @__PURE__ */ o("div", {
		className: e("w-full select-none flex flex-col gap-2", r),
		children: [t.map((e, n) => {
			let r = 18 + e.value / h * 82, i = e.color ?? w[n % w.length], c = d === n, l = n > 0 ? (e.value / t[0].value * 100).toFixed(0) : null;
			return /* @__PURE__ */ o("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ a("span", {
						className: "text-sm text-slate-800 dark:text-slate-100 font-[500] text-right shrink-0 leading-none truncate",
						style: { width: 80 },
						children: e.label
					}),
					/* @__PURE__ */ a("div", {
						className: "flex-1 flex justify-center",
						children: /* @__PURE__ */ a("div", {
							className: "relative h-10 rounded-md flex items-center justify-center cursor-pointer",
							style: {
								width: p ? `${r}%` : "18%",
								backgroundColor: i,
								opacity: d !== null && !c ? .3 : c ? 1 : .78,
								boxShadow: c ? `0 0 0 2px ${i}88` : "none",
								transition: p ? `width 0.45s ${n * .06}s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.12s, box-shadow 0.12s` : "none"
							},
							onMouseEnter: () => f(n),
							onMouseMove: (t) => u({
								x: t.clientX,
								y: t.clientY,
								content: /* @__PURE__ */ o("span", { children: [
									/* @__PURE__ */ a("span", {
										className: "text-slate-500 dark:text-slate-400 mr-2",
										children: e.label
									}),
									/* @__PURE__ */ a("span", {
										className: "font-semibold text-gray-900 dark:text-white",
										children: s(e.value)
									}),
									l && /* @__PURE__ */ o("span", {
										className: "text-slate-500 dark:text-slate-400 ml-2",
										children: [l, "% of total"]
									})
								] })
							}),
							onMouseLeave: () => {
								f(null), u(null);
							}
						})
					}),
					/* @__PURE__ */ o("div", {
						className: "shrink-0 text-right",
						style: { width: 80 },
						children: [/* @__PURE__ */ a("span", {
							className: "text-sm font-semibold text-slate-800 dark:text-slate-100 tabular-nums leading-none",
							children: s(e.value)
						}), l && /* @__PURE__ */ o("span", {
							className: "ml-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums",
							children: [l, "%"]
						})]
					})
				]
			}, n);
		}), /* @__PURE__ */ a(l, { tooltip: c })]
	});
}
//#endregion
//#region src/components/charts/waterfall-chart.tsx
function E({ data: t, height: s = 240, className: c, formatValue: u = String }) {
	let [d, f] = i(null), [p, m] = i(null), [h, g] = i(!1), _ = r().replace(/:/g, "");
	n(() => {
		let e = requestAnimationFrame(() => g(!0));
		return () => cancelAnimationFrame(e);
	}, []);
	let v = 0, y = t.map((e) => {
		let t = e.total ? 0 : v;
		e.total || (v += e.value);
		let n = e.total ? v : t + e.value;
		return {
			...e,
			base: t,
			end: n,
			color: e.color ?? (e.total ? "var(--color-slate-500)" : e.value >= 0 ? "#10b981" : "#f43f5e")
		};
	}), b = y.flatMap((e) => [e.base, e.end]), x = Math.min(...b, 0), S = Math.max(...b, 1), C = S - x || 1, w = (e) => 6 + (S - e) / C * 82, T = 100 / y.length, E = T * .2, D = T - E * 2;
	return /* @__PURE__ */ o("div", {
		className: e("relative w-full select-none", c),
		style: { height: s },
		children: [
			/* @__PURE__ */ o("svg", {
				viewBox: "0 0 100 100",
				preserveAspectRatio: "none",
				className: "absolute inset-0 w-full h-full text-slate-900 dark:text-white",
				children: [
					/* @__PURE__ */ a("defs", { children: y.map((e, t) => /* @__PURE__ */ o("linearGradient", {
						id: `${_}-wf-${t}`,
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ a("stop", {
							offset: "0%",
							stopColor: e.color,
							stopOpacity: "1"
						}), /* @__PURE__ */ a("stop", {
							offset: "100%",
							stopColor: e.color,
							stopOpacity: "0.5"
						})]
					}, t)) }),
					x < 0 && /* @__PURE__ */ a("line", {
						x1: "0",
						y1: w(0),
						x2: "100",
						y2: w(0),
						stroke: "currentColor",
						strokeOpacity: "0.15",
						strokeWidth: "0.4",
						strokeDasharray: "2 2"
					}),
					[
						.25,
						.5,
						.75
					].map((e, t) => /* @__PURE__ */ a("line", {
						x1: "0",
						y1: 6 + e * 82,
						x2: "100",
						y2: 6 + e * 82,
						stroke: "currentColor",
						strokeOpacity: "0.07",
						strokeWidth: "0.35"
					}, t)),
					y.map((e, t) => {
						if (t === y.length - 1) return null;
						let n = (t + 1) * T + E, r = t * T + E + D, i = w(e.end);
						return /* @__PURE__ */ a("line", {
							x1: r,
							y1: i,
							x2: n,
							y2: i,
							stroke: "currentColor",
							strokeOpacity: "0.2",
							strokeWidth: "0.35",
							strokeDasharray: "1.5 1"
						}, t);
					}),
					y.map((e, t) => {
						let n = w(Math.max(e.base, e.end)), r = w(Math.min(e.base, e.end)), i = Math.max(r - n, .5), s = t * T + E, c = .4, l = t * .05;
						return /* @__PURE__ */ a("rect", {
							x: s,
							width: D,
							rx: "1.2",
							y: h ? n : r,
							height: h ? i : 0,
							onMouseEnter: () => m(t),
							onMouseMove: (t) => f({
								x: t.clientX,
								y: t.clientY,
								content: /* @__PURE__ */ o("span", { children: [/* @__PURE__ */ a("span", {
									className: "text-slate-500 dark:text-slate-400 mr-2",
									children: e.label
								}), /* @__PURE__ */ o("span", {
									className: "font-semibold",
									style: { color: e.color },
									children: [e.value >= 0 && !e.total ? "+" : "", u(e.value)]
								})] })
							}),
							onMouseLeave: () => {
								m(null), f(null);
							},
							className: "cursor-pointer",
							style: {
								fill: `url(#${_}-wf-${t})`,
								fillOpacity: p !== null && p !== t ? .35 : 1,
								transition: h ? `y ${c}s ${l}s cubic-bezier(0.25,0.46,0.45,0.94), height ${c}s ${l}s cubic-bezier(0.25,0.46,0.45,0.94), fill-opacity 0.12s` : "none"
							}
						}, t);
					}),
					/* @__PURE__ */ a("line", {
						x1: "0",
						y1: 88,
						x2: "100",
						y2: 88,
						stroke: "currentColor",
						strokeOpacity: "0.1",
						strokeWidth: "0.35"
					})
				]
			}),
			/* @__PURE__ */ a("div", {
				className: "absolute bottom-0 left-0 right-0 flex",
				style: { height: 20 },
				children: y.map((t, n) => /* @__PURE__ */ a("div", {
					className: e("flex-1 text-center text-xs truncate px-1 leading-5", t.total ? "text-slate-500 dark:text-slate-400 font-medium" : "text-slate-500"),
					children: t.label
				}, n))
			}),
			/* @__PURE__ */ a(l, { tooltip: d })
		]
	});
}
//#endregion
export { b as a, m as c, x as i, f as l, T as n, v as o, C as r, g as s, E as t, u };

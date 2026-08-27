import { t as e } from "./cn-DpgY2leY.js";
import { c as t } from "./component-styles-Ce56hn9T.js";
import { useCallback as n, useMemo as r, useState as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
//#region src/components/datatable/pagination-footer.tsx
function s({ loading: n, sortedLength: r, pageSizeOptions: i, pageSize: s, page: c, totalPages: l, hasPagination: u, setPage: d }) {
	return /* @__PURE__ */ o("div", {
		className: "flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground",
		children: [/* @__PURE__ */ a("span", { children: n ? "Loading…" : r === 0 ? "0 results" : i !== !1 && s !== Infinity ? `${(c - 1) * s + 1}–${Math.min(c * s, r)} of ${r}` : `${r} row${r === 1 ? "" : "s"}` }), u && /* @__PURE__ */ o("nav", {
			"aria-label": "Table pagination",
			className: "flex items-center gap-1",
			children: [
				/* @__PURE__ */ a("button", {
					type: "button",
					onClick: () => d(1),
					disabled: c === 1,
					className: e(t, "size-7 max-sm:hidden"),
					"aria-label": "First page",
					children: /* @__PURE__ */ o("svg", {
						width: "12",
						height: "12",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ a("path", { d: "m11 17-5-5 5-5" }), /* @__PURE__ */ a("path", { d: "m18 17-5-5 5-5" })]
					})
				}),
				/* @__PURE__ */ a("button", {
					type: "button",
					onClick: () => d((e) => Math.max(1, e - 1)),
					disabled: c === 1,
					className: e(t, "size-7"),
					"aria-label": "Previous page",
					children: /* @__PURE__ */ a("svg", {
						width: "12",
						height: "12",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: /* @__PURE__ */ a("path", { d: "m15 18-6-6 6-6" })
					})
				}),
				Array.from({ length: Math.min(5, l) }, (n, r) => {
					let i;
					return i = l <= 5 || c <= 3 ? r + 1 : c >= l - 2 ? l - 4 + r : c - 2 + r, /* @__PURE__ */ a("button", {
						type: "button",
						onClick: () => d(i),
						"aria-label": `Page ${i}`,
						"aria-current": c === i ? "page" : void 0,
						className: e(t, "size-7 text-xs font-medium", c === i ? "bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300" : "text-muted-foreground"),
						children: i
					}, i);
				}),
				/* @__PURE__ */ a("button", {
					type: "button",
					onClick: () => d((e) => Math.min(l, e + 1)),
					disabled: c === l,
					className: e(t, "size-7"),
					"aria-label": "Next page",
					children: /* @__PURE__ */ a("svg", {
						width: "12",
						height: "12",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: /* @__PURE__ */ a("path", { d: "m9 18 6-6-6-6" })
					})
				}),
				/* @__PURE__ */ a("button", {
					type: "button",
					onClick: () => d(l),
					disabled: c === l,
					className: e(t, "size-7 max-sm:hidden"),
					"aria-label": "Last page",
					children: /* @__PURE__ */ o("svg", {
						width: "12",
						height: "12",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ a("path", { d: "m13 17 5-5-5-5" }), /* @__PURE__ */ a("path", { d: "m6 17 5-5-5-5" })]
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/components/datatable/rows-dropdown.tsx
function c({ options: e, value: t, onChange: n }) {
	return /* @__PURE__ */ o("label", {
		className: "flex shrink-0 items-center gap-2 text-xs text-muted-foreground",
		children: [/* @__PURE__ */ a("span", { children: "Rows" }), /* @__PURE__ */ a("select", {
			value: t,
			onChange: (e) => n(Number(e.target.value)),
			className: "h-8 rounded-[var(--radius-md)] border border-border bg-surface px-2 text-xs text-foreground focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-focus-ring/20",
			children: e.map((e) => /* @__PURE__ */ a("option", {
				value: e,
				children: e
			}, e))
		})]
	});
}
//#endregion
//#region src/components/datatable/skeleton-row.tsx
function l({ cols: e }) {
	return /* @__PURE__ */ a("tr", { children: Array.from({ length: e }).map((e, t) => /* @__PURE__ */ a("td", {
		className: "px-4 py-3",
		children: /* @__PURE__ */ a("div", {
			className: "h-4 rounded-md bg-black/6 dark:bg-white/6 animate-pulse",
			style: { width: `${60 + t * 17 % 40}%` }
		})
	}, t)) });
}
//#endregion
//#region src/components/datatable/sort-icon.tsx
function u({ dir: t }) {
	return /* @__PURE__ */ o("span", {
		className: "inline-flex flex-col ml-1.5 gap-[2px] shrink-0",
		children: [/* @__PURE__ */ a("svg", {
			"aria-hidden": "true",
			width: "8",
			height: "5",
			viewBox: "0 0 8 5",
			className: e(t === "asc" ? "text-accent-600" : "text-muted-foreground/60"),
			children: /* @__PURE__ */ a("path", {
				d: "M4 0L8 5H0L4 0Z",
				fill: "currentColor"
			})
		}), /* @__PURE__ */ a("svg", {
			"aria-hidden": "true",
			width: "8",
			height: "5",
			viewBox: "0 0 8 5",
			className: e(t === "desc" ? "text-accent-600" : "text-muted-foreground/60"),
			children: /* @__PURE__ */ a("path", {
				d: "M4 5L0 0H8L4 5Z",
				fill: "currentColor"
			})
		})]
	});
}
//#endregion
//#region src/components/datatable.tsx
var d = {
	left: "text-left",
	center: "text-center",
	right: "text-right"
};
function f({ columns: t, data: f, loading: p = !1, emptyMessage: m = "No data", onRowClick: h, className: g, toolbarClassName: _, tableClassName: v, searchable: y = !1, searchPlaceholder: b = "Search…", pageSizeOptions: x = [
	10,
	25,
	50
], defaultPageSize: S, density: C = "comfortable", ariaLabel: w = "Data table", getRowLabel: T, unstyled: E = !1 }) {
	let [D, O] = i(null), [k, A] = i(null), [j, M] = i(""), [N, P] = i(1), [F, I] = i(S ?? (x === !1 ? Infinity : x[0] ?? 10)), L = n((e) => {
		D === e ? k === "asc" ? A("desc") : (O(null), A(null)) : (O(e), A("asc")), P(1);
	}, [k, D]), R = r(() => t.filter((e) => e.searchable !== !1 && e.key), [t]), z = r(() => {
		let e = j.trim().toLowerCase();
		return e ? f.filter((t) => R.some((n) => {
			let r = t[n.key];
			return String(r ?? "").toLowerCase().includes(e);
		})) : f;
	}, [
		f,
		j,
		R
	]), B = r(() => !D || !k ? z : [...z].sort((e, t) => {
		let n = e[D], r = t[D], i = String(n ?? "").localeCompare(String(r ?? ""), void 0, { numeric: !0 });
		return k === "asc" ? i : -i;
	}), [
		z,
		D,
		k
	]), V = r(() => {
		if (x === !1 || F === Infinity) return B;
		let e = (N - 1) * F;
		return B.slice(e, e + F);
	}, [
		B,
		N,
		F,
		x
	]), H = r(() => x !== !1 && F !== Infinity ? Math.max(1, Math.ceil(B.length / F)) : 1, [
		B.length,
		F,
		x
	]), U = x !== !1 && F !== Infinity && H > 1, W = y || x !== !1 && Array.isArray(x) && x.length > 1, G = n((e) => {
		M(e.target.value), P(1);
	}, []), K = n((e) => {
		I(e), P(1);
	}, []);
	return E ? /* @__PURE__ */ o("div", {
		className: e("w-full", g),
		children: [y && /* @__PURE__ */ a("input", {
			"aria-label": b,
			value: j,
			onChange: G,
			placeholder: b
		}), /* @__PURE__ */ a("table", {
			"aria-label": w,
			className: v,
			children: /* @__PURE__ */ a("tbody", { children: V.map((e) => /* @__PURE__ */ a("tr", {
				onClick: h ? () => h(e) : void 0,
				children: t.map((t) => /* @__PURE__ */ a("td", { children: t.cell(e) }, t.key))
			}, e.id)) })
		})]
	}) : /* @__PURE__ */ o("div", {
		className: e("w-full min-w-0 max-w-full flex flex-col gap-3", g),
		children: [
			W && /* @__PURE__ */ o("div", {
				className: e("flex flex-col sm:flex-row sm:items-center justify-between gap-3", _),
				children: [y ? /* @__PURE__ */ o("div", {
					className: "relative flex-1 sm:max-w-xs",
					children: [/* @__PURE__ */ o("svg", {
						"aria-hidden": "true",
						className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ a("circle", {
							cx: "11",
							cy: "11",
							r: "8"
						}), /* @__PURE__ */ a("path", { d: "m21 21-4.3-4.3" })]
					}), /* @__PURE__ */ a("input", {
						"aria-label": b,
						type: "search",
						value: j,
						onChange: G,
						placeholder: b,
						className: "h-8 w-full rounded-[var(--radius-md)] border border-border bg-surface pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-focus-ring/20"
					})]
				}) : /* @__PURE__ */ a("div", {}), x !== !1 && Array.isArray(x) && x.length > 1 && /* @__PURE__ */ a(c, {
					options: x,
					value: F,
					onChange: K
				})]
			}),
			/* @__PURE__ */ a("div", {
				style: { contain: "inline-size paint" },
				className: e("w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface", v),
				children: /* @__PURE__ */ a("div", {
					className: "w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain scrollbar-thin",
					children: /* @__PURE__ */ o("table", {
						"aria-label": w,
						"data-density": C,
						className: "group/table w-full text-sm border-collapse",
						children: [/* @__PURE__ */ a("thead", {
							className: "border-b border-border bg-surface-muted",
							children: /* @__PURE__ */ a("tr", { children: t.map((t) => /* @__PURE__ */ a("th", {
								scope: "col",
								"aria-sort": D === t.key ? k === "asc" ? "ascending" : k === "desc" ? "descending" : "none" : void 0,
								style: { width: t.width },
								className: e("px-4 py-2.5 text-xs font-medium text-muted-foreground group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2", d[t.align ?? "left"]),
								children: t.sortable ? /* @__PURE__ */ o("button", {
									type: "button",
									className: "inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35",
									onClick: () => L(t.key),
									children: [t.header, /* @__PURE__ */ a(u, { dir: D === t.key ? k : null })]
								}) : t.header
							}, t.key)) })
						}), /* @__PURE__ */ a("tbody", {
							className: "divide-y divide-border",
							children: p ? Array.from({ length: 5 }).map((e, n) => /* @__PURE__ */ a(l, { cols: t.length }, n)) : V.length === 0 ? /* @__PURE__ */ a("tr", { children: /* @__PURE__ */ a("td", {
								colSpan: t.length,
								className: "px-4 py-12 text-center text-sm text-muted-foreground",
								children: j ? `No results for “${j}”` : m
							}) }) : V.map((n) => /* @__PURE__ */ a("tr", {
								tabIndex: h ? 0 : void 0,
								"aria-label": T?.(n),
								className: e("transition-colors duration-100 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring/35", h && "cursor-pointer"),
								onClick: h ? () => h(n) : void 0,
								onKeyDown: h ? (e) => {
									(e.key === "Enter" || e.key === " ") && (e.preventDefault(), h(n));
								} : void 0,
								children: t.map((t) => /* @__PURE__ */ a("td", {
									className: e("px-4 py-3 text-sm text-foreground group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2", d[t.align ?? "left"]),
									children: t.cell(n)
								}, t.key))
							}, n.id))
						})]
					})
				})
			}),
			(U || !p && B.length > 0) && /* @__PURE__ */ a(s, {
				loading: p,
				sortedLength: B.length,
				pageSizeOptions: x,
				pageSize: F,
				page: N,
				totalPages: H,
				hasPagination: U,
				setPage: P
			})
		]
	});
}
//#endregion
export { f as t };

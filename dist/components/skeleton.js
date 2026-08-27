import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/skeleton.tsx
var r = {
	sm: "rounded-sm",
	md: "rounded-md",
	lg: "rounded-lg",
	full: "rounded-full"
};
function i({ className: n, width: i, height: a, rounded: o = "md", style: s, ...c }) {
	return /* @__PURE__ */ t("div", {
		className: e("animate-pulse bg-muted", r[o], n),
		style: {
			width: i,
			height: a,
			...s
		},
		"aria-hidden": "true",
		...c
	});
}
function a({ lines: n = 3, className: r, lastLineWidth: a = "60%" }) {
	return /* @__PURE__ */ t("div", {
		className: e("space-y-2", r),
		"aria-hidden": "true",
		children: Array.from({ length: n }).map((e, r) => /* @__PURE__ */ t(i, {
			height: 14,
			width: r === n - 1 ? a : "100%"
		}, r))
	});
}
var o = {
	sm: 32,
	md: 36,
	lg: 44
};
function s({ size: e = "md", className: n }) {
	let r = o[e];
	return /* @__PURE__ */ t(i, {
		width: r,
		height: r,
		rounded: "full",
		className: n
	});
}
function c({ lines: r = 3, hasAvatar: a = !1, hasFooter: o = !1, className: c }) {
	return /* @__PURE__ */ n("div", {
		className: e("rounded-[var(--radius-lg)] border border-border bg-surface", c),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ n("div", {
				className: "flex items-center gap-3 border-b border-border px-5 py-4",
				children: [a && /* @__PURE__ */ t(s, {}), /* @__PURE__ */ n("div", {
					className: "flex-1 space-y-1.5",
					children: [/* @__PURE__ */ t(i, {
						height: 14,
						width: "40%"
					}), /* @__PURE__ */ t(i, {
						height: 11,
						width: "25%"
					})]
				})]
			}),
			/* @__PURE__ */ t("div", {
				className: "px-5 py-4 space-y-2.5",
				children: Array.from({ length: r }).map((e, n) => /* @__PURE__ */ t(i, {
					height: 13,
					width: n === r - 1 ? "65%" : "100%"
				}, n))
			}),
			o && /* @__PURE__ */ n("div", {
				className: "flex items-center gap-2 border-t border-border px-5 py-3.5",
				children: [/* @__PURE__ */ t(i, {
					height: 28,
					width: 72,
					rounded: "lg"
				}), /* @__PURE__ */ t(i, {
					height: 28,
					width: 72,
					rounded: "lg"
				})]
			})
		]
	});
}
function l({ hasBreadcrumb: r = !0, hasAction: a = !0, className: o }) {
	return /* @__PURE__ */ n("div", {
		className: e("w-full px-4 py-3 sm:px-6 sm:py-4", "bg-surface/90", "border-b border-border", "sticky top-0 z-30", o),
		"aria-hidden": "true",
		children: [r && /* @__PURE__ */ n("div", {
			className: "flex items-center gap-1.5 mb-2.5",
			children: [
				/* @__PURE__ */ t(i, {
					height: 10,
					width: 72
				}),
				/* @__PURE__ */ t(i, {
					height: 10,
					width: 6,
					rounded: "full"
				}),
				/* @__PURE__ */ t(i, {
					height: 10,
					width: 52
				})
			]
		}), /* @__PURE__ */ n("div", {
			className: "flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ n("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ t(i, {
					height: 18,
					width: 148
				}), /* @__PURE__ */ t(i, {
					height: 11,
					width: 196
				})]
			}), a && /* @__PURE__ */ t(i, {
				height: 30,
				width: 100,
				rounded: "lg"
			})]
		})]
	});
}
function u({ rows: r = 5, cols: a = 4, className: o }) {
	return /* @__PURE__ */ n("div", {
		className: e("overflow-hidden rounded-[var(--radius-lg)] border border-border", o),
		"aria-hidden": "true",
		children: [/* @__PURE__ */ t("div", {
			className: "flex items-center gap-4 border-b border-border bg-surface-muted px-4 py-3",
			children: Array.from({ length: a }).map((e, n) => /* @__PURE__ */ t(i, {
				height: 11,
				width: `${50 + n * 13 % 50}px`
			}, n))
		}), Array.from({ length: r }).map((e, n) => /* @__PURE__ */ t("div", {
			className: "flex items-center gap-4 border-b border-border px-4 py-3 last:border-none",
			children: Array.from({ length: a }).map((e, r) => /* @__PURE__ */ t(i, {
				height: 13,
				width: `${55 + (n + r) * 11 % 45}%`
			}, r))
		}, n))]
	});
}
//#endregion
export { i as Skeleton, s as SkeletonAvatar, c as SkeletonCard, u as SkeletonTable, a as SkeletonText, l as SkeletonTopbar };

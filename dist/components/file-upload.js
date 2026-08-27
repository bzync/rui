"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { o as t } from "../component-styles-Ce56hn9T.js";
import { AnimatePresence as n, motion as r } from "framer-motion";
import { forwardRef as i, useId as a, useRef as o, useState as s } from "react";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/components/file-upload.tsx
var u = i(({ className: i, label: u, hint: d, error: f, accept: p, maxSizeMB: m, onFilesChange: h, disabled: g, multiple: _, id: v, ...y }, b) => {
	let [x, S] = s(!1), [C, w] = s([]), [T, E] = s(""), D = o(null), O = a(), k = v ?? O, A = `${k}-message`, j = m && (m >= 1024 ? `${m / 1024}GB` : `${m}MB`);
	function M(e) {
		if (!e) return;
		let t = Array.from(e);
		if (m) {
			let e = t.find((e) => e.size > m * 1024 * 1024);
			if (e) {
				E(`${e.name} exceeds ${j}`);
				return;
			}
		}
		E("");
		let n = _ ? [...C, ...t] : t;
		w(n), h?.(n);
	}
	function N(e) {
		let t = C.filter((t, n) => n !== e);
		w(t), h?.(t);
	}
	function P(e) {
		e.preventDefault(), S(!1), !g && M(e.dataTransfer.files);
	}
	let F = f ?? T;
	return /* @__PURE__ */ l("div", {
		className: e(t, i),
		children: [
			u && /* @__PURE__ */ c("label", {
				htmlFor: k,
				className: "text-sm font-medium leading-5 text-foreground",
				children: u
			}),
			/* @__PURE__ */ l("label", {
				htmlFor: k,
				onDragOver: (e) => {
					e.preventDefault(), g || S(!0);
				},
				onDragLeave: () => S(!1),
				onDrop: P,
				className: e("relative flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-dashed px-4 py-7 text-center cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-focus-ring/25", x ? "border-accent-500/60 bg-accent-500/6" : F ? "border-red-500/40 bg-red-500/4" : "border-border-strong bg-surface-muted/50 hover:border-accent-500/60 hover:bg-muted", g && "opacity-50 cursor-not-allowed pointer-events-none"),
				children: [
					/* @__PURE__ */ c("input", {
						ref: (e) => {
							D.current = e, typeof b == "function" ? b(e) : b && (b.current = e);
						},
						type: "file",
						id: k,
						accept: p,
						multiple: _,
						disabled: g,
						"aria-invalid": F ? !0 : void 0,
						"aria-describedby": F || d ? A : void 0,
						className: "sr-only",
						onChange: (e) => M(e.target.files),
						...y
					}),
					/* @__PURE__ */ l("svg", {
						width: "24",
						height: "24",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						className: "text-muted-foreground",
						children: [
							/* @__PURE__ */ c("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
							/* @__PURE__ */ c("polyline", { points: "17 8 12 3 7 8" }),
							/* @__PURE__ */ c("line", {
								x1: "12",
								y1: "3",
								x2: "12",
								y2: "15"
							})
						]
					}),
					/* @__PURE__ */ l("div", { children: [/* @__PURE__ */ l("p", {
						className: "text-sm font-medium text-foreground",
						children: ["Drop files here or ", /* @__PURE__ */ c("span", {
							className: "text-accent-700 dark:text-accent-300",
							children: "browse"
						})]
					}), (p || m) && /* @__PURE__ */ c("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: [p && `Accepts ${p}`, j && `Max ${j}`].filter(Boolean).join(" · ")
					})] })
				]
			}),
			/* @__PURE__ */ c(n, {
				initial: !1,
				children: C.length > 0 && /* @__PURE__ */ c(r.ul, {
					initial: {
						opacity: 0,
						height: 0
					},
					animate: {
						opacity: 1,
						height: "auto"
					},
					exit: {
						opacity: 0,
						height: 0
					},
					className: "flex flex-col gap-1 overflow-hidden",
					children: C.map((t, n) => /* @__PURE__ */ l("li", {
						className: "flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface-muted px-3 py-2",
						children: [
							/* @__PURE__ */ l("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "text-slate-400 shrink-0",
								children: [/* @__PURE__ */ c("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ c("polyline", { points: "14 2 14 8 20 8" })]
							}),
							/* @__PURE__ */ c("span", {
								className: "min-w-0 flex-1 truncate text-xs text-foreground",
								children: t.name
							}),
							/* @__PURE__ */ l("span", {
								className: "shrink-0 text-[10px] text-muted-foreground",
								children: [(t.size / 1024).toFixed(0), "KB"]
							}),
							/* @__PURE__ */ c("button", {
								type: "button",
								onClick: () => N(n),
								"aria-label": `Remove ${t.name}`,
								className: e("shrink-0 rounded-sm text-muted-foreground hover:text-destructive transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"),
								children: /* @__PURE__ */ c("svg", {
									width: "12",
									height: "12",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ c("path", { d: "M18 6 6 18M6 6l12 12" })
								})
							})
						]
					}, `${t.name}-${n}`))
				})
			}),
			F && /* @__PURE__ */ c("p", {
				id: A,
				"aria-live": "polite",
				className: "text-xs leading-5 text-destructive",
				children: F
			}),
			d && !F && /* @__PURE__ */ c("p", {
				id: A,
				className: "text-xs leading-5 text-muted-foreground",
				children: d
			})
		]
	});
});
u.displayName = "FileUpload";
//#endregion
export { u as FileUpload };

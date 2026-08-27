"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { useCallback as t, useEffect as n, useRef as r } from "react";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/components/richtext.tsx
function o({ onClick: t, title: n, active: r, children: a }) {
	return /* @__PURE__ */ i("button", {
		type: "button",
		title: n,
		onMouseDown: (e) => {
			e.preventDefault(), t();
		},
		className: e("h-7 w-7 flex items-center justify-center rounded-md text-sm transition-colors", r ? "bg-black/10 dark:bg-white/15 text-gray-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/6 dark:hover:bg-white/8"),
		children: a
	});
}
function s() {
	return /* @__PURE__ */ i("div", { className: "w-px h-5 bg-black/10 dark:bg-white/10 mx-0.5" });
}
function c(e) {
	if (typeof document > "u") return e;
	let t = document.createElement("template");
	t.innerHTML = e, t.content.querySelectorAll("script, style, iframe, object, embed, link, meta").forEach((e) => e.remove());
	let n = document.createTreeWalker(t.content, NodeFilter.SHOW_ELEMENT);
	for (; n.nextNode();) {
		let e = n.currentNode;
		for (let t of Array.from(e.attributes)) {
			let n = t.name.toLowerCase(), r = t.value.trim().toLowerCase();
			(n.startsWith("on") || r.startsWith("javascript:")) && e.removeAttribute(t.name);
		}
	}
	let r = t.innerHTML;
	return r = r.replace(/\son\w+\s*=\s*(['"])[^'"]*\1/gi, ""), r;
}
function l(e, t) {
	return t ? typeof t == "function" ? t(e) : c(e) : e;
}
function u({ value: c = "", onChange: u, placeholder: d = "Start typing…", className: f, minHeight: p = 160, sanitize: m = !1 }) {
	let h = r(null), g = r(c);
	n(() => {
		let e = l(c, m);
		h.current && h.current.innerHTML !== e && (h.current.innerHTML = e, g.current = e);
	}, [c, m]);
	let _ = t(() => {
		let e = h.current?.innerHTML ?? "", t = m ? l(e, m) : e;
		t !== g.current && (g.current = t, u?.(t));
	}, [u, m]);
	function v(e, t) {
		try {
			document.execCommand(e, !1, t);
		} catch {}
		h.current?.focus(), _();
	}
	function y(e) {
		try {
			return document.queryCommandState(e);
		} catch {
			return !1;
		}
	}
	return /* @__PURE__ */ a("div", {
		className: e("rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-navy-900 focus-within:ring-1 focus-within:ring-blue-500/40 focus-within:border-accent-500/30 transition-all", f),
		children: [/* @__PURE__ */ a("div", {
			className: "flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/2 dark:bg-white/2",
			children: [
				/* @__PURE__ */ i(o, {
					title: "Bold (⌘B)",
					onClick: () => v("bold"),
					active: y("bold"),
					children: /* @__PURE__ */ i("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: /* @__PURE__ */ i("path", { d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" })
					})
				}),
				/* @__PURE__ */ i(o, {
					title: "Italic (⌘I)",
					onClick: () => v("italic"),
					active: y("italic"),
					children: /* @__PURE__ */ a("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [
							/* @__PURE__ */ i("line", {
								x1: "19",
								y1: "4",
								x2: "10",
								y2: "4"
							}),
							/* @__PURE__ */ i("line", {
								x1: "14",
								y1: "20",
								x2: "5",
								y2: "20"
							}),
							/* @__PURE__ */ i("line", {
								x1: "15",
								y1: "4",
								x2: "9",
								y2: "20"
							})
						]
					})
				}),
				/* @__PURE__ */ i(o, {
					title: "Underline (⌘U)",
					onClick: () => v("underline"),
					active: y("underline"),
					children: /* @__PURE__ */ a("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ i("path", { d: "M6 4v6a6 6 0 0 0 12 0V4" }), /* @__PURE__ */ i("line", {
							x1: "4",
							y1: "20",
							x2: "20",
							y2: "20"
						})]
					})
				}),
				/* @__PURE__ */ i(o, {
					title: "Strikethrough",
					onClick: () => v("strikeThrough"),
					active: y("strikeThrough"),
					children: /* @__PURE__ */ a("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ i("path", { d: "M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6" }), /* @__PURE__ */ i("line", {
							x1: "4",
							y1: "12",
							x2: "20",
							y2: "12"
						})]
					})
				}),
				/* @__PURE__ */ i(s, {}),
				/* @__PURE__ */ i(o, {
					title: "Heading 1",
					onClick: () => v("formatBlock", "<h1>"),
					children: /* @__PURE__ */ i("span", {
						className: "text-[11px] font-bold",
						children: "H1"
					})
				}),
				/* @__PURE__ */ i(o, {
					title: "Heading 2",
					onClick: () => v("formatBlock", "<h2>"),
					children: /* @__PURE__ */ i("span", {
						className: "text-[11px] font-bold",
						children: "H2"
					})
				}),
				/* @__PURE__ */ i(o, {
					title: "Paragraph",
					onClick: () => v("formatBlock", "<p>"),
					children: /* @__PURE__ */ i("span", {
						className: "text-[11px] font-medium",
						children: "P"
					})
				}),
				/* @__PURE__ */ i(s, {}),
				/* @__PURE__ */ i(o, {
					title: "Bullet list",
					onClick: () => v("insertUnorderedList"),
					active: y("insertUnorderedList"),
					children: /* @__PURE__ */ a("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [
							/* @__PURE__ */ i("line", {
								x1: "9",
								y1: "6",
								x2: "20",
								y2: "6"
							}),
							/* @__PURE__ */ i("line", {
								x1: "9",
								y1: "12",
								x2: "20",
								y2: "12"
							}),
							/* @__PURE__ */ i("line", {
								x1: "9",
								y1: "18",
								x2: "20",
								y2: "18"
							}),
							/* @__PURE__ */ i("circle", {
								cx: "4",
								cy: "6",
								r: "1.5",
								fill: "currentColor",
								stroke: "none"
							}),
							/* @__PURE__ */ i("circle", {
								cx: "4",
								cy: "12",
								r: "1.5",
								fill: "currentColor",
								stroke: "none"
							}),
							/* @__PURE__ */ i("circle", {
								cx: "4",
								cy: "18",
								r: "1.5",
								fill: "currentColor",
								stroke: "none"
							})
						]
					})
				}),
				/* @__PURE__ */ i(o, {
					title: "Ordered list",
					onClick: () => v("insertOrderedList"),
					active: y("insertOrderedList"),
					children: /* @__PURE__ */ a("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [
							/* @__PURE__ */ i("line", {
								x1: "10",
								y1: "6",
								x2: "21",
								y2: "6"
							}),
							/* @__PURE__ */ i("line", {
								x1: "10",
								y1: "12",
								x2: "21",
								y2: "12"
							}),
							/* @__PURE__ */ i("line", {
								x1: "10",
								y1: "18",
								x2: "21",
								y2: "18"
							}),
							/* @__PURE__ */ i("path", { d: "M4 6h1v4" }),
							/* @__PURE__ */ i("path", { d: "M4 10h2" }),
							/* @__PURE__ */ i("path", { d: "M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" })
						]
					})
				}),
				/* @__PURE__ */ i(o, {
					title: "Blockquote",
					onClick: () => v("formatBlock", "<blockquote>"),
					children: /* @__PURE__ */ a("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ i("path", { d: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" }), /* @__PURE__ */ i("path", { d: "M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" })]
					})
				}),
				/* @__PURE__ */ i(s, {}),
				/* @__PURE__ */ i(o, {
					title: "Undo (⌘Z)",
					onClick: () => v("undo"),
					children: /* @__PURE__ */ a("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ i("path", { d: "M3 7v6h6" }), /* @__PURE__ */ i("path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" })]
					})
				}),
				/* @__PURE__ */ i(o, {
					title: "Redo (⌘⇧Z)",
					onClick: () => v("redo"),
					children: /* @__PURE__ */ a("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ i("path", { d: "M21 7v6h-6" }), /* @__PURE__ */ i("path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" })]
					})
				}),
				/* @__PURE__ */ i(o, {
					title: "Clear formatting",
					onClick: () => v("removeFormat"),
					children: /* @__PURE__ */ a("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [
							/* @__PURE__ */ i("path", { d: "M4 7V4h16v3" }),
							/* @__PURE__ */ i("path", { d: "M5 20h6" }),
							/* @__PURE__ */ i("path", { d: "M13 4 8 20" }),
							/* @__PURE__ */ i("line", {
								x1: "3",
								y1: "3",
								x2: "21",
								y2: "21"
							})
						]
					})
				})
			]
		}), /* @__PURE__ */ a("div", {
			className: "relative",
			children: [/* @__PURE__ */ i("div", {
				ref: h,
				contentEditable: !0,
				suppressContentEditableWarning: !0,
				onInput: _,
				onBlur: _,
				style: { minHeight: p },
				className: e("px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none", "prose prose-sm max-w-none", "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:text-gray-900 dark:[&_h1]:text-white", "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-1.5 [&_h2]:text-gray-900 dark:[&_h2]:text-white", "[&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2", "[&_blockquote]:border-l-2 [&_blockquote]:border-accent-400 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic")
			}), !c && /* @__PURE__ */ i("div", {
				className: "pointer-events-none absolute top-3 left-4 text-sm text-slate-400 dark:text-slate-600 select-none",
				"aria-hidden": !0,
				children: d
			})]
		})]
	});
}
//#endregion
export { u as RichTextEditor };

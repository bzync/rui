"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { useRef as t, useState as n } from "react";
import { Fragment as r, jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/components/code.tsx
var o = {
	js: /* @__PURE__ */ "const.let.var.function.return.if.else.for.while.class.import.export.default.from.async.await.new.typeof.instanceof.true.false.null.undefined.throw.try.catch.finally.switch.case.break.continue.extends.super.this.of.in.delete.void".split("."),
	python: /* @__PURE__ */ "def.return.if.else.elif.for.while.class.import.from.as.with.try.except.finally.raise.pass.break.continue.and.or.not.in.is.True.False.None.lambda.yield.global.nonlocal.del.print.async.await".split("."),
	bash: [
		"if",
		"then",
		"else",
		"elif",
		"fi",
		"for",
		"do",
		"done",
		"while",
		"case",
		"esac",
		"in",
		"function",
		"return",
		"exit",
		"echo",
		"export",
		"source",
		"local",
		"readonly"
	],
	sql: /* @__PURE__ */ "SELECT.FROM.WHERE.AND.OR.NOT.INSERT.INTO.VALUES.UPDATE.SET.DELETE.CREATE.TABLE.DROP.ALTER.INDEX.JOIN.INNER.LEFT.RIGHT.ON.GROUP.BY.ORDER.HAVING.LIMIT.OFFSET.AS.DISTINCT.COUNT.SUM.AVG.MAX.MIN.NULL.IS.IN.LIKE.BETWEEN.EXISTS".split(".")
};
o.ts = o.js, o.tsx = o.js, o.jsx = o.js, o.json = [];
function s(e, t) {
	let n = new Set(o[t.toLowerCase()] ?? o.js), r = [], i = 0;
	for (; i < e.length;) {
		if (t === "bash" && e[i] === "#" || e.slice(i, i + 2) === "//" && t !== "bash") {
			let t = e.indexOf("\n", i), n = t === -1 ? e.slice(i) : e.slice(i, t);
			r.push({
				type: "comment",
				value: n
			}), i += n.length;
			continue;
		}
		if (e.slice(i, i + 2) === "/*") {
			let t = e.indexOf("*/", i + 2), n = t === -1 ? e.slice(i) : e.slice(i, t + 2);
			r.push({
				type: "comment",
				value: n
			}), i += n.length;
			continue;
		}
		if (e[i] === "#" && (t === "python" || t === "sql")) {
			let t = e.indexOf("\n", i), n = t === -1 ? e.slice(i) : e.slice(i, t);
			r.push({
				type: "comment",
				value: n
			}), i += n.length;
			continue;
		}
		if (e[i] === "\"" || e[i] === "'" || e[i] === "`") {
			let t = e[i], n = i + 1;
			for (; n < e.length;) {
				if (e[n] === "\\" && n + 1 < e.length) {
					n += 2;
					continue;
				}
				if (e[n] === t) {
					n++;
					break;
				}
				n++;
			}
			r.push({
				type: "string",
				value: e.slice(i, n)
			}), i = n;
			continue;
		}
		if (/[0-9]/.test(e[i]) || e[i] === "." && /[0-9]/.test(e[i + 1] ?? "")) {
			let t = i;
			for (; t < e.length && /[0-9._xXa-fA-F]/.test(e[t]);) t++;
			r.push({
				type: "number",
				value: e.slice(i, t)
			}), i = t;
			continue;
		}
		if (/[a-zA-Z_$]/.test(e[i])) {
			let t = i;
			for (; t < e.length && /[a-zA-Z0-9_$]/.test(e[t]);) t++;
			let a = e.slice(i, t);
			r.push({
				type: n.has(a) ? "keyword" : "plain",
				value: a
			}), i = t;
			continue;
		}
		if (/[=<>!&|+\-*/%^~?:,;.()[\]{}]/.test(e[i])) {
			r.push({
				type: "operator",
				value: e[i]
			}), i++;
			continue;
		}
		r.push({
			type: "plain",
			value: e[i]
		}), i++;
	}
	return r;
}
var c = {
	keyword: "text-violet-500 dark:text-violet-400",
	string: "text-emerald-600 dark:text-emerald-400",
	comment: "text-slate-400 dark:text-slate-500 italic",
	number: "text-amber-600 dark:text-amber-400",
	operator: "text-slate-500 dark:text-slate-400",
	builtin: "text-sky-500 dark:text-sky-400",
	plain: "text-slate-800 dark:text-slate-200"
};
function l({ code: t, language: o = "js", filename: l, showLineNumbers: u = !1, className: d }) {
	let [f, p] = n(!1), m = t.replace(/^\n/, "").replace(/\n$/, ""), h = m.split("\n");
	async function g() {
		let e = !1;
		try {
			if (!navigator.clipboard?.writeText) throw Error("Clipboard API unavailable");
			await navigator.clipboard.writeText(m), e = !0;
		} catch {
			let t = document.createElement("textarea");
			t.value = m, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select(), e = document.execCommand("copy"), t.remove();
		}
		e && (p(!0), window.setTimeout(() => p(!1), 1500));
	}
	return /* @__PURE__ */ a("div", {
		className: e("group relative rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-[#0d1117]", d),
		children: [/* @__PURE__ */ a("div", {
			className: "flex items-center justify-between px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/3 dark:bg-white/3",
			children: [/* @__PURE__ */ i("div", {
				className: "flex items-center gap-2",
				children: l && /* @__PURE__ */ i("span", {
					className: "text-xs font-mono text-slate-500 dark:text-slate-400",
					children: l
				})
			}), /* @__PURE__ */ a("div", {
				className: "flex items-center gap-2",
				children: [!l && /* @__PURE__ */ i("span", {
					className: "text-xs font-mono text-slate-400 dark:text-slate-500 uppercase",
					children: o
				}), /* @__PURE__ */ i("button", {
					type: "button",
					onClick: g,
					"aria-label": f ? "Copied code" : "Copy code",
					className: "h-6 px-2 flex items-center gap-1 rounded text-xs text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/6 dark:hover:bg-white/8 transition-colors",
					children: f ? /* @__PURE__ */ a(r, { children: [/* @__PURE__ */ i("svg", {
						width: "11",
						height: "11",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: /* @__PURE__ */ i("path", { d: "M20 6 9 17l-5-5" })
					}), "Copied"] }) : /* @__PURE__ */ a(r, { children: [/* @__PURE__ */ a("svg", {
						width: "11",
						height: "11",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ i("rect", {
							width: "14",
							height: "14",
							x: "8",
							y: "8",
							rx: "2",
							ry: "2"
						}), /* @__PURE__ */ i("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" })]
					}), "Copy"] })
				})]
			})]
		}), /* @__PURE__ */ i("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ i("table", {
				className: "w-full border-collapse text-sm font-mono leading-6",
				children: /* @__PURE__ */ i("tbody", { children: h.map((e, t) => /* @__PURE__ */ a("tr", {
					className: "hover:bg-black/3 dark:hover:bg-white/3",
					children: [u && /* @__PURE__ */ i("td", {
						className: "select-none w-10 pr-4 pl-4 text-right text-slate-400 dark:text-slate-600 border-r border-black/6 dark:border-white/6",
						children: t + 1
					}), /* @__PURE__ */ i("td", {
						className: "px-4 py-0 whitespace-pre",
						children: s(e, o).map((e, t) => /* @__PURE__ */ i("span", {
							className: c[e.type],
							children: e.value
						}, t))
					})]
				}, t)) })
			})
		})]
	});
}
function u({ children: t, className: n }) {
	return /* @__PURE__ */ i("code", {
		className: e("font-mono text-[0.85em] px-1.5 py-0.5 rounded-md bg-black/6 dark:bg-white/8 border border-black/[0.07] dark:border-white/[0.07] text-slate-700 dark:text-slate-300", n),
		children: t
	});
}
function d({ value: n, onChange: r, language: o = "js", placeholder: s = "// Start typing…", minRows: c = 6, maxRows: l = 24, readOnly: u = !1, className: d }) {
	let f = t(null), p = Math.min(l, Math.max(c, n.split("\n").length));
	function m(e) {
		let t = e.currentTarget, { selectionStart: i, selectionEnd: a } = t;
		if (e.key === "Tab") {
			e.preventDefault();
			let o = n.slice(0, i) + "  " + n.slice(a);
			r?.(o), requestAnimationFrame(() => {
				t.selectionStart = t.selectionEnd = i + 2;
			});
		}
		if (e.key === "Enter") {
			let o = n.lastIndexOf("\n", i - 1) + 1, s = n.slice(o).match(/^(\s*)/)?.[1] ?? "";
			e.preventDefault();
			let c = n.slice(0, i) + "\n" + s + n.slice(a);
			r?.(c), requestAnimationFrame(() => {
				t.selectionStart = t.selectionEnd = i + 1 + s.length;
			});
		}
		let o = {
			"(": ")",
			"[": "]",
			"{": "}",
			"\"": "\"",
			"'": "'",
			"`": "`"
		};
		if (o[e.key] && i === a) {
			e.preventDefault();
			let s = n.slice(0, i) + e.key + o[e.key] + n.slice(a);
			r?.(s), requestAnimationFrame(() => {
				t.selectionStart = t.selectionEnd = i + 1;
			});
		}
	}
	return /* @__PURE__ */ a("div", {
		className: e("relative rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-[#0d1117]", d),
		children: [/* @__PURE__ */ i("div", {
			className: "flex items-center gap-1.5 px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/3 dark:bg-white/3",
			children: /* @__PURE__ */ i("span", {
				className: "text-xs font-mono text-slate-400 dark:text-slate-500 uppercase",
				children: o
			})
		}), /* @__PURE__ */ a("div", {
			className: "relative flex",
			children: [/* @__PURE__ */ i("div", {
				className: "select-none shrink-0 py-3 px-3 text-right text-sm font-mono leading-6 text-slate-400 dark:text-slate-600 border-r border-black/6 dark:border-white/6 bg-black/2 dark:bg-black/20",
				"aria-hidden": !0,
				children: Array.from({ length: p }, (e, t) => /* @__PURE__ */ i("div", { children: t + 1 }, t))
			}), /* @__PURE__ */ i("textarea", {
				ref: f,
				value: n,
				onChange: (e) => r?.(e.target.value),
				onKeyDown: m,
				readOnly: u,
				placeholder: s,
				spellCheck: !1,
				rows: p,
				className: "flex-1 py-3 px-4 text-sm font-mono leading-6 bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none resize-none"
			})]
		})]
	});
}
//#endregion
export { l as CodeBlock, d as CodeEditor, u as InlineCode };

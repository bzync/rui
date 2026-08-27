"use client";
import { t as e } from "../cn-DpgY2leY.js";
import { useId as t, useRef as n, useState as r } from "react";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/components/otp-input.tsx
function o({ length: o = 6, value: s, onChange: c, onComplete: l, label: u, hint: d, error: f, disabled: p, className: m, masked: h = !1 }) {
	let g = t(), [_, v] = r(""), y = (s ?? _).split("").slice(0, o), b = n([]);
	function x(e) {
		s === void 0 && v(e), c?.(e), e.length === o && l?.(e);
	}
	function S(e, t) {
		if (!/^\d*$/.test(t)) return;
		let n = y.slice();
		n[e] = t.slice(-1), x(n.join("").slice(0, o)), t && e < o - 1 && b.current[e + 1]?.focus();
	}
	function C(e, t) {
		if (t.key === "Backspace") {
			if (y[e]) {
				let t = y.slice();
				t[e] = "", x(t.join(""));
			} else e > 0 && b.current[e - 1]?.focus();
		} else t.key === "ArrowLeft" && e > 0 ? b.current[e - 1]?.focus() : t.key === "ArrowRight" && e < o - 1 && b.current[e + 1]?.focus();
	}
	function w(e) {
		e.preventDefault();
		let t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, o);
		x(t), b.current[Math.min(t.length, o - 1)]?.focus();
	}
	return /* @__PURE__ */ a("div", {
		className: e("flex flex-col gap-1.5", m),
		children: [
			u && /* @__PURE__ */ i("label", {
				htmlFor: `${g}-0`,
				className: "text-sm font-medium text-slate-600 dark:text-slate-300",
				children: u
			}),
			/* @__PURE__ */ i("div", {
				className: "flex items-center gap-2",
				children: Array.from({ length: o }).map((t, n) => /* @__PURE__ */ i("input", {
					ref: (e) => {
						b.current[n] = e;
					},
					id: `${g}-${n}`,
					name: `${g}-${n}`,
					type: h ? "password" : "text",
					inputMode: "numeric",
					pattern: "\\d*",
					maxLength: 1,
					autoComplete: n === 0 ? "one-time-code" : "off",
					value: y[n] ?? "",
					disabled: p,
					onChange: (e) => S(n, e.target.value),
					onKeyDown: (e) => C(n, e),
					onPaste: w,
					onFocus: (e) => e.target.select(),
					className: e("w-10 h-12 text-center text-lg font-semibold rounded-lg border bg-black/4 dark:bg-white/4", "text-gray-900 dark:text-white outline-none transition-colors", "focus:ring-2 focus:ring-accent-500/30", f ? "border-red-500/40 focus:border-red-500/50" : "border-slate-300 dark:border-white/10 focus:border-accent-500/40", p && "opacity-50 cursor-not-allowed")
				}, n))
			}),
			f && /* @__PURE__ */ i("p", {
				className: "text-xs text-red-400",
				children: f
			}),
			d && !f && /* @__PURE__ */ i("p", {
				className: "text-xs text-slate-500",
				children: d
			})
		]
	});
}
//#endregion
export { o as OtpInput };

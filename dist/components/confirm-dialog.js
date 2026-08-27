"use client";
import { Button as e } from "./button.js";
import { Modal as t } from "./modal.js";
import { jsx as n, jsxs as r } from "react/jsx-runtime";
//#region src/components/confirm-dialog.tsx
function i({ open: i, onClose: a, onConfirm: o, title: s = "Are you sure?", description: c, confirmLabel: l = "Confirm", cancelLabel: u = "Cancel", destructive: d = !1, loading: f = !1, icon: p }) {
	return /* @__PURE__ */ r(t, {
		open: i,
		onClose: a,
		size: "sm",
		title: s,
		description: typeof c == "string" ? c : void 0,
		icon: p ?? (d ? /* @__PURE__ */ r("svg", {
			width: "20",
			height: "20",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.75",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: "text-red-600 dark:text-red-400",
			children: [
				/* @__PURE__ */ n("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }),
				/* @__PURE__ */ n("path", { d: "M12 9v4" }),
				/* @__PURE__ */ n("path", { d: "M12 17h.01" })
			]
		}) : /* @__PURE__ */ r("svg", {
			width: "20",
			height: "20",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.75",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: "text-info",
			children: [
				/* @__PURE__ */ n("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				/* @__PURE__ */ n("path", { d: "M12 16v-4" }),
				/* @__PURE__ */ n("path", { d: "M12 8h.01" })
			]
		})),
		children: [typeof c != "string" && c && /* @__PURE__ */ n("div", {
			className: "text-sm leading-relaxed text-slate-600 dark:text-slate-400",
			children: c
		}), /* @__PURE__ */ r("div", {
			className: "flex flex-wrap justify-end gap-2.5 pt-2",
			children: [/* @__PURE__ */ n(e, {
				variant: "ghost",
				onClick: a,
				disabled: f,
				children: u
			}), /* @__PURE__ */ n(e, {
				variant: d ? "destructive" : "primary",
				onClick: o,
				loading: f,
				autoFocus: !0,
				children: l
			})]
		})]
	});
}
//#endregion
export { i as ConfirmDialog };

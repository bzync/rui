import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t } from "react/jsx-runtime";
//#region src/components/kbd.tsx
function n({ keys: n, size: r = "sm", className: i, ...a }) {
	let o = Array.isArray(n) ? n : [n];
	return /* @__PURE__ */ t("span", {
		className: e("inline-flex items-center gap-0.5", i),
		...a,
		children: o.map((n, i) => /* @__PURE__ */ t("kbd", {
			className: e("inline-flex items-center justify-center font-mono font-medium rounded border", "bg-black/6 dark:bg-white/6 border-black/15 dark:border-white/15", "text-slate-600 dark:text-slate-400", r === "sm" ? "px-1.5 py-0.5 text-[10px] min-w-[18px] h-[18px]" : "px-2 py-1 text-xs min-w-[22px] h-[22px]"),
			children: n
		}, i))
	});
}
//#endregion
export { n as Kbd };

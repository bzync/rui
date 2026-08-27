import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t } from "react/jsx-runtime";
//#region src/components/table.tsx
function n({ className: n, containerClassName: r, scrollAreaClassName: i, density: a = "comfortable", children: o, ...s }) {
	return /* @__PURE__ */ t("div", {
		className: e("w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface", r),
		children: /* @__PURE__ */ t("div", {
			className: e("w-full overflow-x-auto overscroll-x-contain scrollbar-thin", i),
			children: /* @__PURE__ */ t("table", {
				"data-density": a,
				className: e("group/table w-full border-collapse text-sm", n),
				...s,
				children: o
			})
		})
	});
}
function r({ className: n, children: r, ...i }) {
	return /* @__PURE__ */ t("thead", {
		className: e("border-b border-border bg-surface-muted", n),
		...i,
		children: r
	});
}
function i({ className: n, children: r, ...i }) {
	return /* @__PURE__ */ t("tbody", {
		className: e("divide-y divide-border", n),
		...i,
		children: r
	});
}
function a({ className: n, children: r, ...i }) {
	return /* @__PURE__ */ t("tr", {
		className: e("transition-colors duration-100 hover:bg-surface-muted aria-selected:bg-accent-50/70 dark:aria-selected:bg-accent-500/10", n),
		...i,
		children: r
	});
}
function o({ className: n, children: r, ...i }) {
	return /* @__PURE__ */ t("th", {
		className: e("px-4 py-2.5 text-left text-xs font-medium text-muted-foreground whitespace-nowrap group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2", n),
		...i,
		children: r
	});
}
function s({ className: n, children: r, ...i }) {
	return /* @__PURE__ */ t("td", {
		className: e("px-4 py-3 text-sm text-foreground whitespace-nowrap group-data-[density=compact]/table:px-3 group-data-[density=compact]/table:py-2", n),
		...i,
		children: r
	});
}
//#endregion
export { n as Table, i as TableBody, s as TableCell, o as TableHead, r as TableHeader, a as TableRow };

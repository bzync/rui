import { t as e } from "../cn-DpgY2leY.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/components/list.tsx
function r({ divided: n = !0, className: r, children: i, ...a }) {
	return /* @__PURE__ */ t("ul", {
		className: e(n && "divide-y divide-black/8 dark:divide-white/8", r),
		...a,
		children: i
	});
}
function i({ icon: r, trailing: i, description: a, href: o, active: s, className: c, children: l, onClick: u, ...d }) {
	let f = /* @__PURE__ */ n("div", {
		className: e("flex items-center gap-3 px-3 py-2.5 transition-colors rounded-lg", (!!o || !!u) && "cursor-pointer hover:bg-black/4 dark:hover:bg-white/4", s && "bg-accent-500/8 text-accent-400"),
		children: [
			r && /* @__PURE__ */ t("span", {
				className: "shrink-0 text-slate-500 dark:text-slate-400",
				children: r
			}),
			/* @__PURE__ */ n("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ t("p", {
					className: e("text-sm font-medium truncate", s ? "text-accent-400" : "text-slate-700 dark:text-slate-200"),
					children: l
				}), a && /* @__PURE__ */ t("p", {
					className: "text-xs text-slate-500 mt-0.5 truncate",
					children: a
				})]
			}),
			i && /* @__PURE__ */ t("span", {
				className: "shrink-0 text-slate-500",
				children: i
			})
		]
	});
	return /* @__PURE__ */ t("li", {
		className: e(c),
		onClick: u,
		...d,
		children: o ? /* @__PURE__ */ t("a", {
			href: o,
			children: f
		}) : f
	});
}
//#endregion
export { r as List, i as ListItem };

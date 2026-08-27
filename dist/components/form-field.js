import { t as e } from "../cn-DpgY2leY.js";
import { o as t } from "../component-styles-Ce56hn9T.js";
import { Fragment as n, jsx as r, jsxs as i } from "react/jsx-runtime";
//#region src/components/form-field.tsx
function a({ label: a, hint: o, error: s, required: c, htmlFor: l, className: u, children: d, ...f }) {
	return /* @__PURE__ */ i("div", {
		className: e(t, u),
		...f,
		children: [
			a && /* @__PURE__ */ i("label", {
				htmlFor: l,
				className: e("flex items-center gap-1", "text-sm font-medium leading-5 text-foreground"),
				children: [a, c && /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("span", {
					"aria-hidden": "true",
					className: "text-destructive",
					children: "*"
				}), /* @__PURE__ */ r("span", {
					className: "sr-only",
					children: " (required)"
				})] })]
			}),
			d,
			s && /* @__PURE__ */ r("p", {
				"aria-live": "polite",
				className: "text-xs leading-5 text-destructive",
				children: s
			}),
			o && !s && /* @__PURE__ */ r("p", {
				className: "text-xs leading-5 text-muted-foreground",
				children: o
			})
		]
	});
}
//#endregion
export { a as FormField };

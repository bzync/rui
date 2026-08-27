import { t as e } from "../cn-DpgY2leY.js";
import { a as t } from "../component-styles-Ce56hn9T.js";
import { Fragment as n, jsx as r, jsxs as i } from "react/jsx-runtime";
//#region src/components/label.tsx
function a({ className: a, children: o, required: s, hint: c, ...l }) {
	return /* @__PURE__ */ i("label", {
		className: e("flex items-center gap-1.5 select-none", t, a),
		...l,
		children: [
			/* @__PURE__ */ r("span", { children: o }),
			s && /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("span", {
				"aria-hidden": "true",
				className: "text-destructive leading-none",
				children: "*"
			}), /* @__PURE__ */ r("span", {
				className: "sr-only",
				children: " (required)"
			})] }),
			c && /* @__PURE__ */ i("span", {
				className: "font-normal text-muted-foreground",
				children: [
					"(",
					c,
					")"
				]
			})
		]
	});
}
//#endregion
export { a as Label };

//#region src/constants/index.ts
var e = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), t = {
	Escape: "Escape",
	Enter: "Enter",
	Space: " ",
	ArrowUp: "ArrowUp",
	ArrowDown: "ArrowDown",
	ArrowLeft: "ArrowLeft",
	ArrowRight: "ArrowRight",
	Home: "Home",
	End: "End",
	Tab: "Tab"
}, n = {
	instant: 0,
	fast: 120,
	normal: 200,
	slow: 320
};
//#endregion
//#region src/utils/focus.ts
function r(t) {
	return Array.from(t.querySelectorAll(e)).filter((e) => !e.hidden && e.getAttribute("aria-hidden") !== "true");
}
function i(e, t) {
	if (t.key !== "Tab") return;
	let n = r(e);
	if (n.length === 0) {
		t.preventDefault(), e.focus();
		return;
	}
	let i = n[0], a = n[n.length - 1];
	t.shiftKey && document.activeElement === i ? (t.preventDefault(), a.focus()) : !t.shiftKey && document.activeElement === a && (t.preventDefault(), i.focus());
}
//#endregion
export { t as a, e as i, i as n, n as r, r as t };

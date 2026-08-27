import { useCallback as e, useLayoutEffect as t, useRef as n } from "react";
//#region src/hooks/use-event-callback.ts
function r(r) {
	let i = n(r);
	return t(() => {
		i.current = r;
	}), e(((...e) => i.current(...e)), []);
}
//#endregion
export { r as t };
